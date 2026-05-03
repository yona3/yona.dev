---
status: completed
created_at: 2026-05-03 12:18+09:00
updated_at: 2026-05-03 12:26+09:00
owner: Codex
review.scope_command: git diff -- PLANS.md docs/conventions.md docs/skills/exec-plan/SKILL.md docs/exec-plans/completed/202605031218_pr_phase6_approval_contract/exec-plan.md
review.untracked_paths: []
---

この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

ExecPlan の承認1から PR 作成・更新までを、この project では追加確認なしで自律実行できる契約にする。変更前は承認1後の自律範囲に PR 作成まで含める契約はあるが、`pr-writer` の CREATE / 大幅 UPDATE 実行前確認との関係が曖昧だった。変更後は、ユーザーが明示的に除外しない限り、承認1が `pr-writer` Phase 6 の PR 作成・更新実行承認も兼ねる。

## 進捗

- [x] 2026-05-03 12:18+09:00 `PLANS.md`、project-local `exec-plan` skill、`docs/conventions.md` の現行契約を確認した。
- [x] 2026-05-03 12:18+09:00 ユーザーの `go` を、前回提案した一文を入れる承認1として記録した。
- [x] 2026-05-03 12:18+09:00 承認1と `pr-writer` Phase 6 実行承認の関係を明文化した。
- [x] 2026-05-03 12:19+09:00 `git diff --check`、front matter parse、`mise run verify` を実行した。
- [x] 2026-05-03 12:22+09:00 project-local review gate を `contract-reviewer` / `ce-reviewer` で実行し、APPROVE を得た。
- [x] 2026-05-03 12:22+09:00 この ExecPlan を `docs/exec-plans/completed/202605031218_pr_phase6_approval_contract` へ移した。
- [x] 2026-05-03 12:23+09:00 completed move 後に `git diff --check`、front matter parse、`mise run verify` を再実行した。
- [x] 2026-05-03 12:26+09:00 commit、PR update まで完了した。

## 発見

観測: 現行 `PLANS.md` は、承認1後の自律実行 scope に review fix loop と stage / commit / PR / CI fix を含めている。
根拠:
    `PLANS.md` の `意図確認プロトコル` と `推奨 workflow`。

観測: project-local `exec-plan` skill も、承認1後に stage / commit、PR 作成、CI fix まで自律実行するとしている。
根拠:
    `docs/skills/exec-plan/SKILL.md` の `既定の実行範囲`、`stage / commit / PR 運用`、`実行フロー`。

観測: `pr-writer` の一般契約には CREATE / 大幅 UPDATE の実行前確認があるため、この repo の ExecPlan 承認1がそれを満たすかを明記すると解釈差が消える。
根拠:
    project-local `exec-plan` skill は `pr-writer` Phase 6 を入口にすると定める一方、承認1が Phase 6 の実行承認を兼ねるとはまだ書いていない。

観測: deterministic verification は最新差分で成功した。
根拠:
    `git diff --check` は出力なしで成功した。
    Ruby の YAML front matter parse はこの ExecPlan の `status`, `created_at`, `updated_at`, `owner`, `review.scope_command`, `review.untracked_paths` を確認して成功した。`ffi-1.12.2` の gem warning は出たが command は exit 0。
    `mise run verify` は lint と build を実行し、Next.js build は 8 pages を生成して成功した。mise cache 書き込み warning は出たが command は exit 0。completed move 後の再実行でも成功した。

観測: project-local review gate は `contract-reviewer` と `ce-reviewer` の 2 reviewer で成立し、最終 verdict は APPROVE。
根拠:
    `contract-reviewer` session `019debd9-6383-78a1-857d-114d806c595f`: verdict APPROVE、findings なし、blocker なし、confidence high。
    `ce-reviewer` session `019debd9-6890-7d93-90c0-02d68f4832e2`: verdict APPROVE、findings なし、blocker なし、confidence high。
    承認1の Phase 6 承認化は ExecPlan task と `pr-writer` Phase 6 に限定され、direct PR 操作や停止条件の bypass にはなっていないと確認された。

観測: `pr-writer` UPDATE mode で PR #25 を更新し、`gh pr view` で反映を確認した。
根拠:
    mode: UPDATE。
    base/head: `main` / `codex/harness-standard-rebuild`。
    既存 PR 判定: PR #25 `docs(harness): 標準仕様へ再構築` が OPEN。
    issue 判定: `gh issue list --state open --limit 20 --json number,title,url` は `[]`。issueなし。
    PR template 判定: `.github` が存在しないため templateなし / 標準フォーマット。
    UI preview 判定: docs / contract のみの変更で UI 可視変化なし。preview不要。
    Phase 5 title/body summary: 既存 title を維持し、Summary に ExecPlan 承認1が `pr-writer` Phase 6 の PR 作成・更新実行承認を兼ねる変更を追加した。
    Phase 6 command: `gh pr edit 25 --body-file /private/tmp/pr25-body.md`。
    Phase 7 verification: `gh pr view 25 --json number,title,url,state,baseRefName,headRefName,body` で PR URL、OPEN 状態、base/head、更新済み body を確認した。

## 判断

判断: `PLANS.md` と project-local `exec-plan` skill の両方に、承認1が `pr-writer` Phase 6 実行承認を兼ねることを書く。
理由: `PLANS.md` は ExecPlan schema / workflow の SSoT、`docs/skills/exec-plan/SKILL.md` は実行者向け workflow の SSoT なので、両方で同じ境界を読める必要がある。
日付/担当: 2026-05-03 / Codex

判断: `docs/conventions.md` には短い運用要約だけを足す。
理由: 詳細手順は `PLANS.md` と skill に置き、conventions は repo-wide の補助規約として drift を防ぐため。
日付/担当: 2026-05-03 / Codex

## 契約

依存: `PLANS.md`, `docs/conventions.md`, `docs/skills/exec-plan/SKILL.md`, `docs/exec-plans/completed/202605031218_pr_phase6_approval_contract/exec-plan.md`
依存理由: ExecPlan 承認、PR 作成 gate、project-local skill の運用境界を整合させるため。
契約: `pr-writer` skill は PR 作成・更新の入口として維持し、direct `gh pr create` / `gh pr edit` を Phase 6 以外で使わない。
契約: ExecPlan 承認1は、ユーザーが明示的に除外しない限り、`pr-writer` Phase 6 の PR 作成・更新実行承認も兼ねる。
契約: CREATE / 大幅 UPDATE の前に別途確認を求める一般 `pr-writer` 契約は、この repo の ExecPlan task では承認1で満たされたものとして扱う。

## 実行計画

1. `PLANS.md` の承認1 / PR 作成 gate を明確化する。

    作業場所:
        <repo-root>
    実行:
        承認1が `pr-writer` Phase 6 の PR 作成・更新実行承認も兼ねることを追記する。
    期待結果:
        ExecPlan 承認後に PR 作成まで追加確認なしで進める契約が schema SSoT に残る。

2. project-local `exec-plan` skill を同じ契約へ合わせる。

    作業場所:
        <repo-root>
    実行:
        `docs/skills/exec-plan/SKILL.md` の `PR 作成 gate` と `実行フロー` に同じ承認境界を追記する。
    期待結果:
        実行者が `pr-writer` Phase 6 直前で不要な再確認を挟まない。

3. `docs/conventions.md` に短い運用要約を足す。

    作業場所:
        <repo-root>
    実行:
        ExecPlan 承認1から PR 作成・更新までの自動範囲を 1 行で補足する。
    期待結果:
        repo-wide conventions と skill / PLANS の解釈が揃う。

4. verification と review gate を実行する。

    作業場所:
        <repo-root>
    実行:
        `git diff --check`
        YAML front matter parse
        `mise run verify`
        `contract-reviewer` と `ce-reviewer` による review fix loop
    期待結果:
        docs contract の矛盾がなく、deterministic verification と review gate が通る。

5. 完了処理、commit、PR update を行う。

    作業場所:
        <repo-root>
    実行:
        この ExecPlan を completed へ移す。
        `commit` skill で commit する。
        `pr-writer` UPDATE mode で PR #25 を更新する。
    期待結果:
        completed ExecPlan、commit、PR body、CI 状態が整合する。

## 受け入れ条件

入力: ExecPlan の承認から PR 作成まで自動で行う workflow にしたい。
確認: `PLANS.md` が、承認1を `pr-writer` Phase 6 の実行承認として扱うことを明記している。実測: 反映済み。
確認: `docs/skills/exec-plan/SKILL.md` が、承認1後に PR 作成・更新の実行前再確認を挟まないことを明記している。実測: 反映済み。
確認: `docs/conventions.md` が、同じ運用境界を短く参照している。実測: 反映済み。
確認: `git diff --check`、front matter parse、`mise run verify`、multi-agent review gate の結果が記録されている。実測: `git diff --check`、front matter parse、`mise run verify` は成功。`contract-reviewer` / `ce-reviewer` ともに APPROVE。
失敗条件: `pr-writer` の Phase 6 以外で direct PR 作成・更新を許可してしまう。
失敗条件: ExecPlan task 以外の PR 作成まで無条件に自動化するよう読める。

## 復旧

1. docs-only の変更に留め、問題があれば該当 hunk だけを revert できる。
2. `pr-writer` の一般契約と衝突する場合は、この repo 固有の ExecPlan task だけに限定する文言へ狭める。
3. PR 作成・更新の入口は引き続き `pr-writer` Phase 6 とし、direct PR 操作を許可しない。
4. `mise run verify` が環境要因で失敗した場合は、差分起因かどうかを分けて記録する。
5. 完了時はこの ExecPlan を completed へ移し、active に残さない。

## 未完了

None.

変更記録: 2026-05-03 12:18+09:00 承認1と PR Phase 6 実行承認の関係を明文化する ExecPlan を作成した。
変更記録: 2026-05-03 12:22+09:00 deterministic verification と multi-agent review gate の APPROVE を記録した。
変更記録: 2026-05-03 12:22+09:00 ExecPlan を completed へ移し、path-sensitive な review scope を更新した。
変更記録: 2026-05-03 12:23+09:00 completed move 後の deterministic verification 成功を記録した。
変更記録: 2026-05-03 12:26+09:00 `pr-writer` UPDATE mode の receipt と PR #25 反映確認を記録した。
