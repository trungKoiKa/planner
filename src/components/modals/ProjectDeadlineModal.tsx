import { useState } from 'react'
import { formatDeadline, joinDeadline, splitDeadline } from '../../lib/deadline'
import { usePlanner } from '../../store/usePlanner'
import Modal from '../Modal'

export default function ProjectDeadlineModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const project = usePlanner((s) => s.projects.find((p) => p.id === projectId))
  const updateProject = usePlanner((s) => s.updateProject)
  const initial = splitDeadline(project?.deadline ?? null)
  const [date, setDate] = useState(initial.date)
  const [time, setTime] = useState(initial.time)

  if (!project) return null
  const deadline = joinDeadline(date, time)

  return (
    <Modal onClose={onClose} label="Project deadline">
      <div className="label">Project deadline</div>
      <h2>{project.title || 'Untitled project'}</h2>
      <div className="row">
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Deadline date" />
        <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={!date} aria-label="Deadline time" />
      </div>
      <div className="hint">{deadline ? `Due ${formatDeadline(deadline)}.` : 'No deadline set.'}</div>
      <div className="modal-actions">
        {project.deadline && (
          <button className="btn danger" onClick={() => { updateProject(projectId, { deadline: null }); onClose() }}>Remove</button>
        )}
        <span className="spacer" />
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => { updateProject(projectId, { deadline }); onClose() }}>Save</button>
      </div>
    </Modal>
  )
}
