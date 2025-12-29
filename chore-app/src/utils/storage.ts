import { Chore, TeamMember } from '../types'

const CHORES_KEY = 'chores'
const TEAM_MEMBERS_KEY = 'teamMembers'

export function loadChores(): Chore[] {
  try {
    const data = localStorage.getItem(CHORES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveChores(chores: Chore[]): void {
  localStorage.setItem(CHORES_KEY, JSON.stringify(chores))
}

export function loadTeamMembers(): TeamMember[] {
  try {
    const data = localStorage.getItem(TEAM_MEMBERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveTeamMembers(members: TeamMember[]): void {
  localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(members))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

const COLORS = [
  '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63',
  '#00BCD4', '#FF5722', '#3F51B5', '#009688', '#FFC107',
]

export function getNextColor(existingMembers: TeamMember[]): string {
  const usedColors = new Set(existingMembers.map((m) => m.color))
  for (const color of COLORS) {
    if (!usedColors.has(color)) {
      return color
    }
  }
  return COLORS[existingMembers.length % COLORS.length]
}
