# 技術スタック

この文書は yona.dev の現在の技術選定を固定する。実装の詳細な行動契約は `AGENTS.md`、デザイン方針は `DESIGN.md`、個別 task の判断履歴は `docs/superpowers/specs/` と `docs/superpowers/plans/` を参照する。

## 採用

- `Next.js 16 App Router`: route、metadata、redirect、`next/font`、Vercel build の現行実装を維持する。
- `React 19`: App Router 上の component 実装として維持する。
- `TypeScript`: article contract、renderer、route の型境界を固定する。
- `Vercel`: 第一段階の deploy 先として維持する。
- `pnpm`: `web/` の package manager として維持する。
- `mise`: root task の実行入口として維持する。最終検証は `mise run verify` を正本にする。
- `web/content/notes/*.md`: 当面の公開コンテンツ正本として維持する。
- `ContentSource`: route と renderer から入力元を隠す境界として採用する。
- `Article` / `ArticleBlock[]`: Markdown と将来自作 CMS の共通記事表現として採用する。
- `CSS Modules + CSS custom properties`: styling の主系統として採用する。
- `Next.js` 標準 CSS support: CSS Modules と global CSS の処理に使う。追加の `web/postcss.config.js` は持たない。

## 現行境界

- `web/src/lib/content/frontmatter.ts`: frontmatter の抽出と validation。
- `web/src/lib/content/markdown-article.ts`: Markdown source から `Article` への組み立て、公開 filter、日付降順 sort。
- `web/src/lib/content/markdown-source.ts`: file system access、React `cache`、`ContentSource` adapter。
- `web/src/components/site/PageHero.tsx` / `PageSection.tsx`: Home / About / Notes の page scaffold。
- `web/src/components/site/NoteArticleHeader.tsx`: Notes detail の metadata と title 表示。
- `web/src/components/site/page.module.css`: page scaffold 用 styling。
- `web/src/components/site/home.module.css`: Home intro、speech bubble、hedgehog 用 styling。

## 非採用

- `Tailwind CSS`: 撤去済み。utility class、`@import "tailwindcss"`、`@theme`、`@tailwindcss/postcss`、`tailwindcss` 依存は使わない。
- `Astro`: 第一段階では移行しない。静的記事中心の状態が続く時の再評価枠に置く。
- `Cloudflare Pages` / `Cloudflare Workers`: 第一段階では移行しない。Vercel 運用が制約になった時の再評価枠に置く。
- `vanilla-extract` / `Panda CSS`: 今の規模では採用しない。複数 theme や管理画面込みの design system が必要になった時に再評価する。
- `MDX` の自由実行: 記事本文では採用しない。CMS 入力 UI でも扱える定型 `ArticleBlock` を優先する。
- 外部 CMS: 第一段階では採用しない。公開 runtime から Notion API や外部 CMS API は読まない。

## 再評価条件

### `Next.js` / `Vercel`

次の条件が重なった時に、`Astro` や `Cloudflare` への移行を再評価する。

- 公開ページが静的記事中心のまま増える。
- CMS preview や認証付き編集 UI を同一 app に載せない。
- React interaction が Home の小さな演出など局所的な範囲に留まる。
- build 時間、料金、runtime 制約、adapter 差分のいずれかが運用上の問題になる。

### styling

次の条件が出た時に、型付き styling や design system tooling を再評価する。

- 管理画面や複数 theme が追加され、CSS Modules の責務分割だけでは token の追跡が難しくなる。
- component 数が増え、variant 管理や状態別 styling が重複する。
- runtime token を静的に検査する必要が出る。

### CMS

次の条件が出た時に、自作 CMS の実装を別 task として開始する。

- Markdown file 編集では下書き、preview、画像管理、公開予約の運用がつらくなる。
- 記事 block を UI から編集したくなる。
- webhook による `revalidateTag` 連携が必要になる。
- asset metadata と article metadata を永続化して検索や一覧管理に使いたくなる。

## 自作 CMS 仮 schema

サイト側 renderer は `Article` と `ArticleBlock[]` だけを読む。CMS 側は次の仮 schema を満たせば、route と renderer を大きく変えずに差し替えられる。

```ts
type CmsArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  kind: "article" | "note" | "log";
  heroAssetId?: string;
  isPublished: boolean;
  blocks: CmsArticleBlock[];
};

type CmsAsset = {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurData?: string;
};

type CmsArticleBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "code"; code: string; language?: string }
  | { kind: "image"; assetId: string; caption?: string }
  | { kind: "callout"; tone: "note" | "warning"; text: string }
  | { kind: "linkCard"; title: string; url: string; description?: string }
  | { kind: "gallery"; assetIds: string[] };
```

`CmsArticle.kind` は現行の `article`、`note`、`log` を維持する。画像 block は本文に URL を直接埋め込まず、`assetId` で `CmsAsset` を参照する。サイト側の `ContentSource` 実装は、この schema を `Article` / `ArticleBlock[]` へ変換して返す。
