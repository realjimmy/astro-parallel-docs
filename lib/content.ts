// skin/lib/content.ts
import matter from 'gray-matter';
import { execSync } from 'node:child_process';
import config from '@config';

const enRaw = import.meta.glob('/content/en/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const zhRaw = import.meta.glob('/content/zh/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

// Map each tracked file to the date (YYYY-MM-DD) of the last commit that
// touched it, in one git pass. A page's "updated" is the newer of its EN and
// ZH file dates, so an EN-only or ZH-only change both bump the shown date.
// (With a squashed history every file shares one date; real per-page dates
// emerge once normal commit history accumulates.)
let gitDates: Record<string, string> | null = null;
function loadGitDates(): Record<string, string> {
  if (gitDates) return gitDates;
  gitDates = {};
  try {
    const out = execSync('git log --pretty=format:C%cs --name-only', {
      encoding: 'utf8',
      maxBuffer: 128 * 1024 * 1024,
    });
    let cur = '';
    for (const line of out.split('\n')) {
      const m = line.match(/^C(\d{4}-\d{2}-\d{2})$/);
      if (m) { cur = m[1]; continue; }
      const f = line.trim();
      if (f && cur && !(f in gitDates)) gitDates[f] = cur; // log is newest-first
    }
  } catch {
    /* no git / no history — leave dates empty */
  }
  return gitDates;
}
function updatedFor(enGlobPath: string, hasZh: boolean): string | undefined {
  const dates = loadGitDates();
  const enFile = enGlobPath.replace(/^\//, '');
  const cand = [dates[enFile]];
  if (hasZh) cand.push(dates[enFile.replace('/en/', '/zh/')]);
  const valid = cand.filter(Boolean) as string[];
  return valid.length ? valid.sort().pop() : undefined; // ISO dates sort chronologically
}

function pathToSlug(path: string): string {
  // '/content/en/official/<section>/index.md' -> 'official/<section>'
  let s = path.replace(/^\/content\/(en|zh)\//, '').replace(/\.md$/, '');
  s = s.replace(/\/index$/, '');
  if (s === 'index') s = '';
  return s;
}

export interface DocPage {
  slug: string;
  title: string;
  titleZh?: string;
  sourceUrl?: string;
  enBody: string;
  zhBody: string | null;
  translated: boolean;
  updated?: string;
  description: string;
  editPath: string;
}

// A short plain-text excerpt for <meta description> / social cards: the first
// real paragraph, stripped of Markdown and truncated.
function excerpt(md: string | null): string {
  if (!md) return '';
  for (const raw of md.split(/\n{2,}/)) {
    let s = raw.trim();
    if (!s || /^[#>|`<\-*]/.test(s)) continue;
    s = s
      .replace(/`([^`]*)`/g, '$1')
      .replace(/\*\*?([^*]+)\*\*?/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[#>*_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (s.length >= 8) return s.length > 140 ? s.slice(0, 140).trim() + '…' : s;
  }
  return '';
}

const zhBySlug = new Map<string, string>();
const zhPathBySlug = new Map<string, string>();
for (const [path, raw] of Object.entries(zhRaw)) {
  zhBySlug.set(pathToSlug(path), raw);
  zhPathBySlug.set(pathToSlug(path), path);
}

const pages: DocPage[] = Object.entries(enRaw).map(([path, raw]) => {
  const slug = pathToSlug(path);
  const en = matter(raw);
  const zhRawText = zhBySlug.get(slug);
  const zh = zhRawText ? matter(zhRawText) : null;
  const zhBody = zh ? zh.content.trim() : null;
  return {
    slug,
    title: (en.data.title as string) ?? slug,
    titleZh: (zh?.data.title as string) || undefined,
    sourceUrl: en.data.sourceUrl as string | undefined,
    enBody: en.content.trim(),
    zhBody,
    translated: zhBody != null,
    updated: updatedFor(path, zhRawText != null),
    description: excerpt(zhBody) || excerpt(en.content) || config.siteName,
    editPath: (zhPathBySlug.get(slug) ?? path).replace(/^\//, ''),
  };
});

const bySlug = new Map(pages.map((p) => [p.slug, p]));

export function getAllPages(): DocPage[] {
  return pages;
}
const slugSet = new Set(pages.map((p) => p.slug));
export function getSlugSet(): Set<string> {
  return slugSet;
}
export function getPage(slug: string): DocPage | undefined {
  return bySlug.get(slug);
}
export function isTranslated(slug: string): boolean {
  return bySlug.get(slug)?.translated ?? false;
}
