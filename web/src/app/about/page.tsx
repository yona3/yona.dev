import type { Metadata } from "next";

import { CopyParagraph } from "../../components/site/CopyParagraph";
import pageStyles from "../../components/site/page.module.css";
import { PageHero } from "../../components/site/PageHero";
import { SiteShell } from "../../components/site/SiteShell";
import { siteCopy } from "../../constants/site";

export const metadata: Metadata = siteCopy.about.metadata;

export default function AboutPage() {
  return (
    <SiteShell currentPage="about">
      <PageHero
        labelledBy={siteCopy.about.hero.labelledBy}
        title={siteCopy.about.hero.title}
        variant="about"
      >
        {siteCopy.about.hero.leadParagraphs.map((lines, index) => (
          <CopyParagraph
            className={pageStyles.lead}
            key={index}
            lines={lines}
          />
        ))}
      </PageHero>

      <section
        className={pageStyles.bodyText}
        aria-label={siteCopy.about.body.label}
      >
        {siteCopy.about.body.paragraphs.map((lines, index) => (
          <CopyParagraph key={index} lines={lines} />
        ))}
      </section>
    </SiteShell>
  );
}
