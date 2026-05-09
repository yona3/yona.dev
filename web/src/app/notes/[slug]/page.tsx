import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleContent } from "../../../components/site/ArticleContent";
import { NoteArticleHeader } from "../../../components/site/NoteArticleHeader";
import notesStyles from "../../../components/site/notes.module.css";
import { SiteShell } from "../../../components/site/SiteShell";
import { getArticleBySlug, getArticleSlugs } from "../../../lib/content";

type Params = {
  slug: string;
};

type Props = {
  params: Promise<Params>;
};

export const generateStaticParams = async (): Promise<Params[]> => {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Note not found | Koh Yonamine",
    };
  }

  return {
    title: `${article.title} | Koh Yonamine`,
    description: article.description,
    alternates: {
      canonical: `https://yona.dev/notes/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://yona.dev/notes/${article.slug}`,
      siteName: "yona.dev",
      type: "article",
    },
  };
};

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <SiteShell currentPage="notes">
      <article className={notesStyles.noteArticle}>
        <NoteArticleHeader article={article} />
        <ArticleContent blocks={article.blocks} />
        <div className={notesStyles.noteEnd} aria-hidden="true">
          * * *
        </div>
      </article>
    </SiteShell>
  );
}
