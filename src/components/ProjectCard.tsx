import { useState, type ReactNode } from 'react'
import { formatDeadline, isOverdue } from '../lib/deadline'
import { projectProgress } from '../lib/progress'
import { usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'
import type { Project } from '../types'
import NewTaskInput from './NewTaskInput'
import ProgressBar from './ProgressBar'
import TaskList from './TaskList'

interface Props {
  project: Project
  handle?: ReactNode
}

export default function ProjectCard({ project, handle }: Props) {
  const { updateProject, deleteProject, addTask } = usePlanner()
  const { autoFocusProject, setAutoFocusProject, setProjectDeadline } = useUI()
  const [title, setTitle] = useState(project.title)
  const [adding, setAdding] = useState(false)
  const prog = projectProgress(project)

  return (
    <div className="card project-card">
      <div className="project-head">
        {handle}
        <input
          className="bare-input project-title"
          placeholder="Project name…"
          value={title}
          autoFocus={autoFocusProject === project.id}
          onChange={(e) => {
            setTitle(e.target.value)
            updateProject(project.id, { title: e.target.value.trim() })
          }}
          onBlur={() => {
            setAutoFocusProject(null)
            setTitle(project.title)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur()
              setAdding(true)
            }
          }}
          aria-label="Project name"
        />
        <div className="project-meta">
          <ProgressBar tally={prog} />
          <span className="mono muted">{prog.done}/{prog.total}</span>
        </div>
        <button className="icon-btn" onClick={() => setProjectDeadline(project.id)} aria-label="Project deadline" title="Project deadline">⏱</button>
        <button className="icon-btn" onClick={() => deleteProject(project.id)} aria-label="Delete project">×</button>
      </div>
      {project.deadline && (
        <div className={`deadline-tag${isOverdue(project.deadline) ? ' overdue' : ''}`} style={{ marginTop: 4 }}>
          Due {formatDeadline(project.deadline)}
        </div>
      )}
      <div className="task-list">
        <TaskList project={project} />
        {adding ? (
          <NewTaskInput onAdd={(t) => addTask(project.id, t)} onDone={() => setAdding(false)} />
        ) : (
          <button className="add-task" onClick={() => setAdding(true)}>+ add task</button>
        )}
      </div>
    </div>
  )
}
