/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        sans: ['Inter', '"Noto Sans KR"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#1a1625',
        panel: '#241f33',
        panel2: '#2e2842',
        accent: '#a78bfa',
        accent2: '#f472b6',
        muted: '#8b83a3',
      },
      boxShadow: {
        glow: '0 0 24px rgba(167, 139, 250, 0.25)',
      },
    },
  },
  plugins: [],
}
