import NextImage, { type ImageProps as NextImageProps } from 'next/image'

/**
 * Thin wrapper around next/image with project-standard defaults.
 *
 * Usage — fixed dimensions:
 *   <Image src="/photo.jpg" alt="..." width={800} height={600} />
 *
 * Usage — fill mode (parent must have position: relative + explicit dimensions):
 *   <div className="relative h-64 w-full">
 *     <Image src="/photo.jpg" alt="..." fill sizes="100vw" />
 *   </div>
 *
 * Usage — responsive above-the-fold image (always provide sizes):
 *   <Image
 *     src="/hero.jpg"
 *     alt="..."
 *     width={1600}
 *     height={900}
 *     priority
 *     sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px"
 *   />
 *
 * Usage — blur placeholder (generate blurDataURL with plaiceholder, added per-project):
 *   <Image src="/photo.jpg" alt="..." width={800} height={600} blurDataURL="data:..." />
 *
 * Notes:
 *   - `sizes` is optional but strongly recommended for any image wider than 640px.
 *     Without it, the browser fetches the largest srcset variant. Declare what the
 *     element actually measures at each breakpoint — under-declaring makes the
 *     browser pick a variant that is soft on retina screens.
 *   - `priority` should be set on the largest above-the-fold image per page (LCP element).
 *   - `placeholder="blur"` activates automatically when `blurDataURL` is provided.
 *   - OG images live in /public at 1200×630 and are referenced in metadata only —
 *     they are never rendered via this component.
 *   - Default quality is 72. AVIF/WebP at 72 is visually indistinguishable from 85
 *     on this site's photography while running ~28% smaller; raise it per-image only
 *     where fine detail demonstrably suffers.
 *   - `.svg` sources bypass the optimizer automatically (see below).
 */

type ImageProps = NextImageProps

export function Image({ quality = 72, placeholder, blurDataURL, unoptimized, ...props }: ImageProps) {
  const resolvedPlaceholder = blurDataURL ? 'blur' : (placeholder ?? 'empty')

  // The optimizer returns SVGs byte-identical, so routing the logo marks through
  // it only buys a round-trip and a billable transform on Vercel. Opt them out
  // unless a caller explicitly says otherwise.
  const isSvg = typeof props.src === 'string' && props.src.endsWith('.svg')

  return (
    <NextImage
      quality={quality}
      placeholder={resolvedPlaceholder}
      blurDataURL={blurDataURL}
      unoptimized={unoptimized ?? isSvg}
      {...props}
    />
  )
}
