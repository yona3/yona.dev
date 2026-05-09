# Dependency Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `web/` の依存関係を npm レジストリの安定版 `latest` へ更新し、`mise run verify` で検証する。

**Architecture:** 依存管理の変更は `web/package.json` と `web/pnpm-lock.yaml` に閉じる。`pnpm.overrides.postcss` は `Next.js` の推移的依存を確認したうえで維持または削除を決める。アプリコード、テストコード、`mise.toml` は検証失敗の根拠が出た時だけ触る。

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, ESLint, Vitest, Playwright, pnpm, mise.

---

## File Structure

**Modify**

- `web/package.json`: `dependencies` と `devDependencies` を安定版 `latest` へ更新し、`pnpm.overrides.postcss` の扱いを確定する。
- `web/pnpm-lock.yaml`: 更新後の依存解決を反映する。

**Modify only if verification proves it is required**

- `web/eslint.config.mjs`: `ESLint` または `typescript-eslint` 更新で既存設定が動かなくなった場合だけ修正する。
- `web/vitest.config.ts`: `Vitest` 更新で既存 test 設定が動かなくなった場合だけ修正する。
- `web/playwright.config.ts`: `Playwright` 更新で既存 E2E 設定が動かなくなった場合だけ修正する。
- `web/src/**`: `Next.js` / `React` 更新で既存 API の互換性問題が検証で出た場合だけ修正する。
- `mise.toml`: `verify` の実行入口そのものが依存更新で動かなくなった場合だけ修正する。

---

### Task 1: 実行環境を trust して現在状態を確認する

**Files:**

- Read: `mise.toml`
- Read: `web/package.json`
- Read: `web/pnpm-lock.yaml`

- [ ] **Step 1: 作業ツリーが空であることを確認する**

Run from repo root:

```bash
git status --short
```

Expected:

```text

```

If output is not empty, stop and classify the existing dirty files before continuing. Do not stage or overwrite unrelated files.

- [ ] **Step 2: `mise` trust 状態を確認する**

Run from repo root:

```bash
mise run install
```

Expected if trusted:

```text
pnpm install
```

Expected if not trusted:

```text
Config files in ~/.codex/worktrees/b6b0/yona.dev/mise.toml are not trusted.
```

- [ ] **Step 3: 未 trust の場合だけ trust する**

Run from repo root only if Step 2 reports the trust error:

```bash
mise trust
```

Expected:

```text
mise.toml trusted
```

If the exact output differs but the next `mise run install` starts `pnpm install`, continue.

- [ ] **Step 4: 依存導入が通ることを確認する**

Run from repo root:

```bash
mise run install
```

Expected:

```text
Done
```

If `pnpm install` succeeds with a different normal completion line, continue. If it fails because the package manager or Node runtime is broken, stop and report the command, stderr, and unresolved environment blocker.

---

### Task 2: 依存を安定版 `latest` へ一括更新する

**Files:**

- Modify: `web/package.json`
- Modify: `web/pnpm-lock.yaml`

- [ ] **Step 1: 更新対象の安定版 `latest` を確認する**

Run from `web/`:

```bash
pnpm view next version
pnpm view react version
pnpm view react-dom version
pnpm view @eslint/js version
pnpm view @next/bundle-analyzer version
pnpm view @next/eslint-plugin-next version
pnpm view @playwright/test version
pnpm view @types/node version
pnpm view @types/react version
pnpm view @typescript-eslint/eslint-plugin version
pnpm view @typescript-eslint/parser version
pnpm view eslint version
pnpm view eslint-config-next version
pnpm view eslint-config-prettier version
pnpm view eslint-plugin-import version
pnpm view eslint-plugin-jsx-a11y version
pnpm view eslint-plugin-react version
pnpm view eslint-plugin-react-hooks version
pnpm view eslint-plugin-simple-import-sort version
pnpm view globals version
pnpm view prettier version
pnpm view typescript version
pnpm view vitest version
```

Expected:

- Each command prints a stable semver version such as `16.2.6`.
- No printed version contains `alpha`, `beta`, `canary`, `rc`, or a hyphenated prerelease suffix.

- [ ] **Step 2: 対象依存を一括更新する**

Run from `web/`:

```bash
pnpm update --latest next react react-dom @eslint/js @next/bundle-analyzer @next/eslint-plugin-next @playwright/test @types/node @types/react @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-next eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-simple-import-sort globals prettier typescript vitest
```

Expected:

- `web/package.json` の対象依存 version range が安定版 `latest` に寄る。
- `web/pnpm-lock.yaml` が更新される。
- root `package.json` と `yarn.lock` は作成されない。

- [ ] **Step 3: root に生成物が増えていないことを確認する**

Run from repo root:

```bash
git status --short
```

Expected:

```text
 M web/package.json
 M web/pnpm-lock.yaml
```

If additional generated files such as `package.json`, `yarn.lock`, `.next/`, `node_modules/`, `.pnpm-store/`, or `tsconfig.tsbuildinfo` appear, do not commit them. Remove only generated files created by this task, then rerun this status check.

---

### Task 3: `postcss` override の扱いを確定する

**Files:**

- Modify: `web/package.json`
- Modify: `web/pnpm-lock.yaml`

- [ ] **Step 1: `Next.js` の `postcss` 依存を確認する**

Run from `web/`:

```bash
pnpm view next@latest dependencies.postcss
pnpm view postcss version
```

Expected on 2026-05-09:

```text
8.4.31
8.5.14
```

- [ ] **Step 2: `Next.js` が古い `postcss` を要求する場合は override を最新安定版へ更新する**

Run from `web/` if Step 1 shows `next@latest` still depends on a `postcss` version lower than the latest stable `postcss`:

```bash
pnpm pkg set pnpm.overrides.postcss=8.5.14
pnpm install
```

Expected:

- `web/package.json` contains:

```json
{
  "pnpm": {
    "overrides": {
      "postcss": "8.5.14"
    }
  }
}
```

- `web/pnpm-lock.yaml` contains:

```yaml
overrides:
  postcss: 8.5.14
```

- [ ] **Step 3: `Next.js` が最新安定版以上の `postcss` を要求する場合だけ override を削除する**

Run from `web/` only if Step 1 shows `next@latest` depends on the latest stable `postcss` version or a newer stable version:

```bash
pnpm pkg delete pnpm.overrides.postcss
pnpm install
```

Expected:

- `web/package.json` no longer has a `pnpm.overrides.postcss` entry.
- `web/pnpm-lock.yaml` no longer has a top-level `overrides.postcss` entry.

- [ ] **Step 4: override の結果を確認する**

Run from `web/`:

```bash
pnpm why postcss
```

Expected:

- If override was kept, output includes `postcss 8.5.14`.
- If override was deleted, output shows `next` resolving to the same stable version reported by `pnpm view postcss version`.

---

### Task 4: 検証して必要最小限だけ直す

**Files:**

- Modify only if required by failing evidence: `web/eslint.config.mjs`
- Modify only if required by failing evidence: `web/vitest.config.ts`
- Modify only if required by failing evidence: `web/playwright.config.ts`
- Modify only if required by failing evidence: `web/src/**`
- Modify only if required by failing evidence: `mise.toml`

- [ ] **Step 1: lint を単独で実行する**

Run from repo root:

```bash
mise run lint
```

Expected:

```text
No problems
```

If the exact success wording differs but the command exits `0`, continue.

- [ ] **Step 2: lint が失敗した場合の修正範囲を固定する**

Run from repo root if Step 1 fails:

```bash
mise run lint
```

Expected failure classification:

- Error mentions `eslint.config.mjs`, parser, plugin loading, or removed rule: inspect and modify `web/eslint.config.mjs`.
- Error mentions source code formatting, import order, or rule violation in `web/src/**`: make the smallest source change required by the rule.
- After the fix, rerun `mise run lint` and require exit `0`.

- [ ] **Step 3: unit test を単独で実行する**

Run from repo root:

```bash
mise run test
```

Expected:

```text
Test Files
```

and exit `0`.

- [ ] **Step 4: unit test が失敗した場合の修正範囲を固定する**

Run from repo root if Step 3 fails:

```bash
mise run test
```

Expected failure classification:

- Error mentions `vitest.config.ts`, transform, environment, or include pattern: inspect and modify `web/vitest.config.ts`.
- Error mentions `web/src/lib/content/**` or `web/src/components/**`: make the smallest code change that preserves the existing test expectation.
- After the fix, rerun `mise run test` and require exit `0`.

- [ ] **Step 5: build を単独で実行する**

Run from repo root:

```bash
mise run build
```

Expected:

```text
Compiled successfully
```

and exit `0`.

- [ ] **Step 6: build が失敗した場合の修正範囲を固定する**

Run from repo root if Step 5 fails:

```bash
mise run build
```

Expected failure classification:

- Error mentions App Router, metadata, `next/font`, server/client component boundary, or removed `Next.js` API: inspect the named `web/src/app/**` or `web/src/components/**` file and make the smallest compatibility fix.
- Error mentions missing environment variables: do not change code unless the dependency update caused a new runtime requirement. Record the missing variable and mark build as environment-blocked.
- After a code fix, rerun `mise run build` and require exit `0`.

- [ ] **Step 7: E2E を単独で実行する**

Run from repo root:

```bash
mise run test:e2e
```

Expected:

```text
passed
```

and exit `0`.

- [ ] **Step 8: E2E が失敗した場合の修正範囲を固定する**

Run from repo root if Step 7 fails:

```bash
mise run test:e2e
```

Expected failure classification:

- Error mentions browser executable not installed: record as an environment blocker and do not change app code.
- Error mentions `playwright.config.ts`, server startup, port, or webServer: inspect and modify `web/playwright.config.ts`.
- Error mentions route output, redirect, or locator mismatch: inspect the named route/component and make the smallest compatibility fix.
- After a code or config fix, rerun `mise run test:e2e` and require exit `0`.

---

### Task 5: 最終検証と commit

**Files:**

- Modify: `web/package.json`
- Modify: `web/pnpm-lock.yaml`
- Modify only if required by Task 4: files named by failing evidence

- [ ] **Step 1: 最終 hard guard を実行する**

Run from repo root:

```bash
mise run verify
```

Expected:

- `pnpm lint` exits `0`.
- `pnpm test` exits `0`.
- `pnpm build` exits `0`.
- `pnpm test:e2e` exits `0`.

If an environment blocker prevents completion, record the exact failing command, the reason, and which verification stages did not run.

- [ ] **Step 2: 差分が対象範囲に閉じていることを確認する**

Run from repo root:

```bash
git status --short
git diff --name-only
```

Expected:

```text
web/package.json
web/pnpm-lock.yaml
```

If Task 4 required compatibility fixes, the output may also include the specific config or source files changed for that failing evidence. No root `package.json`, `yarn.lock`, generated directory, secret file, or unrelated docs file should appear.

- [ ] **Step 3: prerelease が入っていないことを確認する**

Run from `web/`:

```bash
pnpm list --depth 0 --json
```

Expected:

- Direct dependency versions do not include `alpha`, `beta`, `canary`, `rc`, or a hyphenated prerelease suffix.

- [ ] **Step 4: 依存更新を commit する**

Use the `commit` skill. Target files are the files confirmed in Step 2.

Candidate message if only dependencies changed:

```text
chore(deps): 依存関係を最新安定版へ更新
```

Candidate message if compatibility fixes were also required:

```text
chore(deps): 依存更新に伴う互換性を調整
```

Expected:

- Commit includes only dependency update files and required compatibility fixes.
- Final report includes `mise run verify` result, `postcss` override decision, and any environment blocker if present.
