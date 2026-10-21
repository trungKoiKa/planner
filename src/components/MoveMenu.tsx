import { useEffect, useRef, useState } from 'react'
import type { DayEntry } from '../lib/progress'
import { DAY_LABEL, dateOf, isPastDay, toISO } from '../lib/week'
import { usePlanner } from '../store/usePlanner'
import { DAYS } from '../types'

export default function MoveMenu({ entry: { project, task, slot }, weekStart }: { entry: DayEntry; weekStart: string }) {
  const moveSlot = usePlanner((s) => s.moveSlot)
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div className="slot-side" ref={ref}>
      <span className="missed-tag">MISSED</span>
      <button className="btn small" onClick={() => setOpen((o) => !o)} aria-expanded={open}>Move</button>
      {open && (
        <div className="card popover" role="menu">
          <div className="label">Move to</div>
          <div className="move-days">
            {DAYS.map((d) => (
              <button
                key={d}
                className="btn small"
                disabled={d === slot.day || isPastDay(d, weekStart)}
                onClick={() => {
                  moveSlot(project.id, task.id, slot.id, d, count ? toISO(dateOf(weekStart, slot.day)) : undefined)
                  setOpen(false)
                }}
              >
                {DAY_LABEL[d]}
              </button>
            ))}
          </div>
          <label className="choice">
            <input type="checkbox" className="check" checked={count} onChange={(e) => setCount(e.target.checked)} />
            Count {DAY_LABEL[slot.day]} as missed
          </label>
          <div className="modal-actions" style={{ marginTop: 10 }}>
            <button className="btn small" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
