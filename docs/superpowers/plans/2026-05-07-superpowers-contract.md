# Superpowers 規約移行 実装計画

> **agentic workers 向け:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development` 推奨、または `superpowers:executing-plans` を使い、この計画をタスクごとに実装する。手順は checkbox (`- [ ]`) で追跡する。

**目的:** yona.dev の新規作業フローを ExecPlan 前提から Superpowers 前提に移行し、旧 ExecPlan を履歴として残す。

**構成:** root `AGENTS.md` を短い入口、`docs/conventions.md` を詳細規約、`docs/superpowers/` を現在の設計 / 計画置き場にする。`PLANS.md` と `docs/exec-plans/` は旧ログの入口に縮退する。

**技術構成:** Markdown docs、project-local skills、`mise run verify`、`pr-writer` 経由の GitHub PR。

---

### タスク 1: 履歴と現行 artifact の置き場を作る

**対象 file:**
- 作成: `docs/superpowers/specs/2026-05-07-superpowers-contract-design.md`
- 作成: `docs/superpowers/plans/2026-05-07-superpowers-contract.md`
- 作成: `docs/exec-plans/README.md`
- 移動: `docs/exec-plans/active/202604261459_site_refresh_parent/` から `docs/exec-plans/archived-active/202604261459_site_refresh_parent/`

- [x] **手順 1: directory を作成する**

実行: `mkdir -p docs/superpowers/specs docs/superpowers/plans docs/exec-plans/archived-active`
期待結果: directory が存在する。

- [x] **手順 2: 旧 active ExecPlan を退避する**

実行: `mv docs/exec-plans/active/202604261459_site_refresh_parent docs/exec-plans/archived-active/202604261459_site_refresh_parent`
期待結果: `docs/exec-plans/active/` は `.gitkeep` だけを残し、旧親 ExecPlan は `archived-active/` で読める。

- [x] **手順 3: Superpowers 設計と計画を追加する**

`docs/superpowers/specs/2026-05-07-superpowers-contract-design.md` に設計を、この file に実装計画を書く。
期待結果: 後続 agent が移行理由と実行手順を確認できる。

### タスク 2: Root contract を Superpowers 前提へ切り替える

**対象 file:**
- 変更: `AGENTS.md`
- 変更: `PLANS.md`
- 変更: `docs/conventions.md`

- [x] **手順 1: `AGENTS.md` を更新する**

`ExecPlan` 節を `Superpowers` 節へ置き換える。`mise run verify`、`commit` skill、`pr-writer` gate は残す。`docs/superpowers/` は優先順位ではなく、該当 task の spec / plan がある場合の参照先にする。
期待結果: 新規作業は `superpowers:using-superpowers` から始まり、旧 ExecPlan は履歴と明記される。

- [x] **手順 2: `PLANS.md` を置き換える**

ExecPlan schema を短い履歴案内へ置き換える。
期待結果: `PLANS.md` は現在の作業フローを定義せず、`docs/superpowers/` と `docs/exec-plans/` を案内する。

- [x] **手順 3: `docs/conventions.md` を更新する**

SSoT、CE 層、task artifact、review evidence、TDD acceptance、タスク分割の参照先を ExecPlan から Superpowers spec / plan へ変える。
期待結果: 詳細規約が新規 ExecPlan を要求せず、commit は `commit` skill を入口にする。

### タスク 3: Project-local skills を現在フローへ合わせる

**対象 file:**
- 変更: `docs/skills/exec-plan/SKILL.md`
- 変更: `docs/skills/review/SKILL.md`

- [x] **手順 1: `exec-plan` skill body を廃止案内にする**

skill body を、Superpowers、`review`、`commit`、`pr-writer` へ誘導する履歴案内に変える。
期待結果: 旧 skill 呼び出しが旧 ExecPlan flow を再開しない。

- [x] **手順 2: `review` skill の evidence 表現を更新する**

ExecPlan evidence 要件を Superpowers spec / plan または最終報告の evidence 要件へ置き換える。
期待結果: project-local review は残り、ExecPlan を現在の artifact に戻さない。`PLANS.md` は履歴案内としての矛盾確認だけに使う。

### タスク 4: 検証、review、commit、PR

**対象 file:**
- タスク 1-3 の変更 file すべて。

- [x] **手順 1: 参照を確認する**

実行: `rg -n "ExecPlan|exec-plan|PLANS.md|docs/exec-plans" AGENTS.md PLANS.md docs/conventions.md docs/skills docs/exec-plans/README.md docs/superpowers`
期待結果: 参照は履歴、互換性、または review context に限定される。

- [x] **手順 2: whitespace を確認する**

実行: `git diff --check`
期待結果: 出力なし、exit 0。

- [x] **手順 3: hard guard を実行する**

実行: `mise run verify`
期待結果: lint と build が成功する。

- [x] **手順 4: project-local review を実行する**

`docs/skills/review/SKILL.md` を docs / skills scope で使う。
期待結果: reviewer summary が `APPROVE`、または採用 finding をすべて修正済み。

- [ ] **手順 5: commit する**

`commit` skill を使う。規約移行 file だけを stage し、日本語の Conventional Commit message で commit する。
期待結果: 1 つの論理的 docs commit ができる。

- [ ] **手順 6: PR を作成する**

`issueなし` として `pr-writer` skill を使う。
期待結果: GitHub に PR があり、body に summary、verification、review status、関連 issue なしが書かれる。

### 検証記録

- `rg -n "ExecPlan|exec-plan|PLANS.md|docs/exec-plans" AGENTS.md PLANS.md docs/conventions.md docs/skills docs/exec-plans/README.md docs/superpowers`: 参照は履歴、互換性、review context、またはこの計画の検証項目に限定。
- `git diff --check`: exit 0。
- `mise run verify`: exit 0。`pnpm lint` と `pnpm build` が成功。
- project-local review: 初回 `contract-reviewer` / `ce-reviewer` の指摘を反映後、再 review で両方 `APPROVE`、finding なし。
