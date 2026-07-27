import { z } from 'zod'
import { EVENT_TYPES } from '@/lib/site-data'

/**
 * Shared enquiry-form schema — used by both the client form (react-hook-form
 * resolver) and the /api/contact route (server-side re-validation).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().email('Please enter a valid email'),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  date: z.string().trim().max(80).optional().or(z.literal('')),
  eventType: z.enum(EVENT_TYPES as unknown as [string, ...string[]], {
    message: 'Please choose an event type',
  }),
  guests: z.string().trim().max(40).optional().or(z.literal('')),
  budget: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().max(4000).optional().or(z.literal('')),
  // Honeypot — real users never fill this; bots often do.
  company: z.string().max(0).optional().or(z.literal('')),
})

export type ContactFormValues = z.infer<typeof contactSchema>
