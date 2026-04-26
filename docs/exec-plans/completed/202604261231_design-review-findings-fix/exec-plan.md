この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

直前の design review で追加された 5 件の finding を、現在のミニマルで内省的な方向性を崩さずに修正する。About の短い外部リンクは小さすぎない操作対象にし、demo の note item は同じ section へ戻る偽リンクをなくし、footer の装飾は空 landmark にしない。あわせて typography token と completed ExecPlan の delivery 記録を整合させる。

## 進捗

- [x] 2026-04-26 12:31+09:00 ユーザーの `fix` 依頼と 5 findings を確認した。
- [x] 2026-04-26 12:31+09:00 `fix` skill と project-local `exec-plan` skill の契約を確認した。
- [x] 2026-04-26 12:35+09:00 採用 findings を最小差分で修正する。
- [x] 2026-04-26 12:38+09:00 `git diff --check`、`mise run verify`、browser preview を確認する。
- [x] 2026-04-26 12:38+09:00 5 findings の修正状態を DOM / screenshot で確認した。
- [x] 2026-04-26 13:02+09:00 design review re-check で追加 5 findings を確認し、`202604261302_about-design-review-fix-loop` へ引き継いだ。

## 発見

観測: About の link list は `.linkList a` で padding を 0 にしており、`X` link の操作対象が glyph width まで縮む。
根拠:
    `web/src/components/site/site.module.css`。

観測: demo の note title はすべて `href="#notes"` で、選んでも同じ Notes section へ戻る。
根拠:
    `web/src/app/demo/site-refresh/page.tsx`。

観測: footer は `aria-label="Page footer"` を持つ `footer` landmark だが、子要素は `aria-hidden` の coffee mark だけである。
根拠:
    `web/src/components/site/SiteShell.tsx`。

観測: `DESIGN.md` は display token を `2rem` とし、Home の名前を小さな標識として扱う方針を書いているが、実装は max `2.75rem` まで拡大する。
根拠:
    `DESIGN.md`, `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`。

観測: `202604260513_inward-minimal-ui` と `202604260539_reduce-identity-duplication` は completed だが、stage / commit / PR 未実施の停止条件を `未完了` に残していない。
根拠:
    `docs/exec-plans/completed/202604260513_inward-minimal-ui/exec-plan.md`, `docs/exec-plans/completed/202604260539_reduce-identity-duplication/exec-plan.md`。

観測: 採用 findings に対し、About link target の最小幅、demo note title の静的 text 化、footer landmark の除去、display max size の `2rem` 寄せ、Notes / About の補助 aria label 日本語化、completed ExecPlan の delivery stop 記録を実装した。
根拠:
    `web/src/components/site/site.module.css`, `web/src/components/site/SiteShell.tsx`, `web/src/app/demo/site-refresh/page.tsx`, `web/src/app/demo/site-refresh/page.module.css`, `web/src/app/notes/page.tsx`, `web/src/app/about/page.tsx`, `docs/exec-plans/completed/202604260513_inward-minimal-ui/exec-plan.md`, `docs/exec-plans/completed/202604260539_reduce-identity-duplication/exec-plan.md`。

観測: `git diff --check` と `mise run verify` は成功した。`mise run verify` は lint、build、TypeScript、static generation を完了した。
根拠:
    2026-04-26 の `git diff --check` と `mise run verify` 実行結果。

観測: Browser/CDP preview では Home desktop、About desktop、Notes mobile、demo mobile の `documentElement.scrollWidth === innerWidth` を確認した。Home / About の H1 は desktop で 32px、About の `X` link は 24x34px、demo note title は link 0 件で静的 text、`footer` element は存在せず decorative footer wrapper は `aria-hidden="true"` だった。coffee emoji は 0 件だった。
根拠:
    `/tmp/yona-review-findings-fix/home-desktop.png`, `/tmp/yona-review-findings-fix/about-desktop.png`, `/tmp/yona-review-findings-fix/notes-mobile.png`, `/tmp/yona-review-findings-fix/demo-mobile.png` と Chrome DevTools Protocol の DOM 検証結果。

観測: 2026-04-26 13:02+09:00 の design review re-check で、mobile prose wrapping、primary nav / profile links の tap target、completed ExecPlan の delivery / review 記録について追加 5 findings が出た。
根拠:
    ユーザー提示の Review findings と `docs/exec-plans/active/202604261302_about-design-review-fix-loop/exec-plan.md`。

## 判断

判断: demo note title は実記事 URL に対応しない `余白に残る温度` を含むため、リンクではなく静的 text として扱う。
理由: demo は体験の見本であり、実在しない note への route を増やすより、誤導線をなくす方が安全で最小差分になる。
日付/担当: 2026-04-26 / Codex

判断: title size は `clamp` を残しつつ max を `2rem` に寄せる。
理由: mobile の可読性は保ちつつ、desktop で外向きに大きく見える強さを DESIGN.md token に合わせて抑える。
日付/担当: 2026-04-26 / Codex

判断: stage / commit / PR / CI は、PR 作成が GitHub への外部変更になるため action-time confirmation 待ちの blocker として記録する。
理由: ExecPlan の既定範囲には delivery が含まれるため、未実施を隠さず blocker として明示する必要がある。一方で PR 作成は外部サービスへの変更であり、この会話ではまだ action-time confirmation を得ていない。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `web/src/components/site/site.module.css`, `web/src/components/site/SiteShell.tsx`, `web/src/app/demo/site-refresh/page.tsx`, `web/src/app/demo/site-refresh/page.module.css`, `web/src/app/notes/page.tsx`, `web/src/app/about/page.tsx`, `docs/exec-plans/completed/202604260513_inward-minimal-ui/exec-plan.md`, `docs/exec-plans/completed/202604260539_reduce-identity-duplication/exec-plan.md`
依存理由: review findings の直接対象と、同じ IA / accessibility 問題がある隣接ラベルを修正するため。
契約: route、content loader、Markdown renderer、frontmatter schema、Notion sync、secret / server-client boundary は変更しない。
契約: visual direction は DESIGN.md の Bookish Warm Minimal に合わせ、装飾やカードを増やさない。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo`, `web/next-env.d.ts` の生成的差分は残さない。

## 実行計画

1. UI / accessibility findings を修正する。

    作業場所:
        <repo-root>
    実行:
        `.linkList a` の短いリンク操作対象、footer landmark、Notes / About の補助 aria label、title size を修正する。
    期待結果:
        見た目の静けさを保ったまま、短いリンクと landmark が支援技術・タッチ操作で破綻しない。

2. demo finding を修正する。

    作業場所:
        <repo-root>
    実行:
        `/demo/site-refresh` の note title を同じ section へ戻る link ではなく静的 text にする。
    期待結果:
        demo 内に誤解を招く note 導線が残らない。

3. completed ExecPlan の delivery 記録を修正する。

    作業場所:
        <repo-root>
    実行:
        指摘された 2 つの completed ExecPlan に stage / commit / PR 未実施の保留理由を追記する。
    期待結果:
        completed artifact が ExecPlan 契約と矛盾しない。

4. 検証する。

    作業場所:
        <repo-root>
    実行:
        `git diff --check`
        `mise run verify`
        browser preview
    期待結果:
        lint/build が成功し、Home / About / demo の表示、横 overflow、短い link target が確認できる。

5. 完了条件を満たしたら、この ExecPlan directory を completed へ移す。

    作業場所:
        <repo-root>
    実行:
        `mv docs/exec-plans/active/202604261231_design-review-findings-fix docs/exec-plans/completed/202604261231_design-review-findings-fix`
    期待結果:
        完了済みの ExecPlan が active に残らない。

## 受け入れ条件

入力: 直前の 5 review findings。
確認: About の `X` link が glyph width だけの操作対象ではなくなる。
確認: demo note titles が `#notes` へ link しない。
確認: footer が空の named landmark にならない。
確認: Home / About / note detail / demo の title max size が DESIGN.md の display token と整合する。
確認: 指摘された completed ExecPlan が stage / commit / PR 未実施を明示する。
確認: `git diff --check` と `mise run verify` が成功する。
失敗条件: route / content loader / Markdown renderer を変更する、OS emoji 依存を戻す、生成物差分を残す、未実施 delivery を `None.` として隠す。

## 復旧

1. 修正は review findings の対象 file に閉じる。
2. UI が合わなければ CSS と demo markup の差分だけを戻せる。
3. dev server が `web/next-env.d.ts` を書き換えた場合は元に戻す。
4. 検証失敗時は原因と未検証範囲をこの ExecPlan に残す。
5. 完了後は active から completed へ移す。

## 未完了

2026-04-26 13:02+09:00 の design review re-check で追加 5 findings が出たため、修正は `docs/exec-plans/active/202604261302_about-design-review-fix-loop/exec-plan.md` に引き継いだ。

stage / commit / PR / CI は未実施。PR 作成は GitHub への外部変更で action-time confirmation が必要なため、ユーザーが PR 作成を承認するまで delivery は保留。

変更記録: 2026-04-26 12:31+09:00 design review findings fix の ExecPlan を作成した。
変更記録: 2026-04-26 12:35+09:00 5 findings に対する UI / docs 修正を実装した。
変更記録: 2026-04-26 12:38+09:00 `git diff --check`、`mise run verify`、Browser/CDP preview の結果を反映した。
変更記録: 2026-04-26 13:02+09:00 design review re-check 結果と delivery blocker を追記した。
