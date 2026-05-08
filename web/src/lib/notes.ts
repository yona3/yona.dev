import {
  type Article,
  type ArticleBlock,
  type ArticleKind,
  articleKindLabels,
  formatArticleDate,
  getAllArticles,
  getArticleBySlug,
  getArticleSlugs,
} from "./content";

export type { ArticleKind as NoteType };
export { formatArticleDate as formatNoteDate, articleKindLabels as noteTypeLabels };

export type Note = Article & {
  date: string;
  type: ArticleKind;
  content: string;
};

const blockToMarkdown = (block: ArticleBlock): string => {
  if (block.kind === "heading") {
    return `${"#".repeat(block.level)} ${block.text}`;
  }

  if (block.kind === "list") {
    return block.items.map((item) => `- ${item}`).join("\n");
  }

  if (block.kind === "quote") {
    return block.text
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n");
  }

  if (block.kind === "code") {
    return `\`\`\`${block.language ?? ""}\n${block.code}\n\`\`\``;
  }

  if (block.kind === "image") {
    const caption = block.caption ? ` "${block.caption}"` : "";
    return `![${block.asset.alt}](${block.asset.src}${caption})`;
  }

  if (block.kind === "callout") {
    const tone = block.tone === "warning" ? " warning" : "";
    return `:::callout${tone}\n${block.text}\n:::`;
  }

  if (block.kind === "linkCard") {
    return block.description
      ? `${block.title}\n${block.url}\n${block.description}`
      : `${block.title}\n${block.url}`;
  }

  if (block.kind === "gallery") {
    return block.images.map((image) => `![${image.alt}](${image.src})`).join("\n");
  }

  return block.text;
};

const articleToNote = (article: Article): Note => ({
  ...article,
  date: article.publishedAt,
  type: article.kind,
  content: article.blocks.map(blockToMarkdown).join("\n\n"),
});

export const getAllNotes = async (): Promise<Note[]> => {
  const articles = await getAllArticles();
  return articles.map(articleToNote);
};

export const getNoteBySlug = async (slug: string): Promise<Note | null> => {
  const article = await getArticleBySlug(slug);
  return article ? articleToNote(article) : null;
};

export const getNoteSlugs = getArticleSlugs;
