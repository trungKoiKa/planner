import { useEffect } from 'react'
import { useUI } from '../store/useUI'

export default function Toast() {
  const { toast, dismissToast } = useUI()

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(dismissToast, toast.action ? 6000 : 3500)
    return () => clearTimeout(t)
  }, [toast, dismissToast])

  if (!toast) return null
  return (
    <div className="card toast" role="status">
      <span>{toast.message}</span>
      {toast.action && (
        <button className="btn small primary" onClick={() => { toast.action!.run(); dismissToast() }}>
          {toast.action.label}
        </button>
      )}
      <button className="icon-btn" onClick={dismissToast} aria-label="Dismiss">×</button>
    </div>
  )
}
