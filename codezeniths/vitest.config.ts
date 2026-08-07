import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'path';

export default defineConfig({
  plugins: [storybookTest()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@codezeniths/components': path.resolve(__dirname, './src/design/components/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['.storybook/vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.stories.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/design/components/**'],
    },
  },
});