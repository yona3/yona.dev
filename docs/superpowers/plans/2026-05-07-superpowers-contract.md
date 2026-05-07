# Superpowers 規約移行 実装計画

> **agentic workers 向け:** 実行方法は Superpowers plugin の指示に従う。この計画は repo 固有の対象 file、保存先、検証結果だけを追跡する。

**目的:** yona.dev の新規作業フローを ExecPlan 前提から Superpowers 前提に移行し、旧 ExecPlan を履歴として残す。Superpowers plugin の責務と repo 固有規約の責務を分け、重複する手順記述は repo 側から削る。

**構成:** root `AGENTS.md` を短い入口、`docs/conventions.md` を詳細規約、`docs/superpowers/` を現在の設計 / 計画置き場にする。`PLANS.md` と `docs/exec-plans/` は旧ログの入口に縮退する。

**技術構成:** Markdown docs、project-local skills、`mise run verify`、`pr-writer` 経由の GitHub PR。

**責務境界:** Superpowers plugin は開発方法を定義する。yona.dev は artifact 保存先、hard guard、review、commit、PR gate、禁止境界だけを定義する。

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
期待結果: 新規作業は Superpowers plugin を主経路にし、旧 ExecPlan は履歴と明記される。

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

- [x] **手順 5: commit する**

`commit` skill を使う。規約移行 file だけを stage し、日本語の Conventional Commit message で commit する。
期待結果: 1 つの論理的 docs commit ができる。

- [x] **手順 6: PR を作成する**

`issueなし` として `pr-writer` skill を使う。
期待結果: GitHub に PR があり、body に summary、verification、review status、関連 issue なしが書かれる。

### タスク 5: CE 観点で責務重複を削る

**対象 file:**
- 変更: `AGENTS.md`
- 変更: `PLANS.md`
- 変更: `docs/conventions.md`
- 変更: `docs/skills/exec-plan/SKILL.md`
- 変更: `docs/superpowers/specs/2026-05-07-superpowers-contract-design.md`
- 変更: `docs/superpowers/plans/2026-05-07-superpowers-contract.md`

- [x] **手順 1: Superpowers plugin の責務を明確にする**

plugin は skill 選択、方針整理、計画、実装方式、完了前検証の方法を持つ。repo 側は保存先、hard guard、review、commit、PR gate、禁止境界だけを持つ。
期待結果: `AGENTS.md` と設計 artifact で責務境界が読める。

- [x] **手順 2: repo 側の重複手順を削る**

`AGENTS.md`、`PLANS.md`、`docs/skills/exec-plan/SKILL.md` から Superpowers の個別 skill 名や内部手順の列挙を削る。
期待結果: repo 側が Superpowers plugin の内部手順を再定義しない。

### 検証記録

- `rg -n "ExecPlan|exec-plan|PLANS.md|docs/exec-plans" AGENTS.md PLANS.md docs/conventions.md docs/skills docs/exec-plans/README.md docs/superpowers`: 参照は履歴、互換性、review context、またはこの計画の検証項目に限定。
- `git diff --check`: exit 0。
- `mise run verify`: exit 0。`pnpm lint` と `pnpm build` が成功。
- project-local review: 初回 `contract-reviewer` / `ce-reviewer` の指摘を反映後、再 review で両方 `APPROVE`、finding なし。
- `pr-writer` CREATE: PR #26 を作成。`gh pr view 26` で `OPEN`、`CLEAN`、draft ではないことを確認。
- CE refactor check: `rg -n "superpowers:" AGENTS.md PLANS.md docs/conventions.md docs/skills/exec-plan/SKILL.md`: exit 1、出力なし。
- CE refactor review: `contract-reviewer` / `ce-reviewer` ともに `APPROVE`、finding なし。
