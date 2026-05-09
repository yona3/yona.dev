import Link from "next/link";
import type { ComponentType } from "react";

import { GitHubIcon, XIcon, ZennIcon } from "../components/icons/SocialIcons";
import { CopyParagraph } from "../components/site/CopyParagraph";
import { HomeIntro } from "../components/site/HomeIntro";
import navigationStyles from "../components/site/navigation.module.css";
import { NoteList } from "../components/site/NoteList";
import pageStyles from "../components/site/page.module.css";
import { PageHero } from "../components/site/PageHero";
import { PageSection } from "../components/site/PageSection";
import { SiteShell } from "../components/site/SiteShell";
import {
  siteCopy,
  type SiteSocialLinkId,
  siteSocialLinks,
} from "../constants/site";
import { getAllArticles } from "../lib/content";

const socialIcons: Record<
  SiteSocialLinkId,
  ComponentType<{ className?: string }>
> = {
  github: GitHubIcon,
  x: XIcon,
  zenn: ZennIcon,
};

export default async function HomePage() {
  const notes = await getAllArticles();
  const recentNotes = notes.slice(0, 5);
  const hasMoreNotes = notes.length > recentNotes.length;

  return (
    <SiteShell currentPage="home">
      <PageHero labelledBy={siteCopy.home.hero.labelledBy}>
        <HomeIntro helloText={siteCopy.home.hero.helloText} />
        {siteCopy.home.hero.leadParagraphs.map((lines, index) => (
          <CopyParagraph
            className={pageStyles.lead}
            key={index}
            lines={lines}
          />
        ))}
        <ul
          className={navigationStyles.socialLinks}
          aria-label={siteCopy.home.socialLinksLabel}
        >
          {siteSocialLinks.map(({ href, id, label }) => {
            const Icon = socialIcons[id];
            return (
              <li key={href}>
                <a
                  aria-label={label}
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className={navigationStyles.socialIcon} />
                </a>
              </li>
            );
          })}
        </ul>
      </PageHero>

      <PageSection
        action={
          hasMoreNotes && (
            <Link className={pageStyles.sectionLink} href="/notes">
              {siteCopy.home.recentNotes.viewAllLabel}
            </Link>
          )
        }
        labelledBy={siteCopy.home.recentNotes.labelledBy}
        title={siteCopy.home.recentNotes.title}
      >
        <NoteList notes={recentNotes} />
      </PageSection>
    </SiteShell>
  );
}
