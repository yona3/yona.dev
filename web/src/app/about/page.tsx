import type { Metadata } from "next";

import pageStyles from "../../components/site/page.module.css";
import { PageHero } from "../../components/site/PageHero";
import { SiteShell } from "../../components/site/SiteShell";

export const metadata: Metadata = {
  title: "このサイトについて | Koh Yonamine",
  description: "このサイトと書いている人について。",
};

export default function AboutPage() {
  return (
    <SiteShell currentPage="about">
      <PageHero labelledBy="about-title" title="このサイトについて" variant="about">
        <p className={pageStyles.lead}>
          こんにちは、Koh Yonamine です。
          <br />
          沖縄でソフトウェアエンジニアをしています 🌺
        </p>
      </PageHero>

      <section className={pageStyles.bodyText} aria-label="プロフィール">
        <p>
          普段の業務では Web システムの開発に携わっています。
          最近は AI Agent と一緒に開発すること、その開発フロー自体を整えることに時間を使っています。
        </p>
        <p>
          仕事の外では、自分のために小さな道具を作るのが好きです。
          このサイトもその一つで、書きながら考えるための小さな机として手を入れ続けています。
        </p>
        <p>
          コーヒーと本のある時間を大切にしています ☕
          <br />
          人生に決まった意味はないからこそ、作ることや書くことを自由に楽しめると思っています。
        </p>
      </section>
    </SiteShell>
  );
}
