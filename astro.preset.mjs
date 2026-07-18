// Shared Astro integrations for the docs skin. A site's astro.config.mjs
// spreads these in, so integrations stay in one place.
import sitemap from '@astrojs/sitemap';

export const integrations = [sitemap()];
