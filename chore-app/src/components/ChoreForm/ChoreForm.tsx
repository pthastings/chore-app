import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Chore, TeamMember, Category, Priority, RecurrenceType } from '../../types'
import styles from './ChoreForm.module.css'

interface ChoreFormProps {
  chore: Chore | null
  teamMembers: TeamMember[]
  onSave: (chore: Chore) => void
  onClose: () => void
  initialDate: string | null
}

const generateId = () => Math.random().toString(36).substring(2, 11)

export function ChoreForm({
  chore,
  teamMembers,
  onSave,
  onClose,
  initialDate,
}: ChoreFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [category, setCategory] = useState<Category>('other')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none')
  const [recurrenceInterval, setRecurrenceInterval] = useState(1)
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (chore) {
      setTitle(chore.title)
      setDescription(chore.description)
      setAssigneeId(chore.assigneeId || '')
      setCategory(chore.category)
      setPriority(chore.priority)
      setDueDate(chore.dueDate)
      setRecurrenceType(chore.recurrence.type)
      setRecurrenceInterval(chore.recurrence.interval)
      setDaysOfWeek(chore.recurrence.daysOfWeek)
      setEndDate(chore.recurrence.endDate || '')
    } else {
      setDueDate(initialDate || format(new Date(), 'yyyy-MM-dd'))
    }
  }, [chore, initialDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !dueDate) return

    const newChore: Chore = {
      id: chore?.id || generateId(),
      title: title.trim(),
      description: description.trim(),
      assigneeId: assigneeId || null,
      category,
      priority,
      dueDate,
      recurrence: {
        type: recurrenceType,
        interval: recurrenceInterval,
        daysOfWeek,
        endDate: endDate || null,
      },
      completedDates: chore?.completedDates || [],
      createdAt: chore?.createdAt || new Date().toISOString(),
    }

    onSave(newChore)
  }

  const toggleDayOfWeek = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{chore ? 'Edit Chore' : 'New Chore'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Title *</label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chore title"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select
                className={styles.select}
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                <option value="cleaning">Cleaning</option>
                <option value="admin">Admin</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Priority</label>
              <select
                className={styles.select}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Due Date *</label>
              <input
                type="date"
                className={styles.input}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Assignee</label>
              <select
                className={styles.select}
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Recurrence</label>
            <select
              className={styles.select}
              value={recurrenceType}
              onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
            >
              <option value="none">No Recurrence</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {recurrenceType !== 'none' && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>
                  Repeat every {recurrenceInterval} {recurrenceType === 'daily' ? 'day(s)' : 'week(s)'}
                </label>
                <input
                  type="number"
                  className={styles.input}
                  min={1}
                  max={30}
                  value={recurrenceInterval}
                  onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                />
              </div>

              {recurrenceType === 'weekly' && (
                <div className={styles.field}>
                  <label className={styles.label}>Days of Week</label>
                  <div className={styles.daysOfWeek}>
                    {weekDayLabels.map((label, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`${styles.dayButton} ${daysOfWeek.includes(index) ? styles.active : ''}`}
                        onClick={() => toggleDayOfWeek(index)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>End Date (optional)</label>
                <input
                  type="date"
                  className={styles.input}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              {chore ? 'Update' : 'Create'} Chore
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
