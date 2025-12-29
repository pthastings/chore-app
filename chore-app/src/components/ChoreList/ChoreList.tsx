import { format, parseISO } from 'date-fns'
import { ChoreInstance, TeamMember } from '../../types'
import styles from './ChoreList.module.css'

interface ChoreListProps {
  date: string
  choreInstances: ChoreInstance[]
  teamMembers: TeamMember[]
  onToggleComplete: (choreId: string, date: string) => void
  onEdit: (chore: ChoreInstance['chore']) => void
  onDelete: (choreId: string) => void
  onClose: () => void
}

const priorityLabels = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const categoryLabels = {
  cleaning: 'Cleaning',
  admin: 'Admin',
  maintenance: 'Maintenance',
  other: 'Other',
}

export function ChoreList({
  date,
  choreInstances,
  teamMembers,
  onToggleComplete,
  onEdit,
  onDelete,
  onClose,
}: ChoreListProps) {
  const getMember = (memberId: string | null) => {
    if (!memberId) return null
    return teamMembers.find((m) => m.id === memberId)
  }

  const formattedDate = format(parseISO(date), 'EEEE, MMMM d, yyyy')

  return (
    <div className={styles.choreList}>
      <div className={styles.header}>
        <h3 className={styles.title}>{formattedDate}</h3>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>

      {choreInstances.length === 0 ? (
        <p className={styles.empty}>No chores scheduled for this day.</p>
      ) : (
        <ul className={styles.list}>
          {choreInstances.map((instance) => {
            const member = getMember(instance.chore.assigneeId)
            return (
              <li key={instance.chore.id} className={styles.item}>
                <div className={styles.choreHeader}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={instance.isCompleted}
                      onChange={() => onToggleComplete(instance.chore.id, date)}
                    />
                    <span
                      className={`${styles.choreTitle} ${instance.isCompleted ? styles.completed : ''}`}
                    >
                      {instance.chore.title}
                    </span>
                  </label>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => onEdit(instance.chore)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => onDelete(instance.chore.id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {instance.chore.description && (
                  <p className={styles.description}>{instance.chore.description}</p>
                )}

                <div className={styles.meta}>
                  <span className={`${styles.priority} ${styles[instance.chore.priority]}`}>
                    {priorityLabels[instance.chore.priority]}
                  </span>
                  <span className={styles.category}>
                    {categoryLabels[instance.chore.category]}
                  </span>
                  {member && (
                    <span
                      className={styles.assignee}
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
