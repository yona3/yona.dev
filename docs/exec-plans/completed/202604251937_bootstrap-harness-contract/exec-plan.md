この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

この変更の前は、`AGENTS.md` と `CLAUDE.md` が `README.md` を参照しており、README が人間向け説明と agent 行動契約を兼ねていた。さらに ExecPlan の共通契約と task artifact 置き場がなく、repo-wide contract 変更の再開情報を残す標準位置がなかった。

この変更の後は、`AGENTS.md` が agent 行動契約の正本になり、`CLAUDE.md` は `AGENTS.md` を参照するだけになる。ExecPlan の共通契約は `PLANS.md`、詳細規約は `docs/conventions.md`、task artifact は `docs/exec-plans/{active,completed}/` に分離される。

## 進捗

- [x] 2026-04-25 19:37+09:00 harness-architect の提案に基づき agent 契約導入を開始した。
- [x] 2026-04-25 19:37+09:00 `AGENTS.md` を agent SSoT として再生成し、`CLAUDE.md` を `@AGENTS.md` に変更した。
- [x] 2026-04-25 19:37+09:00 `PLANS.md` と `docs/conventions.md` を追加し、ExecPlan 置き場を作成した。
- [x] 2026-04-25 19:37+09:00 self review の指摘により、この bootstrap ExecPlan を追加した。
- [x] 2026-04-25 19:38+09:00 `PLANS.md` の英語 canonical 見出しを日本語主の見出しへ修正した。
- [x] 2026-04-25 19:38+09:00 `git diff --check`、`.pnpm-store` の除外確認、`mise run lint` を実行した。
- [x] 2026-04-25 19:58+09:00 review 指摘に基づき、`PLANS.md` の section skeleton を `##` literal の copyable block に修正した。
- [x] 2026-04-25 20:07+09:00 review fix loop の指摘に基づき、`PLANS.md` の skeleton に冒頭準拠文と末尾 `Change note:` placeholder を追加した。

## 発見

Observation: 変更前の `AGENTS.md` と `CLAUDE.md` は `README.md` だけを参照していた。
Evidence:
    diff --git a/AGENTS.md b/AGENTS.md
    -@README.md
    +# Agent 指示

Observation: `mise run verify` は `MICROCMS_API_KEY` 未設定の環境では build で停止する。
Evidence:
    [build] Error: Failed to collect configuration for /blog
    [cause]: Error: MICROCMS_API_KEY is not set

Observation: `.pnpm-store/` は生成物であり、git 管理対象にしない必要がある。
Evidence:
    .gitignore:5:/.pnpm-store/    .pnpm-store

## 判断

Decision: `AGENTS.md` を agent 行動契約の SSoT にし、`README.md` は人間向け説明に戻す。
Rationale: 人間向け説明と agent 行動契約を混ぜると、Hot 層に背景情報が入りすぎて指示が埋もれるため。
Date/Author: 2026-04-25 / Codex

Decision: hard guard は既存の `mise run verify` に一本化し、`verify.sh` は追加しない。
Rationale: 既に `mise.toml` が lint と build を束ねており、別 wrapper は SSoT を増やすため。
Date/Author: 2026-04-25 / Codex

Decision: この初回導入自体も bootstrap ExecPlan として記録する。
Rationale: 新しい `AGENTS.md` が repo-wide contract 変更時の ExecPlan 作成を求めるため、導入差分の artifact trail を欠落させない。
Date/Author: 2026-04-25 / Codex

## 契約

Dependency: `AGENTS.md`
Reason: agent が常時参照する Hot 層の行動契約。
Contract: README ではなく `AGENTS.md` を agent 行動契約の正本にする。

Dependency: `PLANS.md`
Reason: ExecPlan の schema と更新規則を定義する。
Contract: task 固有手順は `PLANS.md` に置かず、各 `exec-plan.md` に置く。

Dependency: `docs/conventions.md`
Reason: repo 固有 guardrail、分割基準、レビュー観点を Warm 層に置く。
Contract: `AGENTS.md` には必要最小限だけ置き、詳細はこの文書へ逃がす。

Dependency: `mise.toml`
Reason: root から実行する既存の検証入口。
Contract: `mise run verify` を hard guard とし、別の検証正本を増やさない。

## 実行計画

1. `AGENTS.md` を agent SSoT として日本語で再生成する。

    Working directory:
        <repo-root>
    Command:
        sed -n '1,140p' AGENTS.md
    Expected outcome:
        `AGENTS.md` が README 参照ではなく agent 行動契約を直接持つ。

2. `CLAUDE.md` を `@AGENTS.md` に変更する。

    Working directory:
        <repo-root>
    Command:
        sed -n '1,20p' CLAUDE.md
    Expected outcome:
        `CLAUDE.md` が `@AGENTS.md` だけを含む。

3. `PLANS.md` を追加し、ExecPlan schema と更新規則を定義する。

    Working directory:
        <repo-root>
    Command:
        sed -n '1,220p' PLANS.md
    Expected outcome:
        日本語 canonical 見出し、固定 token、必須 section、section 骨格が確認できる。

4. `docs/conventions.md` と `docs/exec-plans/{active,completed}/` を追加する。

    Working directory:
        <repo-root>
    Command:
        find docs -type f -maxdepth 4 -print
    Expected outcome:
        `docs/conventions.md` と active/completed の `.gitkeep` が存在する。

5. `.gitignore` に `/.pnpm-store/` を追加する。

    Working directory:
        <repo-root>
    Command:
        git check-ignore -v .pnpm-store
    Expected outcome:
        `.pnpm-store/` が root `.gitignore` で除外される。

## 受け入れ条件

Input: `git diff --check`
Observe:
    $ git diff --check
    # exit 0, no output
Failure signal:
    trailing whitespace や missing newline の error が出る。

Input: `mise run lint`
Observe:
    $ mise run lint
    [lint] $ pnpm lint
    # exit 0
Failure signal:
    lint error が出る。

Input: `git ls-files .pnpm-store && git ls-files --others --exclude-standard .pnpm-store`
Observe:
    $ git ls-files .pnpm-store && git ls-files --others --exclude-standard .pnpm-store
    # exit 0, no output
Failure signal:
    `.pnpm-store/` 配下の path が表示される。

Input: `mise run verify`
Observe:
    `MICROCMS_API_KEY` が設定された環境では lint と build が完了する。
Failure signal:
    `MICROCMS_API_KEY is not set` 以外の変更起因 error が出る。

## 復旧

1. 文書と ignore ルールの追加なので、再実行しても外部 state を壊さない。
2. lint や diff check が失敗した場合は、該当 file の文法・空白・参照関係を直して再実行する。
3. migration はない。生成物は `.pnpm-store/`、`.next/`、`node_modules/` を git 追跡しないことで隔離する。
4. 変更は additive であり、既存アプリコードには触れない。
5. 完了後は dev server を残さず、生成物は ignore された状態にする。

## 未完了

`MICROCMS_API_KEY` 未設定の worktree では `mise run verify` の build が `/blog` page data collection で停止する。環境変数がある環境で full verify を再実行する必要がある。

Change note: 2026-04-25 19:39+09:00 commit 対象の ExecPlan から個人の絶対 path を除き、`<repo-root>` 表記へ置き換えた。

Change note: 2026-04-25 19:58+09:00 `PLANS.md` の section skeleton が `##` section 契約と一致するよう、copyable block の見出しを `##` literal に揃えた。

Change note: 2026-04-25 20:07+09:00 `PLANS.md` の copyable skeleton が冒頭準拠文と末尾 `Change note:` 契約まで含むよう更新した。
