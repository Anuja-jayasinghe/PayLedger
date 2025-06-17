import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#0E0E10",
        neonBlue: "#38BDF8",
        neonGreen: "#14F195",
        mutedText: "#A1A1AA",
      },
      boxShadow: {
        neon: "0 0 12px #38BDF8",
        neonGreen: "0 0 12px #14F195",
      },
      backdropBlur: {
        md: "8px",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
  