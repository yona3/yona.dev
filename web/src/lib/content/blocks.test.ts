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
