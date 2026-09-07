/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Good enough for a single-region contact form on Vercel Fluid Compute, where
 * instances are reused across requests. For multi-region / high-traffic use,
 * swap this for @upstash/ratelimit + Redis (durable across instances).
 */
type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

// Opportunistically evict stale buckets so the Map can't grow unbounded.
function sweep(now: number) {
  if (buckets.size < 5000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 10 * 60 * 1000 }: { limit?: number; windowMs?: number } = {},
): { success: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now()
  sweep(now)

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) }
  }

  existing.count += 1
  return { success: true, remaining: limit - existing.count, retryAfterSeconds: 0 }
}
