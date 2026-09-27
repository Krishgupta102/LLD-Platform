import { NextResponse } from 'next/server'
import { getAllProblems } from '@/application/problems/service'

export async function GET() {
  try {
    const problems = await getAllProblems()
    return NextResponse.json(problems)
  } catch (error) {
    console.error('Failed to fetch problems:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    )
  }
}
