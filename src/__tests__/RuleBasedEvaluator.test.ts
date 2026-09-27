import { describe, it, expect } from 'vitest'
import { RuleBasedEvaluator } from '@/infrastructure/evaluation/RuleBasedEvaluator'
import type { ProblemWithDetails } from '@/domain/problem/types'
import type { TextSubmissionContent } from '@/domain/submission/types'

const mockProblem: ProblemWithDetails = {
  id: 'problem-1',
  title: 'Parking Lot',
  description: 'Design a parking lot.',
  difficulty: 'Medium',
  createdAt: new Date(),
  updatedAt: new Date(),
  requirements: [{ id: 'req-1', text: 'Multiple floors' }],
  rubrics: [
    {
      id: 'rubric-1',
      criteria: [
        {
          id: 'crit-1',
          dimension: 'Requirement Understanding',
          description: 'Understands basic requirements',
          maxScore: 10,
        },
      ],
    },
  ],
}

describe('RuleBasedEvaluator', () => {
  const evaluator = new RuleBasedEvaluator()

  it('passes deterministic checks when all sections are sufficiently detailed', async () => {
    const validSubmission: TextSubmissionContent = {
      type: 'TEXT',
      classesAndResponsibilities: 'Vehicle, ParkingSpot, Level, Ticket, Gate are defined with clear responsibilities.',
      interfacesAndAbstractions: 'ParkingStrategy interface abstracts spot selection logic for extensibility.',
      relationships: 'Level contains multiple ParkingSpots. Ticket reference Vehicle and ParkingSpot.',
      designExplanation: 'When vehicle arrives, Gate calls ParkingStrategy to find spot, creates Ticket.',
      tradeOffs: 'In-memory allocation is fast but requires lock synchronization for concurrency.',
      edgeCases: 'Handles lot full scenario, invalid tickets, and unpark without ticket.',
    }

    const result = await evaluator.evaluate(validSubmission, mockProblem)
    expect(result.status).toBe('COMPLETED')
    expect(result.results.length).toBe(0)
  })

  it('penalizes submission with missing or short (<20 chars) sections', async () => {
    const insufficientSubmission: TextSubmissionContent = {
      type: 'TEXT',
      classesAndResponsibilities: 'Short',
      interfacesAndAbstractions: 'Short',
      relationships: 'Short',
      designExplanation: 'Short',
      tradeOffs: 'Short',
      edgeCases: 'Short',
    }

    const result = await evaluator.evaluate(insufficientSubmission, mockProblem)
    expect(result.status).toBe('COMPLETED')
    expect(result.results.length).toBe(1)
    expect(result.results[0].score).toBe(0)
    expect(result.results[0].concern).toContain('Sections were too brief')
  })

  it('fails cleanly if problem has no rubric criteria', async () => {
    const problemNoRubric: ProblemWithDetails = {
      ...mockProblem,
      rubrics: [],
    }

    const submission: TextSubmissionContent = {
      type: 'TEXT',
      classesAndResponsibilities: 'Vehicle, ParkingSpot, Level, Ticket, Gate are defined with clear responsibilities.',
      interfacesAndAbstractions: 'ParkingStrategy interface abstracts spot selection logic for extensibility.',
      relationships: 'Level contains multiple ParkingSpots. Ticket reference Vehicle and ParkingSpot.',
      designExplanation: 'When vehicle arrives, Gate calls ParkingStrategy to find spot, creates Ticket.',
      tradeOffs: 'In-memory allocation is fast but requires lock synchronization for concurrency.',
      edgeCases: 'Handles lot full scenario, invalid tickets, and unpark without ticket.',
    }

    const result = await evaluator.evaluate(submission, problemNoRubric)
    expect(result.status).toBe('FAILED')
    expect(result.error).toContain('No rubric found')
  })
})
