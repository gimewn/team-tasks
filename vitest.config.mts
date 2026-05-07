import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
