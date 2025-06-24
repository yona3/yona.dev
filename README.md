# yona.dev

個人ホームページとブログサイトです。

## 技術スタック

- **Next.js 15** (App Router, React 19)
- **TypeScript** (strict mode)
- **Tailwind CSS** (ダークテーマ)
- **microCMS** (ヘッドレスCMS)

## 開発環境

### 前提条件
- Node.js 18.18.0以上
- Yarn

### セットアップ
```bash
cd web
cp .env.example .env.local  # 環境変数ファイルを作成
yarn install                # 依存関係をインストール
yarn dev                   # 開発サーバー起動
```

### 環境変数
- `NEXT_PUBLIC_API_KEY` - microCMS APIキー（必須）
- `GA_ID` - Google Analytics ID（オプション）

## コマンド

```bash
yarn dev     # 開発サーバー
yarn build   # プロダクションビルド
yarn start   # プロダクションサーバー
yarn lint    # コード品質チェック
yarn format  # コード整形
```

## アーキテクチャ

### フィーチャーベース階層アーキテクチャ

```
src/
├── app/           # Next.js App Router
│   ├── api/       # API Routes
│   ├── blog/      # ブログページ
│   └── test/      # テストページ
├── features/      # 機能別モジュール
│   ├── blog/      # ブログ機能
│   ├── portfolio/ # ポートフォリオ機能
│   └── profile/   # プロフィール機能
├── shared/        # 共通コンポーネント・ユーティリティ
├── infrastructure/ # 外部API統合
├── interfaces/    # インターフェース定義
├── lib/          # ライブラリ関数
├── repositories/ # データアクセス層
├── services/     # ビジネスロジック層
├── types/        # グローバル型定義
└── examples/     # 使用例・サンプルコード
```

### 主な機能

#### コア機能
- **ブログシステム**: microCMSによるコンテンツ管理、記事詳細、前後記事ナビゲーション
- **ポートフォリオ**: プロジェクト一覧表示、作品詳細
- **プロフィール**: 個人情報、SNSリンク、年齢の自動計算

#### API・インフラ
- **Health Check API** (`/api/health`): システム監視用エンドポイント
- **Analytics統合**: Google Analytics対応
- **OGP生成**: 動的OG画像生成

#### 開発・品質
- **TypeScript**: 厳格な型チェック
- **ESLint**: 関数ベース・アロー関数強制ルール
- **Import Alias**: `@/*` パス設定
- **Examples**: 使用例とサンプルコード

#### セキュリティ・パフォーマンス
- **XSS対策**: DOMPurifyによるサニタイゼーション
- **SSR/SSG**: 静的生成とサーバーサイドレンダリング
- **Hydration最適化**: SSR/CSR一貫性保証

## 開発ガイドライン

- クラスベースではなく関数ベースで実装
- 可能な限りアロー関数を使用
- 機能別ディレクトリに分離
- 共通機能は`shared/`に配置