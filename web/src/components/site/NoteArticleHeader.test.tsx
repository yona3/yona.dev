import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { NoteArticleHeader } from "./NoteArticleHeader";

describe("NoteArticleHeader", () => {
  it("renders date, article kind label, and title", () => {
    const markup = renderToStaticMarkup(
      <NoteArticleHeader
        article={{
          id: "site-renewal",
          slug: "site-renewal",
          title: "yona.dev をリニューアルしました",
          description: "サイト更新の記録。",
          publishedAt: "2026-04-26",
          kind: "note",
          isPublished: true,
          blocks: [],
        }}
      />,
    );

    expect(markup).toContain('<time dateTime="2026-04-26">2026.04.26</time>');
    expect(markup).toContain(">ノート</span>");
    expect(markup).toContain("<h1>yona.dev をリニューアルしました</h1>");
  });
});
