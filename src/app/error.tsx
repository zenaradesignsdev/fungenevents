'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Image } from '@/components/ui/image'
import { CtaButton } from '@/components/shared/CtaButton'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand px-5 py-24 text-center text-brand-foreground sm:px-8">
      <Link href="/" aria-label="FunGen Events &amp; Experiences — home">
        <Image
          src="/images/fungen-mark-gold.svg"
          alt=""
          width={23}
          height={58}
          priority
          className="h-[58px] w-auto"
        />
      </Link>
      <span className="mt-9 block font-sans text-[10px] uppercase tracking-[0.4em] text-gold">
        Something went wrong
      </span>
      <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(36px,6.5vw,72px)] font-normal leading-[1.08] text-balance">
        A hiccup behind the scenes
      </h1>
      <p className="mt-6 max-w-[46ch] font-sans text-[15px] font-light leading-[1.9] text-brand-foreground/70 text-pretty">
        This one is on us. Try again in a moment, and if it keeps happening, call us
        and we&apos;ll sort it out with you.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3.5">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-4 rounded-full bg-gold px-10 py-[21px] font-sans text-[11px] font-normal uppercase tracking-[0.28em] text-brand ring-offset-background transition-colors duration-500 hover:bg-brand-foreground hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          Try Again
        </button>
        <CtaButton href="/" variant="outline-light">
          Return Home
        </CtaButton>
      </div>
    </main>
  )
}
