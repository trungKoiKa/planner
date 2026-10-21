import { format, parseISO } from 'date-fns'
import CopyPlanButton from '../components/CopyPlanButton'
import ProgressBar from '../components/ProgressBar'
import { fmtTally, taskProgress } from '../lib/progress'
import { DAY_LABEL, formatRange } from '../lib/week'
import { usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'

export default function Archive() {
  const archives = usePlanner((s) => s.archives)
  const showToast = useUI((s) => s.showToast)

  return (
    <section className="section">
      <div className="page-head">
        <h1>Archive</h1>
        <span className="label">{archives.length} week{archives.length === 1 ? '' : 's'}</span>
      </div>

      {archives.length === 0 ? (
        <div className="card empty-state">No archived weeks yet. Hit “End week” on your plan to save one here.</div>
      ) : (
        <div className="projects">
          {archives.map((a) => (
            <div key={a.id} className="card archive-item">
              <details>
                <summary>
                  <div className="row" style={{ flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 20 }}>{formatRange(a.weekStart)}</h3>
                    <span className="label">{format(parseISO(a.weekStart), 'yyyy')}</span>
                    <span className="spacer" />
                    <span className="mono muted">{fmtTally(a.totals)}</span>
                  </div>
                  <div className="row" style={{ marginTop: 8 }}>
                    <ProgressBar tally={a.totals} good />
                  </div>
                </summary>
                <ul className="archive-tree">
                  {a.projects.map((p) => (
                    <li key={p.id}>
                      <strong>{p.title || 'Untitled project'}</strong>
                      <ul>
                        {p.tasks.map((t) => {
                          const tp = taskProgress(t)
                          return (
                            <li key={t.id}>
                              {t.title} <span className="mono muted">{tp.done}/{tp.total}</span>{' '}
                              <span className="muted" style={{ fontSize: 13 }}>
                                {t.slots.map((s) => `${DAY_LABEL[s.day]}${s.done ? '✓' : ''}`).join(' · ')}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
                <div className="row" style={{ marginTop: 12 }}>
                  <span className="muted" style={{ fontSize: 14 }}>
                    Ended {format(parseISO(a.endedAt), 'EEE MMM d, HH:mm')} · {a.missedCount} missed
                  </span>
                  <span className="spacer" />
                  <CopyPlanButton projects={a.projects} onCopied={() => showToast('Plan copied. Use “Paste plan” on your board.')} />
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
