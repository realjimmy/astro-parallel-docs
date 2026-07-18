# Example site scaffold

These are copy-paste templates for a **new consuming site**. They assume the
theme is added as a git submodule at `./theme` (see the main README, "Adding the
theme to a site"). Copy the files into your new repo's root (keeping the
`src/pages/` layout), then edit `site.config.mjs`.

```
your-site/
├── theme/                 ← git submodule: astro-parallel-docs
├── site.config.mjs        ← the ONLY file you must edit (sample here)
├── astro.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── package.json           ← add the deps from theme/deps.json
├── scripts/extract.mjs    ← your own upstream extractor (not templated here)
├── content/               ← rendered docs (en/ + zh/), produced by extract
├── public/                ← favicons, og-preview.png, tip QR, /assets images
└── src/pages/
    ├── [...slug].astro
    ├── 404.astro
    ├── index.astro
    └── robots.txt.ts
```

`404.astro` and `index.astro` are site-owned content (your wording), so the
templates here are minimal starting points — customize freely.
