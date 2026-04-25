この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的と全体像

`web/` の pnpm 管理依存を最新化し、`pnpm audit` で検出される既知脆弱性を解消または残リスクとして明示する。あわせて Next.js アプリの既存セキュリティ境界、特に `MICROCMS_API_KEY` の server-only 境界と blog body の sanitize 処理を弱めず、公開 route の挙動を保つ。

## 進捗

- [x] 2026-04-25 22:36+09:00 プロジェクト指示、README、依存ファイル、初期セキュリティ境界を確認した。
- [x] 2026-04-25 22:38+09:00 mise 実行環境を有効にして依存関係の現状を audit した。
- [x] 2026-04-25 22:40+09:00 `web/package.json` と `web/pnpm-lock.yaml` を必要範囲で更新した。
- [x] 2026-04-25 22:41+09:00 `postcss` override と共通 security headers を追加した。
- [x] 2026-04-25 22:43+09:00 `mise run verify` と audit 結果で受け入れ条件を確認した。

## 気づきと発見

Observation: 依存管理は root ではなく `web/` の pnpm が正本で、root の `mise` タスクから実行する契約になっている。
Evidence:
    AGENTS.md: アプリ本体は web/、依存管理は web/ の pnpm、最終検証は mise run verify。

Observation: 現在の shell 直下の Node.js は `v12.16.2` で、プロジェクト要件の Node.js 24.x を満たさない。
Evidence:
    Command: node --version
    Output: v12.16.2

Observation: mise config が未信頼のため、pnpm shim は現時点で実行できない。
Evidence:
    Command: pnpm --version
    Output: Config files in ~/project/personal/yona.dev/mise.toml are not trusted.

Observation: 初期 audit では 37 件の既知脆弱性があり、主因は `minimatch`、`dompurify`、`postcss`、`next` だった。
Evidence:
    Command: pnpm audit
    Output: 37 vulnerabilities found. Severity: 1 low | 22 moderate | 14 high.

Observation: direct dependencies を更新後も、`next@16.2.4` の transitive dependency として `postcss@8.4.31` が残った。
Evidence:
    Command: pnpm why postcss
    Output: next 16.2.4 -> postcss 8.4.31

Observation: `pnpm.overrides` 適用後、`next` 配下の `postcss` は patched version に解決された。
Evidence:
    Command: pnpm why postcss
    Output: next 16.2.4 -> postcss 8.5.10

Observation: 最終 audit は既知脆弱性 0 件になった。
Evidence:
    Command: pnpm audit
    Output: No known vulnerabilities found

Observation: Next.js build が TypeScript 6 / Next.js 16.2 の要件に合わせ、`web/tsconfig.json` の `moduleResolution` を `bundler` に更新した。
Evidence:
    Command: mise run verify
    Output: moduleResolution was set to bundler; lint and build finished successfully after the setting was updated.

Observation: `jsdom@29.0.2` の engine 要件は `^20.19.0 || ^22.13.0 || >=24.0.0` であり、旧 `web/package.json` の `>=20.x` より狭い。
Evidence:
    Command: rg -n "jsdom@29|engines:" web/pnpm-lock.yaml
    Output: jsdom@29.0.2 -> engines: {node: ^20.19.0 || ^22.13.0 || >=24.0.0}

## 判断記録

Decision: 依存更新と検証は root の `mise` タスク、または同じ mise 環境上の `pnpm` で実行する。
Rationale: 直接 `node` は古く、AGENTS.md が root `mise` タスクを正本としているため、同じ環境で install / audit / verify を揃える。
Date/Author: 2026-04-25 / Codex

Decision: major upgrade は package manager が解決できる最新版へ更新するが、公開 route、microCMS HTML 処理、server/client 境界の挙動変更は最小化する。
Rationale: ユーザー目的はパッケージ最新化とセキュリティ改善であり、機能変更や UI 変更は不要。破壊的な移行が必要な場合は検証結果で範囲を判断する。
Date/Author: 2026-04-25 / Codex

Decision: `eslint` と `@eslint/js` は 10 系ではなく 9.39.4 に固定する。
Rationale: `eslint-plugin-react@7.37.5` など現在の plugin が ESLint 10 を peer support しておらず、lint が `contextOrFilename.getFilename is not a function` で失敗したため。audit 解消と verify 成功を優先し、互換範囲の最新 9 系を採用する。
Date/Author: 2026-04-25 / Codex

Decision: `next@16.2.4` の transitive `postcss` は `pnpm.overrides` で `8.5.10` に寄せる。
Rationale: direct `postcss` 更新だけでは audit に GHSA-qx2v-qp2m-jg93 が残り、override で patched version に解決できたため。
Date/Author: 2026-04-25 / Codex

Decision: `web/package.json` と README の Node.js 要件を 24.x に狭める。
Rationale: resolved dependency の engine 要件を満たしつつ、Vercel の `engines.node` による Node.js version override が major version 指定を前提としているため。
Date/Author: 2026-04-25 / Codex

## 依存関係と契約

Dependency: `web/package.json`
Reason: 更新対象の direct dependencies / devDependencies と script 契約を持つ。
Contract: pnpm 管理を維持し、root `package.json` や別 lockfile を追加しない。

Dependency: `web/pnpm-lock.yaml`
Reason: 実際に解決された依存バージョンと transitive dependency のセキュリティ状態を固定する。
Contract: `pnpm install` または `pnpm update` による正規 lockfile 更新だけを行う。

Dependency: `web/src/lib/microcms.ts`
Reason: `MICROCMS_API_KEY` の server-only 境界を保持する必要がある。
Contract: secret を client component、`NEXT_PUBLIC_*`、ログ、HTML に露出しない。

Dependency: `web/src/app/blog/[articleId]/page.tsx`
Reason: microCMS HTML の sanitize と `dangerouslySetInnerHTML` の安全性に関わる。
Contract: sanitize → highlight → sanitize の防御を弱めない。

## 具体手順

1. mise config を信頼し、プロジェクトの Node.js / pnpm 環境を使える状態にする。

    Working directory:
        <repo-root>
    Command:
        mise trust
    Expected outcome:
        `mise run install` と `pnpm` が Node.js 24.x の環境で実行できる。

2. 現在の依存関係と脆弱性を確認する。

    Working directory:
        <repo-root>/web
    Command:
        pnpm outdated
        pnpm audit
    Expected outcome:
        更新対象と脆弱性の有無が分かる。

3. direct dependencies / devDependencies を最新版へ更新し、lockfile を再解決する。

    Working directory:
        <repo-root>/web
    Command:
        pnpm update --latest
    Expected outcome:
        `web/package.json` と `web/pnpm-lock.yaml` が更新される。

4. audit 結果またはコード確認で必要になったセキュリティ改善を実装する。

    Working directory:
        <repo-root>
    Command:
        rg で対象を特定し、必要最小限の file を修正する。
    Expected outcome:
        既知脆弱性または弱い security header / sanitize 設定などが改善される。

5. 最終検証を行う。

    Working directory:
        <repo-root>
    Command:
        mise run verify
        pnpm audit
    Expected outcome:
        lint と build が通り、audit が 0 件または残リスクが明示される。

## 検証と受け入れ条件

Input: `mise run verify`
Observe: lint と build が成功した。
Failure signal: ESLint error、TypeScript / Next.js build error、または環境変数不足以外の build 失敗。

Input: `pnpm audit`
Observe: `No known vulnerabilities found`。
Failure signal: direct update で解消可能な high / critical advisory が残る。

Input: セキュリティ境界確認
Observe: `MICROCMS_API_KEY` は `server-only` 境界内に残り、blog body の sanitize → highlight → sanitize は変更していない。`next.config.ts` に HSTS、nosniff、DENY frame、referrer policy、permissions policy を追加した。
Failure signal: secret が client に露出する、または未 sanitize HTML が `dangerouslySetInnerHTML` に渡る。

## 冪等性と復旧

1. pnpm の更新は `web/package.json` と `web/pnpm-lock.yaml` に限定し、再実行しても lockfile を再解決するだけにする。
2. 失敗時は command output の failure signal を読み、対象パッケージまたはコード変更を限定して修正する。
3. migration は想定しない。生成物 `.next/`、`node_modules/`、`.pnpm-store/` は編集・追跡しない。
4. セキュリティ改善は additive かつ検証可能な設定変更を優先する。
5. 完了後は dev server や一時プロセスを残さず、変更差分と未検証範囲を報告する。

## 未完了事項

ESLint 10 と `@eslint/js` 10 は、既存 ESLint plugin の peer compatibility が整うまで未採用。`pnpm outdated` はこの 2 件のみを表示する。

Change note: 2026-04-25 22:36+09:00 依存最新化とセキュリティ改善の実行計画を作成した。
Change note: 2026-04-25 22:43+09:00 依存更新、postcss override、security headers、verify/audit の結果を反映した。
Change note: 2026-04-25 22:55+09:00 review fix loop で Node.js engine 要件の不一致を修正した。
Change note: 2026-04-25 23:09+09:00 Vercel CI 向けに Node.js engine 要件を major version 指定へ修正した。
