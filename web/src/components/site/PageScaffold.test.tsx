import Link from "next/link";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PageHero } from "./PageHero";
import { PageSection } from "./PageSection";

describe("PageHero", () => {
  it("renders a labelled page title when title is provided", () => {
    const markup = renderToStaticMarkup(
      <PageHero labelledBy="about-title" title="このサイトについて" variant="about">
        <p>Lead body</p>
      </PageHero>,
    );

    expect(markup).toContain('<section class="');
    expect(markup).toContain('aria-labelledby="about-title"');
    expect(markup).toContain('<h1 id="about-title"');
    expect(markup).toContain(">このサイトについて</h1>");
    expect(markup).toContain("<p>Lead body</p>");
  });

  it("renders custom hero children without adding another heading", () => {
    const markup = renderToStaticMarkup(
      <PageHero labelledBy="home-title">
        <h1 id="home-title">Hello, I&apos;m yona!</h1>
      </PageHero>,
    );

    expect(markup).toContain('aria-labelledby="home-title"');
    expect(markup.match(/<h1/g)).toHaveLength(1);
  });
});

describe("PageSection", () => {
  it("renders a labelled section heading with an action", () => {
    const markup = renderToStaticMarkup(
      <PageSection
        action={<Link href="/notes">すべて見る</Link>}
        labelledBy="recent-notes-title"
        title="Notes"
      >
        <ol />
      </PageSection>,
    );

    expect(markup).toContain('aria-labelledby="recent-notes-title"');
    expect(markup).toContain('<h2 id="recent-notes-title">Notes</h2>');
    expect(markup).toContain('href="/notes"');
    expect(markup).toContain("<ol></ol>");
  });

  it("renders an aria-label when no visible title is needed", () => {
    const markup = renderToStaticMarkup(
      <PageSection label="ノート一覧">
        <ol />
      </PageSection>,
    );

    expect(markup).toContain('aria-label="ノート一覧"');
    expect(markup).not.toContain("<h2");
  });
});
