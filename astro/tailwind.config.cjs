const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // toggle dark mode manually instead of relying on the operating system preference
  theme: {
    container: {
      center: true
    },
    screens: {
      sm: '600px',
      md: '768px',
      lg: '1024px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      blackFull: '#000',
      whiteFull: '#fff',
      black: '#272727',
      white: '#fbfbfb',
      gray: {
        DEFAULT: '#374151',
        medium: '#6b7280',
        light: '#9ca3af',
        lighter: '#ccd1d9',
        lightest: '#f3f4f6'
      }
    },
    extend: {
      keyframes: {
        'fade-in-scale': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        'fade-in-drop-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-40px) scale(0.97)'
          },
          '40%': {
            opacity: '1',
            transform: 'translateY(-40px) scale(1)'
          },
          '85%': {
            opacity: '1',
            transform: 'translateY(-40px) scale(1)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          }
        }
      },
      animation: {
        'fade-in-scale': 'fade-in-scale 0.2s ease-out forwards',
        'fade-in-drop-down': 'fade-in-drop-down 1s ease-out 0.2s forwards'
      }
    }
  },
  safelist: [],
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addVariant }) {
      addVariant('hocus', ['&:hover', '&:focus']);
    })
  ]
};
