import type { Metadata } from "next";

import { NoteList } from "../../components/site/NoteList";
import styles from "../../components/site/site.module.css";
import { SiteShell } from "../../components/site/SiteShell";
import { getAllNotes } from "../../lib/notes";

export const metadata: Metadata = {
  title: "Notes | Koh Yonamine",
  description: "技術記事、ノート、日々の記録。",
};

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <SiteShell currentPage="notes">
      <section className={styles.hero} aria-labelledby="notes-title">
        <h1 id="notes-title" className={styles.pageTitle}>
          Notes
        </h1>
        <p className={styles.lead}>
          技術記事、考えたことのノート、作業記録を同じ場所に置いています。
          まとまる前のことも、日付順にそのまま残します。
        </p>
      </section>

      <section className={styles.section} aria-label="ノート一覧">
        <NoteList notes={notes} />
      </section>
    </SiteShell>
  );
}
