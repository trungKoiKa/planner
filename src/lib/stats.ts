import { DAYS, type Archive, type Day, type Tally } from '../types'
import { pct } from './progress'

/** 0 = nothing planned, 1–3 = increasing completion. */
export const heatLevel = (t: Tally): 0 | 1 | 2 | 3 => {
  if (t.total === 0) return 0
  const p = pct(t)
  return p >= 67 ? 3 : p >= 34 ? 2 : 1
}

const sum = (list: Tally[]): Tally => list.reduce((a, t) => ({ done: a.done + t.done, total: a.total + t.total }), { done: 0, total: 0 })

export function summarize(archives: Archive[]) {
  const weeks = archives.filter((a) => a.totals.total > 0)
  const overall = sum(archives.map((a) => a.totals))
  const best = weeks.reduce<Archive | null>((b, a) => (!b || pct(a.totals) > pct(b.totals) ? a : b), null)
  const byWeekday = Object.fromEntries(DAYS.map((d) => [d, sum(archives.map((a) => a.byDay[d]))])) as Record<Day, Tally>
  const missed = archives.reduce((n, a) => n + a.missedCount, 0)
  const avg = weeks.length ? Math.round(weeks.reduce((n, a) => n + pct(a.totals), 0) / weeks.length) : 0
  let streak = 0
  for (const a of archives) {
    if (a.totals.total > 0 && pct(a.totals) >= 80) streak++
    else break
  }
  return { overall, best, byWeekday, missed, avg, streak, weeks: archives.length }
}
