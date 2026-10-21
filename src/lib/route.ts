import { useSyncExternalStore } from 'react'

export type Route = 'plan' | 'stats' | 'archive' | 'auth'
const ROUTES: Route[] = ['plan', 'stats', 'archive', 'auth']

const read = (): Route => {
  const r = window.location.hash.replace(/^#\/?/, '') as Route
  return ROUTES.includes(r) ? r : 'plan'
}

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export const useRoute = () => useSyncExternalStore(subscribe, read)

export const navigate = (r: Route) => {
  window.location.hash = r === 'plan' ? '' : `/${r}`
  window.scrollTo(0, 0)
}
