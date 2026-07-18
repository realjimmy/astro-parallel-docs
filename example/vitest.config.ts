import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: { globals: true, environment: 'node' },
  resolve: {
    alias: {
      '@config': fileURLToPath(new URL('./site.config.mjs', import.meta.url)),
      '@theme': fileURLToPath(new URL('./theme', import.meta.url)),
    },
  },
});
