import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import config from './site.config.mjs';
import { integrations } from './theme/astro.preset.mjs';

export default defineConfig({
  site: config.siteUrl,
  output: 'static',
  build: { format: 'directory' },
  integrations,
  vite: {
    resolve: {
      alias: {
        '@config': fileURLToPath(new URL('./site.config.mjs', import.meta.url)),
        '@theme': fileURLToPath(new URL('./theme', import.meta.url)),
      },
    },
  },
});
