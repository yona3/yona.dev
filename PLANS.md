# ExecPlan 契約

`PLANS.md` は ExecPlan の共通契約です。個別タスクの実行手順は
`docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` に書き、完了後に
`docs/exec-plans/completed/{YYYYMMDDHHmm_slug}/exec-plan.md` へ移します。

この文書は schema と更新規則だけを定義します。隠れた実行基盤、別 pipeline、
runner framework、別の task artifact 形式は定義しません。

## 使い方

ExecPlan は、大きい・危険・横断的・再開が必要なタスクの living document です。
事実、判断、進捗、検証結果が変わったら、その場で更新します。

各 ExecPlan の冒頭には YAML front matter を置き、その直後に次の文を置きます。

    ---
    status: active
    created_at: YYYY-MM-DD HH:MM+09:00
    updated_at: YYYY-MM-DD HH:MM+09:00
    owner: Codex
    review.scope_command: git diff -- <paths>
    review.untracked_paths:
      - <path>
    ---

    この ExecPlan は ../../../../PLANS.md の契約に準拠する。

`review.untracked_paths` がない場合は `[]` を使います。相対 path は、移動で意味が
変わる場合だけ調整します。

## 意図確認プロトコル

ExecPlan 作成前に、ユーザー意図を次の 5 軸で整理します。

| 軸 | 目的 | 書き込む section |
| --- | --- | --- |
| 目的 | ユーザーから見える成果を明確にする | `目的` |
| 制約 | 変えてはいけないものを明確にする | `契約`, `復旧` |
| 受け入れ条件 | 成功の観測方法を決める | `受け入れ条件` |
| scope 境界 | 対象 file / module / route と対象外を分ける | front matter, `実行計画`, `契約` |
| tradeoff | 競合時に何を優先するか決める | `判断` |

質問基準は `AGENTS.md` と `docs/conventions.md` に従います。実装詳細、局所的な
error handling、edge case は、ユーザーから見える挙動 / security / scope を変えない限り
agent が自律判断します。

意図確認は `grill-me` 型で行います。まず repo 内の規約、既存コード、過去 ExecPlan、
関連 docs を探索し、実装方針、scope、完了条件、復旧方法が変わる設計分岐だけを
設計木として残します。探索で閉じた分岐は質問せず、どの根拠で閉じたかを `発見` または
`判断` に記録します。未解決の分岐が残る場合は、依存順に 1 問ずつ聞き、各質問には
この repo の既存規約に照らした推奨回答を添えます。

人間の責務は、意図注入、承認、レビュー、フィードバックです。agent の責務は、探索、
ExecPlan 下書き、実装、検証、review fix loop、completion gate 通過後の戻しやすい
小粒度 commit、PR 作成、CI fix です。ユーザーが明示的に除外しない限り、承認1後の
自律実行 scope に review fix loop と stage / commit / PR / CI fix を含めます。
ExecPlan の承認1は、ユーザーが明示的に除外しない限り、`pr-writer` Phase 6 の
PR 作成・更新実行承認も兼ねます。

推奨 workflow は次の通りです。

1. 探索: repo 内の根拠で閉じられる設計分岐を先に閉じる。
2. 聞き取り: plan を変える未解決分岐だけを 1 問ずつ聞く。
3. 下書き: 前提、質問省略理由、review scope を明記して ExecPlan を作る。
4. 承認1: 広い実装前に承認を得る。
5. 自律実行: 承認 scope 内で実装、検証、review fix loop、stage / commit、PR 作成、CI fix まで進める。
6. 承認2: 検証根拠、review verdict、PR / CI 状態、残リスクを報告する。

## 記述規則

- `##` 見出しは日本語を canonical にします。
- 次の日本語 token は機械検査用の固定句としてそのまま使います:
  `観測:`, `根拠:`, `判断:`, `理由:`, `日付/担当:`,
  `作業場所:`, `実行:`, `期待結果:`, `入力:`, `確認:`,
  `失敗条件:`, `依存:`, `依存理由:`, `契約:`,
  `実行フロー:`, `承認1:`, `自律実行:`,
  `委譲:`, `承認2:`, `変更記録:`
- この日本語 token 契約は新規 ExecPlan と active ExecPlan に適用します。既存の
  completed artifact は作成時点の schema と token を履歴として保持してよく、
  後から最小補足する場合もその artifact の既存 token に合わせます。
- 各 `##` / `###` の直後は空行 1 行にします。
- ファイル全体を Markdown fence で囲みません。
- nested triple-backtick fence は使いません。command / transcript / diff / 例は 4-space indent で書きます。
- `実行計画` では file、function、module、type、command を一意に指せる名前で書きます。
- `実行計画` には、停止条件に該当しない限り、実装、検証、review fix loop、stage / commit、PR 作成、CI fix までを含めます。
- front matter には review scope を再現するための `review.scope_command` と、未追跡 file を含める場合の `review.untracked_paths` を書きます。未追跡 file がない場合は `[]` と書きます。
- `契約` section は依存、成立条件、守るべき制約を文章で書き、review scope の SSoT を重複定義しません。
- 独立 reviewer や sidecar 調査へ委譲する場合は、役割、対象範囲、期待する出力、並列実行の有無、統合観点、失敗時の扱いを `実行計画` に書きます。
- 委譲の標準期待出力は `verdict`, `findings`, `evidence`, `blocker`, `confidence` です。旧い固定 section 出力は標準として再導入しません。
- ExecPlan gate として review を実行した場合は、reviewer ids、verdict、未解決 finding、未検証範囲、実行した verification command を `発見` または `受け入れ条件` に残します。
- PR 作成・更新を行った場合は、`pr-writer` の mode、base/head、既存 PR 判定、issue 判定、template 判定、UI preview 判定、title/body 生成、実行 command、`gh pr view` 検証を `発見` または `受け入れ条件` に残します。
- PR 作成・更新は `pr-writer` skill を入口にし、`pr-writer` の Phase 6 以外で `gh pr create` / `gh pr edit`、GitHub connector、その他の PR 作成・更新 API を直接呼びません。
- ExecPlan task では、承認1が `pr-writer` Phase 6 の PR 作成・更新実行承認を兼ねるため、CREATE / 大幅 UPDATE の直前に別の確認を挟みません。PR template や UI preview 不達など、停止条件に該当する場合だけ止めます。
- commit される ExecPlan には個人の絶対 path を残さず、`作業場所:` は `<repo-root>` や repo-relative path で書きます。
- ユーザーから見える効果は厚めに、偶発的な実装詳細は薄めに書きます。
- `根拠:` は成功根拠に絞り、長い transcript や巨大 diff を貼りません。
- 各 ExecPlan の最後の非空行は必ず最新の `変更記録:` にします。
- 完了した ExecPlan は同じ directory 名のまま `docs/exec-plans/active/` から
  `docs/exec-plans/completed/` へ移し、active には作業中の plan だけを残します。

## 失敗モードの保護策

- 重要判断を読者に委ねません。
- 短さのために milestone を省略しません。
- 将来の再開や実装に必要な詳細を落としません。

## 必須要件

- 上から順に読めば、単独の agent または初見の人間がタスクを再開・再現できる。
- acceptance は compile 成功だけでなく、観測可能な結果で定義する。
- 重要な発見と検証には根拠を残す。
- 重要な判断には理由、日付、担当を残す。
- ExecPlan 対象 task は、停止条件に該当しない限り、deterministic verification と成立済み review verdict の両方を完了根拠に含める。
- 現実が plan からずれたら plan を更新する。
- タスク固有手順は `PLANS.md` ではなく各 ExecPlan に書く。

単一の stateless agent または初見の人間が、ExecPlan を上から順に読み、動作する観測可能な結果を再現できる状態にします。

## 必須 section

| Section | 目的 | 機械検査 | 書き方 |
| --- | --- | --- | --- |
| `目的` | 変更前後のユーザーから見える挙動を説明する | 見出し必須 | 内部属性だけで終えない |
| `進捗` | timestamp 付き checkbox で状態を残す | timestamp format | 日本時間で書く |
| `発見` | 発見と根拠を残す | `観測:` / `根拠:` | transcript や file-scoped diff を貼る |
| `判断` | 判断理由を残す | `判断:` / `理由:` / `日付/担当:` | tradeoff を書く |
| `契約` | 依存と成立条件を明示する | `依存:` / `依存理由:` / `契約:` | file/module と守るべき制約を書く |
| `実行計画` | 実装から CI fix までの手順を具体化する | `作業場所:` / `実行:` / `期待結果:` | numbered list を使う |
| `受け入れ条件` | 成功と失敗を観測可能にする | `入力:` / `確認:` / `失敗条件:` | 完了時は実測結果と review verdict に置き換える |
| `復旧` | retry、冪等性、cleanup を示す | 見出し必須 | 5 要件を満たす |
| `未完了` | 残作業と残リスクを示す | 見出し必須 | なければ `None.` |

## 時刻形式

`進捗` は日本時間で次の形式にします。UTC の `Z` suffix は使いません。

    YYYY-MM-DD HH:MM+09:00

## section 骨格（section skeleton）

各 ExecPlan は次の骨格を満たします。見出しも含めて copy できるよう、
`##` を literal で示します。本文はタスクに合わせて具体化します。

    ---
    status: active
    created_at: YYYY-MM-DD HH:MM+09:00
    updated_at: YYYY-MM-DD HH:MM+09:00
    owner: Codex
    review.scope_command: git diff -- <paths>
    review.untracked_paths: []
    ---

    この ExecPlan は ../../../../PLANS.md の契約に準拠する。

    ## 目的

    変更前後で、ユーザーが何をできるようになるかを書く。対象 route、command、document、workflow を具体名で示す。

    ## 進捗

    - [ ] YYYY-MM-DD HH:MM+09:00 具体的な進捗を書く。

    ## 発見

    観測: 観測した事実を書く。
    根拠:
        terminal transcript、command output、または file-scoped diff を貼る。

    ## 判断

    判断: 採用した判断を書く。
    理由: tradeoff と理由を書く。
    日付/担当: YYYY-MM-DD / 名前

    ## 契約

    依存: 依存する file / module / service を書く。
    依存理由: なぜ依存するかを書く。
    契約: 最終的に守るべき契約を書く。

    ## 実行計画

    1. file / function / module / type を具体名で書く。

        作業場所:
            <repo-root>
        実行:
            実行する command
        期待結果:
            期待する結果

    2. 実装後に検証と review fix loop まで進める手順を書く。

        作業場所:
            <repo-root>
        実行:
            review fix loop
        期待結果:
            採用 finding がなくなり、完了処理に進める状態になる。

    3. 完了条件を満たしたら、stage / commit 前にこの ExecPlan directory を completed へ移す。

        作業場所:
            <repo-root>
        実行:
            mv docs/exec-plans/active/{YYYYMMDDHHmm_slug} docs/exec-plans/completed/{YYYYMMDDHHmm_slug}
        期待結果:
            完了済みの ExecPlan が active に残らず、この移動が後続の commit / PR に含まれる。

    4. stage / commit、PR 作成、CI fix まで進める。

        作業場所:
            <repo-root>
        実行:
            git add <approved files>
            commit skill
            pr-writer skill
            CI check and fix loop
        期待結果:
            stage / commit と PR が作られ、CI が green になるか具体的な blocker が報告される。CI fix や blocker 記録で completed ExecPlan を更新した場合は、追加 commit と PR 更新まで行う。

    ## 受け入れ条件

    入力: 検証入力を書く。
    確認: actual transcript、test pass count、HTTP I/O、screenshot などの確認結果を書く。
    失敗条件: 失敗とみなす観測結果を書く。

    ## 復旧

    1. 再実行しても state を壊さない。
    2. 失敗時は `失敗条件:` を読んで retry / adapt する。
    3. migration や生成物がある場合は backup / fallback を示す。
    4. additive で testable な変更を優先する。
    5. 完了後に temporary file、dev server、生成物を clean にする。

    ## 未完了

    残作業、skip した検証、残リスクを書く。なければ `None.` と書く。

    変更記録: YYYY-MM-DD HH:MM+09:00 変更理由を書く。

## マイルストーン（milestone）

milestone を使う場合は、各 milestone に目的 / 作業 / 結果 / 根拠を文章で書き、
単独で検証できる単位にします。

## 変更記録

plan を更新したら `変更記録:` を追記します。最新の `変更記録:` を各 ExecPlan の最後の非空行にします。

    変更記録: YYYY-MM-DD HH:MM+09:00 変更理由を書く。
