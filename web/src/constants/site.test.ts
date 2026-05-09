import { describe, expect, it } from "vitest";

import {
  formatSitePageTitle,
  getNoteUrl,
  siteCopy,
  siteInfo,
  siteNavigationItems,
  siteSocialLinks,
} from "./site";

describe("site copy", () => {
  it("groups page hero and introduction copy outside route components", () => {
    expect(siteCopy.home.hero.helloText).toBe("Hello, I'm yona!");
    expect(siteCopy.home.hero.leadParagraphs).toHaveLength(2);
    expect(siteCopy.about.hero.title).toBe("このサイトについて");
    expect(siteCopy.about.body.paragraphs).toHaveLength(3);
    expect(siteCopy.notes.hero.title).toBe("Notes");
  });

  it("provides shared shell labels and external profile links", () => {
    expect(siteInfo.name).toBe("yona.dev");
    expect(siteCopy.layout.navigationLabel).toBe("主要ナビゲーション");
    expect(siteNavigationItems.map((item) => item.label)).toEqual([
      "Home",
      "About",
      "Notes",
    ]);
    expect(siteSocialLinks.map((item) => item.label)).toEqual([
      "GitHub",
      "X",
      "Zenn",
    ]);
  });

  it("builds shared metadata titles and canonical note URLs", () => {
    expect(formatSitePageTitle("Notes")).toBe("Notes | Koh Yonamine");
    expect(getNoteUrl("site-renewal")).toBe(
      "https://yona.dev/notes/site-renewal",
    );
  });
});
