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
