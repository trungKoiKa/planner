import { useState, type ReactNode } from 'react'
import { formatDeadline, isOverdue } from '../lib/deadline'
import { isTaskDone, taskProgress } from '../lib/progress'
import { usePlanner } from '../store/usePlanner'
import type { Task } from '../types'

interface Props {
  projectId: string
  task: Task
  onOpen: () => void
  onDelete: () => void
  handle?: ReactNode
}

export default function TaskRow({ projectId, task, onOpen, onDelete, handle }: Props) {
  const updateTask = usePlanner((s) => s.updateTask)
  const toggleTask = usePlanner((s) => s.toggleTask)
  const [title, setTitle] = useState(task.title)
  const done = isTaskDone(task)
  const prog = taskProgress(task)

  const commit = () => {
    const t = title.trim()
    if (!t) setTitle(task.title)
    else if (t !== task.title) updateTask(projectId, task.id, { title: t })
  }

  return (
    <div className={`task-row${done ? ' done' : ''}`}>
      {handle}
      <input type="checkbox" className="check" checked={done} onChange={() => toggleTask(projectId, task.id)} aria-label={`Mark ${task.title} done`} />
      <div className="title">
        <input
          className="bare-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          aria-label="Task title"
        />
      </div>
      {task.deadline && (
        <span className={`deadline-tag${isOverdue(task.deadline) && !done ? ' overdue' : ''}`} title="Deadline">
          ⏱ {formatDeadline(task.deadline)}
        </span>
      )}
      {prog.total > 0 ? (
        <button className="badge" onClick={onOpen} title="Edit days">{prog.done}/{prog.total}</button>
      ) : (
        <button className="assign" onClick={onOpen}>Assign days →</button>
      )}
      <button className="icon-btn" onClick={onOpen} aria-label="Edit task">📅</button>
      <button className="icon-btn" onClick={onDelete} aria-label="Delete task">×</button>
    </div>
  )
}
