'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface StartAttemptButtonProps {
  problemId: string
}

export function StartAttemptButton({ problemId }: StartAttemptButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleStart() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/problems/${problemId}/attempts`, {
        method: 'POST',
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to create attempt')
      }
      const attempt = await res.json()
      router.push(`/attempts/${attempt.id}/practice`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleStart}
        disabled={loading}
        className="px-6 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Creating…
          </span>
        ) : (
          'Start Practice'
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-danger">{error}</p>
      )}
    </div>
  )
}
