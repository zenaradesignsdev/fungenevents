import { Image } from '@/components/ui/image'

export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background"
      aria-label="Loading"
      role="status"
    >
      <Image
        src="/images/fungen-mark-gold-deep.svg"
        alt=""
        width={43}
        height={48}
        priority
        className="h-12 w-auto motion-safe:animate-pulse"
      />
    </div>
  )
}
