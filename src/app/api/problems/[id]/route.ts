import { NextResponse } from 'next/server'
import { getProblemById } from '@/application/problems/service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const problem = await getProblemById(id)

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(problem)
  } catch (error) {
    console.error('Failed to fetch problem:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    )
  }
}
