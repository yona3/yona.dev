# yona.dev

Koh Yonamine の個人サイトです。Bookish Warm Minimal の方針で、技術記事、考えたことのノート、作業記録を `Notes` にまとめています。

## 必要要件

- Node.js 24.x
- pnpm
- [mise](https://mise.jdx.dev/)

## 開発コマンド

プロジェクトルートから `mise` タスクを使います。

```bash
mise install
mise run install
mise run dev
mise run lint
mise run build
mise run verify
```

アプリ本体は `web/` にあります。直接実行する場合:

```bash
cd web
pnpm install
pnpm dev
pnpm lint
pnpm build
```

この環境で dev server が Watchpack `EMFILE` を出す場合は、次で起動します。

```bash
WATCHPACK_POLLING=true mise run dev
```

## ページ構成

- `/`: 短い自己紹介と新着 Notes。
- `/about`: Koh Yonamine について。
- `/notes`: 投稿一覧。技術記事、ノート、記録を日付順で表示。
- `/notes/[slug]`: 投稿詳細。
- `/blog`, `/blog/[articleId]`: 旧導線。`/notes` へ redirect。

## コンテンツ管理

公開コンテンツの正本は `web/content/notes/*.md` です。Notion は執筆元として使い、手動または半自動 sync で repo 側の Markdown に反映する方針です。公開 runtime から Notion API は読みません。

frontmatter:

```yaml
title: AI Agent と開発するということ
slug: ai-agent-development
date: 2026-04-26
type: article
description: AI Agent と開発する体験についてのメモ。
published: true
```

`type` は次の 3 種類です。

| type | 表示 | 用途 |
| --- | --- | --- |
| `article` | 記事 | 一般的な技術記事 |
| `note` | ノート | 考えたことの断片 |
| `log` | 記録 | 作業ログ、開発メモ |

## デザイン

デザイン方針は [DESIGN.md](./DESIGN.md) が正本です。薄い紙色、sans-serif typography、細い罫線、日付順 feed を中心にした `Bookish Warm Minimal` を採用しています。

関連メモ:

- [docs/site-refresh.md](./docs/site-refresh.md)
- [docs/tech-stack.md](./docs/tech-stack.md)

## 技術スタック

| カテゴリ | 技術 |
| --- | --- |
| フレームワーク | Next.js 16 / App Router |
| 言語 | TypeScript |
| スタイリング | CSS Modules / CSS custom properties / next/font |
| コンテンツ | Markdown + frontmatter / ContentSource / ArticleBlock |
| 品質 | ESLint / Prettier / Vitest / Playwright |
| デプロイ | Vercel |

## 検証

意味のある変更後は root から次を実行します。

```bash
mise run verify
```

`mise run verify` は lint、unit test、build、E2E を順に実行する唯一の hard guard です。
