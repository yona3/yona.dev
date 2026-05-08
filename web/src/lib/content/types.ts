export type ArticleKind = "article" | "note" | "log";

export const articleKindLabels: Record<ArticleKind, string> = {
  article: "記事",
  note: "ノート",
  log: "記録",
};

export type ArticleAsset = {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurData?: string;
};

export type ArticleBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "code"; code: string; language?: string }
  | { kind: "image"; asset: ArticleAsset; caption?: string }
  | { kind: "callout"; tone: "note" | "warning"; text: string }
  | { kind: "linkCard"; title: string; url: string; description?: string }
  | { kind: "gallery"; images: ArticleAsset[] };

export type Article = {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  kind: ArticleKind;
  heroImage?: ArticleAsset;
  isPublished: boolean;
  blocks: ArticleBlock[];
};

export type ContentSource = {
  getAllArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  getArticleSlugs(): Promise<string[]>;
};
