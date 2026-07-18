import type { APIRoute } from 'astro';
import config from '@config';

// Built to /robots.txt — the sitemap URL follows site.config.mjs's siteUrl.
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${config.siteUrl}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
