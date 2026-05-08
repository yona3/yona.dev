# 技術選定やり直し設計

## 背景

yona.dev は個人誌として、技術記事、ノート、作業記録を `Notes` に集約している。現在の公開コンテンツ正本は `web/content/notes/*.md` であり、公開 runtime から外部 CMS や Notion API は読まない。microCMS 依存は撤去済みで、`/blog` 系 route は `/notes` への redirect として残っている。

今回の目的は、CMS を将来自作する方向へ寄せながら、サイト本体の技術選定をやり直すことである。CMS 本体は今回作らない。当面は Markdown 正本を維持し、将来自作 CMS に差し替えられる境界、記事表現、styling、検証方針を先に固定する。

## 選定結論

第一段階では、次を採用する。

- フレームワーク: `Next.js` 維持
- デプロイ: `Vercel` 維持
- コンテンツ正本: `web/content/notes/*.md` 維持
- styling: `CSS Modules + CSS custom properties` に統一
- package manager / task runner: `pnpm` と `mise` 維持
- 検証: root の `mise run verify` 維持

第一段階では、次を主系統にしない。

- `Tailwind CSS`: 撤去済み。使っていない utility 系統を再導入しない
- `Astro`: すぐ移行せず、静的記事中心が続く場合の再評価枠に置く
- `Cloudflare Pages` / `Cloudflare Workers`: すぐ移行せず、Vercel 依存が問題になった時の再評価枠に置く
- `vanilla-extract` / `Panda CSS`: 今の規模では採用せず、複数 theme や管理画面込みの design system が必要になった時に再評価する

## 全体アーキテクチャ

設計の基準は「将来自作 CMS に差し替えられる個人サイト基盤」である。今すぐ CMS は作らず、当面は `web/content/notes/*.md` を正本にする。ただしアプリ側は Markdown ファイルを直接前提にせず、`ContentSource` 境界を通して `Article` と `ArticleBlock[]` を受け取る構造へ寄せる。

現行の流れは次の通り。

1. `MarkdownSource` が repo 内 Markdown と frontmatter を読む。
2. `MarkdownSource` が `Article` と `ArticleBlock[]` を返す。
3. route は `ContentSource` の公開関数だけを呼ぶ。
4. renderer は `ArticleBlock[]` を HTML / React component へ写像する。

将来は、`CustomCmsSource` が自作 CMS API を読み、同じ `Article` と `ArticleBlock[]` を返す。route と renderer は入力元を知らない。

## ContentSource contract

`ContentSource` は、最初から複雑な repository layer にしない。旧 `getAllNotes`, `getNoteBySlug`, `getNoteSlugs` に近い呼び出し口を保ち、入力元だけを閉じ込める。現行 route は `getAllArticles`, `getArticleBySlug`, `getArticleSlugs` を使い、旧 `lib/notes` は削除済みである。

想定する公開関数:

- `getAllArticles(): Promise<Article[]>`
- `getArticleBySlug(slug: string): Promise<Article | null>`
- `getArticleSlugs(): Promise<string[]>`

`Article` の最小構造:

- `id`
- `slug`
- `title`
- `description`
- `publishedAt`
- `updatedAt?`
- `kind`
- `heroImage?`
- `blocks`

`kind` は現行の `article`, `note`, `log` を維持し、表示名も `記事`, `ノート`, `記録` を維持する。

## ArticleBlock schema

本文は Markdown 文字列をそのまま renderer に渡さず、`ArticleBlock[]` へ変換する。旧 `MarkdownContent` は削除済みで、現行 renderer は `ArticleContent` である。

初期 block:

- `paragraph`
- `heading`
- `list`
- `quote`
- `code`
- `image`
- `callout`
- `linkCard`
- `gallery`

`callout`, `linkCard`, `gallery` は MDX 的な自由実行ではなく、将来自作 CMS の入力 UI でも扱える定型 block とする。現行 Markdown parser は `:::callout` を受け入れ、未知の `::` custom syntax は黙って崩さず build 時に失敗させる。

自作 CMS 側の仮 schema は、`articles` と `assets` を分ける。画像は `assetId`, `alt`, `width`, `height`, `blurData?` を持ち、記事 block は asset を参照する。CMS 実装時はこの schema に合わせて API を作れば、サイト側 renderer を大きく変えずに済む。

## Styling

スタイリングは `CSS Modules + CSS custom properties` に統一する。`Tailwind CSS` は主系統にせず、現行実装から撤去済みである。`@import "tailwindcss"`, `@theme`, `@tailwindcss/postcss`, `tailwindcss` 依存は使わない。`web/postcss.config.js` も削除済みで、CSS Modules と global CSS は `Next.js` 標準 CSS support で扱う。

CSS は旧 `site.module.css` から責務別に分割済みである。現行 module は次の通り。

- `layout.module.css`
- `home.module.css`
- `navigation.module.css`
- `notes.module.css`
- `article.module.css`
- `motion.module.css`

design token は `globals.css` の `:root` に集約する。色、font、spacing、radius、line-height は `DESIGN.md` と同期し、component CSS は token を参照する。記事 block の styling は `article.module.css` に閉じ、CMS 由来の block を受けても寸法、余白、caption、alt 表示が破綻しないようにする。

## フレームワークとデプロイ

第一段階では `Next.js` を維持する。現在の route、metadata、redirect、`next/font`、Vercel build がすでに機能しており、コンテンツ境界、記事 block、CSS 統一と同時に移すと検証範囲が広がりすぎるためである。

`Astro` は再評価枠に置く。再評価条件は次の通り。

- 公開ページが静的記事中心のまま
- CMS preview や認証付き編集 UI を同一 app に載せない
- React interaction が局所的
- Markdown / content collection 中心の開発体験を優先したい

デプロイは `Vercel` を維持する。`Cloudflare Pages` / `Cloudflare Workers` は比較枠に置く。Cloudflare 側も Next.js と Astro の選択肢を持つが、第一段階では adapter と runtime 差分を持ち込まない。

## 検証方針

検証の正本は root の `mise run verify` とする。意味のある変更ごとに `lint` と `build` を通す。

記事 renderer や block schema を触る段階では、まだ test runner を導入しない場合でも、`web/content/notes/test-blocks.md` を使って次を確認する。

- 見出し、段落、箇条書き、引用、コードが表示できる
- `image`, `callout`, `linkCard`, `gallery` の受け入れ条件が明示されている
- 未対応 block や未知 syntax は build 時に失敗する
- HTML を直接挿入しない
- slug、metadata、`/notes` route が壊れない

将来自作 CMS に備える検証は、`MarkdownSource` と将来の `CustomCmsSource` が同じ `Article` contract を返せることを中心に置く。

## 移行順序

実装は戻しやすい順に完了した。現行状態は次の通り。

1. `Tailwind CSS` 使用状況を確認し、`CSS Modules + CSS custom properties` 統一へ移行済み。
2. `site.module.css` を `layout`, `navigation`, `home`, `notes`, `article`, `motion` の責務別 module に分割済み。
3. `DESIGN.md` と `globals.css` の token を同期済み。
4. `ContentSource` 境界を作り、現行 route が境界経由で記事を読むように移行済み。
5. `Article` と `ArticleBlock[]` の最小 schema を導入済み。
6. 旧 Markdown renderer を削除し、`ArticleContent` の block renderer へ移行済み。
7. 自作 CMS の仮 schema と API 方向を `docs/tech-stack.md` に固定済み。
8. `Astro`, `Cloudflare`, 型付き styling の再評価条件を `docs/tech-stack.md` に記録済み。

## 外部参照

- Next.js は CSS Modules、Global CSS、Tailwind CSS など複数の styling 方法を公式に扱っている。現状の主実装が CSS Modules であるため、第一段階では CSS Modules 統一を選ぶ。
  - https://nextjs.org/docs/app/getting-started/css
- Next.js の `revalidateTag` は server 側で cache tag を再検証する API であり、将来自作 CMS の webhook と接続する余地がある。
  - https://nextjs.org/docs/app/api-reference/functions/revalidateTag
- Vercel は Next.js と ISR の運用を公式に支えているため、第一段階の deploy 先として維持する。
  - https://vercel.com/docs/frameworks/nextjs
  - https://vercel.com/docs/incremental-static-regeneration
- Astro は content-focused な site と Markdown / content collections に強い。静的記事中心が続く場合の再評価枠にする。
  - https://docs.astro.build/en/guides/markdown-content/
  - https://v6.docs.astro.build/en/guides/content-collections
- Cloudflare は Next.js / Astro の deploy 選択肢を持つ。第一段階では runtime / adapter 差分を避け、再評価枠に置く。
  - https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
  - https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

## 対象外

- 自作 CMS 本体の実装
- CMS 管理画面の UI 設計
- 外部 CMS の採用
- `Astro` への即時移行
- `Cloudflare` への即時移行
- test runner の即時導入
- MDX の自由実行導入

## 承認された判断

- 技術選定は CMS 以外も含めて包括的に見直す。
- CMS は将来自作する方向にする。
- 当面のコンテンツ正本は `web/content/notes/*.md` を維持する。
- `Next.js` / `Vercel` は白紙寄りに比較したうえで、第一段階では維持する。
- styling は `Tailwind CSS` と `CSS Modules` の併用をやめ、`CSS Modules + CSS custom properties` に統一する。
- 設計では design token、component 境界、記事 block 表現、将来自作 CMS の schema 方向まで仮決めする。
