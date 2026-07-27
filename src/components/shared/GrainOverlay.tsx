/**
 * Fixed, ultra-subtle film-grain texture that sits above page content but
 * below the nav (z-150). Purely decorative. The noise is an inline data-URI
 * SVG (allowed by the `img-src 'self' data:` CSP).
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[150] opacity-[0.038] [mix-blend-mode:multiply]"
      style={{ backgroundImage: NOISE, backgroundSize: '180px 180px' }}
    />
  )
}
