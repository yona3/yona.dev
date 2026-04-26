import type { Metadata } from "next";

import styles from "../../components/site/site.module.css";
import { SiteShell } from "../../components/site/SiteShell";

export const metadata: Metadata = {
  title: "このサイトについて | Koh Yonamine",
  description: "このサイトと書いている人について。",
};

export default function AboutPage() {
  return (
    <SiteShell currentPage="about">
      <section className={styles.hero} aria-labelledby="about-title">
        <h1 id="about-title" className={styles.pageTitle}>
          このサイトについて
        </h1>
        <p className={styles.lead}>
          整った記事だけでなく、まとまる前のノートや作業の記録も同じ場所に置いています。
          書きながら考えるための、小さな机のようなページです。
        </p>
      </section>

      <section className={styles.bodyText} aria-label="プロフィール">
        <p>
          外向けに整えた文章だけを残すと、考える途中にしかないものが残らない。
          書き始めの粗い形でも置けるように、記事と日々のノートを分けず、Notes として並べています。
        </p>
        <p>
          手を動かしながら気づいたことを忘れないうちに書き留めること、
          実績ではなく何を面白がっているかが伝わることを大事にしています。
        </p>
        <p>
          人生に決まった意味はないからこそ、作ることや書くことを自由に楽しめる。
          効率だけでは拾えないものを、少しずつ残していきます。
        </p>
      </section>
    </SiteShell>
  );
}
