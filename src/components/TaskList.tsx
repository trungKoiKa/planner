import { usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'
import type { Project } from '../types'
import { SortableItem, SortableList } from './Sortable'
import TaskRow from './TaskRow'

export default function TaskList({ project }: { project: Project }) {
  const deleteTask = usePlanner((s) => s.deleteTask)
  const reorderTasks = usePlanner((s) => s.reorderTasks)
  const openTask = useUI((s) => s.openTask)

  return (
    <SortableList ids={project.tasks.map((t) => t.id)} onMove={(from, to) => reorderTasks(project.id, from, to)}>
      {project.tasks.map((t) => (
        <SortableItem key={t.id} id={t.id}>
          {(handle) => (
            <TaskRow
              projectId={project.id}
              task={t}
              handle={handle}
              onOpen={() => openTask(project.id, t.id)}
              onDelete={() => deleteTask(project.id, t.id)}
            />
          )}
        </SortableItem>
      ))}
    </SortableList>
  )
}
