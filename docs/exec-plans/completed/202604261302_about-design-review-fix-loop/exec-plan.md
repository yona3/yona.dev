この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

`/about` を中心にした design review の fix loop で追加された 5 findings を修正する。モバイル本文の右端 clipping、primary nav と profile links の tap target、直前 completed ExecPlan の delivery / review 記録を整え、Bookish Warm Minimal の静けさを保ったまま読みやすさと操作性を上げる。

## 進捗

- [x] 2026-04-26 13:02+09:00 ユーザーの `fix loop` 依頼と 5 findings を確認した。
- [x] 2026-04-26 13:02+09:00 `review` / `exec-plan` skill の契約を確認した。
- [x] 2026-04-26 13:08+09:00 採用 findings を最小差分で修正する。
- [x] 2026-04-26 13:26+09:00 `git diff --check`、untracked ExecPlan check、`mise run verify`、browser preview を確認する。
- [x] 2026-04-26 13:26+09:00 同じ reviewer set で再 review し、採用可能な追加 findings を修正した。
- [x] 2026-04-26 13:31+09:00 `.codex/config.toml` はユーザー指示により scope 外として無視する。
- [x] 2026-04-26 13:32+09:00 ExecPlan directory を completed へ移した。
- [x] 2026-04-26 13:58+09:00 final APPROVE loop の reviewer set を完了し、4 reviewer すべて APPROVE を確認した。

## 発見

観測: prose 系 class に `text-wrap: pretty` が残っており、390px 幅の review screenshot で右端 clipping が報告された。
根拠:
    `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`。

観測: primary nav link は mobile で約 28px 高、profile の `X` link は 24x34px で、touch target として小さい。
根拠:
    `web/src/components/site/site.module.css`。

観測: `docs/exec-plans/completed/202604261231_design-review-findings-fix/exec-plan.md` は直前の review re-check 結果と delivery blocker を十分に記録していない。
根拠:
    design review の contract-reviewer finding。

観測: prose 系の `text-wrap: pretty` を `line-break: strict` / `word-break: normal` に置き換え、primary nav と profile links に 44px class の非視覚的 target を設定した。demo CSS も同じ方針へ合わせた。
根拠:
    `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`。

観測: `202604261231_design-review-findings-fix` に review re-check で追加 findings が出たことと、後続 branch-level delivery に統合する残作業を記録した。
根拠:
    `docs/exec-plans/completed/202604261231_design-review-findings-fix/exec-plan.md`。

観測: multi-agent re-review の `ui-reviewer` が、Home の `.entryLine a` と demo の対応リンクも standalone target として 44px class にするべきだと指摘したため採用した。
根拠:
    `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`。

観測: multi-agent re-review の `design-reviewer` が、header brand link と demo brand link も header navigation target として 44px class にするべきだと指摘したため採用した。
根拠:
    `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`。

観測: multi-agent re-review は `ui-reviewer` と `contract-reviewer` と `design-reviewer` が REQUEST_CHANGES、`app-reviewer` が APPROVE だった。採用可能な UI / ExecPlan 指摘は修正済みで、`.codex/config.toml` はユーザーの「config.toml は無視」指示により scope 外として扱う。
根拠:
    reviewer outputs: `019dc7fc-69c5-70f0-8132-53fed87cef78`, `019dc7fc-9c3b-75e0-bda4-b88590f865f3`, `019dc7fc-6958-74f2-899c-747055e24ce2`, `019dc7fc-9c64-7b60-82a9-c358b424ce77`。

観測: 追加で提示された 10 findings を照合し、UI/code 側は反映済みだった。`202604260513_inward-minimal-ui` と `202604260539_reduce-identity-duplication` の delivery stop だけは文言が弱かったため、後続 branch-level delivery に統合する残作業として具体化した。
根拠:
    `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`, `web/src/app/demo/site-refresh/page.tsx`, `web/src/components/site/SiteShell.tsx`, `docs/exec-plans/completed/202604260513_inward-minimal-ui/exec-plan.md`, `docs/exec-plans/completed/202604260539_reduce-identity-duplication/exec-plan.md`。

観測: `git diff --check` は成功し、untracked ExecPlan 7 files は `git diff --no-index --check -- /dev/null <file>` で whitespace warning 出力なしだった。`mise run verify` も成功した。Browser/CDP では `/`, `/about`, `/notes`, `/demo/site-refresh`, `/notes/bookish-site` の mobile 390px で `documentElement.scrollWidth === innerWidth`、brand/nav/entry/profile target が 44px class、prose が `line-break: strict` / `textWrap: wrap` で clipping なしだった。
根拠:
    `git diff --check`, `mise run verify`, `/tmp/yona-design-review-fix-loop/*.png` と Chrome DevTools Protocol の DOM 検証結果。

観測: final APPROVE loop の first pass では `ui-reviewer` と `app-reviewer` が APPROVE、`contract-reviewer` が final verdict 記録不足、`design-reviewer` が demo route の stale visual tokens を指摘した。demo CSS は hard-coded hex をやめて `--color-*` tokens 参照に変更した。
根拠:
    reviewer outputs: `019dc808-f5f2-78a2-a704-c34f538f9776`, `019dc808-f686-74c2-ab4c-fc303f955187`, `019dc808-f637-7733-9e71-dcd63ce15086`, `019dc808-f5a8-7321-b1ab-5eeb4f4d9382`; `web/src/app/demo/site-refresh/page.module.css`。

観測: demo visual token 修正後、`git diff --check` と `mise run verify` は成功した。最初の sandbox 実行では Google Fonts fetch が network restriction で失敗したため、同じ command を権限付きで再実行して成功した。Browser/CDP では `/`, `/about`, `/notes`, `/demo/site-refresh`, `/notes/bookish-site` の mobile 390px と demo desktop で横 overflow なし、brand/nav/entry/profile target 44px class、demo の background/primary color が root token と一致することを確認した。
根拠:
    `git diff --check`, `mise run verify`, `/tmp/yona-final-approve-loop/*.png` と Chrome DevTools Protocol の DOM 検証結果。

観測: final APPROVE loop の second pass では `design-reviewer` と `app-reviewer` が APPROVE、`ui-reviewer` が real Notes list links の tap target 不足、`contract-reviewer` が final verdict 記録不足を指摘した。Notes list の `.noteItem a` は 44px class target に変更した。
根拠:
    reviewer outputs: `019dc810-4668-7660-87d8-34eae702f81b`, `019dc810-4746-7bd3-b7e4-48fc43212926`, `019dc810-46d4-7be0-9906-10f24c9d02d7`, `019dc810-4715-7d10-9dff-8fdbab6f1e17`; `web/src/components/site/site.module.css`。

観測: Notes list link target 修正後、`git diff --check`、untracked ExecPlan whitespace check、`mise run verify` は成功した。Browser/CDP では `/`, `/notes`, `/about`, `/demo/site-refresh` の mobile 390px で横 overflow なし、Notes list links が 44px class target であることを確認した。
根拠:
    `git diff --check`, `git diff --no-index --check -- /dev/null docs/exec-plans/completed/202604261302_about-design-review-fix-loop/exec-plan.md`, `mise run verify`, `/tmp/yona-final-approve-loop-2/*.png` と Chrome DevTools Protocol の DOM 検証結果。

観測: final APPROVE loop の third pass では、`design-reviewer`、`ui-reviewer`、`contract-reviewer`、`app-reviewer` の 4 reviewer がすべて APPROVE だった。未解決 finding はなし。
根拠:
    reviewer outputs: `019dc814-9994-7c82-b91f-cda93000e52d`, `019dc814-99dc-77e0-8947-762ff29f90f3`, `019dc814-9a21-7a72-8f39-9ae1ab0ed41f`, `019dc814-9a56-7020-9757-7f665b18b40e`。

## 判断

判断: prose から `text-wrap: pretty` を外し、CJK 向けに `line-break: strict` を足す。
理由: clipping のリスクがある text wrapping より、本文が確実に読めることを優先する。見出しや短いタイトルの balance / pretty 指定は対象外にする。
日付/担当: 2026-04-26 / Codex

判断: tap target は非視覚的な `min-height` / `min-width` で確保し、ボタン風の囲いは足さない。
理由: 操作性は上げる必要があるが、現在のミニマルな text-link 表現は維持したい。
日付/担当: 2026-04-26 / Codex

判断: stage / commit / PR / CI は、後続の branch-level delivery に統合する残作業として記録する。
理由: ExecPlan 契約では delivery が既定のため、未実施を隠さず、どの後続単位で扱うかを明示する必要がある。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`, `docs/exec-plans/completed/202604261231_design-review-findings-fix/exec-plan.md`
依存理由: review findings の直接対象を修正するため。
契約: route、content loader、Markdown renderer、frontmatter schema、Notion sync、secret / server-client boundary は変更しない。
契約: UI は text-only / line-based の表現を維持し、カード、影、装飾を増やさない。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo`, `web/next-env.d.ts` の生成的差分は残さない。

## 実行計画

1. UI findings を修正する。

    作業場所:
        <repo-root>
    実行:
        prose wrapping と nav/profile link tap target を CSS で修正する。
    期待結果:
        mobile で prose が右端 clipping せず、primary nav と profile links が 44px class の操作対象になる。

2. completed ExecPlan の記録を修正する。

    作業場所:
        <repo-root>
    実行:
        `202604261231_design-review-findings-fix` に current review re-check と delivery blocker を追記する。
    期待結果:
        completed ExecPlan が review fix loop と delivery blocker を隠さない。

3. 検証する。

    作業場所:
        <repo-root>
    実行:
        `git diff --check`
        untracked ExecPlan は `git diff --no-index --check -- /dev/null <file>` 相当で個別確認する。
        `mise run verify`
        browser preview
    期待結果:
        lint/build が成功し、mobile prose / tap target / generated diff が確認できる。

4. 同じ reviewer set で再 review する。

    作業場所:
        <repo-root>
    実行:
        design-reviewer、ui-reviewer、contract-reviewer、app-reviewer で修正後を確認する。
    期待結果:
        APPROVE または残件が明確になる。

5. 完了条件を満たしたら、この ExecPlan directory を completed へ移す。

    作業場所:
        <repo-root>
    実行:
        `未完了` に delivery blocker を明記してから、
        `mv docs/exec-plans/active/202604261302_about-design-review-fix-loop docs/exec-plans/completed/202604261302_about-design-review-fix-loop`
    期待結果:
        完了済みの ExecPlan が active に残らず、stage / commit / PR / CI の未実施理由が隠れない。

6. branch-level delivery への統合を扱う。

    作業場所:
        <repo-root>
    実行:
        この fix loop の stage / commit / PR / CI は後続の branch-level delivery に統合し、`未完了` に残作業として残す。
    期待結果:
        ExecPlan の delivery 既定範囲と、中間 UI fix loop の完了記録が矛盾しない。

## 受け入れ条件

入力: 直前の 5 review findings。
確認: mobile prose の clipping 対策として prose に `line-break: strict` が入り、`text-wrap: pretty` が prose から外れている。
確認: primary nav と profile links が text-only のまま 44px class の操作対象になる。
確認: `202604261231_design-review-findings-fix` が review re-check と delivery blocker を記録する。
確認: `git diff --check` と `mise run verify` が成功する。
確認: Browser/CDP で `/about` mobile と関連 route の overflow / target size を確認する。
失敗条件: UI がボタン風に重くなる、route / content loader / Markdown renderer を変更する、生成物差分を残す。

## 復旧

1. 修正は CSS と ExecPlan 記録に閉じる。
2. 合わない場合はこの ExecPlan の差分だけを戻せるようにする。
3. dev server が `web/next-env.d.ts` を書き換えた場合は元に戻す。
4. review が blocked の場合は理由を `未完了` に残す。
5. 完了後は active から completed へ移す。

## 未完了

`.codex/config.toml` は未追跡で `sandbox_mode = "danger-full-access"` を含むが、ユーザーの「config.toml は無視」指示によりこの fix loop では scope 外とする。

この fix loop の delivery は後続の branch-level delivery に統合した。stage / commit は後続 commit で完了し、PR / CI は最終 branch delivery の残作業として扱う。

変更記録: 2026-04-26 13:02+09:00 about design review fix loop の ExecPlan を作成した。
変更記録: 2026-04-26 13:08+09:00 prose wrapping、tap target、completed ExecPlan 記録を修正した。
変更記録: 2026-04-26 13:20+09:00 multi-agent re-review の指摘を受け、entry line link の tap target を 44px class にした。
変更記録: 2026-04-26 13:22+09:00 contract-reviewer の指摘を受け、delivery gate と未完了欄の矛盾を修正した。
変更記録: 2026-04-26 13:24+09:00 design-reviewer の指摘を受け、brand link の tap target と untracked ExecPlan check 記録を修正した。
変更記録: 2026-04-26 13:26+09:00 再検証と Browser/CDP 確認を完了し、`.codex/config.toml` 削除を確認待ち blocker として記録した。
変更記録: 2026-04-26 13:31+09:00 ユーザー指示により `.codex/config.toml` を scope 外へ戻し、古い completed ExecPlan 2件の delivery stop を具体化した。
変更記録: 2026-04-26 13:32+09:00 ExecPlan directory を completed へ移した。
変更記録: 2026-04-26 13:42+09:00 final APPROVE loop の first pass 指摘を受け、demo CSS を production visual tokens 参照に寄せた。
変更記録: 2026-04-26 13:45+09:00 demo visual token 修正後の `git diff --check`、`mise run verify`、Browser/CDP 確認を完了した。
変更記録: 2026-04-26 13:52+09:00 final APPROVE loop の second pass 指摘を受け、Notes list link の tap target を 44px class にした。
変更記録: 2026-04-26 13:55+09:00 Notes list link 修正後の `git diff --check`、`mise run verify`、Browser/CDP 確認を完了した。
変更記録: 2026-04-26 13:58+09:00 final APPROVE loop の third pass で 4 reviewer すべて APPROVE、未解決 finding なしを記録した。
