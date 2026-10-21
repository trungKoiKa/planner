import { useState } from 'react'
import { parsePlan } from '../../lib/planText'
import { usePlanner } from '../../store/usePlanner'
import { useUI } from '../../store/useUI'
import Modal from '../Modal'

export default function PastePlanModal({ onClose }: { onClose: () => void }) {
  const appendProjects = usePlanner((s) => s.appendProjects)
  const showToast = useUI((s) => s.showToast)
  const [text, setText] = useState('')
  const [reset, setReset] = useState(true)
  const [error, setError] = useState('')

  const add = () => {
    try {
      const projects = parsePlan(text, reset)
      appendProjects(projects)
      showToast(`Added ${projects.length} project${projects.length === 1 ? '' : 's'} to the board.`)
      onClose()
    } catch {
      setError("That doesn't look like a copied plan. Use 'Copy plan' and paste the whole thing.")
    }
  }

  return (
    <Modal onClose={onClose} label="Paste plan">
      <div className="label">Paste plan</div>
      <h2>Drop in a copied plan</h2>
      <textarea
        autoFocus
        className="textarea"
        style={{ minHeight: 160, fontFamily: 'var(--mono)', fontSize: 12 }}
        placeholder="Paste here with Cmd/Ctrl+V…"
        value={text}
        onChange={(e) => { setText(e.target.value); setError('') }}
      />
      <label className="choice" style={{ marginTop: 10 }}>
        <input type="checkbox" className="check" checked={reset} onChange={(e) => setReset(e.target.checked)} />
        Reset checkmarks (start fresh)
      </label>
      {error && <div className="error">{error}</div>}
      <div className="hint">Projects are added below the ones already on your board.</div>
      <div className="modal-actions">
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" disabled={!text.trim()} onClick={add}>Add to board</button>
      </div>
    </Modal>
  )
}
