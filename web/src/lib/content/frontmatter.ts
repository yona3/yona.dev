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
