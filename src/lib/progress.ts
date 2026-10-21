import { DAYS, type Day, type Project, type Slot, type Tally, type Task } from '../types'

const tally = (slots: Slot[]): Tally => ({
  done: slots.filter((s) => s.done).length,
  total: slots.length,
})

export const allSlots = (projects: Project[]) => projects.flatMap((p) => p.tasks.flatMap((t) => t.slots))

export const weekProgress = (projects: Project[]) => tally(allSlots(projects))

export const projectProgress = (p: Project) => tally(p.tasks.flatMap((t) => t.slots))

export const taskProgress = (t: Task) => tally(t.slots)

export const dayProgress = (projects: Project[], day: Day) =>
  tally(allSlots(projects).filter((s) => s.day === day))

export const byDay = (projects: Project[]) =>
  Object.fromEntries(DAYS.map((d) => [d, dayProgress(projects, d)])) as Record<Day, Tally>

export const isTaskDone = (t: Task) => t.done || (t.slots.length > 0 && t.slots.every((s) => s.done))

export const pct = ({ done, total }: Tally) => (total === 0 ? 0 : Math.round((done / total) * 100))

export const fmtTally = (t: Tally) => `${t.done}/${t.total} · ${pct(t)}%`

export interface DayEntry {
  project: Project
  task: Task
  slot: Slot
}

/** Slots scheduled on a given day, with their parent task and project. */
export const entriesForDay = (projects: Project[], day: Day): DayEntry[] =>
  projects.flatMap((project) =>
    project.tasks.flatMap((task) =>
      task.slots.filter((s) => s.day === day).map((slot) => ({ project, task, slot })),
    ),
  )
