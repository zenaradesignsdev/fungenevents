import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Swap these CSS variables per client in fonts.ts + globals.css
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      colors: {
        // shadcn/ui CSS variable tokens — do not remove
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Per-client brand colours — add in globals.css as CSS variables
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          foreground: 'hsl(var(--brand-foreground))',
          muted: 'hsl(var(--brand-muted))',
          dark: 'hsl(var(--brand-dark))',
        },
        gold: {
          DEFAULT: 'hsl(var(--gold))',
          foreground: 'hsl(var(--gold-foreground))',
        },
        // Text-on-light only — see the note in globals.css.
        'gold-ink': 'hsl(var(--gold-ink))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 hsl(var(--gold) / 0.35)' },
          '50%': { transform: 'scale(1.035)', boxShadow: '0 0 0 10px hsl(var(--gold) / 0)' },
        },
        kenburns: {
          from: { transform: 'scale(1.02)' },
          to: { transform: 'scale(1.14)' },
        },
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        'scroll-cue': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '45%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '55%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
      },
      animation: {
        shimmer: 'shimmer 3.5s linear infinite',
        breathe: 'breathe 2.8s ease-in-out infinite',
        kenburns: 'kenburns 32s ease-in-out infinite alternate',
        marquee: 'marquee 44s linear infinite',
        'scroll-cue': 'scroll-cue 3.4s cubic-bezier(.32,.72,0,1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
