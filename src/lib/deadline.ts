import { format, isPast, parseISO } from 'date-fns'

/** Deadlines are stored as "yyyy-MM-dd" or "yyyy-MM-ddTHH:mm". */
export const splitDeadline = (d: string | null) => {
  if (!d) return { date: '', time: '' }
  const [date, time = ''] = d.split('T')
  return { date, time }
}

export const joinDeadline = (date: string, time: string): string | null =>
  date ? (time ? `${date}T${time}` : date) : null

const toDate = (d: string) => (d.includes('T') ? parseISO(d) : parseISO(`${d}T23:59`))

export const isOverdue = (d: string | null) => !!d && isPast(toDate(d))

export function formatDeadline(d: string | null): string {
  if (!d) return ''
  const date = toDate(d)
  return d.includes('T') ? format(date, 'EEE MMM d, HH:mm') : format(date, 'EEE MMM d')
}
