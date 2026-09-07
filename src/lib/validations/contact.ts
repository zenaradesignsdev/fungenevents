import { z } from 'zod'
import { BUDGET_VALUES, EVENT_TYPES } from '@/lib/site-data'

/**
 * Shared enquiry-form schema — used by both the client form (react-hook-form
 * resolver) and the /api/contact route (server-side re-validation).
 *
 * The server side is the real gate: anything can POST to /api/contact directly,
 * so every field is bounded and the values that reach the outgoing email are
 * constrained to known-good sets rather than accepted as free text.
 *
 * Sanitising here uses refinements rather than transforms on purpose. A
 * transform makes zod's input and output types diverge, which the
 * react-hook-form resolver cannot line up; rejecting is also stricter, and no
 * real submission can trip these rules — the fields below are all <input>
 * elements, which cannot contain a newline in the first place.
 */

/** Single-line fields must not smuggle control characters into the email. */
const SINGLE_LINE = /[\x00-\x1F\x7F]/
/** The message is a textarea, so tabs and newlines are legitimate there. */
const MESSAGE_SAFE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/

const noControlChars = (value: string) => !SINGLE_LINE.test(value)

/** Optional single-line free text, capped and control-char free. */
const optionalLine = (max: number) =>
  z.string().trim().max(max).refine(noControlChars, 'Please remove any line breaks').optional().or(z.literal(''))

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name')
    .max(100)
    // `.trim()` only strips the ends, so an interior CR/LF used to survive into
    // the email subject. Resend posts JSON rather than speaking SMTP, so this
    // was not a live header-injection hole, but no raw newline should reach a
    // mail header.
    .refine(noControlChars, 'Please enter your name on one line'),
  // 254 is the RFC 5321 maximum. Without a cap this accepted arbitrarily long
  // strings, since .email() on its own bounds nothing.
  email: z.string().trim().max(254).email('Please enter a valid email'),
  phone: optionalLine(40),
  date: optionalLine(80),
  eventType: z.enum(EVENT_TYPES, { message: 'Please choose an event type' }),
  guests: optionalLine(40),
  // A <select> on the client, so the server accepts only those exact values.
  // Previously any string up to 40 chars passed through into the email.
  budget: z
    .enum(BUDGET_VALUES as unknown as [string, ...string[]])
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .max(4000)
    .refine((value) => !MESSAGE_SAFE.test(value), 'Please remove any control characters')
    .optional()
    .or(z.literal('')),
  // Honeypot — real users never fill this; bots often do. It must PASS schema
  // validation (bounded length only) so the API route can silently drop a
  // filled value with a 200, giving bots no signal that they were caught.
  company: z.string().max(200).optional().or(z.literal('')),
})

export type ContactFormValues = z.infer<typeof contactSchema>
