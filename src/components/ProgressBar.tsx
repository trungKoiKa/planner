import { pct } from '../lib/progress'
import type { Tally } from '../types'

export default function ProgressBar({ tally, good }: { tally: Tally; good?: boolean }) {
  return (
    <div className={`bar${good ? ' good' : ''}`} role="progressbar" aria-valuenow={pct(tally)} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${pct(tally)}%` }} />
    </div>
  )
}
