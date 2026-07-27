import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-semibold tracking-tight">404</h1>
      <p className="mt-4 text-muted-foreground">This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 text-sm underline underline-offset-4 hover:text-foreground"
      >
        Return home
      </Link>
    </main>
  )
}
