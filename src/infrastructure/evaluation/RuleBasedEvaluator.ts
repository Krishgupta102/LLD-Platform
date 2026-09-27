import type { Evaluator, EvaluationResult, EvaluationCriterionResult } from '@/domain/evaluation/types'
import type { ProblemWithDetails } from '@/domain/problem/types'
import type { SubmissionContent } from '@/domain/submission/types'

export class RuleBasedEvaluator implements Evaluator {
  async evaluate(
    submission: SubmissionContent,
    problem: ProblemWithDetails
  ): Promise<EvaluationResult> {
    const results: EvaluationCriterionResult[] = []
    
    // We expect the problem to have at least one rubric with criteria.
    const rubric = problem.rubrics[0]
    if (!rubric) {
      return {
        status: 'FAILED',
        error: 'No rubric found for problem',
        results: [],
      }
    }

    if (submission.type !== 'TEXT') {
      return {
        status: 'FAILED',
        error: 'Only TEXT submissions are currently supported by this evaluator.',
        results: [],
      }
    }

    // A deterministic check: did they provide content for all sections?
    // In a hybrid model, this evaluator might fail early or provide a base score.
    const hasAllSections = 
      submission.classesAndResponsibilities.length > 20 &&
      submission.interfacesAndAbstractions.length > 20 &&
      submission.relationships.length > 20 &&
      submission.designExplanation.length > 20 &&
      submission.tradeOffs.length > 20 &&
      submission.edgeCases.length > 20

    if (!hasAllSections) {
      // Find a suitable criterion to penalize, e.g., "Requirement Understanding"
      const reqCriterion = rubric.criteria.find((c) => c.dimension.includes('Requirement') || c.dimension.includes('Understanding'))
      
      if (reqCriterion) {
        results.push({
          criterionId: reqCriterion.id,
          score: 0,
          evidence: 'The submission lacked sufficient detail in one or more required sections.',
          concern: 'Sections were too brief or missing entirely.',
          suggestion: 'Ensure you fill out all sections (Classes, Interfaces, Relationships, etc.) with enough detail.',
          confidence: 1.0,
        })
      }

      return {
        status: 'COMPLETED',
        overallScore: 0,
        results,
      }
    }

    // If it passes basic deterministic checks, we return a baseline success.
    // In Phase 6, the AI Evaluator will take this passed submission and run real judgment.
    return {
      status: 'COMPLETED',
      results: [],
    }
  }
}
