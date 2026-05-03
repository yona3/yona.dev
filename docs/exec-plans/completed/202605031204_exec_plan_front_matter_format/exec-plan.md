---
status: completed
created_at: 2026-05-03 12:04+09:00
updated_at: 2026-05-03 12:09+09:00
owner: Codex
review.scope_command: git diff -- PLANS.md docs/conventions.md docs/skills/exec-plan/SKILL.md docs/skills/review/SKILL.md docs/exec-plans/completed/202605031204_exec_plan_front_matter_format/exec-plan.md docs/exec-plans/completed/202605031135_harness_standard_rebuild/exec-plan.md
review.untracked_paths: []
---

この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

ExecPlan の format を標準の front matter 付き形式へ寄せる。変更前は `review.scope_command` / `review.untracked_paths` が本文 `契約` section にあり、共通 review flow や commit skill が期待する front matter SSoT とずれている。変更後は、新規 / active ExecPlan が冒頭 YAML front matter で状態、時刻、担当、review scope、未追跡 review 対象を持ち、本文 section は詳細説明と証跡に集中する。

## 進捗

- [x] 2026-05-03 12:04+09:00 `exec-plan` skill、`PLANS.md`、標準 review flow、既存 ExecPlan を比較して drift を確認した。
- [x] 2026-05-03 12:04+09:00 ユーザーが「分析して修正してほしい」と明示したため承認1は取得済みとして記録した。
- [x] 2026-05-03 12:04+09:00 `PLANS.md` と project-local skills を front matter SSoT へ修正した。
- [x] 2026-05-03 12:05+09:00 relevant completed ExecPlan の review scope 記録を front matter へ最小補足した。
- [x] 2026-05-03 12:06+09:00 `git diff --check`、front matter parse、`mise run verify` を実行した。
- [x] 2026-05-03 12:08+09:00 project-local review gate を `contract-reviewer` / `ce-reviewer` で再実行し、APPROVE を得た。
- [x] 2026-05-03 12:08+09:00 この ExecPlan を `docs/exec-plans/completed/202605031204_exec_plan_front_matter_format` へ移した。
- [x] 2026-05-03 12:09+09:00 completed move 後に `git diff --check`、front matter parse、`mise run verify` を再実行した。
- [ ] 2026-05-03 12:08+09:00 commit、PR update まで完了する。

## 発見

観測: 共通 review flow は relevant ExecPlan の front matter にある `review.scope_command` と `review.untracked_paths` を主変更集合の SSoT として最初に読む。
根拠:
    user-scope `review/references/codex-review-flow.md` の Step 1 に、本文の `スコープ` / `完了条件` は補助説明、旧形式の `受け入れ条件` / `契約` section は historical artifact 向け fallback とある。

観測: `harness-architect` 標準も front matter の review 範囲、未追跡 review 対象、状態、検証コマンドを `PLANS.md` に流し込む観点として扱っている。
根拠:
    `harness-architect/references/design-guide.md` と `build-docs-verify.md` は、状態、検証コマンド、レビュー範囲、未追跡 review 対象、次の担当を front matter SSoT にする方針を持つ。

観測: 現行 `PLANS.md` は `review.scope_command` / `review.untracked_paths` を本文 `契約` section に書かせており、front matter の仕様を定義していない。
根拠:
    `PLANS.md` の `記述規則` と `section skeleton` は `契約` section 内に review scope fields を置いている。

観測: project-local `review` skill は relevant ExecPlan の `review.scope_command` / `review.untracked_paths` を読むとだけ書いており、front matter primary / 本文 fallback の優先順位がない。
根拠:
    `docs/skills/review/SKILL.md` の `scope 決定`。

観測: project-local `exec-plan` skill は `PLANS.md` skeleton の利用を指示しているが、front matter の必須 field を明示していない。
根拠:
    `docs/skills/exec-plan/SKILL.md` の `実行フロー`。

観測: deterministic verification は最新差分で成功した。
根拠:
    `git diff --check` は出力なしで成功した。
    Ruby の YAML front matter parse は active / completed ExecPlan の `status`, `created_at`, `updated_at`, `owner`, `review.scope_command`, `review.untracked_paths` を確認して成功した。`ffi-1.12.2` の gem warning は出たが command は exit 0。
    `mise run verify` は lint と build を実行し、Next.js build は 8 pages を生成して成功した。mise cache 書き込み warning は出たが command は exit 0。completed move 後の再実行でも成功した。

観測: project-local review gate は `contract-reviewer` と `ce-reviewer` の 2 reviewer で成立し、最終 verdict は APPROVE。
根拠:
    `contract-reviewer` session `019debcd-8306-7062-8c7c-9f82c7e7be06`: verdict APPROVE、findings なし、blocker なし、confidence high。
    `ce-reviewer` session `019debcd-8cca-7cb1-8f7a-d3bf3ae697af`: verdict APPROVE、findings なし、blocker なし、confidence high。
    前回 REQUEST_CHANGES の個人絶対パスと completed artifact の stale `updated_at` / 変更記録は修正済みと確認された。

## 判断

判断: 新規 / active ExecPlan は YAML front matter を必須とし、historical completed artifact は一括変換しない。
理由: 標準は front matter を SSoT にしているが、既存 completed は作成時点の schema と token を履歴として保持するという現行契約と矛盾させないため。今回触る completed ExecPlan は PR #25 の関連 artifact だけなので、最小補足する。
日付/担当: 2026-05-03 / Codex

判断: front matter field は literal key の `review.scope_command` / `review.untracked_paths` として定義する。
理由: 共通 review flow、commit skill、既存文言が dotted field 名で参照しているため。nested object より grep / prompt / wrapper preflight へそのまま渡しやすい。
日付/担当: 2026-05-03 / Codex

## 契約

依存: `PLANS.md`, `docs/conventions.md`, `docs/skills/exec-plan/SKILL.md`, `docs/skills/review/SKILL.md`, `docs/exec-plans/completed/202605031204_exec_plan_front_matter_format/exec-plan.md`, `docs/exec-plans/completed/202605031135_harness_standard_rebuild/exec-plan.md`
依存理由: ExecPlan schema、workflow skill、review scope 決定、今回の task artifact、直近の関連 completed artifact を整合させるため。
契約: `PLANS.md` は ExecPlan の構造と front matter field の SSoT とする。
契約: `docs/skills/exec-plan/SKILL.md` は `PLANS.md` を参照し、構造を再定義しない。
契約: `docs/skills/review/SKILL.md` は front matter を primary、本文 field を historical fallback として扱う。
契約: 無関係な completed ExecPlan は一括変換しない。

## 実行計画

1. `PLANS.md` を front matter 付き skeleton へ修正する。

    作業場所:
        <repo-root>
    実行:
        YAML front matter の必須 field と例を追加し、本文 `契約` section から review scope field の正本性を外す。
    期待結果:
        新規 ExecPlan が front matter で status / created_at / updated_at / owner / review scope / untracked paths を持つ。

2. project-local skills を front matter SSoT に合わせる。

    作業場所:
        <repo-root>
    実行:
        `docs/skills/exec-plan/SKILL.md` と `docs/skills/review/SKILL.md` の scope / skeleton / review scope 説明を更新する。
    期待結果:
        exec-plan skill は `PLANS.md` front matter を必ず生成し、review skill は front matter primary / historical body fallback の順で scope を決める。

3. relevant artifact を最小補足する。

    作業場所:
        <repo-root>
    実行:
        直近の `docs/exec-plans/completed/202605031135_harness_standard_rebuild/exec-plan.md` に front matter を補足し、本文の review scope field は historical note として扱える形へ寄せる。
    期待結果:
        直近 PR の completed artifact も標準 review flow の primary scope を満たす。

4. verification と review gate を実行する。

    作業場所:
        <repo-root>
    実行:
        `git diff --check`
        `mise run verify`
        `contract-reviewer` と `ce-reviewer` による review fix loop
    期待結果:
        whitespace / lint / build が通り、format drift の採用 finding が残らない。

5. 完了処理、commit、PR update を行う。

    作業場所:
        <repo-root>
    実行:
        この ExecPlan を completed へ移す。
        `commit` skill で commit する。
        `pr-writer` UPDATE mode で PR #25 を更新する。
    期待結果:
        completed ExecPlan、commit、PR body、CI 状態が整合する。

## 受け入れ条件

入力: `exec-plan` format が標準とずれているため分析して修正する。
確認: `PLANS.md` の skeleton が YAML front matter を持ち、`review.scope_command` / `review.untracked_paths` が front matter field として定義されている。実測: 反映済み。
確認: `docs/skills/exec-plan/SKILL.md` が front matter 生成を `PLANS.md` に従う必須手順として扱う。実測: 反映済み。
確認: `docs/skills/review/SKILL.md` が front matter primary / historical body fallback の順で review scope を決める。実測: 反映済み。
確認: `git diff --check`、`mise run verify`、multi-agent review gate の結果が記録されている。実測: `git diff --check` と `mise run verify` は成功。`contract-reviewer` / `ce-reviewer` ともに APPROVE。
失敗条件: review scope の SSoT が本文 `契約` section と front matter に二重化して競合する。
失敗条件: 無関係な completed ExecPlan を一括変換する。

## 復旧

1. docs-only の変更に留め、問題があれば該当 hunk だけを revert できる。
2. front matter 形式が不適切なら、この ExecPlan と `PLANS.md` skeleton の field 定義を同時に戻す。
3. `docs/skills/review/SKILL.md` の fallback 文言は historical artifact の読み取り互換を守る。
4. `mise run verify` が環境要因で失敗した場合は差分起因かどうかを分けて記録する。
5. 完了時はこの ExecPlan を completed へ移し、active に残さない。

## 未完了

commit、PR update が未完了。

変更記録: 2026-05-03 12:04+09:00 format drift 分析と修正方針を記録し、承認1取得済みとして ExecPlan を作成した。
変更記録: 2026-05-03 12:08+09:00 deterministic verification と multi-agent review gate の APPROVE を記録した。
変更記録: 2026-05-03 12:08+09:00 ExecPlan を completed へ移し、path-sensitive な review scope を更新した。
変更記録: 2026-05-03 12:09+09:00 completed move 後の deterministic verification 成功を記録した。
