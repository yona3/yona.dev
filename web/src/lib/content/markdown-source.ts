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
