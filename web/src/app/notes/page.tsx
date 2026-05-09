import type { Metadata } from "next";

import { CopyParagraph } from "../../components/site/CopyParagraph";
import { NoteList } from "../../components/site/NoteList";
import pageStyles from "../../components/site/page.module.css";
import { PageHero } from "../../components/site/PageHero";
import { PageSection } from "../../components/site/PageSection";
import { SiteShell } from "../../components/site/SiteShell";
import { siteCopy } from "../../constants/site";
import { getAllArticles } from "../../lib/content";

export const metadata: Metadata = siteCopy.notes.metadata;

export default async function NotesPage() {
  const notes = await getAllArticles();

  return (
    <SiteShell currentPage="notes">
      <PageHero
        labelledBy={siteCopy.notes.hero.labelledBy}
        title={siteCopy.notes.hero.title}
      >
        {siteCopy.notes.hero.leadParagraphs.map((lines, index) => (
          <CopyParagraph
            className={pageStyles.lead}
            key={index}
            lines={lines}
          />
        ))}
      </PageHero>

      <PageSection label={siteCopy.notes.listLabel}>
        <NoteList notes={notes} />
      </PageSection>
    </SiteShell>
  );
}
