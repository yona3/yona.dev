# 技術選定やり直し Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将来自作 CMS に差し替えられるよう、現在の Markdown 正本サイトを `ContentSource`、`ArticleBlock`、`CSS Modules + CSS custom properties` に整理する。

**Architecture:** 第一段階では `Next.js` と `Vercel` を維持し、入力元だけを `ContentSource` に閉じる。Markdown は `MarkdownSource` が `Article` / `ArticleBlock[]` に変換し、route と renderer は入力元を知らない。styling は `Tailwind CSS` を撤去し、CSS custom properties と責務別 CSS Modules に統一する。

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, CSS custom properties, pnpm, mise, Markdown frontmatter.

---

## File Structure

**Create**

- `web/src/lib/content/types.ts`: `Article`, `ArticleBlock`, `ArticleAsset`, `ContentSource` の型と kind label を定義する。
- `web/src/lib/content/blocks.ts`: Markdown 本文を `ArticleBlock[]` に変換する。
- `web/src/lib/content/markdown-source.ts`: repo 内 Markdown を読み、`ContentSource` として公開する。
- `web/src/lib/content/index.ts`: route / component 向けの公開入口を集約する。
- `web/src/components/site/ArticleContent.tsx`: `ArticleBlock[]` を描画する。
- `web/src/components/site/article.module.css`: 記事本文と article block の styling。
- `web/src/components/site/layout.module.css`: shell、header、footer、skip link 以外の共通 layout。
- `web/src/components/site/navigation.module.css`: brand、nav、social links。
- `web/src/components/site/home.module.css`: home hero、intro、speech、hedgehog。
- `web/src/components/site/notes.module.css`: notes list と note detail metadata。
- `web/src/components/site/motion.module.css`: animation と `prefers-reduced-motion`。
- `docs/tech-stack.md`: 採用技術、非採用技術、再評価条件、自作 CMS 仮 schema を記録する。

**Modify**

- `web/src/styles/globals.css`: `@import "tailwindcss"` と `@theme` を削除し、global token を集約する。
- `web/postcss.config.js`: Tailwind PostCSS plugin を外す。PostCSS 設定が空になる場合は file を削除する。
- `web/package.json`: `tailwindcss`, `@tailwindcss/postcss`, 未使用になった `postcss`, `autoprefixer` を削除する。
- `web/pnpm-lock.yaml`: 依存削除に合わせて更新する。
- `web/src/lib/notes.ts`: 互換 wrapper に縮小するか、`web/src/lib/content/index.ts` へ移行後に削除する。
- `web/src/components/site/MarkdownContent.tsx`: `ArticleContent.tsx` に置き換える。
- `web/src/components/site/NoteList.tsx`: `Note` ではなく `Article` を受け取る。
- `web/src/components/site/SiteShell.tsx`: CSS module import を責務別に変更する。
- `web/src/components/site/HomeIntro.tsx`, `HelloBubble.tsx`, `HedgehogRunner.tsx`: home / motion module に移す。
- `web/src/app/page.tsx`, `web/src/app/notes/page.tsx`, `web/src/app/notes/[slug]/page.tsx`: `getAllArticles`, `getArticleBySlug`, `getArticleSlugs`, `ArticleContent` へ切り替える。
- `DESIGN.md`: token と CSS Modules 統一方針を現実の実装に合わせる。
- `docs/superpowers/specs/2026-05-08-technology-selection-design.md`: 実装中に判明した選定差分があれば反映する。

**Remove**

- `web/src/components/site/site.module.css`: 分割後に参照が 0 になったことを確認して削除する。
- `web/src/components/site/MarkdownContent.tsx`: `ArticleContent.tsx` 移行後に削除する。

## Task 1: Tailwind を撤去し CSS custom properties を正本にする

**Files:**

- Modify: `web/src/styles/globals.css`
- Modify or delete: `web/postcss.config.js`
- Modify: `web/package.json`
- Modify: `web/pnpm-lock.yaml`
- Verify: `web/src/**/*.tsx`, `web/src/**/*.css`

- [ ] **Step 1: Tailwind utility が使われていないことを確認する**

Run:

```bash
rg -n "className=\"[^\"]*[a-z]+-[a-z0-9\\[\\]:/.-]" web/src
rg -n "@apply|@layer|@tailwind|@import \"tailwindcss\"|@theme" web
```

Expected:

- 1 つめの command は、`styles.*` ではない utility class が存在しないことを確認する目的で読む。
- 2 つめの command は、`web/src/styles/globals.css` の `@import "tailwindcss"` と `@theme`、および `web/postcss.config.js` の Tailwind plugin だけを示す。

- [ ] **Step 2: `globals.css` から Tailwind entrypoint を削除する**

Replace the top of `web/src/styles/globals.css` with:

```css
:root {
  --color-primary: #2c261f;
  --color-secondary: #675d51;
  --color-muted: #7a6e60;
  --color-faint: #b8aa98;
  --color-background: #fcf8f0;
  --color-surface: #fffdf8;
  --color-surface-warm: #f6efdf;
  --color-border: #e6d9c7;
  --color-border-soft: #efe5d6;
  --color-accent: #9b7657;
  --color-link: #6c4d35;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-section: 48px;
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  color-scheme: light;
}
```

Expected:

- `@import "tailwindcss";` が消える。
- `@theme` が消える。
- 既存の CSS 変数は保ち、spacing / radius token が追加される。

- [ ] **Step 3: PostCSS の Tailwind plugin を外す**

If no PostCSS plugin remains necessary, delete `web/postcss.config.js`.

Run:

```bash
git rm web/postcss.config.js
```

Expected:

- `web/postcss.config.js` が削除対象になる。
- `web/eslint.config.mjs` の ignore に `postcss.config.js` が残っても害はないため、この task では触らない。

- [ ] **Step 4: Tailwind 関連依存を削除する**

Run:

```bash
cd web
pnpm remove tailwindcss @tailwindcss/postcss postcss autoprefixer
```

Expected:

- `web/package.json` から `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `autoprefixer` が消える。
- `web/pnpm-lock.yaml` が更新される。

- [ ] **Step 5: 検証する**

Run from repo root:

```bash
mise run lint
mise run build
```

Expected:

- `lint` が exit 0。
- `build` が exit 0。
- CSS import error が出ない。

- [ ] **Step 6: commit する**

Run:

```bash
git add web/src/styles/globals.css web/postcss.config.js web/package.json web/pnpm-lock.yaml
git commit -m "chore(style): Tailwind 依存を撤去"
```

Expected:

- 依存削除と global token の commit が 1 つできる。

## Task 2: `site.module.css` を責務別 CSS Modules に分割する

**Files:**

- Create: `web/src/components/site/layout.module.css`
- Create: `web/src/components/site/navigation.module.css`
- Create: `web/src/components/site/home.module.css`
- Create: `web/src/components/site/notes.module.css`
- Create: `web/src/components/site/article.module.css`
- Create: `web/src/components/site/motion.module.css`
- Modify: `web/src/components/site/SiteShell.tsx`
- Modify: `web/src/components/site/HomeIntro.tsx`
- Modify: `web/src/components/site/HelloBubble.tsx`
- Modify: `web/src/components/site/HedgehogRunner.tsx`
- Modify: `web/src/components/site/NoteList.tsx`
- Modify: `web/src/components/site/MarkdownContent.tsx`
- Modify: `web/src/app/page.tsx`
- Modify: `web/src/app/about/page.tsx`
- Modify: `web/src/app/notes/page.tsx`
- Modify: `web/src/app/notes/[slug]/page.tsx`
- Remove after imports are gone: `web/src/components/site/site.module.css`

- [ ] **Step 1: CSS class の移動先を固定する**

Move selectors from `site.module.css` using this mapping:

```text
layout.module.css:
  page, shell, header, constructionNotice, footer, coffeeEmoji, visuallyHidden

navigation.module.css:
  brand, nav, socialLinks, socialIcon

home.module.css:
  hero, heroAbout, pageTitle, nameHeading, nameSpeech, nameSpeechHidden,
  nameCaret, hedgehogEmoji, hedgehogButton, hedgehogWobbleHost,
  hedgehogRunning, lead, section, sectionHeader, sectionLink

notes.module.css:
  noteList, noteItem, noteType, noteMeta, noteArticle, noteEnd

article.module.css:
  markdown and every nested selector under .markdown

motion.module.css:
  bubbleIn, bubbleOut, caretBlink, hedgehogWobble, hedgehogLap,
  related prefers-reduced-motion blocks
```

Expected:

- No selector is duplicated between module files except animation names referenced through imports.
- Visual values are copied verbatim in this task. Token cleanup belongs to Task 3.

- [ ] **Step 2: `SiteShell.tsx` import を分ける**

Change imports and class references:

```tsx
import layoutStyles from "./layout.module.css";
import navigationStyles from "./navigation.module.css";
```

Use:

```tsx
<div className={layoutStyles.page}>
  <div className={layoutStyles.shell}>
    <header className={layoutStyles.header}>
      <Link className={navigationStyles.brand} href="/">
        yona.dev
      </Link>
      <nav className={navigationStyles.nav} aria-label="主要ナビゲーション">
```

Expected:

- `SiteShell.tsx` no longer imports `site.module.css`.
- Coffee icon uses `layoutStyles.coffeeEmoji`.

- [ ] **Step 3: Home 関連 component の import を分ける**

Use these imports:

```tsx
// web/src/components/site/HomeIntro.tsx
import homeStyles from "./home.module.css";

// web/src/components/site/HelloBubble.tsx
import homeStyles from "./home.module.css";

// web/src/components/site/HedgehogRunner.tsx
import homeStyles from "./home.module.css";
```

Expected:

- `HomeIntro`, `HelloBubble`, `HedgehogRunner` no longer import `site.module.css`.
- class references use `homeStyles`.

- [ ] **Step 4: page route の import を分ける**

Use these imports:

```tsx
// web/src/app/page.tsx
import homeStyles from "../components/site/home.module.css";
import navigationStyles from "../components/site/navigation.module.css";

// web/src/app/about/page.tsx
import homeStyles from "../../components/site/home.module.css";

// web/src/app/notes/page.tsx
import homeStyles from "../../components/site/home.module.css";
import notesStyles from "../../components/site/notes.module.css";

// web/src/app/notes/[slug]/page.tsx
import articleStyles from "../../../components/site/article.module.css";
import notesStyles from "../../../components/site/notes.module.css";
```

Expected:

- route files import only the CSS modules they render.
- `socialLinks` uses `navigationStyles.socialLinks`.
- hero / lead / section classes use `homeStyles`.
- note detail article uses `notesStyles.noteArticle` and article content wrapper uses `articleStyles`.

- [ ] **Step 5: `site.module.css` 参照が消えたことを確認して削除する**

Run:

```bash
rg -n "site\\.module\\.css|styles\\." web/src/components/site web/src/app
```

Expected:

- `site.module.css` import is absent.
- Remaining `styles.` references are only from renamed local import names if any. Prefer `layoutStyles`, `homeStyles`, `notesStyles`, `articleStyles`, `navigationStyles`.

Then run:

```bash
git rm web/src/components/site/site.module.css
```

Expected:

- old module is removed.

- [ ] **Step 6: 検証する**

Run:

```bash
git diff --check
mise run lint
mise run build
```

Expected:

- whitespace check exit 0。
- lint exit 0。
- build exit 0。
- CSS module missing class error が出ない。

- [ ] **Step 7: commit する**

Run:

```bash
git add web/src/components/site web/src/app web/src/styles/globals.css
git commit -m "refactor(style): CSS Modules を責務別に分割"
```

Expected:

- 見た目を変えない CSS 分割 commit が 1 つできる。

## Task 3: `ContentSource` と `Article` 型を導入する

**Files:**

- Create: `web/src/lib/content/types.ts`
- Create: `web/src/lib/content/blocks.ts`
- Create: `web/src/lib/content/markdown-source.ts`
- Create: `web/src/lib/content/index.ts`
- Modify: `web/src/lib/notes.ts`

- [ ] **Step 1: content 型を追加する**

Create `web/src/lib/content/types.ts`:

```ts
export type ArticleKind = "article" | "note" | "log";

export const articleKindLabels: Record<ArticleKind, string> = {
  article: "記事",
  note: "ノート",
  log: "記録",
};

export type ArticleAsset = {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurData?: string;
};

export type ArticleBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "code"; code: string; language?: string }
  | { kind: "image"; asset: ArticleAsset; caption?: string }
  | { kind: "callout"; tone: "note" | "warning"; text: string }
  | { kind: "linkCard"; title: string; url: string; description?: string }
  | { kind: "gallery"; images: ArticleAsset[] };

export type Article = {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  kind: ArticleKind;
  heroImage?: ArticleAsset;
  isPublished: boolean;
  blocks: ArticleBlock[];
};

export type ContentSource = {
  getAllArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  getArticleSlugs(): Promise<string[]>;
};
```

Expected:

- Boolean property is `isPublished` to satisfy local naming policy.
- `ArticleKind` keeps current `article | note | log` values.

- [ ] **Step 2: Markdown block parser を追加する**

Create `web/src/lib/content/blocks.ts`:

```ts
import type { ArticleAsset, ArticleBlock } from "./types";

const flushParagraph = (blocks: ArticleBlock[], paragraph: string[]) => {
  if (paragraph.length === 0) return;
  blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  paragraph.length = 0;
};

const parseImageLine = (line: string): ArticleBlock | null => {
  const match = line.match(/^!\[(?<alt>[^\]]*)\]\((?<src>[^)\s]+)(?:\s+"(?<caption>[^"]+)")?\)$/);

  if (!match?.groups) return null;

  const asset: ArticleAsset = {
    id: match.groups.src,
    src: match.groups.src,
    alt: match.groups.alt,
  };

  return {
    kind: "image",
    asset,
    caption: match.groups.caption,
  };
};

export const parseArticleBlocks = (content: string): ArticleBlock[] => {
  const blocks: ArticleBlock[] = [];
  const paragraph: string[] = [];
  const lines = content.split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph(blocks, paragraph);
      index += 1;
      continue;
    }

    if (trimmed.startsWith(":::callout")) {
      flushParagraph(blocks, paragraph);
      const tone = trimmed.includes("warning") ? "warning" : "note";
      const calloutLines: string[] = [];
      index += 1;

      while (index < lines.length && lines[index]?.trim() !== ":::") {
        calloutLines.push((lines[index] ?? "").trim());
        index += 1;
      }

      if (lines[index]?.trim() !== ":::") {
        throw new Error("Unclosed callout block");
      }

      blocks.push({ kind: "callout", tone, text: calloutLines.join(" ") });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      flushParagraph(blocks, paragraph);
      const language = trimmed.slice(3).trim() || undefined;
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index]?.trim().startsWith("```")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }

      if (!lines[index]?.trim().startsWith("```")) {
        throw new Error("Unclosed code block");
      }

      blocks.push({ kind: "code", code: codeLines.join("\n"), language });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph(blocks, paragraph);
      blocks.push({ kind: "heading", level: 3, text: trimmed.slice(4) });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph(blocks, paragraph);
      blocks.push({ kind: "heading", level: 2, text: trimmed.slice(3) });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph(blocks, paragraph);
      blocks.push({ kind: "heading", level: 1, text: trimmed.slice(2) });
      index += 1;
      continue;
    }

    const imageBlock = parseImageLine(trimmed);
    if (imageBlock) {
      flushParagraph(blocks, paragraph);
      blocks.push(imageBlock);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph(blocks, paragraph);
      const items: string[] = [];

      while (index < lines.length && lines[index]?.trim().startsWith("- ")) {
        items.push((lines[index] ?? "").trim().slice(2));
        index += 1;
      }

      blocks.push({ kind: "list", items });
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph(blocks, paragraph);
      const quoteLines: string[] = [];

      while (index < lines.length && lines[index]?.trim().startsWith("> ")) {
        quoteLines.push((lines[index] ?? "").trim().slice(2));
        index += 1;
      }

      blocks.push({ kind: "quote", text: quoteLines.join(" ") });
      continue;
    }

    if (trimmed.startsWith("::")) {
      throw new Error(`Unsupported custom block syntax: ${trimmed}`);
    }

    paragraph.push(trimmed);
    index += 1;
  }

  flushParagraph(blocks, paragraph);
  return blocks;
};
```

Expected:

- Existing Markdown features keep working.
- `:::callout` is supported as the first custom block.
- Unknown custom syntax beginning with `::` fails fast.

- [ ] **Step 3: Markdown source を追加する**

Create `web/src/lib/content/markdown-source.ts`:

```ts
import { promises as fs } from "node:fs";
import path from "node:path";

import { cache } from "react";

import { parseArticleBlocks } from "./blocks";
import type { Article, ArticleKind, ContentSource } from "./types";

type ArticleFrontmatter = {
  title: string;
  slug: string;
  date: string;
  type: ArticleKind;
  description: string;
  published: boolean;
  updatedAt?: string;
};

const notesDirectory = path.join(process.cwd(), "content", "notes");
const articleKinds = new Set<ArticleKind>(["article", "note", "log"]);

const normalizeArticleContent = (content: string, title: string): string => {
  const trimmed = content.trim();
  const firstLineEnd = trimmed.indexOf("\n");
  const firstLine = firstLineEnd === -1 ? trimmed : trimmed.slice(0, firstLineEnd);

  if (firstLine.trim() !== `# ${title}`) {
    return trimmed;
  }

  return firstLineEnd === -1 ? "" : trimmed.slice(firstLineEnd + 1).trimStart();
};

const parseFrontmatterValue = (value: string): string | boolean => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

const parseFrontmatter = (
  source: string,
  fileName: string,
): { data: ArticleFrontmatter; content: string } => {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Missing frontmatter in ${fileName}`);
  }

  const [, frontmatter, content] = match;
  const entries = frontmatter.split("\n").map((line) => {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      throw new Error(`Invalid frontmatter line in ${fileName}: ${line}`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    return [key, parseFrontmatterValue(value)] as const;
  });

  const data = Object.fromEntries(entries);

  if (
    typeof data.title !== "string" ||
    typeof data.slug !== "string" ||
    typeof data.date !== "string" ||
    typeof data.type !== "string" ||
    typeof data.description !== "string" ||
    typeof data.published !== "boolean"
  ) {
    throw new Error(`Invalid frontmatter shape in ${fileName}`);
  }

  if (!articleKinds.has(data.type as ArticleKind)) {
    throw new Error(`Invalid article kind in ${fileName}: ${data.type}`);
  }

  return {
    data: {
      title: data.title,
      slug: data.slug,
      date: data.date,
      type: data.type as ArticleKind,
      description: data.description,
      published: data.published,
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
    },
    content: normalizeArticleContent(content, data.title),
  };
};

const getAllMarkdownArticles = cache(async (): Promise<Article[]> => {
  const fileNames = await fs.readdir(notesDirectory);
  const articles = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const source = await fs.readFile(path.join(notesDirectory, fileName), "utf8");
        const { data, content } = parseFrontmatter(source, fileName);

        return {
          id: data.slug,
          slug: data.slug,
          title: data.title,
          description: data.description,
          publishedAt: data.date,
          updatedAt: data.updatedAt,
          kind: data.type,
          isPublished: data.published,
          blocks: parseArticleBlocks(content),
        } satisfies Article;
      }),
  );

  return articles
    .filter((article) => article.isPublished)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export const markdownSource: ContentSource = {
  getAllArticles: getAllMarkdownArticles,
  async getArticleBySlug(slug) {
    const articles = await getAllMarkdownArticles();
    return articles.find((article) => article.slug === slug) ?? null;
  },
  async getArticleSlugs() {
    const articles = await getAllMarkdownArticles();
    return articles.map((article) => article.slug);
  },
};
```

Expected:

- Existing Markdown files still load.
- Content source hides filesystem details from route files.

- [ ] **Step 4: content public API を追加する**

Create `web/src/lib/content/index.ts`:

```ts
import { markdownSource } from "./markdown-source";
export { articleKindLabels } from "./types";
export type { Article, ArticleAsset, ArticleBlock, ArticleKind } from "./types";

const contentSource = markdownSource;

export const formatArticleDate = (date: string): string => {
  return date.replaceAll("-", ".");
};

export const getAllArticles = contentSource.getAllArticles;
export const getArticleBySlug = contentSource.getArticleBySlug;
export const getArticleSlugs = contentSource.getArticleSlugs;
```

Expected:

- Route files can import from one content entrypoint.
- `contentSource` is the only place that chooses Markdown as current input.

- [ ] **Step 5: `notes.ts` を互換 wrapper にする**

Replace `web/src/lib/notes.ts` with:

```ts
export {
  articleKindLabels as noteTypeLabels,
  formatArticleDate as formatNoteDate,
  getAllArticles as getAllNotes,
  getArticleBySlug as getNoteBySlug,
  getArticleSlugs as getNoteSlugs,
} from "./content";
export type { Article as Note, ArticleKind as NoteType } from "./content";
```

Expected:

- Existing imports keep compiling during transition.
- Later tasks can migrate imports and then delete `notes.ts`.

- [ ] **Step 6: 検証して commit する**

Run:

```bash
git diff --check
mise run lint
mise run build
```

Expected:

- whitespace check exit 0。
- lint exit 0。
- build exit 0。

Commit:

```bash
git add web/src/lib/content web/src/lib/notes.ts
git commit -m "refactor(content): ContentSource 境界を追加"
```

## Task 4: `ArticleContent` renderer へ移行する

**Files:**

- Create: `web/src/components/site/ArticleContent.tsx`
- Modify: `web/src/components/site/NoteList.tsx`
- Modify: `web/src/app/page.tsx`
- Modify: `web/src/app/notes/page.tsx`
- Modify: `web/src/app/notes/[slug]/page.tsx`
- Remove: `web/src/components/site/MarkdownContent.tsx`
- Modify or remove: `web/src/lib/notes.ts`

- [ ] **Step 1: Article renderer を追加する**

Create `web/src/components/site/ArticleContent.tsx`:

```tsx
import type { ArticleBlock } from "../../lib/content";
import styles from "./article.module.css";

type Props = {
  blocks: ArticleBlock[];
};

export const ArticleContent = ({ blocks }: Props) => {
  return (
    <div className={styles.articleContent}>
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        if (block.kind === "heading") {
          const Tag = `h${block.level}` as "h1" | "h2" | "h3";
          return <Tag key={key}>{block.text}</Tag>;
        }

        if (block.kind === "list") {
          return (
            <ul key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.kind === "code") {
          return (
            <pre key={key}>
              <code>{block.code}</code>
            </pre>
          );
        }

        if (block.kind === "quote") {
          return <blockquote key={key}>{block.text}</blockquote>;
        }

        if (block.kind === "image") {
          return (
            <figure key={key}>
              <img alt={block.asset.alt} height={block.asset.height} src={block.asset.src} width={block.asset.width} />
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          );
        }

        if (block.kind === "callout") {
          return (
            <aside className={styles.callout} data-tone={block.tone} key={key}>
              {block.text}
            </aside>
          );
        }

        if (block.kind === "linkCard") {
          return (
            <a className={styles.linkCard} href={block.url} key={key} rel="noopener noreferrer" target="_blank">
              <strong>{block.title}</strong>
              {block.description && <span>{block.description}</span>}
            </a>
          );
        }

        if (block.kind === "gallery") {
          return (
            <div className={styles.gallery} key={key}>
              {block.images.map((image) => (
                <img alt={image.alt} height={image.height} key={image.id} src={image.src} width={image.width} />
              ))}
            </div>
          );
        }

        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
};
```

Expected:

- Renderer accepts only `ArticleBlock[]`.
- No `dangerouslySetInnerHTML` is introduced.

- [ ] **Step 2: Note list を Article 型へ切り替える**

Change `web/src/components/site/NoteList.tsx` to import:

```tsx
import Link from "next/link";

import {
  articleKindLabels,
  formatArticleDate,
  type Article,
} from "../../lib/content";
import styles from "./notes.module.css";

type Props = {
  notes: Article[];
};
```

Use:

```tsx
<time dateTime={note.publishedAt}>{formatArticleDate(note.publishedAt)}</time>
<span className={styles.noteType}>{articleKindLabels[note.kind]}</span>
```

Expected:

- Public component name `NoteList` can remain for UI vocabulary.
- Domain import no longer depends on `lib/notes`.

- [ ] **Step 3: route files を content API へ移行する**

Use these imports:

```tsx
// web/src/app/page.tsx
import { getAllArticles } from "../lib/content";

// web/src/app/notes/page.tsx
import { getAllArticles } from "../../lib/content";

// web/src/app/notes/[slug]/page.tsx
import { ArticleContent } from "../../../components/site/ArticleContent";
import {
  articleKindLabels,
  formatArticleDate,
  getArticleBySlug,
  getArticleSlugs,
} from "../../../lib/content";
```

Replace function calls:

```tsx
const notes = await getAllArticles();
const article = await getArticleBySlug(slug);
const slugs = await getArticleSlugs();
```

Expected:

- Route output remains `/notes` and `/notes/[slug]`.
- Naming inside detail route can become `article` to match domain model.

- [ ] **Step 4: detail page renderer を切り替える**

In `web/src/app/notes/[slug]/page.tsx`, replace:

```tsx
<MarkdownContent content={note.content} />
```

with:

```tsx
<ArticleContent blocks={article.blocks} />
```

Expected:

- Markdown string no longer crosses into React component props.
- Article renderer owns block rendering.

- [ ] **Step 5: 旧 Markdown renderer と notes wrapper を削除する**

Run:

```bash
rg -n "MarkdownContent|lib/notes|getAllNotes|getNoteBySlug|getNoteSlugs|noteTypeLabels|formatNoteDate" web/src
```

Expected:

- No references remain after route migration.

Then run:

```bash
git rm web/src/components/site/MarkdownContent.tsx web/src/lib/notes.ts
```

Expected:

- old Markdown renderer and compatibility wrapper are removed.

- [ ] **Step 6: 検証して commit する**

Run:

```bash
git diff --check
mise run lint
mise run build
```

Expected:

- lint exit 0。
- build exit 0。
- `/notes` static generation succeeds。

Commit:

```bash
git add web/src/lib web/src/components/site web/src/app
git commit -m "refactor(content): ArticleBlock renderer へ移行"
```

## Task 5: design token と自作 CMS 仮 schema を docs に固定する

**Files:**

- Modify: `DESIGN.md`
- Create: `docs/tech-stack.md`
- Modify: `docs/superpowers/specs/2026-05-08-technology-selection-design.md`

- [ ] **Step 1: `DESIGN.md` の技術表現を合わせる**

Add a short implementation note near the current design token section:

```markdown
## Implementation Notes

- Styling は `CSS Modules + CSS custom properties` を正本にする。
- `globals.css` の `:root` を runtime token とし、`DESIGN.md` は意図と値の参照元にする。
- `Tailwind CSS` は第一段階の採用対象にしない。
- 記事本文の block styling は `article.module.css` に閉じる。
```

Expected:

- Design intent and implementation direction no longer conflict.

- [ ] **Step 2: 技術選定メモを追加する**

Create `docs/tech-stack.md`:

```markdown
# 技術スタック

## 採用

- `Next.js`: App Router、metadata、redirect、将来自作 CMS preview の余地を維持する。
- `Vercel`: 現在の deploy と ISR の相性を優先する。
- `CSS Modules + CSS custom properties`: component scoped CSS と global token を分ける。
- `pnpm` / `mise`: 既存の install、dev、verify 導線を維持する。
- `web/content/notes/*.md`: 自作 CMS ができるまでの公開コンテンツ正本。

## 非採用

- `Tailwind CSS`: 現状の実装で utility class が主役ではないため撤去する。
- `MDX`: 自由実行ではなく `ArticleBlock` の定型 block を使う。
- 外部 CMS: CMS は将来自作する方向に置く。

## 再評価条件

- `Astro`: 静的記事中心が続き、CMS preview や編集 UI を同一 app に載せない場合に再評価する。
- `Cloudflare Pages` / `Cloudflare Workers`: Vercel 依存、費用、edge runtime への移行要求が出た場合に再評価する。
- 型付き styling: 管理画面込みの design system や複数 theme が必要になった場合に再評価する。

## 自作 CMS 仮 schema

`articles` は `id`, `slug`, `title`, `description`, `publishedAt`, `updatedAt`, `kind`, `heroImage`, `blocks` を持つ。

`assets` は `id`, `src`, `alt`, `width`, `height`, `blurData` を持つ。

`blocks` は `paragraph`, `heading`, `list`, `quote`, `code`, `image`, `callout`, `linkCard`, `gallery` に限定する。
```

Expected:

- 技術選定の結論が README ではなく docs に固定される。
- README は必要なら後続で参照リンクだけ追加する。

- [ ] **Step 3: spec に実装中の差分を反映する**

If implementation deviates from the original spec, update `docs/superpowers/specs/2026-05-08-technology-selection-design.md` with the actual decision. Example text if `postcss.config.js` is deleted:

```markdown
実装では Tailwind CSS と PostCSS plugin を撤去し、`web/postcss.config.js` も削除する。CSS Modules と global CSS は Next.js の標準 CSS support だけで扱う。
```

Expected:

- spec and implementation plan remain aligned.

- [ ] **Step 4: 検証して commit する**

Run:

```bash
git diff --check
mise run lint
mise run build
```

Expected:

- docs-only update plus any final code state still passes verify commands.

Commit:

```bash
git add DESIGN.md docs/tech-stack.md docs/superpowers/specs/2026-05-08-technology-selection-design.md
git commit -m "docs(tech): 技術スタック方針を記録"
```

## Task 6: 最終検証、review、PR 準備

**Files:**

- All files changed by Tasks 1-5

- [ ] **Step 1: scope を確認する**

Run:

```bash
git status --short --branch --untracked-files=all
git diff --stat origin/main...HEAD
```

Expected:

- Branch is `codex/technology-selection-design` or a task branch created from it.
- Diff contains only docs, content layer, article renderer, CSS module split, and dependency cleanup.

- [ ] **Step 2: Tailwind 参照が残っていないことを確認する**

Run:

```bash
rg -n "tailwind|@tailwindcss|@import \"tailwindcss\"|@theme|@apply" web docs README.md DESIGN.md
```

Expected:

- No runtime Tailwind setup remains.
- If `docs/tech-stack.md` mentions `Tailwind CSS`, it is in the non-adoption section only.

- [ ] **Step 3: content API 参照を確認する**

Run:

```bash
rg -n "getAllNotes|getNoteBySlug|getNoteSlugs|MarkdownContent|site\\.module\\.css|dangerouslySetInnerHTML" web/src
```

Expected:

- No output for old note API, old Markdown renderer, old CSS module, or `dangerouslySetInnerHTML`.

- [ ] **Step 4: hard guard を実行する**

Run:

```bash
mise run verify
```

Expected:

- `pnpm lint` passes.
- `pnpm build` passes.

- [ ] **Step 5: project-local review を実行する**

Use `docs/skills/review/SKILL.md` with scope:

```text
Scope: 技術選定実装。CSS Modules 統一、Tailwind 撤去、ContentSource、ArticleBlock renderer、docs 更新。
Review focus: server/client boundary, Markdown rendering safety, route regression, build/lint regression, accessibility.
```

Expected:

- Review verdict is `APPROVE`, or all accepted findings are fixed and re-reviewed.

- [ ] **Step 6: PR 作成へ進む**

Use `pr-writer` skill. Do not call `gh pr create` directly.

Expected:

- PR body includes summary, verification commands, review verdict, and related issue status.

## Self-Review

- Spec coverage: `CSS Modules` 統一は Task 1-2、`ContentSource` は Task 3、`ArticleBlock` は Task 3-4、自作 CMS 仮 schema と再評価条件は Task 5、最終検証は Task 6 で扱う。
- Placeholder scan: 未記入の作業、後回し前提の作業、詳細を読者へ委ねる作業は残していない。
- Type consistency: `ArticleKind`, `Article`, `ArticleBlock`, `ContentSource`, `articleKindLabels`, `formatArticleDate`, `getAllArticles`, `getArticleBySlug`, `getArticleSlugs` を全 task で統一する。
