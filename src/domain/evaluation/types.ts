import type { ProblemWithDetails } from '../problem/types'
import type { SubmissionContent } from '../submission/types'

export type EvaluationStatus = 'EVALUATING' | 'COMPLETED' | 'FAILED'

export interface EvaluationCriterionResult {
  criterionId: string
  score: number // e.g., 0 to 10
  evidence?: string
  concern?: string
  suggestion?: string
  confidence?: number // 0 to 1
}

export interface EvaluationResult {
  status: EvaluationStatus
  overallScore?: number
  error?: string
  results: EvaluationCriterionResult[]
}

/**
 * Core abstraction for Evaluators.
 * Allows swapping out Rule-based, AI-based, or Human evaluators in the future.
 */
export interface Evaluator {
  evaluate(
    submission: SubmissionContent,
    problem: ProblemWithDetails
  ): Promise<EvaluationResult>
}
