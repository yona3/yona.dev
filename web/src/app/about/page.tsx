import type { Metadata } from "next";

import styles from "../../components/site/site.module.css";
import { SiteShell } from "../../components/site/SiteShell";

export const metadata: Metadata = {
  title: "About | Koh Yonamine",
  description: "Koh Yonamine について。",
};

export default function AboutPage() {
  return (
    <SiteShell currentPage="about">
      <section className={styles.hero} aria-labelledby="about-title">
        <p className={styles.kicker}>about</p>
        <h1 id="about-title" className={styles.pageTitle}>
          Koh Yonamine
        </h1>
        <p className={styles.lead}>
          ソフトウェアを作ること、その過程で考えたことを書いています。
          技術と生活のあいだにある、少し遠回りな楽しさに関心があります。
        </p>
      </section>

      <section className={styles.bodyText} aria-label="Profile">
        <p>
          AI Agent とともに開発する体験、個人のための小さな道具、開発環境を育てることに興味があります。
          実績を並べるより、何を面白がっているかが伝わる場所にしたいと思っています。
        </p>
        <p>
          人生に決まった意味はないからこそ、作ることや書くことを自由に楽しめる。
          効率だけでは拾えないものを、少しずつ残していきます。
        </p>
        <ul className={styles.linkList} aria-label="Links">
          <li>
            <a href="https://github.com/yonakintv">GitHub</a>
          </li>
          <li>
            <a href="https://x.com/yonakinTV">X</a>
          </li>
          <li>
            <a href="https://zenn.dev/yonakintv">Zenn</a>
          </li>
        </ul>
      </section>
    </SiteShell>
  );
}
