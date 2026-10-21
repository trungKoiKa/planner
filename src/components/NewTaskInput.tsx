import { useState } from 'react'

interface Props {
  onAdd: (title: string) => void
  onDone: () => void
}

/** Inline task entry: Enter saves and keeps the input open for the next task; Esc or blur closes. */
export default function NewTaskInput({ onAdd, onDone }: Props) {
  const [value, setValue] = useState('')

  const submit = () => {
    const t = value.trim()
    if (t) onAdd(t)
    setValue('')
  }

  return (
    <div className="task-row">
      <input type="checkbox" className="check" disabled aria-hidden />
      <div className="title">
        <input
          autoFocus
          className="bare-input"
          placeholder="Task name… (Enter to add, Esc to finish)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') onDone()
          }}
          onBlur={() => {
            submit()
            onDone()
          }}
          aria-label="New task"
        />
      </div>
    </div>
  )
}
