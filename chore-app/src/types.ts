export type Category = 'cleaning' | 'admin' | 'maintenance' | 'other';
export type Priority = 'low' | 'medium' | 'high';
export type RecurrenceType = 'none' | 'daily' | 'weekly';

export interface Recurrence {
  type: RecurrenceType;
  interval: number;
  daysOfWeek: number[];
  endDate: string | null;
}

export interface Chore {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  category: Category;
  priority: Priority;
  dueDate: string;
  recurrence: Recurrence;
  completedDates: string[];
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  color: string;
}

export interface AppData {
  chores: Chore[];
  teamMembers: TeamMember[];
}

export interface ChoreInstance {
  chore: Chore;
  date: string;
  isCompleted: boolean;
}
