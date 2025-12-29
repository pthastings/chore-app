import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Chore, TeamMember, Category, Priority } from './types'
import { sampleChores, sampleTeamMembers } from './sampleData'
import { getChoreInstancesForMonth } from './utils/recurrence'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Calendar } from './components/Calendar/Calendar'
import { ChoreList } from './components/ChoreList/ChoreList'
import { ChoreForm } from './components/ChoreForm/ChoreForm'
import { TeamManager } from './components/TeamManager/TeamManager'
import styles from './App.module.css'

type View = 'calendar' | 'team'

interface Filters {
  category: Category | 'all'
  priority: Priority | 'all'
  assigneeId: string | 'all'
}

function App() {
  const [chores, setChores] = useLocalStorage<Chore[]>('chores', sampleChores)
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('teamMembers', sampleTeamMembers)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [view, setView] = useState<View>('calendar')
  const [showChoreForm, setShowChoreForm] = useState(false)
  const [editingChore, setEditingChore] = useState<Chore | null>(null)
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    priority: 'all',
    assigneeId: 'all',
  })

  const choreInstances = getChoreInstancesForMonth(chores, currentDate)

  const filteredInstances = choreInstances.filter((instance) => {
    if (filters.category !== 'all' && instance.chore.category !== filters.category) {
      return false
    }
    if (filters.priority !== 'all' && instance.chore.priority !== filters.priority) {
      return false
    }
    if (filters.assigneeId !== 'all' && instance.chore.assigneeId !== filters.assigneeId) {
      return false
    }
    return true
  })

  const handleAddChore = (chore: Chore) => {
    setChores([...chores, chore])
    setShowChoreForm(false)
  }

  const handleUpdateChore = (updatedChore: Chore) => {
    setChores(chores.map((c) => (c.id === updatedChore.id ? updatedChore : c)))
    setEditingChore(null)
    setShowChoreForm(false)
  }

  const handleDeleteChore = (choreId: string) => {
    setChores(chores.filter((c) => c.id !== choreId))
  }

  const handleToggleComplete = (choreId: string, date: string) => {
    setChores(
      chores.map((chore) => {
        if (chore.id !== choreId) return chore
        const isCompleted = chore.completedDates.includes(date)
        return {
          ...chore,
          completedDates: isCompleted
            ? chore.completedDates.filter((d) => d !== date)
            : [...chore.completedDates, date],
        }
      })
    )
  }

  const handleAddTeamMember = (member: TeamMember) => {
    setTeamMembers([...teamMembers, member])
  }

  const handleRemoveTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== memberId))
    setChores(
      chores.map((chore) =>
        chore.assigneeId === memberId ? { ...chore, assigneeId: null } : chore
      )
    )
  }

  const handleEditChore = (chore: Chore) => {
    setEditingChore(chore)
    setShowChoreForm(true)
  }

  const handleNewChore = () => {
    setEditingChore(null)
    setShowChoreForm(true)
  }

  return (
    <div className={styles.app}>
      <Sidebar
        view={view}
        onViewChange={setView}
        filters={filters}
        onFiltersChange={setFilters}
        teamMembers={teamMembers}
        onNewChore={handleNewChore}
      />
      <main className={styles.main}>
        {view === 'calendar' ? (
          <>
            <Calendar
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              choreInstances={filteredInstances}
              teamMembers={teamMembers}
            />
            {selectedDate && (
              <ChoreList
                date={selectedDate}
                choreInstances={filteredInstances.filter((i) => i.date === selectedDate)}
                teamMembers={teamMembers}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditChore}
                onDelete={handleDeleteChore}
                onClose={() => setSelectedDate(null)}
              />
            )}
          </>
        ) : (
          <TeamManager
            teamMembers={teamMembers}
            onAdd={handleAddTeamMember}
            onRemove={handleRemoveTeamMember}
          />
        )}
      </main>
      {showChoreForm && (
        <ChoreForm
          chore={editingChore}
          teamMembers={teamMembers}
          onSave={editingChore ? handleUpdateChore : handleAddChore}
          onClose={() => {
            setShowChoreForm(false)
            setEditingChore(null)
          }}
          initialDate={selectedDate}
        />
      )}
    </div>
  )
}

export default App
