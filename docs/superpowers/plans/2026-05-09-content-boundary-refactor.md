# Content Boundary Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `ContentSource` の公開契約を変えずに、Markdown source の frontmatter parsing、記事生成、file system adapter の責務を分離する。

**Architecture:** `markdown-source.ts` は file system access と `ContentSource` adapter に絞る。frontmatter parsing は `frontmatter.ts`、Markdown から `Article` への組み立ては `markdown-article.ts` に分ける。既存 route と renderer は `getAllArticles`, `getArticleBySlug`, `getArticleSlugs`, `Article` / `ArticleBlock[]` をそのまま使う。

**Tech Stack:** Next.js 16 App Router, React cache, TypeScript, Vitest, pnpm, mise.

---

## File Structure

**Create**

- `web/src/lib/content/frontmatter.ts`: Markdown frontmatter の抽出、値 parsing、shape validation、本文先頭 title 除去を担当する。
- `web/src/lib/content/frontmatter.test.ts`: frontmatter parser の成功条件と失敗条件を fixture なしで検証する。
- `web/src/lib/content/markdown-article.ts`: Markdown source と file name から `Article` を組み立て、公開記事 filter と日付降順 sort を担当する。
- `web/src/lib/content/markdown-article.test.ts`: `Article` 組み立て、draft 除外、sort を検証する。

**Modify**

- `web/src/lib/content/markdown-source.ts`: file system access、React cache、`ContentSource` adapter だけに縮小する。
- `web/src/lib/content/markdown-source.test.ts`: source adapter の責務だけを検証する形へ更新する。

**Keep Unchanged**

- `web/src/lib/content/types.ts`: `Article`, `ArticleBlock`, `ContentSource` の公開型を変えない。
- `web/src/lib/content/blocks.ts`: `ArticleBlock[]` parser の振る舞いを変えない。
- `web/src/lib/content/index.ts`: route 側の import surface を変えない。
- `web/content/notes/*.md`: public content と frontmatter schema を変えない。
- `web/src/app/*`: route 挙動を変えない。
- `web/src/components/site/*`: renderer と表示を変えない。

---

### Task 1: frontmatter parser を分離する

**Files:**

- Create: `web/src/lib/content/frontmatter.test.ts`
- Create: `web/src/lib/content/frontmatter.ts`
- Modify: `web/src/lib/content/markdown-source.ts`

- [ ] **Step 1: failing test を追加する**

Create `web/src/lib/content/frontmatter.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { parseArticleFrontmatter } from "./frontmatter";

describe("parseArticleFrontmatter", () => {
  it("parses valid frontmatter and removes a duplicated title heading", () => {
    const parsed = parseArticleFrontmatter(
      `---
title: New Note
slug: new-note
date: 2026-05-02
type: note
description: Description with: colon
published: true
updatedAt: 2026-05-03
---
# New Note

New body`,
      "new.md",
    );

    expect(parsed).toEqual({
      data: {
        title: "New Note",
        slug: "new-note",
        date: "2026-05-02",
        type: "note",
        description: "Description with: colon",
        published: true,
        updatedAt: "2026-05-03",
      },
      content: "New body",
    });
  });

  it("keeps the first heading when it does not duplicate the title", () => {
    const parsed = parseArticleFrontmatter(
      `---
title: New Note
slug: new-note
date: 2026-05-02
type: note
description: New description
published: true
---
# Different Heading

New body`,
      "new.md",
    );

    expect(parsed.content).toBe("# Different Heading\n\nNew body");
  });

  it("rejects Markdown without frontmatter", () => {
    expect(() => parseArticleFrontmatter("No frontmatter", "invalid.md")).toThrow(
      "Missing frontmatter in invalid.md",
    );
  });

  it("rejects malformed frontmatter lines", () => {
    expect(() =>
      parseArticleFrontmatter(
        `---
title New Note
slug: new-note
date: 2026-05-02
type: note
description: New description
published: true
---
Body`,
        "invalid.md",
      ),
    ).toThrow("Invalid frontmatter line in invalid.md: title New Note");
  });

  it("rejects invalid frontmatter shape", () => {
    expect(() =>
      parseArticleFrontmatter(
        `---
title: Invalid
slug: invalid
date: 2026-05-02
type: note
description: Missing published
---
Body`,
        "invalid.md",
      ),
    ).toThrow("Invalid frontmatter shape in invalid.md");
  });

  it("rejects unsupported article kinds", () => {
    expect(() =>
      parseArticleFrontmatter(
        `---
title: Invalid Kind
slug: invalid-kind
date: 2026-05-02
type: diary
description: Invalid kind
published: true
---
Body`,
        "invalid-kind.md",
      ),
    ).toThrow("Invalid article kind in invalid-kind.md: diary");
  });
});
```

- [ ] **Step 2: test が未実装で失敗することを確認する**

Run:

```bash
cd web
pnpm test -- src/lib/content/frontmatter.test.ts
```

Expected:

```text
FAIL src/lib/content/frontmatter.test.ts
Cannot find module './frontmatter'
```

- [ ] **Step 3: `frontmatter.ts` を実装する**

Create `web/src/lib/content/frontmatter.ts`:

```ts
import type { ArticleKind } from "./types";

export type ArticleFrontmatter = {
  title: string;
  slug: string;
  date: string;
  type: ArticleKind;
  description: string;
  published: boolean;
  updatedAt?: string;
};

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

export const parseArticleFrontmatter = (
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
```

- [ ] **Step 4: `markdown-source.ts` から frontmatter helper を削除する**

Replace `web/src/lib/content/markdown-source.ts` with this temporary version:

```ts
import { promises as fs } from "node:fs";
import path from "node:path";

import { cache } from "react";

import { parseArticleBlocks } from "./blocks";
import { parseArticleFrontmatter } from "./frontmatter";
import type { Article, ContentSource } from "./types";

const defaultNotesDirectory = path.join(process.cwd(), "content", "notes");

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
          const { data, content } = parseArticleFrontmatter(source, fileName);

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

- [ ] **Step 5: frontmatter と既存 source test を実行する**

Run:

```bash
cd web
pnpm test -- src/lib/content/frontmatter.test.ts src/lib/content/markdown-source.test.ts
```

Expected:

```text
PASS src/lib/content/frontmatter.test.ts
PASS src/lib/content/markdown-source.test.ts
```

- [ ] **Step 6: Task 1 を commit する**

Use the `commit` skill. Target files:

```text
web/src/lib/content/frontmatter.ts
web/src/lib/content/frontmatter.test.ts
web/src/lib/content/markdown-source.ts
```

Candidate message:

```text
refactor(content): frontmatter parser を分離
```

---

### Task 2: Markdown article assembly を分離する

**Files:**

- Create: `web/src/lib/content/markdown-article.test.ts`
- Create: `web/src/lib/content/markdown-article.ts`
- Modify: `web/src/lib/content/markdown-source.ts`

- [ ] **Step 1: failing test を追加する**

Create `web/src/lib/content/markdown-article.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  createMarkdownArticle,
  getPublishedArticles,
  sortArticlesByPublishedAtDesc,
} from "./markdown-article";

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

describe("createMarkdownArticle", () => {
  it("creates an Article from Markdown source", () => {
    expect(createMarkdownArticle(publishedNew, "new.md")).toEqual({
      id: "new-note",
      slug: "new-note",
      title: "New Note",
      description: "New description",
      publishedAt: "2026-05-02",
      updatedAt: undefined,
      kind: "note",
      isPublished: true,
      blocks: [{ kind: "paragraph", text: "New body" }],
    });
  });

  it("propagates unsupported custom block errors", () => {
    expect(() =>
      createMarkdownArticle(
        `---
title: Custom Block
slug: custom-block
date: 2026-05-02
type: note
description: Custom block
published: true
---
::unknown
value`,
        "custom.md",
      ),
    ).toThrow("Unsupported custom block syntax: ::unknown");
  });
});

describe("article collection helpers", () => {
  it("filters drafts and sorts by publishedAt descending", () => {
    const articles = [
      createMarkdownArticle(publishedOld, "old.md"),
      createMarkdownArticle(draft, "draft.md"),
      createMarkdownArticle(publishedNew, "new.md"),
    ];

    expect(
      sortArticlesByPublishedAtDesc(getPublishedArticles(articles)).map(
        (article) => article.slug,
      ),
    ).toEqual(["new-note", "old-article"]);
  });
});
```

- [ ] **Step 2: test が未実装で失敗することを確認する**

Run:

```bash
cd web
pnpm test -- src/lib/content/markdown-article.test.ts
```

Expected:

```text
FAIL src/lib/content/markdown-article.test.ts
Cannot find module './markdown-article'
```

- [ ] **Step 3: `markdown-article.ts` を実装する**

Create `web/src/lib/content/markdown-article.ts`:

```ts
import { parseArticleBlocks } from "./blocks";
import { parseArticleFrontmatter } from "./frontmatter";
import type { Article } from "./types";

export const createMarkdownArticle = (
  source: string,
  fileName: string,
): Article => {
  const { data, content } = parseArticleFrontmatter(source, fileName);

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
  };
};

export const getPublishedArticles = (articles: Article[]): Article[] => {
  return articles.filter((article) => article.isPublished);
};

export const sortArticlesByPublishedAtDesc = (articles: Article[]): Article[] => {
  return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
};
```

- [ ] **Step 4: `markdown-source.ts` を adapter に縮小する**

Replace `web/src/lib/content/markdown-source.ts` with:

```ts
import { promises as fs } from "node:fs";
import path from "node:path";

import { cache } from "react";

import {
  createMarkdownArticle,
  getPublishedArticles,
  sortArticlesByPublishedAtDesc,
} from "./markdown-article";
import type { Article, ContentSource } from "./types";

const defaultNotesDirectory = path.join(process.cwd(), "content", "notes");

const readMarkdownArticles = async (notesDirectory: string): Promise<Article[]> => {
  const fileNames = await fs.readdir(notesDirectory);

  return Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const source = await fs.readFile(path.join(notesDirectory, fileName), "utf8");
        return createMarkdownArticle(source, fileName);
      }),
  );
};

export const createMarkdownSource = (
  notesDirectory = defaultNotesDirectory,
): ContentSource => {
  const getAllMarkdownArticles = cache(async (): Promise<Article[]> => {
    const articles = await readMarkdownArticles(notesDirectory);
    return sortArticlesByPublishedAtDesc(getPublishedArticles(articles));
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

- [ ] **Step 5: article assembly と source adapter test を実行する**

Run:

```bash
cd web
pnpm test -- src/lib/content/markdown-article.test.ts src/lib/content/markdown-source.test.ts
```

Expected:

```text
PASS src/lib/content/markdown-article.test.ts
PASS src/lib/content/markdown-source.test.ts
```

- [ ] **Step 6: Task 2 を commit する**

Use the `commit` skill. Target files:

```text
web/src/lib/content/markdown-article.ts
web/src/lib/content/markdown-article.test.ts
web/src/lib/content/markdown-source.ts
```

Candidate message:

```text
refactor(content): Markdown article 生成を分離
```

---

### Task 3: source adapter test を責務に合わせて更新する

**Files:**

- Modify: `web/src/lib/content/markdown-source.test.ts`

- [ ] **Step 1: adapter 専用の test を追加する**

Modify `web/src/lib/content/markdown-source.test.ts` by adding this test inside `describe("createMarkdownSource", () => { ... })`:

```ts
  it("ignores files that are not Markdown documents", async () => {
    const directory = await makeNotesDirectory([
      ["new.md", publishedNew],
      ["draft.md", draft],
      ["notes.txt", "not a markdown article"],
    ]);
    const source = createMarkdownSource(directory);

    await expect(source.getArticleSlugs()).resolves.toEqual(["new-note"]);
  });
```

- [ ] **Step 2: source adapter test を実行する**

Run:

```bash
cd web
pnpm test -- src/lib/content/markdown-source.test.ts
```

Expected:

```text
PASS src/lib/content/markdown-source.test.ts
```

- [ ] **Step 3: content unit test 全体を実行する**

Run:

```bash
cd web
pnpm test -- src/lib/content
```

Expected:

```text
PASS src/lib/content/blocks.test.ts
PASS src/lib/content/frontmatter.test.ts
PASS src/lib/content/markdown-article.test.ts
PASS src/lib/content/markdown-source.test.ts
```

- [ ] **Step 4: Task 3 を commit する**

Use the `commit` skill. Target file:

```text
web/src/lib/content/markdown-source.test.ts
```

Candidate message:

```text
test(content): Markdown source adapter の対象を固定
```

---

### Task 4: full verification と review gate

**Files:**

- No source edits expected.
- Review evidence should be recorded in the final report or the active Superpowers task artifact.

- [ ] **Step 1: lint を実行する**

Run:

```bash
mise run lint
```

Expected:

```text
Tasks: 1 successful
```

- [ ] **Step 2: unit test を実行する**

Run:

```bash
mise run test
```

Expected:

```text
Tasks: 1 successful
```

- [ ] **Step 3: hard guard を実行する**

Run:

```bash
mise run verify
```

Expected:

```text
Tasks: 1 successful
```

- [ ] **Step 4: project-local review を実行する**

Use the project-local `review` skill. Scope:

```text
git diff HEAD~3..HEAD -- web/src/lib/content
```

Reviewer focus:

```text
content contract, security-sensitive Markdown parsing, route regression risk
```

Expected:

```text
2+ independent reviewers return APPROVE or all accepted findings are fixed.
```

- [ ] **Step 5: final status を確認する**

Run:

```bash
git status --short
git log --oneline -n 5
```

Expected:

```text
git status --short prints no output.
The latest commits are the Task 1, Task 2, and Task 3 commits.
```

## Execution Notes

- This plan intentionally does not modify `Article`, `ArticleBlock`, or `ContentSource` public types.
- This plan intentionally does not modify route files, CSS Modules, content Markdown, metadata, or redirects.
- If `mise run verify` fails because Playwright browser binaries are unavailable, report the failing command and the unverified range before deciding whether dependency installation is in scope.
- If any review finding requests public behavior changes, split that into a new spec / plan rather than folding it into this refactor.
