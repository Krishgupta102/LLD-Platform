/**
 * Domain types for the Problem aggregate.
 *
 * These types represent the domain view of a Problem — they are decoupled
 * from the Prisma model so the rest of the application doesn't depend
 * directly on the ORM's generated types.
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Requirement {
  id: string
  text: string
}

export interface RubricCriterion {
  id: string
  dimension: string
  description: string
  maxScore: number
}

export interface Rubric {
  id: string
  criteria: RubricCriterion[]
}

export interface Problem {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  createdAt: Date
  updatedAt: Date
}

/** Problem with all nested relations loaded. */
export interface ProblemWithDetails extends Problem {
  requirements: Requirement[]
  rubrics: Rubric[]
}

/** Lightweight problem summary used on the dashboard. */
export interface ProblemSummary {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  requirementCount: number
}
