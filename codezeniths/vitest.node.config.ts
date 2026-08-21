import 'dotenv/config';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: [
      'src/service/payment/**/*.test.ts',
      'src/service/mail/**/*.test.ts',
      'src/lib/firebase/**/*.test.ts',
      'src/lib/storage/**/*.test.ts'
    ],
  },
});
