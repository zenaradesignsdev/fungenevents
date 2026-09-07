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

  // The label column is intentionally NOT white-space:nowrap — with it, the label
  // set a 151px floor that pushed the whole table to 376px on a 360px phone.
  // Email HTML is deliberately old-fashioned: nested tables, inline styles, no
  // flexbox or <style> block. Outlook renders with Word's engine and Gmail strips
  // <head> styles, so anything more modern degrades badly. Brand palette only:
  // navy #1B2A41, gold #C9A227, warm white #FAF8F5, charcoal #333. Web fonts are
  // not reliable in mail, so Georgia and Arial stand in for Bodoni and Archivo,
  // which are already the fallbacks the site declares.
  const detailRows = rows
    .map(
      ([label, value], i) => `
        <tr>
          <td style="padding:${i === 0 ? '0' : '11px'} 18px 11px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#8A8A8A;vertical-align:top;">${label}</td>
          <td style="padding:${i === 0 ? '0' : '11px'} 0 11px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#333333;vertical-align:top;word-break:break-word;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('')

  const messageBlock = data.message
    ? `
      <tr>
        <td style="padding:30px 32px 0 32px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#8A8A8A;padding-bottom:10px;">In their words</div>
          <div style="border-left:2px solid #C9A227;padding:2px 0 2px 16px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#333333;white-space:pre-wrap;word-break:break-word;">${escapeHtml(data.message)}</div>
        </td>
      </tr>`
    : ''

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <!-- Without the charset the en-dash in a budget label ("$2,500 – $7,500")
       arrives as mojibake wherever the client does not assume UTF-8. -->
  <!-- Declares this as a light-mode design so Apple Mail and Outlook do not
       auto-invert the navy masthead into something muddy. -->
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>New enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#F2F2F2;">
  <!-- Inbox preview line; hidden in the body itself. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(
    `${data.eventType} enquiry from ${data.name}`,
  )}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F2F2F2;">
    <tr>
      <td align="center" style="padding:28px 12px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#FAF8F5;">

          <!-- Masthead -->
          <tr>
            <td style="background-color:#1B2A41;padding:28px 32px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:23px;letter-spacing:3.4px;text-transform:uppercase;color:#FAF8F5;">FunGen</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#C9A227;padding-top:7px;">Events &amp; Experiences</div>
            </td>
          </tr>
          <tr><td style="height:3px;background-color:#C9A227;font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- Heading -->
          <tr>
            <td style="padding:34px 32px 0 32px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2.6px;text-transform:uppercase;color:#C9A227;">New enquiry</div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.3;color:#1B2A41;padding-top:12px;">${escapeHtml(
                data.eventType,
              )} &middot; ${escapeHtml(data.name)}</div>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding:26px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailRows}</table>
            </td>
          </tr>

          <!-- Message: a full table row, or empty when none was written -->
          ${messageBlock}

          <!-- Reply hint -->
          <tr>
            <td style="padding:32px 32px 0 32px;">
              <div style="border-top:1px solid #E3E0DA;padding-top:20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:#6B6B6B;word-break:break-word;">
                Hit reply to answer ${escapeHtml(data.name.split(' ')[0] || 'them')} directly &mdash;
                this email is already addressed to
                <a href="mailto:${escapeHtml(data.email)}" style="color:#1B2A41;">${escapeHtml(
                  data.email,
                )}</a>.
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 30px 32px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.4px;color:#9A9A9A;">
                Sent from the enquiry form at fungenevents.ca
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

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
