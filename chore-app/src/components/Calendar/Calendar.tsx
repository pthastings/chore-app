import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { ChoreInstance, TeamMember } from '../../types'
import styles from './Calendar.module.css'

interface CalendarProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  selectedDate: string | null
  onSelectDate: (date: string) => void
  choreInstances: ChoreInstance[]
  teamMembers: TeamMember[]
}

export function Calendar({
  currentDate,
  onDateChange,
  selectedDate,
  onSelectDate,
  choreInstances,
  teamMembers,
}: CalendarProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getChoresForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return choreInstances.filter((instance) => instance.date === dateStr)
  }

  const getMemberColor = (memberId: string | null) => {
    if (!memberId) return '#999'
    const member = teamMembers.find((m) => m.id === memberId)
    return member?.color || '#999'
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          className={styles.navButton}
          onClick={() => onDateChange(subMonths(currentDate, 1))}
        >
          ←
        </button>
        <h2 className={styles.monthTitle}>{format(currentDate, 'MMMM yyyy')}</h2>
        <button
          className={styles.navButton}
          onClick={() => onDateChange(addMonths(currentDate, 1))}
        >
          →
        </button>
      </div>

      <div className={styles.weekDays}>
        {weekDays.map((day) => (
          <div key={day} className={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.days}>
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayChores = getChoresForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isSelected = selectedDate === dateStr
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={dateStr}
              className={`${styles.day} ${!isCurrentMonth ? styles.otherMonth : ''} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
              onClick={() => onSelectDate(dateStr)}
            >
              <span className={styles.dayNumber}>{format(day, 'd')}</span>
              <div className={styles.choreIndicators}>
                {dayChores.slice(0, 3).map((instance, idx) => (
                  <div
                    key={`${instance.chore.id}-${idx}`}
                    className={`${styles.choreIndicator} ${instance.isCompleted ? styles.completed : ''}`}
                    style={{ backgroundColor: getMemberColor(instance.chore.assigneeId) }}
                    title={instance.chore.title}
                  />
                ))}
                {dayChores.length > 3 && (
                  <span className={styles.moreIndicator}>+{dayChores.length - 3}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
