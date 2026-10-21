import { useEffect, type ReactNode } from 'react'

interface Props {
  onClose: () => void
  label: string
  children: ReactNode
}

export default function Modal({ onClose, label, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card modal" role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </div>
    </div>
  )
}
