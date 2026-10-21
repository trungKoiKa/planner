import { parseISO } from 'date-fns'
import { describe, expect, it } from 'vitest'
import type { PlannerData } from '../types'
import { endWeek } from './endWeek'
import { parsePlan, serializePlan } from './planText'

const now = parseISO('2026-10-25T20:00')
const data = (): PlannerData => ({
  weekStart: null,
  archives: [],
  projects: [
    {
      id: 'p1',
      title: 'Math',
      deadline: null,
      tasks: [
        {
          id: 't1', title: 'Read', done: false, deadline: null, desc: '',
          slots: [
            { id: 's1', day: 'mon', done: true, desc: '', missed: [] },
            { id: 's2', day: 'wed', done: false, desc: 'p. 20', missed: ['2026-10-20'] },
          ],
        },
        { id: 't2', title: 'Quiz', done: true, deadline: null, desc: '', slots: [{ id: 's3', day: 'fri', done: true, desc: '', missed: [] }] },
      ],
    },
  ],
})

describe('endWeek', () => {
  it('archives a snapshot and carries unfinished work forward', () => {
    const out = endWeek(data(), 'carry', now)
    expect(out.archives).toHaveLength(1)
    expect(out.archives[0].weekStart).toBe('2026-10-19')
    expect(out.archives[0].totals).toEqual({ done: 2, total: 3 })
    expect(out.archives[0].byDay.wed).toEqual({ done: 0, total: 1 })
    expect(out.archives[0].missedCount).toBe(2)
    expect(out.projects[0].tasks.map((t) => t.title)).toEqual(['Read'])
    expect(out.projects[0].tasks[0].slots).toEqual([{ id: 's2', day: 'wed', done: false, desc: 'p. 20', missed: [] }])
    expect(out.weekStart).toBe('2026-10-26')
  })

  it('clears everything', () => {
    const out = endWeek(data(), 'clear', now)
    expect(out.projects).toEqual([])
    expect(out.archives[0].projects[0].tasks).toHaveLength(2)
  })
})

describe('plan text', () => {
  it('round-trips with fresh ids', () => {
    const src = data().projects
    const parsed = parsePlan(serializePlan(src), false)
    expect(parsed[0].title).toBe('Math')
    expect(parsed[0].id).not.toBe('p1')
    expect(parsed[0].tasks[0].slots.map((s) => [s.day, s.done, s.desc])).toEqual([
      ['mon', true, ''],
      ['wed', false, 'p. 20'],
    ])
  })

  it('resets checkmarks when asked', () => {
    const parsed = parsePlan(serializePlan(data().projects), true)
    expect(parsed.flatMap((p) => p.tasks.flatMap((t) => t.slots)).every((s) => !s.done && s.missed.length === 0)).toBe(true)
    expect(parsed[0].tasks[1].done).toBe(false)
  })

  it('accepts bare JSON and rejects junk', () => {
    expect(parsePlan(JSON.stringify([{ title: 'X', tasks: [] }]), false)[0].title).toBe('X')
    expect(() => parsePlan('hello', false)).toThrow()
    expect(() => parsePlan('{"foo":1}', false)).toThrow()
  })
})
