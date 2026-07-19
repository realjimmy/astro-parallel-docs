# astro-parallel-docs

**English** · [中文](./README.zh.md)

An [Astro](https://astro.build/) theme for **parallel-text documentation** — the
original and its translation shown side by side, paragraph by paragraph, with
full-text search, three reading modes, light/dark, and a color scheme per site.
Consumed as a **git submodule**; every site-specific value lives in one
`site.config.mjs`.

> **Translating with an AI agent?** See **[TRANSLATING.md](./TRANSLATING.md)** —
> how to drive an AI (e.g. Claude Code) to translate a whole docs set against this
> theme: the block-alignment contract, what to translate vs leave in the original,
> change detection on version bumps, scaling with parallel agents, and the
> verification checklist.

## Features

- **Paragraph-aligned parallel layout** — original and translation in two lanes,
  aligned block by block. Three reading modes (side-by-side / translation-only /
  original-only) with a per-paragraph "reveal original" button on small screens.
- **Full-text search** across both languages via [Pagefind](https://pagefind.app/)
  (CJK-aware).
- **Light / dark** with a persisted toggle (default light), and a **color scheme**
  per site (built-in presets or a custom accent pair).
- **Fully internationalized UI** — every label comes from a string pack; ships
  `zh` and `en`, and any label is overridable.
- **Sidebar navigation** — a server-rendered tree for normal sites, or an opt-in
  **faceted catalog** (client-rendered, switchable browse dimensions) for very
  large sites.
- **Reading niceties** — table of contents with scroll-spy, prev/next pager,
  code copy buttons, image lightbox, back-to-top, "improve this page" link,
  a tiled attribution watermark, and a source note appended when readers copy.
- **SEO** — canonical URLs, OpenGraph/Twitter meta, sitemap, and a generated
  `robots.txt`.
- **Optional reward widget** — QR codes (WeChat/Alipay) and/or links
  (Ko-fi / PayPal / GitHub Sponsors / anything).

## When to use this

Use it when you are publishing a **translated mirror of an existing documentation
set** and want readers to see the source and the translation together — e.g. a
Chinese (or any-language) rendering of an English project's docs.

It is a good fit if:
- your content is a set of Markdown/HTML pages with an "original" and a
  "translation" version per page;
- you want side-by-side reading, search, and a polished static site with almost
  no front-end work.

It is **not** the right tool if you want a single-language docs site (use
Starlight or similar), a blog, or an app — the whole design is built around the
two-lane parallel model.

## How it works

- The theme is **self-contained** and reads each site's `site.config.mjs` through
  the `@config` alias — it never hardcodes a name, URL, color, or label.
- **Content ingestion is per-repo.** Each site keeps its own `scripts/extract.mjs`
  (every upstream has a different URL layout and version format) and only shares
  the *rendered* output under `content/` (an `en/` original + a `zh/` translation
  tree). In-article images are localized to `public/assets/` and referenced as
  `/assets/…`, which is the fixed path the theme's link rewriter expects.

```
your-site/
├── theme/                 ← this repo, as a git submodule
├── site.config.mjs        ← the only file you must edit
├── scripts/extract.mjs    ← your own upstream extractor (per-repo)
├── content/{en,zh}/…      ← rendered docs
├── public/                ← favicons, og-preview.png, tip QR, /assets images
└── src/pages/…            ← thin boilerplate (see example/)
```

## Adding the theme to a site

See `example/` for copy-paste templates. In short:

1. **Add the submodule** at `theme/`:
   ```bash
   git submodule add https://github.com/realjimmy/astro-parallel-docs.git theme
   ```
2. **Copy the boilerplate** from `example/` into your repo root: `astro.config.mjs`,
   `tsconfig.json`, `vitest.config.ts`, and `src/pages/{[...slug].astro,404.astro,index.astro,robots.txt.ts}`.
   These wire the `@theme` → `theme/` and `@config` → `site.config.mjs` aliases.
3. **Install dependencies** (a submodule does not bring `node_modules`):
   ```bash
   npm i @fontsource/ibm-plex-mono @fontsource/space-grotesk astro rehype-highlight rehype-raw rehype-stringify remark-rehype
   npm i -D @astrojs/check @astrojs/sitemap @types/node cheerio gray-matter pagefind remark-gfm remark-parse turndown turndown-plugin-gfm typescript unified vitest
   ```
4. **Write `site.config.mjs`** (start from `example/site.config.mjs`; the full
   contract is `theme/config.d.ts`).
5. **Add brand assets** under `public/` (favicon set, `og-preview.png`, optional tip QR).
6. **Produce content**: `npm run extract` (your extractor) → translate into
   `content/zh/` → `npm run build`.

### Updating the theme later
```bash
git submodule update --remote theme   # pull the newest theme commit
git add theme && git commit           # pin the new version in your site
```

### Deploying with a submodule
Your CI must fetch the submodule. On Cloudflare Pages / Workers Builds, keep the
submodule URL **HTTPS** (SSH keys aren't available) and keep this repo **public**
(cross-repo private submodules can't be authenticated), then set the build command to:
```bash
git submodule update --init --recursive && npm run build
```

## Configuration reference

All fields live in `site.config.mjs`; types are in `config.d.ts`.

| Field | Required | Purpose |
|---|---|---|
| `siteName` | ✓ | Site title (tab, sidebar brand, meta) |
| `version` | ✓ | Version badge next to the brand |
| `upstreamBase` | ✓ | Upstream mirror base URL (trailing slash); used by the extractor + link rewriter |
| `siteUrl` | ✓ | Public URL (canonical, sitemap, robots) |
| `repoUrl` | ✓ | Repo URL ("improve this page" links) |
| `translator` | ✓ | Credited translator |
| `attribution` | ✓ | `{ watermark, copy }` — watermark text + the note appended on copy |
| `brandMark` | ✓ | Inline SVG logo (uses `--accent` / `--signal`) |
| `sections` | ✓ | Ordered top-level nav: `[slugKey, translationLabel, originalLabel][]` |
| `lang` | | `<html lang>` (default `zh`) |
| `uiLang` | | UI string pack: `zh` (default) or `en` |
| `strings` | | Override individual UI labels (`Partial<UIStrings>`) |
| `palette` | | Color scheme: a preset name or a custom `{light,dark}` accent/signal pair |
| `fonts` | | Override `--font-body/display/mono` CSS stacks |
| `reward` | | Footer tip widget: `{ comment?, label?, methods[] }` |
| `tipImage` | | Shorthand for a single WeChat QR (used only if `reward` is unset) |
| `groupOverrides` | | Relabel intermediate no-page folders |
| `collapsedByDefault` | | Sidebar group hrefs that start collapsed |
| `nav` | | Faceted catalog for large sites (see below) |
| `landing` | | Content for the generic landing template |

### Color schemes
```js
palette: 'purple-orange'   // a built-in preset
// or a custom pair (soft tints are derived if omitted):
palette: { light: { accent: '#8f2d9b', signal: '#e0532b' },
           dark:  { accent: '#c877d4', signal: '#ff7a4d' } }
```
Presets (in `lib/palette.ts`): `blue-teal` (default), `purple-orange`,
`emerald-sky`, `crimson-gold`, `indigo-rose`. Only the accent/signal pair is
themed; everything else stays shared so all sites feel like one family.

### Interface language
Pick a shipped pack with `uiLang` and refine with `strings`. The three view-mode
labels and the "reveal original" text describe *your specific language pair*, so
override them if the built-in wording doesn't fit:
```js
uiLang: 'en',
strings: { viewOriginal: 'English', viewTranslation: '中文', viewBoth: '对照' },
```

### Reward widget
```js
reward: {
  comment: 'Buy me a coffee',
  methods: [
    { type: 'link', label: 'Ko-fi', href: 'https://ko-fi.com/you' },
    { type: 'qr',   label: 'WeChat', image: '/tip/wechat.jpg' },
  ],
}
```

### Faceted catalog (large sites)
Leave `nav` unset for the normal server-rendered tree. For very large indexes,
opt into a client-rendered switchable catalog; each dimension is a browse facet
backed by a JSON endpoint your site generates:
```js
nav: {
  scoped: true,                       // lazy-load section lists
  defaultDimension: 'topic',
  dimensions: [
    { key: 'topic', label: 'By topic',  data: '/nav-topic.json' },
    { key: 'date',  label: 'By date',   data: '/nav-date.json'  },
  ],
}
```
Each endpoint returns `[{ key, label, items: [{ href, title, subtitle, translated }] }]`.
Those `nav-*.json.ts` endpoints are site data (like the extractor) and live in
your repo, not the theme.
