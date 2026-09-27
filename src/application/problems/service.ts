/**
 * Application service for Problem-related use cases.
 *
 * This layer sits between the API route handlers and the infrastructure.
 * It owns the query logic and maps Prisma models → domain types.
 */

import { prisma } from '@/infrastructure/database/prisma'
import type { ProblemSummary, ProblemWithDetails, Difficulty } from '@/domain/problem/types'

export async function getAllProblems(): Promise<ProblemSummary[]> {
  const problems = await prisma.problem.findMany({
    include: {
      _count: {
        select: { requirements: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  return problems.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    difficulty: p.difficulty as Difficulty,
    requirementCount: p._count.requirements,
  }))
}

export async function getProblemById(id: string): Promise<ProblemWithDetails | null> {
  const problem = await prisma.problem.findUnique({
    where: { id },
    include: {
      requirements: {
        select: { id: true, text: true },
      },
      rubrics: {
        include: {
          criteria: {
            select: {
              id: true,
              dimension: true,
              description: true,
              maxScore: true,
            },
          },
        },
      },
    },
  })

  if (!problem) return null

  return {
    id: problem.id,
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty as Difficulty,
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt,
    requirements: problem.requirements,
    rubrics: problem.rubrics.map((r) => ({
      id: r.id,
      criteria: r.criteria,
    })),
  }
}
