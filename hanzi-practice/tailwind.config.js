/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EBF5FF',
          100: '#E1EFFE',
          200: '#C3DDFD',
          300: '#A4CAFE',
          400: '#76A9FA',
          500: '#3F83F8',
          600: '#1C64F2',
          700: '#1A56DB',
          800: '#1E429F',
          900: '#233876',
        },
        secondary: {
          DEFAULT: '#4B5563',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '120': '30rem',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      fontFamily: {
        'kai': ['KaiTi', '楷体', 'STKaiti', 'sans-serif'],
        'song': ['SimSun', '宋体', 'serif'],
        'hei': ['SimHei', '黑体', 'sans-serif'],
        'fangsong': ['FangSong', '仿宋', 'serif'],
      },
      gridTemplateColumns: {
        'auto-fill-100': 'repeat(auto-fill, minmax(100px, 1fr))',
        'auto-fill-150': 'repeat(auto-fill, minmax(150px, 1fr))',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
  safelist: [
    'font-kai',
    'font-song',
    'font-hei',
    'font-fangsong',
  ],
}