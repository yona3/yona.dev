# 技術選定やり直し実装計画

> **エージェント向け:** 必須サブスキル: `superpowers:subagent-driven-development` または `superpowers:executing-plans` を使い、タスクごとに実装する。進捗はチェックボックスで追跡する。

**目的:** 将来自作 CMS に差し替えられるよう、現在の Markdown 正本サイトを `ContentSource`、`ArticleBlock`、`CSS Modules + CSS custom properties` に整理する。

**構成:** 第一段階では `Next.js` と `Vercel` を維持し、入力元だけを `ContentSource` に閉じる。Markdown は `MarkdownSource` が `Article` / `ArticleBlock[]` に変換し、ルートと描画層は入力元を知らない。スタイリングは `Tailwind CSS` を撤去し、CSS custom properties と責務別 CSS Modules に統一する。

**技術スタック:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, CSS custom properties, pnpm, mise, Markdown frontmatter.

---

## 実行結果

- Task 1: `d5d6552 chore(web): Tailwind 依存を撤去`
- Task 2: `4fd0770 refactor(style): CSS Modules を責務別に分割`
- Task 3: `98bbc5a refactor(content): ContentSource 境界を追加`
- Task 4: `ee23ddc refactor(content): ArticleBlock renderer へ移行`
- Task 5: `1e41376 docs(tech): 技術スタック方針を記録`
- 追加整理: `d9ee017 chore(web): 古い CSS 設定 ignore を削除`
- 最終検証: `mise run verify` は exit 0。`pnpm lint` と `pnpm build` が通過。`mise` のホーム配下 cache / tracking 書き込み警告は検証本体に影響なし。
- project-local review 初回: `contract-reviewer` と `docs-ce-reviewer` が計画の commit 手順 / 証跡記録を指摘、`app-security-reviewer` が `linkCard.url` の protocol allowlist 不足を指摘、`ui-reviewer` は APPROVE。
- 対応方針: commit 手順は `commit` skill 経由へ修正し、計画へ実行済み commit と検証結果を記録する。`ArticleContent` は `linkCard.url` を `http:` / `https:` のみ許可し、不正 protocol は build 時に失敗させる。
- project-local review 最終: `contract-reviewer`、`app-security-reviewer`、`ui-reviewer`、`docs-ce-reviewer` はすべて APPROVE。browser での視覚差分確認は production server の screenshot で後追い確認した。
- PR プレビュー: `mise run start` で `/`, `/notes`, `/notes/site-renewal` が 200。`/tmp/pr-codex-technology-selection-design-preview/` に desktop / mobile screenshot を保存した。

## ファイル構成

**作成**

- `web/src/lib/content/types.ts`: `Article`, `ArticleBlock`, `ArticleAsset`, `ContentSource` の型と kind label を定義する。
- `web/src/lib/content/blocks.ts`: Markdown 本文を `ArticleBlock[]` に変換する。
- `web/src/lib/content/markdown-source.ts`: repo 内 Markdown を読み、`ContentSource` として公開する。
- `web/src/lib/content/index.ts`: route / component 向けの公開入口を集約する。
- `web/src/components/site/ArticleContent.tsx`: `ArticleBlock[]` を描画する。
- `web/src/components/site/article.module.css`: 記事本文と article block のスタイリング。
- `web/src/components/site/layout.module.css`: shell、header、footer、skip link 以外の共通レイアウト。
- `web/src/components/site/navigation.module.css`: brand、nav、social links。
- `web/src/components/site/home.module.css`: home hero、intro、speech、hedgehog。
- `web/src/components/site/notes.module.css`: notes list と note detail metadata。
- `web/src/components/site/motion.module.css`: animation と `prefers-reduced-motion`。
- `docs/tech-stack.md`: 採用技術、非採用技術、再評価条件、自作 CMS 仮 schema を記録する。

**変更**

- `web/src/styles/globals.css`: `@import "tailwindcss"` と `@theme` を削除し、global token を集約する。
- `web/postcss.config.js`: Tailwind PostCSS plugin を外す。PostCSS 設定が空になる場合はファイルを削除する。
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

**削除**

- `web/src/components/site/site.module.css`: 分割後に参照が 0 になったことを確認して削除する。
- `web/src/components/site/MarkdownContent.tsx`: `ArticleContent.tsx` 移行後に削除する。

## Task 1: Tailwind を撤去し CSS custom properties を正本にする

**対象ファイル:**

- 変更: `web/src/styles/globals.css`
- 変更または削除: `web/postcss.config.js`
- 変更: `web/package.json`
- 変更: `web/pnpm-lock.yaml`
- 確認: `web/src/**/*.tsx`, `web/src/**/*.css`

- [x] **Step 1: Tailwind utility が使われていないことを確認する**

実行:

```bash
rg -n "className=\"[^\"]*[a-z]+-[a-z0-9\\[\\]:/.-]" web/src
rg -n "@apply|@layer|@tailwind|@import \"tailwindcss\"|@theme" web
```

期待結果:

- 1 つめのコマンドは、`styles.*` ではない utility class が存在しないことを確認する目的で読む。
- 2 つめのコマンドは、`web/src/styles/globals.css` の `@import "tailwindcss"` と `@theme`、および `web/postcss.config.js` の Tailwind plugin だけを示す。

- [x] **Step 2: `globals.css` から Tailwind entrypoint を削除する**

`web/src/styles/globals.css` の先頭を次に置き換える:

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

期待結果:

- `@import "tailwindcss";` が消える。
- `@theme` が消える。
- 既存の CSS 変数は保ち、spacing / radius token が追加される。

- [x] **Step 3: PostCSS の Tailwind plugin を外す**

必要な PostCSS plugin が残らない場合は `web/postcss.config.js` を削除する。

実行:

```bash
git rm web/postcss.config.js
```

期待結果:

- `web/postcss.config.js` が削除対象になる。
- `web/eslint.config.mjs` の ignore に `postcss.config.js` が残っても害はないため、この task では触らない。

- [x] **Step 4: Tailwind 関連依存を削除する**

実行:

```bash
cd web
pnpm remove tailwindcss @tailwindcss/postcss postcss autoprefixer
```

期待結果:

- `web/package.json` から `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `autoprefixer` が消える。
- `web/pnpm-lock.yaml` が更新される。

- [x] **Step 5: 検証する**

リポジトリ root で実行:

```bash
mise run lint
mise run build
```

期待結果:

- `lint` が exit 0。
- `build` が exit 0。
- CSS import error が出ない。

- [x] **Step 6: commit する**

`commit` skill を使い、対象差分だけを戻しやすい論理単位で記録する。

候補 message:

```text
chore(style): Tailwind 依存を撤去
```

期待結果:

- 依存削除と global token の commit が 1 つできる。
- 実行結果: `d5d6552 chore(web): Tailwind 依存を撤去`

## Task 2: `site.module.css` を責務別 CSS Modules に分割する

**対象ファイル:**

- 作成: `web/src/components/site/layout.module.css`
- 作成: `web/src/components/site/navigation.module.css`
- 作成: `web/src/components/site/home.module.css`
- 作成: `web/src/components/site/notes.module.css`
- 作成: `web/src/components/site/article.module.css`
- 作成: `web/src/components/site/motion.module.css`
- 変更: `web/src/components/site/SiteShell.tsx`
- 変更: `web/src/components/site/HomeIntro.tsx`
- 変更: `web/src/components/site/HelloBubble.tsx`
- 変更: `web/src/components/site/HedgehogRunner.tsx`
- 変更: `web/src/components/site/NoteList.tsx`
- 変更: `web/src/components/site/MarkdownContent.tsx`
- 変更: `web/src/app/page.tsx`
- 変更: `web/src/app/about/page.tsx`
- 変更: `web/src/app/notes/page.tsx`
- 変更: `web/src/app/notes/[slug]/page.tsx`
- import が消えた後に削除: `web/src/components/site/site.module.css`

- [x] **Step 1: CSS class の移動先を固定する**

`site.module.css` の selector を次の対応で移す:

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

期待結果:

- animation 名の参照を除き、module 間で selector を重複させない。
- このタスクでは見た目の値をそのまま移す。token cleanup は Task 3 で扱う。

- [x] **Step 2: `SiteShell.tsx` import を分ける**

import と class 参照を次のように分ける:

```tsx
import layoutStyles from "./layout.module.css";
import navigationStyles from "./navigation.module.css";
```

使用例:

```tsx
<div className={layoutStyles.page}>
  <div className={layoutStyles.shell}>
    <header className={layoutStyles.header}>
      <Link className={navigationStyles.brand} href="/">
        yona.dev
      </Link>
      <nav className={navigationStyles.nav} aria-label="主要ナビゲーション">
```

期待結果:

- `SiteShell.tsx` は `site.module.css` を import しない。
- Coffee icon は `layoutStyles.coffeeEmoji` を使う。

- [x] **Step 3: Home 関連 component の import を分ける**

次の import を使う:

```tsx
// web/src/components/site/HomeIntro.tsx
import homeStyles from "./home.module.css";

// web/src/components/site/HelloBubble.tsx
import homeStyles from "./home.module.css";

// web/src/components/site/HedgehogRunner.tsx
import homeStyles from "./home.module.css";
```

期待結果:

- `HomeIntro`, `HelloBubble`, `HedgehogRunner` は `site.module.css` を import しない。
- class 参照は `homeStyles` を使う。

- [x] **Step 4: page route の import を分ける**

次の import を使う:

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

期待結果:

- route file は描画に使う CSS module だけを import する。
- `socialLinks` は `navigationStyles.socialLinks` を使う。
- hero / lead / section classes は `homeStyles` を使う。
- note detail article は `notesStyles.noteArticle` を使い、article content wrapper は `articleStyles` を使う。

- [x] **Step 5: `site.module.css` 参照が消えたことを確認して削除する**

実行:

```bash
rg -n "site\\.module\\.css|styles\\." web/src/components/site web/src/app
```

期待結果:

- `site.module.css` import が存在しない。
- 残る `styles.` 参照は、名前を変えた local import がある場合だけに限る。`layoutStyles`, `homeStyles`, `notesStyles`, `articleStyles`, `navigationStyles` を優先する。

その後に実行:

```bash
git rm web/src/components/site/site.module.css
```

期待結果:

- 旧 module が削除される。

- [x] **Step 6: 検証する**

実行:

```bash
git diff --check
mise run lint
mise run build
```

期待結果:

- whitespace check は exit 0。
- lint は exit 0。
- build は exit 0。
- CSS module missing class error が出ない。

- [x] **Step 7: commit する**

`commit` skill を使い、対象差分だけを戻しやすい論理単位で記録する。

候補 message:

```text
refactor(style): CSS Modules を責務別に分割
```

期待結果:

- 見た目を変えない CSS 分割 commit が 1 つできる。
- 実行結果: `4fd0770 refactor(style): CSS Modules を責務別に分割`

## Task 3: `ContentSource` と `Article` 型を導入する

**対象ファイル:**

- 作成: `web/src/lib/content/types.ts`
- 作成: `web/src/lib/content/blocks.ts`
- 作成: `web/src/lib/content/markdown-source.ts`
- 作成: `web/src/lib/content/index.ts`
- 変更: `web/src/lib/notes.ts`

- [x] **Step 1: content 型を追加する**

`web/src/lib/content/types.ts` を作成する:

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

期待結果:

- 真偽値プロパティはローカル命名規約に合わせて `isPublished` にする。
- `ArticleKind` は現行の `article | note | log` 値を維持する。

- [x] **Step 2: Markdown block parser を追加する**

`web/src/lib/content/blocks.ts` を作成する:

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

期待結果:

- 既存 Markdown 機能が動き続ける。
- `:::callout` を最初の custom block として扱える。
- `::` で始まる未知の custom syntax は即時に失敗する。

- [x] **Step 3: Markdown source を追加する**

`web/src/lib/content/markdown-source.ts` を作成する:

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

期待結果:

- 既存 Markdown file が読み込める。
- Content source が filesystem の詳細を route file から隠す。

- [x] **Step 4: content public API を追加する**

`web/src/lib/content/index.ts` を作成する:

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

期待結果:

- route file が 1 つの content 入口から import できる。
- `contentSource` だけが、現在の入力元として Markdown を選ぶ。

- [x] **Step 5: `notes.ts` を互換 wrapper にする**

`web/src/lib/notes.ts` を次に置き換える:

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

期待結果:

- 移行中も既存 import が compile できる。
- 後続 task で import を移行し、その後 `notes.ts` を削除できる。

- [x] **Step 6: 検証して commit する**

実行:

```bash
git diff --check
mise run lint
mise run build
```

期待結果:

- whitespace check は exit 0。
- lint は exit 0。
- build は exit 0。

`commit` skill を使い、対象差分だけを戻しやすい論理単位で記録する。

候補 message:

```text
refactor(content): ContentSource 境界を追加
```

実行結果: `98bbc5a refactor(content): ContentSource 境界を追加`

## Task 4: `ArticleContent` renderer へ移行する

**対象ファイル:**

- 作成: `web/src/components/site/ArticleContent.tsx`
- 変更: `web/src/components/site/NoteList.tsx`
- 変更: `web/src/app/page.tsx`
- 変更: `web/src/app/notes/page.tsx`
- 変更: `web/src/app/notes/[slug]/page.tsx`
- 削除: `web/src/components/site/MarkdownContent.tsx`
- 変更または削除: `web/src/lib/notes.ts`

- [x] **Step 1: Article renderer を追加する**

`web/src/components/site/ArticleContent.tsx` を作成する:

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

期待結果:

- renderer は `ArticleBlock[]` だけを受け取る。
- `dangerouslySetInnerHTML` を導入しない。

- [x] **Step 2: Note list を Article 型へ切り替える**

`web/src/components/site/NoteList.tsx` の import を次に変更する:

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

使用例:

```tsx
<time dateTime={note.publishedAt}>{formatArticleDate(note.publishedAt)}</time>
<span className={styles.noteType}>{articleKindLabels[note.kind]}</span>
```

期待結果:

- UI 上の語彙として component 名 `NoteList` は維持してよい。
- domain import は `lib/notes` に依存しない。

- [x] **Step 3: route files を content API へ移行する**

次の import を使う:

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

関数呼び出しを置き換える:

```tsx
const notes = await getAllArticles();
const article = await getArticleBySlug(slug);
const slugs = await getArticleSlugs();
```

期待結果:

- route 出力は `/notes` と `/notes/[slug]` のまま。
- detail route 内の変数名は domain model に合わせて `article` にしてよい。

- [x] **Step 4: detail page renderer を切り替える**

`web/src/app/notes/[slug]/page.tsx` で次を置き換える:

```tsx
<MarkdownContent content={note.content} />
```

置き換え後:

```tsx
<ArticleContent blocks={article.blocks} />
```

期待結果:

- Markdown 文字列を React component props に渡さない。
- Article renderer が block rendering を担当する。

- [x] **Step 5: 旧 Markdown renderer と notes wrapper を削除する**

実行:

```bash
rg -n "MarkdownContent|lib/notes|getAllNotes|getNoteBySlug|getNoteSlugs|noteTypeLabels|formatNoteDate" web/src
```

期待結果:

- route 移行後に参照が残らない。

その後に実行:

```bash
git rm web/src/components/site/MarkdownContent.tsx web/src/lib/notes.ts
```

期待結果:

- 旧 Markdown renderer と互換 wrapper が削除される。

- [x] **Step 6: 検証して commit する**

実行:

```bash
git diff --check
mise run lint
mise run build
```

期待結果:

- lint は exit 0。
- build は exit 0。
- `/notes` の静的生成が成功する。

`commit` skill を使い、対象差分だけを戻しやすい論理単位で記録する。

候補 message:

```text
refactor(content): ArticleBlock renderer へ移行
```

実行結果: `ee23ddc refactor(content): ArticleBlock renderer へ移行`

## Task 5: design token と自作 CMS 仮 schema を docs に固定する

**対象ファイル:**

- 変更: `DESIGN.md`
- 作成: `docs/tech-stack.md`
- 変更: `docs/superpowers/specs/2026-05-08-technology-selection-design.md`

- [x] **Step 1: `DESIGN.md` の技術表現を合わせる**

現在の design token section 付近に短い実装 note を追加する:

```markdown
## Implementation Notes

- スタイリングは `CSS Modules + CSS custom properties` を正本にする。
- `globals.css` の `:root` を runtime token とし、`DESIGN.md` は意図と値の参照元にする。
- `Tailwind CSS` は第一段階の採用対象にしない。
- 記事本文の block styling は `article.module.css` に閉じる。
```

期待結果:

- design 意図と実装方針が矛盾しない。

- [x] **Step 2: 技術選定メモを追加する**

`docs/tech-stack.md` を作成する:

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

期待結果:

- 技術選定の結論が README ではなく docs に固定される。
- README は必要なら後続で参照リンクだけ追加する。

- [x] **Step 3: spec に実装中の差分を反映する**

実装が当初 spec からずれた場合は、実際の判断を `docs/superpowers/specs/2026-05-08-technology-selection-design.md` に反映する。`postcss.config.js` を削除した場合の例:

```markdown
実装では Tailwind CSS と PostCSS plugin を撤去し、`web/postcss.config.js` も削除する。CSS Modules と global CSS は Next.js の標準 CSS support だけで扱う。
```

期待結果:

- spec と implementation plan が揃う。

- [x] **Step 4: 検証して commit する**

実行:

```bash
git diff --check
mise run lint
mise run build
```

期待結果:

- docs 更新後も最終 code state が検証 command を通る。

`commit` skill を使い、対象差分だけを戻しやすい論理単位で記録する。

候補 message:

```text
docs(tech): 技術スタック方針を記録
```

実行結果: `1e41376 docs(tech): 技術スタック方針を記録`

## Task 6: 最終検証、review、PR 準備

**対象ファイル:**

- Task 1-5 で変更した全ファイル

- [x] **Step 1: scope を確認する**

実行:

```bash
git status --short --branch --untracked-files=all
git diff --stat origin/main...HEAD
```

期待結果:

- branch は `codex/technology-selection-design` またはそこから作った task branch。
- diff は docs、content layer、article renderer、CSS module 分割、依存 cleanup に限られる。

- [x] **Step 2: Tailwind 参照が残っていないことを確認する**

実行:

```bash
rg -n "tailwind|@tailwindcss|@import \"tailwindcss\"|@theme|@apply" web docs README.md DESIGN.md
```

期待結果:

- runtime Tailwind 設定が残らない。
- `docs/tech-stack.md` の `Tailwind CSS` 記述は非採用 section だけに限る。

- [x] **Step 3: content API 参照を確認する**

実行:

```bash
rg -n "getAllNotes|getNoteBySlug|getNoteSlugs|MarkdownContent|site\\.module\\.css|dangerouslySetInnerHTML" web/src
```

期待結果:

- 旧 note API、旧 Markdown renderer、旧 CSS module、`dangerouslySetInnerHTML` は出力されない。

- [x] **Step 4: hard guard を実行する**

実行:

```bash
mise run verify
```

期待結果:

- `pnpm lint` が通る。
- `pnpm build` が通る。

- [x] **Step 5: project-local review を実行する**

`docs/skills/review/SKILL.md` を使い、次の scope で実行する:

```text
範囲: 技術選定実装。CSS Modules 統一、Tailwind 撤去、ContentSource、ArticleBlock renderer、docs 更新。
レビュー観点: server/client boundary, Markdown rendering safety, route regression, build/lint regression, accessibility.
```

期待結果:

- Review verdict が `APPROVE`、または採用した finding をすべて修正して re-review が通る。
- 実行結果: `contract-reviewer`、`app-security-reviewer`、`ui-reviewer`、`docs-ce-reviewer` はすべて APPROVE。

- [ ] **Step 6: PR 作成へ進む**

`pr-writer` skill を使う。`gh pr create` を直接呼ばない。

期待結果:

- PR 本文に要約、検証 command、review verdict、関連 issue 状態を含める。

## 自己レビュー

- spec 対応範囲: `CSS Modules` 統一は Task 1-2、`ContentSource` は Task 3、`ArticleBlock` は Task 3-4、自作 CMS 仮 schema と再評価条件は Task 5、最終検証は Task 6 で扱う。
- 未記入確認: 未記入の作業、後回し前提の作業、詳細を読者へ委ねる作業は残していない。
- 型の一貫性: `ArticleKind`, `Article`, `ArticleBlock`, `ContentSource`, `articleKindLabels`, `formatArticleDate`, `getAllArticles`, `getArticleBySlug`, `getArticleSlugs` を全 task で統一する。
