import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@codezeniths/components': path.resolve(__dirname, './src/design/components/index.ts'),
      '@codezeniths/modules': path.resolve(__dirname, './src/design/modules'),
      '@codezeniths/widgets': path.resolve(__dirname, './src/design/widgets'),
      '@codezeniths/features': path.resolve(__dirname, './src/design/features'),
      '@codezeniths/layouts': path.resolve(__dirname, './src/design/layouts'),
      '@codezeniths': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
