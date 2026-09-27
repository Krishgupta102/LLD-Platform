import type { Difficulty } from '@/domain/problem/types'

const config: Record<Difficulty, { label: string; className: string }> = {
  Easy: {
    label: 'Easy',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  },
  Medium: {
    label: 'Medium',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  },
  Hard: {
    label: 'Hard',
    className: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  },
}

interface DifficultyBadgeProps {
  difficulty: Difficulty
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { label, className } = config[difficulty]
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  )
}
