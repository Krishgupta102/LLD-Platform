import { Header } from '@/components/Header'
import { ProblemCard } from '@/components/ProblemCard'
import { StatusMessage } from '@/components/StatusMessage'
import { getAllProblems } from '@/application/problems/service'

export default async function DashboardPage() {
  const problems = await getAllProblems()

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero section */}
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight mb-3">
                Low-Level Design Practice
              </h1>
              <p className="text-muted text-lg leading-relaxed">
                Sharpen your object-oriented design skills. Pick a problem,
                design your solution, and get structured AI-powered feedback on
                your classes, abstractions, and trade-offs.
              </p>
            </div>
          </div>
        </section>

        {/* Problems grid */}
        <section className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Problems</h2>
            <span className="text-sm text-muted">
              {problems.length} problem{problems.length !== 1 ? 's' : ''} available
            </span>
          </div>

          {problems.length === 0 ? (
            <StatusMessage
              icon="empty"
              title="No problems yet"
              message="Check back soon — new LLD problems are being added."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {problems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
