import { NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: attemptId } = await params

    const evaluation = await prisma.evaluation.findUnique({
      where: { attemptId },
      include: {
        results: {
          include: {
            criterion: {
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

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Failed to fetch evaluation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch evaluation' },
      { status: 500 }
    )
  }
}
