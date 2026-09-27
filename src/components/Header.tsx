import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
            LD
          </div>
          <span className="text-lg font-semibold tracking-tight">
            LLD Coach
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-muted hover:text-foreground transition-colors"
          >
            Problems
          </Link>
          <Link
            href="/attempts"
            className="text-muted hover:text-foreground transition-colors"
          >
            My Attempts
          </Link>
        </nav>
      </div>
    </header>
  )
}
