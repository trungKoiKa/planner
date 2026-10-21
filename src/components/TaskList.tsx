import { usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'
import type { Project } from '../types'
import TaskRow from './TaskRow'

export default function TaskList({ project }: { project: Project }) {
  const deleteTask = usePlanner((s) => s.deleteTask)
  const openTask = useUI((s) => s.openTask)

  return (
    <>
      {project.tasks.map((t) => (
        <TaskRow key={t.id} projectId={project.id} task={t} onOpen={() => openTask(project.id, t.id)} onDelete={() => deleteTask(project.id, t.id)} />
      ))}
    </>
  )
}
