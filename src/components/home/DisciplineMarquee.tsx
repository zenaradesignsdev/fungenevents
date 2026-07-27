import { DISCIPLINE_MARQUEE } from '@/lib/site-data'

const Row = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
  <div
    className="flex items-center gap-[46px] pr-[46px]"
    aria-hidden={ariaHidden || undefined}
  >
    {DISCIPLINE_MARQUEE.map((label, i) => (
      <span
        key={`${label}-${i}`}
        className="flex items-center gap-[46px] whitespace-nowrap font-sans text-[11px] font-light uppercase tracking-[0.34em] text-brand/60"
      >
        {label}
        <span className="block h-[5px] w-[5px] rotate-45 bg-gold" />
      </span>
    ))}
  </div>
)

export function DisciplineMarquee() {
  return (
    <div className="overflow-hidden border-y border-brand/10 bg-background py-[22px]">
      <div className="flex w-max motion-safe:animate-marquee motion-reduce:animate-none">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  )
}
