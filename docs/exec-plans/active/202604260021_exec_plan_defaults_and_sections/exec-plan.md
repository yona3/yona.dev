この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

ExecPlan skill と ExecPlan schema を更新し、ExecPlan を使う作業では commit、PR 作成、CI fix までを既定の自律実行範囲として計画に含める。section 名は短く、読みやすい canonical 名へ改める。変更後の新規 ExecPlan は `目的`、`実行計画`、`受け入れ条件` を含む新しい section 名で作成される。

## 進捗

- [x] 2026-04-26 00:21+09:00 `PLANS.md`、`docs/skills/exec-plan/SKILL.md`、既存 active ExecPlan の旧 section 名参照を確認した。
- [x] 2026-04-26 00:24+09:00 `PLANS.md` の canonical section 名と skeleton を更新した。
- [x] 2026-04-26 00:24+09:00 `docs/skills/exec-plan/SKILL.md` に既定の commit / PR / CI fix 自律実行を組み込んだ。
- [x] 2026-04-26 00:24+09:00 関連 skill、`AGENTS.md`、`docs/conventions.md`、active ExecPlan の旧 section 名参照を更新した。
- [x] 2026-04-26 00:24+09:00 静的検査と `mise run verify` を実行し、結果を記録した。
- [x] 2026-04-26 00:33+09:00 multi-agent review fix loop で P2 finding 2 件を採用し、`AGENTS.md` とこの ExecPlan を修正した。
- [x] 2026-04-26 00:36+09:00 同じ reviewer set で再 review し、`contract-reviewer` / `ce-reviewer` とも findings なしで APPROVE だった。
- [x] 2026-04-26 00:37+09:00 修正後に `mise run verify` を再実行し、lint / compile / TypeScript 通過と既知の env 不足停止を確認した。

## 発見

Observation: section 名の正本は `PLANS.md` にあり、exec-plan skill はその skeleton を参照している。
Evidence:
    rg -n "目的|実行計画|受け入れ条件" PLANS.md docs/skills docs/exec-plans/active

Observation: 変更前の exec-plan skill は commit / PR 作成を承認 scope や spec-to-PR の場合に限定していた。
Evidence:
    docs/skills/exec-plan/SKILL.md
    - commit / PR 作成が承認 scope に含まれる場合
    - user が PR 作成を求めた、または task が spec-to-PR として承認済み

Observation: 静的検査では旧 canonical section 名、trailing whitespace、frontmatter の問題は見つからなかった。
Evidence:
    git diff --check
    # exit 0
    rg -n '[ \t]+$' PLANS.md AGENTS.md docs/skills docs/conventions.md docs/exec-plans/active
    # exit 1, no output
    old canonical section name search across PLANS.md, AGENTS.md, docs/skills, docs/conventions.md, docs/exec-plans/active
    # exit 1, no output

Observation: `mise run verify` は lint、compile、TypeScript まで進み、既知の `MICROCMS_API_KEY is not set` で停止した。
Evidence:
    mise run verify
    [lint] Finished in 28.84s
    [build] ✓ Compiled successfully in 19.6s
    [build] Finished TypeScript in 9.6s
    [cause]: Error: MICROCMS_API_KEY is not set

Observation: review fix loop で、この ExecPlan 自体が新しい end-to-end 計画契約を満たしていない点と、`AGENTS.md` の stage 例外不足が見つかった。
Evidence:
    contract-reviewer: P2 AGENTS.md:77 stage / commit 例外に stage が含まれていない。
    contract-reviewer: P2 exec-plan.md:102 実行計画に review fix loop / commit / PR 作成 / CI fix の手順がない。
    ce-reviewer: P2 exec-plan.md:102 実行計画が静的検査と verify で止まり、新契約の反例になっている。

Observation: 採用 finding 修正後の再 review では未解決 finding がなかった。
Evidence:
    contract-reviewer: P1/P2 findings なし, APPROVE
    ce-reviewer: findings なし, APPROVE

Observation: 採用 finding 修正後の `mise run verify` も変更起因 error ではなく既知の環境変数不足で停止した。
Evidence:
    mise run verify
    [lint] Finished in 11.31s
    [build] ✓ Compiled successfully in 8.1s
    [build] Finished TypeScript in 3.5s
    [cause]: Error: MICROCMS_API_KEY is not set

## 判断

Decision: 新しい canonical section 名は `目的`、`進捗`、`発見`、`判断`、`契約`、`実行計画`、`受け入れ条件`、`復旧`、`未完了` とする。
Rationale: ユーザー指定の 3 section 名を採用し、他 section も意味を保ったまま短くする。`契約` と `復旧` は内部に dependency / idempotency を残して、見出しだけを簡潔にする。
Date/Author: 2026-04-26 / Codex

Decision: ExecPlan skill では commit、PR 作成、CI fix を既定の自律実行範囲にする。
Rationale: ユーザーが「デフォルトで自動 commit, pr 作成, ci-fix まで自律的に実行」と指定したため。secret、破壊的変更、scope 外修正など AGENTS.md の確認条件は停止条件として維持する。
Date/Author: 2026-04-26 / Codex

## 契約

Dependency: `PLANS.md`
Reason: ExecPlan schema、必須 section、skeleton の正本。
Contract: 新規 ExecPlan の canonical section 名を更新し、機械検査 token は維持する。

Dependency: `docs/skills/exec-plan/SKILL.md`
Reason: ExecPlan 作成から実装、review、commit、PR、CI fix までの project-local workflow。
Contract: 既定で commit / PR 作成 / CI fix を計画と実行フローに含める。ただし停止条件に該当する場合は user 確認または blocker 報告を行う。

Dependency: `docs/skills/review/SKILL.md`
Reason: ExecPlan gate review の記録先 section 名を参照している。
Contract: review summary の記録先を新 section 名へ合わせる。

Dependency: `docs/exec-plans/active/*/exec-plan.md`
Reason: active plan は現行 schema に追随させる対象。
Contract: 完了済みの historical plan は無理に書き換えず、active plan の見出しと参照を新 canonical 名へ更新する。

## 実行計画

1. `PLANS.md` の意図確認プロトコル、記述規則、必須 section、section skeleton を新 section 名へ更新する。

    Working directory:
        <repo-root>
    Command:
        sed -n '1,220p' PLANS.md
    Expected outcome:
        `目的`、`実行計画`、`受け入れ条件` を含む新 section 名が canonical になる。

2. `docs/skills/exec-plan/SKILL.md` の実行フロー、commit / PR 運用、PR / CI 契約、完了条件を更新する。

    Working directory:
        <repo-root>
    Command:
        sed -n '1,220p' docs/skills/exec-plan/SKILL.md
    Expected outcome:
        ExecPlan task の既定実行範囲に commit、PR 作成、CI fix が含まれる。

3. `docs/skills/review/SKILL.md` と active ExecPlan の旧 section 名参照を更新する。

    Working directory:
        <repo-root>
    Command:
        rg -n "目的|実行計画|受け入れ条件|発見|判断|契約|復旧|未完了" docs/skills docs/exec-plans/active
    Expected outcome:
        active な運用文書では新 section 名へ揃っている。

4. 静的検査と repo hard guard を実行する。

    Working directory:
        <repo-root>
    Command:
        git diff --check
        rg -n "[ \t]+$" PLANS.md docs/skills docs/exec-plans/active
        mise run verify
    Expected outcome:
        whitespace error がなく、`mise run verify` は成功するか既知の環境要因を報告できる。

5. multi-agent review fix loop を実行し、採用 finding だけを修正する。

    Working directory:
        <repo-root>
    Command:
        review fix loop
    Expected outcome:
        `contract-reviewer` と `ce-reviewer` が実行され、採用 finding が 0 件になる。

6. review 後に stage、commit、PR 作成、CI fix まで進める。停止条件に該当する場合は blocker と未実行範囲を記録する。

    Working directory:
        <repo-root>
    Command:
        git add <approved files>
        commit skill
        pr-writer skill
        CI check and fix loop
    Expected outcome:
        stage / commit / PR 作成 / CI fix まで進む。権限、secret、外部 service、review 未成立などで止まる場合は具体的な blocker が記録される。

## 受け入れ条件

Input: section name inspection
Observe:
    `PLANS.md` の必須 section と skeleton が `目的`、`実行計画`、`受け入れ条件` を含む。
Failure signal:
    旧 canonical 名が schema の正本として残る。

Input: exec-plan skill inspection
Observe:
    `docs/skills/exec-plan/SKILL.md` の既定フローが commit、PR 作成、CI fix まで進む。
Failure signal:
    commit / PR 作成が user 明示依頼時だけのまま残る。

Input: `git diff --check`
Observe:
    exit 0, no output
Failure signal:
    whitespace error が出る。

Input: `mise run verify`
Observe:
    lint / compile / TypeScript は通過し、既知の `MICROCMS_API_KEY is not set` で `/blog` page data collection が停止した。
Failure signal:
    section/schema 変更に起因する lint/build error が出る。

Input: multi-agent review fix loop
Observe:
    初回:
    contract-reviewer: P2 2 件を検出し、`AGENTS.md` の stage 例外とこの ExecPlan の end-to-end 手順不足を修正対象として採用した。
    ce-reviewer: P2 1 件を検出し、この ExecPlan の end-to-end 手順不足を修正対象として採用した。
    再 review:
    contract-reviewer: P1/P2 findings なし, APPROVE
    ce-reviewer: findings なし, APPROVE
Failure signal:
    修正後の再 review で P1/P2 finding が残る。

Input: stage / commit / PR / CI path
Observe:
    review fix loop 完了後に進める。現時点では user の最新 request が review fix loop のため未実行。
Failure signal:
    user が明示的に除外していないのに blocker を記録せず stage / commit / PR / CI を省略する。

## 復旧

1. Markdown 契約と skill 文書の変更だけなので、再実行しても外部 state を壊さない。
2. 旧 section 名が残った場合は `rg` の結果から対象文書を限定して更新する。
3. active ExecPlan は新 schema に追随させ、completed ExecPlan は historical artifact として保持する。
4. `mise run verify` が環境変数不足で止まる場合は、lint / compile 進捗と未検証範囲を分けて記録する。
5. commit / PR / CI 自動化の既定化が停止条件と矛盾した場合は、停止条件を優先して blocker として報告する。

## 未完了

`MICROCMS_API_KEY` がない環境では `/blog` page data collection 以降の full build completion は未検証。

stage / commit / PR 作成 / CI fix は、user の最新 request が review fix loop のため未実行。

Change note: 2026-04-26 00:21+09:00 ExecPlan schema section 名変更と exec-plan skill の既定 end-to-end 実行化の計画を作成した。

Change note: 2026-04-26 00:24+09:00 schema、skill、active ExecPlan 更新と静的検査、`mise run verify` の結果を記録した。

Change note: 2026-04-26 00:24+09:00 multi-agent review fix loop が subagent 明示許可待ちであることを未完了に記録した。

Change note: 2026-04-26 00:33+09:00 review fix loop の P2 finding 2 件を採用し、stage 例外と end-to-end 実行計画を修正した。

Change note: 2026-04-26 00:36+09:00 同一 reviewer set の再 review が APPROVE で完了したことを記録した。

Change note: 2026-04-26 00:37+09:00 採用 finding 修正後の `mise run verify` 結果を記録した。
