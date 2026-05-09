# Route Component Boundary Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 公開 route の表示を変えずに、page file の page composition と site component の presentation 境界を整理する。

**Architecture:** `web/src/app/*` は data fetch、metadata、redirect、page composition に寄せる。Home / About / Notes で繰り返している hero / section scaffold は `PageHero` と `PageSection` へ分離し、note detail の metadata heading は `NoteArticleHeader` に寄せる。CSS module と class 名は変えず、見た目を変更しない。

**Tech Stack:** Next.js 16 App Router, React Server Components, TypeScript, Vitest, Playwright, pnpm, mise.

---

## File Structure

**Create**

- `web/src/components/site/PageHero.tsx`: page hero の `<section>`、任意の page title、既存 `home.module.css` class の割り当てを担当する。
- `web/src/components/site/PageSection.tsx`: page body section、任意の heading/action、`aria-label` / `aria-labelledby` を担当する。
- `web/src/components/site/PageScaffold.test.tsx`: `PageHero` と `PageSection` が既存の semantic markup を出すことを検証する。
- `web/src/components/site/NoteArticleHeader.tsx`: note detail の date/type/title header を担当する。
- `web/src/components/site/NoteArticleHeader.test.tsx`: note detail header の date、種別 label、title を検証する。

**Modify**

- `web/src/app/page.tsx`: Home 固有の data fetch と composition だけに寄せる。
- `web/src/app/about/page.tsx`: About 固有の本文だけに寄せる。
- `web/src/app/notes/page.tsx`: Notes list の data fetch と composition だけに寄せる。
- `web/src/app/notes/[slug]/page.tsx`: detail data fetch、metadata、notFound、composition だけに寄せる。

**Keep Unchanged**

- `web/src/app/blog/page.tsx`: `/blog` redirect の互換挙動を変えない。
- `web/src/app/blog/[articleId]/page.tsx`: `/blog/[articleId]` redirect の互換挙動を変えない。
- `web/src/lib/content/*`: `ContentSource` と `Article` 契約を変えない。
- `web/src/components/site/*.module.css`: CSS class 名、色、余白、font、animation を変えない。
- `web/content/notes/*.md`: content と frontmatter schema を変えない。

---

### Task 1: page scaffold components を追加する

**Files:**

- Create: `web/src/components/site/PageScaffold.test.tsx`
- Create: `web/src/components/site/PageHero.tsx`
- Create: `web/src/components/site/PageSection.tsx`

- [ ] **Step 1: failing test を追加する**

Create `web/src/components/site/PageScaffold.test.tsx`:

```tsx
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
        action={<a href="/notes">すべて見る</a>}
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
```

- [ ] **Step 2: test が未実装で失敗することを確認する**

Run:

```bash
cd web
pnpm test -- src/components/site/PageScaffold.test.tsx
```

Expected:

```text
FAIL src/components/site/PageScaffold.test.tsx
Cannot find module './PageHero'
```

- [ ] **Step 3: `PageHero.tsx` を実装する**

Create `web/src/components/site/PageHero.tsx`:

```tsx
import type { ReactNode } from "react";

import homeStyles from "./home.module.css";

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
      ? `${homeStyles.hero} ${homeStyles.heroAbout}`
      : homeStyles.hero;

  return (
    <section className={className} aria-labelledby={labelledBy}>
      {title && (
        <h1 id={labelledBy} className={homeStyles.pageTitle}>
          {title}
        </h1>
      )}
      {children}
    </section>
  );
};
```

- [ ] **Step 4: `PageSection.tsx` を実装する**

Create `web/src/components/site/PageSection.tsx`:

```tsx
import type { ReactNode } from "react";

import homeStyles from "./home.module.css";

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
      className={homeStyles.section}
      aria-label={label}
      aria-labelledby={labelledBy}
    >
      {title && labelledBy && (
        <div className={homeStyles.sectionHeader}>
          <h2 id={labelledBy}>{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
};
```

- [ ] **Step 5: test が通ることを確認する**

Run:

```bash
cd web
pnpm test -- src/components/site/PageScaffold.test.tsx
```

Expected:

```text
Test Files  1 passed
Tests  4 passed
```

- [ ] **Step 6: commit**

```bash
git add web/src/components/site/PageHero.tsx web/src/components/site/PageSection.tsx web/src/components/site/PageScaffold.test.tsx
git commit -m "refactor(site): page scaffold component を追加"
```

### Task 2: Home / About / Notes pages を scaffold components に寄せる

**Files:**

- Modify: `web/src/app/page.tsx`
- Modify: `web/src/app/about/page.tsx`
- Modify: `web/src/app/notes/page.tsx`

- [ ] **Step 1: 既存 route の baseline を確認する**

Run:

```bash
cd web
pnpm test:e2e
```

Expected:

```text
4 passed
```

- [ ] **Step 2: Home page を `PageHero` / `PageSection` へ移行する**

Modify `web/src/app/page.tsx` to keep `socialLinks`, `getAllArticles`, and `NoteList` in the page while replacing only the repeated section scaffold:

```tsx
import Link from "next/link";

import { GitHubIcon, XIcon, ZennIcon } from "../components/icons/SocialIcons";
import homeStyles from "../components/site/home.module.css";
import { HomeIntro } from "../components/site/HomeIntro";
import navigationStyles from "../components/site/navigation.module.css";
import { NoteList } from "../components/site/NoteList";
import { PageHero } from "../components/site/PageHero";
import { PageSection } from "../components/site/PageSection";
import { SiteShell } from "../components/site/SiteShell";
import { getAllArticles } from "../lib/content";

const socialLinks = [
  {
    href: "https://github.com/yona3",
    label: "GitHub",
    icon: GitHubIcon,
  },
  {
    href: "https://x.com/yonah6g",
    label: "X",
    icon: XIcon,
  },
  {
    href: "https://zenn.dev/yonajs",
    label: "Zenn",
    icon: ZennIcon,
  },
];

export default async function HomePage() {
  const notes = await getAllArticles();
  const recentNotes = notes.slice(0, 5);
  const hasMoreNotes = notes.length > recentNotes.length;

  return (
    <SiteShell currentPage="home">
      <PageHero labelledBy="home-title">
        <HomeIntro />
        <p className={homeStyles.lead}>
          沖縄でソフトウェアエンジニアをしています 🌺
          <br />
          普段の業務では Web システムの開発に携わっています。
        </p>
        <p className={homeStyles.lead}>
          最近は AI Agent
          と一緒に開発すること、個人で小さな道具を作ることに時間を使っています。技術メモや日々の記録は
          Notes に書いています ✏️
        </p>
        <ul className={navigationStyles.socialLinks} aria-label="外部プロフィール">
          {socialLinks.map(({ href, label, icon: Icon }) => (
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
          ))}
        </ul>
      </PageHero>

      <PageSection
        action={
          hasMoreNotes && (
            <Link className={homeStyles.sectionLink} href="/notes">
              すべて見る
            </Link>
          )
        }
        labelledBy="recent-notes-title"
        title="Notes"
      >
        <NoteList notes={recentNotes} />
      </PageSection>
    </SiteShell>
  );
}
```

- [ ] **Step 3: About page を `PageHero` へ移行する**

Modify `web/src/app/about/page.tsx`:

```tsx
import type { Metadata } from "next";

import homeStyles from "../../components/site/home.module.css";
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
        <p className={homeStyles.lead}>
          こんにちは、Koh Yonamine です。
          <br />
          沖縄でソフトウェアエンジニアをしています 🌺
        </p>
      </PageHero>

      <section className={homeStyles.bodyText} aria-label="プロフィール">
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
```

- [ ] **Step 4: Notes page を `PageHero` / `PageSection` へ移行する**

Modify `web/src/app/notes/page.tsx`:

```tsx
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
```

- [ ] **Step 5: route smoke を確認する**

Run:

```bash
cd web
pnpm test:e2e
```

Expected:

```text
4 passed
```

- [ ] **Step 6: commit**

```bash
git add web/src/app/page.tsx web/src/app/about/page.tsx web/src/app/notes/page.tsx
git commit -m "refactor(site): page scaffold の利用境界を整理"
```

### Task 3: Note detail header を component 化する

**Files:**

- Create: `web/src/components/site/NoteArticleHeader.tsx`
- Create: `web/src/components/site/NoteArticleHeader.test.tsx`
- Modify: `web/src/app/notes/[slug]/page.tsx`

- [ ] **Step 1: failing test を追加する**

Create `web/src/components/site/NoteArticleHeader.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { NoteArticleHeader } from "./NoteArticleHeader";

describe("NoteArticleHeader", () => {
  it("renders date, article kind label, and title", () => {
    const markup = renderToStaticMarkup(
      <NoteArticleHeader
        article={{
          id: "site-renewal",
          slug: "site-renewal",
          title: "yona.dev をリニューアルしました",
          description: "サイト更新の記録。",
          publishedAt: "2026-04-26",
          kind: "note",
          isPublished: true,
          blocks: [],
        }}
      />,
    );

    expect(markup).toContain('<time dateTime="2026-04-26">2026.04.26</time>');
    expect(markup).toContain(">ノート</span>");
    expect(markup).toContain("<h1>yona.dev をリニューアルしました</h1>");
  });
});
```

- [ ] **Step 2: test が未実装で失敗することを確認する**

Run:

```bash
cd web
pnpm test -- src/components/site/NoteArticleHeader.test.tsx
```

Expected:

```text
FAIL src/components/site/NoteArticleHeader.test.tsx
Cannot find module './NoteArticleHeader'
```

- [ ] **Step 3: `NoteArticleHeader.tsx` を実装する**

Create `web/src/components/site/NoteArticleHeader.tsx`:

```tsx
import {
  type Article,
  articleKindLabels,
  formatArticleDate,
} from "../../lib/content";
import notesStyles from "./notes.module.css";

type Props = {
  article: Article;
};

export const NoteArticleHeader = ({ article }: Props) => {
  return (
    <>
      <div className={notesStyles.noteMeta}>
        <time dateTime={article.publishedAt}>
          {formatArticleDate(article.publishedAt)}
        </time>
        <span className={notesStyles.noteType}>
          {articleKindLabels[article.kind]}
        </span>
      </div>
      <h1>{article.title}</h1>
    </>
  );
};
```

- [ ] **Step 4: detail page を `NoteArticleHeader` へ移行する**

Modify `web/src/app/notes/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleContent } from "../../../components/site/ArticleContent";
import { NoteArticleHeader } from "../../../components/site/NoteArticleHeader";
import notesStyles from "../../../components/site/notes.module.css";
import { SiteShell } from "../../../components/site/SiteShell";
import { getArticleBySlug, getArticleSlugs } from "../../../lib/content";

type Params = {
  slug: string;
};

type Props = {
  params: Promise<Params>;
};

export const generateStaticParams = async (): Promise<Params[]> => {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Note not found | Koh Yonamine",
    };
  }

  return {
    title: `${article.title} | Koh Yonamine`,
    description: article.description,
    alternates: {
      canonical: `https://yona.dev/notes/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://yona.dev/notes/${article.slug}`,
      siteName: "yona.dev",
      type: "article",
    },
  };
};

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <SiteShell currentPage="notes">
      <article className={notesStyles.noteArticle}>
        <NoteArticleHeader article={article} />
        <ArticleContent blocks={article.blocks} />
        <div className={notesStyles.noteEnd} aria-hidden="true">
          * * *
        </div>
      </article>
    </SiteShell>
  );
}
```

- [ ] **Step 5: component test と route smoke を確認する**

Run:

```bash
cd web
pnpm test -- src/components/site/NoteArticleHeader.test.tsx
pnpm test:e2e
```

Expected:

```text
Test Files  1 passed
Tests  1 passed
4 passed
```

- [ ] **Step 6: commit**

```bash
git add web/src/components/site/NoteArticleHeader.tsx web/src/components/site/NoteArticleHeader.test.tsx 'web/src/app/notes/[slug]/page.tsx'
git commit -m "refactor(site): note detail header を分離"
```

### Task 4: 最終検証と review gate

**Files:**

- No code changes.

- [ ] **Step 1: unit / component tests を実行する**

Run:

```bash
cd web
pnpm test
```

Expected:

```text
Test Files  7 passed
Tests  28 passed
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
git diff 606059e..HEAD -- web/src/app web/src/components/site
```

Reviewer set:

- `contract-reviewer`: Superpowers plan と route/component 境界の整合。
- `app-reviewer`: Next.js App Router、server/client component 境界、metadata / redirect の維持。
- `ui-reviewer`: CSS 未変更、semantic markup、E2E で確認できる user-visible regression。

Expected:

```text
APPROVE
findings なし
```

If any reviewer returns a valid finding, fix only that finding, run `git diff --check`, `mise run verify`, and rerun the same reviewer set.

---

## Self-Review

- Spec coverage: Task B の対象である Home / About / Notes / Note detail の page composition と presentation component 境界を扱う。`/blog` redirect、`ContentSource`、CSS、content file は対象外として固定した。
- Placeholder scan: 該当なし。
- Type consistency: `PageHero`, `PageSection`, `NoteArticleHeader` の props は各 task の実装と利用例で一致している。
