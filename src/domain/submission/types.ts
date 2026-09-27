/**
 * Submission Domain Types
 * 
 * Demonstrates Change Test A: Submission format can easily change 
 * by defining a new type and discriminated union.
 */

export type SubmissionFormat = 'TEXT' | 'DIAGRAM' | 'CODE'

export interface TextSubmissionContent {
  type: 'TEXT'
  classesAndResponsibilities: string
  interfacesAndAbstractions: string
  relationships: string
  designExplanation: string
  tradeOffs: string
  edgeCases: string
}

// Future implementations could be added here
export interface DiagramSubmissionContent {
  type: 'DIAGRAM'
  plantUml: string
}

export type SubmissionContent = TextSubmissionContent // | DiagramSubmissionContent | CodeSubmissionContent

export interface Submission {
  id: string
  attemptId: string
  content: SubmissionContent
  format: SubmissionFormat
  createdAt: Date
  updatedAt: Date
}
