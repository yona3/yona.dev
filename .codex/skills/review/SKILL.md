---
name: review
description: yona.dev専用multi-agent差分レビュー。user scope reviewを基にscope固定、2+独立reviewer、fix loop判定を行う。
---

# yona.dev Multi-Agent Review Skill

この skill は、yona.dev の差分を project-specific に review するための local skill です。user scope の review skill を参考にしつつ、repo 固有の Next.js / microCMS / docs / skill 変更へ必要な reviewer set だけを定義します。review の手順は変更頻度が高いため、`AGENTS.md` や `docs/` ではなくこの skill に置きます。

## 入力契約

| 入力 | 必須 | 説明 |
| --- | --- | --- |
| mode | 任意 | `branch`, `staged`, `working-tree`, `fix-loop` |
| base | 任意 | branch review の base。既定は `main` |
| scope | 任意 | 対象 path / route / module / ExecPlan |
| user_request | 推奨 | 今回の task 目的と除外範囲 |

## 原則

- 2 つ以上の独立 reviewer を別コンテキストで起動できた時だけ成立済み review とする。
- 単一 reviewer、self review、degraded local check を APPROVE / REQUEST_CHANGES の代替にしない。
- Codex Desktop など subagent 起動に user 明示許可が必要な runtime では、許可がなければ `BLOCKED: subagent 明示許可なし` で止める。
- reviewer は編集しない。coordinator だけが採用 finding を検証し、必要なら修正する。
- review artifact を固定ファイルとして repo に増やさない。結果は会話内に返す。
- ExecPlan gate として実行した review は、専用 artifact を増やさず、relevant ExecPlan の `気づきと発見` または `検証と受け入れ条件` に reviewer id、verdict、未解決 finding、未検証範囲の要約を残す。
- private workspace data を外部 service へ送る fallback は、user の明示承認がある時だけ使う。

## scope 決定

1. GitHub PR URL は対象外です。`pr-review` に委譲して停止します。
2. user が `scope` / `base` / path を指定したらそれを優先する。
3. relevant ExecPlan があり、scope command や対象 file が書かれていればそれを primary scope にする。
4. `branch diff` 指定なら `git diff {base}...HEAD` と `git log {base}..HEAD` を照合する。
5. committed branch diff が空で working tree に変更がある場合は、その事実を明記し、user の task 文脈が working tree review を求めていれば working tree を対象にする。
6. それ以外は staged diff を優先し、staged がなければ unstaged diff と untracked files を対象にする。

untracked files は次で確認します。

    git ls-files --others --exclude-standard

`.pnpm-store/`, `.next/`, `node_modules/`, `tsconfig.tsbuildinfo` は生成物として review 対象外です。

## reviewer set

最小 set は 2 reviewer です。差分に応じて追加します。

| reviewer | 起動条件 | 観点 |
| --- | --- | --- |
| `contract-reviewer` | 常時 | `AGENTS.md`, `PLANS.md`, local skills, `mise.toml`, ExecPlan, task scope の矛盾 |
| `app-reviewer` | `web/` または app 挙動変更 | Next.js App Router, TypeScript, routing, ISR, metadata, tests |
| `security-reviewer` | secret, auth, server/client, microCMS HTML, `.gitignore` | secret exposure, `server-only`, DOMPurify, XSS, generated artifact |
| `ce-reviewer` | docs, skills, agent instruction | SSoT, context clash, lost-in-middle, artifact trail, 日本語文体 |
| `ui-reviewer` | UI / CSS / component | responsive, accessibility, visual regression, hover/keyboard behavior |

docs / skills だけの変更では、既定で `contract-reviewer` と `ce-reviewer` を使います。security 境界に触れる場合は `security-reviewer` を追加します。

## reviewer prompt 契約

各 reviewer には次を渡します。

- reviewer id と担当観点
- primary scope と除外 scope
- user request と relevant ExecPlan の acceptance
- 編集禁止
- 日本語出力
- finding は `P1/P2/P3 file:line issue reason smallest fix` 形式
- 確証がない改善提案や好みは finding にしない

reviewer には `git diff` の再発見を任せません。coordinator が scope を確定し、必要な差分または対象 path を渡します。reviewer は必要な現在ファイルを読むことだけ許可されます。

## 集約と検証

1. reviewer 結果を source reviewer 付きで集約する。
2. 同一原因はまとめる。
3. diff scope 外、task scope 外、既存問題だけの指摘、ExecPlan で明示的に見送った論点は除外する。
4. 採用前に file:line と現行契約で再確認する。
5. 採用 finding が 1 件以上あれば `REQUEST_CHANGES`。0 件なら `APPROVE`。

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

`mise run verify` が `MICROCMS_API_KEY is not set` で止まる場合は既知の環境要因として扱い、lint / compile の進捗と未検証範囲を分けて報告します。

## 出力形式

成立済み review の最終出力は日本語で、先頭に判定を書きます。

    APPROVE

または:

    REQUEST_CHANGES

    ::code-comment{...}
    ...
    ::

または:

    BLOCKED: reason

サマリーには reviewer 数、対象 scope、検証 command、未検証範囲を含めます。未解決 finding がない時は `findings なし` を明示します。

## 完了条件

- 2 つ以上の独立 reviewer が実行されている。
- source reviewer を失わず集約している。
- 採用 finding は file:line と契約で検証済み。
- fix loop 後に同じ reviewer set で再確認している。
- `git diff --check` と必要な `mise` task の結果を報告している。
