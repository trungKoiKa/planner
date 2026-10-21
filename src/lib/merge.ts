import type { PlannerData } from '../types'

const hasContent = (d: PlannerData | null | undefined) => !!d && (d.projects.length > 0 || d.archives.length > 0)

/**
 * Combines a guest board with the server copy on first sign-in.
 * Server items win on id clashes; guest-only projects and archives are appended.
 */
export function mergeData(local: PlannerData, remote: PlannerData | null): PlannerData {
  if (!hasContent(remote)) return local
  if (!hasContent(local)) return remote!
  const r = remote!
  const projectIds = new Set(r.projects.map((p) => p.id))
  const archiveIds = new Set(r.archives.map((a) => a.id))
  return {
    projects: [...r.projects, ...local.projects.filter((p) => !projectIds.has(p.id))],
    archives: [...r.archives, ...local.archives.filter((a) => !archiveIds.has(a.id))].sort((a, b) =>
      b.weekStart.localeCompare(a.weekStart),
    ),
    weekStart: r.weekStart ?? local.weekStart,
  }
}
