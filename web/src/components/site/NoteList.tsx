import Link from "next/link";

import {
  type Article,
  articleKindLabels,
  formatArticleDate,
} from "../../lib/content";
import notesStyles from "./notes.module.css";

type Props = {
  notes: Article[];
};

export const NoteList = ({ notes }: Props) => {
  return (
    <ol className={notesStyles.noteList}>
      {notes.map((note) => (
        <li className={notesStyles.noteItem} key={note.slug}>
          <time dateTime={note.publishedAt}>
            {formatArticleDate(note.publishedAt)}
          </time>
          <span className={notesStyles.noteType}>
            {articleKindLabels[note.kind]}
          </span>
          <Link href={`/notes/${note.slug}`}>{note.title}</Link>
        </li>
      ))}
    </ol>
  );
};
