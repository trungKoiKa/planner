import { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { getThemePref, setThemePref, type ThemePref } from '../lib/theme'
import { usePlanner } from '../store/usePlanner'
import { useUI } from '../store/useUI'
import type { PlannerData } from '../types'

const THEMES: ThemePref[] = ['light', 'auto', 'dark']

function download(data: PlannerData) {
  const blob = new Blob([JSON.stringify({ app: 'weekly', version: 1, data }, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `weekly-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

function isPlannerData(v: unknown): v is PlannerData {
  const d = v as PlannerData
  return !!d && Array.isArray(d.projects) && Array.isArray(d.archives)
}

export default function SettingsMenu() {
  const [open, setOpen] = useState(false)
  const [alignLeft, setAlignLeft] = useState(false)
  const [theme, setTheme] = useState<ThemePref>(getThemePref)
  const ref = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const replaceData = usePlanner((s) => s.replaceData)
  const showToast = useUI((s) => s.showToast)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const exportData = () => {
    const { projects, archives, weekStart } = usePlanner.getState()
    download({ projects, archives, weekStart })
  }

  const importData = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text())
      const data = isPlannerData(parsed?.data) ? parsed.data : parsed
      if (!isPlannerData(data)) throw new Error('bad file')
      const before = usePlanner.getState()
      const backup: PlannerData = { projects: before.projects, archives: before.archives, weekStart: before.weekStart }
      replaceData({ projects: data.projects, archives: data.archives, weekStart: data.weekStart ?? null })
      showToast('Backup restored.', { label: 'Undo', run: () => replaceData(backup) })
      setOpen(false)
    } catch {
      showToast("Couldn't read that file. Pick a weekly backup (.json).")
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="icon-btn"
        onClick={(e) => {
          // Open towards whichever side has room for the 230px menu.
          setAlignLeft(e.currentTarget.getBoundingClientRect().right < 260)
          setOpen((o) => !o)
        }}
        aria-label="Settings"
        aria-expanded={open}
      >
        ⚙
      </button>
      {open && (
        <div className="card popover" style={{ minWidth: 230, ...(alignLeft ? { left: 0, right: 'auto' } : null) }}>
          <div className="label">Appearance</div>
          <div className="row" style={{ marginTop: 8 }}>
            {THEMES.map((t) => (
              <button
                key={t}
                className={`btn small${theme === t ? ' primary' : ''}`}
                onClick={() => { setTheme(t); setThemePref(t) }}
                aria-pressed={theme === t}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="label" style={{ marginTop: 14 }}>Backup</div>
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn small" onClick={exportData}>Export JSON</button>
            <button className="btn small" onClick={() => fileRef.current?.click()}>Import JSON</button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void importData(f)
                e.target.value = ''
              }}
            />
          </div>
          <div className="label" style={{ marginTop: 14 }}>Shortcuts</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            <span className="mono">N</span> new task · <span className="mono">← →</span> change day
          </div>
        </div>
      )}
    </div>
  )
}
