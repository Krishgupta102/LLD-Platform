import { NextResponse } from 'next/server'
import { getAttemptWithProblem } from '@/application/attempts/service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const attempt = await getAttemptWithProblem(id)

    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found' },
        { status: 404 }
      )
    }

    // Ensure it belongs to the active user (hardcoded for MVP)
    if (attempt.userId !== 'demo-learner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(attempt)
  } catch (error) {
    console.error('Failed to fetch attempt:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attempt' },
      { status: 500 }
    )
  }
}
