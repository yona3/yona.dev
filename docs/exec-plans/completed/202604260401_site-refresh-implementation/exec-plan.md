この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

yona.dev を `DESIGN.md` / `docs/site-refresh.md` / `/demo/site-refresh` の方向性で本番刷新する。変更後、ユーザーは `/` で Bookish Warm Minimal の個人誌型 Home を見られ、`/about` でプロフィールを読め、`/notes` と `/notes/[slug]` でローカル Markdown 由来の投稿を読める。既存 microCMS 依存は外し、`MICROCMS_API_KEY` がなくても build できる状態にする。

## 進捗

- [x] 2026-04-26 04:01+09:00 ユーザー承認、デザイン文書、デモ route、既存 microCMS route を確認した。
- [x] 2026-04-26 04:01+09:00 実装用 branch `codex/site-refresh-notes` を作成し、現在の docs/demo 差分を保持する。
- [x] 2026-04-26 04:01+09:00 ローカル Markdown content と note loader を追加する。
- [x] 2026-04-26 04:01+09:00 `/`, `/about`, `/notes`, `/notes/[slug]` を本番 UI として実装する。
- [x] 2026-04-26 04:01+09:00 旧 `/blog` route を `/notes` へ移し、microCMS 依存コードと依存 package を削除する。
- [x] 2026-04-26 04:01+09:00 `mise run verify` とブラウザ表示確認を行い、初回 review fix loop の採用 finding を修正する。
- [x] 2026-04-26 04:01+09:00 同じ reviewer set で再 review し、残件を確認する。
- [ ] 2026-04-26 04:01+09:00 stage / commit / PR 作成 / CI fix まで進める。

## 発見

観測: 現在の worktree は detached HEAD で、`DESIGN.md`、`docs/site-refresh.md`、デモ route、完了済み ExecPlan 2 件が未コミット差分として存在する。
根拠:
    `git status --short --branch` は `## HEAD (no branch)` と上記 untracked files を表示した。

観測: 既存 `/blog` は `web/src/lib/microcms.ts` に依存しており、`MICROCMS_API_KEY` が未設定だと build 時に `/blog` の page data collection で失敗する。
根拠:
    前タスクの `mise run verify` が `MICROCMS_API_KEY is not set` / `Failed to collect page data for /blog` で失敗した。`web/src/app/blog/page.tsx` と `web/src/app/blog/[articleId]/page.tsx` は `microcms` を import している。

観測: 既存 root layout は `<head>` 内に whitespace/comment を含み、dev browser で hydration warning を出していた。
根拠:
    dev server 出力に `In HTML, whitespace text nodes cannot be a child of <head>` と `RootLayout src/app/layout.tsx:62` が表示された。

観測: 通常 `mise run dev` はこの環境で Watchpack `EMFILE` を出し、dev manifest が壊れて全 route が 404 になる場合がある。`WATCHPACK_POLLING=true mise run dev` では `/demo/site-refresh` が HTTP 200 を返した。
根拠:
    `curl -I --max-time 20 http://localhost:3000/demo/site-refresh` が polling 起動時に `HTTP/1.1 200 OK` を返した。

観測: microCMS 依存削除後、`mise run lint` と `mise run verify` は成功した。build output は `/`, `/about`, `/notes`, `/notes/[slug]`, `/demo/site-refresh`, `/blog`, `/blog/[articleId]` を含んだ。
根拠:
    `mise run verify` が `pnpm exec lint-staged --no-stash`, `pnpm run lint`, `pnpm run build` を完了した。

観測: ブラウザ確認では `/`, `/about`, `/notes`, `/notes/ai-agent-development` が desktop/mobile で表示でき、`/blog/old-article` は `/notes` へ redirect した。
根拠:
    `WATCHPACK_POLLING=true mise run dev` 上で Playwright を使い、主要 route の heading、一覧、本文、redirect URL を確認した。

観測: 初回 review cycle は `contract-reviewer`, `app-reviewer`, `security-reviewer`, `ui-reviewer`, `ce-reviewer` の 5 reviewer で実行し、採用 finding は ExecPlan 更新、review skill の microCMS 前提、Notion/Markdown 方針、UI contrast/landmark/long text handling だった。
根拠:
    `/tmp/yona-review-contract.txt`, `/tmp/yona-review-app.txt`, `/tmp/yona-review-security.txt`, `/tmp/yona-review-ui.txt`, `/tmp/yona-review-ce.txt` を集約し、採用 finding だけを修正した。

観測: 修正後の guard は成功した。`git diff --check`、`mise run lint`、`mise run verify` が通り、Playwright の desktop/mobile route check では `/`, `/about`, `/notes`, `/notes/ai-agent-development`, `/demo/site-refresh` が HTTP 200、`/blog/old-article` が `/notes` へ redirect した。dev server は停止し、`web/next-env.d.ts` の生成的差分も戻した。
根拠:
    `mise run verify` は build まで完了し、Playwright の結果は各 route の `status: 200`、`mainCount: 1`、`consoleErrors: []` を返した。`lsof -nP -iTCP:3000 -sTCP:LISTEN` は停止後に listener なしだった。

観測: fix-loop 再 review は `contract-reviewer`, `app-reviewer`, `security-reviewer`, `ui-reviewer`, `ce-reviewer` の同じ 5 reviewer で実行した。`contract-reviewer`, `app-reviewer`, `security-reviewer`, `ui-reviewer` は APPROVE。`ce-reviewer` は REQUEST_CHANGES として `docs/skills/exec-plan/SKILL.md` の旧 `microCMS / ISR` 前提と、この ExecPlan の guard/reviewer 記録不足を指摘したため採用して修正した。
根拠:
    `/tmp/yona-review-contract-cycle2.txt`, `/tmp/yona-review-app-cycle2.txt`, `/tmp/yona-review-security-cycle2.txt`, `/tmp/yona-review-ui-cycle2.txt`, `/tmp/yona-review-ce-cycle2.txt` を集約した。

変更記録: 2026-04-26 05:38+09:00 `ce-reviewer` follow-up の verdict 明記指摘を反映した。

## 判断

判断: 公開正本は `web/content/notes/*.md` の Markdown + frontmatter とし、Notion sync はこの task では実装しない。
理由: ユーザーは Notion を A: 執筆元として手動/半自動で repo に同期する方針を選んだ。最初の本番刷新では公開 runtime から Notion API を読まず、repo 内 content を static build できる状態を優先する。
日付/担当: 2026-04-26 / Codex

判断: 旧 `/blog` と `/blog/[articleId]` は `/notes` に redirect し、既存 microCMS 記事は移行しない。
理由: ユーザーは既存記事を残さなくてよいと確認済み。404 より redirect の方が既存導線の破断が小さく、microCMS 依存を外せる。
日付/担当: 2026-04-26 / Codex

判断: Markdown rendering は最初は限定的な React renderer で実装し、`dangerouslySetInnerHTML` は使わない。
理由: repo 内 Markdown は公開正本だが、刷新直後は見出し、段落、箇条書き、コード程度を扱えれば足りる。HTML sanitization pipeline を再導入せず、XSS surface を小さくする。
日付/担当: 2026-04-26 / Codex

判断: PR 作成まで進める。ただし実装前にこの ExecPlan を作成し、承認 scope としてこの plan を記録する。
理由: ユーザーが `exec-plan` skill を明示し、「この方向性で刷新を進めます」と承認したため。skill の既定範囲に従い、stage / commit / PR / CI fix を含める。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `AGENTS.md`, `README.md`, `docs/conventions.md`, `docs/skills/review/SKILL.md`, `DESIGN.md`, `docs/site-refresh.md`, `web/src/app/layout.tsx`, `web/src/app/page.tsx`, `web/src/app/about/page.tsx`, `web/src/app/demo/site-refresh/`, `web/src/app/notes/page.tsx`, `web/src/app/notes/[slug]/page.tsx`, `web/src/lib/notes.ts`, `web/content/notes/`
依存理由: デザイン方針、情報設計、公開 route、ローカル content loader が刷新の中心であるため。
契約: `MICROCMS_API_KEY` を client component、HTML、log、metadata に出さない。最終状態では microCMS client 自体を削除する。
契約: 既存 microCMS HTML の sanitize → highlight → sanitize pipeline は弱めない。今回は旧 pipeline を新 route に流用せず、旧 blog route を redirect に置き換える。
契約: root `package.json` / `yarn.lock` は復活させない。依存管理は `web/` の `pnpm` を使う。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo` は編集・追跡しない。Next dev が `web/next-env.d.ts` を dev 用に書き換えた場合は生成的副作用として差分から戻す。
契約: Notion API token、Notion database schema、sync automation はこの task では実装しない。

## 実行計画

1. 実装用 branch を作成する。

    作業場所:
        <repo-root>
    実行:
        git switch -c codex/site-refresh-notes
    期待結果:
        detached HEAD ではなく、PR 作成可能な branch 上で作業する。

2. ローカル Markdown content と note loader を追加する。

    作業場所:
        <repo-root>
    実行:
        `web/content/notes/*.md`、`web/src/lib/notes.ts`、必要な note rendering component を追加する。
    期待結果:
        `article` / `note` / `log` を `記事` / `ノート` / `記録` として扱い、公開済み note を日付降順で取得できる。

3. 本番 route を刷新する。

    作業場所:
        <repo-root>
    実行:
        `web/src/app/page.tsx`, `web/src/app/about/page.tsx`, `web/src/app/notes/page.tsx`, `web/src/app/notes/[slug]/page.tsx`, shared CSS/components を実装する。
    期待結果:
        `/`, `/about`, `/notes`, `/notes/[slug]` が Bookish Warm Minimal の UI として描画される。

4. 旧 blog と microCMS 依存を外す。

    作業場所:
        <repo-root>
    実行:
        `/blog` と `/blog/[articleId]` を `/notes` redirect に置き換え、`web/src/lib/microcms.ts` と不要 dependency を削除する。
    期待結果:
        `MICROCMS_API_KEY` 未設定でも `mise run verify` が microCMS 起因で失敗しない。

5. 検証と browser 表示確認を行う。

    作業場所:
        <repo-root>
    実行:
        mise run lint
        mise run verify
        WATCHPACK_POLLING=true mise run dev
        curl -I http://localhost:3000/
        curl -I http://localhost:3000/notes
        curl -I http://localhost:3000/notes/<sample-slug>
    期待結果:
        lint / verify が成功し、主要 route が HTTP 200 を返す。`/blog` は `/notes` へ redirect する。

6. project-local review fix loop を行う。

    作業場所:
        <repo-root>
    実行:
        `docs/skills/review/SKILL.md` を使い、2 つ以上の独立 reviewer で diff を確認し、採用 finding を修正する。
    期待結果:
        未解決 finding がなくなり、完了処理に進める。

7. 完了条件を満たしたら、ExecPlan を completed へ移す。

    作業場所:
        <repo-root>
    実行:
        mv docs/exec-plans/active/202604260401_site-refresh-implementation docs/exec-plans/completed/202604260401_site-refresh-implementation
    期待結果:
        完了済みの ExecPlan が active に残らず、この移動が後続 commit / PR に含まれる。

8. stage / commit / PR 作成 / CI fix まで進める。

    作業場所:
        <repo-root>
    実行:
        git add <approved files>
        commit skill
        pr-writer skill
        CI check and fix loop
    期待結果:
        論理的な commit が作られ、PR が作成され、CI が green になるか具体的な blocker が報告される。

## 受け入れ条件

入力: ユーザーが承認した Bookish Warm Minimal と `Home / About / Notes` 情報設計。
確認: `/` は Koh Yonamine の短い自己紹介と Notes feed を表示する。
確認: `/about` は技術的関心とリンクを表示する。
確認: `/notes` は `記事` / `ノート` / `記録` を含む投稿一覧を日付順で表示する。
確認: `/notes/[slug]` は Markdown 由来の投稿本文を表示し、metadata を生成する。
確認: `/demo/site-refresh` は承認済みデザイン方向の preview route として残る。
確認: `/blog` と `/blog/[articleId]` は microCMS を読まず `/notes` へ redirect する。
確認: `MICROCMS_API_KEY` 未設定で `mise run verify` が成功する。
確認: PR が作成され、CI が green、または secret / 外部 service / 権限 blocker が具体的に記録される。
失敗条件: microCMS client が本番 route の build path に残る、`MICROCMS_API_KEY` が必要なままになる、Notion API token を要求する、旧記事移行を暗黙に行う、生成物が追跡対象になる。

## 復旧

1. 各変更は branch 上で行い、必要なら commit 単位で revert できるようにする。
2. 失敗時は `失敗条件:` を読んで scope を戻し、microCMS 依存や public route 影響を明示する。
3. content migration は行わず、sample Markdown は additive に追加するだけにする。
4. package dependency を削除する場合は `web/pnpm-lock.yaml` と `web/package.json` を同じ commit に含める。
5. 完了後に dev server を停止し、`.next/`、`node_modules/`、`next-env.d.ts` の生成的差分を残さない。

## 未完了

stage / commit、PR 作成、CI 確認。

変更記録: 2026-04-26 04:01+09:00 site refresh 本番実装の ExecPlan を作成した。
変更記録: 2026-04-26 05:20+09:00 実装、local verify、ブラウザ確認、初回 review cycle の採用 finding 修正まで反映した。
変更記録: 2026-04-26 05:35+09:00 fix-loop 再 review の結果、`exec-plan` skill の旧 microCMS 前提と guard/reviewer 記録不足を採用して修正した。
