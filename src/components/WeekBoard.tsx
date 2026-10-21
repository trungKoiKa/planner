import { format } from 'date-fns'
import { entriesForDay } from '../lib/progress'
import { DAY_LABEL, dateOf, getToday, isMissed, todayDay, weekOffset } from '../lib/week'
import { useUI } from '../store/useUI'
import { DAYS, type Day, type Project } from '../types'
import DayPanel from './DayPanel'

interface Props {
  projects: Project[]
  weekStart: string
}

export default function WeekBoard({ projects, weekStart }: Props) {
  const { focusDay, showAll, setFocusDay, setShowAll } = useUI()
  const isThisWeek = weekOffset(weekStart) === 0
  const today = todayDay()
  const focus: Day = focusDay ?? (isThisWeek ? today : 'mon')
  const now = getToday()

  return (
    <section className="section">
      <div className="label strong">{isThisWeek ? 'This week' : 'Planned week'}</div>
      <div className="muted" style={{ marginTop: 2 }}>
        {showAll ? (
          <>Showing all days · <button className="link" onClick={() => setFocusDay(null)}>focus {isThisWeek ? 'today' : 'one day'}</button></>
        ) : (
          <>Focusing {DAY_LABEL[focus]}{isThisWeek && focus === today ? ' (today)' : ''} · <button className="link" onClick={() => setShowAll(true)}>show all days</button></>
        )}
      </div>

      {showAll ? (
        <div className="week-grid" style={{ marginTop: 12 }}>
          {DAYS.map((d) => <DayPanel key={d} projects={projects} day={d} weekStart={weekStart} compact />)}
        </div>
      ) : (
        <>
          <div className="day-strip" role="tablist" aria-label="Days of the week">
            {DAYS.map((d) => {
              const entries = entriesForDay(projects, d)
              const missed = entries.some((e) => isMissed(e.slot, weekStart, now))
              const cls = [
                'day-cell',
                d === focus && 'focus',
                isThisWeek && d === today && 'today',
              ].filter(Boolean).join(' ')
              return (
                <button key={d} role="tab" aria-selected={d === focus} className={cls} onClick={() => setFocusDay(d)}>
                  {DAY_LABEL[d]}
                  <span className="date">{format(dateOf(weekStart, d), 'd')}</span>
                  <span className="marks">
                    {missed && <span className="miss">!</span>}
                    {entries.length > 0 && '◦'}
                  </span>
                </button>
              )
            })}
          </div>
          <DayPanel projects={projects} day={focus} weekStart={weekStart} />
        </>
      )}
    </section>
  )
}
