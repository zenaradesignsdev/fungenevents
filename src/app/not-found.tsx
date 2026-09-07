import Link from 'next/link'
import { Image } from '@/components/ui/image'
import { CtaButton } from '@/components/shared/CtaButton'

export default function NotFound() {
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
        Error 404
      </span>
      <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(36px,6.5vw,72px)] font-normal leading-[1.08] text-balance">
        This page isn&apos;t on the guest list
      </h1>
      <p className="mt-6 max-w-[46ch] font-sans text-[15px] font-light leading-[1.9] text-brand-foreground/70 text-pretty">
        The link may have moved or expired. Head back to the homepage, or tell us what
        you&apos;re planning and we&apos;ll take it from there.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3.5">
        <CtaButton href="/" variant="gold">
          Return Home
        </CtaButton>
        <CtaButton href="/contact" variant="outline-light">
          Start Planning
        </CtaButton>
      </div>
    </main>
  )
}
