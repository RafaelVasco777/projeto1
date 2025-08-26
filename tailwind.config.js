/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#059669', // Emerald 600
          hover: '#047857',   // Emerald 700
        },
        success: {
          DEFAULT: '#16a34a',
          light: 'rgba(22, 163, 74, 0.1)',
          text: '#15803d',
        },
        danger: {
          DEFAULT: '#dc2626',
          light: 'rgba(220, 38, 38, 0.1)',
          text: '#b91c1c',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: 'rgba(245, 158, 11, 0.1)',
          text: '#d97706',
        },
        neutral: {
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
          600: '#4b5563',
          500: '#6b7280',
          400: '#9ca3af',
          300: '#d1d5db',
          200: '#e5e7eb',
          100: '#f3f4f6',
        }
      },
      boxShadow: {
        'top': '0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1)',
      }
    }
  },
  plugins: [],
};
