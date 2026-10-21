import type { Project } from '../types'
import ProjectCard from './ProjectCard'

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="projects">
      {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
    </div>
  )
}
