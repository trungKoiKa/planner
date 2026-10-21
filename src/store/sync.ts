import type { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { mergeData } from '../lib/merge'
import { supabase } from '../lib/supabase'
import type { PlannerData } from '../types'
import { usePlanner } from './usePlanner'

type SyncStatus = 'guest' | 'loading' | 'synced' | 'saving' | 'error'

interface AuthState {
  user: User | null
  status: SyncStatus
  error: string | null
}

export const useAuth = create<AuthState>()(() => ({ user: null, status: 'guest', error: null }))

const SAVE_DELAY = 500
let unsubscribe: (() => void) | null = null
let timer: ReturnType<typeof setTimeout> | undefined

const snapshot = (): PlannerData => {
  const { projects, archives, weekStart } = usePlanner.getState()
  return { projects, archives, weekStart }
}

async function save(userId: string) {
  if (!supabase) return
  useAuth.setState({ status: 'saving' })
  const { error } = await supabase
    .from('plans')
    .upsert({ user_id: userId, state: snapshot(), updated_at: new Date().toISOString() })
  useAuth.setState(error ? { status: 'error', error: error.message } : { status: 'synced', error: null })
}

async function startSync(user: User) {
  if (!supabase) return
  stopSync()
  useAuth.setState({ user, status: 'loading', error: null })
  const { data, error } = await supabase.from('plans').select('state').eq('user_id', user.id).maybeSingle()
  if (error) {
    useAuth.setState({ status: 'error', error: error.message })
    return
  }
  const merged = mergeData(snapshot(), (data?.state as PlannerData | undefined) ?? null)
  usePlanner.getState().replaceData(merged)
  await save(user.id)

  unsubscribe = usePlanner.subscribe((s, prev) => {
    if (s.projects === prev.projects && s.archives === prev.archives && s.weekStart === prev.weekStart) return
    clearTimeout(timer)
    timer = setTimeout(() => save(user.id), SAVE_DELAY)
  })
}

function stopSync() {
  unsubscribe?.()
  unsubscribe = null
  clearTimeout(timer)
}

/** Wires Supabase auth to the planner store. Safe to call once at startup. */
export function initSync() {
  if (!supabase) return
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
      // Deferred: Supabase calls made inside this callback can deadlock the auth client.
      const user = session.user
      if (useAuth.getState().user?.id !== user.id || !unsubscribe) setTimeout(() => void startSync(user), 0)
    } else if (event === 'SIGNED_OUT') {
      stopSync()
      useAuth.setState({ user: null, status: 'guest', error: null })
    }
  })
}

export async function signOut() {
  await supabase?.auth.signOut()
}
