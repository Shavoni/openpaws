/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-jakarta)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
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
        // Warm grays (brown-tinted)
        warm: {
          25: '#FDFCFB',
          50: '#FAF9F7',
          100: '#F5F3F0',
          200: '#E8E5E1',
          300: '#D6D2CC',
          400: '#B5AFA7',
          500: '#8A8279',
          600: '#6B6560',
          700: '#4A4540',
          800: '#2D2926',
          900: '#1A1715',
        },
        // Platform colors
        platform: {
          instagram: '#E4405F',
          linkedin: '#0A66C2',
          twitter: '#1DA1F2',
          tiktok: '#010101',
          youtube: '#FF0000',
          facebook: '#1877F2',
        },
        // AI accent
        ai: {
          DEFAULT: '#8B5CF6',
          light: '#F5F3FF',
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        // Status
        success: {
          DEFAULT: '#16A34A',
          light: '#F0FDF4',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FFFBEB',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#FEF2F2',
        },
        info: {
          DEFAULT: '#2563EB',
          light: '#EFF6FF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'elevated': '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'focus-orange': '0 0 0 2px #FFEDD5, 0 0 0 4px #F97316',
        'ai': '0 0 0 1px rgba(139,92,246,0.15), 0 2px 8px rgba(139,92,246,0.08)',
        'ai-glow': '0 0 12px rgba(249,115,22,0.3)',
        'ai-glow-hover': '0 0 20px rgba(249,115,22,0.4)',
      },
      keyframes: {
        'paw-squeeze': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'ai-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(139,92,246,0.2)' },
          '50%': { boxShadow: '0 0 16px 4px rgba(139,92,246,0.15)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'paw-squeeze': 'paw-squeeze 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.2s ease-out',
        'slide-in-left': 'slide-in-left 0.2s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
        'ai-pulse': 'ai-pulse 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
