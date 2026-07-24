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
    // Landing "sticky notes": short cards under the hero. `body` accepts HTML;
    // `action` is an optional link (set `external: true` to open in a new tab).
    notes: [
      {
        title: 'Read it side by side',
        body: 'Every page shows the English original and its translation in two columns. Use the <strong>Original / Translation / Both</strong> toggle in the header, or the <strong>peek</strong> button on any row to reveal just that line.',
        action: { label: 'Start with the intro', href: '/official/intro/' },
      },
      {
        title: 'In a hurry?',
        body: 'Install the CLI and clean your first messy CSV in about a minute — no configuration needed for the common case.',
        action: { label: 'Quick start', href: '/official/guide/quickstart/' },
      },
      {
        title: 'New in 1.0',
        body: 'Date and money columns are now inferred from the data by default, and <code>foo.toml</code> can turn any rule off. Environment variables override the file.',
        action: { label: 'See configuration', href: '/official/reference/configuration/' },
      },
      {
        title: 'Spotted a bad translation?',
        body: 'Corrections are welcome. Each page has a source link back to the upstream docs, and the site itself is open source.',
        action: { label: 'Edit on GitHub', href: 'https://github.com/you/foo-docs', external: true },
      },
    ],
  },
};
