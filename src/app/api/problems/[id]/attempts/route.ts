import { NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma'

const DEMO_USER_ID = 'demo-learner'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await params

    // Verify problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    })

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    // Create a new attempt in DRAFT status
    const attempt = await prisma.attempt.create({
      data: {
        problemId,
        userId: DEMO_USER_ID,
        status: 'DRAFT',
      },
    })

    return NextResponse.json(attempt, { status: 201 })
  } catch (error) {
    console.error('Failed to create attempt:', error)
    return NextResponse.json(
      { error: 'Failed to create attempt' },
      { status: 500 }
    )
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await params

    const attempts = await prisma.attempt.findMany({
      where: { problemId, userId: DEMO_USER_ID },
      include: {
        submission: { select: { id: true, format: true, createdAt: true } },
        evaluation: { select: { id: true, status: true, overallScore: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(attempts)
  } catch (error) {
    console.error('Failed to fetch attempts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attempts' },
      { status: 500 }
    )
  }
}
