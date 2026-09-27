import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { getAttemptWithProblem } from '@/application/attempts/service'
import { FeedbackClient } from './FeedbackClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function FeedbackPage({ params }: Props) {
  const { id } = await params
  const attempt = await getAttemptWithProblem(id)

  if (!attempt) notFound()

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        <FeedbackClient attemptId={attempt.id} problemId={attempt.problemId} />
      </main>
    </>
  )
}
