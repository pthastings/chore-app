import { useState } from 'react'
import { TeamMember } from '../../types'
import styles from './TeamManager.module.css'

interface TeamManagerProps {
  teamMembers: TeamMember[]
  onAdd: (member: TeamMember) => void
  onRemove: (memberId: string) => void
}

const generateId = () => Math.random().toString(36).substring(2, 11)

const colorOptions = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#FF9800',
  '#FF5722',
]

export function TeamManager({ teamMembers, onAdd, onRemove }: TeamManagerProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(colorOptions[0])
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAdd({
      id: generateId(),
      name: name.trim(),
      color,
    })

    setName('')
    setColor(colorOptions[0])
    setShowForm(false)
  }

  return (
    <div className={styles.teamManager}>
      <div className={styles.header}>
        <h2 className={styles.title}>Team Members</h2>
        {!showForm && (
          <button className={styles.addButton} onClick={() => setShowForm(true)}>
            + Add Member
          </button>
        )}
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Color</label>
            <div className={styles.colorPicker}>
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.colorOption} ${color === c ? styles.selected : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Add Member
            </button>
          </div>
        </form>
      )}

      {teamMembers.length === 0 ? (
        <p className={styles.empty}>No team members yet. Add someone to get started!</p>
      ) : (
        <ul className={styles.list}>
          {teamMembers.map((member) => (
            <li key={member.id} className={styles.member}>
              <div className={styles.memberInfo}>
                <span
                  className={styles.avatar}
                  style={{ backgroundColor: member.color }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </span>
                <span className={styles.memberName}>{member.name}</span>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => onRemove(member.id)}
                title="Remove member"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
