# CLAUDE.md

Claude Code向けのプロジェクト設定ファイル

ユーザーへは日本語で答えてください。
コード中では、英語を使ってください。

## プロジェクト概要

yona.devの個人ホームページ・ブログサイト
- Next.js 15 (App Router)
- TypeScript (strict mode)  
- microCMS (ヘッドレスCMS)
- メインコードは`web/`ディレクトリ

## 開発コマンド

### 前提条件
- Node.js 18.18.0以上
- Yarn

### セットアップ・開発
```bash
cd web
yarn install           # 依存関係インストール
yarn dev              # 開発サーバー起動 (http://localhost:3000)
yarn build            # プロダクションビルド
yarn start            # プロダクションサーバー起動
```

### コード品質
```bash
yarn lint             # ESLint実行
yarn format           # Prettier + ESLint修正
```

### パフォーマンス分析
```bash
ANALYZE=true yarn build  # バンドル分析レポート生成
```

## アーキテクチャ

### フィーチャーベース階層アーキテクチャ
保守性・テスト性・拡張性を向上させるため

#### アーキテクチャ階層

**主要階層:**
- **App Layer** (`web/src/app/`) - Next.js App Router、ページとAPI Routes
- **Feature Layer** (`web/src/features/`) - 機能別モジュール（アプリケーションの中核）
- **Infrastructure Layer** (`web/src/infrastructure/`) - 外部API統合
- **Shared Layer** (`web/src/shared/`) - 共通機能

**補助階層:**
- **Service Layer** (`web/src/services/`) - 横断的ビジネスロジック
- **Repository Layer** (`web/src/repositories/`) - データアクセス抽象化
- **Interface Layer** (`web/src/interfaces/`) - 契約定義
- **Type Layer** (`web/src/types/`) - グローバル型定義
- **Library Layer** (`web/src/lib/`) - ユーティリティ関数
- **Example Layer** (`web/src/examples/`) - 使用例・サンプルコード

#### ディレクトリ構造
```
web/src/
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

#### アーキテクチャ原則
- 関心の分離：各層が明確な責任を持つ
- 依存性逆転：上位層は抽象に依存
- 機能独立性：機能間の疎結合

### 主要技術
- **Next.js 15** (App Router, React 19)
- **microCMS** (ヘッドレスCMS)
- **Tailwind CSS** (スタイリング)
- **TypeScript** (型安全性)
- **DOMPurify** (XSS対策)

### 技術的改善
- **Hydration最適化**: SSR/CSR一貫性保証、Image優先読み込み設定
- **Import Alias**: `@/*` パス設定による可読性・保守性向上
- **ESLint強化**: 関数ベース・アロー関数強制、相対パス禁止
- **セキュリティ強化**: DOMPurifyによる3段階コンテンツサニタイゼーション

## 環境設定

### 環境変数
`web/.env.local`ファイルを作成：

**必須:**
- `NEXT_PUBLIC_API_KEY` - microCMS APIキー

**オプション:**
- `GA_ID` - Google Analytics ID
- `ANALYZE` - バンドル分析フラグ

```bash
cd web
cp .env.example .env.local
```

## 開発ガイドライン

### コーディング規約
- **関数ベース**: クラスではなく関数を使用
- **アロー関数**: 可能な限りアロー関数を使用
- **機能分離**: 機能別にディレクトリを分ける
- **共通化**: 共通機能は`shared/`に配置

#### 強制ESLintルール
以下のルールでコード品質を保証：

**関数型プログラミング強制:**
- `no-restricted-syntax`: クラス定義を完全禁止
- `prefer-arrow-callback`: アロー関数を強制
- `func-style`: 関数式のみ許可

**インポート・エクスポート管理:**
- `simple-import-sort`: インポート順序の自動整理
- `@typescript-eslint/consistent-type-imports`: 型インポートの統一

**React特化ルール:**
- `react/jsx-handler-names`: イベントハンドラー命名規則
- `react/display-name`: コンポーネント名の明示
- `jsx-a11y/*`: アクセシビリティ強制

**TypeScript強化:**
- `@typescript-eslint/no-unused-vars`: 未使用変数の排除
- `@typescript-eslint/naming-convention`: 命名規則の統一

### セキュリティ
- DOMPurifyによるXSS対策
- 3段階のコンテンツサニタイゼーション
- サーバーサイドでの安全な処理

### パフォーマンス
- 静的生成（ISR）
- バンドル分析による最適化
- モバイルファースト設計

## 重要な開発ルール

### 機能ベース開発
- **機能分離**: `src/features/*/`内に機能別コードを配置
- **共通リソース**: `src/shared/`は横断的関心事のみ
- **インフラアクセス**: `src/infrastructure/`経由で外部API利用
- **関数ベース**: サービスはクラスではなく関数で実装

### ファイル配置ルール
- **新規コンポーネント**: `src/features/*/components/`
- **ビジネスロジック**: `src/features/*/services/`（関数）
- **共通ユーティリティ**: `src/shared/utils/`のみ
- **型定義**: 機能別は各フィーチャー内、グローバルは`src/types/`

### 開発原則
- **フィーチャーファースト**: 機能別のディレクトリ構造
- **関数ベース設計**: クラスではなく関数を使用
- **一貫したインポート**: `@/*` エイリアスの使用
- **型安全性**: TypeScript strict mode + ESLint強制

