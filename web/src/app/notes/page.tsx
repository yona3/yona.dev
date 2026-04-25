import type { Metadata } from "next";

import { NoteList } from "../../components/site/NoteList";
import styles from "../../components/site/site.module.css";
import { SiteShell } from "../../components/site/SiteShell";
import { getAllNotes } from "../../lib/notes";

export const metadata: Metadata = {
  title: "Notes | Koh Yonamine",
  description: "Koh Yonamine の技術記事、ノート、記録。",
};

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <SiteShell currentPage="notes">
      <section className={styles.hero} aria-labelledby="notes-title">
        <p className={styles.kicker}>archive</p>
        <h1 id="notes-title" className={styles.pageTitle}>
          Notes
        </h1>
        <p className={styles.lead}>
          技術記事、考えたことのノート、作業記録を同じ場所に置いています。
          日付順に、少しずつ積もっていく個人的な記録です。
        </p>
      </section>

      <section className={styles.section} aria-label="Notes list">
        <NoteList notes={notes} />
      </section>
    </SiteShell>
  );
}
