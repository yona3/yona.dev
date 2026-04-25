この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

ExecPlan の canonical token を旧英語固定句から、`入力:`、`観測:` などの簡潔な日本語固定句へ置き換える。変更後の新規 ExecPlan は日本語見出しと日本語 token だけで読め、既存 completed artifact は履歴として保持する。

また、完了済み ExecPlan が `docs/exec-plans/active/` に残る移動漏れを防ぐため、`docs/skills/exec-plan/SKILL.md` と `PLANS.md` に完了処理を明示する。今回見つかった過去の移動漏れは手動で `docs/exec-plans/completed/` へ移す。

## 進捗

- [x] 2026-04-26 01:19+09:00 `PLANS.md`、project-local `exec-plan` / `review` skill、active ExecPlan の残存状況を確認した。
- [x] 2026-04-26 01:19+09:00 detached HEAD から `codex/exec-plan-japanese-terms` ブランチを作成した。
- [x] 2026-04-26 01:23+09:00 `PLANS.md` の固定 token と section skeleton を日本語 token へ更新した。
- [x] 2026-04-26 01:23+09:00 `docs/skills/exec-plan/SKILL.md` に完了処理と active/completed 移動確認を追加した。
- [x] 2026-04-26 01:23+09:00 完了済み active ExecPlan 3 件を `docs/exec-plans/completed/` へ移した。
- [x] 2026-04-26 01:25+09:00 静的検査は成功し、`mise run verify` は未信頼 `mise.toml` で停止したため結果を記録した。
- [x] 2026-04-26 01:27+09:00 user の `go` を受けて `mise trust`、`mise run install`、`mise run verify` を実行した。
- [x] 2026-04-26 01:29+09:00 `contract-reviewer` と `ce-reviewer` の findings を採用して修正した。
- [x] 2026-04-26 01:31+09:00 同じ reviewer set の再 review はどちらも APPROVE / findings なしだった。
- [x] 2026-04-26 01:31+09:00 修正後の静的検査と `mise run verify` を再実行した。

## 発見

観測: 変更前の ExecPlan schema は機械検査用固定句として英語 token を列挙していた。
根拠:
    PLANS.md:
    - 変更後は `観測:`, `根拠:`, `判断:`, `入力:`, `確認:`, `失敗条件:` などを固定句として定義している。

観測: `docs/skills/exec-plan/SKILL.md` は active に plan を作る手順を持つが、完了時に completed へ移動する手順を実行フローに明示していない。
根拠:
    docs/skills/exec-plan/SKILL.md:
    - `docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` を作る手順はある。
    - `docs/exec-plans/completed/` へ移す実行ステップはない。

観測: `docs/exec-plans/active/` に、進捗が全て完了済みで完了記録もある過去 ExecPlan が 3 件残っている。
根拠:
    find docs/exec-plans/active -maxdepth 2 -name exec-plan.md -print
    # 202604251937_bootstrap-harness-contract
    # 202604252140_project-agent-skills
    # 202604260021_exec_plan_defaults_and_sections

観測: canonical token 更新後、`PLANS.md`、`docs/skills`、現在 active の ExecPlan には旧英語 token が残っていない。
根拠:
    rg -n "<old-token-pattern>" PLANS.md docs/skills docs/exec-plans/active
    # exit 1, no output

観測: 過去の完了済み ExecPlan 3 件を completed へ移した後、active には今回の作業中 plan だけが残った。
根拠:
    find docs/exec-plans/active -mindepth 1 -maxdepth 1 -type d -print
    docs/exec-plans/active/202604260119_exec_plan_japanese_terms

観測: 静的検査は成功した。
根拠:
    git diff --check
    # exit 0, no output
    rg -n "[ \t]+$" PLANS.md docs/skills docs/exec-plans
    # exit 1, no output
    rg -n "<old-token-pattern>" PLANS.md docs/skills docs/exec-plans/active
    # exit 1, no output

観測: `mise run verify` は未信頼 `mise.toml` で停止した。
根拠:
    mise run verify
    # mise ERROR Config files in ~/.codex/worktrees/f531/yona.dev/mise.toml are not trusted.
    # Trust them with `mise trust`.

観測: user の `go` 後に `mise trust` と `mise run install` は完了し、再実行した `mise run verify` は lint / compile / TypeScript まで通過して既知の `MICROCMS_API_KEY is not set` で停止した。
根拠:
    mise trust
    # mise trusted /Users/yonakintv/.codex/worktrees/f531/yona.dev
    mise run install
    # pnpm install completed, Packages: +447
    mise run verify
    # [lint] Finished in 11.83s
    # [build] ✓ Compiled successfully in 9.1s
    # [build] Finished TypeScript in 3.2s
    # [cause]: Error: MICROCMS_API_KEY is not set

観測: multi-agent review で、completed 履歴の旧 token 例外不足、completed へ移した過去 plan の未完了記録、完了処理順序の不備が見つかった。
根拠:
    contract-reviewer:
    - P2 PLANS.md completed artifact の旧英語 token 保持が現行契約と矛盾。
    - P2 completed/202604260021... 未完了の PR 更新/CI fix 作業を残したまま completed へ移動。
    ce-reviewer:
    - P2 docs/skills/exec-plan/SKILL.md 完了処理が stage/commit/PR 作成の後に置かれている。
    - P3 PLANS.md completed historical artifact の legacy token 扱いが SSoT にない。

観測: 採用 finding に対し、`PLANS.md` に completed 履歴の schema 例外を追加し、完了処理を stage / commit 前へ移し、PR #21 merge 済みの実態に合わせて過去 plan の未完了記録を更新した。
根拠:
    gh pr view 21 --repo yona3/yonas-home --json number,state,mergedAt,statusCheckRollup,url
    # state: MERGED
    # mergedAt: 2026-04-25T15:57:45Z
    # Vercel: SUCCESS

観測: 同じ reviewer set の再 review は未解決 finding なしで完了した。
根拠:
    contract-reviewer: APPROVE, findings なし
    ce-reviewer: APPROVE, findings なし

観測: 修正後の静的検査は成功し、`mise run verify` は lint / compile / TypeScript まで通過して既知の `MICROCMS_API_KEY is not set` で停止した。
根拠:
    git diff --check
    # exit 0, no output
    rg -n "[ \t]+$" PLANS.md docs/skills docs/exec-plans
    # exit 1, no output
    rg -n "<old-token-pattern>" PLANS.md docs/skills docs/exec-plans/active
    # exit 1, no output
    mise run verify
    # [lint] Finished in 11.95s
    # [build] ✓ Compiled successfully in 9.4s
    # [build] Finished TypeScript in 4.1s
    # [cause]: Error: MICROCMS_API_KEY is not set

観測: PR #23 を作成し、PR checks は pass した。
根拠:
    gh pr view 23 --repo yona3/yona.dev --json number,title,state,url,headRefName,baseRefName
    # number: 23
    # state: OPEN
    # url: https://github.com/yona3/yona.dev/pull/23
    gh pr checks 23 --repo yona3/yona.dev --watch=false
    # Vercel pass, Canceled by Ignored Build Step
    # Vercel Preview Comments pass

## 判断

判断: canonical token は新規 ExecPlan 用の schema と skeleton で日本語化し、completed artifact の本文は履歴として保持する。
理由: completed ExecPlan は当時の契約に基づく根拠 artifact であり、全面置換すると履歴差分が大きくなる。新規 plan と active plan だけを現行 schema に追随させる方が再開時の混乱が小さい。
日付/担当: 2026-04-26 / Codex

判断: active から completed への移動は、完了処理として `exec-plan` skill の実行フローと `PLANS.md` の skeleton に入れる。
理由: `AGENTS.md` と `PLANS.md` に既に方針はあるが、実行フローにないため最後の手作業として漏れやすい。plan 作成から完了報告までを担う skill に明示するのが最小の harness 改善になる。
日付/担当: 2026-04-26 / Codex

判断: 今回の user request は 承認1 の承認として扱い、docs / skills / ExecPlan 移動に限定して自律実行する。
理由: scope は `PLANS.md`、`docs/skills/exec-plan/SKILL.md`、ExecPlan artifact の移動に具体化でき、secret、auth、server-client boundary、破壊的データ変更に触れないため。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `PLANS.md`
依存理由: ExecPlan schema、固定 token、section skeleton の正本。
契約: 新規 ExecPlan が日本語 token で作成でき、最後の非空行に最新の変更記録を持つ。

依存: `docs/skills/exec-plan/SKILL.md`
依存理由: ExecPlan の作成、更新、検証、完了処理を agent が実行する入口。
契約: 完了した ExecPlan を `active` に残さず `completed` へ移す手順を持つ。

依存: `docs/exec-plans/active/*/exec-plan.md`
依存理由: 現在 active に残っている過去 artifact。
契約: 完了済みと判断できるものだけを同名 directory のまま `docs/exec-plans/completed/` へ移す。

## 実行計画

1. `PLANS.md` の固定 token 一覧、必須 section 表、section skeleton、変更記録規則を日本語 token へ更新する。

    作業場所:
        <repo-root>
    実行:
        sed -n '1,220p' PLANS.md
    期待結果:
        新規 ExecPlan の token が `観測:`、`根拠:`、`入力:`、`確認:`、`失敗条件:`、`変更記録:` などに置き換わっている。

2. `docs/skills/exec-plan/SKILL.md` に完了処理を追加する。

    作業場所:
        <repo-root>
    実行:
        sed -n '1,180p' docs/skills/exec-plan/SKILL.md
    期待結果:
        実行フローと完了条件に、active plan を completed へ移す手順と最終確認が含まれる。

3. 完了済み active ExecPlan を completed へ移動する。

    作業場所:
        <repo-root>
    実行:
        mv docs/exec-plans/active/<slug> docs/exec-plans/completed/<slug>
        find docs/exec-plans/active -mindepth 1 -maxdepth 1 -type d -print
    期待結果:
        過去の完了済み plan は completed へ移動し、active には今回の作業中 plan だけが残る。

4. 静的検査と hard guard を実行する。

    作業場所:
        <repo-root>
    実行:
        git diff --check
        rg -n "[ \t]+$" PLANS.md docs/skills docs/exec-plans/active
        mise run verify
    期待結果:
        whitespace error がなく、`mise run verify` は成功するか既知の環境要因を報告できる。

5. review fix loop を進める。

    作業場所:
        <repo-root>
    実行:
        review fix loop
    期待結果:
        採用 finding がなくなり、完了処理に進める状態になる。

6. この ExecPlan 自体の完了処理を stage / commit 前に実行する。

    作業場所:
        <repo-root>
    実行:
        mv docs/exec-plans/active/202604260119_exec_plan_japanese_terms docs/exec-plans/completed/202604260119_exec_plan_japanese_terms
    期待結果:
        完了済み ExecPlan の移動が後続の commit / PR に含まれ、active に残らない。

7. stage、commit、PR 作成、CI fix まで進める。

    作業場所:
        <repo-root>
    実行:
        git add <approved files>
        commit skill
        pr-writer skill
        CI check and fix loop
    期待結果:
        commit と PR が作られ、CI が green になるか具体的な blocker が報告される。

## 受け入れ条件

入力: `PLANS.md` inspection
確認:
    固定 token と skeleton が日本語 token を使い、英語 token は historical artifact または説明対象としてだけ残る。
失敗条件:
    新規 ExecPlan skeleton に旧英語 token が残る。

入力: `docs/skills/exec-plan/SKILL.md` inspection
確認:
    完了処理として active から completed へ移す手順がある。
失敗条件:
    plan 作成手順だけがあり、完了時の移動が agent の実行フローから漏れている。

入力: active/completed directory inspection
確認:
    `docs/exec-plans/active/` には作業中の plan だけが残り、完了済みの過去 plan は `docs/exec-plans/completed/` にある。
失敗条件:
    進捗完了済みの過去 plan が active に残っている。

入力: `mise run verify`
確認:
    lint / compile / TypeScript は通過し、既知の `MICROCMS_API_KEY is not set` で `/blog` page data collection が停止した。差分起因 error は観測されていない。
失敗条件:
    docs / skill 変更に起因する lint/build error が出る。

## 復旧

1. Markdown 文書と ExecPlan directory 移動だけなので、再実行しても外部 state を壊さない。
2. token 置換で不整合が出た場合は `PLANS.md` と skill の skeleton を正本として揃える。
3. completed へ移した ExecPlan が未完了と判明した場合は、同じ directory 名のまま active へ戻せる。
4. `mise run verify` が環境変数不足で止まる場合は、lint / compile の進捗と未検証範囲を分けて記録する。
5. 完了後はこの ExecPlan 自体も completed へ移し、active に完了済み artifact を残さない。

## 未完了

`MICROCMS_API_KEY` がない環境では `/blog` page data collection 以降の local full build completion は未検証。

PR #23 は作成済みで、Vercel checks は pass。CI fix の残作業はない。

変更記録: 2026-04-26 01:19+09:00 ExecPlan 日本語 token 化と active/completed 移動漏れ解消の計画を作成した。

変更記録: 2026-04-26 01:23+09:00 `PLANS.md` と `docs/skills/exec-plan/SKILL.md` を更新し、過去の完了済み active ExecPlan 3 件を completed へ移した。

変更記録: 2026-04-26 01:25+09:00 静的検査成功と `mise run verify` の未信頼 `mise.toml` 停止を記録し、review / stage / commit / PR / CI の未実行範囲を明示した。

変更記録: 2026-04-26 01:27+09:00 user の `go` 後に `mise trust`、`mise run install`、`mise run verify` を実行し、known env blocker と multi-agent review 開始を記録した。

変更記録: 2026-04-26 01:29+09:00 multi-agent review の採用 finding に基づき、completed 履歴の token 例外、完了処理順序、過去 plan の未完了記録を修正した。

変更記録: 2026-04-26 01:31+09:00 同じ reviewer set の再 review APPROVE と修正後の静的検査 / `mise run verify` 結果を記録した。

変更記録: 2026-04-26 01:35+09:00 PR #23 作成と Vercel checks pass を記録し、stage / commit / PR / CI の未実行記録を完了状態へ更新した。
