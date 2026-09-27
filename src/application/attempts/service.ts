import { prisma } from '@/infrastructure/database/prisma'
import type { Attempt, AttemptStatus } from '@/domain/attempt/types'
import type { ProblemWithDetails, Difficulty } from '@/domain/problem/types'
import type { SubmissionContent } from '@/domain/submission/types'

export interface AttemptWithDetails extends Attempt {
  problem: ProblemWithDetails
  submissionId?: string
}

export async function getAttemptWithProblem(id: string): Promise<AttemptWithDetails | null> {
  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: {
      problem: {
        include: {
          requirements: true,
          rubrics: {
            include: { criteria: true }
          }
        }
      },
      submission: { select: { id: true } }
    }
  })

  if (!attempt) return null

  return {
    id: attempt.id,
    problemId: attempt.problemId,
    userId: attempt.userId,
    status: attempt.status as AttemptStatus,
    createdAt: attempt.createdAt,
    updatedAt: attempt.updatedAt,
    submissionId: attempt.submission?.id,
    problem: {
      id: attempt.problem.id,
      title: attempt.problem.title,
      description: attempt.problem.description,
      difficulty: attempt.problem.difficulty as Difficulty,
      createdAt: attempt.problem.createdAt,
      updatedAt: attempt.problem.updatedAt,
      requirements: attempt.problem.requirements,
      rubrics: attempt.problem.rubrics,
    }
  }
}

export async function submitAttempt(
  attemptId: string, 
  content: SubmissionContent
) {
  // 1. Verify attempt exists and is in DRAFT state
  const attempt = await prisma.attempt.findUnique({ where: { id: attemptId } })
  if (!attempt) throw new Error('Attempt not found')
  if (attempt.status !== 'DRAFT') {
    throw new Error('Attempt is already submitted or evaluating')
  }

  // 2. Persist submission first!
  // Doing it in a transaction to safely transition state to SUBMITTED
  const result = await prisma.$transaction(async (tx) => {
    const submission = await tx.submission.create({
      data: {
        attemptId,
        content: JSON.stringify(content),
        format: content.type
      }
    })

    const updatedAttempt = await tx.attempt.update({
      where: { id: attemptId },
      data: { status: 'SUBMITTED' }
    })

    return { submission, updatedAttempt }
  })

  return result
}
