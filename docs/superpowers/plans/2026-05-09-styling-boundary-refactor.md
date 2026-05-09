# Styling Boundary Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 見た目を変えずに、page scaffold 用 CSS と Home intro 専用 CSS の責務境界を分ける。

**Architecture:** `home.module.css` は Home intro / hedgehog / speech bubble 専用に縮小する。Home / About / Notes で共有する hero、lead、section、body text は新しい `page.module.css` に移し、`PageHero` / `PageSection` と route pages はそこを参照する。CSS property の値、class の利用意図、公開 route の表示内容は変えない。

**Tech Stack:** Next.js 16 App Router, CSS Modules, TypeScript, Vitest, Playwright, pnpm, mise.

---

## File Structure

**Create**

- `web/src/components/site/page.module.css`: page scaffold 共通の hero、title、lead、section、body text、text link styling を担当する。
- `web/src/components/site/style-boundaries.test.ts`: shared page styles が `page.module.css` にあり、route pages が `home.module.css` へ戻らないことを検証する。

**Modify**

- `web/src/components/site/home.module.css`: Home intro / hedgehog / speech bubble 専用 class だけを残す。
- `web/src/components/site/PageHero.tsx`: `page.module.css` を参照する。
- `web/src/components/site/PageSection.tsx`: `page.module.css` を参照する。
- `web/src/app/page.tsx`: lead と section link を `page.module.css` へ移す。
- `web/src/app/about/page.tsx`: lead と body text を `page.module.css` へ移す。
- `web/src/app/notes/page.tsx`: lead を `page.module.css` へ移す。

**Keep Unchanged**

- `web/src/components/site/article.module.css`: article block styling を触らない。
- `web/src/components/site/notes.module.css`: note list / note detail styling を触らない。
- `web/src/components/site/layout.module.css`: shell / header / footer styling を触らない。
- `web/src/components/site/navigation.module.css`: nav / social link styling を触らない。
- `web/src/components/site/motion.module.css`: animation / reduced motion を触らない。
- `web/src/styles/globals.css`: design token を変えない。
- `web/content/notes/*.md`: content と frontmatter schema を変えない。

---

### Task 1: CSS 境界テストを追加する

**Files:**

- Create: `web/src/components/site/style-boundaries.test.ts`

- [ ] **Step 1: failing test を追加する**

Create `web/src/components/site/style-boundaries.test.ts`:

```ts
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
```

- [ ] **Step 2: test が未実装で失敗することを確認する**

Run:

```bash
cd web
pnpm test -- src/components/site/style-boundaries.test.ts
```

Expected:

```text
FAIL src/components/site/style-boundaries.test.ts
ENOENT: no such file or directory, open '.../page.module.css'
```

- [ ] **Step 3: commit しない**

This is the red test for Task 2. Do not commit the failing state.

### Task 2: page scaffold CSS を `page.module.css` へ移す

**Files:**

- Create: `web/src/components/site/page.module.css`
- Modify: `web/src/components/site/home.module.css`
- Modify: `web/src/components/site/PageHero.tsx`
- Modify: `web/src/components/site/PageSection.tsx`
- Modify: `web/src/app/page.tsx`
- Modify: `web/src/app/about/page.tsx`
- Modify: `web/src/app/notes/page.tsx`
- Test: `web/src/components/site/style-boundaries.test.ts`

- [ ] **Step 1: `page.module.css` を作成する**

Create `web/src/components/site/page.module.css` with the exact declarations moved from the current `home.module.css`:

```css
.hero {
  padding: 56px 0 80px;
}

.heroAbout {
  padding-bottom: 32px;
}

.hero h1:not(.pageTitle) {
  margin: 0;
  color: var(--color-primary);
  font-size: clamp(0.95rem, 1.55vw, 1.05rem);
  font-weight: 400;
  line-height: 1.35;
  text-wrap: balance;
}

.pageTitle {
  margin: 0;
  color: var(--color-primary);
  font-size: clamp(1.85rem, 3vw, 2rem);
  font-weight: 400;
  line-height: 1.18;
  text-wrap: balance;
}

.lead {
  margin: 22px 0 0;
  color: var(--color-secondary);
  font-size: 0.98rem;
  line-height: 2.05;
  line-break: strict;
  overflow-wrap: break-word;
}

.lead + .lead {
  margin-top: 14px;
}

.section {
  padding: 34px 0 46px;
}

.sectionHeader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.sectionHeader h2 {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.4;
  text-wrap: balance;
}

.sectionLink {
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  text-underline-offset: 4px;
}

.sectionLink:hover {
  color: var(--color-link);
  text-decoration: underline;
}

.bodyText {
  display: grid;
  gap: 20px;
  padding: 0 0 50px;
}

.bodyText p {
  margin: 0;
  color: var(--color-secondary);
  font-size: 0.96rem;
  line-height: 2;
  line-break: strict;
  overflow-wrap: break-word;
}

.textLink {
  color: var(--color-link);
  margin: 0 0.25em;
  text-decoration-color: var(--color-border);
  text-underline-offset: 5px;
}

@media (max-width: 680px) {
  .hero {
    padding: 54px 0 48px;
  }
}
```

- [ ] **Step 2: `home.module.css` から moved classes を削除する**

Modify `web/src/components/site/home.module.css` so it contains only Home intro / hedgehog / speech bubble classes:

```css
.nameHeading {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  margin-bottom: 56px;
}

.nameSpeech {
  position: relative;
  display: inline-block;
  padding: 13px 30px;
  border: 1px solid var(--color-border-soft);
  border-radius: 999px;
  background: var(--color-surface);
  font-family: var(--font-rounded), "Hiragino Maru Gothic ProN", "Yu Gothic UI", system-ui, var(--font-emoji), sans-serif;
}

.nameSpeech::before,
.nameSpeech::after {
  content: "";
  position: absolute;
  left: 50%;
  width: 0;
  height: 0;
  border-style: solid;
  transform: translateX(-50%);
}

.nameSpeech::before {
  bottom: -10px;
  border-width: 10px 6px 0 6px;
  border-color: var(--color-border-soft) transparent transparent transparent;
}

.nameSpeech::after {
  bottom: -9px;
  border-width: 9px 5px 0 5px;
  border-color: var(--color-surface) transparent transparent transparent;
}

.nameCaret {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin-left: 3px;
  background: var(--color-secondary);
  vertical-align: -0.12em;
}

.hedgehogEmoji {
  display: block;
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  color: var(--color-border);
  opacity: 0.92;
}

.hedgehogButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  line-height: 0;
}

.hedgehogButton:focus-visible {
  border-radius: 6px;
  outline: 1px solid var(--color-accent);
  outline-offset: 4px;
}

.hedgehogWobbleHost {
  display: inline-flex;
  transform-origin: bottom center;
}

@media (max-width: 680px) {
  .hedgehogEmoji {
    width: 34px;
    height: 34px;
  }
}
```

- [ ] **Step 3: `PageHero` と `PageSection` を `page.module.css` へ切り替える**

Modify `web/src/components/site/PageHero.tsx`:

```tsx
import type { ReactNode } from "react";

import pageStyles from "./page.module.css";

type Props = {
  children?: ReactNode;
  labelledBy: string;
  title?: ReactNode;
  variant?: "default" | "about";
};

export const PageHero = ({
  children,
  labelledBy,
  title,
  variant = "default",
}: Props) => {
  const className =
    variant === "about"
      ? `${pageStyles.hero} ${pageStyles.heroAbout}`
      : pageStyles.hero;

  return (
    <section className={className} aria-labelledby={labelledBy}>
      {title && (
        <h1 id={labelledBy} className={pageStyles.pageTitle}>
          {title}
        </h1>
      )}
      {children}
    </section>
  );
};
```

Modify `web/src/components/site/PageSection.tsx`:

```tsx
import type { ReactNode } from "react";

import pageStyles from "./page.module.css";

type Props = {
  action?: ReactNode;
  children: ReactNode;
  label?: string;
  labelledBy?: string;
  title?: ReactNode;
};

export const PageSection = ({
  action,
  children,
  label,
  labelledBy,
  title,
}: Props) => {
  return (
    <section
      className={pageStyles.section}
      aria-label={label}
      aria-labelledby={labelledBy}
    >
      {title && labelledBy && (
        <div className={pageStyles.sectionHeader}>
          <h2 id={labelledBy}>{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
};
```

- [ ] **Step 4: route pages を `page.module.css` へ切り替える**

Modify `web/src/app/page.tsx`:

```tsx
import Link from "next/link";

import { GitHubIcon, XIcon, ZennIcon } from "../components/icons/SocialIcons";
import { HomeIntro } from "../components/site/HomeIntro";
import navigationStyles from "../components/site/navigation.module.css";
import { NoteList } from "../components/site/NoteList";
import { PageHero } from "../components/site/PageHero";
import pageStyles from "../components/site/page.module.css";
import { PageSection } from "../components/site/PageSection";
import { SiteShell } from "../components/site/SiteShell";
import { getAllArticles } from "../lib/content";
```

Then replace:

```tsx
homeStyles.lead -> pageStyles.lead
homeStyles.sectionLink -> pageStyles.sectionLink
```

Modify `web/src/app/about/page.tsx`:

```tsx
import type { Metadata } from "next";

import { PageHero } from "../../components/site/PageHero";
import pageStyles from "../../components/site/page.module.css";
import { SiteShell } from "../../components/site/SiteShell";
```

Then replace:

```tsx
homeStyles.lead -> pageStyles.lead
homeStyles.bodyText -> pageStyles.bodyText
```

Modify `web/src/app/notes/page.tsx`:

```tsx
import type { Metadata } from "next";

import { NoteList } from "../../components/site/NoteList";
import { PageHero } from "../../components/site/PageHero";
import pageStyles from "../../components/site/page.module.css";
import { PageSection } from "../../components/site/PageSection";
import { SiteShell } from "../../components/site/SiteShell";
import { getAllArticles } from "../../lib/content";
```

Then replace:

```tsx
homeStyles.lead -> pageStyles.lead
```

- [ ] **Step 5: boundary test と component tests を確認する**

Run:

```bash
cd web
pnpm test -- src/components/site/style-boundaries.test.ts src/components/site/PageScaffold.test.tsx
```

Expected:

```text
Test Files  2 passed
```

- [ ] **Step 6: commit**

```bash
git add web/src/components/site/page.module.css web/src/components/site/home.module.css web/src/components/site/PageHero.tsx web/src/components/site/PageSection.tsx web/src/app/page.tsx web/src/app/about/page.tsx web/src/app/notes/page.tsx web/src/components/site/style-boundaries.test.ts
git commit -m "refactor(styles): page scaffold CSS 境界を分離"
```

### Task 3: 最終検証と review gate

**Files:**

- No code changes.

- [ ] **Step 1: full test を実行する**

Run:

```bash
cd web
pnpm test
```

Expected:

```text
Test Files  8 passed
```

- [ ] **Step 2: hard guard を実行する**

Run:

```bash
mise run verify
```

Expected:

```text
lint, test, build, test:e2e all pass
```

- [ ] **Step 3: project-local review skill を実行する**

Review scope:

```bash
git diff 7e49c85..HEAD -- web/src/app web/src/components/site
```

Reviewer set:

- `contract-reviewer`: styling boundary plan と変更範囲の整合。
- `ui-reviewer`: CSS 値の移動が見た目を変えないか、semantic markup が維持されているか。
- `app-reviewer`: import 変更が route / build / server-client boundary を壊していないか。

Expected:

```text
APPROVE
findings なし
```

If any reviewer returns a valid finding, fix only that finding, run `git diff --check`, `mise run verify`, and rerun the same reviewer set.

---

## Self-Review

- Spec coverage: Task C の対象である `home.module.css` の page scaffold 責務を `page.module.css` に移し、article / notes / layout / navigation / motion / globals は対象外に固定した。
- Placeholder scan: 該当なし。
- Type consistency: `PageHero` / `PageSection` は `pageStyles` へ import 先だけを変え、props と markup は Task B から変えない。
