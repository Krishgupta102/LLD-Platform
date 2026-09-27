import { NextResponse } from 'next/server'
import { submitAttempt } from '@/application/attempts/service'
import { processEvaluation } from '@/application/evaluation/service'
import type { SubmissionContent } from '@/domain/submission/types'
import { z } from 'zod'

// Basic validation for the text submission format
const textSubmissionSchema = z.object({
  type: z.literal('TEXT'),
  classesAndResponsibilities: z.string().min(10, 'Classes description must be at least 10 characters'),
  interfacesAndAbstractions: z.string().min(10, 'Interfaces description must be at least 10 characters'),
  relationships: z.string().min(10, 'Relationships description must be at least 10 characters'),
  designExplanation: z.string().min(10, 'Design explanation must be at least 10 characters'),
  tradeOffs: z.string().min(10, 'Trade-offs description must be at least 10 characters'),
  edgeCases: z.string().min(10, 'Edge cases description must be at least 10 characters'),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: attemptId } = await params
    const body = await request.json()

    // Validate incoming structure
    const parsed = textSubmissionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const content = parsed.data as SubmissionContent

    // Persist submission first (safe even if evaluation fails later)
    await submitAttempt(attemptId, content)

    // Trigger evaluation pipeline (fire-and-forget so the user gets an immediate response)
    // The evaluation status can be polled via GET /api/attempts/:id/evaluation
    processEvaluation(attemptId).catch((err) => {
      console.error('Background evaluation failed:', err)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to submit attempt:', error)
    const msg = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json(
      { error: msg },
      { status: msg.includes('already submitted') ? 409 : 500 }
    )
  }
}
