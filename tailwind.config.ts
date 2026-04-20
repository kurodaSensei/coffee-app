import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Sorbo raw palette — referencias directas
        paper:   '#F4F2EB',
        surface: '#E4E3D2',
        olive:   '#556B3A',
        honey:   '#E5B84B',
        moss:    '#2F3528',
        jungle:  '#141712',
        'jungle-surface': '#222820',
        'olive-light':    '#96B36A',
        'surface-2':      '#EBE9DC',
        'moss-ghost':     '#8a8c7f',
        'terracotta':     'hsl(var(--terracotta))',
        'olive-dark':     'hsl(var(--olive-dark))',

        // Tokens shadcn-vue (nombres conservados para compatibilidad)
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      fontFamily: {
        serif: ['"DM Serif Display"', 'ui-serif', 'Georgia', 'serif'],
        sans:  ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        'eyebrow': ['10px', { lineHeight: '1.4', letterSpacing: '0.22em', fontWeight: '500' }],
        'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '400' }],
        'data':    ['13px', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        'ui':      ['14px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'body':    ['16px', { lineHeight: '1.55', letterSpacing: '0', fontWeight: '400' }],
        'h3':      ['22px', { lineHeight: '1.15', letterSpacing: '-0.005em', fontWeight: '600' }],
        'h2':      ['36px', { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '400' }],
        'h1':      ['56px', { lineHeight: '1.0',  letterSpacing: '-0.02em',  fontWeight: '400' }],
        'display': ['96px', { lineHeight: '0.95', letterSpacing: '-0.025em', fontWeight: '400' }],
      },

      borderRadius: {
        sm:      '6px',
        DEFAULT: '10px',
        md:      '12px',
        lg:      '14px',
        xl:      '18px',
        '2xl':   '22px',
        pill:    '999px',
      },

      boxShadow: {
        'soft':  '0 2px 8px -2px rgba(47,53,40,0.08)',
        'card':  '0 8px 24px -10px rgba(47,53,40,0.12), 0 2px 6px -2px rgba(47,53,40,0.06)',
        'fab':   '0 10px 24px -6px rgba(85,107,58,0.45)',
        'modal': '0 32px 80px -20px rgba(47,53,40,0.35)',
      },

      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      transitionDuration: {
        'fast': '120ms',
        'base': '180ms',
        'slow': '320ms',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config
