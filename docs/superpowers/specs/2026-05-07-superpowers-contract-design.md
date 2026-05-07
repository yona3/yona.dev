# Superpowers 規約移行設計

## 目的

yona.dev の新規作業フローを ExecPlan 前提から Superpowers 前提に移行する。既存の ExecPlan は削除せず、過去判断を確認するためのログとして残す。PR 作成までの納品経路は、`commit` skill と `pr-writer` skill を使う。

## 背景

`~/dotfiles` は root `AGENTS.md` で Superpowers を主経路にし、`PLANS.md` を ExecPlan 履歴案内へ縮退している。yona.dev も同じ形へ寄せる。ただし、この repo 固有の `web/` 境界、`mise run verify`、Notes / Notion / route の禁止境界、project-local `review` skill、`pr-writer` gate は残す。

## 採用方針

1. `AGENTS.md` は短い行動契約として残し、`Superpowers` 節を新規作業の入口にする。
2. `PLANS.md` は履歴案内にし、新規 ExecPlan の schema を定義しない。
3. `docs/conventions.md` は詳細規約として、task artifact を `docs/superpowers/{specs,plans}/` に切り替える。
4. `docs/skills/exec-plan/SKILL.md` は廃止済み案内にし、旧 skill 名から現在の Superpowers 主経路へ戻せるようにする。
5. `docs/skills/review/SKILL.md` は ExecPlan evidence 前提をやめ、Superpowers spec / plan または最終報告へ review summary を残す契約にする。
6. `docs/exec-plans/active/` に残っていた旧親 ExecPlan は `docs/exec-plans/archived-active/` へ移し、`completed/` と同じく履歴として保存する。
7. commit は `commit` skill を入口にし、PR 作成・更新は `pr-writer` skill を入口にする。

## 対象外

- 旧 ExecPlan 本文の schema 変換。
- completed ExecPlan の文体修正。
- `mise.toml`、app code、route、Notes renderer、依存関係の変更。
- `review` skill の reviewer set や Claude design review 方針の再設計。

## 受け入れ条件

- `rg -n "ExecPlan|exec-plan|PLANS.md|docs/exec-plans" AGENTS.md PLANS.md docs/conventions.md docs/skills docs/exec-plans/README.md docs/superpowers` の結果が、旧履歴としての参照と廃止案内に限定される。
- `docs/superpowers/specs/` と `docs/superpowers/plans/` が存在し、今回の設計と計画が残る。
- `docs/exec-plans/active/` に作業中の旧 ExecPlan が残らず、移行時点の active は `docs/exec-plans/archived-active/` に残る。
- `git diff --check` と `mise run verify` が成功する。
- project-local `review` skill の観点で、契約上の矛盾がない。
- `commit` skill 経由で commit し、`pr-writer` skill 経由で PR を作成する。

## 判断

`PLANS.md` を削除しない。旧リンクや過去ログの入口として残すほうが、既存文脈を失わずに新規フローを切り替えられるため。

旧 active ExecPlan は completed へ移さない。完了ではなく移行時点の未完了ログなので、`archived-active/` に分ける。

review evidence は固定ファイルを増やさない。必要な継続情報は Superpowers spec / plan に残し、短い作業では最終報告に残す。
