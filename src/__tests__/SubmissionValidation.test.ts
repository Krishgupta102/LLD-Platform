import { describe, it, expect } from 'vitest'
import { z } from 'zod'

const textSubmissionSchema = z.object({
  type: z.literal('TEXT'),
  classesAndResponsibilities: z.string().min(10, 'Classes description must be at least 10 characters'),
  interfacesAndAbstractions: z.string().min(10, 'Interfaces description must be at least 10 characters'),
  relationships: z.string().min(10, 'Relationships description must be at least 10 characters'),
  designExplanation: z.string().min(10, 'Design explanation must be at least 10 characters'),
  tradeOffs: z.string().min(10, 'Trade-offs description must be at least 10 characters'),
  edgeCases: z.string().min(10, 'Edge cases description must be at least 10 characters'),
})

describe('Submission Validation Schema', () => {
  it('validates a correct submission object successfully', () => {
    const validPayload = {
      type: 'TEXT',
      classesAndResponsibilities: 'Sufficiently detailed classes content',
      interfacesAndAbstractions: 'Sufficiently detailed interfaces content',
      relationships: 'Sufficiently detailed relationships content',
      designExplanation: 'Sufficiently detailed design explanation content',
      tradeOffs: 'Sufficiently detailed trade-offs content',
      edgeCases: 'Sufficiently detailed edge cases content',
    }

    const result = textSubmissionSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejects an empty submission payload', () => {
    const emptyPayload = {}
    const result = textSubmissionSchema.safeParse(emptyPayload)
    expect(result.success).toBe(false)
  })

  it('rejects a submission missing a required section', () => {
    const payloadMissingSection = {
      type: 'TEXT',
      classesAndResponsibilities: 'Sufficiently detailed classes content',
      interfacesAndAbstractions: 'Sufficiently detailed interfaces content',
      // relationships missing
      designExplanation: 'Sufficiently detailed design explanation content',
      tradeOffs: 'Sufficiently detailed trade-offs content',
      edgeCases: 'Sufficiently detailed edge cases content',
    }

    const result = textSubmissionSchema.safeParse(payloadMissingSection)
    expect(result.success).toBe(false)
  })

  it('rejects a section with fewer than 10 characters', () => {
    const shortPayload = {
      type: 'TEXT',
      classesAndResponsibilities: 'Too short',
      interfacesAndAbstractions: 'Sufficiently detailed interfaces content',
      relationships: 'Sufficiently detailed relationships content',
      designExplanation: 'Sufficiently detailed design explanation content',
      tradeOffs: 'Sufficiently detailed trade-offs content',
      edgeCases: 'Sufficiently detailed edge cases content',
    }

    const result = textSubmissionSchema.safeParse(shortPayload)
    expect(result.success).toBe(false)
  })
})
