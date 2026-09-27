import { z } from 'zod'
import type { Evaluator, EvaluationResult, EvaluationCriterionResult } from '@/domain/evaluation/types'
import type { ProblemWithDetails } from '@/domain/problem/types'
import type { TextSubmissionContent, SubmissionContent } from '@/domain/submission/types'
import type { LLMProvider } from '@/infrastructure/ai/types'

// Zod schema for validating AI response
const aiCriterionResultSchema = z.object({
  dimension: z.string(),
  score: z.number().min(0).max(10),
  evidence: z.string(),
  concern: z.string(),
  suggestion: z.string(),
  confidence: z.number().min(0).max(1),
})

const aiEvaluationSchema = z.object({
  criteria: z.array(aiCriterionResultSchema),
})

function buildPrompt(
  submission: TextSubmissionContent,
  problem: ProblemWithDetails
): string {
  const rubric = problem.rubrics[0]
  const rubricDimensions = rubric
    ? rubric.criteria.map((c) => `- ${c.dimension} (max ${c.maxScore} pts): ${c.description}`).join('\n')
    : 'No rubric available'

  const requirements = problem.requirements.map((r) => `- ${r.text}`).join('\n')

  return `You are an expert Low-Level Design (LLD) evaluator. You are evaluating a learner's text-based design submission for the problem described below.

## Problem: ${problem.title}
${problem.description}

## Requirements
${requirements}

## Evaluation Rubric
Score each dimension from 0 to 10. Different valid designs should be accepted — do NOT penalize for choosing a different but valid approach.
${rubricDimensions}

## Learner's Submission

### Classes and Responsibilities
${submission.classesAndResponsibilities}

### Interfaces & Abstractions
${submission.interfacesAndAbstractions}

### Relationships
${submission.relationships}

### Design Explanation
${submission.designExplanation}

### Trade-offs
${submission.tradeOffs}

### Edge Cases
${submission.edgeCases}

## Instructions
For EACH rubric dimension above, provide:
1. **score**: A numeric score from 0 to 10.
2. **evidence**: A specific quote or reference from the submission that supports your score.
3. **concern**: What is weak or missing in this dimension.
4. **suggestion**: A specific, actionable improvement the learner can make.
5. **confidence**: How confident you are in this score (0.0 to 1.0).

Respond ONLY with valid JSON matching this exact schema:
{
  "criteria": [
    {
      "dimension": "Dimension Name",
      "score": 8,
      "evidence": "The submission states...",
      "concern": "However, ...",
      "suggestion": "Consider ...",
      "confidence": 0.85
    }
  ]
}

IMPORTANT: You must return exactly one entry per rubric dimension listed above. Do not add extra dimensions.`
}

export class AIEvaluator implements Evaluator {
  private provider: LLMProvider

  constructor(provider: LLMProvider) {
    this.provider = provider
  }

  async evaluate(
    submission: SubmissionContent,
    problem: ProblemWithDetails
  ): Promise<EvaluationResult> {
    if (submission.type !== 'TEXT') {
      return {
        status: 'FAILED',
        error: 'Only TEXT submissions are supported by the AI evaluator.',
        results: [],
      }
    }

    const rubric = problem.rubrics[0]
    if (!rubric) {
      return {
        status: 'FAILED',
        error: 'No rubric found for this problem.',
        results: [],
      }
    }

    const prompt = buildPrompt(submission, problem)

    let rawResponse: string
    try {
      rawResponse = await this.provider.complete(prompt)
    } catch (err) {
      return {
        status: 'FAILED',
        error: `AI provider error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        results: [],
      }
    }

    // Validate AI response with Zod — do NOT blindly trust malformed output
    let parsed: z.infer<typeof aiEvaluationSchema>
    try {
      const json = JSON.parse(rawResponse)
      parsed = aiEvaluationSchema.parse(json)
    } catch (err) {
      console.error('AI response validation failed:', err, '\nRaw:', rawResponse)
      return {
        status: 'FAILED',
        error: 'AI returned malformed evaluation output. Please retry.',
        results: [],
      }
    }

    // Map AI dimension names back to rubric criterion IDs
    const results: EvaluationCriterionResult[] = parsed.criteria.map((aiResult) => {
      // Find matching criterion by dimension name (fuzzy match)
      const criterion = rubric.criteria.find(
        (c) => c.dimension.toLowerCase() === aiResult.dimension.toLowerCase()
      ) || rubric.criteria.find(
        (c) => c.dimension.toLowerCase().includes(aiResult.dimension.toLowerCase()) ||
               aiResult.dimension.toLowerCase().includes(c.dimension.toLowerCase())
      )

      return {
        criterionId: criterion?.id || rubric.criteria[0].id,
        score: Math.min(aiResult.score, criterion?.maxScore || 10),
        evidence: aiResult.evidence,
        concern: aiResult.concern,
        suggestion: aiResult.suggestion,
        confidence: aiResult.confidence,
      }
    })

    const overallScore = results.reduce((sum, r) => sum + r.score, 0)

    return {
      status: 'COMPLETED',
      overallScore,
      results,
    }
  }
}
