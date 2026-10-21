import { describe, expect, it } from 'vitest'
import { dayProgress, entriesForDay, fmtTally, isTaskDone, projectProgress, taskProgress, weekProgress } from './progress'
import type { Project } from '../types'

const projects: Project[] = [
  {
    id: 'p1',
    title: 'Math',
    deadline: null,
    tasks: [
      {
        id: 't1',
        title: 'Read chapter 3',
        done: false,
        deadline: null,
        desc: '',
        slots: [
          { id: 's1', day: 'mon', done: true, desc: '', missed: [] },
          { id: 's2', day: 'wed', done: false, desc: '', missed: [] },
        ],
      },
      { id: 't2', title: 'Quiz', done: false, deadline: null, desc: '', slots: [{ id: 's3', day: 'wed', done: true, desc: '', missed: [] }] },
    ],
  },
]

describe('progress', () => {
  it('computes week, project, task and day tallies', () => {
    expect(weekProgress(projects)).toEqual({ done: 2, total: 3 })
    expect(projectProgress(projects[0])).toEqual({ done: 2, total: 3 })
    expect(taskProgress(projects[0].tasks[0])).toEqual({ done: 1, total: 2 })
    expect(dayProgress(projects, 'wed')).toEqual({ done: 1, total: 2 })
    expect(dayProgress(projects, 'fri')).toEqual({ done: 0, total: 0 })
  })

  it('formats tallies', () => {
    expect(fmtTally({ done: 1, total: 3 })).toBe('1/3 · 33%')
    expect(fmtTally({ done: 0, total: 0 })).toBe('0/0 · 0%')
  })

  it('knows when a task is done', () => {
    expect(isTaskDone(projects[0].tasks[0])).toBe(false)
    expect(isTaskDone(projects[0].tasks[1])).toBe(true)
  })

  it('lists entries for a day', () => {
    expect(entriesForDay(projects, 'wed').map((e) => e.slot.id)).toEqual(['s2', 's3'])
  })
})
