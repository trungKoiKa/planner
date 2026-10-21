import { APP_NAME, SUPPORT_URL } from '../config'
import { navigate, type Route } from '../lib/route'
import { currentWeekStart, formatRange, shiftWeek, weekLabel } from '../lib/week'
import { selectWeekStart, usePlanner } from '../store/usePlanner'
import { useAuth } from '../store/sync'
import SettingsMenu from './SettingsMenu'
import { useUI } from '../store/useUI'

const STATUS = {
  guest: 'Guest · saved locally',
  loading: 'Loading…',
  saving: 'Saving…',
  synced: 'Synced',
  error: 'Sync error',
} as const

export default function Header({ route }: { route: Route }) {
  const weekStart = usePlanner(selectWeekStart)
  const setWeekStart = usePlanner((s) => s.setWeekStart)
  const setFocusDay = useUI((s) => s.setFocusDay)
  const { user, status, error } = useAuth()
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
        <SettingsMenu />
        <span className="status" title={error ?? undefined}>{STATUS[status]}</span>
        {route === 'plan' ? (
          <>
            <button className="btn" onClick={() => navigate('auth')}>{user ? 'Account' : 'Sign in'}</button>
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
