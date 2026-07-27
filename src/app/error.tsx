'use client'

import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-semibold tracking-tight">Error</h1>
      <p className="mt-4 text-muted-foreground">An unexpected error occurred.</p>
      <button
        onClick={reset}
        className="mt-8 text-sm underline underline-offset-4 hover:text-foreground"
      >
        Try again
      </button>
    </main>
  )
}
