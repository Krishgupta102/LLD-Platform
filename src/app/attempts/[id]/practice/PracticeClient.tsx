'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PracticeClientProps {
  attemptId: string
}

export function PracticeClient({ attemptId }: PracticeClientProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    classesAndResponsibilities: '',
    interfacesAndAbstractions: '',
    relationships: '',
    designExplanation: '',
    tradeOffs: '',
    edgeCases: '',
  })

  const handleChange = (field: keyof typeof form, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/attempts/${attemptId}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TEXT',
          ...form,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to submit')
      }

      // Route to feedback page showing EVALUATING status
      router.push(`/attempts/${attemptId}/feedback`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setSubmitting(false)
    }
  }

  const sections = [
    {
      id: 'classesAndResponsibilities',
      title: 'Classes and Responsibilities',
      desc: 'Define the core entities and what they are responsible for.',
    },
    {
      id: 'interfacesAndAbstractions',
      title: 'Interfaces & Abstractions',
      desc: 'What behaviors are abstracted? What contracts exist?',
    },
    {
      id: 'relationships',
      title: 'Relationships',
      desc: 'How do these classes interact (Composition, Inheritance, etc)?',
    },
    {
      id: 'designExplanation',
      title: 'Design Explanation',
      desc: 'Walk through a main use case using your design.',
    },
    {
      id: 'tradeOffs',
      title: 'Trade-offs',
      desc: 'What are the downsides of this specific design choice?',
    },
    {
      id: 'edgeCases',
      title: 'Edge Cases',
      desc: 'What unexpected scenarios did you handle?',
    },
  ] as const

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 p-8 space-y-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight mb-2">
            Your Solution
          </h2>
          <p className="text-muted text-sm">
            Flesh out your Low-Level Design below. The AI evaluator will look for
            evidence of solid object-oriented principles in your text.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        {sections.map((sec) => (
          <div key={sec.id} className="space-y-2 group">
            <label
              htmlFor={sec.id}
              className="block font-medium text-foreground group-focus-within:text-accent transition-colors"
            >
              {sec.title}
            </label>
            <p className="text-xs text-muted mb-2">{sec.desc}</p>
            <textarea
              id={sec.id}
              required
              minLength={10}
              value={form[sec.id]}
              onChange={(e) => handleChange(sec.id, e.target.value)}
              className="w-full min-h-[120px] rounded-lg border border-border bg-surface/50 p-4 text-sm font-mono placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-y custom-scrollbar"
              placeholder={`Enter your ${sec.title.toLowerCase()} here...`}
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 p-6 bg-surface/90 backdrop-blur-md border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted">
          Your progress is not auto-saved yet.
        </span>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {submitting && (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          )}
          {submitting ? 'Submitting...' : 'Submit Design for Feedback'}
        </button>
      </div>
    </form>
  )
}
