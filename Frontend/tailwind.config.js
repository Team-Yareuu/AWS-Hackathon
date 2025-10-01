/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)', // pure-white
        foreground: 'var(--color-foreground)', // rich-black
        card: {
          DEFAULT: 'var(--color-card)', // subtle-gray
          foreground: 'var(--color-card-foreground)' // rich-black
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)' // rich-black
        },
        primary: {
          DEFAULT: 'var(--color-primary)', // deep-forest-green
          foreground: 'var(--color-primary-foreground)' // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // warm-cinnamon-brown
          foreground: 'var(--color-secondary-foreground)' // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // subtle-gray
          foreground: 'var(--color-muted-foreground)' // balanced-gray
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // vibrant-chili-orange
          foreground: 'var(--color-accent-foreground)' // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // gentle-red-chili
          foreground: 'var(--color-destructive-foreground)' // white
        },
        success: {
          DEFAULT: 'var(--color-success)', // fresh-herb-green
          foreground: 'var(--color-success-foreground)' // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // turmeric-yellow
          foreground: 'var(--color-warning-foreground)' // white
        },
        error: {
          DEFAULT: 'var(--color-error)', // gentle-red-chili
          foreground: 'var(--color-error-foreground)' // white
        },
        border: 'var(--color-border)', // light-gray
        input: 'var(--color-input)', // white
        ring: 'var(--color-ring)', // deep-forest-green
        // Cultural Brand Colors
        turmeric: {
          DEFAULT: 'var(--color-turmeric)', // turmeric-orange
          foreground: 'var(--color-turmeric-foreground)' // white
        },
        cinnamon: {
          DEFAULT: 'var(--color-cinnamon)', // cinnamon-brown
          foreground: 'var(--color-cinnamon-foreground)' // white
        },
        pandan: {
          DEFAULT: 'var(--color-pandan)', // pandan-green
          foreground: 'var(--color-pandan-foreground)' // white
        },
        chili: {
          DEFAULT: 'var(--color-chili)', // chili-red
          foreground: 'var(--color-chili-foreground)' // white
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        accent: ['Crimson Text', 'serif'],
        cta: ['Plus Jakarta Sans', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem'
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        'cultural': '0 2px 8px rgba(210, 105, 30, 0.12)',
        'cultural-lg': '0 8px 24px rgba(210, 105, 30, 0.15)',
        'cultural-xl': '0 12px 32px rgba(210, 105, 30, 0.18)',
        'warm': '0 1px 3px rgba(210, 105, 30, 0.1)',
        'warm-lg': '0 4px 12px rgba(210, 105, 30, 0.1)',
        'warm-xl': '0 12px 24px rgba(210, 105, 30, 0.15)'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'batik-draw': 'batik-draw 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'spice-shift': 'spice-shift 4s ease-in-out infinite',
        'pulse-cultural': 'pulse-cultural 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        slideUp: {
          'from': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'batik-draw': {
          'to': { 'stroke-dashoffset': '0' }
        },
        'spice-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        },
        'pulse-cultural': {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05)'
          }
        }
      },
      transitionTimingFunction: {
        'cultural': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'warm': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      },
      backdropBlur: {
        'cultural': '8px'
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate')
  ]
}