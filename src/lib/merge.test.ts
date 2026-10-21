import { describe, expect, it } from 'vitest'
import type { Archive, PlannerData, Project } from '../types'
import { mergeData } from './merge'

const p = (id: string, title = id): Project => ({ id, title, deadline: null, tasks: [] })
const a = (id: string, weekStart: string) => ({ id, weekStart }) as Archive
const data = (projects: Project[], archives: Archive[] = [], weekStart: string | null = null): PlannerData => ({ projects, archives, weekStart })

describe('mergeData', () => {
  it('uses whichever side has content', () => {
    expect(mergeData(data([p('a')]), null).projects).toHaveLength(1)
    expect(mergeData(data([]), data([p('b')])).projects[0].id).toBe('b')
  })

  it('unions by id with the server winning clashes', () => {
    const out = mergeData(
      data([p('a', 'local'), p('c')], [a('x', '2026-10-05')]),
      data([p('a', 'server'), p('b')], [a('y', '2026-10-12')], '2026-10-26'),
    )
    expect(out.projects.map((x) => `${x.id}:${x.title}`)).toEqual(['a:server', 'b:b', 'c:c'])
    expect(out.archives.map((x) => x.id)).toEqual(['y', 'x'])
    expect(out.weekStart).toBe('2026-10-26')
  })
})
