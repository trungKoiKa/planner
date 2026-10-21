import { describe, expect, it } from 'vitest'
import { DAYS, type Archive, type Day } from '../types'
import { heatLevel, summarize } from './stats'

const arch = (weekStart: string, done: number, total: number, missedCount = 0): Archive => ({
  id: weekStart,
  weekStart,
  endedAt: `${weekStart}T12:00:00.000Z`,
  projects: [],
  totals: { done, total },
  byDay: Object.fromEntries(DAYS.map((d) => [d, d === 'mon' ? { done, total } : { done: 0, total: 0 }])) as Record<Day, { done: number; total: number }>,
  missedCount,
})

describe('stats', () => {
  it('buckets completion into heat levels', () => {
    expect(heatLevel({ done: 0, total: 0 })).toBe(0)
    expect(heatLevel({ done: 0, total: 3 })).toBe(1)
    expect(heatLevel({ done: 1, total: 2 })).toBe(2)
    expect(heatLevel({ done: 3, total: 3 })).toBe(3)
  })

  it('summarizes archived weeks (newest first)', () => {
    const s = summarize([arch('2026-10-12', 9, 10, 1), arch('2026-10-05', 4, 5, 2), arch('2026-09-28', 1, 4, 3)])
    expect(s.weeks).toBe(3)
    expect(s.overall).toEqual({ done: 14, total: 19 })
    expect(s.best?.weekStart).toBe('2026-10-12')
    expect(s.avg).toBe(65)
    expect(s.streak).toBe(2)
    expect(s.missed).toBe(6)
    expect(s.byWeekday.mon).toEqual({ done: 14, total: 19 })
  })

  it('handles no archives', () => {
    const s = summarize([])
    expect(s).toMatchObject({ weeks: 0, avg: 0, streak: 0, best: null })
  })
})
