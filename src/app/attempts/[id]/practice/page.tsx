import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { getAttemptWithProblem } from '@/application/attempts/service'
import { PracticeClient } from './PracticeClient'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Practice — LLD Coach',
}

export default async function PracticePage({ params }: Props) {
  const { id } = await params
  const attempt = await getAttemptWithProblem(id)

  if (!attempt) notFound()

  // If this attempt is already submitted, redirect to the evaluation page (Phase 7/8)
  if (attempt.status !== 'DRAFT') {
    redirect(`/attempts/${attempt.id}/feedback`)
  }

  const { problem } = attempt

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Details */}
        <section className="w-1/2 flex flex-col border-r border-border bg-surface/30 overflow-y-auto custom-scrollbar">
          <div className="p-8">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-accent/10 text-accent border-accent/20 mb-4">
              Attempt for
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-4">
              {problem.title}
            </h1>
            <p className="text-muted leading-relaxed mb-8">
              {problem.description}
            </p>

            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              Requirements
            </h2>
            <ul className="space-y-2.5">
              {problem.requirements.map((req, i) => (
                <li
                  key={req.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-md bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{req.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right Panel: Submission Form */}
        <section className="w-1/2 flex flex-col bg-background overflow-y-auto custom-scrollbar relative">
          <PracticeClient attemptId={attempt.id} />
        </section>
      </main>
    </div>
  )
}
