import { Category, Priority, TeamMember } from '../../types'
import styles from './Sidebar.module.css'

type View = 'calendar' | 'team'

interface Filters {
  category: Category | 'all'
  priority: Priority | 'all'
  assigneeId: string | 'all'
}

interface SidebarProps {
  view: View
  onViewChange: (view: View) => void
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  teamMembers: TeamMember[]
  onNewChore: () => void
}

export function Sidebar({
  view,
  onViewChange,
  filters,
  onFiltersChange,
  teamMembers,
  onNewChore,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>Office Chores</h1>
      </div>

      <button className={styles.newButton} onClick={onNewChore}>
        + New Chore
      </button>

      <nav className={styles.nav}>
        <button
          className={`${styles.navButton} ${view === 'calendar' ? styles.active : ''}`}
          onClick={() => onViewChange('calendar')}
        >
          Calendar
        </button>
        <button
          className={`${styles.navButton} ${view === 'team' ? styles.active : ''}`}
          onClick={() => onViewChange('team')}
        >
          Team
        </button>
      </nav>

      {view === 'calendar' && (
        <div className={styles.filters}>
          <h3 className={styles.filterTitle}>Filters</h3>

          <label className={styles.filterLabel}>
            Category
            <select
              className={styles.select}
              value={filters.category}
              onChange={(e) =>
                onFiltersChange({ ...filters, category: e.target.value as Category | 'all' })
              }
            >
              <option value="all">All Categories</option>
              <option value="cleaning">Cleaning</option>
              <option value="admin">Admin</option>
              <option value="maintenance">Maintenance</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className={styles.filterLabel}>
            Priority
            <select
              className={styles.select}
              value={filters.priority}
              onChange={(e) =>
                onFiltersChange({ ...filters, priority: e.target.value as Priority | 'all' })
              }
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>

          <label className={styles.filterLabel}>
            Assignee
            <select
              className={styles.select}
              value={filters.assigneeId}
              onChange={(e) => onFiltersChange({ ...filters, assigneeId: e.target.value })}
            >
              <option value="all">All Team Members</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </aside>
  )
}
