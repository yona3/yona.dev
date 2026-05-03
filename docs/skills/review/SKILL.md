---
name: review
description: yona.dev専用multi-agent差分レビュー。user scope reviewを基にscope固定、2+独立reviewer、fix loop判定を行う。
---

# yona.dev Multi-Agent Review Skill

この skill は、yona.dev の差分を project-specific に review するための local skill です。user scope の review skill を参考にしつつ、repo 固有の Next.js / Notes Markdown / docs / skill 変更へ必要な reviewer set だけを定義します。正本は `docs/skills/review/SKILL.md` に置き、Codex 向けの `.codex/skills/review` と Claude Code 向けの `.claude/skills/review` は同じ実体への symlink にします。

## 入力契約

| 入力 | 必須 | 説明 |
| --- | --- | --- |
| mode | 任意 | `branch`, `staged`, `working-tree`, `fix-loop` |
| base | 任意 | branch review の base。既定は `main` |
| scope | 任意 | 対象 path / route / module / ExecPlan |
| review_scope_command | 任意 | ExecPlan の `review.scope_command`。指定された場合は primary scope の再現 command として扱う |
| untracked_paths | 任意 | ExecPlan の `review.untracked_paths`。未追跡 file / directory を review 対象に含める |
| user_request | 推奨 | 今回の task 目的と除外範囲 |
| design_review | 任意 | `auto`, `on`, `off`。既定は `auto`。`on` はデザイン観点を明示追加、`off` は明示除外 |
| claude_design_review | 任意 | `auto`, `on`, `off`。既定は `auto`。`auto` は design review 起動時に Claude reviewer を既定追加、`on` は明示追加、`off` は明示除外 |

## 配置契約

- skill 本体の正本は `docs/skills/review/SKILL.md`。
- `.codex/skills/review` と `.claude/skills/review` は `docs/skills/review` への symlink とし、runtime 別の copy を作らない。
- runtime 差分が必要な場合は、分岐条件をこの skill 本体に書く。

## 原則

- 2 つ以上の独立 reviewer を別コンテキストで起動できた時だけ成立済み review とする。
- 単一 reviewer、self review、degraded local check を APPROVE / REQUEST_CHANGES の代替にしない。
- Codex Desktop など subagent 起動に user 明示許可が必要な runtime では、許可がなければ `BLOCKED: subagent 明示許可なし` で止める。
- Claude Code 経由でこの skill を実行している場合は、後述の `Claude Code 経由の実行` を優先し、reviewer 実行を `codex exec` 経由に固定する。
- reviewer は編集しない。coordinator だけが採用 finding を検証し、必要なら修正する。
- review artifact を固定ファイルとして repo に増やさない。結果は会話内に返す。
- ExecPlan gate として実行した review は、専用 artifact を増やさず、relevant ExecPlan の `発見` または `受け入れ条件` に reviewer ids、verdict、未解決 finding、未検証範囲、実行した verification command の要約を残す。
- review は `mise run verify` の代替ではない。deterministic verification の結果と review verdict を分けて報告する。
- private workspace data を外部 service へ送る reviewer は、design review に限り user の standing approval 済みとして扱う。`claude_design_review:off` が指定された時だけ Claude reviewer を無効化する。その他の fallback は user の明示承認がある時だけ使う。
- `claude-design-reviewer` は通常の `design-reviewer` を置き換える fallback ではなく、デザイン観点の追加 reviewer として扱う。

## Claude Code 経由の実行

Claude Code からこの project-local review skill が呼ばれた場合、review 実行は Codex CLI に委譲します。Claude Code 自身の self review、単一 reviewer、または Claude Code 内の subagent review を、この skill の `APPROVE` / `REQUEST_CHANGES` 判定の代替にしてはいけません。

例外として、design review 起動判定に該当し `claude_design_review` が `off` でない場合は、後述の `claude-design-reviewer` を別プロセスの `claude -p` で追加実行する。この場合も Claude Code の自己点検ではなく、scoped prompt bundle を入力とする独立 reviewer として扱います。

実行契約:

1. reviewer set は通常どおりこの skill の `reviewer set` で決める。
2. 各 reviewer について、独立した `codex exec --sandbox read-only --ephemeral -o <output-file> <prompt>` を実行する。user scope review skill の wrapper が利用できる環境では、その wrapper を使ってもよい。
3. prompt には reviewer id、担当観点、primary scope、除外 scope、user request、relevant ExecPlan の acceptance、編集禁止、日本語出力、finding 形式を含める。
4. prompt には標準期待出力として `verdict`, `findings`, `evidence`, `blocker`, `confidence` を含める。
5. `codex review` の built-in surface、raw stdout 解析、Claude Code 自身の自己点検は fallback にしない。
6. `codex` が無い、`codex exec` が失敗する、`-o` output が生成されない、または output 形式が壊れている場合は `BLOCKED: codex exec review unavailable` として停止する。

## scope 決定

1. GitHub PR URL は対象外です。`pr-review` に委譲して停止します。
2. user が `scope` / `base` / path を指定したらそれを優先する。
3. relevant ExecPlan に `review.scope_command` / `review.untracked_paths` が書かれていれば、それを primary scope の再現方法にする。
4. `branch diff` 指定なら `git diff {base}...HEAD` と `git log {base}..HEAD` を照合する。
5. committed branch diff が空で working tree に変更がある場合は、その事実を明記し、user の task 文脈が working tree review を求めていれば working tree を対象にする。
6. それ以外は staged diff を優先し、staged がなければ unstaged diff と untracked files を対象にする。

untracked files は次で確認します。

    git ls-files --others --exclude-standard

`.pnpm-store/`, `.next/`, `node_modules/`, `tsconfig.tsbuildinfo` は生成物として review 対象外です。

## design review 起動判定

`design-reviewer` は条件付きで起動します。通常の docs / skills / backend / metadata 変更では追加しません。

起動する条件:

- user_request が `design`, `デザイン`, `UX`, `UI`, `情報設計`, `IA`, `ビジュアル`, `visual`, `体験`, `導線`, `レイアウト`, `見た目`, `雰囲気`, `トーン` のいずれかを明示している。
- `design_review` が `on`。
- 差分が `DESIGN.md`、route-level UI copy、layout、CSS、component composition、navigation、Home / Notes / About の情報構造、または user journey を変更し、かつ user-visible な判断が含まれる。

起動しない条件:

- `design_review` が `off`。
- lint、format、dependency、metadata、routing redirect、Markdown renderer、skill/docs の機械的変更だけで、利用者体験や情報構造を評価する根拠がない。
- reviewer が対象画面、user_request、DESIGN.md、または受け入れ条件を参照できず、好み以上の根拠を持てない。

`design-reviewer` と `ui-reviewer` は役割を分けます。`ui-reviewer` は accessibility、responsive、hover / keyboard、visual regression を主に見る。`design-reviewer` はコンセプト、体験、情報設計、視覚言語の整合を主に見る。

## Claude design review 起動判定

`claude-design-reviewer` は、Claude Code CLI を使う design review 専用の追加 reviewer です。通常の `design-reviewer` を置き換えず、design review 起動時の既定追加 reviewer として起動します。

起動する条件:

- `design review 起動判定` に該当している。
- `claude_design_review` が `auto` または `on` である。既定は `auto`。
- `claude` CLI が利用でき、`claude -p` / `claude --print` の非対話実行が可能である。
- coordinator が Claude に送る scoped prompt bundle の内容を説明できる。

起動しない条件:

- `claude_design_review` が `off`。
- design review 条件に該当しない。
- private workspace data を外部 model に送ることを user が明示的に拒否している。
- `claude` CLI が無い、auth / network / quota で実行できない、または output が壊れている。この場合、`claude_design_review:on` なら `BLOCKED: claude design review unavailable`、`auto` なら `claude-design-reviewer skipped` として未検証範囲に残し、他の reviewer で継続する。

実行契約:

1. coordinator が先に scope を決め、branch diff / staged diff / working tree diff の必要部分、対象 file snippets、`DESIGN.md`、relevant ExecPlan acceptance、browser verification summary を scoped prompt bundle にまとめる。
2. `claude -p --output-format json` で実行する。Claude には編集権限を渡さず、reviewer id、担当観点、除外 scope、finding 形式、好みだけの提案禁止を prompt に含める。
3. Claude の output が parse でき、reviewer id と verdict / findings が確認できた場合だけ独立 reviewer として数える。
4. Claude の finding も coordinator が file:line、user_request、`DESIGN.md`、対象 route、画面確認で再検証する。好みだけの提案、scope 外の全面リデザイン、画面確認なしの断定は採用しない。
5. 実行した場合は、最終出力または relevant ExecPlan に `claude-design-reviewer` の使用有無、送った scope の要約、未検証範囲を残す。

## reviewer set

最小 set は 2 reviewer です。差分に応じて追加します。

| reviewer | 起動条件 | 観点 |
| --- | --- | --- |
| `contract-reviewer` | 常時 | `AGENTS.md`, `PLANS.md`, local skills, `mise.toml`, ExecPlan, task scope の矛盾 |
| `app-reviewer` | `web/` または app 挙動変更 | Next.js App Router, TypeScript, routing, ISR, metadata, tests |
| `security-reviewer` | secret, auth, server/client, Notes Markdown renderer, frontmatter, Notion sync, `dangerouslySetInnerHTML`, `.gitignore` | secret exposure, server/client boundary, Markdown renderer, XSS, generated artifact |
| `ce-reviewer` | docs, skills, agent instruction | SSoT, context clash, lost-in-middle, artifact trail, 日本語文体 |
| `ui-reviewer` | UI / CSS / component | responsive, accessibility, visual regression, hover/keyboard behavior |
| `design-reviewer` | `design review 起動判定` に該当 | Design Thinking, UX Design, Information Architecture, Visual Design |
| `claude-design-reviewer` | `Claude design review 起動判定` に該当 | Claude Code CLI による Design Thinking, UX Design, Information Architecture, Visual Design の追加レビュー |

docs / skills だけの変更では、既定で `contract-reviewer` と `ce-reviewer` を使います。security 境界に触れる場合は `security-reviewer` を追加します。

design docs / skill の変更で design-reviewer の条件や観点自体を変更する場合は、`contract-reviewer` と `ce-reviewer` に加えて `design-reviewer` を追加してよい。ただし実画面の評価ではなく、review 観点の妥当性を対象にする。

## design-reviewer 観点

`design-reviewer` は次の 4 観点で user-visible な問題だけを探します。

1. Design Thinking / デザイン思考
    - 想定利用者、訪問文脈、初回/再訪の目的に対して、画面や導線が問題を解いているか。
    - user_request、DESIGN.md、ExecPlan の目的と実装がずれていないか。
    - 作り手の都合や説明過多が、利用者の理解や探索を邪魔していないか。

2. UX Design / ユーザー体験設計
    - 最初に何を読めばよいか、次に何をすればよいかが自然に分かるか。
    - hover、focus、link、navigation、empty / loading 相当の状態が、期待に反しないか。
    - モバイルとデスクトップで読む流れ、タップ対象、スクロール量、戻り方が破綻していないか。

3. Information Architecture / 情報設計
    - Home、About、Notes、記事詳細などの役割が重複しすぎていないか。
    - 見出し、補助ラベル、metadata、navigation、一覧項目の分類が一貫しているか。
    - 情報の優先順位、グルーピング、日付/種別/タイトルの関係が理解しやすいか。

4. Visual Design / ビジュアルデザイン
    - typography、余白、罫線、色、icon / mark、motion が DESIGN.md の方向性に合っているか。
    - 視覚的な強弱が過剰または不足していないか。
    - 装飾、画像、絵文字、カード、影、角丸、色数がコンセプトと競合していないか。

finding にしてよいもの:

- user_request、DESIGN.md、route 目的、アクセシビリティ、認知負荷、情報探索、または明確な visual regression に根拠がある。
- 対象 file / line と、最小修正の方向を示せる。
- 実装者が対応すると user-visible な改善につながる。

finding にしてはいけないもの:

- reviewer の好みだけの色、文体、レイアウト提案。
- scope 外の全面リデザイン提案。
- 実装 diff に関係しない既存の抽象的な改善案。
- 画面確認なしに断定する visual finding。画面確認できない場合は `未検証範囲` に残す。

## reviewer prompt 契約

各 reviewer には次を渡します。

- reviewer id と担当観点
- primary scope と除外 scope
- user request と relevant ExecPlan の acceptance
- PR 作成・更新前の task では relevant ExecPlan の `pr-writer receipt` 記録手順
- PR 作成・更新済みの task では relevant ExecPlan の `pr-writer receipt`
- 編集禁止
- 日本語出力
- 標準期待出力は `verdict`, `findings`, `evidence`, `blocker`, `confidence`
- finding は `P1/P2/P3 file:line issue reason smallest fix` 形式
- 確証がない改善提案や好みは finding にしない

`design-reviewer` には追加で次を渡します。

- Design Thinking / UX Design / Information Architecture / Visual Design の 4 観点
- user_request、DESIGN.md、relevant ExecPlan、対象 route / screenshot / browser verification の有無
- finding にしてよいもの / してはいけないものの基準
- visual finding は、画面確認または CSS / markup から再現可能な根拠がある場合だけ出すこと

`claude-design-reviewer` には、`design-reviewer` の追加情報に加えて次を渡します。

- reviewer id は必ず `claude-design-reviewer`
- `claude -p` で実行される read-only reviewer であり、編集、commit、PR 操作、shell command 実行をしないこと
- output は `verdict`, `findings`, `evidence`, `blocker`, `confidence` を含めること。`verdict` は `APPROVE` / `REQUEST_CHANGES` / `BLOCKED` のいずれかとし、採用候補 finding は `P1/P2/P3 file:line issue reason smallest fix` 形式で返すこと
- scoped prompt bundle に含まれていない画面やファイルについて断定しないこと
- user の好みや全面リデザイン提案ではなく、user_request、DESIGN.md、対象 route、画面確認に根拠がある指摘だけ出すこと

reviewer には `git diff` の再発見を任せません。coordinator が scope を確定し、必要な差分または対象 path を渡します。reviewer は必要な現在ファイルを読むことだけ許可されます。

## 集約と検証

1. reviewer 結果を source reviewer 付きで集約する。
2. 同一原因はまとめる。
3. diff scope 外、task scope 外、既存問題だけの指摘、ExecPlan で明示的に見送った論点は除外する。
4. design-reviewer の指摘は、user_request、DESIGN.md、対象 route、または画面確認に根拠があるかを確認し、好みだけの提案は除外する。
5. claude-design-reviewer の指摘は、外部 reviewer 由来であることを source reviewer として残し、採用前に同じ基準で再検証する。
6. 採用前に file:line と現行契約で再確認する。
7. PR 作成・更新前の review gate では、relevant ExecPlan の実行計画に `pr-writer receipt` を記録する手順があるか確認する。
8. PR 作成・更新済みの completion gate では、`pr-writer receipt` がない、または mode / base/head / 既存 PR 判定 / issue / template / UI preview / title-body / command / `gh pr view` 検証のどれかが欠けていれば finding として扱う。
9. 採用 finding が 1 件以上あれば `REQUEST_CHANGES`。0 件なら `APPROVE`。

指摘を出す時は、可能なら inline directive を使います。

    ::code-comment{path="path" line=1 severity="P2" title="短いタイトル"}
    問題、理由、最小修正。
    ::

## fix loop

`review fix loop` または ExecPlan skill から呼ばれた場合:

1. 採用 finding だけを修正する。
2. `git diff --check` を実行する。
3. untracked files が review 対象に含まれる場合は、`git diff --check` だけで合格にしない。対象 file ごとに `git diff --no-index --check /dev/null <file>` 相当、または trailing whitespace 検査を実行する。
4. 意味のある app 変更では `mise run verify` を実行する。docs / skills だけでも user が求めたら実行する。
5. UI 変更では browser / UI verification を行う。できない場合は degraded と明記する。
6. 同じ reviewer set で再 review する。
7. 最大 2 cycle。残る場合は `REQUEST_CHANGES` として残件を報告する。

`mise run verify` が環境変数不足や外部 service 要因で止まる場合は、失敗箇所、差分起因かどうか、未検証範囲を分けて報告します。

## 出力形式

成立済み review の最終出力は日本語で、先頭を `verdict` field にします。
出力には `verdict`, `findings`, `evidence`, `blocker`, `confidence` を含めます。

    verdict: APPROVE
    findings: なし
    evidence: 対象 scope、検証 command、根拠。
    blocker: なし
    confidence: high

または:

    verdict: REQUEST_CHANGES
    findings:
      - P2 path:line issue reason smallest fix
    evidence: 対象 scope、検証 command、根拠。
    blocker: 採用 finding が残っている。
    confidence: medium

    ::code-comment{...}
    ...
    ::

または:

    verdict: BLOCKED
    findings: 未判定
    evidence: 試行した command と失敗箇所。
    blocker: reason
    confidence: low

サマリーには reviewer ids、対象 scope、verdict、検証 command、未解決 finding、未検証範囲を含めます。未解決 finding がない時は `findings なし` を明示します。
ExecPlan gate として実行した場合、coordinator は同じ summary を relevant ExecPlan の `発見` または `受け入れ条件` に追記してから完了扱いにします。

## 完了条件

- 2 つ以上の独立 reviewer が実行されている。
- source reviewer を失わず集約している。
- 採用 finding は file:line と契約で検証済み。
- fix loop 後に同じ reviewer set で再確認している。
- `git diff --check` と必要な `mise` task の結果を報告している。
- ExecPlan gate の場合は、review summary が relevant ExecPlan に記録されている。
- PR 作成・更新前の ExecPlan gate の場合は、`pr-writer receipt` を記録する手順が relevant ExecPlan に書かれている。
- PR 作成・更新済みの completion gate の場合は、`pr-writer receipt` が relevant ExecPlan に記録されている。
