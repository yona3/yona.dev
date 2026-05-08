import { markdownSource } from "./markdown-source";

export type { Article, ArticleAsset, ArticleBlock, ArticleKind } from "./types";
export { articleKindLabels } from "./types";

const contentSource = markdownSource;

export const formatArticleDate = (date: string): string => {
  return date.replaceAll("-", ".");
};

export const getAllArticles = contentSource.getAllArticles;
export const getArticleBySlug = contentSource.getArticleBySlug;
export const getArticleSlugs = contentSource.getArticleSlugs;
