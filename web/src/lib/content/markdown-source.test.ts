import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createMarkdownSource } from "./markdown-source";

const createdDirectories: string[] = [];

const makeNotesDirectory = async (
  files: ReadonlyArray<readonly [fileName: string, content: string]>,
): Promise<string> => {
  const directory = await mkdtemp(path.join(tmpdir(), "yona-notes-"));
  createdDirectories.push(directory);

  await Promise.all(
    files.map(([fileName, content]) =>
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
    const directory = await makeNotesDirectory([
      ["new.md", publishedNew],
      ["old.md", publishedOld],
      ["draft.md", draft],
    ]);
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
    const directory = await makeNotesDirectory([
      ["new.md", publishedNew],
      ["draft.md", draft],
    ]);
    const source = createMarkdownSource(directory);

    await expect(source.getArticleSlugs()).resolves.toEqual(["new-note"]);
    await expect(source.getArticleBySlug("new-note")).resolves.toMatchObject({
      slug: "new-note",
    });
    await expect(source.getArticleBySlug("draft-log")).resolves.toBeNull();
    await expect(source.getArticleBySlug("missing")).resolves.toBeNull();
  });

  it("rejects Markdown without valid frontmatter", async () => {
    const directory = await makeNotesDirectory([["invalid.md", "No frontmatter"]]);
    const source = createMarkdownSource(directory);

    await expect(source.getAllArticles()).rejects.toThrow(
      "Missing frontmatter in invalid.md",
    );
  });

  it("rejects invalid frontmatter shape", async () => {
    const directory = await makeNotesDirectory([
      [
        "invalid.md",
        `---
title: Invalid
slug: invalid
date: 2026-05-02
type: note
description: Missing published
---
Body`,
      ],
    ]);
    const source = createMarkdownSource(directory);

    await expect(source.getAllArticles()).rejects.toThrow(
      "Invalid frontmatter shape in invalid.md",
    );
  });

  it("rejects unsupported article kinds", async () => {
    const directory = await makeNotesDirectory([
      [
        "invalid-kind.md",
        `---
title: Invalid Kind
slug: invalid-kind
date: 2026-05-02
type: diary
description: Invalid kind
published: true
---
Body`,
      ],
    ]);
    const source = createMarkdownSource(directory);

    await expect(source.getAllArticles()).rejects.toThrow(
      "Invalid article kind in invalid-kind.md: diary",
    );
  });

  it("rejects unsupported custom block syntax inside articles", async () => {
    const directory = await makeNotesDirectory([
      [
        "custom.md",
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
      ],
    ]);
    const source = createMarkdownSource(directory);

    await expect(source.getAllArticles()).rejects.toThrow(
      "Unsupported custom block syntax: ::unknown",
    );
  });
});
