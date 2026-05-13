/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f172a',
          card: '#1e293b',
          hover: '#263347',
        },
        accent: {
          indigo: '#6366f1',
          'indigo-light': '#818cf8',
          'indigo-dark': '#4f46e5',
          orange: '#f59e0b',
          'orange-light': '#fbbf24',
        },
        text: {
          primary: '#e2e8f0',
          muted: '#94a3b8',
          faint: '#475569',
        },
        risk: {
          red: '#ef4444',
          orange: '#f97316',
          purple: '#a855f7',
          yellow: '#eab308',
          green: '#22c55e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        'progress': 'progress 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'glow-indigo': '0 0 20px rgba(99,102,241,0.3)',
        'glow-orange': '0 0 20px rgba(245,158,11,0.3)',
      },
    },
  },
  plugins: [],
}
