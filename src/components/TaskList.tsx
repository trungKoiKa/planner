import { usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'
import type { Project } from '../types'
import { SortableItem, SortableList } from './Sortable'
import TaskRow from './TaskRow'

export default function TaskList({ project }: { project: Project }) {
  const { deleteTask, insertTask, reorderTasks } = usePlanner()
  const { openTask, showToast } = useUI()

  const remove = (index: number) => {
    const task = project.tasks[index]
    deleteTask(project.id, task.id)
    showToast(`Deleted “${task.title}”.`, { label: 'Undo', run: () => insertTask(project.id, task, index) })
  }

  return (
    <SortableList ids={project.tasks.map((t) => t.id)} onMove={(from, to) => reorderTasks(project.id, from, to)}>
      {project.tasks.map((t, i) => (
        <SortableItem key={t.id} id={t.id}>
          {(handle) => (
            <TaskRow
              projectId={project.id}
              task={t}
              handle={handle}
              onOpen={() => openTask(project.id, t.id)}
              onDelete={() => remove(i)}
            />
          )}
        </SortableItem>
      ))}
    </SortableList>
  )
}
