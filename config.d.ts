// The shape of a site's site.config.mjs — the contract between a site and the theme.
import type { UIStrings } from './lib/strings';

export interface LandingNote {
  title: string;
  body: string; // HTML allowed
  action?: { label: string; href: string; external?: boolean };
}

// A tip method shown in the article footer reward widget: a scannable QR image
// (WeChat / Alipay) or a link (Ko-fi / PayPal / GitHub Sponsors / anything).
export type RewardMethod =
  | { type: 'qr'; label: string; image: string } // image = a public/ path
  | { type: 'link'; label: string; href: string };

export interface SiteConfig {
  siteName: string;
  version: string;
  upstreamBase: string; // trailing slash
  siteUrl: string;
  repoUrl: string;
  translator: string; // credited author/translator, shown on each page
  // Show the "improve this page on GitHub" link in the footer. Off by default.
  showEditLink?: boolean;
  // Interface language. `lang` sets <html lang>; `uiLang` picks the built-in UI
  // string pack (see lib/strings.ts: 'zh' default, 'en' shipped); `strings`
  // overrides individual labels (e.g. to name your specific language pair).
  lang?: string; // default 'zh'
  uiLang?: string; // default 'zh'
  strings?: Partial<UIStrings>;
  // Optional CSS font-stack overrides (e.g. drop the CJK fallbacks on a
  // non-Chinese site). Injected as --font-* custom properties.
  fonts?: { body?: string; display?: string; mono?: string };
  // Article-footer tip widget. Prefer `reward` (multiple methods); `tipImage` is
  // a shorthand for a single WeChat QR and is used only when `reward` is unset.
  reward?: { comment?: string; label?: string; methods: RewardMethod[] };
  tipImage?: string; // public/ path to a single WeChat tip QR
  // Color scheme. A built-in preset name (see lib/palette.ts: 'blue-teal' |
  // 'purple-orange' | 'emerald-sky' | 'crimson-gold' | 'indigo-rose') or a
  // custom light/dark accent+signal pair. The `-soft` tints are derived unless
  // given. Unset = the default (blue-teal).
  palette?:
    | string
    | {
        light: { accent: string; signal: string; accentSoft?: string; signalSoft?: string };
        dark: { accent: string; signal: string; accentSoft?: string; signalSoft?: string };
      };
  attribution: { watermark: string; copy: string };
  brandMark: string; // inline SVG
  sections: Array<[string, string, string]>; // [slugKey, zh, en]
  groupOverrides?: Record<string, { title: string; subtitle: string; href?: string }>;
  collapsedByDefault?: string[]; // sidebar group hrefs that start collapsed
  // Large-site optimization / faceted browsing. `scoped` lazy-loads section
  // lists. `dimensions` turns the sidebar into a client-rendered, switchable
  // catalog: each dimension is a browse facet backed by a JSON endpoint of
  // `[{ key, label, items: [{ href, title, subtitle, translated }] }]`.
  // `defaultDimension` is the facet shown first. Leave `nav` unset on small
  // sites — the full server-rendered tree is best there.
  nav?: {
    scoped?: boolean;
    defaultDimension?: string;
    dimensions?: Array<{ key: string; label: string; data: string }>;
  };
  landing?: {
    eyebrow?: string;
    titleZh?: string;
    subtitle?: string;
    entryHref?: string;
    notes?: LandingNote[];
  };
}

declare const config: SiteConfig;
export default config;
