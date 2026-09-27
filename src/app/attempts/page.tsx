import { Header } from '@/components/Header'
import { StatusMessage } from '@/components/StatusMessage'

export default function AttemptsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-8">My Attempts</h1>
        <StatusMessage
          icon="empty"
          title="No attempts yet"
          message="Start practicing a problem to see your attempt history here."
        />
      </main>
    </>
  )
}
