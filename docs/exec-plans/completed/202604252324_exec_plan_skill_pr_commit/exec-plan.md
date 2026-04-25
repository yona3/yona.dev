この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的と全体像

`.codex/skills/exec-plan/SKILL.md` に、PR 作成と commit 粒度の運用を明文化する。変更後は、ExecPlan skill から PR 作成へ進む場合に `pr-writer` skill を使い、issue が無い場合でも `issueなし` として自動作成できる。commit は `commit` skill を使い、調査した一般的な commit 粒度のベストプラクティスに沿って、小さく論理的な単位で行う。

Assumption: 今回は `pr-writer` skill と `commit` skill 本体は変更せず、project-local `exec-plan` skill の指示だけを更新する。

## 進捗

- [x] 2026-04-25 23:24+09:00 `exec-plan` / `commit` / `pr-writer` skill の現行契約を確認した。
- [x] 2026-04-25 23:24+09:00 commit 粒度の一般的なベストプラクティスを外部資料で調査した。
- [x] 2026-04-25 23:26+09:00 `.codex/skills/exec-plan/SKILL.md` に PR / commit 運用を反映した。
- [x] 2026-04-25 23:26+09:00 差分と検証結果を確認した。
- [x] 2026-04-25 23:26+09:00 ExecPlan を `docs/exec-plans/completed/202604252324_exec_plan_skill_pr_commit/` に移した。
- [x] 2026-04-25 23:30+09:00 review fix loop の採用 finding を修正した。
- [x] 2026-04-25 23:31+09:00 同じ reviewer set の再確認で `findings なし` を確認した。

## 気づきと発見

Observation: 現行の `exec-plan` skill は commit を「user が commit を依頼した時」または spec-to-PR の自律実行として扱い、PR 作成は具体的に `pr-writer` skill へ委譲していない。
Evidence:
    .codex/skills/exec-plan/SKILL.md の実行フロー step 8 / 9 に commit / PR 作成があるが、commit 粒度や pr-writer 委譲は未定義。

Observation: Pro Git は commit 前の `git diff --check` と、各 commit を論理的に分離された changeset にすることを推奨している。
Evidence:
    https://git-scm.com/book/tl/v2/Distributed-Git-Contributing-to-a-Project.html
    Commit Guidelines section に、whitespace check、one commit per issue、useful message、review しやすさ、revert しやすさが説明されている。

Observation: Google Engineering Practices は小さい CL を「1 つの self-contained change」と定義し、review しやすさ、bug 混入リスク低下、rollback のしやすさを理由にしている。
Evidence:
    https://google.github.io/eng-practices/review/developer/small-cls.html
    Small CLs section に、single thing、related tests、reviewer が理解できる情報、refactor と feature / bug fix の分離が説明されている。

Observation: Conventional Commits は commit message に type / optional scope / description を与え、commit の性質を人間と機械に伝える仕様で、複数 type にまたがる場合は可能なら複数 commit に戻ることを推奨している。
Evidence:
    https://www.conventionalcommits.org/en/v1.0.0/
    Summary / Specification / FAQ に、`<type>[optional scope]: <description>`、`feat` / `fix` / `BREAKING CHANGE`、複数 type の場合は multiple commits が説明されている。

Observation: `exec-plan` skill に commit / PR 運用 section を追加し、実行フローと spec-to-PR 契約を更新した。
Evidence:
    git diff --stat
     .codex/skills/exec-plan/SKILL.md | 21 +++++++++++++++++++--
     1 file changed, 19 insertions(+), 2 deletions(-)

Observation: `mise run verify` は lint と TypeScript compile まで進み、既存の runtime env 不足で `/blog` page data collection が停止した。
Evidence:
    mise run verify
    [lint] Finished in 25.71s
    [build] ✓ Compiled successfully in 17.7s
    [build] Error: MICROCMS_API_KEY is not set
    [build] Error: Failed to collect page data for /blog

Observation: review fix loop では `contract-reviewer` と `ce-reviewer` が同じ P3 finding を出し、採用 finding として修正した。
Evidence:
    contract-reviewer: completed ExecPlan に stale な `docs/exec-plans/active/...` path が残っていると指摘。
    ce-reviewer: completed 移動後の artifact trail として再実行すると現在の ExecPlan を確認できないと指摘。
    修正後、`具体手順` の diff command を completed path へ更新した。

Observation: review fix loop cycle 1 は同じ reviewer set で未解決 finding なしになった。
Evidence:
    contract-reviewer / 019dc50b-aacb-73c0-ba73-012018c9ca7d: findings なし。
    ce-reviewer / 019dc50b-ab0d-7e00-8da0-ed54d4006462: findings なし。

## 判断記録

Decision: commit 粒度の基準は「小さい」単独ではなく、「論理的に独立・review 可能・revert 可能・検証可能な changeset」として書く。
Rationale: 行数だけを基準にすると過剰分割や巨大 commit の両方を招くため、Pro Git / Google Engineering Practices / Conventional Commits の共通部分を採用する。
Date/Author: 2026-04-25 / Codex

Decision: PR 作成は ExecPlan skill から直接 `gh pr create` を指示せず、`pr-writer` skill に委譲する。
Rationale: PR title/body 生成、既存 PR update、issue なし、UI preview などの専用判断は `pr-writer` skill に集約されているため。
Date/Author: 2026-04-25 / Codex

Decision: issue が無い場合は blocker にせず、`pr-writer` へ `issueなし` を明示して PR を作成できるようにする。
Rationale: ユーザーが「issue なしの場合でも」と明示しており、暗黙スキップではなく明示的な no-issue input として扱えば pr-writer の issue 特定契約と衝突しないため。
Date/Author: 2026-04-25 / Codex

## 依存関係と契約

Dependency: `.codex/skills/exec-plan/SKILL.md`
Reason: 今回更新する project-local skill。
Contract: 実行フロー、spec-to-PR 契約、完了条件を新方針に合わせる。

Dependency: `commit` skill
Reason: commit 実行の正本。
Contract: ExecPlan skill は commit 実行時に `commit` skill を使うよう指示し、message 形式や staging の詳細を重複定義しない。

Dependency: `pr-writer` skill
Reason: PR 作成・更新の正本。
Contract: ExecPlan skill は PR 作成時に `pr-writer` skill を使うよう指示し、PR body 生成手順を重複定義しない。

## 具体手順

1. `.codex/skills/exec-plan/SKILL.md` に commit 粒度 section を追加する。

    Working directory:
        <repo-root>
    Command:
        apply_patch
    Expected outcome:
        commit skill を使う条件と、commit 粒度の基準が明文化される。

2. `.codex/skills/exec-plan/SKILL.md` の実行フロー / spec-to-PR 契約を更新する。

    Working directory:
        <repo-root>
    Command:
        apply_patch
    Expected outcome:
        PR 作成が `pr-writer` skill 委譲になり、issue なしでも自動作成できる。

3. 差分を確認する。

    Working directory:
        <repo-root>
    Command:
        git diff -- .codex/skills/exec-plan/SKILL.md docs/exec-plans/completed/202604252324_exec_plan_skill_pr_commit/exec-plan.md
    Expected outcome:
        変更は exec-plan skill と本 ExecPlan のみに限定される。

## 検証と受け入れ条件

Input: `git diff --check`
Observe: whitespace error はない。untracked ExecPlan も `git diff --no-index --check /dev/null docs/exec-plans/completed/202604252324_exec_plan_skill_pr_commit/exec-plan.md` で whitespace error を出していない。
Failure signal: whitespace error が出る。

Input: 対象差分の確認。
Observe: `exec-plan` skill に、`commit` skill による小さな論理 commit、`pr-writer` skill による PR 作成、`issueなし` での PR 作成継続が書かれている。
Failure signal: commit / PR 手順が別 skill と重複する、または issue なしが blocker のまま残る。

Input: `mise run verify`
Observe: lint は成功し、build は TypeScript compile 後の `/blog` page data collection で `MICROCMS_API_KEY is not set` により失敗した。差分起因の failure は観測されていない。
Failure signal: lint failure、または `MICROCMS_API_KEY` 以外の未説明 build failure が残る。

## 冪等性と復旧

1. 変更は skill 文書への additive / localized な追記に留める。
2. 同じ内容が重複した場合は `git diff` で重複 section を確認して整理する。
3. 外部 service、secret、app runtime は変更しない。
4. commit / PR 実行の詳細は専用 skill を正本にし、ここでは委譲契約だけを書く。
5. temporary file、dev server、生成物は作らない。

## 未完了事項

`mise run verify` の build は `MICROCMS_API_KEY` 未設定により完了していない。lint と TypeScript compile は通過した。今回の変更は skill 文書と ExecPlan のみ。

Change note: 2026-04-25 23:31+09:00 review fix loop cycle 1 の reviewer verdict を記録した。
