import { HedgehogEmoji } from "../components/site/HedgehogEmoji";
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
        <h1 id="home-title">
          <span className={styles.nameHeading}>
            <span>Koh Yonamine</span>
            <HedgehogEmoji className={styles.hedgehogEmoji} />
          </span>
        </h1>
        <p className={styles.lead}>
          ソフトウェアを作る人です。AI Agent と開発すること、個人のための小さな道具、
          生活の中で考えたことを、まとまる前の温度のまま書いています。
        </p>
      </section>

      <section className={styles.section} aria-labelledby="recent-notes-title">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>最近</p>
          <h2 id="recent-notes-title">Notes</h2>
        </div>
        <NoteList notes={recentNotes} />
      </section>
    </SiteShell>
  );
}
