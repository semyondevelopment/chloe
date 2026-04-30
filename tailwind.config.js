/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
      colors: {
        bubblegum: '#FF5DA2',
        'bubblegum-deep': '#E63E89',
        hotpink: '#FF1493',
        rose: '#FFB6C1',
        'rose-soft': '#FFD1DC',
        'rose-mist': '#FFE6EE',
        cotton: '#FFF1F6',
        cream: '#FFF8F0',
        lilac: '#E0B0FF',
        'lilac-deep': '#C58BF2',
        mint: '#B5EAD7',
        sky: '#C7F0FF',
        sunny: '#FFE066',
        peach: '#FFCBA4',
        coral: '#FF8AAE',
        plum: '#7A2A60',
        cocoa: '#5C3A4C',
        sparkle: '#FFD9F0',
      },
      fontFamily: {
        display: ['"Dancing Script"', '"Caveat"', 'cursive'],
        script: ['"Caveat"', '"Dancing Script"', 'cursive'],
        heading: ['"Fredoka"', '"Quicksand"', 'system-ui', 'sans-serif'],
        ui: ['"Quicksand"', 'Nunito', 'system-ui', 'sans-serif'],
        accent: ['"Fredoka"', '"Quicksand"', 'sans-serif'],
      },
      letterSpacing: {
        chloe: '0.02em',
        bubble: '0.08em',
      },
      boxShadow: {
        bubble: '0 8px 0 rgba(230,62,137,0.45), 0 18px 32px -10px rgba(255,93,162,0.55)',
        'bubble-soft': '0 4px 0 rgba(230,62,137,0.35), 0 10px 20px -8px rgba(255,93,162,0.4)',
        sticker: '0 0 0 4px #fff, 0 0 0 8px rgba(255,93,162,0.5), 0 12px 24px -8px rgba(122,42,96,0.35)',
        candy: '0 12px 30px -8px rgba(255,20,147,0.45), inset 0 -8px 0 rgba(230,62,137,0.4), inset 0 4px 0 rgba(255,255,255,0.55)',
        sparkle: '0 0 24px rgba(255,217,240,0.95), 0 0 48px rgba(255,93,162,0.5)',
      },
      keyframes: {
        bobble: {
          '0%,100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        sparkleSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.2)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        heartPop: {
          '0%,100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.18)' },
          '60%': { transform: 'scale(0.96)' },
        },
        rainbowShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.9' },
          '100%': { transform: 'translateY(-30px) scale(1.4)', opacity: '0' },
        },
        gradientPan: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        bobble: 'bobble 2.4s ease-in-out infinite',
        wiggle: 'wiggle 1.6s ease-in-out infinite',
        'sparkle-spin': 'sparkleSpin 3s ease-in-out infinite',
        'heart-pop': 'heartPop 1.4s ease-in-out infinite',
        'rainbow-shift': 'rainbowShift 6s ease-in-out infinite',
        'gradient-pan': 'gradientPan 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
