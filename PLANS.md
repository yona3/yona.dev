# ExecPlan 標準形式

この文書は yona.dev における ExecPlan の共通ルールを定義します。ExecPlan は、
coding agent または repo に不慣れな人が、現在の working tree とその 1 ファイルだけで
task を完了まで進められるように書きます。

## 使い方

- ExecPlan は次のいずれかに当てはまる task で使います: 複数 session に跨る、repo-wide contract や review / verify / install を触る、高リスクまたは破壊的、3 files 以上または 2 concerns 以上に跨る、検証や review が 1 手では終わらない。
- 次をすべて満たす小さな task では ExecPlan を省略してよい: 変更が局所的で 2 files 以下、低リスク、検証が 1 手で済む、継続用の handoff が不要。
- ExecPlan を作成・更新する前に、この `PLANS.md` を最初から最後まで読み直します。記憶に頼りません。
- 置き場所は `docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` を標準とします。completion gate を満たした relevant な task は、同じ directory 名のまま `docs/exec-plans/completed/{YYYYMMDDHHmm_slug}/exec-plan.md` へ移します。completed へ移動した ExecPlan は履歴として凍結し、後続の schema 更新、参照切れ修正、文体調整のために書き換えません。
- プロジェクトへ ExecPlan 規約を導入または更新する時は、特別な理由がない限り dotfiles の `PLANS.md` / `.config/harness/skills/exec-plan/SKILL.md` 標準へ寄せます。独自用語、独自 section、独自 artifact を維持する場合は、標準へ寄せない理由、影響範囲、再評価条件を対象 ExecPlan の `記録` に残します。
- yona.dev の標準 workflow は `exec-plan -> 承認1 -> build -> pre-delivery commit -> PR update/create -> pr-writer receipt -> completed move -> receipt/move commit -> CI fix` とします。ここでの build は、実装、`mise run verify`、independent review、review fix loop、pre-delivery commit 前の状態までを含む自律実行フェーズとして扱います。`review.required: true` の必須 review は build に含め、承認1後は追加承認を待たずに起動します。
- 人間の介入は原則として exec-plan 時の意図注入、承認ゲート、レビュー結果へのフィードバックに寄せます。build 中は「次の一手」や「レビューを開始してよいか」を都度ユーザーに聞かず、agent が ExecPlan に書かれた作業と gate に従い、探索、実装、verify、独立 review 起動、review fix loop を進めます。verify / review gate 通過後の commit は追加承認を待たず、`commit` skill 経由で戻しやすい論理単位へ小粒度に自動実行します。
- PR 作成・更新は `pr-writer` skill を入口にします。ExecPlan の承認1は、ユーザーが明示的に除外しない限り、`pr-writer` Phase 6 の PR 作成・更新実行承認も兼ねます。CREATE / 大幅 UPDATE の直前に別の確認を挟みません。PR template や UI preview 不達など、停止条件に該当する場合だけ止めます。
- ExecPlan の状態、検証コマンド、レビュー要否、レビュー範囲、次の担当は front matter を SSoT にします。本文では必要な短い表示だけを置き、値を重複管理しません。
- 仕様変更、判断変更、レビュー・フィードバックによる範囲や完了条件の変更があれば、会話だけに残さず active ExecPlan の `完了条件`、`作業`、`記録` のいずれかへ還流します。主作業と関係が薄い共有契約の改善候補は、現在の作業へ混ぜず `記録` へ候補として残し、必要なら別の active ExecPlan で扱います。
- section の標準順序は `概要`、`スコープ`、`完了条件`、`作業`、`記録` とします。上から読んだ時に、目的と現在地、境界、完了条件、実行手順、根拠と判断の順で把握できるようにします。

## 意図確認

ExecPlan を作成する時、`承認1` の前に `grill-me` 型の意図確認を必ず実施します。ここでの `grill-me` 型は、設計や計画の決定木を依存順にたどり、共有理解に至るまで未解決の分岐を 1 つずつ閉じるヒアリングを指します。

- まず探索します。repo 内の規約、既存コード、過去 ExecPlan、関連 docs で答えられる問いはユーザーに聞かず、探索結果を draft へ反映します。
- 探索後に未解決の設計分岐が 1 つでも残る場合は、ExecPlan draft を作る前に質問します。質問は 1 問だけ出し、回答を受けて設計木を更新してから次の質問要否を判断します。
- 各質問には推奨回答と理由を 1 文で添えます。推奨回答は「この repo の現行規約と探索結果に照らすと、この答えが最も安全」という形にします。
- 質問を省けるのは、探索またはユーザーの明示指示により、設計木の分岐が閉じている場合だけです。質問を省く場合も、どの探索結果または明示指示で閉じたのかを `記録` に残します。
- ユーザーが明示していない読み取り範囲、対象外、出力先、証跡の残し方、ログや履歴を読むかどうかを、agent が安全側に狭める場合も設計分岐として扱います。探索で事実を確認できても、その狭め方自体が目的、制約、完了条件、スコープ、または採用しない選択肢を変えるなら draft 前に 1 問聞きます。
- 3 問以上必要になりそうな場合は、そのまま質問を増やしません。探索不足またはタスク分割不足として扱い、番号付きの分割案を提示します。各分割単位は、題名、人間判断単位か自律実行単位か、先に必要な作業、ユーザーに見える到達点、単独検証方法を持ちます。
- 実装詳細、軽微な例外処理、既存規約で解ける選択は agent が自律決定します。ただし、その選択が目的、制約、完了条件、スコープ、または採用しない選択肢を変える場合は設計分岐として扱います。
- workflow は `探索 -> 意図確認 -> draft -> 承認1 -> build -> pre-delivery commit -> PR -> receipt -> completed move -> receipt/move commit -> CI fix`。ヒアリング結果または探索で確定した意図を反映した ExecPlan draft をユーザーに提示し、承認1で draft と `委譲` に明記した review 実行を承認してから build に入ります。承認1後の build では、`review.required: true` の独立 review 起動と review fix loop について追加承認を求めません。draft 修正要求があれば承認1通過まで loop します。
- ヒアリング結果は新規 section を作らず、`概要`、`スコープ`、`完了条件`、`作業`、`記録` に流し込みます。active ExecPlan の `記録 > 判断` には、設計木が解決済みで未解決意思決定がないことを示す `意図確認完了:` 固定行を残します。

## 適用範囲

- この文書は ExecPlan artifact の schema と更新規則だけを定義します。
- 通常応答の文体や会話トーンは system / developer instructions と `AGENTS.md` を SSoT にします。
- この文書の節名、固定句、ひな形は ExecPlan にだけ適用し、通常応答や review comment へ広げません。
- `##` 見出しは日本語を canonical にします。
- completed artifact は作成時点の履歴として保持します。旧形式や古い表記は後から現行 schema へ寄せず、参照切れや文体差分も履歴として扱います。ただし検証と完了判定の現行契約は active な `exec-plan/v3` だけを対象にし、旧形式への互換 fallback は持ちません。

## front matter

front matter は機械が読む SSoT であり、キーと列挙値は ASCII 固定語にします。値の説明や人間向け補足は本文に書きます。

必須キーは次のとおりです。

```yaml
---
schema: exec-plan/v3
status: awaiting_approval_1
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
handoff: human_review
next:
  actor: human
  action: approve_1
---
```

列挙値の標準は次のとおりです。

- `status`: `awaiting_approval_1`、`in_progress`、`in_review`、`blocked`、`completed`
- `source.kind`: `github_issue`、`github_pr`、`manual`、`none`
- `workspace.mode`: `current_branch`、`worktree`
- `delivery.kind`: `pull_request`、`main_push`、`local_only`
- `handoff`: `human_review`、`done_after_verify`
- `next.actor`: `human`、`agent`
- `review.required`: `true`、`false`。`AGENTS.md`、`PLANS.md`、`docs/conventions.md`、`docs/skills/`、install、verify、PR workflow のように repo-wide contract へ当たる task では `true` にします。
- `review.untracked_paths`: `git diff -- ...` に出ない未追跡 path の一覧。無い場合は `[]` にします。
- `verify.command`: 原則 `mise run verify`。この repo で別の `verify.sh` や hidden pipeline は定義しません。
- `blocked`: 必須 reviewer の未成立、検証不能、ユーザー判断待ち、外部制約で進めない状態を表します。`status: blocked` にした時は `next.action` を `resolve_blocker` などの再開行動にし、`記録` に `停止理由:` で始まる行を残します。

`workspace.mode: worktree` は、作業 branch と checkout root を main から分離し、並列作業の単位として扱うことを表します。この repo では専用 preflight script を定義しません。worktree 固有の既知制約があれば対象 ExecPlan の `記録` に残します。

`delivery.kind: pull_request` は標準 delivery です。commit 後に `pr-writer` skill の CREATE / UPDATE mode を通し、PR checks を確認します。`main_push` はユーザーが明示した時だけ使い、merge 前後の verify と rollback 方針を対象 ExecPlan に書きます。

## 責務境界

ExecPlan 周辺の文書とスキルは、次の境界で読みます。書式や節構造に迷った場合は `PLANS.md` を優先し、スキルや実行時入口へ重ねて定義しません。

| 対象 | 主な責務 | 置かないもの |
| --- | --- | --- |
| `PLANS.md` | ExecPlan の構造定義、節順序、front matter、Markdown 表現、更新規則、完了ゲート | 通常応答の文体、個別タスクの判断、スキル実行手順の詳細 |
| `docs/skills/exec-plan/SKILL.md` | `PLANS.md` を使って ExecPlan を作成・更新し、承認後に実行する手順 | 節順序や固定ラベルの再定義、verify の検査仕様、タスク個別の恒久記録 |
| `docs/skills/review/SKILL.md` | relevant ExecPlan の front matter scope を使った independent review と fix loop | 書式の SSoT、`mise run verify` の代替、PR URL review |
| `docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` | 個別 task の目的、スコープ、完了条件、作業、記録、front matter | リポジトリ共通規約、別タスクの履歴、通常応答の文体 |
| `mise.toml` | `mise run verify`、lint、build など deterministic verification の入口 | ExecPlan 書式、review verdict、タスク判断 |
| `AGENTS.md` | agent 行動契約、いつ ExecPlan を使うか、repo / runtime 固有の運用ルール | ExecPlan の詳細な構造定義、個別タスクの実行計画 |

## 必須要件

- 自己完結: 外部チャット、口頭説明、暗黙知に依存しない。
- 実行自足: 実行に必要なファイル、コマンド、確認方法を明示する。
- 初見向け: リポジトリに不慣れでも迷わない粒度で書く。
- 成果基準: 何をどう確認して完了とみなすかを具体化する。
- 平易な言葉: repo 固有語や一般的でない技術用語は、その場で平易に定義する。
- 明示文脈: file path、working directory、command、期待結果、前提条件を明記する。個人の絶対 path は commit される ExecPlan に残さない。
- 生きた文書: 実装中に `完了条件`、`作業`、`記録` を更新し続ける。
- ゲート意識: approval gate と自律実行フェーズの境界を明示し、どこで人間判断が必要かを曖昧にしない。
- 成功基準: 状態を持たない単独の agent または初見の人が ExecPlan を上から順に読み、観測できる成果を再現できる状態にする。

## 記述規則

- checklist は `完了条件` と `作業` だけで使います。
- `完了条件` の checklist は完了判定を表します。すべての項目が完了していない限り、その ExecPlan は完了候補ではありません。
- `作業` の checklist は実行中の作業状態を表します。未チェック項目は完了前に解消すべき残作業とみなします。任意の後続候補は checklist にせず、`記録` に通常の箇条書きで残します。
- `未完了` は独立 section として作りません。
- それ以外の section は prose を基本にし、必要な箇所だけ短い列挙を使います。
- 各 `##` / `###` heading の直後に空行を 1 行置きます。
- command、transcript、diff、code block は fenced code block で書きます。inline backtick code は短い識別子や path に限定します。
- ExecPlan を単独 file として保存する場合、plan 全体を Markdown fence で囲みません。
- 実際に触るファイルパス、コマンド、期待結果を書きます。function 名、module 名、type 名も省略せず正確に書きます。
- `作業` の checklist は時刻付きにします。時刻形式は `YYYY-MM-DD HH:MM+09:00`（日本時間）とし、UTC `Z` suffix は使いません。
- `概要` は「目的」「現在地」「次の作業」を短く書きます。front matter の値を長く再掲しません。
- `スコープ` は `概要` の直後に置きます。何が対象で、何が対象外で、どの前提で読むのかを先に固定します。
- `完了条件` は `スコープ` の直後に置きます。成功条件、検証、レビュー通過、PR / CI 状態、旧形式残存なしなどを肯定形の checklist で書きます。`差し戻し条件` / `失敗条件` の独立小見出しは作らず、完了条件へ統合します。
- `review.required`、`review.scope_command`、`review.untracked_paths` は front matter を SSoT にします。本文にレビュー範囲を再掲しません。新規 ExecPlan など `git diff -- ...` に出ない path が review 対象なら、ここへ明示します。
- `verify.command` は front matter を SSoT にします。本文では必要なら「front matter の `verify.command` が成功する」のように短く参照します。
- `review.required: true` の ExecPlan は、completion gate 通過前に `記録` の `発見` か `判断` へ `レビュー通過:` で始まる固定行を 1 行残します。固定行には `contract-reviewer=APPROVE`、`ce-reviewer=APPROVE`、`レビュー未成立なし`、`verify=pass` を含めます。security 境界を含む task では `security-reviewer=APPROVE` も含め、それ以外では `security-reviewer=not_required` を含めます。
- PR 作成・更新を行った ExecPlan は、completion gate 通過前に `記録` の `発見` へ `pr-writer receipt:` で始まる固定行または箇条書きを残します。mode、base/head、既存 PR 判定、issue 判定、template 判定、UI preview 判定、title/body 生成、実行 command、`gh pr view` 検証を含めます。
- `作業` には `ゲート`、`手順`、`委譲`、`復旧` を置きます。`実行フロー`、`承認1`、`自律実行`、`commit` は独立 section にせず `ゲート` と `手順` に統合します。
- `委譲` には sidecar 的に委譲する調査・検証・review を明記し、使わない場合も `none` などで非採用を明示します。reviewer を使う場合は、役割、対象範囲、期待する出力、並列実行の有無、統合観点、結論が対立した時の扱い、失敗時の戻し方を具体的に書きます。期待する出力には少なくとも `verdict`、`findings`、`evidence`、`blocker`、`confidence` を含めます。承認1後は、この記載をユーザーの明示的な review 委譲依頼として扱い、build 中に追加承認を求めません。
- `記録` には `発見`、`判断`、`変更履歴` を置きます。観測と決定を混ぜません。
- `発見` は日付付きの箇条書きで、実装中に分かった事実と根拠を書きます。レビュー・フィードバックで新しく分かった事実、人間負荷を増やした要因、追加質問を省けた根拠も必要に応じてここへ残します。
- `判断` は日付 / 担当付きの箇条書きで、決めたことと理由を書きます。単一の判断に表は使いません。
- active ExecPlan の `判断` には、`意図確認完了: 設計木=解決, 質問=完了または不要, 推奨回答=提示済みまたは不要, 探索回答=反映済み, 未解決意思決定=なし` を 1 行含めます。`status: blocked` でユーザー判断待ちの場合だけ、この固定行が無い状態を許容します。
- `変更履歴` は日付付きの箇条書きで、更新理由が ExecPlan 単体で追える粒度にします。
- 表は複数候補の比較や対応表のように、列方向の比較が読む助けになる時だけ使います。
- repo 共通規約はこの `PLANS.md` に置き、個別 task にしか意味のない内容だけを各 ExecPlan に書きます。
- repo-level の再開スナップショット file は持ちません。再開に必要な状態は active ExecPlan の living sections と front matter に残します。completed へ移動した ExecPlan は living document ではなく履歴証跡として読みます。
- `pipeline` や hidden runtime appendix file のような別系統の実行ルールは使いません。
- ユーザーに見える効果（振る舞い、I/O、証跡）は詳しめに書き、内部実装の偶発的な詳細は詳述しすぎません。書き分けに迷ったら「読み手が再現に使えるか」を基準にします。

## Markdown 視認性

- この section は ExecPlan artifact にだけ適用します。通常応答の文体や review comment の形式へ広げません。
- 表題の直後に `## 概要` section を置き、目的、現在地、次の作業を必ず先に読めるようにします。
- command は fenced code block を使います。
- 同種の短い項目が 3 つ以上あり、列で比較した方が読みやすい場合だけ Markdown の表を使います。
- 節内の短い一覧は通常の箇条書きを使います。
- 太字は重要ラベルだけに使います。固定ラベルの構造表現は小見出しで作り、path、command、API 名を装飾目的で太字にしません。

## 失敗モードの保護策

- 重要判断を読み手に委ねません。判断が必要な分岐は ExecPlan 側で決めきり、`記録` に理由を残します。
- 節目を短さのために潰しません。節目ごとの目的、作業、結果、証跡は短縮せず文章で書きます。
- 後続実装に必要な詳細を省きません。読み手がもう一度 `作業` を再実行するのに必要な file path、command、前提、期待結果は欠かしません。

## 必須 section

各 ExecPlan は次の `##` 見出しをこの名前と順序で持ちます。右列は旧見出しとの対応関係です。

| 項目 | 旧見出し |
| --- | --- |
| `## 概要` | `## 要点` / `## 目的` |
| `## スコープ` | `## スコープ` / `## 契約` の一部 |
| `## 完了条件` | `## 受け入れ条件` |
| `## 作業` | `## 進捗` / `## 実行計画` / `## 復旧` / `## 未完了` |
| `## 記録` | `## 発見` / `## 判断` / `変更記録:` |

## 項目の役割

### `概要`

目的、現在地、次の作業を書きます。本文の縮小版ではなく、読む頻度が高い現在地として、承認待ちか、何が残っているか、verify / review が通ったかを先に読めるようにします。

### `スコープ`

対象、対象外、前提を書きます。汎用規約の再掲やファイル名の羅列だけで終わらせません。レビュー要否と範囲は front matter の `review.required`、`review.scope_command`、`review.untracked_paths` を SSoT にします。

### `完了条件`

何を見れば完了か、verify / review がどう通るか、PR / CI がどうなっているか、旧形式や未追跡対象の見落としが残っていないかを checklist で書きます。否定形の差し戻し条件を別枠にせず、「残っていない」「対応している」のような肯定形にします。

### `作業`

承認ゲート、作業手順、委譲、復旧を書きます。未チェック項目は完了前に解消すべき残作業として扱います。任意の後続候補や残リスクは checklist にせず `記録` に残します。

### `記録`

実装中に分かった事実、判断、変更履歴を書きます。`発見`、`判断`、`変更履歴` を小見出しにし、単なる作業ログや次の step の詳細指示書は置きません。

## リポジトリ規約

- `AGENTS.md` は agent 行動契約の SSoT。
- この `PLANS.md` は ExecPlan の schema と更新ルールの SSoT。
- `docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` は個別 task の SSoT。completion gate を満たした relevant な active ExecPlan は同じ directory 名で `docs/exec-plans/completed/{YYYYMMDDHHmm_slug}/exec-plan.md` へ移します。
- `mise.toml` は deterministic verification の SSoT。最終 hard guard は `mise run verify`。
- project-local `review` は relevant ExecPlan の `完了条件` と front matter scope を主要基準に review します。
- `review` skill は relevant ExecPlan の front matter にある `review.required`、`review.scope_command`、`review.untracked_paths` を主変更集合として優先します。
- `pr-writer` skill は PR 作成・更新の唯一の入口です。

## ひな形

ひな形本体は Markdown として直接書きます。ExecPlan を単独 file として保存する場合、plan 全体を Markdown fence で wrap しません。

```markdown
---
schema: exec-plan/v3
status: awaiting_approval_1
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
handoff: human_review
next:
  actor: human
  action: approve_1
---

# {タスク名}

## 概要

目的: この変更の前後で、ユーザーが何をできるようになるかを書く。

現在地: `承認1` 待ち。

次の作業: 承認後に実装し、verify と独立 review を通す。

この ExecPlan は `PLANS.md` に従って保守する。作業中は `完了条件`、`作業`、`記録` を更新し続ける。

## スコープ

### 対象

- 触る file / module / service / 振る舞いを書く。

### 対象外

- 明示的に触らない領域を書く。

### 前提

- 作業前に成り立っている必要がある状態を書く。
- front matter の `verify.command` が verify command の SSoT である。
- front matter の `review.required` が review 要否の SSoT である。
- front matter の `review.scope_command` が review 範囲の SSoT である。
- 未追跡 file が review 対象なら front matter の `review.untracked_paths` に含める。

## 完了条件

- [ ] 完了時にユーザーが観測できる状態を書く。
- [ ] front matter の `verify.command` が成功する。
- [ ] front matter の `review.required` が `true` の場合、`review.scope_command` と `review.untracked_paths` を対象に独立 review が通る。
- [ ] PR 作成・更新が必要な場合、`pr-writer` receipt が `記録` に残っている。
- [ ] `作業` の未チェック項目がない。

## 作業

### ゲート

- 承認1: この draft の承認後、実装へ進む。
- 独立レビュー: front matter の `review.required` が `true` の場合、承認1後に追加承認を待たず、`委譲` に書いた reviewer set を別コンテキストで起動する。
- commit: verify / review gate 通過後、追加承認を待たず `commit` skill 経由で自動実行する。
- PR: `delivery.kind: pull_request` の場合、commit 後に追加承認を待たず `pr-writer` skill 経由で作成・更新し、receipt を `記録` に残す。
- completed move: `pr-writer` receipt と完了条件を満たした後、同じ directory 名のまま `docs/exec-plans/completed/` へ移し、receipt/move を追加 commit する。

### 手順

- [ ] YYYY-MM-DD HH:MM+09:00 最初の作業を書く。

### 委譲

- `review.required: true`: 承認1後に追加承認を待たず、`contract-reviewer` と `ce-reviewer` を別コンテキストで起動する。期待する出力は `verdict`、`findings`、`evidence`、`blocker`、`confidence`。結論が対立した場合は `REQUEST_CHANGES` を優先し、修正後に再レビューする。起動不能の場合は `blocked` にする。
- その他の sidecar 委譲: none。

### 復旧

失敗時にどこから再開できるかを書く。

## 記録

### 発見

- YYYY-MM-DD / 担当: 探索で分かった事実を書く。

### 判断

- YYYY-MM-DD / 担当: 決めたことと理由を書く。
- YYYY-MM-DD / 担当: 意図確認完了: 設計木=解決, 質問=完了または不要, 推奨回答=提示済みまたは不要, 探索回答=反映済み, 未解決意思決定=なし

### 変更履歴

- YYYY-MM-DD / 担当: 初回作成。
```
