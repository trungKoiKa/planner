import { fmtTally, weekProgress } from '../../lib/progress'
import { formatRange } from '../../lib/week'
import { selectWeekStart, usePlanner } from '../../store/usePlanner'
import { useUI } from '../../store/useUI'
import Modal from '../Modal'

export default function EndWeekModal({ onClose }: { onClose: () => void }) {
  const projects = usePlanner((s) => s.projects)
  const weekStart = usePlanner(selectWeekStart)
  const endWeek = usePlanner((s) => s.endWeek)
  const { showToast, setFocusDay } = useUI()

  const run = (mode: 'carry' | 'clear') => {
    endWeek(mode)
    setFocusDay(null)
    showToast(`Week of ${formatRange(weekStart)} archived.`)
    onClose()
  }

  return (
    <Modal onClose={onClose} label="End week">
      <div className="label">End week · {formatRange(weekStart)} · {fmtTally(weekProgress(projects))}</div>
      <h2>Wrap up this week?</h2>
      <p>This snapshots the week into your archive. What should happen to tasks that aren't finished yet?</p>
      <div className="modal-actions">
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn danger" onClick={() => run('clear')}>Clear everything</button>
        <button className="btn primary" onClick={() => run('carry')}>Carry unfinished forward</button>
      </div>
    </Modal>
  )
}
