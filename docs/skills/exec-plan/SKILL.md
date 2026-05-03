---
name: exec-plan
description: yona.dev専用ExecPlan運用。意図ヒアリングからPLANS準拠計画、実装、multi-agent review、stage/commit、PR作成、CI修正まで既定で進める。
---

# yona.dev ExecPlan Skill

この skill は、yona.dev で `PLANS.md` 準拠の ExecPlan を作成し、その計画から実装、検証、multi-agent review fix loop、stage / commit、PR 作成、CI 修正まで既定で進めるための project-local skill です。正本は `docs/skills/exec-plan/SKILL.md` に置き、Codex 向けの `.codex/skills/exec-plan` と Claude Code 向けの `.claude/skills/exec-plan` は同じ実体への symlink にします。

## 入力契約

| 入力 | 必須 | 説明 |
| --- | --- | --- |
| task | 必須 | ユーザーが達成したい変更、調査、修正 |
| scope | 任意 | 対象 file / route / module / command |
| constraints | 任意 | 変えてはいけない仕様、secret、UI、互換性 |
| acceptance | 任意 | 成功時に観測できる状態 |
| tradeoff | 任意 | 競合時の優先順位 |
| delivery | 任意 | 既定は `commit-pr-ci`。user が明示的に除外した場合だけ `no-commit` / `no-pr` などに狭める |

## 配置契約

- skill 本体の正本は `docs/skills/exec-plan/SKILL.md`。
- `.codex/skills/exec-plan` と `.claude/skills/exec-plan` は `docs/skills/exec-plan` への symlink とし、runtime 別の copy を作らない。
- runtime 差分が必要な場合は、分岐条件をこの skill 本体に書く。

## 使う場面

- `AGENTS.md` の ExecPlan 条件に該当する task。
- ユーザーが「exec-plan」「spec to PR」「計画からPRまで」「CI fixまで」と依頼した時。
- 複数 session、3 files 以上、2 concerns 以上、複数 acceptance、security / server-client / public route / Notes Markdown renderer / frontmatter / Notion sync / UI tradeoff に触れる時。
- repo-wide contract / 恒久規約を触る時。

## 使わない場面

- 1 file の typo、lint の機械修正、read-only 調査など、`AGENTS.md` が確認不要とする小変更。
- PR URL からの review だけを行う時。この場合は `pr-review` を使う。project-local `review` は local diff / branch diff / staged diff / working tree diff 専用。
- 頻繁に変わる手順を `docs/conventions.md` などの恒久規約へ置く目的。この場合は対象 skill 本体に置く。

## 最初に読むもの

1. `AGENTS.md`
2. `PLANS.md`
3. `docs/conventions.md`
4. 既存の relevant ExecPlan
5. review が必要になったら `docs/skills/review/SKILL.md`

## ヒアリング

ExecPlan draft の前に、`PLANS.md` の `grill-me` 型意図確認に従い、次の 5 軸を必ず埋めます。ユーザーが明示していない軸は、まず repo 内の規約、既存コード、過去 ExecPlan、関連 docs で閉じます。実装判断が変わる未解決分岐だけを設計木として残し、依存順に 1 問ずつ質問します。質問を省いた場合は、どの探索結果または明示指示で分岐が閉じたかを ExecPlan の `発見` または `判断` に残します。

| 軸 | 最低限集める内容 |
| --- | --- |
| 目的 | ユーザーから見える成果、避けたい失敗 |
| 制約 | 触らない file / route / API、secret、互換性 |
| 受け入れ条件 | command、UI、PR/CI、観測可能な成功状態 |
| scope 境界 | 対象と対象外、front matter の `review.scope_command`、`review.untracked_paths` |
| tradeoff | 速度、完全性、互換性、UI、security の優先順位 |

質問は 1 問ずつ行い、各質問にはこの repo の既存規約に照らした推奨回答を添えます。3 問以上必要になりそうな場合は、質問を増やす前に探索不足または task 分割不足を疑い、必要なら分割案を作ります。回答が `特になし` の場合も、該当軸を「制約なし」ではなく「明示制約なし」として記録します。

## 既定の実行範囲

ExecPlan を使う task では、ユーザーが明示的に除外しない限り、実装後に検証、multi-agent review fix loop、stage / commit、PR 作成、CI fix までを自律実行します。ExecPlan の `実行計画` にはこの end-to-end path を必ず含めます。

停止条件に該当する場合は、stage / commit / PR / CI fix を無理に進めず、どの条件で止まったかを `受け入れ条件` と `未完了` に残します。

## review-gated completion

ExecPlan task の review は `mise run verify` の代替ではありません。`mise run verify` は deterministic hard guard として実行し、project-local `review` skill は別の review gate として扱います。

承認1 後は、停止条件に該当しない限り次を満たすまで完了扱いにしません。

- `mise run verify` が成功する、または環境変数不足などの原因と未検証範囲が ExecPlan に記録されている。
- `docs/skills/review/SKILL.md` の multi-agent review fix loop が成立している。
- relevant ExecPlan の `発見` または `受け入れ条件` に reviewer ids、verdict、未解決 finding、未検証範囲、実行した verification command が残っている。

Codex Desktop で subagent 起動に user 明示許可が必要な場合、許可がなければ review は `BLOCKED` として停止します。Claude Code 経由では `review` skill の `Claude Code 経由の実行` に従い、`codex exec` reviewer へ委譲します。どちらの場合も単一 reviewer、self review、degraded local check を成立済み review の代替にしてはいけません。

## stage / commit / PR 運用

commit は `commit` skill を正本にします。ExecPlan task では stage / commit / PR 作成 / CI fix を既定 scope とし、承認済みファイルを `git add <approved files>` で stage してから、`commit` skill を使って小さく論理的な単位で commit します。user が `stageしない`、`commitしない`、`PRは作らない`、`CIは見ない` のように明示した場合だけ、その範囲を `契約` と `実行計画` に書いて狭めます。

commit 粒度は、Pro Git、Google Engineering Practices、Conventional Commits の共通原則に従い、次を基準にします。

- 1 commit は 1 つの論理的に独立した changeset にする。1 issue / 1 acceptance / 1 関心事を目安にする。
- review しやすく、あとから revert / drop しやすい単位にする。迷ったら大きすぎる commit より小さめを選ぶ。
- feature / bug fix と大きな refactor、機械的変更、設定変更、生成物更新は原則分ける。小さな局所 cleanup は同じ commit に含めてよい。
- 挙動変更に対応する test / docs / 型更新は、reviewer がその変更を理解・検証するために必要なら同じ commit に含める。
- commit ごとに repo が意味的に壊れないようにする。検証が環境要因で止まる場合は ExecPlan と最終報告に未検証範囲を残す。
- Conventional Commits の type が複数にまたがる場合は、可能な限り複数 commit に分ける。

PR 作成・更新は `pr-writer` skill を正本にします。ExecPlan の実行計画には PR 作成を既定で含め、`pr-writer` skill を使って title / body / 既存 PR 判定 / UI preview / issue 記載を委譲します。関連 issue が無い場合も blocker にせず、`issueなし` を明示入力として `pr-writer` に渡して PR 作成を継続します。
ExecPlan の承認1は、ユーザーが明示的に除外しない限り、`pr-writer` Phase 6 の PR 作成・更新実行承認も兼ねます。

## PR 作成 gate

PR 作成・更新の入口は必ず `pr-writer` skill です。`gh pr create` / `gh pr edit`、GitHub connector、その他の PR 作成・更新 API を、`pr-writer` の Phase 6 実行手段としてではなく直接呼んではいけません。
ExecPlan task では承認1で Phase 6 実行承認が済んでいるため、CREATE / 大幅 UPDATE の直前に別の確認を挟みません。PR template や UI preview 不達など、停止条件に該当する場合だけ止めます。

PR 作成・更新前 checklist:

1. `pr-writer` の CREATE / UPDATE 判定が済んでいる。
2. base branch、current branch、既存 PR の有無を確認済み。
3. `git diff` / `git log` による差分分析が済んでいる。
4. issue 特定結果がある。issue が無い場合は `issueなし` を明示している。
5. PR template 探索結果がある。template が無い場合は標準フォーマットを使う。
6. UI 可視変化の有無と preview 要否を判定済み。
7. title / body を `pr-writer` の Phase 5 で生成済み。

PR 作成・更新後は、relevant ExecPlan の `発見` または `受け入れ条件` に `pr-writer receipt` を残します。receipt には次を含めます。

- mode: CREATE / UPDATE
- base/head branch と既存 PR 判定
- issue 判定。issue が無い場合は `issueなし`
- PR template 判定。template が無い場合は `templateなし / 標準フォーマット`
- UI preview 判定。UI 可視変化がない場合は `preview不要`
- Phase 5 で生成した title / body の要約
- Phase 6 で実行した command
- Phase 7 の `gh pr view` 検証結果

PR 作成・更新後に `pr-writer` を通していないことが判明した場合は、直ちに `pr-writer` の UPDATE モードで body を再生成し、relevant ExecPlan に `pr-writer receipt` と再発防止の修正を残します。

## 実行フロー

1. **scope 判定**: ExecPlan が必要か `AGENTS.md` で判定する。必要なら次へ進む。
2. **ヒアリング**: 5 軸を埋める。Must Ask は実装前に必ず確認する。
3. **ExecPlan 作成**: `docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` を作る。`PLANS.md` の skeleton を使い、冒頭 YAML front matter、準拠文、末尾 `変更記録:` を含める。front matter には `status`, `created_at`, `updated_at`, `owner`, `review.scope_command`, `review.untracked_paths` を入れる。
4. **承認1**: 大きな実装前に user の `go` / 承認を得る。承認後は stage / commit、PR 作成、CI fix までを含む scope 内を自律実行し、`pr-writer` Phase 6 の PR 作成・更新実行承認も得たものとして扱う。
5. **実装**: `実行計画` に沿って小さく編集する。判断変更は `判断` と `変更記録:` に残す。
6. **検証**: 原則 `mise run verify`。環境変数不足で止まる場合は、失敗 command、原因、未検証範囲を ExecPlan と最終報告に残す。
7. **multi-agent review fix loop**: project-local `review` skill を使い、2 つ以上の独立 reviewer を起動する。未解決 finding は scope 内で修正し、同じ reviewer set で最大 2 cycle 再確認する。成立しない場合は完了扱いにしない。成立した場合は reviewer ids、verdict、未解決 finding、未検証範囲、実行した verification command を relevant ExecPlan に残す。
8. **完了準備**: 受け入れ条件を満たしたら、stage / commit 前に front matter の `status` / `updated_at` と `未完了` を更新し、同じ directory 名のまま `docs/exec-plans/active/{YYYYMMDDHHmm_slug}` を `docs/exec-plans/completed/{YYYYMMDDHHmm_slug}` へ移す。移動後は front matter の path-sensitive な `review.scope_command` / `review.untracked_paths` を確認し、完了済み plan の移動を後続 commit に必ず含める。
9. **stage / commit**: user が明示的に除外していなければ、承認済みファイルを `git add <approved files>` で stage し、`commit` skill を使って論理単位ごとに commit する。
10. **PR 作成**: user が明示的に除外していなければ、`pr-writer` skill の Phase 1-7 を通して PR を作成・更新する。関連 issue が無い場合は `issueなし` を明示して進める。
11. **CI fix**: PR CI が失敗したらログを読み、差分起因の failure を修正する。環境・secret・外部障害は blocker として報告し、推測で隠さない。CI fix や blocker 記録で completed ExecPlan を更新した場合は、追加 commit と PR 更新まで行う。
12. **最終確認**: 最終報告前に `docs/exec-plans/active/` を確認し、完了済み plan を残さない。

## PR / CI 契約

- ExecPlan task では、ExecPlan の `受け入れ条件` に PR 作成条件と CI 成功条件を書く。
- PR 作成・更新は `pr-writer` skill を使う。issue が無い task でも PR 作成は止めず、PR body の関連 issue を `なし` として扱う。`pr-writer` を通さない direct PR creation は完了条件を満たさない。
- stage は承認済みファイルだけを対象にし、PR 作成前に `commit` skill で論理的に独立した commit history に整える。必要なら `commit --auto` 相当の自動分割方針を使う。
- CI fix は同じ ExecPlan の scope 内で扱う。scope を超える修正が必要なら user に確認する。
- PR 作成後も CI が red のままなら、green まで fix loop を続けるか、具体的な blocker を報告する。

## 停止条件

- 目的、scope、acceptance のどれかが未確定で、実装結果が変わる。
- destructive action、secret、auth、server-client boundary に関わる確認が未承認。
- multi-agent review が runtime 制約で成立しない。
- user が stage / commit / PR / CI fix の一部を明示的に除外している。
- CI failure が secret / 外部 service / 権限不足で、local から修正できない。

## 完了条件

- ExecPlan が `PLANS.md` の必須 section を満たす。
- `mise run verify` または失敗理由と未検証範囲が記録されている。
- project-local `review` skill の multi-agent review fix loop が成立し、review summary が relevant ExecPlan に記録されている。
- PR 作成・更新を行った場合は、`pr-writer receipt` が relevant ExecPlan に記録されている。
- user が明示的に除外していない限り、承認済みファイルが stage され、commit と PR が作成され、CI が green、または blocker が具体的に報告されている。
- 完了済みの ExecPlan が `docs/exec-plans/active/` に残らず、`docs/exec-plans/completed/` へ移動済みである。
