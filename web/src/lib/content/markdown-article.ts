import { parseArticleBlocks } from "./blocks";
import { parseArticleFrontmatter } from "./frontmatter";
import type { Article } from "./types";

export const createMarkdownArticle = (
  source: string,
  fileName: string,
): Article => {
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
  };
};

export const getPublishedArticles = (articles: Article[]): Article[] => {
  return articles.filter((article) => article.isPublished);
};

export const sortArticlesByPublishedAtDesc = (
  articles: Article[],
): Article[] => {
  return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
};
