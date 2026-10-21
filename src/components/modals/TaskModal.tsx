import { useState } from 'react'
import { formatDeadline, joinDeadline, splitDeadline } from '../../lib/deadline'
import { DAY_LABEL } from '../../lib/week'
import { newSlot, sortSlots, usePlanner } from '../../store/usePlanner'
import { DAYS, type Day, type Slot } from '../../types'
import Modal from '../Modal'

interface Props {
  projectId: string
  taskId: string
  onClose: () => void
}

export default function TaskModal({ projectId, taskId, onClose }: Props) {
  const project = usePlanner((s) => s.projects.find((p) => p.id === projectId))
  const task = project?.tasks.find((t) => t.id === taskId)
  const updateTask = usePlanner((s) => s.updateTask)

  const initial = splitDeadline(task?.deadline ?? null)
  const [date, setDate] = useState(initial.date)
  const [time, setTime] = useState(initial.time)
  const [desc, setDesc] = useState(task?.desc ?? '')
  const [slots, setSlots] = useState<Slot[]>(task?.slots ?? [])

  if (!project || !task) return null

  const deadline = joinDeadline(date, time)
  const activeDays = new Set(slots.map((s) => s.day))

  const toggleDay = (day: Day) =>
    setSlots((prev) =>
      activeDays.has(day) ? prev.filter((s) => s.day !== day) : sortSlots([...prev, newSlot(day)]),
    )
  const addSub = (day: Day) => setSlots((prev) => sortSlots([...prev, newSlot(day)]))
  const patchSlot = (id: string, patch: Partial<Slot>) =>
    setSlots((prev) => sortSlots(prev.map((s) => (s.id === id ? { ...s, ...patch } : s))))
  const removeSlot = (id: string) => setSlots((prev) => prev.filter((s) => s.id !== id))

  const save = () => {
    updateTask(projectId, taskId, { deadline, desc: desc.trim(), slots })
    onClose()
  }

  return (
    <Modal onClose={onClose} label={`Edit ${task.title}`}>
      <div className="label">{project.title || 'Untitled project'}</div>
      <h2>{task.title}</h2>

      <div className="field">
        <span className="label">Deadline</span>
        <div className="row">
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Deadline date" />
          <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={!date} aria-label="Deadline time" />
          {date && (
            <button className="icon-btn" onClick={() => { setDate(''); setTime('') }} aria-label="Clear deadline">×</button>
          )}
        </div>
        <div className="hint">{deadline ? `Due ${formatDeadline(deadline)}.` : 'No deadline set.'}</div>
      </div>

      <div className="field">
        <span className="label">Subtasks</span>
        <div className="day-toggles">
          {DAYS.map((d) => (
            <button key={d} className={`day-toggle${activeDays.has(d) ? ' on' : ''}`} onClick={() => toggleDay(d)} aria-pressed={activeDays.has(d)}>
              {DAY_LABEL[d]}
            </button>
          ))}
        </div>
        {slots.length === 0 && <div className="hint">No subtasks yet, so it won't show in the week.</div>}
        {DAYS.filter((d) => activeDays.has(d)).map((day) => (
          <div key={day} className="day-group">
            <div className="label strong">{DAY_LABEL[day]}</div>
            {slots.filter((s) => s.day === day).map((s) => (
              <div key={s.id} className="sub-row">
                <input
                  className="input"
                  placeholder="Note (optional)"
                  value={s.desc}
                  onChange={(e) => patchSlot(s.id, { desc: e.target.value })}
                />
                <button className="icon-btn" onClick={() => removeSlot(s.id)} aria-label="Remove subtask">×</button>
              </div>
            ))}
            <button className="add-task" onClick={() => addSub(day)}>+ add subtask</button>
          </div>
        ))}
      </div>

      <div className="field">
        <span className="label">Description (optional)</span>
        <textarea className="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Notes for the whole task…" />
      </div>

      <div className="modal-actions">
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={save}>Save</button>
      </div>
    </Modal>
  )
}
