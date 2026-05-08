import type { ArticleAsset, ArticleBlock } from "./types";

const flushParagraph = (blocks: ArticleBlock[], paragraph: string[]) => {
  if (paragraph.length === 0) return;
  blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  paragraph.length = 0;
};

const parseImageLine = (line: string): ArticleBlock | null => {
  const match = line.match(
    /^!\[(?<alt>[^\]]*)\]\((?<src>[^)\s]+)(?:\s+"(?<caption>[^"]+)")?\)$/,
  );

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
