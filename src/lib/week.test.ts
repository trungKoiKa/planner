import { parseISO } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { currentWeekStart, formatRange, isMissed, isPastDay, shiftWeek, todayDay, weekLabel, weekOffset } from './week'
import type { Slot } from '../types'

const wed = parseISO('2026-10-21')
const slot = (day: Slot['day'], done = false): Slot => ({ id: 'x', day, done, desc: '', missed: [] })

describe('week helpers', () => {
  it('finds the Monday of the week', () => {
    expect(currentWeekStart(wed)).toBe('2026-10-19')
    expect(currentWeekStart(parseISO('2026-10-25'))).toBe('2026-10-19')
    expect(currentWeekStart(parseISO('2026-10-26'))).toBe('2026-10-26')
  })

  it('maps today to a day key', () => {
    expect(todayDay(wed)).toBe('wed')
    expect(todayDay(parseISO('2026-10-25'))).toBe('sun')
  })

  it('shifts and labels weeks', () => {
    expect(shiftWeek('2026-10-19', 1)).toBe('2026-10-26')
    expect(weekOffset('2026-10-26', wed)).toBe(1)
    expect(weekLabel('2026-10-19', wed)).toBe('This week')
    expect(weekLabel('2026-10-26', wed)).toBe('Next week')
    expect(formatRange('2026-10-19')).toBe('Oct 19 – Oct 25')
  })

  it('detects past days and missed slots', () => {
    expect(isPastDay('mon', '2026-10-19', wed)).toBe(true)
    expect(isPastDay('wed', '2026-10-19', wed)).toBe(false)
    expect(isPastDay('mon', '2026-10-26', wed)).toBe(false)
    expect(isPastDay('sun', '2026-10-12', wed)).toBe(true)
    expect(isMissed(slot('mon'), '2026-10-19', wed)).toBe(true)
    expect(isMissed(slot('mon', true), '2026-10-19', wed)).toBe(false)
    expect(isMissed(slot('thu'), '2026-10-19', wed)).toBe(false)
  })
})
