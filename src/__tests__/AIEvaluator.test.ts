import { describe, it, expect } from 'vitest'
import { AIEvaluator } from '@/infrastructure/evaluation/AIEvaluator'
import type { LLMProvider } from '@/infrastructure/ai/types'
import type { ProblemWithDetails } from '@/domain/problem/types'
import type { TextSubmissionContent } from '@/domain/submission/types'

const mockProblem: ProblemWithDetails = {
  id: 'problem-1',
  title: 'Parking Lot',
  description: 'Design a parking lot system.',
  difficulty: 'Medium',
  createdAt: new Date(),
  updatedAt: new Date(),
  requirements: [{ id: 'req-1', text: 'Multiple vehicle types' }],
  rubrics: [
    {
      id: 'rubric-1',
      criteria: [
        {
          id: 'crit-1',
          dimension: 'Class Responsibilities',
          description: 'Entity responsibilities',
          maxScore: 10,
        },
      ],
    },
  ],
}

const mockSubmission: TextSubmissionContent = {
  type: 'TEXT',
  classesAndResponsibilities: 'Vehicle, ParkingSpot, Level, Ticket, Gate are defined with clear responsibilities.',
  interfacesAndAbstractions: 'ParkingStrategy interface abstracts spot selection logic for extensibility.',
  relationships: 'Level contains multiple ParkingSpots. Ticket reference Vehicle and ParkingSpot.',
  designExplanation: 'When vehicle arrives, Gate calls ParkingStrategy to find spot, creates Ticket.',
  tradeOffs: 'In-memory allocation is fast but requires lock synchronization for concurrency.',
  edgeCases: 'Handles lot full scenario, invalid tickets, and unpark without ticket.',
}

describe('AIEvaluator', () => {
  it('correctly parses structured AI completion response into EvaluationResult', async () => {
    const mockProvider: LLMProvider = {
      complete: async () => JSON.stringify({
        criteria: [
          {
            dimension: 'Class Responsibilities',
            score: 8,
            evidence: 'Submission defines Vehicle, Spot, Ticket classes clearly.',
            concern: 'Gate class takes on too much responsibilities.',
            suggestion: 'Extract TicketFactory out of Gate.',
            confidence: 0.9,
          },
        ],
      }),
    }

    const evaluator = new AIEvaluator(mockProvider)
    const result = await evaluator.evaluate(mockSubmission, mockProblem)

    expect(result.status).toBe('COMPLETED')
    expect(result.overallScore).toBe(8)
    expect(result.results).toHaveLength(1)
    expect(result.results[0].score).toBe(8)
    expect(result.results[0].evidence).toContain('Vehicle, Spot, Ticket')
    expect(result.results[0].confidence).toBe(0.9)
  })

  it('handles malformed AI json responses gracefully with status FAILED', async () => {
    const mockProvider: LLMProvider = {
      complete: async () => 'Invalid Non-JSON response from LLM',
    }

    const evaluator = new AIEvaluator(mockProvider)
    const result = await evaluator.evaluate(mockSubmission, mockProblem)

    expect(result.status).toBe('FAILED')
    expect(result.error).toContain('malformed evaluation output')
  })

  it('handles AI provider execution errors cleanly', async () => {
    const mockProvider: LLMProvider = {
      complete: async () => {
        throw new Error('API Rate limit exceeded')
      },
    }

    const evaluator = new AIEvaluator(mockProvider)
    const result = await evaluator.evaluate(mockSubmission, mockProblem)

    expect(result.status).toBe('FAILED')
    expect(result.error).toContain('AI provider error: API Rate limit exceeded')
  })
})
