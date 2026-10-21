import type { Archive, PlannerData, Project } from '../types'
import { uid } from './id'
import { allSlots, byDay, isTaskDone, weekProgress } from './progress'
import { currentWeekStart, getToday, shiftWeek } from './week'

export type EndWeekMode = 'carry' | 'clear'

export function snapshotWeek(projects: Project[], weekStart: string, now = getToday()): Archive {
  const slots = allSlots(projects)
  // Recorded misses from moved slots, plus every slot still unfinished when the week ends.
  const missedCount = slots.reduce((n, s) => n + s.missed.length, 0) + slots.filter((s) => !s.done).length
  return {
    id: uid(),
    weekStart,
    endedAt: now.toISOString(),
    projects: structuredClone(projects),
    totals: weekProgress(projects),
    byDay: byDay(projects),
    missedCount,
  }
}

/** Keeps unfinished work: drops finished tasks and done slots, clears missed history. */
export const carryForward = (projects: Project[]): Project[] =>
  projects.map((p) => ({
    ...p,
    tasks: p.tasks
      .filter((t) => !isTaskDone(t))
      .map((t) => ({ ...t, done: false, slots: t.slots.filter((s) => !s.done).map((s) => ({ ...s, missed: [] })) })),
  }))

export function endWeek(data: PlannerData, mode: EndWeekMode, now = getToday()): PlannerData {
  const weekStart = data.weekStart ?? currentWeekStart(now)
  const next = shiftWeek(weekStart, 1)
  return {
    projects: mode === 'carry' ? carryForward(data.projects) : [],
    archives: [snapshotWeek(data.projects, weekStart, now), ...data.archives],
    weekStart: next === currentWeekStart(now) ? null : next,
  }
}
