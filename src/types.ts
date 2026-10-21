export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type Day = (typeof DAYS)[number]

export interface Slot {
  id: string
  day: Day
  done: boolean
  desc: string
  /** ISO dates on which this slot was recorded as missed before being moved */
  missed: string[]
}

export interface Task {
  id: string
  title: string
  done: boolean
  deadline: string | null
  desc: string
  slots: Slot[]
}

export interface Project {
  id: string
  title: string
  deadline: string | null
  tasks: Task[]
}

export interface Tally {
  done: number
  total: number
}

export interface Archive {
  id: string
  weekStart: string
  endedAt: string
  projects: Project[]
  totals: Tally
  byDay: Record<Day, Tally>
  missedCount: number
}

export interface PlannerData {
  projects: Project[]
  archives: Archive[]
  /** Monday (yyyy-MM-dd) of the week being planned; null = current week */
  weekStart: string | null
}
