import { addDays, addWeeks, differenceInCalendarWeeks, format, parseISO, startOfWeek } from 'date-fns'
import { DAYS, type Day, type Slot } from '../types'

const ISO = 'yyyy-MM-dd'

/** Today, overridable with ?today=yyyy-MM-dd for testing missed states. */
export function getToday(): Date {
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search).get('today')
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return parseISO(q)
  }
  return new Date()
}

export const toISO = (d: Date) => format(d, ISO)

export const mondayOf = (d: Date) => toISO(startOfWeek(d, { weekStartsOn: 1 }))

export const currentWeekStart = (today = getToday()) => mondayOf(today)

export const shiftWeek = (weekStart: string, n: number) => toISO(addWeeks(parseISO(weekStart), n))

export const dayIndex = (day: Day) => DAYS.indexOf(day)

export const todayDay = (today = getToday()): Day => DAYS[(today.getDay() + 6) % 7]

export const dateOf = (weekStart: string, day: Day) => addDays(parseISO(weekStart), dayIndex(day))

/** Weeks between the planned week and the current one (0 = this week, 1 = next week). */
export const weekOffset = (weekStart: string, today = getToday()) =>
  differenceInCalendarWeeks(parseISO(weekStart), parseISO(currentWeekStart(today)), { weekStartsOn: 1 })

/** True when the day has already passed relative to today within the planned week. */
export function isPastDay(day: Day, weekStart: string, today = getToday()): boolean {
  const off = weekOffset(weekStart, today)
  if (off < 0) return true
  if (off > 0) return false
  return dayIndex(day) < dayIndex(todayDay(today))
}

export const isMissed = (slot: Slot, weekStart: string, today = getToday()) =>
  !slot.done && isPastDay(slot.day, weekStart, today)

export function formatRange(weekStart: string): string {
  const s = parseISO(weekStart)
  return `${format(s, 'MMM d')} – ${format(addDays(s, 6), 'MMM d')}`
}

export function weekLabel(weekStart: string, today = getToday()): string {
  const off = weekOffset(weekStart, today)
  if (off === 0) return 'This week'
  if (off === 1) return 'Next week'
  if (off === -1) return 'Last week'
  return off > 0 ? `In ${off} weeks` : `${-off} weeks ago`
}

export const DAY_LABEL: Record<Day, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

export function greeting(today = new Date()): string {
  const h = today.getHours()
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
