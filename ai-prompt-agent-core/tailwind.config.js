/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./pro.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Deep Space palette ── */
        'deep': {
          950: '#020617',  /* slate-950 */
          900: '#0f172a',  /* slate-900 */
          850: '#131c31',
          800: '#1e293b',  /* slate-800 */
          700: '#334155',  /* slate-700 */
          600: '#475569',  /* slate-600 */
        },
        /* ── Neon accents ── */
        'neon': {
          blue:   '#38bdf8',   /* sky-400 */
          cyan:   '#22d3ee',   /* cyan-400 */
          purple: '#a78bfa',   /* violet-400 */
          green:  '#34d399',   /* emerald-400 */
          pink:   '#f472b6',   /* pink-400 */
        },
        /* ── Brand primary (kept for legacy) ── */
        primary: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
          800: '#3730a3', 900: '#312e81',
        },
        secondary: {
          50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe',
          400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce',
          800: '#6b21a8', 900: '#581c87',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
      },
      keyframes: {
        borderGlow: {
          '0%, 100%': { borderColor: '#38bdf8', boxShadow: '0 0 8px rgba(56,189,248,0.3)' },
          '33%':      { borderColor: '#a78bfa', boxShadow: '0 0 8px rgba(167,139,250,0.3)' },
          '66%':      { borderColor: '#22d3ee', boxShadow: '0 0 8px rgba(34,211,238,0.3)' },
        },
        neonPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
