---
schema: exec-plan/v3
status: in_progress
task:
  key: "202605031242_exec_plan_record_format_alignment"
source:
  kind: manual
workspace:
  mode: current_branch
delivery:
  kind: pull_request
verify:
  command: "mise run verify"
review:
  required: true
  scope_command: "git diff -- PLANS.md docs/conventions.md docs/skills/exec-plan/SKILL.md docs/skills/review/SKILL.md docs/exec-plans/active/202605031242_exec_plan_record_format_alignment/exec-plan.md docs/exec-plans/active/202604261459_site_refresh_parent/exec-plan.md docs/exec-plans/completed/202604261459_site_refresh_parent/exec-plan.md"
  untracked_paths:
    - "docs/exec-plans/active/202605031242_exec_plan_record_format_alignment/exec-plan.md"
    - "docs/exec-plans/completed/202604261459_site_refresh_parent/exec-plan.md"
handoff: human_review
next:
  actor: agent
  action: pre_delivery_commit
---

# ExecPlan format を dotfiles 標準へ寄せる

## 概要

目的: dotfiles の `PLANS.md` と `.config/harness/skills/exec-plan/SKILL.md` を標準参照として、yona.dev の ExecPlan format と project-local `exec-plan` / `review` skill を、理由がない限りそのまま取り入れる形へ更新する。

現在地: ユーザーの `go` で承認1を得た。`PLANS.md`、`docs/conventions.md`、`docs/skills/exec-plan/SKILL.md`、`docs/skills/review/SKILL.md` を dotfiles `exec-plan/v3` 標準へ寄せ、PR #24 の merge 済み親 ExecPlan を completed へ移した。`git diff --check`、front matter parse、`mise run verify` は成功。review gate は `contract-reviewer` / `ce-reviewer` ともに APPROVE。

次の作業: pre-delivery commit を作成し、`pr-writer` UPDATE mode で PR #25 を更新する。

この ExecPlan は `PLANS.md` に従って保守する。ただしこの draft は移行対象そのものの preview であり、dotfiles `exec-plan/v3` を取り込むための先行 draft として扱う。作業中は `完了条件`、`作業`、`記録` を更新し続ける。

## スコープ

### 対象

- `PLANS.md`: ExecPlan schema、front matter、section 順序、ひな形、記述規則。
- `docs/conventions.md`: ExecPlan 作成、review gate、PR 作成、feedback 還流の参照先。
- `docs/skills/exec-plan/SKILL.md`: dotfiles の exec-plan skill を参考にした、作成入口と意図確認手順。
- `docs/skills/review/SKILL.md`: nested front matter の `review.required` / `review.scope_command` / `review.untracked_paths` を読む契約。
- この ExecPlan: 今回触る active artifact として、新 format へ追従させる。
- `docs/exec-plans/completed/202604261459_site_refresh_parent/exec-plan.md`: merge 済み PR #24 の親 ExecPlan。active 旧形式を残さないため completed へ移す。
- PR #25: `pr-writer` UPDATE mode で body を更新する。

### 対象外

- `AGENTS.md` の全面 rewrite。
- app 本体 `web/` の挙動変更。
- hidden runtime path、別 pipeline、別 task artifact の追加。
- dotfiles 固有の `scripts/harness/verify.sh`、`auto-complete-exec-plans.sh`、`worktree-preflight.sh` の導入。
- 無関係な completed ExecPlan の一括変換。

### 前提

- dotfiles の `PLANS.md` は harness-architect 標準の具体実装として扱う。
- yona.dev の hard guard は `mise run verify` であり、dotfiles の `VERIFY_TASK_DIR=... bash scripts/harness/verify.sh` はそのまま導入しない。
- yona.dev の PR 作成・更新入口は `pr-writer` skill であり、dotfiles の `local_only` / `main_push` 前提とは異なる。
- front matter の nested `review` を最終形にする場合、project-local `review` skill も同時に更新する。

## 完了条件

- [x] dotfiles の `PLANS.md` と exec-plan skill を読み、yona.dev との差分を確認している。
- [x] format preview を dotfiles `exec-plan/v3` ベースに修正している。
- [x] この改善用 ExecPlan が dotfiles `exec-plan/v3` に近い front matter と section 順序を持つ。
- [x] `PLANS.md` が dotfiles 標準の `schema: exec-plan/v3`、nested front matter、`概要` / `スコープ` / `完了条件` / `作業` / `記録` 順序を取り込んでいる。
- [x] `docs/skills/exec-plan/SKILL.md` が dotfiles exec-plan skill と同じ責務境界を持ち、section 順序や fixed label を再定義しない。
- [x] `docs/skills/review/SKILL.md` が nested `review` front matter を primary scope として扱う。
- [x] repo 固有差分が `記録 > 判断` に理由付きで残っている。
- [x] front matter の `verify.command` が `mise run verify` として成功している。
- [x] `review.required: true` の review gate が成立し、`記録 > 発見` または `記録 > 判断` に `レビュー通過:` 固定行が残っている。
- [ ] `pr-writer` UPDATE mode で PR #25 を更新し、receipt が `記録 > 発見` に残っている。
- [ ] `作業` の未チェック項目がない。

## 作業

### ゲート

- 承認1: この draft の承認後、repo-wide contract と project-local skills の実装へ進む。
- 独立レビュー: front matter の `review.required` が `true` のため、承認1後に追加承認を待たず、`contract-reviewer` と `ce-reviewer` を別コンテキストで起動する。
- commit: verify / review gate 通過後、追加承認を待たず `commit` skill 経由で pre-delivery commit する。
- PR update: pre-delivery commit 後、追加承認を待たず `pr-writer` UPDATE mode で PR #25 を更新し、receipt をこの ExecPlan に残す。
- completed move: `pr-writer` receipt 記録後、この ExecPlan を completed へ移して receipt/move を追加 commit する。

### 手順

- [x] 2026-05-03 12:42+09:00 `harness-architect` の SKILL と references、現行 `PLANS.md`、直近 completed ExecPlan を比較した。
- [x] 2026-05-03 12:42+09:00 最初の format preview を提示した。
- [x] 2026-05-03 12:45+09:00 dotfiles の `PLANS.md` と `.config/harness/skills/exec-plan/SKILL.md` を読み、標準参照として採用する方針へ draft を更新した。
- [x] 2026-05-03 12:51+09:00 `PLANS.md` を dotfiles `exec-plan/v3` 標準へ寄せた。
- [x] 2026-05-03 12:51+09:00 `docs/skills/exec-plan/SKILL.md` を dotfiles exec-plan skill の責務境界へ寄せた。
- [x] 2026-05-03 12:51+09:00 `docs/conventions.md` と `docs/skills/review/SKILL.md` を nested front matter と `記録` / `完了条件` 参照へ合わせた。
- [x] 2026-05-03 12:51+09:00 PR #24 merge 済みを確認し、旧 active 親 ExecPlan を completed へ移した。
- [x] 2026-05-03 12:51+09:00 この ExecPlan 自体を実装後の current format に合わせて更新した。
- [x] 2026-05-03 12:54+09:00 `git diff --check`、front matter parse、front matter schema check、`mise run verify` を実行した。
- [x] 2026-05-03 12:59+09:00 `contract-reviewer` と `ce-reviewer` の初回 finding を修正し、未追跡 file の `git diff --no-index --check` 相当検査を実行した。
- [x] 2026-05-03 13:07+09:00 `contract-reviewer` と `ce-reviewer` を再実行し、review gate の APPROVE verdict を記録した。
- [ ] YYYY-MM-DD HH:MM+09:00 pre-delivery commit、push、PR update、receipt 記録、completed move、receipt/move commit、PR checks 確認まで進める。

### 委譲

- `review.required: true`: 承認1後に追加承認を待たず、`contract-reviewer` と `ce-reviewer` を別コンテキストで起動する。期待する出力は `verdict`、`findings`、`evidence`、`blocker`、`confidence`。結論が対立した場合は `REQUEST_CHANGES` を優先し、修正後に再レビューする。起動不能の場合は `blocked` にする。
- `contract-reviewer`: `AGENTS.md`、`PLANS.md`、`docs/conventions.md`、project-local skills、PR 作成契約、verify 契約との矛盾を確認する。
- `ce-reviewer`: SSoT、context clash、lost-in-middle、artifact trail、dotfiles 標準からの不必要な逸脱を確認する。
- その他の sidecar 委譲: none。

### 復旧

docs-only の変更に留める。問題があれば該当 hunk だけを revert できる。dotfiles 標準をそのまま入れにくい箇所が見つかった場合は、差分を広げる前に `記録 > 判断` に理由、影響範囲、再評価条件を残す。`mise run verify` が環境要因で失敗した場合は差分起因かどうかを分けて記録する。無関係な completed ExecPlan は rewrite しないため、過去 artifact の意味は保持される。

## 記録

### 発見

- 2026-05-03 / Codex: `harness-architect` は対象 repo のルート `PLANS.md` を ExecPlan の SSoT とし、節名、front matter、固定ラベルは harness-architect 側で再定義しない。根拠は `harness-architect/references/design-guide.md` の `3c. PLANS / ExecPlan 標準形式`。
- 2026-05-03 / Codex: dotfiles の `PLANS.md` は `exec-plan/v3` として、nested front matter、`概要` / `スコープ` / `完了条件` / `作業` / `記録` の section 順序、`記録 > 発見/判断/変更履歴` を定義している。
- 2026-05-03 / Codex: dotfiles の exec-plan skill は、ExecPlan の構造、節順序、front matter、完了ゲートを再定義せず、対象 project の `PLANS.md` に従って draft を作る責務に限定している。
- 2026-05-03 / Codex: yona.dev 旧 `PLANS.md` は flat dotted front matter、`目的` / `進捗` / `発見` / `判断` / `契約` / `実行計画` / `受け入れ条件` / `復旧` / `未完了` を使っており、dotfiles 標準と section 設計が異なっていた。
- 2026-05-03 / Codex: dotfiles 標準をそのまま入れにくい既知差分は、`verify.command`、auto-complete script、reviewer 名、delivery の既定値、PR 作成契約である。
- 2026-05-03 / Codex: `PLANS.md` は dotfiles `exec-plan/v3` の front matter と section 順序を取り込み、yona.dev 固有差分として `verify.command: "mise run verify"`、`delivery.kind: pull_request`、`pr-writer` 入口、auto-complete script 不採用を記録した。
- 2026-05-03 / Codex: 既存 active の `202604261459_site_refresh_parent` は PR #24 が merge 済みだったため、未完了を解消して completed へ移した。
- 2026-05-03 / Codex: `git diff --check` は出力なしで成功した。active ExecPlan の `exec-plan/v3` front matter parse も成功した。`mise run verify` は lint と build を実行し、8 routes の build を完了して exit 0。mise cache warning は出たが command は成功した。
- 2026-05-03 / Codex: 初回 review は `contract-reviewer` と `ce-reviewer` が `REQUEST_CHANGES`。採用 finding は、未追跡 ExecPlan file の whitespace 証跡不足と `docs/skills/review/SKILL.md` に残った旧語 `acceptance` の 2 件。
- 2026-05-03 / Codex: `review.untracked_paths` の 2 file に対して `git diff --no-index --check /dev/null docs/exec-plans/active/202605031242_exec_plan_record_format_alignment/exec-plan.md` と `git diff --no-index --check /dev/null docs/exec-plans/completed/202604261459_site_refresh_parent/exec-plan.md` を実行した。どちらも stdout/stderr は空で、whitespace warning はなかった。exit code 1 は `/dev/null` との差分が存在するための `--no-index` 差分終了であり、whitespace error ではない。
- 2026-05-03 / Codex: 再 review で `completed move` と `pr-writer receipt` の順序衝突が見つかったため、workflow を `pre-delivery commit -> PR update -> receipt -> completed move -> receipt/move commit` に統一した。
- 2026-05-03 / Codex: レビュー通過: contract-reviewer=APPROVE (session `019dec03-6202-77b1-bcb1-467806d3e59d`), ce-reviewer=APPROVE (session `019dec03-6bc3-76f1-b37a-cac96153b23d`), security-reviewer=not_required, レビュー未成立なし, verify=pass (`mise run verify` 2026-05-03 13:04+09:00), 未解決 finding=0, 未検証範囲=なし。

### 判断

- 2026-05-03 / Codex: dotfiles の `PLANS.md` と exec-plan skill を標準参照として、理由がない限りそのまま取り入れる。理由: ユーザーが明示し、`harness-architect` も対象 repo の `PLANS.md` 標準へ寄せることを既定としているため。
- 2026-05-03 / Codex: `verify.command` は dotfiles の `VERIFY_TASK_DIR=... bash scripts/harness/verify.sh` ではなく `mise run verify` に置き換える。理由: yona.dev の `AGENTS.md` は `mise run verify` を唯一の hard guard とし、別 `verify.sh` や独自 pipeline を増やさないため。
- 2026-05-03 / Codex: dotfiles の auto-complete script は導入しない。理由: yona.dev では completed move を ExecPlan workflow と `commit` / `pr-writer` の自律範囲で扱っており、hidden runner や別 pipeline を増やさない契約があるため。
- 2026-05-03 / Codex: `delivery.kind` の既定は `pull_request` にする。理由: yona.dev の ExecPlan task は stage / commit / PR 作成 / CI fix までを既定の自律範囲に含め、PR 作成・更新は `pr-writer` skill を入口にするため。
- 2026-05-03 / Codex: 意図確認完了: 設計木=解決, 質問=不要, 推奨回答=不要, 探索回答=反映済み, 未解決意思決定=なし

### 変更履歴

- 2026-05-03 / Codex: format preview を提示し、改善用 ExecPlan を作成した。
- 2026-05-03 / Codex: dotfiles `PLANS.md` と exec-plan skill を標準参照として採用する方針へ ExecPlan draft を更新した。
- 2026-05-03 / Codex: 承認1後、PLANS と project-local skills を dotfiles `exec-plan/v3` 標準へ寄せた。
- 2026-05-03 / Codex: merge 済みの旧 active 親 ExecPlan を completed へ移し、review scope に含めた。
- 2026-05-03 / Codex: deterministic verification の成功を記録し、status を `in_review` に更新した。
- 2026-05-03 / Codex: 初回 review finding を受け、`docs/skills/review/SKILL.md` の reviewer prompt 契約を `relevant ExecPlan の完了条件` に統一し、未追跡 file の `no-index --check` 証跡を追加した。
- 2026-05-03 / Codex: 再 review finding を受け、`PLANS.md`、`docs/skills/exec-plan/SKILL.md`、この ExecPlan の delivery 順序を同じ契約へ揃えた。
- 2026-05-03 / Codex: review gate 通過を記録し、status を `in_progress`、next action を `pre_delivery_commit` に更新した。
