---
name: exec-plan
description: yona.dev専用ExecPlan運用。PLANS準拠の計画作成、承認後の実装、review、commit、pr-writer、CI fixまで既定で進める。
---

# yona.dev ExecPlan Skill

この skill は、yona.dev で `PLANS.md` に従って ExecPlan を作成・更新し、承認後に実装、検証、review fix loop、stage / commit、PR 作成・更新、CI fix まで進める入口です。正本は `docs/skills/exec-plan/SKILL.md` に置き、Codex 向けの `.codex/skills/exec-plan` と Claude Code 向けの `.claude/skills/exec-plan` は同じ実体への symlink にします。

## まず読むもの

1. `PLANS.md`
2. `AGENTS.md`
3. `docs/conventions.md`
4. 既存の有効な ExecPlan と変更対象
5. review が必要になったら `docs/skills/review/SKILL.md`

## 責務

- `AGENTS.md` の ExecPlan 条件またはユーザーの明示依頼に基づき、ExecPlan を作成または更新する。
- `PLANS.md` を読み、その内容に従って `docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` を作る。
- `PLANS.md` の `grill-me` 型意図確認を実施し、未解決の設計分岐を完了してから ExecPlan draft を提示する。
- 承認後は、ユーザーが明示的に除外しない限り、実装、`mise run verify`、project-local review fix loop、stage / commit、`pr-writer` による PR 作成・更新、CI fix まで進める。
- 実装中に現実が plan とずれたら、active ExecPlan の `完了`、`方針`、`リスク`、`記録`、`PR` を更新する。

## 非責務

- ExecPlan の構造、節順序、front matter、完了ゲートを再定義すること。
- `PLANS.md` の代わりに判断基準や作業手順を定義すること。
- `mise run verify` の検査仕様を代替すること。
- `pr-writer` 以外の入口で PR を作成・更新すること。
- PR URL からの review。PR URL review は `pr-review` に委譲する。

## 手順

1. `PLANS.md` を読む。
2. `AGENTS.md` と `PLANS.md` に従い、ExecPlan が必要な依頼か確認する。
3. 変更対象、既存規約、関連する有効 ExecPlan を探索し、コードベース探索で解ける問いを先に潰す。
4. 探索結果から設計木を作り、目的、Done、Verify、Risk、Scope、Non-goals に影響する未解決分岐を洗い出す。
5. ユーザーが明示していない読み取り範囲、対象外、出力先、証跡の残し方、ログや履歴を読むかどうかを安全側に狭める候補は、探索やユーザー明示で閉じておらず、目的、Done、Verify、Risk、Scope、Non-goals を変える場合に未解決分岐として列挙する。
6. 探索やユーザーの明示指示で閉じた分岐はユーザーに聞かず、どの根拠で閉じたかを draft の `初期確認` と `記録` に残す。
7. 未解決の設計分岐が残る場合は `grill-me` 型で 1 問ずつ確認し、各質問には推奨回答と理由を 1 文で添える。回答を受けるまで ExecPlan draft を提示しない。
8. 3 問以上必要になりそうなら、質問を増やす前に探索不足またはタスク分割不足を疑い、分割単位ごとの意思決定へ整理する。
9. 設計木が解決し、未解決意思決定がないことを `記録 > 判断` の `意図確認完了:` 固定行に残す。
10. `PLANS.md` の front matter、section 順序、承認、検証、review、完了手順に従って ExecPlan を作成または更新する。
11. draft を提示し、`status: draft` / `approval.state: pending` / `next.action: approve` で止める。ユーザーが既に明示承認している場合は、その承認を `記録 > 判断` に残してから実装へ進む。
12. 承認後は `status: active` / `approval.state: approved` / `next.actor: agent` に更新し、`方針` に沿って実装する。
13. front matter の `verify.command` を実行する。yona.dev の既定は `mise run verify`。
14. `review.required: true` の場合は `docs/skills/review/SKILL.md` に従い、2 つ以上の independent reviewer による review fix loop を通す。
15. verify / review gate を満たしたら、`commit` skill で承認済みファイルだけを小さく論理的な単位で pre-delivery commit する。
16. `delivery.kind: pull_request` の場合は、`pr-writer` skill の Phase 1-7 を通して PR を作成・更新する。関連 issue がない場合は `issueなし` を明示して進める。
17. PR 作成・更新後は、relevant ExecPlan の `記録 > 発見` に `pr-writer receipt` を残す。mode、base/head、既存 PR 判定、issue 判定、template 判定、UI preview 判定、title/body 生成、実行 command、`gh pr view` 検証を含める。
18. completion gate を満たしたら active ExecPlan を同じ directory 名のまま `docs/exec-plans/completed/` へ移し、front matter を `status: completed` / `handoff: done_after_verify` に更新する。
19. `commit` skill で receipt / completed move を追加 commit し、push する。
20. PR checks を確認し、差分起因の failure は同じ ExecPlan scope で修正する。環境・secret・外部 service・権限不足は blocker として `記録` と最終報告に残す。

## PR / CI 契約

- PR 作成・更新の入口は必ず `pr-writer` skill です。
- `gh pr create` / `gh pr edit`、GitHub connector、その他の PR 作成・更新 API は、`pr-writer` の Phase 6 実行手段としてだけ使います。
- ExecPlan の承認は、ユーザーが明示的に除外しない限り、`pr-writer` Phase 6 の PR 作成・更新実行承認も兼ねます。
- PR 作成・更新後は、relevant ExecPlan の `記録 > 発見` に `pr-writer receipt` を残します。mode、base/head、既存 PR 判定、issue 判定、template 判定、UI preview 判定、title/body 生成、実行 command、`gh pr view` 検証を含めます。
- PR 作成後も CI が red のままなら、green まで fix loop を続けるか、具体的な blocker を報告します。

## 停止条件

- 目的、Done、Verify、Risk、Scope のどれかが未確定で、実装結果が変わる。
- destructive action、secret、auth、server-client boundary に関わる確認が未承認。
- multi-agent review が runtime 制約で成立しない。
- ユーザーが stage / commit / PR / CI fix の一部を明示的に除外している。
- CI failure が secret / 外部 service / 権限不足で、local から修正できない。

## 完了

- ExecPlan が `PLANS.md` の `exec-plan/harness-v1` front matter と必須 section を満たす。
- front matter の `verify.command` が成功している、または失敗理由と未検証範囲が `記録` に残っている。
- `review.required: true` の場合、project-local `review` skill の review fix loop が成立し、`レビュー通過:` 固定行が relevant ExecPlan に記録されている。
- PR 作成・更新を行った場合、`pr-writer receipt` が relevant ExecPlan に記録されている。
- ユーザーが明示的に除外していない限り、承認済みファイルが stage され、commit と PR が作成または更新され、CI が green、または blocker が具体的に報告されている。
- 完了済みの ExecPlan が `docs/exec-plans/active/` に残らず、`docs/exec-plans/completed/` へ移動済みである。
