import type { Metadata } from "next";

import homeStyles from "../../components/site/home.module.css";
import { NoteList } from "../../components/site/NoteList";
import { PageHero } from "../../components/site/PageHero";
import { PageSection } from "../../components/site/PageSection";
import { SiteShell } from "../../components/site/SiteShell";
import { getAllArticles } from "../../lib/content";

export const metadata: Metadata = {
  title: "Notes | Koh Yonamine",
  description: "技術記事、ノート、日々の記録。",
};

export default async function NotesPage() {
  const notes = await getAllArticles();

  return (
    <SiteShell currentPage="notes">
      <PageHero labelledBy="notes-title" title="Notes">
        <p className={homeStyles.lead}>
          技術記事、考えたことのノート、作業記録を同じ場所に置いています。
          まとまる前のことも、日付順にそのまま残します。
        </p>
      </PageHero>

      <PageSection label="ノート一覧">
        <NoteList notes={notes} />
      </PageSection>
    </SiteShell>
  );
}
