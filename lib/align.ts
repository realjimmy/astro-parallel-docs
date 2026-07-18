// src/lib/align.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import config from '@config';

const DOCS_BASE: string = config.upstreamBase;

const parser = unified().use(remarkParse).use(remarkGfm);

export function splitBlocks(md: string): string[] {
  const tree: any = parser.parse(md);
  const blocks: string[] = [];
  for (const node of tree.children ?? []) {
    const start = node.position?.start?.offset;
    const end = node.position?.end?.offset;
    if (start == null || end == null) continue;
    const src = md.slice(start, end).trim();
    if (src) blocks.push(src);
  }
  return blocks;
}

// Render a Markdown block to HTML with build-time syntax highlighting.
// rehype-highlight (highlight.js) is synchronous, so processSync still works.
const renderer = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  // detect:false — only highlight blocks with an explicit, known language, so
  // highlight.js never mis-guesses unlabeled snippets into wrong languages
  .use(rehypeHighlight, { detect: false, ignoreMissing: true, aliases: { shell: ['console'] } })
  .use(rehypeStringify, { allowDangerousHtml: true });

export function renderBlock(md: string): string {
  return String(renderer.processSync(md)).trim();
}

export interface Heading { level: number; id: string; label: string; }
export interface AlignedBlock {
  enHtml: string;
  zhHtml: string;
  translated: boolean;
  heading?: Heading;
}
export interface AlignResult {
  blocks: AlignedBlock[];
  enCount: number;
  zhCount: number;
  mismatch: boolean;
}

/** Parse a leading ATX heading from a block; returns null if it isn't one. */
export function headingOf(md: string): { level: number; text: string } | null {
  const m = md.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/m);
  if (!m || !md.trimStart().startsWith('#')) return null;
  const text = m[2].replace(/[`*_]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim();
  return { level: m[1].length, text };
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^\w一-鿿]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

const DOCS_BASE_PATH = new URL(DOCS_BASE).pathname; // e.g. /en/stable/ or /project/1.0/

/**
 * Rewrite upstream relative `*.html` links in rendered HTML to this site's
 * routes. Links are resolved against the page's own upstream URL (sourceUrl),
 * so e.g. `building.html` on `.../build-run-debug/index.html` becomes
 * `/official/developer/build-run-debug/building/`. External links, anchors,
 * mailto, and site-absolute paths are left untouched.
 */
export function rewriteInternalLinks(
  html: string,
  sourceUrl?: string,
  validSlugs?: Set<string>,
): string {
  if (!sourceUrl) return html;
  // Operate on whole <a>…</a> elements so confirmed-broken links can be
  // unwrapped (kept as plain text) rather than left as dead links.
  return html.replace(
    /<a\b([^>]*?)\shref="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g,
    (whole, pre, href, post, inner) => {
      // external, same-page anchor, mailto/tel, or already site-absolute → keep
      if (/^(#|https?:|mailto:|tel:|\/)/i.test(href)) return whole;
      let abs: URL;
      try {
        abs = new URL(href, sourceUrl);
      } catch {
        return inner; // unparseable → de-link
      }
      if (!abs.href.startsWith(DOCS_BASE)) return inner; // off-site relative → de-link
      const rel = abs.pathname.slice(DOCS_BASE_PATH.length);
      if (/\.(html|rst)$/.test(rel)) {
        let slug = rel.replace(/\.(html|rst)$/, '').replace(/\/index$/, '');
        if (slug === 'index') slug = '';
        if (!slug) return `<a${pre} href="/"${post}>${inner}</a>`;
        if (validSlugs && !validSlugs.has(`official/${slug}`)) return inner; // target page absent → de-link
        return `<a${pre} href="/official/${slug}/${abs.hash}"${post}>${inner}</a>`;
      }
      if (rel.startsWith('_images/')) {
        return `<a${pre} href="/assets/${rel}${abs.hash}"${post}>${inner}</a>`;
      }
      return inner; // unknown upstream-relative target → de-link
    },
  );
}

export function alignPair(
  enMd: string,
  zhMd: string | null,
  sourceUrl?: string,
  validSlugs?: Set<string>,
): AlignResult {
  const enBlocks = splitBlocks(enMd);
  const zhBlocks = zhMd ? splitBlocks(zhMd) : [];
  const seen = new Map<string, number>();
  const blocks: AlignedBlock[] = enBlocks.map((enSrc, i) => {
    const zhSrc = zhBlocks[i];
    const hasZh = typeof zhSrc === 'string' && zhSrc.trim().length > 0;
    const enHtml = rewriteInternalLinks(renderBlock(enSrc), sourceUrl, validSlugs);

    let heading: Heading | undefined;
    const enHead = headingOf(enSrc);
    if (enHead) {
      const base = slugify(enHead.text);
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      const id = n === 0 ? base : `${base}-${n}`;
      const zhHead = hasZh ? headingOf(zhSrc) : null;
      heading = { level: enHead.level, id, label: (zhHead?.text || enHead.text) };
    }

    return {
      enHtml,
      zhHtml: hasZh ? rewriteInternalLinks(renderBlock(zhSrc), sourceUrl, validSlugs) : enHtml,
      translated: hasZh,
      heading,
    };
  });
  return {
    blocks,
    enCount: enBlocks.length,
    zhCount: zhBlocks.length,
    mismatch: zhMd != null && zhBlocks.length !== enBlocks.length,
  };
}
