import Header from './components/Header'
import ProjectDeadlineModal from './components/modals/ProjectDeadlineModal'
import TaskModal from './components/modals/TaskModal'
import { useRoute } from './lib/route'
import Plan from './pages/Plan'
import { useUI } from './store/useUI'

export default function App() {
  const route = useRoute()
  const { editing, closeTask, projectDeadline, setProjectDeadline } = useUI()

  return (
    <div className="shell">
      <Header route={route} />
      {route === 'plan' && <Plan onEndWeek={() => {}} />}
      {editing && <TaskModal key={editing.taskId} {...editing} onClose={closeTask} />}
      {projectDeadline && <ProjectDeadlineModal projectId={projectDeadline} onClose={() => setProjectDeadline(null)} />}
    </div>
  )
}
