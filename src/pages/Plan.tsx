import { useEffect, useState } from 'react'
import CopyPlanButton from '../components/CopyPlanButton'
import Onboarding from '../components/Onboarding'
import ProjectList from '../components/ProjectList'
import WeekBoard from '../components/WeekBoard'
import WeekProgress from '../components/WeekProgress'
import { allSlots } from '../lib/progress'
import { useShortcuts } from '../lib/useShortcuts'
import { selectWeekStart, usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'

interface Props {
  onEndWeek: () => void
  onPaste: () => void
}

export default function Plan({ onEndWeek, onPaste }: Props) {
  const projects = usePlanner((s) => s.projects)
  const weekStart = usePlanner(selectWeekStart)
  const addProject = usePlanner((s) => s.addProject)
  const setAutoFocusProject = useUI((s) => s.setAutoFocusProject)
  const [banner, setBanner] = useState(false)
  const hasSlots = allSlots(projects).length > 0
  useShortcuts(weekStart)

  useEffect(() => {
    if (!banner) return
    const t = setTimeout(() => setBanner(false), 6000)
    return () => clearTimeout(t)
  }, [banner])

  return (
    <>
      <WeekProgress projects={projects} onEndWeek={onEndWeek} />
      {hasSlots ? <WeekBoard projects={projects} weekStart={weekStart} /> : <Onboarding />}

      <section className="section">
        <div className="section-head">
          <span className="label strong">Projects</span>
          <div className="row">
            <CopyPlanButton projects={projects} onCopied={() => setBanner(true)} />
            <button className="btn" onClick={onPaste}>Paste plan</button>
          </div>
        </div>
        {banner && (
          <div className="banner" role="status">
            <span className="spacer">Plan copied. Use “Paste plan” on any board to drop it in.</span>
            <button className="btn small good" onClick={() => setBanner(false)}>Dismiss</button>
          </div>
        )}
        <div style={{ marginTop: banner ? 12 : 0 }}>
          <ProjectList projects={projects} />
        </div>
        <button className="add-dashed" style={{ marginTop: 14 }} onClick={() => setAutoFocusProject(addProject())}>
          + Add project
        </button>
      </section>
    </>
  )
}
