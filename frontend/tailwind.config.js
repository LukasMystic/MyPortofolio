/** @type {import('tailwindcss').Config} */

// Design tokens follow Apple's Human Interface Guidelines: semantic system
// colors (background, grouped background, label hierarchy, separator, tint)
// that resolve differently in light and dark appearance. The values live as
// CSS variables in src/index.css, so dark mode is a single class swap.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          '"Segoe UI"',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        bg: token('bg'),
        grouped: token('grouped'),
        elevated: token('elevated'),
        elevated2: token('elevated2'),
        label: token('label'),
        label2: 'var(--label2)',
        label3: 'var(--label3)',
        separator: 'var(--separator)',
        fill: 'var(--fill)',
        fill2: 'var(--fill2)',
        tint: token('tint'),
        'tint-fill': token('tint-fill'),
        'sys-green': token('green'),
        'sys-red': token('red'),
      },
      // HIG text styles (iOS points map to CSS px), with SF's tracking at each size.
      fontSize: {
        'large-title': ['34px', { lineHeight: '41px', letterSpacing: '0.011em' }],
        title1: ['28px', { lineHeight: '34px', letterSpacing: '0.013em' }],
        title2: ['22px', { lineHeight: '28px', letterSpacing: '-0.016em' }],
        title3: ['20px', { lineHeight: '25px', letterSpacing: '-0.022em' }],
        headline: ['17px', { lineHeight: '22px', letterSpacing: '-0.025em' }],
        body: ['17px', { lineHeight: '25px', letterSpacing: '-0.025em' }],
        callout: ['16px', { lineHeight: '21px', letterSpacing: '-0.02em' }],
        subhead: ['15px', { lineHeight: '20px', letterSpacing: '-0.015em' }],
        footnote: ['13px', { lineHeight: '18px', letterSpacing: '-0.005em' }],
        caption: ['12px', { lineHeight: '16px', letterSpacing: '0' }],
        // One display size for the web hero, in the spirit of apple.com.
        display: ['clamp(40px, 7vw, 64px)', { lineHeight: '1.06', letterSpacing: '-0.018em' }],
      },
      borderRadius: {
        card: '18px',
      },
      maxWidth: {
        content: '1024px',
        reading: '692px',
      },
      transitionTimingFunction: {
        ios: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
};
