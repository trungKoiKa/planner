import ProjectList from '../components/ProjectList'
import Onboarding from '../components/Onboarding'
import WeekBoard from '../components/WeekBoard'
import WeekProgress from '../components/WeekProgress'
import { allSlots } from '../lib/progress'
import { selectWeekStart, usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'

export default function Plan({ onEndWeek }: { onEndWeek: () => void }) {
  const projects = usePlanner((s) => s.projects)
  const weekStart = usePlanner(selectWeekStart)
  const addProject = usePlanner((s) => s.addProject)
  const setAutoFocusProject = useUI((s) => s.setAutoFocusProject)
  const hasSlots = allSlots(projects).length > 0

  return (
    <>
      <WeekProgress projects={projects} onEndWeek={onEndWeek} />
      {hasSlots ? <WeekBoard projects={projects} weekStart={weekStart} /> : <Onboarding />}

      <section className="section">
        <div className="section-head">
          <span className="label strong">Projects</span>
          <div className="row" id="plan-actions" />
        </div>
        <ProjectList projects={projects} />
        <button className="add-dashed" style={{ marginTop: 14 }} onClick={() => setAutoFocusProject(addProject())}>
          + Add project
        </button>
      </section>
    </>
  )
}
