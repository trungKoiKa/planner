import type { DayEntry } from '../lib/progress'
import { usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'

interface Props {
  entry: DayEntry
  missed?: boolean
  side?: React.ReactNode
}

export default function SlotCard({ entry: { project, task, slot }, missed, side }: Props) {
  const toggleSlot = usePlanner((s) => s.toggleSlot)
  const openTask = useUI((s) => s.openTask)
  const cls = slot.done ? ' done' : missed ? ' missed' : ''

  return (
    <div className={`slot-card${cls}`}>
      <input
        type="checkbox"
        className="check"
        checked={slot.done}
        onChange={() => toggleSlot(project.id, task.id, slot.id)}
        aria-label={`Mark ${task.title} done`}
      />
      <div className="slot-body">
        <div className="slot-title" onDoubleClick={() => openTask(project.id, task.id)}>
          <span className="proj">{project.title || 'Untitled'} /</span>
          {task.title}
        </div>
        {slot.desc && <div className="slot-desc">{slot.desc}</div>}
      </div>
      {side}
    </div>
  )
}
