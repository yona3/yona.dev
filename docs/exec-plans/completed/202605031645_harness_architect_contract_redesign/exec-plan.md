---
schema: exec-plan/harness-v1
status: completed
task:
  key: "202605031645_harness_architect_contract_redesign"
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
  scope_command: "git diff -- PLANS.md AGENTS.md docs/conventions.md docs/skills/exec-plan/SKILL.md docs/skills/review/SKILL.md docs/exec-plans/completed/202605031645_harness_architect_contract_redesign/exec-plan.md"
  untracked_paths: []
approval:
  state: approved
handoff: done_after_verify
next:
  actor: agent
  action: done
---

# harness-architect 標準に基づく規約再設計

## 実行契約

status は `completed`。ユーザーの「標準仕様を更新しました。規約の再設計」と、続く参照元切り替えの指示を承認済みの設計入力として扱い、`harness-architect` と `references/standard-plans.md` を基準に yona.dev の ExecPlan 規約を再設計した。

front matter の `verify.command` が deterministic verification の SSoT。front matter の `review.scope_command` と `review.untracked_paths` が review scope の SSoT。PR 作成・更新は `pr-writer` skill 経由で行う。

## 目的

Why: 更新済み `harness-architect` 標準に合わせ、yona.dev の ExecPlan / skill / review / PR workflow 規約を再設計する。

What: `PLANS.md` を `harness-architect/references/standard-plans.md` の10 section形式へ移行し、関連する `AGENTS.md`、`docs/conventions.md`、project-local skills の参照を合わせる。

ユーザーに見える効果: 新規 active ExecPlan が `実行契約`、`目的`、`完了`、`初期確認`、`範囲`、`リポジトリ`、`方針`、`リスク`、`記録`、`PR` の順で作成され、Done / Verify / Evidence / Status を先に読める。

## 完了

| Done | Verify | Evidence | Status |
| --- | --- | --- | --- |
| `PLANS.md` が `harness-architect` 標準の10 section、状態、初期確認、Done / Verify / Evidence / Status 表を定義している | `rg -n "実行契約|Done \\| Verify \\| Evidence \\| Status|schema: exec-plan/harness-v1" PLANS.md` | 該当行を確認済み | `completed` |
| `AGENTS.md`、`docs/conventions.md`、`docs/skills/exec-plan/SKILL.md`、`docs/skills/review/SKILL.md` が新 section 名と schema を参照している | front matter の `review.scope_command` と旧 schema / 旧 section 名の残存検索 | 旧形式の残存検索は `AGENTS.md` の通常見出し `作業境界` だけ | `completed` |
| この ExecPlan 自体が `exec-plan/harness-v1` と10 section形式へ移行されている | `sed -n '1,220p' docs/exec-plans/completed/202605031645_harness_architect_contract_redesign/exec-plan.md` | この file | `completed` |
| deterministic verification が通る | front matter の `verify.command` | `mise run verify` 成功。lint と Next build が exit 0 | `completed` |
| independent review gate が通る | project-local `review` skill 相当で `contract-reviewer` と `ce-reviewer` を起動 | `contract-reviewer=APPROVE`、`ce-reviewer=APPROVE`、findings なし | `completed` |
| PR #25 が `pr-writer` UPDATE mode で更新され、CI が green または blocker が具体化されている | `gh pr view 25 --json title,body,url,headRefOid,statusCheckRollup` | PR body 反映済み。Vercel と Vercel Preview Comments は SUCCESS | `completed` |

## 初期確認

### 認識合わせカード

- Why: 更新済み `harness-architect` 標準へ yona.dev の規約を合わせるため。
- What: `PLANS.md` と関連 docs / skills の ExecPlan schema、section 名、review 参照、PR workflow 参照を更新する。
- Done: `exec-plan/harness-v1` と10 section形式が新規 active ExecPlan の標準になり、verify / review / PR update の証跡が残る。
- Verify: `rg` による旧形式残存確認、front matter parse、`mise run verify`、independent review、PR check。
- Risk: repo-wide contract 変更のため、古い section 名が skill / review に残ると次回以降の ExecPlan 作成や review が drift する。
- Non-goals: app 本体 `web/` の挙動変更、hidden runtime / pipeline / scaffold の追加、completed ExecPlan の一括変換、`harness-architect` skill 自体の編集。
- Context: `harness-architect` SKILL、`references/standard-plans.md`、`references/design-guide.md`、`references/hearing-criteria.md`、現行 `PLANS.md`、`AGENTS.md`、`docs/conventions.md`、project-local skills。
- Questions: なし。ユーザーが最新指示で参照元の切り替えを明示したため、設計木は閉じている。

質問は不要。理由: 変更対象、採用する標準、対象外、delivery はユーザー指示と repo 既存規約で閉じている。

## 範囲

### 対象

- `PLANS.md`: ExecPlan schema、状態、初期確認、必須 section、ひな形、記述規則、yona.dev workflow。
- `AGENTS.md`: ExecPlan review verdict と self-contained Done / Verify wording の入口。
- `docs/conventions.md`: Cold 層の配置、review gate、test list / acceptance、schema 名。
- `docs/skills/exec-plan/SKILL.md`: `exec-plan/harness-v1` と新 section 名に合わせた作成・実行手順。
- `docs/skills/review/SKILL.md`: `完了` section と `exec-plan/harness-v1` front matter を primary scope として扱う契約。
- この ExecPlan: task artifact として新形式へ移行し、検証と receipt を残す。

### 対象外

- `web/` のアプリ挙動。
- hidden runtime namespace、別 pipeline、bootstrap、scaffold、runner 実装。
- completed ExecPlan の一括変換。
- `harness-architect` skill 本体とその references の編集。

### 承認が必要な操作

追加の承認が必要な destructive operation、secret、外部送信、権限操作はない。commit / PR update / CI fix は yona.dev の ExecPlan repo policy に含まれる。

## リポジトリ

- `AGENTS.md`: agent 行動契約、標準コマンド、ExecPlan 使用条件、PR 作成入口。
- `PLANS.md`: ExecPlan schema と更新規則の SSoT。
- `docs/conventions.md`: repo 固有詳細、review gate、question policy、TDD policy。
- `docs/skills/exec-plan/SKILL.md`: ExecPlan 作成と承認後実行の project-local skill。
- `docs/skills/review/SKILL.md`: independent review と fix loop の project-local skill。
- `mise.toml`: `mise run verify` が lint と build を実行する hard guard。
- `.codex/skills/*` と `.claude/skills/*`: `docs/skills/*` への symlink。

## 方針

### 手順

- [x] 2026-05-03 16:45+09:00 対象 repo、更新済み `harness-architect`、standard-plans、design-guide、hearing-criteria、現行 completed ExecPlan を確認した。
- [x] 2026-05-03 16:45+09:00 この ExecPlan を作成した。
- [x] 2026-05-03 16:50+09:00 ユーザーの参照元切り替え指示を受け、基準を `harness-architect` 標準へ切り替えた。
- [x] 2026-05-03 16:50+09:00 `PLANS.md` を `harness-architect` 標準の10 section形式へ置き換えた。
- [x] 2026-05-03 16:50+09:00 `AGENTS.md`、`docs/conventions.md`、`docs/skills/exec-plan/SKILL.md`、`docs/skills/review/SKILL.md` の旧 section / schema 参照を更新した。
- [x] 2026-05-03 16:50+09:00 `rg`、front matter parse、`git diff --check`、`mise run verify` を実行した。
- [x] 2026-05-03 16:58+09:00 `contract-reviewer` と `ce-reviewer` の review fix loop を通した。
- [x] 2026-05-03 17:05+09:00 pre-delivery commit、push、PR #25 update、receipt 記録、completed move、receipt/move commit、PR checks 確認まで進める。

### 委譲

- `review.required: true`: 承認後に追加承認を待たず、`contract-reviewer` と `ce-reviewer` を別コンテキストで起動する。期待する出力は `verdict`、`findings`、`evidence`、`blocker`、`confidence`。結論が対立した場合は `REQUEST_CHANGES` を優先し、修正後に再レビューする。起動不能の場合は `blocked` にする。
- `contract-reviewer`: `AGENTS.md`、`PLANS.md`、`docs/conventions.md`、project-local skills、PR 作成契約、verify 契約との矛盾を確認する。
- `ce-reviewer`: SSoT、context clash、lost-in-middle、artifact trail、`harness-architect` 標準からの不必要な逸脱を確認する。

### handoff

handoff は不要。yona.dev ではこの `exec-plan` workflow の中で実装、verify、review、PR update まで進める。

## リスク

- Stop: `PLANS.md` と project-local skills の section 名が矛盾する場合、review 前に修正する。
- Risk: repo-wide contract 変更なので、旧 schema 参照が残ると次回の ExecPlan 作成と review scope 決定がずれる。
- Rollback: docs-only の変更に留めるため、問題があれば該当 hunk だけを revert できる。
- 検証不能時: `mise run verify` または review が環境要因で失敗した場合は、差分起因か環境起因かを分け、`blocked` と再開条件を `記録` に残す。

## 記録

### 発見

- 2026-05-03 / Codex: 更新後の `harness-architect` は提案専用であり、承認前に対象 repo へファイル生成、scaffold、配線変更を行わない。承認後の handoff は `workflow-builder` / `build` / 対象 repo の実装 skill へ渡す。
- 2026-05-03 / Codex: `harness-architect/references/standard-plans.md` は `実行契約`、`目的`、`完了`、`初期確認`、`範囲`、`リポジトリ`、`方針`、`リスク`、`記録`、`PR` の10 section構成を標準としている。
- 2026-05-03 / Codex: PR #25 は open で、branch は `codex/harness-standard-rebuild`、直近確認時点の Vercel checks は成功している。
- 2026-05-03 / Codex: `git diff --check` は出力なしで成功した。front matter parse は `schema=exec-plan/harness-v1`、`status=active`、`review.scope_command`、`review.untracked_paths` を確認して成功した。Ruby の `ffi` warning は出たが parse command は exit 0。
- 2026-05-03 / Codex: 旧形式残存検索は `AGENTS.md` の通常見出し `作業境界` だけを返した。旧 schema、旧 status、旧 ExecPlan section 名の実運用参照は対象範囲に残っていない。
- 2026-05-03 / Codex: `mise run verify` は成功した。lint と Next build は exit 0。mise cache write warning は出たが command は成功した。
- 2026-05-03 / Codex: レビュー通過: contract-reviewer=APPROVE, ce-reviewer=APPROVE, security-reviewer=not_required, レビュー未成立なし, findings=0, blocker=none, 未検証範囲=なし。
- 2026-05-03 / Codex: pr-writer receipt: mode=UPDATE, base=main, head=codex/harness-standard-rebuild, existing_pr=#25 open, issue=issueなし, template=なし, UI preview=不要, title=`docs(harness): 標準仕様へ再構築`, body=標準フォーマット, command=`gh pr edit 25 --title ... --body ...`, verification=`gh pr view 25 --json title,body,url,headRefOid,statusCheckRollup`, URL=https://github.com/yona3/yona.dev/pull/25, checks=Vercel SUCCESS / Vercel Preview Comments SUCCESS。
- 2026-05-03 / Codex: completed move: `docs/exec-plans/active/202605031645_harness_architect_contract_redesign/exec-plan.md` から `docs/exec-plans/completed/202605031645_harness_architect_contract_redesign/exec-plan.md` へ移動した。

### 判断

- 2026-05-03 / Codex: `PLANS.md` は `harness-architect/references/standard-plans.md` の10 section形式へ移行する。理由: ユーザーが最新指示で参照元の切り替えを明示したため。
- 2026-05-03 / Codex: completed ExecPlan は一括変換しない。理由: `harness-architect` 標準は completed artifact を履歴として扱い、active ExecPlan だけを移行対象にするため。
- 2026-05-03 / Codex: completion gate 通過後の commit / PR / CI fix は yona.dev の repo policy として維持する。理由: `AGENTS.md` と既存 workflow が ExecPlan task での自動 delivery を明示的に許可しており、ユーザーも承認から PR 作成まで自動で行う workflow を求めているため。
- 2026-05-03 / Codex: 意図確認完了: 設計木=解決, 質問=不要, 推奨回答=不要, 探索回答=反映済み, 未解決意思決定=なし

### 仮定

- 2026-05-03 / Codex: `harness-architect` 標準を実行時へ取り込む対象は yona.dev repo であり、`harness-architect` skill 本体の編集は対象外とする。

### 変更履歴

- 2026-05-03 / Codex: 更新後 `harness-architect` 標準に基づく規約再設計の ExecPlan を作成した。
- 2026-05-03 / Codex: 最新指示に基づき、この ExecPlan を `exec-plan/harness-v1` と10 section形式へ移行した。
- 2026-05-03 / Codex: deterministic verification の成功を記録した。
- 2026-05-03 / Codex: independent review gate 通過を記録した。
- 2026-05-03 / Codex: PR #25 更新 receipt と completed move を記録した。

## PR

Summary: ExecPlan 標準を `harness-architect` の10 section形式へ移行し、関連 docs / skills の参照を更新する。

Verification: `rg`、front matter parse、`git diff --check`、`mise run verify`、independent review、PR checks。

Risk / rollback: docs-only の repo-wide contract 変更。問題があれば該当 hunk を revert し、旧 schema 参照の残存を `rg` で再確認する。

Review focus: `PLANS.md` と project-local skills の section 名、schema、review scope、PR workflow が矛盾していないか。
