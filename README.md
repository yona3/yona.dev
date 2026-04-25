# yona.dev

Next.js 16（App Router）、TypeScript、microCMS で構築された個人ホームページ兼ブログサイトです。

## 必要要件

- Node.js `^20.19.0 || ^22.13.0 || >=24.0.0`
- pnpm パッケージマネージャー
- [mise](https://mise.jdx.dev/)（推奨、タスクランナーとして利用）

## 開発コマンド

### mise タスク（推奨）

プロジェクトルートから [mise](https://mise.jdx.dev/) を使って実行できます。

```bash
mise install              # 必要なランタイムのセットアップ
mise run install          # 依存パッケージのインストール
mise run dev              # 開発サーバーの起動（http://localhost:3000）
mise run build            # プロダクションビルド
mise run start            # プロダクションサーバーの起動
mise run lint             # ESLint による静的解析
mise run format           # Prettier によるコード整形と lint 修正
mise run verify           # lint + build を順次実行
mise tasks                # 全タスクの一覧表示
```

### pnpm 直接実行

```bash
cd web
pnpm install          # 依存パッケージのインストール
pnpm dev              # 開発サーバーの起動（http://localhost:3000）
pnpm build            # プロダクションビルド
pnpm start            # プロダクションサーバーの起動
pnpm lint             # ESLint による静的解析
pnpm format           # Prettier によるコード整形と lint 修正
ANALYZE=true pnpm build  # バンドル分析レポート付きビルド
```

## アーキテクチャ

### ディレクトリ構成

```
web/src/
├── app/                          # Next.js App Router（ファイルベースルーティング）
│   ├── layout.tsx                #   ルートレイアウト（メタデータ、GA、フォント設定）
│   ├── page.tsx                  #   トップページ
│   ├── blog/
│   │   ├── page.tsx              #   ブログ一覧（ISR: 60秒）
│   │   └── [articleId]/
│   │       ├── page.tsx          #   記事詳細（SSG + ISR）
│   │       └── page.module.css   #   記事コンテンツ用スタイル
│   └── api/health/route.ts       #   ヘルスチェック API
├── components/
│   ├── shared/                   #   共通コンポーネント
│   │   ├── Layout.tsx            #     ページレイアウト（Header + Footer + main）
│   │   ├── Header.tsx            #     ヘッダー（パスに応じて yona.dev / yona.blog 切替）
│   │   ├── Footer.tsx            #     フッター（コピーライト）
│   │   ├── Article.tsx           #     記事カード
│   │   ├── Author.tsx            #     著者情報カード
│   │   ├── ShareButtons.tsx      #     SNS シェアボタン（LINE, Twitter, はてな）
│   │   ├── MyLinks.tsx           #     ソーシャルリンク一覧
│   │   └── SectionLayout.tsx     #     セクション用ラッパー
│   ├── icons/                    #   SVG アイコン（GitHub, Twitter, Zenn）
│   ├── Top.tsx                   #   トップページコンポーネント
│   ├── About.tsx                 #   自己紹介セクション
│   ├── Works.tsx                 #   ポートフォリオ一覧
│   └── WorkItem.tsx              #   ポートフォリオ個別項目
├── features/
│   └── profile/                  #   プロフィール機能モジュール
│       ├── components/
│       │   └── ProfileSection.tsx
│       └── types/index.ts        #     Like, ProfileData, ProfileProps 型
├── constants/
│   ├── works.ts                  #   ポートフォリオ作品データ
│   ├── links.ts                  #   ソーシャルリンク（GitHub, Twitter, Zenn）
│   └── like.ts                   #   趣味・好きなものリスト
├── lib/
│   ├── microcms.ts               #   microCMS クライアント設定
│   └── day.ts                    #   日付フォーマット（dayjs）
├── utils/
│   ├── age.ts                    #   年齢・大学年次の動的計算
│   ├── gtag.ts                   #   Google Analytics（pageview, event）
│   └── generateOGP.ts            #   OGP 画像 URL 生成
├── types/index.ts                #   Content, Tag, GtagEvent 型定義
├── hooks/usePageView.ts          #   ページビュー追跡フック
└── styles/globals.css            #   グローバルスタイル
```

### 主要技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 16（App Router / React 19） |
| 言語 | TypeScript 5.9（strict モード、ES2022 ターゲット） |
| コンテンツ管理 | microCMS（ヘッドレス CMS） |
| スタイリング | Tailwind CSS 4 + CSS Modules + next/font（Noto Sans JP） |
| コードハイライト | highlight.js |
| HTML パース | cheerio |
| 日付処理 | dayjs |
| SNS シェア | react-share（LINE, Twitter, はてなブックマーク） |
| セキュリティ | DOMPurify + jsdom（サーバーサイド XSS 対策） |
| コード品質 | ESLint 9（78+ ルール）、Prettier |
| バンドル分析 | @next/bundle-analyzer |
| デプロイ | Vercel |

## コンテンツ管理

### microCMS 連携

- API クライアント: `src/lib/microcms.ts`（サービスドメイン: `yona-home-page`）
- コンテンツ型定義: `src/types/index.ts`（Content, Tag）
- ブログ一覧はページネーション取得、記事詳細は SSG + ISR（60秒）

### 環境変数

| 変数名 | 説明 | 必須 |
|---|---|---|
| `MICROCMS_API_KEY` | microCMS API キー（サーバー専用） | はい |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics トラッキング ID | いいえ |
| `ANALYZE` | バンドル分析の有効化（`"true"` を設定） | いいえ |

環境変数ファイル: `.env.local`（gitignore 対象）

## ページ構成

### トップページ（`/`）

プロフィール（アイコン、名前、ソーシャルリンク）、自己紹介（年齢・大学年次は動的計算）、ポートフォリオ作品一覧を表示。

### ブログ一覧（`/blog`）

microCMS から記事を公開日順にページネーション取得して一覧表示。ISR により 60 秒ごとに再検証。

### 記事詳細（`/blog/[articleId]`）

- SSG + ISR（60秒）
- highlight.js によるシンタックスハイライト
- 3 段階 XSS サニタイズ処理
- OGP 画像の動的生成（microCMS 画像 API + base64url）
- タグ表示、前後記事ナビゲーション
- SNS シェアボタン（LINE, Twitter, はてなブックマーク）
- 著者情報カード

## セキュリティ

### 3 段階サニタイズ処理

DOMPurify + JSDOM によるサーバーサイドサニタイズを実装。

1. **初期サニタイズ**: microCMS から取得した生コンテンツをサニタイズ
2. **ハイライト後サニタイズ**: highlight.js 出力を `span` タグ許可付きでサニタイズ
3. **最終サニタイズ**: 処理済み HTML 全体を再度サニタイズ

**許可タグ**: `p`, `br`, `strong`, `em`, `u`, `h1`-`h6`, `ul`, `ol`, `li`, `blockquote`, `a`, `img`, `pre`, `code`, `span`, `div`, `table` 関連

**禁止タグ**: `script`, `object`, `embed`, `form`, `input`, `iframe`

## パフォーマンスと設定

### Next.js 設定（`next.config.ts`）

- microCMS アセット用の画像最適化（`images.microcms-assets.io`）
- パッケージインポート最適化（react-share, highlight.js, cheerio, dayjs）
- `X-Powered-By` ヘッダーの無効化
- gzip 圧縮有効、プロダクションソースマップ無効
- 環境変数 `ANALYZE=true` で webpack-bundle-analyzer 有効化

### コード品質基準

- TypeScript strict モード + strictNullChecks
- パスエイリアス: `@/*` → `src/*`
- ESLint 78+ ルール:
  - `func-style`: 関数式を強制
  - `no-restricted-syntax`: enum 使用禁止
  - `@typescript-eslint/naming-convention`: PascalCase（型）、camelCase（プロパティ）、`is`/`has`/`should` プレフィックス（boolean）
  - `simple-import-sort`: インポート自動ソート
  - `jsx-a11y`: アクセシビリティチェック
  - `react/jsx-handler-names`: イベントハンドラ命名規則
- Prettier: セミコロン必須、ダブルクォート使用

### スタイリング方針

- Tailwind CSS 4（ダークテーマ: gray-900 背景）
- next/font による Noto Sans JP 最適化読み込み（300, 400, 500, 700）
- モバイルファーストのレスポンシブデザイン
- 記事コンテンツは CSS Modules（`page.module.css`）で専用スタイリング
