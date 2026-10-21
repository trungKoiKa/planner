import { APP_NAME, SUPPORT_URL } from '../config'
import { navigate, type Route } from '../lib/route'
import { currentWeekStart, formatRange, shiftWeek, weekLabel } from '../lib/week'
import { selectWeekStart, usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'

export default function Header({ route }: { route: Route }) {
  const weekStart = usePlanner(selectWeekStart)
  const setWeekStart = usePlanner((s) => s.setWeekStart)
  const setFocusDay = useUI((s) => s.setFocusDay)
  const isCurrent = weekStart === currentWeekStart()

  const go = (ws: string) => {
    setWeekStart(ws)
    setFocusDay(null)
  }

  return (
    <header className="header">
      <a className="logo" href="#" onClick={() => navigate('plan')} style={{ color: 'inherit', textDecoration: 'none' }}>
        {APP_NAME}<span>.</span>
      </a>

      {route === 'plan' && (
        <div className="week-picker">
          <span className="label">📅 {weekLabel(weekStart)}</span>
          <button className="icon-btn" onClick={() => go(shiftWeek(weekStart, -1))} aria-label="Previous week">‹</button>
          <span className="range">{formatRange(weekStart)}</span>
          <button className="icon-btn" onClick={() => go(shiftWeek(weekStart, 1))} aria-label="Next week">›</button>
          {!isCurrent && (
            <button className="icon-btn" onClick={() => go(currentWeekStart())} aria-label="Back to this week" title="Back to this week">↩</button>
          )}
        </div>
      )}

      <nav className="header-nav">
        <a className="btn ghost" href={SUPPORT_URL} target="_blank" rel="noreferrer">♥ Support</a>
        <span className="status">Guest · saved locally</span>
        {route === 'plan' ? (
          <>
            <button className="btn" onClick={() => navigate('auth')}>Sign in</button>
            <button className="btn" onClick={() => navigate('stats')}>Stats</button>
            <button className="btn" onClick={() => navigate('archive')}>Archive</button>
          </>
        ) : (
          <button className="btn" onClick={() => navigate('plan')}>‹ Back to plan</button>
        )}
      </nav>
    </header>
  )
}
