import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from '@/lib/validations/contact'
import { businessInfo } from '@/lib/metadata'
import { logger } from '@/lib/logger'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export async function POST(request: Request) {
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

  const rows: [string, string][] = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone || '—'],
    ['Event type', data.eventType],
    ['Event date', data.date || '—'],
    ['Estimated guests', data.guests || '—'],
    ['Budget range', data.budget || '—'],
  ]

  const html = `
    <h2 style="font-family:Georgia,serif;color:#1B2A41;">New enquiry — FunGen Events</h2>
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

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `New enquiry — ${data.eventType} — ${data.name}`,
      html,
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
