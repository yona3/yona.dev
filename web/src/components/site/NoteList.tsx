import Link from "next/link";

import { formatNoteDate, type Note, noteTypeLabels } from "../../lib/notes";
import styles from "./site.module.css";

type Props = {
  notes: Note[];
};

export const NoteList = ({ notes }: Props) => {
  return (
    <ol className={styles.noteList}>
      {notes.map((note) => (
        <li className={styles.noteItem} key={note.slug}>
          <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
          <span className={styles.noteType}>{noteTypeLabels[note.type]}</span>
          <Link href={`/notes/${note.slug}`}>{note.title}</Link>
        </li>
      ))}
    </ol>
  );
};
