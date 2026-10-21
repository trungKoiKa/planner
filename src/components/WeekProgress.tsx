import { fmtTally, weekProgress } from '../lib/progress'
import type { Project } from '../types'
import ProgressBar from './ProgressBar'

export default function WeekProgress({ projects, onEndWeek }: { projects: Project[]; onEndWeek: () => void }) {
  const prog = weekProgress(projects)
  return (
    <div className="week-progress">
      <ProgressBar tally={prog} good={prog.total > 0 && prog.done === prog.total} />
      <span className="mono muted">{fmtTally(prog)}</span>
      <button className="btn" onClick={onEndWeek}>End week ↺</button>
    </div>
  )
}
