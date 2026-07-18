// Color-scheme support. A site picks one palette in site.config.mjs
// (`palette: 'purple-orange'`) or supplies a custom one. Only the accent/signal
// pair (per light + dark) is themed; every other token stays shared so the
// design stays coherent across sites. The `-soft` tints are derived from the
// base color with the same alpha the default CSS uses, so a preset only needs
// to name two colors per mode.
import config from '@config';

export interface Tones {
  accent: string;
  signal: string;
  accentSoft?: string; // derived from accent if omitted
  signalSoft?: string; // derived from signal if omitted
}
export interface Palette {
  light: Tones;
  dark: Tones;
}

// Soft-tint alpha, matching the defaults in global.css (light 0.10/0.08, dark 0.14/0.12).
const ALPHA = {
  light: { accent: 0.1, signal: 0.08 },
  dark: { accent: 0.14, signal: 0.12 },
} as const;

// Built-in palettes. 'blue-teal' equals the CSS defaults (the fallback when
// `palette` is unset), so naming it explicitly is a no-op.
export const PRESETS: Record<string, Palette> = {
  'blue-teal': { light: { accent: '#1668e3', signal: '#12b3a6' }, dark: { accent: '#4c9bff', signal: '#2fd4c4' } },
  'purple-orange': { light: { accent: '#8f2d9b', signal: '#e0532b' }, dark: { accent: '#c877d4', signal: '#ff7a4d' } },
  'emerald-sky': { light: { accent: '#0e9f6e', signal: '#2f8fd4' }, dark: { accent: '#34d399', signal: '#60b8f0' } },
  'crimson-gold': { light: { accent: '#c62b3f', signal: '#b7791f' }, dark: { accent: '#ff6b7a', signal: '#e0b34d' } },
  'indigo-rose': { light: { accent: '#4f46e5', signal: '#db2777' }, dark: { accent: '#818cf8', signal: '#f472b6' } },
};

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '').trim();
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function fill(t: Tones, mode: 'light' | 'dark'): Required<Tones> {
  return {
    accent: t.accent,
    signal: t.signal,
    accentSoft: t.accentSoft ?? hexToRgba(t.accent, ALPHA[mode].accent),
    signalSoft: t.signalSoft ?? hexToRgba(t.signal, ALPHA[mode].signal),
  };
}

/** Resolve the configured palette to concrete tones, or null to keep the CSS defaults. */
export function resolvePalette(input: SiteConfig['palette'] = config.palette): { light: Required<Tones>; dark: Required<Tones> } | null {
  if (!input) return null;
  const p = typeof input === 'string' ? PRESETS[input] : input;
  if (!p) return null; // unknown preset name -> fall back to the defaults
  return { light: fill(p.light, 'light'), dark: fill(p.dark, 'dark') };
}

/**
 * CSS overriding the accent/signal vars for the chosen palette, or '' for the
 * default. Doubled `:root:root` selectors outrank the base `:root` rules so the
 * override wins regardless of stylesheet injection order.
 */
export function paletteCss(input: SiteConfig['palette'] = config.palette): string {
  const p = resolvePalette(input);
  if (!p) return '';
  const vars = (t: Required<Tones>) =>
    `--accent:${t.accent};--accent-soft:${t.accentSoft};--signal:${t.signal};--signal-soft:${t.signalSoft}`;
  return `:root:root{${vars(p.light)}}:root:root[data-theme="dark"]{${vars(p.dark)}}`;
}

// Local alias so this file doesn't depend on the config module's type export path.
type SiteConfig = { palette?: string | Palette };
