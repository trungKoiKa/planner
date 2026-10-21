import { PLAN_PREFIX } from '../config'
import { DAYS, type Day, type Project, type Slot, type Task } from '../types'
import { uid } from './id'

export function serializePlan(projects: Project[]): string {
  return `${PLAN_PREFIX}\n${JSON.stringify({ projects }, null, 1)}`
}

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback)
const isDay = (v: unknown): v is Day => DAYS.includes(v as Day)

/**
 * Parses text produced by serializePlan (or bare JSON of the same shape).
 * Every item gets a fresh id so pasting the same plan twice never collides.
 */
export function parsePlan(text: string, resetChecks: boolean): Project[] {
  const body = text.trim().replace(new RegExp(`^${PLAN_PREFIX}\\s*`), '')
  const raw: unknown = JSON.parse(body)
  const list = Array.isArray(raw) ? raw : (raw as { projects?: unknown })?.projects
  if (!Array.isArray(list)) throw new Error('No projects found in pasted text.')

  return list.map((p): Project => ({
    id: uid(),
    title: str(p?.title),
    deadline: str(p?.deadline) || null,
    tasks: (Array.isArray(p?.tasks) ? p.tasks : []).map((t: Partial<Task>): Task => {
      const slots = (Array.isArray(t?.slots) ? t.slots : [])
        .filter((s: Partial<Slot>) => isDay(s?.day))
        .map((s: Partial<Slot>): Slot => ({
          id: uid(),
          day: s.day as Day,
          done: resetChecks ? false : !!s.done,
          desc: str(s.desc),
          missed: resetChecks || !Array.isArray(s.missed) ? [] : s.missed.filter((m) => typeof m === 'string'),
        }))
      return {
        id: uid(),
        title: str(t?.title, 'Untitled task'),
        done: resetChecks ? false : !!t?.done,
        deadline: str(t?.deadline) || null,
        desc: str(t?.desc),
        slots,
      }
    }),
  }))
}
