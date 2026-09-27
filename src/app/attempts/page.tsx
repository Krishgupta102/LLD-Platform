import Link from 'next/link'
import { Header } from '@/components/Header'
import { StatusMessage } from '@/components/StatusMessage'
import { DifficultyBadge } from '@/components/DifficultyBadge'
import { prisma } from '@/infrastructure/database/prisma'
import { DEMO_USER_ID } from '@/lib/auth'
import type { Difficulty } from '@/domain/problem/types'

export const dynamic = 'force-dynamic'

export default async function AttemptsPage() {
  const attempts = await prisma.attempt.findMany({
    where: { userId: DEMO_USER_ID },
    include: {
      problem: {
        select: {
          id: true,
          title: true,
          difficulty: true,
        },
      },
      evaluation: {
        select: {
          id: true,
          status: true,
          overallScore: true,
        },
      },
      submission: {
        select: {
          id: true,
          format: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Completed
          </span>
        )
      case 'EVALUATING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
            Evaluating…
          </span>
        )
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Submitted
          </span>
        )
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Failed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Draft
          </span>
        )
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Attempts</h1>
            <p className="text-muted text-sm mt-1">
              Review your previous LLD solution submissions and feedback scores.
            </p>
          </div>
          <span className="text-sm text-muted">
            {attempts.length} attempt{attempts.length !== 1 ? 's' : ''} total
          </span>
        </div>

        {attempts.length === 0 ? (
          <StatusMessage
            icon="empty"
            title="No attempts yet"
            message="You haven't practiced any LLD problems yet. Choose a problem to start practicing!"
          />
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => {
              const formattedDate = new Date(attempt.createdAt).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )

              const isDraft = attempt.status === 'DRAFT'
              const href = isDraft
                ? `/attempts/${attempt.id}/practice`
                : `/attempts/${attempt.id}/feedback`

              return (
                <div
                  key={attempt.id}
                  className="rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link
                        href={href}
                        className="text-lg font-semibold hover:text-accent transition-colors"
                      >
                        {attempt.problem.title}
                      </Link>
                      <DifficultyBadge
                        difficulty={attempt.problem.difficulty as Difficulty}
                      />
                      {getStatusBadge(attempt.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted flex-wrap">
                      <span>Attempted on {formattedDate}</span>
                      {attempt.submission && (
                        <span>Format: {attempt.submission.format}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    {attempt.evaluation?.overallScore !== undefined &&
                      attempt.evaluation?.overallScore !== null && (
                        <div className="text-right">
                          <span className="text-xs text-muted block uppercase font-medium">
                            Score
                          </span>
                          <span className="text-xl font-bold text-accent">
                            {attempt.evaluation.overallScore} pts
                          </span>
                        </div>
                      )}

                    <Link
                      href={href}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-surface-hover border border-border hover:border-accent/40 hover:text-accent transition-all"
                    >
                      {isDraft ? 'Resume Draft →' : 'View Feedback →'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
