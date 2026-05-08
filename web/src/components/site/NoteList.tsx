import Link from "next/link";

import { formatNoteDate, type Note, noteTypeLabels } from "../../lib/notes";
import notesStyles from "./notes.module.css";

type Props = {
  notes: Note[];
};

export const NoteList = ({ notes }: Props) => {
  return (
    <ol className={notesStyles.noteList}>
      {notes.map((note) => (
        <li className={notesStyles.noteItem} key={note.slug}>
          <time dateTime={note.date}>{formatNoteDate(note.date)}</time>
          <span className={notesStyles.noteType}>{noteTypeLabels[note.type]}</span>
          <Link href={`/notes/${note.slug}`}>{note.title}</Link>
        </li>
      ))}
    </ol>
  );
};
