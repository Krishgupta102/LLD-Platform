import { prisma } from '@/infrastructure/database/prisma'
import { getAttemptWithProblem } from '@/application/attempts/service'
import { RuleBasedEvaluator } from '@/infrastructure/evaluation/RuleBasedEvaluator'
import { AIEvaluator } from '@/infrastructure/evaluation/AIEvaluator'
import { GeminiProvider } from '@/infrastructure/ai/GeminiProvider'
import type { SubmissionContent } from '@/domain/submission/types'
import type { EvaluationResult } from '@/domain/evaluation/types'

export async function processEvaluation(attemptId: string) {
  // 1. Fetch attempt and problem
  const attempt = await getAttemptWithProblem(attemptId)
  if (!attempt || !attempt.submissionId) {
    throw new Error('Attempt or Submission not found')
  }

  // 2. Transition state to EVALUATING and create initial Evaluation record
  let evaluation = await prisma.evaluation.findUnique({
    where: { attemptId }
  })
  
  if (!evaluation) {
    evaluation = await prisma.evaluation.create({
      data: {
        attemptId,
        status: 'EVALUATING'
      }
    })
  } else {
    // If it already existed and failed, we can reset it to EVALUATING for retry
    evaluation = await prisma.evaluation.update({
      where: { attemptId },
      data: { status: 'EVALUATING', error: null }
    })
  }

  await prisma.attempt.update({
    where: { id: attemptId },
    data: { status: 'EVALUATING' }
  })

  try {
    const submissionRecord = await prisma.submission.findUnique({
      where: { id: attempt.submissionId }
    })
    
    if (!submissionRecord) throw new Error('Submission content missing')
    
    const content = JSON.parse(submissionRecord.content) as SubmissionContent

    // 3. Hybrid Evaluation Execution
    // First, run deterministic checks
    const ruleEvaluator = new RuleBasedEvaluator()
    const ruleResult = await ruleEvaluator.evaluate(content, attempt.problem)

    let finalResult: EvaluationResult

    if (ruleResult.status === 'COMPLETED' && ruleResult.results.length === 0) {
      // Deterministic checks passed — run AI evaluation
      if (process.env.GEMINI_API_KEY) {
        const provider = new GeminiProvider()
        const aiEvaluator = new AIEvaluator(provider)
        finalResult = await aiEvaluator.evaluate(content, attempt.problem)
      } else {
        // No AI key configured — provide deterministic-only feedback
        console.warn('GEMINI_API_KEY not set. Using deterministic evaluation only.')
        const rubric = attempt.problem.rubrics[0]
        finalResult = {
          status: 'COMPLETED',
          overallScore: rubric ? rubric.criteria.reduce((s, c) => s + c.maxScore, 0) : 0,
          results: rubric ? rubric.criteria.map((c) => ({
            criterionId: c.id,
            score: c.maxScore,
            evidence: 'Passed deterministic checks. AI evaluation unavailable (no API key configured).',
            confidence: 0.5,
          })) : [],
        }
      }
    } else {
      // Deterministic checks caught issues — use those results directly
      finalResult = ruleResult
    }

    // 4. Persist Results
    if (finalResult.status === 'FAILED') {
      throw new Error(finalResult.error || 'Evaluation failed')
    }

    // Save criteria results
    await prisma.$transaction(async (tx) => {
      // Clear old results if it's a retry
      await tx.evaluationResult.deleteMany({
        where: { evaluationId: evaluation!.id }
      })

      for (const res of finalResult.results) {
        await tx.evaluationResult.create({
          data: {
            evaluationId: evaluation!.id,
            criterionId: res.criterionId,
            score: res.score,
            evidence: res.evidence,
            concern: res.concern,
            suggestion: res.suggestion,
            confidence: res.confidence,
          }
        })
      }

      await tx.evaluation.update({
        where: { id: evaluation!.id },
        data: { 
          status: 'COMPLETED',
          overallScore: finalResult.overallScore
        }
      })

      await tx.attempt.update({
        where: { id: attemptId },
        data: { status: 'COMPLETED' }
      })
    })

  } catch (err) {
    console.error('Evaluation processing error:', err)
    // 5. Handle Failure (Transition to FAILED)
    await prisma.$transaction([
      prisma.evaluation.update({
        where: { id: evaluation.id },
        data: { 
          status: 'FAILED', 
          error: err instanceof Error ? err.message : 'Unknown evaluation error' 
        }
      }),
      prisma.attempt.update({
        where: { id: attemptId },
        data: { status: 'FAILED' }
      })
    ])
  }
}
