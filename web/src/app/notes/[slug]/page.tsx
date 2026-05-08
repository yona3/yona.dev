import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkdownContent } from "../../../components/site/MarkdownContent";
import notesStyles from "../../../components/site/notes.module.css";
import { SiteShell } from "../../../components/site/SiteShell";
import {
  formatNoteDate,
  getNoteBySlug,
  getNoteSlugs,
  noteTypeLabels,
} from "../../../lib/notes";

type Params = {
  slug: string;
};

type Props = {
  params: Promise<Params>;
};

export const generateStaticParams = async (): Promise<Params[]> => {
  const slugs = await getNoteSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    return {
      title: "Note not found | Koh Yonamine",
    };
  }

  return {
    title: `${note.title} | Koh Yonamine`,
    description: note.description,
    alternates: {
      canonical: `https://yona.dev/notes/${note.slug}`,
    },
    openGraph: {
      title: note.title,
      description: note.description,
      url: `https://yona.dev/notes/${note.slug}`,
      siteName: "yona.dev",
      type: "article",
    },
  };
};

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <SiteShell currentPage="notes">
      <article className={notesStyles.noteArticle}>
        <div className={notesStyles.noteMeta}>
          <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
          <span className={notesStyles.noteType}>{noteTypeLabels[note.type]}</span>
        </div>
        <h1>{note.title}</h1>
        <MarkdownContent content={note.content} />
        <div className={notesStyles.noteEnd} aria-hidden="true">
          * * *
        </div>
      </article>
    </SiteShell>
  );
}
