# ExecPlan 契約

`PLANS.md` は ExecPlan の共通契約です。個別タスクの実行手順は
`docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` に書き、完了後に
`docs/exec-plans/completed/{YYYYMMDDHHmm_slug}/exec-plan.md` へ移します。

この文書は schema と更新規則だけを定義します。隠れた実行基盤、別 pipeline、
runner framework、別の task artifact 形式は定義しません。

## 使い方

ExecPlan は、大きい・危険・横断的・再開が必要なタスクの living document です。
事実、判断、進捗、検証 evidence が変わったら、その場で更新します。

各 ExecPlan の冒頭には次の文を置きます。

    この ExecPlan は ../../../../PLANS.md の契約に準拠する。

相対 path は、移動で意味が変わる場合だけ調整します。

## 意図確認プロトコル

ExecPlan 作成前に、ユーザー意図を次の 5 軸で整理します。

| 軸 | 目的 | 書き込む section |
| --- | --- | --- |
| 目的 | ユーザーから見える成果を明確にする | `目的` |
| 制約 | 変えてはいけないものを明確にする | `契約`, `復旧` |
| 受け入れ条件 | 成功の観測方法を決める | `受け入れ条件` |
| scope 境界 | 対象 file / module / route と対象外を分ける | `実行計画`, `契約` |
| tradeoff | 競合時に何を優先するか決める | `判断` |

質問基準は `AGENTS.md` と `docs/conventions.md` に従います。実装詳細、局所的な
error handling、edge case は、ユーザーから見える挙動 / security / scope を変えない限り
agent が自律判断します。

推奨 workflow は次の通りです。

1. Hearing: plan を変える質問だけ聞く。
2. Draft: 前提を明記して ExecPlan を作る。
3. Approval gate 1: 広い実装前に承認を得る。
4. Autonomous phase: 承認 scope 内で実装、検証、review fix loop、stage / commit、PR 作成、CI fix まで進める。
5. Approval gate 2: verification evidence、review verdict、PR / CI 状態、残リスクを報告する。

## 記述規則

- `##` 見出しは日本語を canonical にします。
- 次の英語 token は機械検査用の固定句としてそのまま使います:
  `Observation:`, `Evidence:`, `Decision:`, `Rationale:`, `Date/Author:`,
  `Working directory:`, `Command:`, `Expected outcome:`, `Input:`, `Observe:`,
  `Failure signal:`, `Dependency:`, `Reason:`, `Contract:`,
  `Execution flow:`, `Approval gate 1:`, `Autonomous phase:`,
  `Subagent orchestration:`, `Approval gate 2:`, `Change note:`
- 各 `##` / `###` の直後は空行 1 行にします。
- ファイル全体を Markdown fence で囲みません。
- nested triple-backtick fence は使いません。command / transcript / diff / 例は 4-space indent で書きます。
- `実行計画` では file、function、module、type、command を一意に指せる名前で書きます。
- `実行計画` には、停止条件に該当しない限り、実装、検証、review fix loop、stage / commit、PR 作成、CI fix までを含めます。
- ExecPlan gate として review を実行した場合は、reviewer ids、verdict、未解決 finding、未検証範囲、実行した verification command を `発見` または `受け入れ条件` に残します。
- PR 作成・更新を行った場合は、`pr-writer` の mode、base/head、既存 PR 判定、issue 判定、template 判定、UI preview 判定、title/body 生成、実行 command、`gh pr view` 検証を `発見` または `受け入れ条件` に残します。
- PR 作成・更新は `pr-writer` skill を入口にし、`pr-writer` の Phase 6 以外で `gh pr create` / `gh pr edit`、GitHub connector、その他の PR 作成・更新 API を直接呼びません。
- commit される ExecPlan には個人の絶対 path を残さず、`Working directory:` は `<repo-root>` や repo-relative path で書きます。
- ユーザーから見える効果は厚めに、偶発的な実装詳細は薄めに書きます。
- `Evidence:` は成功 proof に絞り、長い transcript や巨大 diff を貼りません。
- 各 ExecPlan の最後の非空行は必ず最新の `Change note:` にします。

## 失敗モードの保護策

- 重要判断を読者に委ねません。
- 短さのために milestone を省略しません。
- 将来の再開や実装に必要な詳細を落としません。

## 必須要件

- 上から順に読めば、単独の agent または初見の人間がタスクを再開・再現できる。
- acceptance は compile 成功だけでなく、観測可能な結果で定義する。
- 重要な発見と検証には evidence を残す。
- ExecPlan 対象 task は、停止条件に該当しない限り、deterministic verification と成立済み review verdict の両方を完了 evidence に含める。
- 重要な判断には rationale、date、author を残す。
- 現実が plan からずれたら plan を更新する。
- タスク固有手順は `PLANS.md` ではなく各 ExecPlan に書く。

単一の stateless agent または初見の人間が、ExecPlan を上から順に読み、動作する観測可能な結果を再現できる状態にします。

## 必須 section

| Section | 目的 | 機械検査 | 書き方 |
| --- | --- | --- | --- |
| `目的` | 変更前後のユーザーから見える挙動を説明する | 見出し必須 | 内部属性だけで終えない |
| `進捗` | timestamp 付き checkbox で状態を残す | timestamp format | 日本時間で書く |
| `発見` | 発見と proof を残す | `Observation:` / `Evidence:` | transcript や file-scoped diff を貼る |
| `判断` | 判断理由を残す | `Decision:` / `Rationale:` / `Date/Author:` | tradeoff を書く |
| `契約` | dependency と成立条件を明示する | `Dependency:` / `Reason:` / `Contract:` | file/module contract を書く |
| `実行計画` | 実装から CI fix までの手順を具体化する | `Working directory:` / `Command:` / `Expected outcome:` | numbered list を使う |
| `受け入れ条件` | 成功と失敗を観測可能にする | `Input:` / `Observe:` / `Failure signal:` | 完了時は actual proof と review verdict に置き換える |
| `復旧` | retry、冪等性、cleanup を示す | 見出し必須 | 5 要件を満たす |
| `未完了` | 残作業と残リスクを示す | 見出し必須 | なければ `None.` |

## 時刻形式

`進捗` は日本時間で次の形式にします。UTC の `Z` suffix は使いません。

    YYYY-MM-DD HH:MM+09:00

## section 骨格（section skeleton）

各 ExecPlan は次の骨格を満たします。見出しも含めて copy できるよう、
`##` を literal で示します。本文はタスクに合わせて具体化します。

    この ExecPlan は ../../../../PLANS.md の契約に準拠する。

    ## 目的

    変更前後で、ユーザーが何をできるようになるかを書く。対象 route、command、document、workflow を具体名で示す。

    ## 進捗

    - [ ] YYYY-MM-DD HH:MM+09:00 具体的な進捗を書く。

    ## 発見

    Observation: 観測した事実を書く。
    Evidence:
        terminal transcript、command output、または file-scoped diff を貼る。

    ## 判断

    Decision: 採用した判断を書く。
    Rationale: tradeoff と理由を書く。
    Date/Author: YYYY-MM-DD / 名前

    ## 契約

    Dependency: 依存する file / module / service を書く。
    Reason: なぜ依存するかを書く。
    Contract: 最終的に守るべき契約を書く。

    ## 実行計画

    1. file / function / module / type を具体名で書く。

        Working directory:
            <repo-root>
        Command:
            実行する command
        Expected outcome:
            期待する結果

    2. 実装後に検証、review fix loop、stage / commit、PR 作成、CI fix まで進める手順を書く。

        Working directory:
            <repo-root>
        Command:
            review fix loop
            git add <approved files>
            commit skill
            pr-writer skill
            CI check and fix loop
        Expected outcome:
            stage / commit と PR が作られ、CI が green になるか具体的な blocker が報告される。

    ## 受け入れ条件

    Input: 検証入力を書く。
    Observe: actual transcript、test pass count、HTTP I/O、screenshot などの proof を書く。
    Failure signal: 失敗とみなす観測結果を書く。

    ## 復旧

    1. 再実行しても state を壊さない。
    2. 失敗時は failure signal を読んで retry / adapt する。
    3. migration や生成物がある場合は backup / fallback を示す。
    4. additive で testable な変更を優先する。
    5. 完了後に temporary file、dev server、生成物を clean にする。

    ## 未完了

    残作業、skip した検証、残リスクを書く。なければ `None.` と書く。

    Change note: YYYY-MM-DD HH:MM+09:00 変更理由を書く。

## マイルストーン（milestone）

milestone を使う場合は、各 milestone に goal / work / result / proof を narrative で書き、
単独で検証できる単位にします。

## 変更記録

plan を更新したら `Change note:` を追記します。最新の `Change note:` を各 ExecPlan の最後の非空行にします。

    Change note: YYYY-MM-DD HH:MM+09:00 変更理由を書く。
