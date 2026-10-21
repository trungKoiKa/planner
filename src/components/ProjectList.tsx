import { usePlanner } from '../store/usePlanner'
import type { Project } from '../types'
import ProjectCard from './ProjectCard'
import { SortableItem, SortableList } from './Sortable'

export default function ProjectList({ projects }: { projects: Project[] }) {
  const reorderProjects = usePlanner((s) => s.reorderProjects)
  return (
    <SortableList ids={projects.map((p) => p.id)} onMove={reorderProjects}>
      <div className="projects">
        {projects.map((p) => (
          <SortableItem key={p.id} id={p.id}>
            {(handle) => <ProjectCard project={p} handle={handle} />}
          </SortableItem>
        ))}
      </div>
    </SortableList>
  )
}
