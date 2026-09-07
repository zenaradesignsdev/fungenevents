import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/validations/contact'
import { rateLimit } from '@/lib/rate-limit'
import { businessInfo } from '@/lib/metadata'
import { BUDGET_RANGES } from '@/lib/site-data'
import { logger } from '@/lib/logger'

/**
 * `x-real-ip` first: Vercel sets it and a client cannot forge it. `x-forwarded-for`
 * is only consulted as a fallback, because its leftmost entry is whatever the
 * caller put there on any host that does not overwrite the header — which would
 * let one attacker rotate a fresh "IP" per request and walk straight past the
 * rate limiter.
 */
function clientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}

/**
 * Same-origin guard. A browser sends `Origin` on every cross-origin POST, so a
 * mismatch is a request no first-party form made. Absent `Origin` is allowed
 * through (non-browser callers, and some proxies strip it); the rate limiter and
 * honeypot still apply to those.
 */
function isCrossOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  const host = request.headers.get('host')
  try {
    return new URL(origin).host !== host
  } catch {
    return true
  }
}

/** Vercel caps bodies well above this; the form's own fields cap out near 5KB. */
const MAX_BODY_BYTES = 64 * 1024

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Bounded so a hung Resend call cannot hold a function open indefinitely. */
export const maxDuration = 15

export async function POST(request: Request) {
  if (isCrossOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body too large.' }, { status: 413 })
  }

  // Rate limit by IP before doing any work, to blunt abuse of the
  // email-sending endpoint (5 requests / 10 minutes).
  const limit = rateLimit(`contact:${clientIp(request)}`)
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many enquiries from this device. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the form and try again.', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const data = parsed.data

  // Honeypot tripped — silently accept so bots get no signal, but send nothing.
  if (data.company) {
    return NextResponse.json({ ok: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !toEmail || !fromEmail) {
    logger.error('Contact form: RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not configured.')
    return NextResponse.json(
      { error: 'Our enquiry system is being set up. Please call or email the studio directly for now.' },
      { status: 503 },
    )
  }

  // The select posts slugs ("7500-15000"); the studio should read the label.
  const budgetLabel = BUDGET_RANGES.find((range) => range.value === data.budget)?.label

  const rows: [string, string][] = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone || '—'],
    ['Event type', data.eventType],
    ['Event date', data.date || '—'],
    ['Estimated guests', data.guests || '—'],
    // The placeholder option's label ("Select a range") is not an answer.
    ['Budget range', (data.budget && budgetLabel) || '—'],
  ]

  const html = `
    <h2 style="font-family:Georgia,serif;color:#1B2A41;">New enquiry: FunGen Events</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;color:#333;border-collapse:collapse;">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:6px 16px 6px 0;color:#777;">${label}</td><td style="padding:6px 0;"><strong>${escapeHtml(value)}</strong></td></tr>`,
        )
        .join('')}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#333;margin-top:16px;white-space:pre-wrap;">${escapeHtml(
      data.message || 'No message provided.',
    )}</p>
  `

  const text = [
    'New enquiry: FunGen Events',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    data.message || 'No message provided.',
  ].join('\n')

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      // Belt and braces: the schema already rejects control characters in
      // `name`, but nothing should be able to put a newline in a header even if
      // that rule is ever relaxed.
      subject: `New enquiry: ${data.eventType}, ${data.name}`.replace(/[\r\n]+/g, ' '),
      html,
      // Plain-text alternative: HTML-only mail scores worse with spam filters.
      text,
    })

    if (error) {
      logger.error('Contact form: Resend returned an error', error)
      return NextResponse.json({ error: 'We could not send your enquiry. Please try again shortly.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('Contact form: unexpected send failure', err)
    return NextResponse.json(
      { error: `Something went wrong. Please call the studio at ${businessInfo.telephoneDisplay}.` },
      { status: 500 },
    )
  }
}
