import { promises as fs } from "node:fs";
import path from "node:path";

import { cache } from "react";

import {
  createMarkdownArticle,
  getPublishedArticles,
  sortArticlesByPublishedAtDesc,
} from "./markdown-article";
import type { Article, ContentSource } from "./types";

const defaultNotesDirectory = path.join(process.cwd(), "content", "notes");

const readMarkdownArticles = async (notesDirectory: string): Promise<Article[]> => {
  const fileNames = await fs.readdir(notesDirectory);

  return Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const source = await fs.readFile(path.join(notesDirectory, fileName), "utf8");
        return createMarkdownArticle(source, fileName);
      }),
  );
};

export const createMarkdownSource = (
  notesDirectory = defaultNotesDirectory,
): ContentSource => {
  const getAllMarkdownArticles = cache(async (): Promise<Article[]> => {
    const articles = await readMarkdownArticles(notesDirectory);
    return sortArticlesByPublishedAtDesc(getPublishedArticles(articles));
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
