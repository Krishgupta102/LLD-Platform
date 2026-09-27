import Link from 'next/link'
import type { ProblemSummary } from '@/domain/problem/types'
import { DifficultyBadge } from './DifficultyBadge'

interface ProblemCardProps {
  problem: ProblemSummary
}

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <Link
      href={`/problems/${problem.id}`}
      className="group block rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:border-accent/40 hover:bg-surface-hover hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h2 className="text-lg font-semibold group-hover:text-accent-hover transition-colors">
          {problem.title}
        </h2>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
        {problem.description}
      </p>

      <div className="flex items-center justify-between text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
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
          {problem.requirementCount} requirements
        </span>
        <span className="text-accent group-hover:text-accent-hover transition-colors font-medium">
          Start Practice →
        </span>
      </div>
    </Link>
  )
}
