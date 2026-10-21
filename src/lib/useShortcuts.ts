import { useEffect } from 'react'
import { usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'
import { DAYS } from '../types'
import { todayDay, weekOffset } from './week'

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))

/** N adds a task to the last project; ←/→ move the focused day. */
export function useShortcuts(weekStart: string) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
      const ui = useUI.getState()
      if (ui.editing || ui.projectDeadline || document.querySelector('[role="dialog"]')) return

      if (e.key === 'n' || e.key === 'N') {
        const projects = usePlanner.getState().projects
        const last = projects[projects.length - 1]
        if (!last) return
        e.preventDefault()
        ui.setAddingIn(last.id)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const current = ui.focusDay ?? (weekOffset(weekStart) === 0 ? todayDay() : 'mon')
        const i = DAYS.indexOf(current) + (e.key === 'ArrowRight' ? 1 : -1)
        if (i < 0 || i >= DAYS.length) return
        e.preventDefault()
        ui.setFocusDay(DAYS[i])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [weekStart])
}
