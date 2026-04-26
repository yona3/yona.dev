この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

現在の site refresh 差分に対して、project-local `review` skill の design-reviewer 条件を使った fix loop を実行する。Design Thinking、UX Design、Information Architecture、Visual Design を含む独立 reviewer の finding を検証し、採用 finding だけを修正して、UI の品質と review skill 契約の整合を確認する。

## 進捗

- [x] 2026-04-26 06:08+09:00 ユーザーの `design review fix loop` 依頼を確認した。
- [x] 2026-04-26 06:08+09:00 対象差分と `docs/skills/review/SKILL.md` を確認した。
- [x] 2026-04-26 06:08+09:00 design-reviewer、ui-reviewer、contract/ce-reviewer、app-reviewer を起動した。
- [x] 2026-04-26 06:18+09:00 reviewer finding を集約し、採用可否を検証する。
- [x] 2026-04-26 06:20+09:00 採用 finding だけを修正する。
- [x] 2026-04-26 06:26+09:00 git diff check、verify、browser preview を確認する。

## 発見

観測: working tree には site refresh UI、DESIGN.md、review skill、completed ExecPlan の差分がある。
根拠:
    `git diff --name-only` と `git ls-files --others --exclude-standard`。

観測: `review` skill の design-reviewer は user_request に `design` / `デザイン` / `UX` / `情報設計` / `visual` などが含まれる場合に条件付き起動する。
根拠:
    `docs/skills/review/SKILL.md`。

観測: design-reviewer は demo route に旧デザインの大きな hero / card-like aside が残っていること、footer の coffee mark が装飾に見えるのに `/notes` link になっていることを指摘した。
根拠:
    design-reviewer / 019dc678-9106-7281-8d30-2ff763ed528d の review 出力。

観測: ui-reviewer は muted text の contrast が 4.5:1 未満であること、footer coffee link の hit target が小さいこと、reduced motion でも transform が残ることを指摘した。
根拠:
    ui-reviewer / 019dc678-916e-7a13-b693-495d427c4b11 の review 出力。

観測: contract/ce-reviewer は completed ExecPlan の stage / commit / PR 未実施記録が ExecPlan skill の既定実行範囲とずれていること、completed ExecPlan の `未完了` が `なし。` で schema とずれていることを指摘した。
根拠:
    contract/ce-reviewer / 019dc678-91ad-7483-9257-4c667bb9bcd8 の review 出力。

観測: app-reviewer は `git diff --check`、`mise run lint`、Node 24 の `tsc --noEmit --incremental false --ignoreDeprecations 6.0` を確認し、追加 finding はなかった。
根拠:
    app-reviewer / 019dc678-91f0-7ac3-911b-d5f5e72c2d9c の review 出力。

観測: 採用 finding に対し、footer coffee mark を link から装飾に戻し、muted color を `#7A6E60` へ暗くし、demo route を現在のミニマルな layout に合わせ、completed ExecPlan の未完了記録を更新した。
根拠:
    `web/src/components/site/SiteShell.tsx`, `web/src/components/site/site.module.css`, `web/src/styles/globals.css`, `web/src/app/demo/site-refresh/page.tsx`, `web/src/app/demo/site-refresh/page.module.css`, `DESIGN.md`, `docs/exec-plans/completed/202604260513_inward-minimal-ui/exec-plan.md`, `docs/exec-plans/completed/202604260539_reduce-identity-duplication/exec-plan.md`, `docs/exec-plans/completed/202604260555_design-review-improvements/exec-plan.md`, `docs/exec-plans/completed/202604260608_review-design-criteria/exec-plan.md`。

観測: `git diff --check` と `mise run verify` は成功した。`mise run verify` は lint、build、TypeScript、static generation を完了した。
根拠:
    2026-04-26 の `git diff --check` と `mise run verify` 実行結果。

観測: Browser/CDP preview では `/`, `/notes`, `/about`, `/demo/site-refresh` の desktop/mobile で `documentElement.scrollWidth === innerWidth` を確認した。coffee emoji は 0 件で、footer coffee mark は link 内になく、reduced motion 下でも `transitionDuration: 0s`, `transform: none` だった。demo の `aboutBlock` は `borderRadius: 0px`, `backgroundColor: rgba(0, 0, 0, 0)` だった。
根拠:
    `/tmp/yona-design-review-fix-loop/home-desktop.png`, `/tmp/yona-design-review-fix-loop/home-mobile.png`, `/tmp/yona-design-review-fix-loop/notes-mobile.png`, `/tmp/yona-design-review-fix-loop/about-desktop.png`, `/tmp/yona-design-review-fix-loop/demo-desktop.png`, `/tmp/yona-design-review-fix-loop/demo-mobile.png` と Chrome DevTools Protocol の DOM 検証結果。

観測: 同じ reviewer set で再 review した結果、design-reviewer と ui-reviewer は APPROVE した。contract/ce-reviewer と app-reviewer は `web/next-env.d.ts` の生成的差分と active ExecPlan の古い状態だけを追加指摘したため、`web/next-env.d.ts` を元の stable import に戻し、この ExecPlan を現状に合わせた。
根拠:
    re-review 出力、`web/next-env.d.ts`。

観測: 2 回目の再 review で contract/ce-reviewer と app-reviewer も APPROVE し、remaining findings はなくなった。
根拠:
    contract/ce-reviewer / 019dc678-91ad-7483-9257-4c667bb9bcd8 と app-reviewer / 019dc678-91f0-7ac3-911b-d5f5e72c2d9c の re-review 出力。

## 判断

判断: review set は `design-reviewer`, `ui-reviewer`, `contract/ce-reviewer`, `app-reviewer` とする。
理由: 現在の差分は UI、DESIGN.md、review skill、Next.js metadata / route-level code に跨るため、design 観点だけでは契約・実装・UI 検証を十分に覆えない。
日付/担当: 2026-04-26 / Codex

判断: stage / commit / PR 作成は未実施として記録し、UI 反復が落ち着くまで保留する。
理由: ExecPlan skill の既定範囲には stage / commit / PR が含まれる。一方で、現在の依頼は design review fix loop で、既存の UI 反復差分も未確定のまま続いている。履歴固定はユーザーが承認したタイミングで実行できるよう、未完了として明示する。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `DESIGN.md`, `docs/skills/review/SKILL.md`, `web/src/app/page.tsx`, `web/src/app/about/page.tsx`, `web/src/app/notes/page.tsx`, `web/src/components/site/SiteShell.tsx`, `web/src/components/site/site.module.css`, `web/src/styles/globals.css`
依存理由: design review の対象差分と、review skill の design-reviewer 条件を確認するため。
契約: reviewer は編集しない。coordinator だけが採用 finding を修正する。
契約: route、content loader、Markdown renderer、frontmatter schema、Notion sync、secret / server-client boundary は変更しない。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo`, `web/next-env.d.ts` の生成的差分は残さない。

## 実行計画

1. reviewer finding を集約する。

    作業場所:
        `<repo-root>`
    実行:
        4 reviewer の最終出力を確認し、source reviewer 付きで採用可否を判断する。
    期待結果:
        好みだけの提案や scope 外の指摘を除外し、採用 finding だけが残る。

2. 採用 finding を修正する。

    作業場所:
        `<repo-root>`
    実行:
        対象 file を最小差分で編集する。
    期待結果:
        user-visible な品質問題または review skill 契約不整合だけが修正される。

3. 検証する。

    作業場所:
        `<repo-root>`
    実行:
        `git diff --check`
        `mise run verify`
        browser preview
    期待結果:
        lint/build が成功し、desktop/mobile で UI 破綻と overflow がない。

4. 必要なら同じ reviewer set で再確認する。

    作業場所:
        `<repo-root>`
    実行:
        採用 finding の修正後、同じ観点で未解決 finding がないか確認する。
    期待結果:
        APPROVE または残件が明確になる。

5. 完了条件を満たしたら、この ExecPlan directory を completed へ移す。

    作業場所:
        `<repo-root>`
    実行:
        `mv docs/exec-plans/active/202604260608_design-review-fix-loop docs/exec-plans/completed/202604260608_design-review-fix-loop`
    期待結果:
        完了済みの ExecPlan が active に残らない。

## 受け入れ条件

入力: 現在の working tree diff と `http://localhost:3000/`
確認: design-reviewer を含む 2 つ以上の独立 reviewer が実行されている。
確認: 採用 finding は source reviewer、file:line、根拠、最小修正で説明できる。
確認: 採用 finding の修正後に `git diff --check` と `mise run verify` が成功する。
確認: browser preview で desktop/mobile の overflow と主要導線を確認する。
失敗条件: 好みだけの提案を修正する、reviewer が編集する、生成物差分を残す、scope 外の route / content loader / Markdown renderer を変更する。

## 復旧

1. reviewer 出力は会話内で扱い、repo に固定 artifact を増やさない。
2. 採用 finding の修正は小さく分け、不要なら戻せる状態にする。
3. 検証で dev server が `web/next-env.d.ts` を書き換えた場合は戻す。
4. review が blocked の場合は理由を `未完了` に残す。
5. 完了後は active から completed へ移す。

## 未完了

stage / commit / PR 作成は未実施。UI 反復中のため、ユーザーが履歴固定を承認するまで保留。

変更記録: 2026-04-26 06:08+09:00 design review fix loop の ExecPlan を作成した。
変更記録: 2026-04-26 06:20+09:00 reviewer findings を集約し、UI / design / contract の採用 finding を修正した。
変更記録: 2026-04-26 06:26+09:00 `git diff --check`、`mise run verify`、Browser/CDP preview を確認した。
変更記録: 2026-04-26 06:31+09:00 re-review findings に従い、`web/next-env.d.ts` の生成的差分と ExecPlan の検証状態を修正した。
変更記録: 2026-04-26 06:34+09:00 2 回目の re-review で remaining findings がないことを確認した。
