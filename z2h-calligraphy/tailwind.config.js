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
            DEFAULT: '#4361ee',
            50: '#f5f7ff',
            100: '#ebf0fe',
            200: '#c7d7fd',
            300: '#a4befc',
            400: '#6a92fa',
            500: '#4361ee',
            600: '#1c3eda',
            700: '#1831b7',
            800: '#142994',
            900: '#0f2178',
          },
          secondary: {
            DEFAULT: '#6c757d',
            50: '#f8f9fa',
            100: '#f1f3f5',
            200: '#e9ecef',
            300: '#dee2e6',
            400: '#ced4da',
            500: '#adb5bd',
            600: '#6c757d',
            700: '#495057',
            800: '#343a40',
            900: '#212529',
          }
        },
        fontFamily: {
          sans: [
            'system-ui',
            'sans-serif',
          ],
          serif: ['Noto Serif SC', 'serif'],
          mono: ['JetBrains Mono', 'monospace'],
          kai: ['KaiTi', 'STKaiti', 'serif'],
          song: ['SimSun', 'serif'],
          hei: ['SimHei', 'sans-serif'],
        },
        boxShadow: {
          'card': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
          'dropdown': '0 4px 24px 0 rgba(0, 0, 0, 0.12)',
        },
        spacing: {
          '4': '4px',
          '8': '8px',
          '12': '12px',
          '16': '16px',
          '24': '24px',
          '32': '32px',
          '48': '48px',
          '64': '64px',
        },
        gridTemplateColumns: {
          'sheet': 'repeat(auto-fill, minmax(64px, 1fr))',
        },
        animation: {
          'stroke': 'strokeAnimate 1.5s ease forwards',
          'fade-in': 'fadeIn 0.3s ease-in',
          'float': 'float 6s ease-in-out infinite',
        },
        keyframes: {
          strokeAnimate: {
            '0%': { 'stroke-dashoffset': '100%' },
            '100%': { 'stroke-dashoffset': '0' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        },
      },
    },
    // Tailwind CSS 4.0新特性：使用原生CSS嵌套
    separator: ':',
    future: {
      hoverOnlyWhenSupported: true,
    },
    experimental: {
      optimizeUniversalDefaults: true,
    },
    // 打印相关优化
    printVariants: ['print', 'print-only'],
    plugins: [],
  }