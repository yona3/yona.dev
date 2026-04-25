この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的と全体像

今後の yona.dev 開発で、テスト導入前から t-wada の TDD を前提にした進め方を共有できるようにする。変更後は `docs/conventions.md` にテスト規約が追加され、`AGENTS.md` からその規約を参照できる。実際の test runner、test file、test dependency、CI pipeline はこのタスクでは追加しない。

Assumption: ユーザーの「t-wada の tdd 開発」は、テストリストを起点に Red-Green-Refactor を小さく回し、Green の間だけリファクタリングする進め方を指す。

## 進捗

- [x] 2026-04-25 22:52+09:00 `AGENTS.md`、`PLANS.md`、`docs/conventions.md`、既存 ExecPlan 配置を確認した。
- [x] 2026-04-25 22:52+09:00 `docs/conventions.md` に Testing / TDD policy を追加した。
- [x] 2026-04-25 22:52+09:00 `AGENTS.md` に詳細規約への短い参照を追加した。
- [x] 2026-04-25 22:56+09:00 変更差分を確認し、文書変更として妥当な検証を記録した。
- [x] 2026-04-25 22:56+09:00 ExecPlan を `docs/exec-plans/completed/202604252252_tdd_conventions/` に移した。
- [x] 2026-04-25 23:08+09:00 review fix loop の採用 finding を修正し、検証 evidence を更新した。
- [x] 2026-04-25 23:09+09:00 同じ reviewer set の cycle 2 再確認で `findings なし` を確認した。

## 気づきと発見

Observation: この repo は Hot 層を `AGENTS.md`、Warm 層を `docs/conventions.md`、Cold 層を ExecPlan に分ける設計になっている。
Evidence:
    docs/conventions.md の SSoT / CE 方針に、詳細規約は docs/conventions.md、task artifact は docs/exec-plans/{active,completed}/ と記載されている。

Observation: `mise run verify` は唯一の hard guard であり、別 pipeline や別形式の task artifact は増やさない契約になっている。
Evidence:
    AGENTS.md の コマンド section と docs/conventions.md の Verification section に `mise run verify` が hard guard として記載されている。

Observation: 今回の repo 差分は文書と ExecPlan に限定され、test runner、test dependency、test file、CI pipeline は追加していない。
Evidence:
    git status --short
     M AGENTS.md
     M docs/conventions.md
    ?? docs/exec-plans/completed/202604252252_tdd_conventions/

Observation: `mise run verify` は lint まで成功し、build は既存の runtime env 不足で止まった。
Evidence:
    mise run verify
    [lint] Finished in 16.65s
    [build] Error: MICROCMS_API_KEY is not set
    [build] Error: Failed to collect page data for /blog

Observation: review fix loop では `contract-reviewer` と `ce-reviewer` が P3 finding を出し、採用 finding を修正した。
Evidence:
    contract-reviewer: completed 後の ExecPlan が active path を参照している点を指摘。
    ce-reviewer: test list / acceptance の置き場所、Green 相当の定義、fix loop 後 evidence の古さを指摘。
    修正後、`docs/conventions.md` に test list / acceptance の置き場所と Green 相当の定義を追記し、ExecPlan の検証 command と evidence を更新した。

Observation: review fix loop cycle 2 は同じ reviewer set で未解決 finding なしになった。
Evidence:
    contract-reviewer / 019dc4f5-4932-7972-8013-008fd8498f86: findings なし。
    ce-reviewer / 019dc4f5-499a-78f1-847d-2766f3253440: findings なし。

## 判断記録

Decision: テスト規約の本文は `docs/conventions.md` に置き、`AGENTS.md` には短い参照だけを追加する。
Rationale: すべての session で読む Hot 層を肥大化させず、既存の CE 方針に沿って詳細規約を Warm 層へ集約するため。
Date/Author: 2026-04-25 / Codex

Decision: このタスクでは test runner、test dependency、test file、CI pipeline を追加しない。
Rationale: ユーザーが「実際のテストはまだ導入しない」と明示しており、依存管理と hard guard の契約を変えないため。
Date/Author: 2026-04-25 / Codex

Decision: Approval gate 1 はユーザーの明示依頼を承認として扱い、documentation-only の範囲で自律実行する。
Rationale: scope は `AGENTS.md`、`docs/conventions.md`、本 ExecPlan に限定でき、破壊的変更や secret / server-client boundary への影響がないため。
Date/Author: 2026-04-25 / Codex

## 依存関係と契約

Dependency: `AGENTS.md`
Reason: agent が最初に読む Hot 層であり、今後の開発前提への入口になるため。
Contract: 詳細規約を重複させず、`docs/conventions.md` への参照に留める。

Dependency: `docs/conventions.md`
Reason: repo 固有の詳細規約の正本であり、テスト規約を置く Warm 層であるため。
Contract: t-wada TDD の前提、テスト導入前の扱い、将来テスト導入時の原則を明文化する。

Dependency: `PLANS.md`
Reason: この ExecPlan の schema と更新規則の正本であるため。
Contract: 必須 section、進捗 timestamp、`Change note:` 末尾規則を守る。

## 具体手順

1. `docs/conventions.md` に Testing / TDD policy section を追加する。

    Working directory:
        <repo-root>
    Command:
        apply_patch
    Expected outcome:
        テスト導入前でも従える TDD 規約が文書化される。

2. `AGENTS.md` の参照先 section にテスト規約への短い導線を追加する。

    Working directory:
        <repo-root>
    Command:
        apply_patch
    Expected outcome:
        agent が Hot 層から詳細規約を発見できる。

3. 差分を確認し、実テスト導入が含まれていないことを確認する。

    Working directory:
        <repo-root>
    Command:
        git diff -- AGENTS.md docs/conventions.md docs/exec-plans/completed/202604252252_tdd_conventions/exec-plan.md
    Expected outcome:
        変更は文書と ExecPlan のみに限定される。

## 検証と受け入れ条件

Input: `git diff --stat` と対象ファイルの diff を確認する。
Observe: `AGENTS.md`、`docs/conventions.md`、本 ExecPlan 以外の変更がない。test runner、test dependency、test file、CI pipeline が追加されていない。`git diff --stat` は `AGENTS.md` 1 行追加、`docs/conventions.md` 27 行追加を示した。
Failure signal: `web/package.json`、lockfile、test file、CI 設定、`mise.toml`、実行 pipeline に変更が入っている。

Input: `mise run install` 後に `mise run verify` を実行する。
Observe: `pnpm install` は完了した。`mise run verify` は lint が成功し、build は `/blog` の page data collection で `MICROCMS_API_KEY is not set` により失敗した。差分起因の失敗は観測されていない。
Failure signal: verify が差分起因で失敗する、または環境変数不足以外の未説明 failure が残る。

Input: fix loop 後に `git diff --check`、untracked ExecPlan の `git diff --no-index --check /dev/null docs/exec-plans/completed/202604252252_tdd_conventions/exec-plan.md`、`mise run verify` を実行する。
Observe: `git diff --check` は出力なしで成功した。untracked ExecPlan の `--no-index --check` は whitespace error を出していない。`mise run verify` は lint が成功し、build は同じ `MICROCMS_API_KEY is not set` で失敗した。
Failure signal: whitespace error、差分起因の lint failure、または `MICROCMS_API_KEY` 以外の未説明 build failure が残る。

## 冪等性と復旧

1. 変更は文書への additive な追記なので、同じ section が重複しないように再実行時は既存見出しを確認する。
2. 失敗時は `git diff` で対象外 file への変更を確認し、対象 file だけを調整する。
3. migration、生成物、外部 service 更新はない。
4. test runner や dependency は追加せず、将来導入時に別 task / ExecPlan として扱う。
5. temporary file、dev server、生成物は作らない。

## 未完了事項

`mise run verify` の build は `MICROCMS_API_KEY` 未設定により完了していない。lint は成功済み。今回の変更は文書のみで、実テスト導入、依存追加、CI 変更は行っていない。

Change note: 2026-04-25 23:09+09:00 cycle 2 の reviewer verdict を記録した。
