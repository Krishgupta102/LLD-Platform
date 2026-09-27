'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CriterionInfo {
  id: string
  dimension: string
  description: string
  maxScore: number
}

interface EvaluationResultItem {
  id: string
  criterionId: string
  score: number
  evidence?: string | null
  concern?: string | null
  suggestion?: string | null
  confidence?: number | null
  criterion: CriterionInfo
}

interface EvaluationData {
  id: string
  attemptId: string
  status: 'EVALUATING' | 'COMPLETED' | 'FAILED'
  overallScore?: number | null
  error?: string | null
  results: EvaluationResultItem[]
}

const DIMENSION_TITLES: Record<string, string> = {
  REQUIREMENTS: 'Functional Requirements Coverage',
  CLASS_DESIGN: 'Class & Object Modeling',
  INTERFACES: 'Interface & Abstraction Design',
  EXTENSIBILITY: 'Extensibility & Patterns',
  TRADE_OFFS: 'Trade-Offs & Edge Case Handling',
  SOLID_PRINCIPLES: 'SOLID Principles Application',
}

const DIMENSION_BADGES: Record<string, { bg: string; text: string }> = {
  REQUIREMENTS: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400' },
  CLASS_DESIGN: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400' },
  INTERFACES: { bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-400' },
  EXTENSIBILITY: { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400' },
  TRADE_OFFS: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' },
  SOLID_PRINCIPLES: { bg: 'bg-cyan-500/10 border-cyan-500/30', text: 'text-cyan-400' },
}

export function FeedbackClient({ attemptId, problemId }: { attemptId: string; problemId: string }) {
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout

    async function fetchEvaluation() {
      try {
        const res = await fetch(`/api/attempts/${attemptId}/evaluation`)
        if (res.status === 404) {
          // Evaluation not created yet, keep polling
          timer = setTimeout(fetchEvaluation, 2000)
          return
        }

        if (!res.ok) {
          throw new Error('Failed to load evaluation')
        }

        const data: EvaluationData = await res.json()
        setEvaluation(data)
        setLoading(false)

        if (data.status === 'EVALUATING') {
          // Poll until completed or failed
          timer = setTimeout(fetchEvaluation, 2500)
        }
      } catch (err) {
        console.error('Fetch evaluation error:', err)
        setError(err instanceof Error ? err.message : 'Error fetching evaluation')
        setLoading(false)
      }
    }

    fetchEvaluation()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [attemptId])

  if (loading || (evaluation && evaluation.status === 'EVALUATING')) {
    return (
      <div className="rounded-xl border border-border bg-surface p-12 text-center max-w-2xl mx-auto my-12 shadow-xl">
        <div className="relative flex items-center justify-center w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-accent/20 animate-ping" />
          <div className="w-16 h-16 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-3">Evaluating Your LLD Solution...</h2>
        <p className="text-muted leading-relaxed max-w-md mx-auto">
          Our evaluation system is running deterministic checks and rubric assessment on your design architecture.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  if (error || (evaluation && evaluation.status === 'FAILED')) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-8 text-center max-w-2xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          ✕
        </div>
        <h2 className="text-xl font-bold text-rose-300 mb-2">Evaluation Failed</h2>
        <p className="text-rose-400/80 text-sm mb-6">
          {evaluation?.error || error || 'An unexpected error occurred during evaluation.'}
        </p>
        <Link
          href={`/problems/${problemId}`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-surface border border-border text-foreground hover:bg-surface-hover transition-colors"
        >
          Return to Problem
        </Link>
      </div>
    )
  }

  if (!evaluation) {
    return null
  }

  // Calculate total possible score
  const totalMaxScore = evaluation.results.reduce(
    (acc, item) => acc + (item.criterion?.maxScore || 10),
    0
  )
  const userScore = evaluation.overallScore ?? evaluation.results.reduce((acc, item) => acc + item.score, 0)
  const percentage = totalMaxScore > 0 ? Math.round((userScore / totalMaxScore) * 100) : 0

  // Group results by dimension
  const groupedResults = evaluation.results.reduce<Record<string, EvaluationResultItem[]>>((acc, item) => {
    const dim = item.criterion?.dimension || 'GENERAL'
    if (!acc[dim]) acc[dim] = []
    acc[dim].push(item)
    return acc
  }, {})

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Overall Score Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-hover p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              ✓ Evaluation Complete
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">System Design Assessment</h1>
            <p className="text-muted text-sm mt-1">
              Here is the detailed rubric evaluation for your Low-Level Design submission.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-background/60 backdrop-blur border border-border/80 px-6 py-4 rounded-xl shadow-inner">
            <div className="text-right">
              <div className="text-xs font-medium text-muted uppercase tracking-wider">Overall Score</div>
              <div className="text-3xl font-black tracking-tight text-accent">
                {userScore} <span className="text-lg font-normal text-muted">/ {totalMaxScore}</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-accent/30 flex items-center justify-center font-extrabold text-lg text-accent bg-accent/10">
              {percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Criteria breakdown grouped by dimension */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight px-1">Detailed Rubric Feedback</h2>

        {Object.entries(groupedResults).map(([dimension, items]) => {
          const badgeStyle = DIMENSION_BADGES[dimension] || {
            bg: 'bg-surface border-border',
            text: 'text-foreground',
          }

          return (
            <div key={dimension} className="rounded-xl border border-border bg-surface p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono border ${badgeStyle.bg} ${badgeStyle.text}`}>
                    {dimension}
                  </span>
                  {DIMENSION_TITLES[dimension] || dimension}
                </h3>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border/60 bg-background/40 p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-foreground text-base">
                          {item.criterion?.description || 'Evaluation Criterion'}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold px-3 py-1 rounded-md bg-surface border border-border">
                          {item.score} / {item.criterion?.maxScore || 10} pts
                        </span>
                      </div>
                    </div>

                    {item.evidence && (
                      <div className="text-sm rounded-md bg-surface/80 p-3 border border-border/50 text-foreground/90">
                        <span className="font-semibold text-accent text-xs uppercase tracking-wider block mb-1">
                          Evidence Observed:
                        </span>
                        {item.evidence}
                      </div>
                    )}

                    {item.concern && (
                      <div className="text-sm rounded-md bg-amber-500/10 p-3 border border-amber-500/20 text-amber-200/90">
                        <span className="font-semibold text-amber-400 text-xs uppercase tracking-wider block mb-1">
                          Potential Concern:
                        </span>
                        {item.concern}
                      </div>
                    )}

                    {item.suggestion && (
                      <div className="text-sm rounded-md bg-emerald-500/10 p-3 border border-emerald-500/20 text-emerald-200/90">
                        <span className="font-semibold text-emerald-400 text-xs uppercase tracking-wider block mb-1">
                          Improvement Suggestion:
                        </span>
                        {item.suggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Link
          href="/"
          className="px-5 py-2.5 text-sm font-medium rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors"
        >
          ← Back to Dashboard
        </Link>
        <Link
          href={`/problems/${problemId}`}
          className="px-5 py-2.5 text-sm font-medium rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-md transition-all"
        >
          Try Another Problem →
        </Link>
      </div>
    </div>
  )
}
