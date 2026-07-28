'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { cn } from '@/lib/cn'
import { contactSchema, type ContactFormValues } from '@/lib/validations/contact'
import { EVENT_TYPES, BUDGET_RANGES } from '@/lib/site-data'
import { businessInfo } from '@/lib/metadata'

const fieldClass =
  'border-0 border-b border-brand/25 bg-transparent py-2.5 font-sans text-base font-light text-brand transition-colors duration-300 placeholder:text-foreground/40 focus:border-gold focus:outline-none'

const labelClass = 'font-sans text-[9.5px] uppercase tracking-[0.28em] text-brand/60'

export function ContactForm() {
  const [submittedName, setSubmittedName] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { eventType: undefined, budget: '', company: '' },
  })

  const selectedType = watch('eventType')

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        toast.error(body.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSubmittedName(values.name.split(' ')[0] || 'Thank you')
    } catch {
      toast.error(`Network error. Please call the studio at ${businessInfo.telephoneDisplay}.`)
    }
  }

  if (submittedName) {
    return (
      <div className="border border-gold/60 bg-secondary p-[clamp(34px,4vw,58px)]">
        <span className="mb-[26px] block h-11 w-px bg-gold" />
        <h2 className="mb-[18px] font-display text-[clamp(26px,3vw,42px)] font-normal leading-[1.15] text-brand">
          Thank you — your enquiry is with us.
        </h2>
        <p className="mb-[26px] max-w-[44ch] font-sans text-[15px] font-light leading-[1.9] text-foreground/75 text-pretty">
          {submittedName}, we read every enquiry personally and reply within two business days. If your date is
          inside eight weeks, call the studio directly and we&apos;ll prioritise it.
        </p>
        <a
          href={`tel:${businessInfo.telephone}`}
          className="border-b border-gold pb-2 font-sans text-[11px] uppercase tracking-[0.26em] text-brand transition-colors duration-300 hover:text-gold"
        >
          Call {businessInfo.telephoneDisplay}
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <span className="mb-[clamp(26px,3vw,40px)] block font-sans text-[10px] uppercase tracking-[0.34em] text-gold">
        Enquiry form
      </span>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register('company')}
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[clamp(22px,2.6vw,38px)]">
        <label className="flex flex-col gap-2.5">
          <span className={labelClass}>Your name *</span>
          <input type="text" autoComplete="name" placeholder="First and last" className={fieldClass} {...register('name')} />
          {errors.name && <span className="font-sans text-xs text-destructive">{errors.name.message}</span>}
        </label>
        <label className="flex flex-col gap-2.5">
          <span className={labelClass}>Email *</span>
          <input type="email" autoComplete="email" placeholder="you@example.com" className={fieldClass} {...register('email')} />
          {errors.email && <span className="font-sans text-xs text-destructive">{errors.email.message}</span>}
        </label>
        <label className="flex flex-col gap-2.5">
          <span className={labelClass}>Phone</span>
          <input type="tel" autoComplete="tel" placeholder="Optional" className={fieldClass} {...register('phone')} />
        </label>
        <label className="flex flex-col gap-2.5">
          <span className={labelClass}>Event date</span>
          <input type="text" autoComplete="off" placeholder="Or 'not decided yet'" className={fieldClass} {...register('date')} />
        </label>
      </div>

      {/* Event type chips */}
      <span className="mb-4 mt-[clamp(30px,3.6vw,48px)] block font-sans text-[9.5px] uppercase tracking-[0.28em] text-brand/60">
        Type of event *
      </span>
      <div className="flex flex-wrap gap-2.5">
        {EVENT_TYPES.map((type) => {
          const active = selectedType === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => setValue('eventType', type, { shouldValidate: true })}
              className={cn(
                'border px-5 py-3.5 font-sans text-[10.5px] uppercase tracking-[0.22em] transition-colors duration-300',
                active ? 'border-brand bg-brand text-brand-foreground' : 'border-brand/20 text-brand hover:border-brand/50',
              )}
            >
              {type}
            </button>
          )
        })}
      </div>
      {errors.eventType && (
        <span className="mt-2 block font-sans text-xs text-destructive">{errors.eventType.message}</span>
      )}

      <div className="mt-[clamp(30px,3.6vw,48px)] grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[clamp(22px,2.6vw,38px)]">
        <label className="flex flex-col gap-2.5">
          <span className={labelClass}>Estimated guests</span>
          <input type="text" placeholder="e.g. 120" className={fieldClass} {...register('guests')} />
        </label>
        <label className="flex flex-col gap-2.5">
          <span className={labelClass}>Budget range</span>
          <select className={cn(fieldClass, 'rounded-none')} {...register('budget')}>
            {BUDGET_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-[clamp(30px,3.6vw,48px)] flex flex-col gap-2.5">
        <span className={labelClass}>Tell us about it</span>
        <textarea
          rows={5}
          placeholder="Who is it for, where are you thinking, and what should the evening feel like?"
          className={cn(fieldClass, 'resize-y leading-[1.8]')}
          {...register('message')}
        />
      </label>

      <div className="mt-[clamp(32px,4vw,52px)] flex flex-wrap items-center gap-[22px]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border border-gold bg-gold px-10 py-[21px] font-sans text-[11px] uppercase tracking-[0.28em] text-brand transition-colors duration-500 hover:bg-brand hover:text-brand-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? 'Sending…' : 'Send Enquiry'}
        </button>
        <span className="max-w-[30ch] font-sans text-[12.5px] font-light leading-[1.7] text-foreground/55">
          No mailing lists. We reply within two business days.
        </span>
      </div>
    </form>
  )
}
