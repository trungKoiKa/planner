import { format } from 'date-fns'
import { dayProgress, entriesForDay, fmtTally } from '../lib/progress'
import { DAY_LABEL, dateOf, getToday, isMissed, todayDay, weekOffset } from '../lib/week'
import type { Day, Project } from '../types'
import MoveMenu from './MoveMenu'
import SlotCard from './SlotCard'

interface Props {
  projects: Project[]
  day: Day
  weekStart: string
  compact?: boolean
}

export default function DayPanel({ projects, day, weekStart, compact }: Props) {
  const entries = entriesForDay(projects, day)
  const prog = dayProgress(projects, day)
  const isToday = weekOffset(weekStart) === 0 && todayDay() === day
  const today = getToday()

  return (
    <div className="card day-panel">
      <div className="day-panel-head">
        <span className="label strong">
          {DAY_LABEL[day]} <span className="muted">· {format(dateOf(weekStart, day), 'MMM d')}{isToday ? ' · today' : ''}</span>
        </span>
        <span className="mono muted">{prog.total ? fmtTally(prog) : '–'}</span>
      </div>
      <div className="slot-list">
        {entries.length === 0 && <div className="empty-day">{compact ? '–' : 'Nothing planned for this day.'}</div>}
        {entries.map((e) => {
          const missed = isMissed(e.slot, weekStart, today)
          return (
            <SlotCard
              key={e.slot.id}
              entry={e}
              missed={missed}
              side={missed ? <MoveMenu entry={e} weekStart={weekStart} /> : null}
            />
          )
        })}
      </div>
    </div>
  )
}
