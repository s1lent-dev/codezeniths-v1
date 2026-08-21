/**
 * @file email-tailwind.config.ts
 * @description Tailwind configuration for React Email components mirroring CodeZeniths Tokyo Night tokens.
 */

export const emailTailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6a7cff',
          shade1: '#8a98ff',
          shade2: '#6366f1',
          shade3: '#4d5ccc',
        },
        secondary: {
          DEFAULT: '#565f89',
          shade1: '#49516f',
          shade2: '#3c4356',
          shade3: '#2f3640',
        },
        background: {
          dark: '#181c31',
          'dark-shade1': '#1d223d',
          'dark-shade2': '#222847',
          'dark-shade3': '#272e50',
          light: '#f2eeff',
          'light-shade1': '#ece8ff',
          'light-shade2': '#e5e0ff',
          'light-shade3': '#ddd8ff',
        },
        foreground: {
          dark: '#1c2136',
          'dark-shade1': '#252a42',
          'dark-shade2': '#1a1e32',
          'dark-shade3': '#2b2f4c',
          light: '#ffffff',
          'light-shade1': '#f7f6ff',
          'light-shade2': '#f2efff',
          'light-shade3': '#e1def7',
        },
        heading: {
          dark: '#95a3fa',
          light: '#494f95',
        },
        body: {
          dark: '#a9b1d6',
          light: '#3b3f63',
        },
        muted: {
          dark: '#828bb8',
          light: '#6b7394',
        },
        destructive: {
          DEFAULT: '#ff4655',
          shade1: '#ff6b7a',
          shade2: '#cc3845',
        },
        success: {
          DEFAULT: '#00ffb2',
          shade1: '#00cc8f',
          shade2: '#009973',
        },
        warning: {
          DEFAULT: '#e0af68',
          shade1: '#eabf8a',
          shade2: '#b07d32',
        },
        teal: {
          DEFAULT: '#73daca',
          shade1: '#92e5d8',
          shade2: '#3eaa9a',
        },
        azure: {
          DEFAULT: '#2ac3de',
          shade1: '#4fd3eb',
          shade2: '#088ea8',
        },
        purple: {
          DEFAULT: '#bb9af7',
          shade1: '#cbb0ff',
          shade2: '#8865cc',
        },
      },
      fontFamily: {
        rocker: [
          '"New Rocker"',
          'cursive',
          'sans-serif',
        ],
        sans: [
          'Andika',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"Fira Code"',
          '"Geist Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
};
