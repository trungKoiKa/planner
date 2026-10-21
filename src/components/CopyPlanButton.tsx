import { useState } from 'react'
import { serializePlan } from '../lib/planText'
import type { Project } from '../types'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}

interface Props {
  projects: Project[]
  label?: string
  onCopied?: () => void
}

export default function CopyPlanButton({ projects, label = 'Copy plan', onCopied }: Props) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className={`btn${copied ? ' good' : ''}`}
      disabled={projects.length === 0}
      onClick={async () => {
        await copyText(serializePlan(projects))
        setCopied(true)
        onCopied?.()
        setTimeout(() => setCopied(false), 2500)
      }}
    >
      {copied ? 'Copied ✓' : label}
    </button>
  )
}
