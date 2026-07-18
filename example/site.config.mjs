// ============================================================================
// site.config.mjs — the ONLY file each site must edit.
// Everything site-specific lives here; the theme/ code reads it via `@config`.
// See theme/config.d.ts for the full contract.
// ============================================================================

/** @type {import('./theme/config').SiteConfig} */
export default {
  // identity
  siteName: 'Foo Docs',
  version: '1.0',

  // where the upstream docs are mirrored from (extractor + link rewriter).
  // Trailing slash required.
  upstreamBase: 'https://docs.example.com/en/latest/',

  // this site's public URL and its open-source repo
  siteUrl: 'https://foo.example.com',
  repoUrl: 'https://github.com/you/foo-docs',

  // credited translator
  translator: 'Your Name',

  // interface language (optional; both default to 'zh').
  //   lang   -> <html lang>
  //   uiLang -> built-in UI string pack: 'zh' (default) or 'en'
  //   strings-> override individual labels (e.g. name your language pair)
  lang: 'en',
  uiLang: 'en',
  // strings: { viewOriginal: 'English', viewTranslation: 'Español', viewBoth: 'Both' },

  // color scheme (optional): a preset name or a custom accent/signal pair.
  // Presets: blue-teal (default) | purple-orange | emerald-sky | crimson-gold | indigo-rose
  palette: 'emerald-sky',

  // optional font-stack overrides (e.g. drop CJK fallbacks on a non-CJK site)
  // fonts: { body: 'system-ui, -apple-system, "Segoe UI", sans-serif' },

  // article-footer tip widget (optional). Multiple methods supported:
  // reward: {
  //   methods: [
  //     { type: 'link', label: 'Ko-fi', href: 'https://ko-fi.com/you' },
  //     { type: 'qr',   label: 'WeChat', image: '/tip/wechat.jpg' },
  //   ],
  // },

  // attribution (watermark = shorter; copy = appended when readers copy text)
  attribution: {
    watermark: 'foo.example.com',
    copy: 'Foo Docs (foo.example.com)',
  },

  // sidebar brand mark (inline SVG; uses the theme's --accent/--signal vars)
  brandMark: `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="var(--accent)"/></svg>`,

  // top-level nav sections, in order: [slugKey, translation label, original label]
  sections: [
    ['intro', 'Introduction', 'Introduction'],
    ['guide', 'Guide', 'Guide'],
    ['reference', 'Reference', 'Reference'],
  ],

  // relabel intermediate no-page folders (optional)
  // groupOverrides: { 'official/reference/api': { title: 'API', subtitle: 'Reference' } },

  // sidebar groups that start collapsed (optional)
  // collapsedByDefault: ['/official/reference/changelog/'],

  // faceted catalog for very large sites (optional; leave unset for the tree)
  // nav: { dimensions: [{ key: 'topic', label: 'By topic', data: '/nav-topic.json' }] },

  // generic landing template content (or hand-write src/pages/index.astro)
  landing: {
    eyebrow: 'Foo Documentation',
    titleZh: 'Foo Docs',
    subtitle: 'Read the original and the translation side by side.',
    entryHref: '/official/intro/',
    notes: [],
  },
};
