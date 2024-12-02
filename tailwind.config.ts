import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: { sm: '100%', DEFAULT: '1280px' },
      },
    },
  },
} satisfies Config
