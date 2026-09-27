import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { DifficultyBadge } from '@/components/DifficultyBadge'
import { getProblemById } from '@/application/problems/service'
import { StartAttemptButton } from './StartAttemptButton'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const problem = await getProblemById(id)
  if (!problem) return { title: 'Problem Not Found — LLD Coach' }
  return {
    title: `${problem.title} — LLD Coach`,
    description: problem.description,
  }
}

export default async function ProblemDetailPage({ params }: Props) {
  const { id } = await params
  const problem = await getProblemById(id)
  if (!problem) notFound()

  const rubric = problem.rubrics[0]

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Problems
            </Link>
            <span>/</span>
            <span className="text-foreground">{problem.title}</span>
          </nav>

          {/* Title + difficulty */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              {problem.title}
            </h1>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>

          {/* Description */}
          <p className="text-muted leading-relaxed mb-10 text-[15px]">
            {problem.description}
          </p>

          {/* Requirements */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              Requirements
            </h2>
            <ul className="space-y-2">
              {problem.requirements.map((req, i) => (
                <li
                  key={req.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-md bg-accent/10 text-accent text-xs font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{req.text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Evaluation Rubric */}
          {rubric && (
            <section className="mb-12">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
                Evaluation Rubric
              </h2>
              <p className="text-sm text-muted mb-4">
                Your solution will be evaluated across these dimensions.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {rubric.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="rounded-lg border border-border bg-surface px-4 py-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {criterion.dimension}
                      </span>
                      <span className="text-xs text-muted">
                        /{criterion.maxScore}
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {criterion.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Action */}
          <div className="flex items-center gap-4">
            <StartAttemptButton problemId={problem.id} />
            <Link
              href="/"
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Back to Problems
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
