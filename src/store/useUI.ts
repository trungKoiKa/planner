import { create } from 'zustand'
import type { Day } from '../types'

export interface Toast {
  id: number
  message: string
  action?: { label: string; run: () => void }
}

interface UIState {
  editing: { projectId: string; taskId: string } | null
  projectDeadline: string | null
  focusDay: Day | null
  showAll: boolean
  autoFocusProject: string | null
  toast: Toast | null
  addingIn: string | null
  setAddingIn: (projectId: string | null) => void
  openTask: (projectId: string, taskId: string) => void
  closeTask: () => void
  setProjectDeadline: (id: string | null) => void
  setFocusDay: (day: Day | null) => void
  setShowAll: (v: boolean) => void
  setAutoFocusProject: (id: string | null) => void
  showToast: (message: string, action?: Toast['action']) => void
  dismissToast: () => void
}

let toastSeq = 0

export const useUI = create<UIState>()((set) => ({
  editing: null,
  projectDeadline: null,
  focusDay: null,
  showAll: false,
  autoFocusProject: null,
  toast: null,
  addingIn: null,
  setAddingIn: (addingIn) => set({ addingIn }),
  openTask: (projectId, taskId) => set({ editing: { projectId, taskId } }),
  closeTask: () => set({ editing: null }),
  setProjectDeadline: (projectDeadline) => set({ projectDeadline }),
  setFocusDay: (focusDay) => set({ focusDay, showAll: false }),
  setShowAll: (showAll) => set({ showAll }),
  setAutoFocusProject: (autoFocusProject) => set({ autoFocusProject }),
  showToast: (message, action) => set({ toast: { id: ++toastSeq, message, action } }),
  dismissToast: () => set({ toast: null }),
}))
