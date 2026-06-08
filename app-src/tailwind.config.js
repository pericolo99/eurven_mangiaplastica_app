/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        // Brand Mangiaplastica / Eurven
        brand: {
          DEFAULT: '#1f389c', // indigo profondo
          50: '#eef1fb',
          100: '#d9e0f6',
          200: '#b3c0ec',
          300: '#8197dd',
          400: '#506cc9',
          500: '#1f389c',
          600: '#1b3088',
          700: '#162666',
          800: '#111d4d',
          900: '#0c1538',
        },
        accent: {
          DEFAULT: '#00b0f2', // ciano
          50: '#e6f8fe',
          100: '#cdf1fd',
          200: '#9be3fb',
          300: '#5ccff8',
          400: '#27bef5',
          500: '#00b0f2',
          600: '#0090c9',
          700: '#0070a0',
        },
        eco: {
          DEFAULT: '#22c08b',
          500: '#22c08b',
          600: '#149e72',
        },
        ink: '#0e1430',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(31, 56, 156, 0.25)',
        soft: '0 6px 20px -8px rgba(14, 20, 48, 0.18)',
        glow: '0 12px 40px -10px rgba(0, 176, 242, 0.45)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1f389c 0%, #2a52c9 45%, #00b0f2 100%)',
        'brand-soft': 'linear-gradient(160deg, #f4f7ff 0%, #eaf6ff 100%)',
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.28s ease-out both',
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
