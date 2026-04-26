import Link from "next/link";

import { GitHubIcon, XIcon, ZennIcon } from "../components/icons/SocialIcons";
import { HomeIntro } from "../components/site/HomeIntro";
import { NoteList } from "../components/site/NoteList";
import styles from "../components/site/site.module.css";
import { SiteShell } from "../components/site/SiteShell";
import { getAllNotes } from "../lib/notes";

const socialLinks = [
  {
    href: "https://github.com/yona3",
    label: "GitHub",
    icon: GitHubIcon,
  },
  {
    href: "https://x.com/yonah6g",
    label: "X",
    icon: XIcon,
  },
  {
    href: "https://zenn.dev/yonajs",
    label: "Zenn",
    icon: ZennIcon,
  },
];

export default async function HomePage() {
  const notes = await getAllNotes();
  const recentNotes = notes.slice(0, 5);
  const hasMoreNotes = notes.length > recentNotes.length;

  return (
    <SiteShell currentPage="home">
      <section className={styles.hero} aria-labelledby="home-title">
        <HomeIntro />
        <p className={styles.lead}>
          沖縄でソフトウェアエンジニアをしています 🌺
          <br />
          普段の業務では Web システムの開発に携わっています。
        </p>
        <p className={styles.lead}>
          最近は AI Agent
          と一緒に開発すること、個人で小さな道具を作ることに時間を使っています。技術メモや日々の記録は
          Notes に書いています ✏️
        </p>
        <ul className={styles.socialLinks} aria-label="外部プロフィール">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <a
                aria-label={label}
                href={href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon className={styles.socialIcon} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="recent-notes-title">
        <div className={styles.sectionHeader}>
          <h2 id="recent-notes-title">Notes</h2>
          {hasMoreNotes && (
            <Link className={styles.sectionLink} href="/notes">
              すべて見る
            </Link>
          )}
        </div>
        <NoteList notes={recentNotes} />
      </section>
    </SiteShell>
  );
}
