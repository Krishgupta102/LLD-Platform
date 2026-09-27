export type AttemptStatus = 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED'

export interface Attempt {
  id: string
  problemId: string
  userId: string
  status: AttemptStatus
  createdAt: Date
  updatedAt: Date
}
