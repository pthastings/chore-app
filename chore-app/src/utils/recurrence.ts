import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  parseISO,
  addDays,

  getDay,
  isAfter,
  isBefore,
  isSameDay,
} from 'date-fns'
import { Chore, ChoreInstance } from '../types'

export function getChoreInstancesForMonth(
  chores: Chore[],
  monthDate: Date
): ChoreInstance[] {
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const instances: ChoreInstance[] = []

  for (const chore of chores) {
    const choreStart = parseISO(chore.dueDate)
    const choreEnd = chore.recurrence.endDate ? parseISO(chore.recurrence.endDate) : null

    if (chore.recurrence.type === 'none') {
      const choreDate = parseISO(chore.dueDate)
      if (
        (isSameDay(choreDate, monthStart) || isAfter(choreDate, monthStart)) &&
        (isSameDay(choreDate, monthEnd) || isBefore(choreDate, monthEnd))
      ) {
        const dateStr = format(choreDate, 'yyyy-MM-dd')
        instances.push({
          chore,
          date: dateStr,
          isCompleted: chore.completedDates.includes(dateStr),
        })
      }
    } else {
      const dates = generateRecurringDates(
        chore,
        monthStart,
        monthEnd,
        choreStart,
        choreEnd
      )
      for (const date of dates) {
        const dateStr = format(date, 'yyyy-MM-dd')
        instances.push({
          chore,
          date: dateStr,
          isCompleted: chore.completedDates.includes(dateStr),
        })
      }
    }
  }

  return instances
}

function generateRecurringDates(
  chore: Chore,
  rangeStart: Date,
  rangeEnd: Date,
  choreStart: Date,
  choreEnd: Date | null
): Date[] {
  const dates: Date[] = []
  const { type, interval, daysOfWeek } = chore.recurrence

  const effectiveStart = isAfter(rangeStart, choreStart) ? rangeStart : choreStart
  const effectiveEnd = choreEnd && isBefore(choreEnd, rangeEnd) ? choreEnd : rangeEnd

  if (isAfter(effectiveStart, effectiveEnd)) {
    return dates
  }

  if (type === 'daily') {
    let currentDate = choreStart
    while (isBefore(currentDate, effectiveStart) || isSameDay(currentDate, effectiveStart)) {
      if (isSameDay(currentDate, effectiveStart) || isAfter(currentDate, effectiveStart)) {
        break
      }
      currentDate = addDays(currentDate, interval)
    }

    while (isBefore(currentDate, effectiveEnd) || isSameDay(currentDate, effectiveEnd)) {
      if (
        (isSameDay(currentDate, effectiveStart) || isAfter(currentDate, effectiveStart)) &&
        (isSameDay(currentDate, effectiveEnd) || isBefore(currentDate, effectiveEnd))
      ) {
        dates.push(currentDate)
      }
      currentDate = addDays(currentDate, interval)
    }
  } else if (type === 'weekly') {
    const allDaysInRange = eachDayOfInterval({ start: effectiveStart, end: effectiveEnd })

    for (const day of allDaysInRange) {
      const dayOfWeek = getDay(day)
      if (daysOfWeek.includes(dayOfWeek)) {
        if (
          (isSameDay(day, choreStart) || isAfter(day, choreStart)) &&
          (!choreEnd || isSameDay(day, choreEnd) || isBefore(day, choreEnd))
        ) {
          const weeksSinceStart = Math.floor(
            (day.getTime() - choreStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
          )
          if (weeksSinceStart % interval === 0 || interval === 1) {
            dates.push(day)
          }
        }
      }
    }
  }

  return dates
}

export function getNextOccurrence(chore: Chore, afterDate: Date): Date | null {
  if (chore.recurrence.type === 'none') {
    const dueDate = parseISO(chore.dueDate)
    return isAfter(dueDate, afterDate) ? dueDate : null
  }

  const { type, interval, daysOfWeek, endDate } = chore.recurrence
  const choreStart = parseISO(chore.dueDate)
  const choreEnd = endDate ? parseISO(endDate) : null

  let currentDate = isAfter(afterDate, choreStart) ? afterDate : choreStart

  for (let i = 0; i < 365; i++) {
    currentDate = addDays(currentDate, 1)

    if (choreEnd && isAfter(currentDate, choreEnd)) {
      return null
    }

    if (type === 'daily') {
      const daysSinceStart = Math.floor(
        (currentDate.getTime() - choreStart.getTime()) / (24 * 60 * 60 * 1000)
      )
      if (daysSinceStart % interval === 0) {
        return currentDate
      }
    } else if (type === 'weekly') {
      const dayOfWeek = getDay(currentDate)
      if (daysOfWeek.includes(dayOfWeek)) {
        return currentDate
      }
    }
  }

  return null
}
