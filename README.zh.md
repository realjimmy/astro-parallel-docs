# astro-parallel-docs（中文说明）

[English](./README.md) · **中文**

一套用于**并排双语(原文/译文)对照文档站**的 [Astro](https://astro.build/) 主题:
原文与译文分两栏逐段对齐,带全文搜索、三种阅读视图、明暗模式,每个站点可选自己
的配色。以 **git 子模块**方式引入;所有站点专属配置集中在一个 `site.config.mjs` 里。

> **要用 AI 翻译?** 见 **[TRANSLATING.md](./TRANSLATING.md)** —— 如何指挥 AI(如
> Claude Code)基于本主题翻译整套文档:块对齐契约、哪些该译/哪些保留原文、版本升级
> 的增量检测、并行扩展,以及验证清单。(该文档为英文)

## 特色

- **逐段并排排版** —— 原文、译文分两栏按块对齐;三种阅读视图(对照 / 仅译文 /
  仅原文),小屏下每段有「原文」展开按钮。
- **全文搜索** —— 基于 [Pagefind](https://pagefind.app/),中英兼顾。
- **明暗模式** + **每站配色** —— 内置多套调色板,或自定义主色。
- **界面完全可国际化** —— 所有文案来自语言包,内置 `zh`/`en`,可逐条覆盖。
- **侧栏导航** —— 普通站点用服务端渲染的目录树;超大站点可开启**分面目录**
  (客户端渲染、可切换的浏览维度)。
- **阅读增强** —— 带滚动高亮的页内目录、上一篇/下一篇、代码复制、图片灯箱、
  回到顶部、「改进本页」链接、平铺水印,以及复制正文时自动附上来源。
- **SEO** —— canonical、OpenGraph/Twitter、sitemap、自动生成的 `robots.txt`。
- **可选打赏组件** —— 收款码(微信/支付宝)和/或链接(Ko-fi / PayPal / 爱发电等)。

## 什么情况下用它

当你要做**某套现有文档的翻译镜像站**、并希望读者能同时看到原文与译文时——比如
把一个英文项目的官方文档做成中文对照站。

适合:内容是一批带「原文/译文」两个版本的 Markdown/HTML 页面,想要对照阅读 +
搜索 + 几乎零前端工作量的精致静态站。

**不适合**:单语言文档站(用 Starlight 之类)、博客、Web 应用——整套设计都围绕
「双栏对照」模型。

## 工作原理

- 主题**自包含**,通过 `@config` 别名读取每个站点的 `site.config.mjs`,从不写死
  站名、域名、配色或文案。
- **内容抽取是各仓库自己的事**:每个站保留自己的 `scripts/extract.mjs`(各上游的
  URL 结构和版本格式都不同),只共享渲染后的产物到 `content/`(`en/` 原文 +
  `zh/` 译文两棵树)。文内图片本地化到 `public/assets/`,以 `/assets/…` 引用——
  这也是主题链接改写器约定的固定路径。

```
your-site/
├── theme/                 ← 本仓库,作为 git 子模块
├── site.config.mjs        ← 唯一需要你改的文件
├── scripts/extract.mjs    ← 你自己的上游抽取器(各仓库自备)
├── content/{en,zh}/…      ← 渲染后的文档
├── public/                ← favicon、og-preview.png、收款码、/assets 图片
└── src/pages/…            ← 极薄的样板(见 example/)
```

## 在本仓库内预览主题

把主题接入真实站点之前,可以直接用仓库自带的 `example/` 脚手架就地预览 ——
无需 submodule、无需另建仓库:

```bash
npm install          # 仅开发用的依赖(与 deps.json 一致)
npm run preview      # 在 example/ 上起 dev 服务  →  http://localhost:4321
npm run preview:build   # 或一次性静态构建到 example/dist/
```

`preview` 会先建立软链 `example/theme → ..`(让脚手架把本仓库当成它的
`theme/` submodule 来解析),再运行 `astro dev --root example`。软链、
`node_modules/`、构建产物都已被 git 忽略,预览不会弄脏工作区。预览下不会索引
全文搜索(那是站点自己 `build` 时跑 Pagefind 的步骤),其余部分与真实站点一致。

## 接入步骤

模板见 `example/`。简而言之:

1. **加子模块**到 `theme/`:
   ```bash
   git submodule add https://github.com/realjimmy/astro-parallel-docs.git theme
   ```
2. **拷贝样板**(在 `example/` 里):`astro.config.mjs`、`tsconfig.json`、
   `vitest.config.ts`,以及 `src/pages/` 下的四个文件。它们负责把 `@theme` →
   `theme/`、`@config` → `site.config.mjs` 的别名接好。
3. **安装依赖**(子模块不带 `node_modules`):
   ```bash
   npm i @fontsource/ibm-plex-mono @fontsource/space-grotesk astro rehype-highlight rehype-raw rehype-stringify remark-rehype
   npm i -D @astrojs/check @astrojs/sitemap @types/node cheerio gray-matter pagefind remark-gfm remark-parse turndown turndown-plugin-gfm typescript unified vitest
   ```
4. **编写 `site.config.mjs`**(从 `example/site.config.mjs` 起步;完整字段见
   `theme/config.d.ts`)。
5. **放品牌资源**到 `public/`(favicon 套图、`og-preview.png`、可选收款码)。
6. **产出内容**:`npm run extract` → 翻译进 `content/zh/` → `npm run build`。

### 之后更新主题
```bash
git submodule update --remote theme   # 拉取主题最新提交
git add theme && git commit           # 在本站锁定新版本
```

### 带子模块部署
CI 必须拉取子模块。在 Cloudflare Pages / Workers Builds 上:子模块 URL 用
**HTTPS**(没有 SSH key),并保持本仓库**公开**(跨仓库私有子模块无法鉴权),
然后把构建命令设为:
```bash
git submodule update --init --recursive && npm run build
```

## 配置速查

字段都在 `site.config.mjs`,类型见 `config.d.ts`。

| 字段 | 必填 | 作用 |
|---|---|---|
| `siteName` | ✓ | 站点名称(标签页、侧栏品牌、meta) |
| `version` | ✓ | 品牌旁的版本徽标 |
| `upstreamBase` | ✓ | 上游镜像基址(带末尾斜杠);抽取器 + 链接改写用 |
| `siteUrl` | ✓ | 公开地址(canonical、sitemap、robots) |
| `repoUrl` | ✓ | 仓库地址(「改进本页」链接) |
| `translator` | ✓ | 署名译者 |
| `attribution` | ✓ | `{ watermark, copy }` —— 水印文字 + 复制时附加的来源 |
| `brandMark` | ✓ | 内联 SVG logo(用 `--accent`/`--signal`) |
| `sections` | ✓ | 顶层导航顺序:`[slug, 译文标签, 原文标签][]` |
| `lang` | | `<html lang>`(默认 `zh`) |
| `uiLang` | | 界面语言包:`zh`(默认)或 `en` |
| `strings` | | 覆盖单条界面文案(`Partial<UIStrings>`) |
| `palette` | | 配色:预置名或自定义 `{light,dark}` 主色对 |
| `fonts` | | 覆盖 `--font-body/display/mono` 字体栈 |
| `reward` | | 页脚打赏:`{ comment?, label?, methods[] }` |
| `tipImage` | | 单个微信收款码简写(仅在未设 `reward` 时生效) |
| `groupOverrides` | | 重命名无页面的中间层文件夹 |
| `collapsedByDefault` | | 默认折叠的侧栏分组 |
| `nav` | | 大型站点的分面目录(见下) |
| `landing` | | 通用首页模板的内容 |

### 配色
```js
palette: 'purple-orange'   // 内置预置
// 或自定义(未给的 soft 变体自动派生):
palette: { light: { accent: '#8f2d9b', signal: '#e0532b' },
           dark:  { accent: '#c877d4', signal: '#ff7a4d' } }
```
预置(见 `lib/palette.ts`):`blue-teal`(默认)、`purple-orange`、`emerald-sky`、
`crimson-gold`、`indigo-rose`。只有 accent/signal 一对被主题化,其余保持共享,
让所有站点观感统一。

### 界面语言
用 `uiLang` 选内置语言包,用 `strings` 细调。三个视图标签和「原文」按钮描述的是
*你这一对具体语言*,内置措辞不合适就覆盖它们:
```js
uiLang: 'en',
strings: { viewOriginal: 'English', viewTranslation: '中文', viewBoth: '对照' },
```

### 打赏组件
```js
reward: {
  comment: 'Buy me a coffee',
  methods: [
    { type: 'link', label: 'Ko-fi', href: 'https://ko-fi.com/you' },
    { type: 'qr',   label: '微信',   image: '/tip/wechat.jpg' },
  ],
}
```

### 分面目录(大型站点)
不设 `nav` 就是普通的服务端目录树。超大索引可开启客户端渲染、可切换的分面目录;
每个维度是一个由你的站点生成的 JSON 端点:
```js
nav: {
  scoped: true,                       // 懒加载各分组
  defaultDimension: 'topic',
  dimensions: [
    { key: 'topic', label: '按主题', data: '/nav-topic.json' },
    { key: 'date',  label: '按时间', data: '/nav-date.json'  },
  ],
}
```
每个端点返回 `[{ key, label, items: [{ href, title, subtitle, translated }] }]`。
这些 `nav-*.json.ts` 端点属于站点数据(和抽取器一样),放在你的仓库里,不在主题里。
