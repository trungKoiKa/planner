import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEY } from '../config'
import { uid } from '../lib/id'
import { currentWeekStart, dayIndex } from '../lib/week'
import type { Day, PlannerData, Project, Slot, Task } from '../types'

export interface PlannerState extends PlannerData {
  addProject: () => string
  updateProject: (id: string, patch: Partial<Omit<Project, 'id' | 'tasks'>>) => void
  deleteProject: (id: string) => void
  reorderProjects: (from: number, to: number) => void
  addTask: (projectId: string, title: string) => string
  updateTask: (projectId: string, taskId: string, patch: Partial<Omit<Task, 'id'>>) => void
  deleteTask: (projectId: string, taskId: string) => void
  reorderTasks: (projectId: string, from: number, to: number) => void
  toggleTask: (projectId: string, taskId: string) => void
  toggleSlot: (projectId: string, taskId: string, slotId: string) => void
  setWeekStart: (weekStart: string | null) => void
  replaceData: (data: PlannerData) => void
}

export const emptyData = (): PlannerData => ({ projects: [], archives: [], weekStart: null })

export const newSlot = (day: Day, desc = ''): Slot => ({ id: uid(), day, done: false, desc, missed: [] })

export const sortSlots = (slots: Slot[]) =>
  slots
    .map((s, i) => ({ s, i }))
    .sort((a, b) => dayIndex(a.s.day) - dayIndex(b.s.day) || a.i - b.i)
    .map(({ s }) => s)

export function move<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

/** Task.done mirrors its slots once it has any; tasks without slots keep a manual checkbox. */
const syncDone = (t: Task): Task => (t.slots.length ? { ...t, done: t.slots.every((s) => s.done) } : t)

export const selectWeekStart = (s: PlannerData) => s.weekStart ?? currentWeekStart()

export const usePlanner = create<PlannerState>()(
  persist(
    (set) => {
      const mapProject = (id: string, fn: (p: Project) => Project) =>
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? fn(p) : p)) }))
      const mapTask = (projectId: string, taskId: string, fn: (t: Task) => Task) =>
        mapProject(projectId, (p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === taskId ? fn(t) : t)) }))

      return {
        ...emptyData(),

        addProject: () => {
          const id = uid()
          set((s) => ({ projects: [...s.projects, { id, title: '', deadline: null, tasks: [] }] }))
          return id
        },
        updateProject: (id, patch) => mapProject(id, (p) => ({ ...p, ...patch })),
        deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
        reorderProjects: (from, to) => set((s) => ({ projects: move(s.projects, from, to) })),

        addTask: (projectId, title) => {
          const id = uid()
          mapProject(projectId, (p) => ({
            ...p,
            tasks: [...p.tasks, { id, title, done: false, deadline: null, desc: '', slots: [] }],
          }))
          return id
        },
        updateTask: (projectId, taskId, patch) =>
          mapTask(projectId, taskId, (t) => syncDone({ ...t, ...patch, slots: sortSlots(patch.slots ?? t.slots) })),
        deleteTask: (projectId, taskId) =>
          mapProject(projectId, (p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== taskId) })),
        reorderTasks: (projectId, from, to) => mapProject(projectId, (p) => ({ ...p, tasks: move(p.tasks, from, to) })),
        toggleTask: (projectId, taskId) =>
          mapTask(projectId, taskId, (t) => {
            const done = !t.done
            return { ...t, done, slots: t.slots.map((s) => ({ ...s, done })) }
          }),
        toggleSlot: (projectId, taskId, slotId) =>
          mapTask(projectId, taskId, (t) =>
            syncDone({ ...t, slots: t.slots.map((s) => (s.id === slotId ? { ...s, done: !s.done } : s)) }),
          ),

        setWeekStart: (weekStart) => set({ weekStart: weekStart === currentWeekStart() ? null : weekStart }),
        replaceData: (data) => set({ projects: data.projects, archives: data.archives, weekStart: data.weekStart }),
      }
    },
    {
      name: STORAGE_KEY,
      version: 1,
      partialize: (s): PlannerData => ({ projects: s.projects, archives: s.archives, weekStart: s.weekStart }),
    },
  ),
)
