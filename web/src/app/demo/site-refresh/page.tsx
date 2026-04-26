import type { Metadata } from "next";

import styles from "./page.module.css";

const notes = [
  {
    date: "2026.04.26",
    type: "記事",
    title: "AI Agent と開発するということ",
  },
  {
    date: "2026.04.22",
    type: "ノート",
    title: "古い本屋のようなサイトについて",
  },
  {
    date: "2026.04.18",
    type: "記録",
    title: "小さな道具を育てる",
  },
  {
    date: "2026.04.12",
    type: "ノート",
    title: "余白に残る温度",
  },
] as const;

export const metadata: Metadata = {
  title: "Site refresh demo | yona.dev",
  description: "Bookish Warm Minimal design demo for yona.dev.",
};

export default function SiteRefreshDemoPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <a className={styles.brand} href="/demo/site-refresh">
            yona.dev
          </a>
          <nav className={styles.nav} aria-label="Demo navigation">
            <a aria-current="page" href="/demo/site-refresh">
              Home
            </a>
            <a href="#notes">Notes</a>
            <a href="#about">About</a>
          </nav>
        </header>

        <section className={styles.hero} aria-labelledby="demo-title">
          <h1 id="demo-title">Koh Yonamine</h1>
          <p className={styles.lead}>
            ソフトウェアを作る人です。AI Agent と開発すること、個人のための小さな道具、
            生活の中で考えたことを、まとまる前の温度のまま書いています。
          </p>
        </section>

        <section id="notes" className={styles.notes} aria-labelledby="notes-title">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>最近</p>
            <h2 id="notes-title">Notes</h2>
          </div>

          <ol className={styles.noteList}>
            {notes.map((note) => (
              <li className={styles.noteItem} key={`${note.date}-${note.title}`}>
                <time dateTime={note.date.replaceAll(".", "-")}>{note.date}</time>
                <span className={styles.noteType}>{note.type}</span>
                <span className={styles.noteTitle}>{note.title}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="about" className={styles.aboutBlock} aria-label="About preview">
          <p>
            AI Agent とともに開発する体験、道具を育てること、偶然から生まれる創造性に関心があります。
          </p>
        </section>
      </div>
    </main>
  );
}
