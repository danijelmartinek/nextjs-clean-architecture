import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import env from 'vite-plugin-env-compatible';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reportsDirectory: './tests/coverage',
    },
  },
  plugins: [env()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./', import.meta.url)) },
      { find: '@repo/core', replacement: fileURLToPath(new URL('../../packages/core/src', import.meta.url)) },
      { find: '@repo/payload', replacement: fileURLToPath(new URL('../../packages/payload/src', import.meta.url)) },
    ],
  },
});
