# Translating with an AI agent

This theme renders **parallel-text** documentation: an original page and its
translation shown side by side, aligned block by block. That structure makes the
translation work highly automatable — an AI coding agent (e.g. Claude Code) can
translate a whole documentation set against this theme reliably, *provided it
respects the alignment contract below*.

This guide is the operating manual for driving that agent. It is written from
hard-won experience translating several large upstreams (VPP, DPDK, RFC, …).

---

## 1. Mental model

- Content lives as two mirror trees: `content/en/**` (the **original**, produced
  by the site's extractor) and `content/zh/**` (the **translation**). A page's
  translation sits at the same relative path as its original.
- At render time the `Bilingual` component pairs the two files **block by block**
  using the remark AST: `en[i]` is shown next to `zh[i]`. A "block" is a
  top-level Markdown node — a paragraph, a whole list, a code fence, a table.
- A block is considered **translated** iff its `zh` block is *non-empty*. It does
  **not** check the language. This is the single most important fact for an AI:

> **The alignment contract:** the `zh` file must have the **same block structure
> and count** as the `en` file. You translate the *text inside* each block; you
> never add, remove, split, or merge blocks, and you never change the blank-line
> structure. Break this and the two columns drift out of sync.

A corollary blind spot: if English is copied verbatim into a `zh` block, the site
marks it "translated" even though the reader sees English. Detecting that is a
task in itself (§5).

## 2. Prerequisites / tech stack

- A site built on this theme: Astro (static output) + this theme as a git
  submodule at `theme/`, Node ≥ 18, Pagefind for search. See the main
  [README](./README.md) for setup.
- Content already extracted into `content/en/**` (the site's own
  `scripts/extract.mjs`). Translation only ever writes `content/zh/**`.
- The agent works in the repo and can run `python3`, `git`, and `npm run build`.

## 3. What to translate — and what to leave in the original language

Translate **prose**: descriptions, guides, explanations, notes, changelog entry
descriptions, table *values* that are natural language.

Leave in the original language (these are not "untranslated" — translating them is
wrong):

| Leave as-is | Why |
|---|---|
| Fenced code blocks, shell/CLI examples | Code, not prose |
| Command **syntax** (`bvi create [mac <addr>]`) and usage examples | Users type these verbatim |
| API / symbol identifiers (`nat44_ei_add_del`, snake_case) | Like function names |
| Command-name headings (`## bvi create`) | They *are* the command |
| `Declaration:` / `Implementation:` source references | Code metadata + links |
| Type / signature tables | Code identifiers |
| Commit hashes and `[hash](url)` links | Immutable references |
| Academic citations, paper titles, author names | Cited verbatim |

When translating a changelog-style bullet like `* [hash](url) nat: add support
for X`, **keep** the `[hash](url)` link, **keep** the `nat:` component prefix,
and translate only the description → `* [hash](url) nat：增加对 X 的支持`.
Preserve backslash escapes (`\_`), curly quotes, and trailing tags like
`(VPP-1234)` exactly.

## 4. Deciding what needs (re)translation on a version bump

When the upstream version changes and the extractor re-writes `content/en/**`,
you don't re-translate everything. The English source is versioned in git, so
diff the new original against the last-translated original:

```bash
npm run extract                                        # refresh content/en
# files whose prose actually changed (ignore version-only churn in sourceUrl):
git diff --name-only -I '^sourceUrl:' -- content/en
git ls-files --others --exclude-standard content/en    # new pages -> translate
git diff --name-only --diff-filter=D -- content/en     # deleted upstream -> drop the zh
```

The `-I '^sourceUrl:'` is essential: the version lives in the `sourceUrl`
frontmatter, so without it every file looks changed. Only the files this reports
need translation work.

## 5. Finding prose that was left in English

Because copied-in English counts as "translated" (§1), a size/status indicator
won't reveal gaps. Scan for **English prose inside `zh` blocks**, excluding the
legitimately-English categories from §3. A robust heuristic:

- block has no CJK characters, **and**
- it reads like a sentence (≥ a few common English function words, a line with
  several lowercase words), **and**
- it is *not* a code fence, table, blockquoted command, `Declaration:` line, or a
  **snake_case identifier list** (watch for `\_`-escaped identifiers splitting
  into fake "words" — the classic false positive).

Validate the heuristic by sampling before trusting the count — the raw count is
usually inflated by command examples and identifier lists.

## 6. Instructing the agent (prompt template)

> Translate the untranslated English prose in `content/zh/<path>.md` of this
> `astro-parallel-docs` site into Chinese.
>
> - Translate **only** prose (descriptions/guides/changelog descriptions).
> - **Do not** translate code, command syntax/examples, API identifiers, type
>   tables, `Declaration:`/`Implementation:` lines, command-name headings, or
>   citations. Keep `[hash](url)` links, `component:` prefixes, acronyms,
>   backslash escapes and `(VPP-nnnn)` tags **verbatim**.
> - **Preserve block alignment:** keep the same number of blank-line-separated
>   blocks and the same indentation; change text within lines only — never add or
>   remove lines or blocks.
> - Verify: after editing, no English prose should remain (re-scan), and
>   `npm run build` must complete with **no `[align] block-count mismatch`**
>   warning for the file.

## 7. Scaling to large sets (parallel agents)

For a big backlog (e.g. dozens of release-notes pages), fan out: give each
subagent a group of files and a **deterministic block-replacement pipeline** so
structure can't drift:

1. **Dump** the untranslated prose blocks of a file to a JSON array (exact block
   strings, in order).
2. The agent produces a same-length JSON array of Chinese translations.
3. **Apply** by exact whole-block replacement (`raw.replace(en, zh, 1)` per
   entry) — nothing else in the file changes.
4. Re-dump → expect `0` remaining; report before/after.

Notes from production runs:
- **Duplicate lines:** the same commit entry often appears under several `.api`
  sections. Exact-replace one-per-entry, or translate duplicates with a
  replace-all pass; either way confirm the final residual is `0`.
- **Don't run many concurrent `npm run build`s** — builds are memory-hungry and
  will OOM. Let agents edit only; run **one** build centrally at the end.
- Agents edit different files, so no locking/worktrees are needed; a final
  central build + scan is the integration check.

## 8. Verification checklist (always, before committing)

- [ ] `npm run build` completes, the page count matches what the site expects,
      and there is **no `[align] block-count mismatch`** warning.
- [ ] The English-prose scan (§5) returns **0** for the touched files.
- [ ] Spot-check a built page: `zh` column is Chinese, `en` column is the
      original, and `[hash](url)` links / code are intact.
- [ ] `git status` shows only the intended `content/zh/**` files changed
      (no `dist/`, no stray edits).

## 9. Gotchas, distilled

- The version number lives in `sourceUrl` frontmatter — ignore it when diffing.
- Copied-in English is silently counted as "translated" — scan for it explicitly.
- `\_`-escaped snake_case identifiers masquerade as prose — exclude them.
- Never alter block count / blank-line structure — it desynchronizes the columns.
- Keep code, commands, identifiers, tables, citations, and hashes in the original.
- One build at the end; never a build storm.

## 10. Frontmatter, internal links, and a per-file block check (addendum)

Notes from a full DPDK run that complement the sections above.

### Frontmatter: translate `title`, keep `sourceUrl` verbatim

Each extracted page carries YAML frontmatter with `title` and `sourceUrl`.
Translate `title`; leave `sourceUrl` **byte-for-byte unchanged**. The theme's
link rewriter (`lib/align.ts#rewriteInternalLinks`) resolves every relative
`*.html` / `*.rst` link *against this page's `sourceUrl` at build time*, so
altering it breaks in-page links. (It is also why the §4 version diff ignores
`^sourceUrl:` — the version lives there.)

### Internal doc links and images are rewritten for you — leave the targets as-is

Beyond the `[hash](url)` links of §3, upstream pages carry **relative doc links**
(`../rel_notes/index.html`, `building.html`) and image paths (`_images/…`,
`/assets/…`). Do not translate or "fix" these *targets* into site routes — the
theme rewrites `*.html` / `*.rst` → `/official/<slug>/` and `_images/…` →
`/assets/…` on its own. Translate only the link **text**. Likewise keep escaped
heading numbering exactly: `# 1\. Introduction` → `# 1\. 简介` (the `\.` is easy
to drop and changes how the line parses). A block that is a heading in the
original must stay a heading at the same level — the TOC and anchors are built
from heading blocks.

### Verify each file with the theme's own splitter — don't wait for the build

The build's `[align] block-count mismatch` warning is the last line of defense.
A faster, file-by-file gate is to count blocks with the **same** splitter the
theme aligns with. `splitBlocks` is exported from `theme/lib/align.ts`:

```js
import { splitBlocks } from '../theme/lib/align.ts';
// a pair is aligned iff splitBlocks(enSource).length === splitBlocks(zhSource).length
```

Re-implementing the split in a site-local script (e.g. a hand-rolled
`scripts/blockcount.mjs`) risks drifting from the theme: a file can then pass the
local check yet still desync at render. Import the theme's `splitBlocks`, or keep
any local copy exactly in step with `lib/align.ts` (same `remark-parse` +
`remark-gfm`, top-level children only).
