// UI string packs. Every visible label in the theme comes from here, so a site
// can run the interface in any language. A site picks a pack with
// `config.uiLang` ('zh' default, 'en' shipped) and overrides individual keys
// with `config.strings`. The bilingual-pair labels (viewOriginal / viewTranslation
// / peek / untranslated) assume "original -> translation"; override them to name
// the actual two languages of your pair.
import config from '@config';

export interface UIStrings {
  // document
  homeTitle: string; // <title> of the generic landing page
  landingEnter: string; // hero "start reading" button
  // view switcher (the three reading modes: both / translation-only / original-only)
  viewMenuLabel: string; // aria-label of the switcher
  viewBoth: string;
  viewTranslation: string;
  viewOriginal: string;
  // per-paragraph original reveal + untranslated notices
  peekOpen: string; // button: reveal the original
  peekClose: string; // button: hide it again
  peekAria: string;
  untranslatedTag: string;
  untranslatedNote: string;
  // page meta
  sourcePrefix: string; // before the upstream source link, e.g. "Source: "
  translatorLabel: string; // before config.translator, e.g. "Author: "
  updatedLabel: string; // before the updated date
  editLink: string; // "improve this page on GitHub" link text
  // mobile hint (small screens fold the original; tap a paragraph to reveal)
  mobileHint: string;
  closeHint: string; // aria-label of its close button
  // sidebar / nav
  navMenuOpen: string; // aria-label of the hamburger
  sidebarLabel: string; // aria-label of the sidebar nav
  navToggleLabel: string; // aria-label of a group expand/collapse toggle
  navDimsLabel: string; // aria-label of the faceted-catalog dimension tabs
  navLoading: string; // catalog loading placeholder
  navLoadError: string; // catalog load failure
  // table of contents
  tocButton: string;
  tocHeading: string;
  // theme toggle
  themeToggleLabel: string; // aria-label
  themeToggleTitle: string; // title
  // pager
  pagerLabel: string; // aria-label of the prev/next nav
  pagerPrev: string;
  pagerNext: string;
  // code copy button
  codeCopy: string;
  codeCopied: string;
  // back to top
  toTop: string;
  // reward / "buy me a coffee" widget
  rewardComment: string;
  rewardButton: string;
  // search (Pagefind)
  searchPlaceholder: string;
  searchZeroResults: string; // keep the [SEARCH_TERM] placeholder
}

export const PACKS: Record<string, UIStrings> = {
  zh: {
    homeTitle: '首页',
    landingEnter: '开始阅读',
    viewMenuLabel: '视图模式',
    viewBoth: '中英对照',
    viewTranslation: '中文',
    viewOriginal: '英文',
    peekOpen: '原文',
    peekClose: '收起',
    peekAria: '展开英文原文',
    untranslatedTag: '未翻译',
    untranslatedNote: '本页为英文原文，中文翻译尚未完成。',
    sourcePrefix: '官方原文：',
    translatorLabel: '作者：',
    updatedLabel: '更新：',
    editLink: '在 GitHub 改进本页 ↗',
    mobileHint: '💡 小屏已折叠英文原文，点段落「原文」可展开对照',
    closeHint: '关闭提示',
    navMenuOpen: '打开导航菜单',
    sidebarLabel: '文档导航',
    navToggleLabel: '展开或收起子目录',
    navDimsLabel: '浏览维度',
    navLoading: '载入目录…',
    navLoadError: '目录载入失败',
    tocButton: '目录',
    tocHeading: '本页目录',
    themeToggleLabel: '切换白天 / 黑夜模式',
    themeToggleTitle: '白天 / 黑夜',
    pagerLabel: '上一篇 / 下一篇',
    pagerPrev: '上一篇',
    pagerNext: '下一篇',
    codeCopy: '复制',
    codeCopied: '已复制',
    toTop: '回到顶部',
    rewardComment: 'Buy me a coffee',
    rewardButton: '赞赏',
    searchPlaceholder: '搜索文档',
    searchZeroResults: '未找到 “[SEARCH_TERM]” 的结果',
  },
  en: {
    homeTitle: 'Home',
    landingEnter: 'Start reading',
    viewMenuLabel: 'Reading mode',
    viewBoth: 'Side by side',
    viewTranslation: 'Translation',
    viewOriginal: 'Original',
    peekOpen: 'Original',
    peekClose: 'Hide',
    peekAria: 'Reveal the original text',
    untranslatedTag: 'Untranslated',
    untranslatedNote: 'This page shows the original; the translation is not ready yet.',
    sourcePrefix: 'Source: ',
    translatorLabel: 'Author: ',
    updatedLabel: 'Updated: ',
    editLink: 'Improve this page on GitHub ↗',
    mobileHint: '💡 The original is folded on small screens — tap “Original” on a paragraph to compare.',
    closeHint: 'Dismiss',
    navMenuOpen: 'Open navigation menu',
    sidebarLabel: 'Documentation navigation',
    navToggleLabel: 'Expand or collapse subsection',
    navDimsLabel: 'Browse by',
    navLoading: 'Loading…',
    navLoadError: 'Failed to load the catalog',
    tocButton: 'Contents',
    tocHeading: 'On this page',
    themeToggleLabel: 'Toggle light / dark mode',
    themeToggleTitle: 'Light / dark',
    pagerLabel: 'Previous / next',
    pagerPrev: 'Previous',
    pagerNext: 'Next',
    codeCopy: 'Copy',
    codeCopied: 'Copied',
    toTop: 'Back to top',
    rewardComment: 'Buy me a coffee',
    rewardButton: 'Support',
    searchPlaceholder: 'Search docs',
    searchZeroResults: 'No results for “[SEARCH_TERM]”',
  },
};

/** The resolved UI strings: the chosen pack (uiLang, default zh) with per-key config overrides. */
export function resolveStrings(): UIStrings {
  const lang = (config.uiLang && PACKS[config.uiLang]) ? config.uiLang : 'zh';
  return { ...PACKS[lang], ...(config.strings ?? {}) } as UIStrings;
}

export const strings: UIStrings = resolveStrings();
