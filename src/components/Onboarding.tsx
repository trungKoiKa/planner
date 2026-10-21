import { greeting } from '../lib/week'
import { usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'

export default function Onboarding() {
  const projects = usePlanner((s) => s.projects)
  const addProject = usePlanner((s) => s.addProject)
  const addTask = usePlanner((s) => s.addTask)
  const { openTask, setAutoFocusProject } = useUI()

  const hasProject = projects.length > 0
  const firstTask = projects.flatMap((p) => p.tasks.map((t) => ({ p, t })))[0]
  const steps = [
    { title: 'Make a project', body: 'A class, a goal, anything with tasks.', done: hasProject },
    { title: 'Add a task', body: 'Something you need to get done.', done: !!firstTask },
    { title: 'Give it some days', body: 'Each day becomes its own checkbox.', done: false },
  ]

  const cta = () => {
    if (!hasProject) {
      const id = addProject()
      setAutoFocusProject(id)
    } else if (!firstTask) {
      const p = projects[0]
      const tid = addTask(p.id, 'My first task')
      openTask(p.id, tid)
    } else {
      openTask(firstTask.p.id, firstTask.t.id)
    }
  }

  return (
    <section className="card onboarding section">
      <h1>{greeting()}. Let's plan your week.</h1>
      <div className="steps">
        {steps.map((s, i) => (
          <div key={s.title} className={`step${s.done ? ' done' : ''}`}>
            <span className="step-num">{s.done ? '✓' : i + 1}</span>
            <div>
              <strong>{s.title}</strong>
              <div className="muted" style={{ fontSize: 14 }}>{s.body}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="demo" aria-hidden>
        <input type="checkbox" className="check" readOnly />
        read chapter 3 <span className="mono muted">0/1</span>
        <span className="chip">Mon</span>
        <span className="chip on">Wed</span>
        <span className="chip">Fri</span>
      </div>
      <button className="btn primary" style={{ marginTop: 18 }} onClick={cta}>
        {!hasProject ? '+ Add your first project' : !firstTask ? '+ Add a task' : 'Pick days for a task'}
      </button>
    </section>
  )
}
