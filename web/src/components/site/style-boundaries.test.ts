import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.resolve(siteDirectory, "..", "..");

const readSource = (relativePath: string): string => {
  return fs.readFileSync(path.join(sourceDirectory, relativePath), "utf8");
};

describe("site CSS module boundaries", () => {
  it("keeps shared page scaffold classes in page.module.css", () => {
    const pageStyles = fs.readFileSync(
      path.join(siteDirectory, "page.module.css"),
      "utf8",
    );
    const homeStyles = fs.readFileSync(
      path.join(siteDirectory, "home.module.css"),
      "utf8",
    );

    for (const className of [
      "hero",
      "pageTitle",
      "lead",
      "section",
      "sectionHeader",
      "sectionLink",
      "bodyText",
    ]) {
      expect(pageStyles).toContain(`.${className}`);
      expect(homeStyles).not.toContain(`.${className}`);
    }
  });

  it("keeps route pages from importing home.module.css directly", () => {
    for (const routePath of [
      "app/page.tsx",
      "app/about/page.tsx",
      "app/notes/page.tsx",
    ]) {
      expect(readSource(routePath)).not.toContain("home.module.css");
      expect(readSource(routePath)).toContain("page.module.css");
    }
  });
});
