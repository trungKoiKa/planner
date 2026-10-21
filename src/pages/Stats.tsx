import ProgressBar from '../components/ProgressBar'
import { fmtTally, pct } from '../lib/progress'
import { heatLevel, summarize } from '../lib/stats'
import { DAY_LABEL, formatRange } from '../lib/week'
import { usePlanner } from '../store/usePlanner'
import { DAYS, type Tally } from '../types'

function Heat({ t, label }: { t: Tally; label: string }) {
  const lvl = heatLevel(t)
  return (
    <div
      className={`heat${t.total === 0 ? ' none' : ''}`}
      style={lvl ? { background: `var(--heat-${lvl})` } : undefined}
      title={`${label}: ${t.total ? fmtTally(t) : 'nothing planned'}`}
      aria-label={`${label}: ${t.total ? fmtTally(t) : 'nothing planned'}`}
    />
  )
}

export default function Stats() {
  const archives = usePlanner((s) => s.archives)
  const s = summarize(archives)
  const recent = archives.slice(0, 12)

  return (
    <section className="section">
      <div className="page-head">
        <h1>Stats</h1>
        <span className="label">{s.weeks} week{s.weeks === 1 ? '' : 's'} tracked</span>
      </div>

      {archives.length === 0 ? (
        <div className="card empty-state">No stats yet. End a week to start tracking how your plans turn out.</div>
      ) : (
        <>
          <div className="stat-tiles">
            <div className="card stat-tile">
              <div className="label">Average week</div>
              <div className="value">{s.avg}%</div>
            </div>
            <div className="card stat-tile">
              <div className="label">All-time</div>
              <div className="value">{pct(s.overall)}%</div>
              <div className="mono muted">{s.overall.done}/{s.overall.total} done</div>
            </div>
            <div className="card stat-tile">
              <div className="label">Best week</div>
              <div className="value">{s.best ? `${pct(s.best.totals)}%` : '–'}</div>
              {s.best && <div className="mono muted">{formatRange(s.best.weekStart)}</div>}
            </div>
            <div className="card stat-tile">
              <div className="label">80%+ streak</div>
              <div className="value">{s.streak}</div>
              <div className="mono muted">week{s.streak === 1 ? '' : 's'} in a row</div>
            </div>
            <div className="card stat-tile">
              <div className="label">Missed</div>
              <div className="value">{s.missed}</div>
              <div className="mono muted">subtasks</div>
            </div>
          </div>

          <div className="section">
            <div className="label strong" style={{ marginBottom: 10 }}>Weekly completion</div>
            <div className="card day-panel week-bars">
              {recent.map((a) => (
                <div key={a.id} className="week-bar-row">
                  <span className="mono muted">{formatRange(a.weekStart)}</span>
                  <ProgressBar tally={a.totals} good />
                  <span className="mono muted" style={{ textAlign: 'right' }}>{fmtTally(a.totals)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="label strong" style={{ marginBottom: 10 }}>Day-by-day heatmap</div>
            <div className="card day-panel">
              <div className="heatmap">
                <span />
                {DAYS.map((d) => <span key={d} className="label" style={{ textAlign: 'center' }}>{DAY_LABEL[d]}</span>)}
                {recent.map((a) => (
                  <div key={a.id} style={{ display: 'contents' }}>
                    <span className="mono muted">{formatRange(a.weekStart)}</span>
                    {DAYS.map((d) => <Heat key={d} t={a.byDay[d]} label={`${DAY_LABEL[d]}, ${formatRange(a.weekStart)}`} />)}
                  </div>
                ))}
                <span className="label">All weeks</span>
                {DAYS.map((d) => <Heat key={d} t={s.byWeekday[d]} label={`All ${DAY_LABEL[d]}s`} />)}
              </div>
              <div className="heat-legend mono muted">
                less
                <div className="heat none" />
                <div className="heat" style={{ background: 'var(--heat-1)' }} />
                <div className="heat" style={{ background: 'var(--heat-2)' }} />
                <div className="heat" style={{ background: 'var(--heat-3)' }} />
                more done
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
