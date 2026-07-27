'use client'

import { motion } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'
import { Image } from '@/components/ui/image'
import { Button } from '@/components/ui/button'
import { CategoryCarousel } from '@/components/home/CategoryCarousel'
import { ANIMATION_VARIANTS } from '@/lib/animations'
import { businessInfo } from '@/lib/metadata'

// Placeholder — replace with FunGen's real email once provided.
const CONTACT_EMAIL = 'hello@fungenevents.ca'
const CONTACT_PHONE_DISPLAY = businessInfo.telephoneDisplay
const CONTACT_PHONE_HREF = businessInfo.telephone
const BUSINESS_ADDRESS = `${businessInfo.address.streetAddress}, ${businessInfo.address.addressLocality} ${businessInfo.address.addressRegion} ${businessInfo.address.postalCode}`

export function HomeLanding() {
  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary" />
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={ANIMATION_VARIANTS.stagger}
        className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 py-4 text-center sm:gap-5 sm:px-6 sm:py-6"
      >
        <motion.div variants={ANIMATION_VARIANTS.scaleIn}>
          <Image
            src="/images/fungen-logo.svg"
            alt="FunGen Events and Experiences logo"
            width={85}
            height={78}
            priority
            className="h-12 w-auto sm:h-16"
          />
        </motion.div>

        <motion.p
          variants={ANIMATION_VARIANTS.fadeIn}
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold sm:text-xs"
        >
          Full Website Coming Soon
        </motion.p>

        <motion.h1
          variants={ANIMATION_VARIANTS.slideUp}
          className="font-sans text-2xl font-semibold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl"
        >
          <span className="animate-shimmer bg-gradient-to-r from-gold via-primary-foreground to-gold bg-[length:200%_auto] bg-clip-text text-transparent">
            FunGen
          </span>{' '}
          Events &amp; Experiences
        </motion.h1>

        <motion.p
          variants={ANIMATION_VARIANTS.fadeIn}
          className="max-w-md text-xs text-primary-foreground/80 sm:text-base"
        >
          Reach out directly — we&apos;ll be here when the new site launches.
        </motion.p>

        <motion.div
          variants={ANIMATION_VARIANTS.scaleIn}
          className="flex w-full justify-center"
        >
          <CategoryCarousel />
        </motion.div>

        <motion.div
          variants={ANIMATION_VARIANTS.fadeIn}
          className="flex flex-row gap-2 sm:gap-3"
        >
          <Button asChild>
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <Mail aria-hidden="true" />
              Email Us
            </a>
          </Button>
          <Button
            asChild
            variant="gold"
            className="animate-breathe"
          >
            <a href={`tel:${CONTACT_PHONE_HREF}`}>
              <Phone aria-hidden="true" />
              Call Us
            </a>
          </Button>
        </motion.div>

        <motion.div
          variants={ANIMATION_VARIANTS.fadeIn}
          className="flex flex-col gap-0.5"
        >
          <p className="text-[11px] text-primary-foreground/70 sm:text-sm">{CONTACT_PHONE_DISPLAY}</p>
          <p className="max-w-xs text-[10px] leading-snug text-primary-foreground/60 sm:max-w-none sm:text-xs">
            {BUSINESS_ADDRESS}
          </p>
        </motion.div>
      </motion.div>
    </main>
  )
}
