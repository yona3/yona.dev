# ExecPlan 標準形式

この文書は yona.dev における ExecPlan の共通ルールを定義します。ExecPlan は、Agent が自律実行するための自己完結した実行仕様書です。coding agent または repo に不慣れな人が、現在の working tree とその 1 ファイルだけで task を完了まで進められるように書きます。

この文書は、更新済み `harness-architect` 標準の実行時形式です。`harness-architect` は提案と handoff の skill であり、yona.dev で承認後に実装、review、commit、PR 作成まで進める入口は project-local `exec-plan` skill です。

## 基本方針

- ExecPlan は Agent が自律実行するための living document です。
- PR は reviewer 向け要約です。ExecPlan の全履歴を PR に再掲しません。
- 人間の介入は、開始時の意図注入、必要最小限の初期確認、承認、最後の review またはハーネス改善指示に寄せます。
- Agent は実装中に逐次確認せず、合理的な仮定、判断、検証不能、手戻りを ExecPlan の `記録` に残して進めます。
- レビュー、失敗、迷い、検証不能、手戻りは、必要に応じてハーネス改善として repo の適切な場所へ戻します。
- `AGENTS.md` は地図です。長い規約は `PLANS.md`、repo 固有の詳細は `docs/conventions.md`、domain-specific な詳細は `docs/*` に置きます。
- completed artifact は作成時点の履歴として保持します。旧形式や古い表記は後から現行 schema へ寄せず、参照切れや文体差分も履歴として扱います。

## 使う時

次のいずれかに当てはまる task で ExecPlan を使います。

- 複数 session に跨る。
- repo-wide ルール、review、verify、install、release、security、データ移行を触る。
- 高リスクまたは破壊的。
- 3 ファイル以上、または 2 つ以上の関心事に跨る。
- 検証や review が 1 手では終わらない。
- 後で作業理由や証跡を追う必要がある。

次をすべて満たす小さな task では ExecPlan を省略してよいです。

- 変更が局所的で 2 ファイル以下。
- 低リスク。
- 検証が 1 手で済む。
- 継続用の handoff が不要。

## 状態

`status` は front matter の SSoT とし、次を使います。

| status | 意味 |
| --- | --- |
| `draft` | 初期確認または下書き中 |
| `active` | 承認後、Agent が自律実行中 |
| `blocked` | ユーザー判断、環境、権限、検証不能、review 未成立などで停止中 |
| `review` | 実装と検証が終わり、人間または独立 reviewer の確認待ち |
| `completed` | Done / Verify / Evidence が揃い完了 |
| `superseded` | 別の ExecPlan に置き換えられた |

`blocked` にした時は、front matter の `next.action` を `resolve_blocker` などの再開行動にし、`記録` に `停止理由:` で始まる行を残します。

## 初期確認

ExecPlan 作成時は、先に repo を探索し、コードベース探索で答えられる問いをユーザーに聞きません。

開始時の認識合わせは `grill-me` 型カードで行います。カードは短く、Done / Verify / Risk / Scope に影響する未解決分岐だけを扱います。

```markdown
## 認識合わせカード

- Why: なぜこの task を行うか
- What: 何を変えるか
- Done: 何が観測できれば完了か
- Verify: どのコマンド、テスト、レビューで確認するか
- Risk: 失敗時の影響、戻し方、権限、データ影響
- Non-goals: 今回やらないこと
- Context: 根拠 path、Issue / PR、関連 docs、既存規約
- Questions: Done / Verify / Risk / Scope を変える未解決分岐だけ
```

- 質問は 1 問ずつ、最大 5 問までにします。
- 各質問には推奨回答と理由を 1 文で添えます。推奨回答は「この repo の現行規約と探索結果に照らすと、この答えが最も安全」という形にします。
- 質問が不要な場合も、探索で確認した意図と質問を省いた理由を `初期確認` と `記録` に残します。
- 5 問を超えそうな場合は、質問を増やす前に探索不足または task 分割不足を疑い、分割案を提示します。

## front matter

front matter は機械が読む SSoT であり、キーと列挙値は ASCII 固定語にします。値の説明や人間向け補足は本文に書きます。

必須キーは次のとおりです。

```yaml
---
schema: exec-plan/harness-v1
status: draft
task:
  key: "YYYYMMDDHHmm_slug"
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
  scope_command: "git diff -- path/to/file"
  untracked_paths: []
approval:
  state: pending
handoff: human_review
next:
  actor: human
  action: approve
---
```

列挙値の標準は次のとおりです。

- `schema`: `exec-plan/harness-v1`
- `status`: `draft`、`active`、`blocked`、`review`、`completed`、`superseded`
- `source.kind`: `github_issue`、`github_pr`、`manual`、`none`
- `workspace.mode`: `current_branch`、`worktree`
- `delivery.kind`: `pull_request`、`main_push`、`local_only`
- `approval.state`: `pending`、`approved`、`not_required`
- `handoff`: `human_review`、`implementation_handoff`、`done_after_verify`
- `next.actor`: `human`、`agent`
- `review.required`: `true`、`false`。`AGENTS.md`、`PLANS.md`、`docs/conventions.md`、`docs/skills/`、install、verify、PR workflow のように repo-wide contract へ当たる task では `true` にします。
- `review.untracked_paths`: `git diff -- ...` に出ない未追跡 path の一覧。無い場合は `[]` にします。
- `verify.command`: 原則 `mise run verify`。この repo で別の `verify.sh` や hidden pipeline は定義しません。

`workspace.mode: worktree` は、作業 branch と checkout root を main から分離し、並列作業の単位として扱うことを表します。この repo では専用 preflight script を定義しません。worktree 固有の既知制約があれば対象 ExecPlan の `記録` に残します。

`delivery.kind: pull_request` は標準 delivery です。commit 後に `pr-writer` skill の CREATE / UPDATE mode を通し、PR checks を確認します。`main_push` はユーザーが明示した時だけ使い、merge 前後の verify と rollback 方針を対象 ExecPlan に書きます。

## yona.dev workflow

yona.dev の ExecPlan task は、ユーザーが明示的に除外しない限り、次を既定の自律実行範囲に含めます。

1. `exec-plan`: 探索、初期確認、draft 提示、承認待ち。
2. `build`: 承認後の実装、`mise run verify`、independent review、review fix loop。
3. `pre-delivery commit`: verify / review gate 通過後の小さな論理 commit。
4. `PR`: `pr-writer` skill による PR 作成または更新。
5. `receipt`: `pr-writer receipt` を ExecPlan の `記録` に残す。
6. `completed move`: active ExecPlan を同じ directory 名で `docs/exec-plans/completed/` へ移す。
7. `receipt/move commit`: receipt と completed move を追加 commit する。
8. `CI fix`: 差分起因の CI failure を同じ ExecPlan scope で修正する。

completion gate 通過後の commit / PR / CI fix は、yona.dev の repo policy として許可する guardrail です。別 repo へ移植する時は、その repo の `PLANS.md` / `AGENTS.md` / policy が許す場合だけ採用します。

PR 作成・更新は必ず `pr-writer` skill を入口にします。ExecPlan の承認は、ユーザーが明示的に除外しない限り、`pr-writer` Phase 6 の PR 作成・更新実行承認も兼ねます。CREATE / 大幅 UPDATE の直前に別の確認を挟みません。PR template や UI preview 不達など、停止条件に該当する場合だけ止めます。

## 責務境界

ExecPlan 周辺の文書とスキルは、次の境界で読みます。書式や節構造に迷った場合は `PLANS.md` を優先し、スキルや実行時入口へ重ねて定義しません。

| 対象 | 主な責務 | 置かないもの |
| --- | --- | --- |
| `PLANS.md` | ExecPlan の構造、状態、初期確認、front matter、更新規則、完了ゲート | 通常応答の文体、個別タスクの判断、スキル実行手順の詳細 |
| `AGENTS.md` | agent 行動契約、いつ ExecPlan を使うか、repo / runtime 固有の入口 | ExecPlan の詳細な構造定義、個別タスクの実行計画 |
| `docs/conventions.md` | repo 固有の詳細規約、質問規約、レビュー観点、再発知識 | ExecPlan schema の再定義、常時読む必要のある巨大 checklist |
| `docs/skills/exec-plan/SKILL.md` | `PLANS.md` を使って ExecPlan を作成・更新し、承認後に実行する手順 | 節順序や固定ラベルの再定義、verify の検査仕様、タスク個別の恒久記録 |
| `docs/skills/review/SKILL.md` | relevant ExecPlan の front matter scope と `完了` を使った independent review と fix loop | 書式の SSoT、`mise run verify` の代替、PR URL review |
| `docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` | 個別 task の目的、完了、初期確認、範囲、方針、リスク、記録、PR 要約 | リポジトリ共通規約、別タスクの履歴、通常応答の文体 |
| `mise.toml` | `mise run verify`、lint、build など deterministic verification の入口 | ExecPlan 書式、review verdict、タスク判断 |
| `harness-architect` | 未導入 repo や既存規約の標準化に向けた Discover / Proposal / handoff | yona.dev の実行時 workflow の直接実装、承認前の scaffold、配線変更、PR 作成 |

## 必須要件

- 自己完結: 外部チャット、口頭説明、暗黙知に依存しない。
- 実行自足: 実行に必要なファイル、コマンド、確認方法を明示する。
- 初見向け: リポジトリに不慣れでも迷わない粒度で書く。
- 成果基準: 何をどう確認して完了とみなすかを具体化する。
- 平易な言葉: repo 固有語や一般的でない技術用語は、その場で平易に定義する。
- 明示文脈: file path、working directory、command、期待結果、前提条件を明記する。個人の絶対 path は commit される ExecPlan に残さない。
- 生きた文書: 実装中に `完了`、`方針`、`リスク`、`記録`、`PR` を更新し続ける。
- ゲート意識: approval gate と自律実行フェーズの境界を明示し、どこで人間判断が必要かを曖昧にしない。
- 成功基準: 状態を持たない単独の agent または初見の人が ExecPlan を上から順に読み、観測できる成果を再現できる状態にする。

## 記述規則

- ExecPlan を作成・更新する前に、この `PLANS.md` を最初から最後まで読み直します。記憶に頼りません。
- 置き場所は `docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` を標準とします。
- completion gate を満たした relevant な task は、同じ directory 名のまま `docs/exec-plans/completed/{YYYYMMDDHHmm_slug}/exec-plan.md` へ移します。
- completed へ移動した ExecPlan は履歴として凍結し、後続の schema 更新、参照切れ修正、文体調整のために書き換えません。
- command、transcript、diff、code block は fenced code block で書きます。inline backtick code は短い識別子や path に限定します。
- ExecPlan を単独 file として保存する場合、plan 全体を Markdown fence で囲みません。
- 実際に触るファイルパス、コマンド、期待結果を書きます。function 名、module 名、type 名も省略せず正確に書きます。
- 実行 checklist を置く場合は `方針` に置き、時刻付きにします。時刻形式は `YYYY-MM-DD HH:MM+09:00`（日本時間）とし、UTC `Z` suffix は使いません。
- `review.required`、`review.scope_command`、`review.untracked_paths` は front matter を SSoT にします。本文にレビュー範囲を再掲しません。新規 ExecPlan など `git diff -- ...` に出ない path が review 対象なら、ここへ明示します。
- `verify.command` は front matter を SSoT にします。本文では必要なら「front matter の `verify.command` が成功する」のように短く参照します。
- `review.required: true` の ExecPlan は、completion gate 通過前に `記録` へ `レビュー通過:` で始まる固定行を 1 行残します。固定行には `contract-reviewer=APPROVE`、`ce-reviewer=APPROVE`、`レビュー未成立なし`、`verify=pass` を含めます。security 境界を含む task では `security-reviewer=APPROVE` も含め、それ以外では `security-reviewer=not_required` を含めます。
- PR 作成・更新を行った ExecPlan は、completion gate 通過前に `記録` へ `pr-writer receipt:` で始まる固定行または箇条書きを残します。mode、base/head、既存 PR 判定、issue 判定、template 判定、UI preview 判定、title/body 生成、実行 command、`gh pr view` 検証を含めます。
- 表は Done / Verify / Evidence / Status や複数候補の比較のように、列方向の比較が読む助けになる時だけ使います。
- repo 共通規約はこの `PLANS.md` に置き、個別 task にしか意味のない内容だけを各 ExecPlan に書きます。
- repo-level の再開スナップショット file は持ちません。再開に必要な状態は active ExecPlan の living sections と front matter に残します。
- `pipeline` や hidden runtime appendix file のような別系統の実行ルールは使いません。
- ユーザーに見える効果（振る舞い、I/O、証跡）は詳しめに書き、内部実装の偶発的な詳細は詳述しすぎません。書き分けに迷ったら「読み手が再現に使えるか」を基準にします。

## 必須 section

各 ExecPlan は次の `##` 見出しをこの名前と順序で持ちます。

1. `## 実行契約`
2. `## 目的`
3. `## 完了`
4. `## 初期確認`
5. `## 範囲`
6. `## リポジトリ`
7. `## 方針`
8. `## リスク`
9. `## 記録`
10. `## PR`

## section の役割

### `実行契約`

status、task key、作業場所、実行主体、承認状態、verify、review、権限、停止条件を短く置きます。機械可読な値は front matter に置き、本文では読者向けに短く説明します。

### `目的`

Why / What を書きます。実装詳細ではなく、変更後にユーザーまたは reviewer が何を観測できるかを書きます。

### `完了`

Done / Verify / Evidence / Status の対応表を置きます。完了には、停止条件や未検証事項も含めます。`Verify` 不能な場合は `blocked` にし、再開条件を `記録` に残します。

```markdown
| Done | Verify | Evidence | Status |
| --- | --- | --- | --- |
| 完了状態を観測可能な言葉で書く | コマンド、テスト、レビュー、手動確認を書く | 出力、ログ、スクリーンショット、review 結果などを記録する | `draft` / `active` / `blocked` / `review` / `completed` / `superseded` |
```

### `初期確認`

認識合わせカード、質問した内容、質問を省いた理由、仮定を置きます。質問が不要な場合もこの section を空にしません。

### `範囲`

対象、対象外、Non-goals、触らない path、承認が必要な操作を書きます。repo 固有の詳細を長く置く必要がある場合は、`docs/*` へ逃がしてここから参照します。

### `リポジトリ`

関連ファイル、既存規約、標準コマンド、Issue / PR template、review checklist、testing / release / security docs、CI、active ExecPlan の実例を根拠 path 付きで書きます。

### `方針`

実装方針、作業順、検証順、委譲、handoff を書きます。Done / Verify / Stop / Risk を読まないと判断できない事項をここで初出にしません。

### `リスク`

Risk、Stop、権限、データ影響、rollback、検証不能時の扱いを書きます。中リスク以上では省略しません。

### `記録`

発見、判断、仮定、変更履歴、レビュー結果、検証不能、手戻り、ハーネス改善候補を残します。実装中の逐次確認の代わりに、合理的な仮定と理由をここへ記録します。

active ExecPlan の `記録` には、`意図確認完了: 設計木=解決, 質問=完了または不要, 推奨回答=提示済みまたは不要, 探索回答=反映済み, 未解決意思決定=なし` を 1 行含めます。`status: blocked` でユーザー判断待ちの場合だけ、この固定行が無い状態を許容します。

### `PR`

reviewer 向け要約を書きます。ExecPlan の再掲ではなく、変更内容、検証、リスク、未解決点、review 観点を短くまとめます。

## リスク別の密度

| リスク | 記述密度 |
| --- | --- |
| 低 | Done / Verify / Risk / 範囲を短く書く。実装方針は簡潔でよい |
| 中 | 標準密度。認識合わせカード、完了対応表、リポジトリ根拠、検証証拠、rollback を書く |
| 高 | リスク、権限、データ影響、rollback、検証、review、停止条件を省略しない。必要なら security / release / data migration docs へ分離する |

## high-risk guardrail

高リスク task では次を必須候補にします。

- destructive operation、データ変更、認証、外部送信、秘密情報、release、install、依存追加を明示する。
- 権限と承認が必要な操作を実行前に分ける。
- rollback / restore / abort 手順を書く。
- 検証証拠を Done と対応させる。
- security / reliability / release docs がある場合は参照する。
- 独立レビューまたは外部レビューが必要かを明示する。
- 検証不能なら `blocked` にし、再開条件を残す。

## リポジトリ規約

- `AGENTS.md` は agent 行動契約の SSoT。
- この `PLANS.md` は ExecPlan の schema と更新ルールの SSoT。
- `docs/conventions.md` は repo 固有の詳細規約。
- `docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` は個別 task の SSoT。
- `mise.toml` は deterministic verification の SSoT。最終 hard guard は `mise run verify`。
- project-local `review` は relevant ExecPlan の `完了` と front matter scope を主要基準に review します。
- `review` skill は relevant ExecPlan の front matter にある `review.required`、`review.scope_command`、`review.untracked_paths` を主変更集合として優先します。
- `pr-writer` skill は PR 作成・更新の唯一の入口です。

## ひな形

ひな形本体は Markdown として直接書きます。ExecPlan を単独 file として保存する場合、plan 全体を Markdown fence で wrap しません。

```markdown
---
schema: exec-plan/harness-v1
status: draft
task:
  key: "{YYYYMMDDHHmm_slug}"
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
  scope_command: "git diff -- {paths}"
  untracked_paths: []
approval:
  state: pending
handoff: human_review
next:
  actor: human
  action: approve
---

# {タスク名}

## 実行契約

status は `draft`。承認後に `active` へ更新し、front matter の `verify.command` と `review` scope を SSoT として進める。

## 目的

Why: なぜこの task を行うかを書く。

What: 何を変えるかを書く。

ユーザーに見える効果: 完了後に観測できる状態を書く。

## 完了

| Done | Verify | Evidence | Status |
| --- | --- | --- | --- |
| 完了時にユーザーが観測できる状態を書く | front matter の `verify.command` | 実行結果を記録する | `draft` |
| 独立 review が必要な場合、review が通っている | front matter の `review.scope_command` と `review.untracked_paths` | `レビュー通過:` 固定行 | `draft` |
| PR 作成・更新が必要な場合、receipt が残っている | `pr-writer` Phase 1-7 | `pr-writer receipt:` 固定行 | `draft` |

## 初期確認

### 認識合わせカード

- Why:
- What:
- Done:
- Verify:
- Risk:
- Non-goals:
- Context:
- Questions:

質問を省く場合も、探索または明示指示で設計木が閉じた理由を書く。

## 範囲

### 対象

- 触る file / module / service / 振る舞いを書く。

### 対象外

- 明示的に触らない領域を書く。

### 承認が必要な操作

- destructive operation、secret、外部送信、権限操作があれば書く。なければ none。

## リポジトリ

- 関連規約、関連ファイル、標準コマンド、CI、review checklist、既存 ExecPlan を根拠 path 付きで書く。

## 方針

### 手順

- [ ] YYYY-MM-DD HH:MM+09:00 最初の作業を書く。

### 委譲

- `review.required: true`: 承認後に追加承認を待たず、必要な reviewer set を別コンテキストで起動する。期待する出力は `verdict`、`findings`、`evidence`、`blocker`、`confidence`。

### handoff

- 次に渡す相手、渡す条件、渡す内容を書く。不要なら none。

## リスク

- Stop:
- Risk:
- Rollback:
- 検証不能時:

## 記録

### 発見

- YYYY-MM-DD / 担当: 探索で分かった事実を書く。

### 判断

- YYYY-MM-DD / 担当: 決めたことと理由を書く。
- YYYY-MM-DD / 担当: 意図確認完了: 設計木=解決, 質問=完了または不要, 推奨回答=提示済みまたは不要, 探索回答=反映済み, 未解決意思決定=なし

### 仮定

- YYYY-MM-DD / 担当: 自律実行のために置いた仮定を書く。なければ none。

### 変更履歴

- YYYY-MM-DD / 担当: 初回作成。

## PR

Summary:

Verification:

Risk / rollback:

Review focus:
```
