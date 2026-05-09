# Test Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `Vitest` と `Playwright` を導入し、content 境界と主要 route の回帰を `mise run verify` で検出できるようにする。

**Architecture:** Unit test は `web/src/**/*.test.ts` に置き、`ContentSource` と `ArticleBlock` の契約を高速に検証する。E2E は `web/e2e/*.spec.ts` に置き、production build 後の Next.js server を Playwright から確認する。`mise run verify` は lint、unit test、build、E2E を含む hard guard に拡張する。

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Playwright, pnpm, mise.

---

## File Structure

**Create**

- `web/vitest.config.ts`: Vitest の test 対象、実行環境、CSS module の扱いを定義する。
- `web/src/lib/content/blocks.test.ts`: Markdown 本文から `ArticleBlock[]` への変換を検証する。
- `web/src/lib/content/markdown-source.test.ts`: fixture Markdown を一時 directory に書き、`ContentSource` 契約を検証する。
- `web/src/components/site/ArticleContent.test.tsx`: `ArticleContent` の代表 block 描画と linkCard protocol guard を検証する。
- `web/playwright.config.ts`: Playwright の test directory、production server、Chromium project を定義する。
- `web/e2e/content.spec.ts`: `/`, `/notes`, `/notes/[slug]`, `/blog`, `/blog/[articleId]` の主要挙動を検証する。

**Modify**

- `web/package.json`: `test`, `test:e2e` script と `vitest`, `@playwright/test` dev dependency を追加する。
- `web/pnpm-lock.yaml`: dependency 追加に合わせて更新する。
- `web/src/lib/content/markdown-source.ts`: 任意の notes directory から `ContentSource` を作る `createMarkdownSource` を export する。
- `mise.toml`: `test`, `test:e2e` task を追加し、`verify` の hard guard に組み込む。

---

### Task 1: Vitest 基盤と ArticleBlock parser regression

**Files:**

- Modify: `web/package.json`
- Modify: `web/pnpm-lock.yaml`
- Create: `web/vitest.config.ts`
- Create: `web/src/lib/content/blocks.test.ts`

- [ ] **Step 1: Vitest を dev dependency に追加する**

Run:

```bash
pnpm add -D vitest
```

Expected:

- `web/package.json` の `devDependencies` に `vitest` が追加される。
- `web/pnpm-lock.yaml` が更新される。

- [ ] **Step 2: `test` script を追加する**

Edit `web/package.json` の `scripts` を次の形にする。既存の `dev`, `build`, `start`, `lint`, `format` は維持する。

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "if [ \"$ANALYZE\" = \"true\" ]; then next build --webpack; else next build; fi",
    "start": "next start",
    "lint": "eslint '**/*.@(js|ts|tsx)'",
    "test": "vitest run",
    "format": "prettier --write . && pnpm lint --fix"
  }
}
```

Expected:

- `pnpm test` が Vitest を headless で実行する。

- [ ] **Step 3: Vitest config を作成する**

Create `web/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    watch: false,
  },
});
```

Expected:

- Unit test は `web/src/**/*.test.ts` と `web/src/**/*.test.tsx` だけを対象にする。
- E2E の `web/e2e/*.spec.ts` は Vitest 対象に入らない。

- [ ] **Step 4: `parseArticleBlocks` の regression test を書く**

Create `web/src/lib/content/blocks.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { parseArticleBlocks } from "./blocks";

describe("parseArticleBlocks", () => {
  it("parses core Markdown blocks into ArticleBlock objects", () => {
    const blocks = parseArticleBlocks(`# Title

Intro line
continued line

## Section

- First
- Second

> Quote line
> continued quote

\`\`\`ts
const value = "ok";
\`\`\`

![Alt text](/image.png "Caption text")`);

    expect(blocks).toEqual([
      { kind: "heading", level: 1, text: "Title" },
      { kind: "paragraph", text: "Intro line continued line" },
      { kind: "heading", level: 2, text: "Section" },
      { kind: "list", items: ["First", "Second"] },
      { kind: "quote", text: "Quote line continued quote" },
      { kind: "code", code: 'const value = "ok";', language: "ts" },
      {
        kind: "image",
        asset: {
          id: "/image.png",
          src: "/image.png",
          alt: "Alt text",
        },
        caption: "Caption text",
      },
    ]);
  });

  it("parses note and warning callouts", () => {
    expect(
      parseArticleBlocks(`:::callout
Note body
:::

:::callout warning
Warning body
:::`),
    ).toEqual([
      { kind: "callout", tone: "note", text: "Note body" },
      { kind: "callout", tone: "warning", text: "Warning body" },
    ]);
  });

  it("rejects unclosed callout blocks", () => {
    expect(() => parseArticleBlocks(":::callout\nMissing close")).toThrow(
      "Unclosed callout block",
    );
  });

  it("rejects unclosed code blocks", () => {
    expect(() => parseArticleBlocks("```ts\nconst value = 1;")).toThrow(
      "Unclosed code block",
    );
  });

  it("rejects unsupported custom block syntax", () => {
    expect(() => parseArticleBlocks("::link-card\nhttps://example.com")).toThrow(
      "Unsupported custom block syntax: ::link-card",
    );
  });
});
```

Expected:

- 既存 parser の代表的な成功条件と失敗条件が固定される。

- [ ] **Step 5: Parser test を実行する**

Run:

```bash
pnpm test -- src/lib/content/blocks.test.ts
```

Expected:

- `blocks.test.ts` が PASS する。

- [ ] **Step 6: Task 1 を commit する**

Use the `commit` skill. Target files:

```text
web/package.json
web/pnpm-lock.yaml
web/vitest.config.ts
web/src/lib/content/blocks.test.ts
```

Candidate message:

```text
test(content): ArticleBlock parser の回帰テストを追加
```

Expected:

- Vitest 基盤と parser regression test が 1 commit になる。

---

### Task 2: ContentSource を fixture で検証する

**Files:**

- Modify: `web/src/lib/content/markdown-source.ts`
- Create: `web/src/lib/content/markdown-source.test.ts`

- [ ] **Step 1: `createMarkdownSource` を前提にした failing test を書く**

Create `web/src/lib/content/markdown-source.test.ts`:

```ts
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createMarkdownSource } from "./markdown-source";

const createdDirectories: string[] = [];

const makeNotesDirectory = async (
  files: Record<string, string>,
): Promise<string> => {
  const directory = await mkdtemp(path.join(tmpdir(), "yona-notes-"));
  createdDirectories.push(directory);

  await Promise.all(
    Object.entries(files).map(([fileName, content]) =>
      writeFile(path.join(directory, fileName), content),
    ),
  );

  return directory;
};

afterEach(async () => {
  await Promise.all(
    createdDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  );
});

const publishedNew = `---
title: New Note
slug: new-note
date: 2026-05-02
type: note
description: New description
published: true
---
# New Note

New body`;

const publishedOld = `---
title: Old Article
slug: old-article
date: 2026-05-01
type: article
description: Old description
published: true
---
Old body`;

const draft = `---
title: Draft Log
slug: draft-log
date: 2026-05-03
type: log
description: Draft description
published: false
---
Draft body`;

describe("createMarkdownSource", () => {
  it("returns only published articles sorted by publishedAt descending", async () => {
    const directory = await makeNotesDirectory({
      "new.md": publishedNew,
      "old.md": publishedOld,
      "draft.md": draft,
    });
    const source = createMarkdownSource(directory);

    const articles = await source.getAllArticles();

    expect(articles.map((article) => article.slug)).toEqual([
      "new-note",
      "old-article",
    ]);
    expect(articles[0]).toMatchObject({
      id: "new-note",
      title: "New Note",
      description: "New description",
      publishedAt: "2026-05-02",
      kind: "note",
      isPublished: true,
      blocks: [{ kind: "paragraph", text: "New body" }],
    });
  });

  it("returns articles by slug and omits unpublished slugs", async () => {
    const directory = await makeNotesDirectory({
      "new.md": publishedNew,
      "draft.md": draft,
    });
    const source = createMarkdownSource(directory);

    await expect(source.getArticleSlugs()).resolves.toEqual(["new-note"]);
    await expect(source.getArticleBySlug("new-note")).resolves.toMatchObject({
      slug: "new-note",
    });
    await expect(source.getArticleBySlug("draft-log")).resolves.toBeNull();
    await expect(source.getArticleBySlug("missing")).resolves.toBeNull();
  });

  it("rejects Markdown without valid frontmatter", async () => {
    const directory = await makeNotesDirectory({
      "invalid.md": "No frontmatter",
    });
    const source = createMarkdownSource(directory);

    await expect(source.getAllArticles()).rejects.toThrow(
      "Missing frontmatter in invalid.md",
    );
  });

  it("rejects invalid frontmatter shape", async () => {
    const directory = await makeNotesDirectory({
      "invalid.md": `---
title: Invalid
slug: invalid
date: 2026-05-02
type: note
description: Missing published
---
Body`,
    });
    const source = createMarkdownSource(directory);

    await expect(source.getAllArticles()).rejects.toThrow(
      "Invalid frontmatter shape in invalid.md",
    );
  });

  it("rejects unsupported article kinds", async () => {
    const directory = await makeNotesDirectory({
      "invalid-kind.md": `---
title: Invalid Kind
slug: invalid-kind
date: 2026-05-02
type: diary
description: Invalid kind
published: true
---
Body`,
    });
    const source = createMarkdownSource(directory);

    await expect(source.getAllArticles()).rejects.toThrow(
      "Invalid article kind in invalid-kind.md: diary",
    );
  });

  it("rejects unsupported custom block syntax inside articles", async () => {
    const directory = await makeNotesDirectory({
      "custom.md": `---
title: Custom Block
slug: custom-block
date: 2026-05-02
type: note
description: Custom block
published: true
---
::unknown
value`,
    });
    const source = createMarkdownSource(directory);

    await expect(source.getAllArticles()).rejects.toThrow(
      "Unsupported custom block syntax: ::unknown",
    );
  });
});
```

- [ ] **Step 2: Test が export 不足で失敗することを確認する**

Run:

```bash
pnpm test -- src/lib/content/markdown-source.test.ts
```

Expected:

- FAIL。
- Error includes `No matching export` または `createMarkdownSource` が export されていない旨の message。

- [ ] **Step 3: `markdown-source.ts` に test seam を追加する**

Replace `web/src/lib/content/markdown-source.ts` with:

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

const defaultNotesDirectory = path.join(process.cwd(), "content", "notes");
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

export const createMarkdownSource = (
  notesDirectory = defaultNotesDirectory,
): ContentSource => {
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

  return {
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
};

export const markdownSource = createMarkdownSource();
```

Expected:

- Production export `markdownSource` の挙動は維持される。
- Test は temporary directory を渡して production content から分離できる。

- [ ] **Step 4: ContentSource test を実行する**

Run:

```bash
pnpm test -- src/lib/content/markdown-source.test.ts
```

Expected:

- `markdown-source.test.ts` が PASS する。

- [ ] **Step 5: Content unit tests をまとめて実行する**

Run:

```bash
pnpm test -- src/lib/content
```

Expected:

- `blocks.test.ts` と `markdown-source.test.ts` が PASS する。

- [ ] **Step 6: Task 2 を commit する**

Use the `commit` skill. Target files:

```text
web/src/lib/content/markdown-source.ts
web/src/lib/content/markdown-source.test.ts
```

Candidate message:

```text
test(content): ContentSource の契約テストを追加
```

Expected:

- `createMarkdownSource` seam と content source tests が 1 commit になる。

---

### Task 3: ArticleContent renderer 契約を固定する

**Files:**

- Create: `web/src/components/site/ArticleContent.test.tsx`

- [ ] **Step 1: Renderer regression test を書く**

Create `web/src/components/site/ArticleContent.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ArticleBlock } from "../../lib/content";
import { ArticleContent } from "./ArticleContent";

describe("ArticleContent", () => {
  it("renders representative article blocks", () => {
    const blocks: ArticleBlock[] = [
      { kind: "heading", level: 2, text: "Section" },
      { kind: "paragraph", text: "Paragraph body" },
      { kind: "list", items: ["First", "Second"] },
      { kind: "quote", text: "Quote body" },
      { kind: "code", code: "const value = 1;", language: "ts" },
      {
        kind: "image",
        asset: { id: "image", src: "/image.png", alt: "Image alt" },
        caption: "Image caption",
      },
      { kind: "callout", tone: "warning", text: "Warning body" },
      {
        kind: "linkCard",
        title: "Example",
        url: "https://example.com/path",
        description: "Example description",
      },
      {
        kind: "gallery",
        images: [{ id: "gallery", src: "/gallery.png", alt: "Gallery alt" }],
      },
    ];

    const markup = renderToStaticMarkup(<ArticleContent blocks={blocks} />);

    expect(markup).toContain("<h2>Section</h2>");
    expect(markup).toContain("<p>Paragraph body</p>");
    expect(markup).toContain("<li>First</li>");
    expect(markup).toContain("<blockquote>Quote body</blockquote>");
    expect(markup).toContain("<code>const value = 1;</code>");
    expect(markup).toContain('alt="Image alt"');
    expect(markup).toContain("<figcaption>Image caption</figcaption>");
    expect(markup).toContain("Warning body");
    expect(markup).toContain('href="https://example.com/path"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('alt="Gallery alt"');
  });

  it("rejects unsafe linkCard protocols during render", () => {
    const blocks: ArticleBlock[] = [
      {
        kind: "linkCard",
        title: "Unsafe",
        url: "javascript:alert(1)",
      },
    ];

    expect(() => renderToStaticMarkup(<ArticleContent blocks={blocks} />)).toThrow(
      "Unsupported linkCard URL protocol: javascript:",
    );
  });
});
```

Expected:

- Renderer が代表 block を React escaping 前提で描画することが固定される。
- `javascript:` linkCard が render 時に失敗することが固定される。

- [ ] **Step 2: Renderer test を実行する**

Run:

```bash
pnpm test -- src/components/site/ArticleContent.test.tsx
```

Expected:

- `ArticleContent.test.tsx` が PASS する。

- [ ] **Step 3: Unit tests 全体を実行する**

Run:

```bash
pnpm test
```

Expected:

- `blocks.test.ts`, `markdown-source.test.ts`, `ArticleContent.test.tsx` が PASS する。

- [ ] **Step 4: Task 3 を commit する**

Use the `commit` skill. Target file:

```text
web/src/components/site/ArticleContent.test.tsx
```

Candidate message:

```text
test(site): 記事 renderer の契約テストを追加
```

Expected:

- Renderer regression test が 1 commit になる。

---

### Task 4: Playwright E2E で公開 route を固定する

**Files:**

- Modify: `web/package.json`
- Modify: `web/pnpm-lock.yaml`
- Create: `web/playwright.config.ts`
- Create: `web/e2e/content.spec.ts`

- [ ] **Step 1: Playwright を dev dependency に追加する**

Run:

```bash
pnpm add -D @playwright/test
```

Expected:

- `web/package.json` の `devDependencies` に `@playwright/test` が追加される。
- `web/pnpm-lock.yaml` が更新される。

- [ ] **Step 2: Chromium browser を導入する**

Run:

```bash
pnpm exec playwright install chromium
```

Expected:

- Chromium browser が Playwright の実行環境に導入される。
- すでに導入済みの場合は、Playwright が再利用できる状態を返す。

- [ ] **Step 3: `test:e2e` script を追加する**

Edit `web/package.json` の `scripts` を次の形にする。Task 1 の `test` script は維持する。

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "if [ \"$ANALYZE\" = \"true\" ]; then next build --webpack; else next build; fi",
    "start": "next start",
    "lint": "eslint '**/*.@(js|ts|tsx)'",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "format": "prettier --write . && pnpm lint --fix"
  }
}
```

Expected:

- `pnpm test:e2e` が Playwright を実行する。

- [ ] **Step 4: Playwright config を作成する**

Create `web/playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const baseUrl = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: baseUrl,
    trace: "on-first-retry",
  },
  webServer: {
    command: `pnpm exec next start --hostname 127.0.0.1 --port ${port}`,
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
```

Expected:

- Playwright は production server を `127.0.0.1:3100` で起動する。
- `PLAYWRIGHT_PORT` を指定した時はその port を使う。

- [ ] **Step 5: E2E test を書く**

Create `web/e2e/content.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("home page exposes the main notes entry points", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Hello, I'm yona!" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Notes" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "yona.dev をリニューアルしました" }),
  ).toBeVisible();
});

test("notes page lists published notes and hides drafts", async ({ page }) => {
  await page.goto("/notes");

  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "yona.dev をリニューアルしました" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "ブロックスタイルテスト" }),
  ).toHaveCount(0);
});

test("note detail renders metadata and representative blocks", async ({ page }) => {
  await page.goto("/notes/site-renewal");

  await expect(
    page.getByRole("heading", { name: "yona.dev をリニューアルしました" }),
  ).toBeVisible();
  await expect(page.getByText("2026.04.26")).toBeVisible();
  await expect(page.getByText("ノート")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "サイトについて" }),
  ).toBeVisible();
  await expect(page.getByText("この note の下書きは")).toBeVisible();
});

test("legacy blog routes redirect to notes", async ({ page }) => {
  await page.goto("/blog");
  await expect(page).toHaveURL(/\/notes$/);
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();

  await page.goto("/blog/anything");
  await expect(page).toHaveURL(/\/notes$/);
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
});
```

Expected:

- E2E は公開記事表示、未公開記事の非表示、記事 detail、legacy redirect を確認する。
- screenshot や visual regression は含めない。

- [ ] **Step 6: Build 後に E2E を実行する**

Run:

```bash
pnpm build
pnpm test:e2e
```

Expected:

- `pnpm build` が PASS する。
- `pnpm test:e2e` が Chromium project で PASS する。

- [ ] **Step 7: Task 4 を commit する**

Use the `commit` skill. Target files:

```text
web/package.json
web/pnpm-lock.yaml
web/playwright.config.ts
web/e2e/content.spec.ts
```

Candidate message:

```text
test(e2e): 公開 route の Playwright テストを追加
```

Expected:

- Playwright config と E2E tests が 1 commit になる。

---

### Task 5: `mise run verify` に test を組み込む

**Files:**

- Modify: `mise.toml`

- [ ] **Step 1: root task に `test` と `test:e2e` を追加する**

Edit `mise.toml`:

```toml
[tasks.install]
description = "Install dependencies"
run = "pnpm install"
dir = "{{config_root}}/web"

[tasks.dev]
description = "Start development server"
run = "pnpm dev"
dir = "{{config_root}}/web"

[tasks.build]
description = "Production build"
run = "pnpm build"
dir = "{{config_root}}/web"

[tasks.start]
description = "Start production server"
run = "pnpm start"
dir = "{{config_root}}/web"

[tasks.lint]
description = "Run ESLint"
run = "pnpm lint"
dir = "{{config_root}}/web"

[tasks.test]
description = "Run unit tests"
run = "pnpm test"
dir = "{{config_root}}/web"

[tasks."test:e2e"]
description = "Run E2E tests"
depends = ["build"]
run = "pnpm test:e2e"
dir = "{{config_root}}/web"

[tasks.format]
description = "Format code with Prettier and fix lint"
run = "pnpm format"
dir = "{{config_root}}/web"

[tasks.verify]
description = "Run all verification checks"
depends = ["lint", "test", "test:e2e"]
```

Expected:

- `mise run test` は unit tests を実行する。
- `mise run test:e2e` は `build` 後に E2E を実行する。
- `mise run verify` は lint、unit test、build、E2E を含む。

- [ ] **Step 2: root task を個別に確認する**

Run:

```bash
mise run test
```

Expected:

- Vitest tests が PASS する。

Run:

```bash
mise run test:e2e
```

Expected:

- `build` が先に実行され、Playwright E2E が PASS する。

- [ ] **Step 3: hard guard を実行する**

Run:

```bash
mise run verify
```

Expected:

- `lint`, `test`, `build`, `test:e2e` が PASS する。
- Playwright browser が不足している場合は `pnpm exec playwright install chromium` を実行し、同じ `mise run verify` を再実行する。

- [ ] **Step 4: Task 5 を commit する**

Use the `commit` skill. Target file:

```text
mise.toml
```

Candidate message:

```text
test(verify): verify に unit と E2E を組み込む
```

Expected:

- root verify gate の変更が 1 commit になる。

---

## Final Verification

- [ ] **Step 1: 全差分を確認する**

Run:

```bash
git status --short
```

Expected:

- 未 commit の差分がない、または最終報告用の計画更新だけが残っている。

- [ ] **Step 2: hard guard を再実行する**

Run:

```bash
mise run verify
```

Expected:

- exit 0。
- `lint`, `test`, `build`, `test:e2e` が実行済みである。

- [ ] **Step 3: project-local review を実行する**

Use the project-local `review` skill for the final diff range.

Expected:

- review verdict が APPROVE。
- 未解決 finding が残っていない。
- review summary には reviewer ids、verdict、未解決 finding、未検証範囲、実行した verification command を含める。

- [ ] **Step 4: PR 作成または更新へ進む**

Use the project-local `pr-writer` skill when publishing this work.

Expected:

- PR body は test expansion の目的、実行した verification、review verdict を含む。
- `pr-writer` の Phase 6 以外で `gh pr create` / `gh pr edit` を直接実行しない。
