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

    expect(() =>
      renderToStaticMarkup(<ArticleContent blocks={blocks} />),
    ).toThrow("Unsupported linkCard URL protocol: javascript:");
  });
});
