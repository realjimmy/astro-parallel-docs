// skin/lib/nav.ts
import { getAllPages, getPage } from './content';
import config from '@config';

const tocFiles = import.meta.glob('/content/en/**/_toc.json', { import: 'default', eager: true }) as Record<string, TocEntry[]>;

interface TocEntry { href: string; title: string; level: number; }

export interface NavNode {
  title: string;      // Chinese if translated, else English
  subtitle: string;   // English (for the bilingual second line)
  href: string;
  translated: boolean;
  children: NavNode[];
}

export interface NavSection {
  key: string;
  title: string;   // Chinese label
  subtitle: string; // English name
  href: string;    // section index if present, else first leaf page
  translated: boolean;
  children: NavNode[];
}

/** Fixed order + bilingual labels for the top-level sections (from site config). */
const SECTIONS = config.sections;

// Intermediate path-folder nodes that are not real pages: give them a proper
// label (and a link) instead of showing the raw folder name. Keyed by slug.
const GROUP_OVERRIDES: Record<string, { title: string; subtitle: string; href?: string }> =
  config.groupOverrides ?? {};

function hrefToSlug(href: string): string {
  const clean = href.split('#')[0].replace(/\.html$/, '').replace(/\/index$/, '');
  return clean === 'index' ? 'official' : `official/${clean}`;
}

/** Ordered list of page slugs: _toc.json order first, then any stragglers. */
export function orderedSlugs(): string[] {
  const entries = Object.values(tocFiles)[0] ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of entries) {
    const s = hrefToSlug(e.href);
    if (!seen.has(s)) { seen.add(s); out.push(s); }
  }
  for (const p of getAllPages()) {
    if (!seen.has(p.slug)) { seen.add(p.slug); out.push(p.slug); }
  }
  return out;
}

function firstLeafHref(node: { href: string; children: NavNode[] }): string {
  let cur: { href: string; children: NavNode[] } = node;
  while (!cur.href && cur.children.length) cur = cur.children[0];
  return cur.href || (cur.children[0]?.href ?? '');
}

/** Build the eight sections, each a path-nested tree ordered by the toc. */
export function buildNav(): NavSection[] {
  const nodeBySlug = new Map<string, NavNode>();
  const sectionByKey = new Map<string, NavSection>();

  for (const [key, title, subtitle] of SECTIONS) {
    sectionByKey.set(key, { key, title, subtitle, href: '', translated: false, children: [] });
  }

  for (const slug of orderedSlugs()) {
    const parts = slug.split('/'); // ['official', <section>, ...rest]
    if (parts[0] !== 'official' || parts.length < 2) continue;
    const key = parts[1];
    const section = sectionByKey.get(key);
    if (!section) continue;

    const page = getPage(slug);
    if (page?.translated) section.translated = true;

    if (parts.length === 2) {
      // section landing page (e.g. cli-reference/index)
      if (page) section.href = `/${slug}/`;
      continue;
    }

    let cum = `official/${key}`;
    let parentChildren = section.children;
    for (let i = 2; i < parts.length; i++) {
      cum += `/${parts[i]}`;
      const pg = getPage(cum);
      const ov = GROUP_OVERRIDES[cum];
      const isLeaf = i === parts.length - 1;
      // A no-page intermediate folder (e.g. developer/tests) is a URL artifact,
      // not a real section — skip it and promote its children to this level,
      // unless it has an explicit override (e.g. cli-reference/clis).
      if (!pg && !ov && !isLeaf) continue;
      let node = nodeBySlug.get(cum);
      if (!node) {
        // A synthetic group (override, no page of its own) has no translation
        // status; fall back to the page it links to (e.g. the CLI reference
        // index) so its dot reflects reality instead of defaulting to "untranslated".
        let translated = pg?.translated ?? false;
        if (!translated && !pg && ov?.href) {
          const target = ov.href.replace(/^\//, '').replace(/\/$/, '');
          translated = getPage(target)?.translated ?? false;
        }
        node = {
          title: ov?.title || pg?.titleZh || pg?.title || parts[i],
          subtitle: ov?.subtitle ?? (pg?.title ?? ''),
          href: ov?.href || (pg ? `/${cum}/` : ''),
          translated,
          children: [],
        };
        nodeBySlug.set(cum, node);
        parentChildren.push(node);
      }
      parentChildren = node.children;
    }
  }

  const sections = SECTIONS
    .map(([key]) => sectionByKey.get(key)!)
    .filter((s) => s.children.length || s.href);
  for (const s of sections) {
    if (!s.href) s.href = firstLeafHref(s);
  }
  return sections;
}
