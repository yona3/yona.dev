import styles from "./site.module.css";

type HeadingBlock = {
  kind: "heading";
  level: 1 | 2 | 3;
  text: string;
};

type ParagraphBlock = {
  kind: "paragraph";
  text: string;
};

type ListBlock = {
  kind: "list";
  items: string[];
};

type CodeBlock = {
  kind: "code";
  code: string;
};

type MarkdownBlock = HeadingBlock | ParagraphBlock | ListBlock | CodeBlock;

type Props = {
  content: string;
};

const flushParagraph = (blocks: MarkdownBlock[], paragraph: string[]) => {
  if (paragraph.length === 0) return;
  blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  paragraph.length = 0;
};

const parseMarkdownBlocks = (content: string): MarkdownBlock[] => {
  const blocks: MarkdownBlock[] = [];
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

    if (trimmed.startsWith("```")) {
      flushParagraph(blocks, paragraph);
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index]?.trim().startsWith("```")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }

      blocks.push({ kind: "code", code: codeLines.join("\n") });
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

    paragraph.push(trimmed);
    index += 1;
  }

  flushParagraph(blocks, paragraph);
  return blocks;
};

export const MarkdownContent = ({ content }: Props) => {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className={styles.markdown}>
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        if (block.kind === "heading") {
          if (block.level === 1) {
            return <h1 key={key}>{block.text}</h1>;
          }

          if (block.level === 2) {
            return <h2 key={key}>{block.text}</h2>;
          }

          return <h3 key={key}>{block.text}</h3>;
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

        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
};
