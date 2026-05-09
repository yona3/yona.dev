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
