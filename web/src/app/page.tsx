import { NoteList } from "../components/site/NoteList";
import styles from "../components/site/site.module.css";
import { SiteShell } from "../components/site/SiteShell";
import { getAllNotes } from "../lib/notes";

export default async function HomePage() {
  const notes = await getAllNotes();
  const recentNotes = notes.slice(0, 5);

  return (
    <SiteShell currentPage="home">
      <section className={styles.hero} aria-labelledby="home-title">
        <p className={styles.kicker}>personal notes</p>
        <h1 id="home-title">Koh Yonamine</h1>
        <p className={styles.lead}>
          ソフトウェアを作ること、その過程で考えたことを書いています。
          技術、生活、創造性についての個人的な記録です。
        </p>
      </section>

      <section className={styles.section} aria-labelledby="recent-notes-title">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>recent</p>
          <h2 id="recent-notes-title">Notes</h2>
        </div>
        <NoteList notes={recentNotes} />
      </section>

      <aside className={styles.aboutCard} aria-label="About preview">
        <div>
          <p className={styles.kicker}>about</p>
          <p>
            AI Agent とともに開発する体験、道具を育てること、偶然から生まれる創造性に関心があります。
          </p>
        </div>
        <div className={styles.tableNote} aria-hidden="true">
          <span>☕</span>
        </div>
      </aside>
    </SiteShell>
  );
}
