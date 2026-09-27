import { describe, it, expect } from 'vitest'
import type { AttemptStatus } from '@/domain/attempt/types'

const VALID_TRANSITIONS: Record<AttemptStatus, AttemptStatus[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['EVALUATING'],
  EVALUATING: ['COMPLETED', 'FAILED'],
  COMPLETED: ['EVALUATING'], // Retry re-evaluates
  FAILED: ['EVALUATING'],    // Retry re-evaluates
}

function isValidTransition(current: AttemptStatus, next: AttemptStatus): boolean {
  const allowed = VALID_TRANSITIONS[current] || []
  return allowed.includes(next)
}

describe('Attempt State Machine Transitions', () => {
  it('allows valid DRAFT -> SUBMITTED transition', () => {
    expect(isValidTransition('DRAFT', 'SUBMITTED')).toBe(true)
  })

  it('allows valid SUBMITTED -> EVALUATING transition', () => {
    expect(isValidTransition('SUBMITTED', 'EVALUATING')).toBe(true)
  })

  it('allows valid EVALUATING -> COMPLETED transition', () => {
    expect(isValidTransition('EVALUATING', 'COMPLETED')).toBe(true)
  })

  it('allows valid EVALUATING -> FAILED transition', () => {
    expect(isValidTransition('EVALUATING', 'FAILED')).toBe(true)
  })

  it('rejects invalid DRAFT -> COMPLETED transition', () => {
    expect(isValidTransition('DRAFT', 'COMPLETED')).toBe(false)
  })

  it('rejects invalid SUBMITTED -> DRAFT transition', () => {
    expect(isValidTransition('SUBMITTED', 'DRAFT')).toBe(false)
  })

  it('rejects invalid COMPLETED -> DRAFT transition', () => {
    expect(isValidTransition('COMPLETED', 'DRAFT')).toBe(false)
  })
})
