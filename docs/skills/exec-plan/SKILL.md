---
name: exec-plan
description: 廃止済み ExecPlan flow の案内。新規計画は Superpowers plugin に委譲し、旧 ExecPlan は履歴として読む。
---

# yona.dev 旧 ExecPlan Skill

この skill は履歴案内です。新規の計画作成、実装、検証、commit、PR 作成はこの skill では進めません。

## 現在の主経路

現在の開発方法は Superpowers plugin が定義する。この skill は Superpowers の個別 skill 名、起動条件、内部手順を再定義しない。

repo 固有の境界だけ次に示す。
- 設計や計画を永続化する場合は `docs/superpowers/specs/` と `docs/superpowers/plans/` に置く。
- 完了主張、commit、PR 作成の前に `mise run verify` を再実行する。
- review が必要な変更では `docs/skills/review/SKILL.md` を使う。
- commit は `commit` skill、PR 作成・更新は `pr-writer` skill を使う。

## 旧履歴の扱い

- `PLANS.md` は履歴案内であり、schema 正本ではない。
- 完了済みの旧 ExecPlan は `docs/exec-plans/completed/` に残す。
- 移行時点で active に残っていた旧 ExecPlan は `docs/exec-plans/archived-active/` に残す。
- 旧 ExecPlan 本文は schema 追従、文体修正、現在フローへの変換の対象にしない。
- 過去判断の確認が必要な時だけ参照し、現在の計画や完了判定は Superpowers spec / plan と会話内の最新指示から判断する。

## 互換性

`.codex/skills/exec-plan` と `.claude/skills/exec-plan` は、この履歴案内への symlink として残す。旧 skill 名を呼び出した agent が現在の主経路へ戻れるようにするためであり、ExecPlan 作成を再開するためではない。
