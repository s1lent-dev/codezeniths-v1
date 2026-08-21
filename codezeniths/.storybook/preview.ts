import type { Preview } from '@storybook/nextjs';
import { withThemeByClassName } from '@storybook/addon-themes';
// CSS is resolved by Storybook's bundler; TypeScript has no declaration for it.
// @ts-expect-error -- side-effect CSS import
import './globals.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark:   { name: 'Dark',   value: '#181C31' },
        light:  { name: 'Light',  value: '#f2eeff' },
        maroon: { name: 'Maroon', value: '#400' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark:  'dark',
      },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
  ],
};

export default preview;