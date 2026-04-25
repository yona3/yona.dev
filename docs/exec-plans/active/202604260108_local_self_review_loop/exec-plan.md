この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

local での self review loop を、単なる「最終回答前に見直す」という任意手順ではなく、ExecPlan 対象タスクの完了条件として扱えるようにする。

変更前は、`mise run verify` が唯一の hard guard であり、`docs/skills/review/SKILL.md` には multi-agent review fix loop の成立条件がある。しかし、どの task で review verdict が完了条件になるか、Codex Desktop と Claude Code の両方でどの artifact に review evidence を残すか、hook を入れない推奨構成をどう表現するかが明文化されていない。

変更後は、ExecPlan 対象タスクでは `mise run verify` による deterministic verification と `docs/skills/review/SKILL.md` による review-gated completion を分離して扱う。`mise run verify` は引き続き唯一の hard guard とし、hidden pipeline、別 artifact、commit hook は追加しない。Codex Desktop と Claude Code の両方で、成立済み review の reviewer ids、verdict、未解決 findings、未検証範囲、実行した verification command を relevant ExecPlan の `受け入れ条件` または `発見` に残す。

この task は、ユーザー承認後に文書・skill 契約を更新し、検証、multi-agent review fix loop、stage / commit、PR 作成、CI fix まで進める。

## 進捗

- [x] 2026-04-26 01:08+09:00 ユーザーの 5 軸回答を受け、scope を commit / PR / CI まで、強制ポイントを ExecPlan/review gate、対象 runtime を Codex Desktop と Claude Code 両方に決めた。
- [x] 2026-04-26 01:08+09:00 作業ブランチ `codex/local-self-review-loop` を作成した。
- [x] 2026-04-26 01:08+09:00 Approval gate 1 のため、この ExecPlan draft を作成した。
- [x] 2026-04-26 01:08+09:00 ユーザーから `go` の承認を受けた。
- [x] 2026-04-26 01:08+09:00 `AGENTS.md`、`PLANS.md`、`docs/conventions.md`、`docs/skills/exec-plan/SKILL.md`、`docs/skills/review/SKILL.md` に review-gated completion の契約を追加した。
- [x] 2026-04-26 01:17+09:00 静的検査、`mise run install`、`mise run verify` を実行した。
- [x] 2026-04-26 01:17+09:00 multi-agent review fix loop の初回で `contract-reviewer` は APPROVE、`ce-reviewer` は P2/P3 finding 2 件を報告した。
- [x] 2026-04-26 01:17+09:00 採用 finding 2 件を `docs/conventions.md` と `PLANS.md` に反映した。
- [x] 2026-04-26 01:24+09:00 同じ reviewer set で再 review し、`contract-reviewer` は APPROVE、`ce-reviewer` は P3 finding 1 件を報告した。
- [x] 2026-04-26 01:24+09:00 採用 finding 1 件を `docs/skills/review/SKILL.md` に反映した。
- [x] 2026-04-26 01:24+09:00 同じ reviewer set で再々 review し、`contract-reviewer` / `ce-reviewer` とも APPROVE だった。
- [x] 2026-04-26 01:24+09:00 最終静的検査と `mise run verify` を再実行した。
- [ ] 2026-04-26 01:24+09:00 stage / commit / PR 作成 / CI fix を進める。

## 発見

Observation: `AGENTS.md` は `mise run verify` を唯一の hard guard とし、別の `verify.sh` や独自 pipeline を増やさない契約を持つ。
Evidence:
    AGENTS.md:
        `mise run verify` が唯一の hard guard です。別の `verify.sh` や独自 pipeline を増やしません。

Observation: `docs/conventions.md` は hidden runtime、pipeline directory、別形式 task artifact を増やさない方針を持つ。
Evidence:
    docs/conventions.md:
        hidden runtime、pipeline directory、別形式の task artifact は増やしません。

Observation: `docs/skills/review/SKILL.md` は、2 つ以上の独立 reviewer が実行された時だけ成立済み review とする。
Evidence:
    docs/skills/review/SKILL.md:
        2 つ以上の独立 reviewer を別コンテキストで起動できた時だけ成立済み review とする。

Observation: `docs/skills/review/SKILL.md` は、Codex Desktop など subagent 起動に user 明示許可が必要な runtime では、許可がなければ review を BLOCKED として止める契約を持つ。
Evidence:
    docs/skills/review/SKILL.md:
        Codex Desktop など subagent 起動に user 明示許可が必要な runtime では、許可がなければ `BLOCKED: subagent 明示許可なし` で止める。

Observation: `docs/skills/review/SKILL.md` は、Claude Code 経由では reviewer 実行を `codex exec` 経由に固定している。
Evidence:
    docs/skills/review/SKILL.md:
        Claude Code 経由でこの skill を実行している場合は、後述の `Claude Code 経由の実行` を優先し、reviewer 実行を `codex exec` 経由に固定する。

Observation: 静的検査では whitespace error と trailing whitespace は見つからなかった。
Evidence:
    git diff --check
    # exit 0, no output
    rg -n "[ \t]+$" AGENTS.md PLANS.md docs/conventions.md docs/skills docs/exec-plans/active/202604260108_local_self_review_loop
    # exit 1, no output

Observation: `mise run verify` は lint、compile、TypeScript まで進み、既知の `MICROCMS_API_KEY is not set` で停止した。
Evidence:
    mise run verify
    [lint] Finished in 14.41s
    [build] ✓ Compiled successfully in 15.6s
    [build] Finished TypeScript in 9.1s
    [cause]: Error: MICROCMS_API_KEY is not set

Observation: 初回 review fix loop で、`hidden pipeline` 禁止境界の表現と PLANS の review summary 項目不足が見つかった。
Evidence:
    contract-reviewer: APPROVE findings なし
    ce-reviewer:
        P2 docs/conventions.md:74 hidden pipeline を別 ExecPlan で再検討可能にしている。
        P3 PLANS.md:59 review gate summary に実行した verification command が含まれていない。

Observation: 再 review で、`docs/skills/review/SKILL.md` 内の ExecPlan gate 記録項目が他の契約とずれていた。
Evidence:
    contract-reviewer: APPROVE findings なし
    ce-reviewer:
        P3 docs/skills/review/SKILL.md:33 reviewer id が単数で、実行した verification command が抜けている。

Observation: 再々 review では未解決 finding がなかった。
Evidence:
    reviewer ids:
        contract-reviewer
        ce-reviewer
    verdict:
        APPROVE
    unresolved findings:
        findings なし
    unverified scope:
        `MICROCMS_API_KEY` 不足により `mise run verify` の `/blog` page data collection 以降は未検証。
    verification command:
        git diff --check
        rg -n "[ \t]+$" AGENTS.md PLANS.md docs/conventions.md docs/skills docs/exec-plans/active/202604260108_local_self_review_loop
        mise run verify

Observation: 最終 `mise run verify` も lint、compile、TypeScript まで進み、既知の `MICROCMS_API_KEY is not set` で停止した。
Evidence:
    mise run verify
    [lint] Finished in 24.92s
    [build] ✓ Compiled successfully in 17.3s
    [build] Finished TypeScript in 8.4s
    [cause]: Error: MICROCMS_API_KEY is not set

## 判断

Decision: local self review loop の推奨構成は、hook ではなく ExecPlan/review-gated completion として実装する。
Rationale: ユーザーが強制ポイントとして「推奨: ExecPlan 対象タスクでは `review verdict` がないと完了不可、commit hook はまず入れない」を選んだため。既存方針も hidden pipeline と別 artifact を増やさないため、hook より ExecPlan evidence に寄せる方が整合する。
Date/Author: 2026-04-26 / Codex

Decision: `mise run verify` は review loop に吸収せず、deterministic hard guard として維持する。
Rationale: `mise run verify` は唯一の hard guard という既存契約があり、LLM review は runtime や reviewer availability に依存する。両者を混ぜると hard guard の再現性と責務が曖昧になる。
Date/Author: 2026-04-26 / Codex

Decision: 成立済み review の evidence は新しい固定 artifact ではなく relevant ExecPlan に残す。
Rationale: `docs/skills/review/SKILL.md` がすでに専用 artifact を増やさず ExecPlan に summary を残す契約を持ち、`docs/conventions.md` も task artifact を `docs/exec-plans/{active,completed}/` に限定しているため。
Date/Author: 2026-04-26 / Codex

Decision: Codex Desktop と Claude Code の runtime 差分は `docs/skills/review/SKILL.md` と `docs/skills/exec-plan/SKILL.md` 本体に条件分岐として書く。
Rationale: project-local skill の正本は `docs/skills/` であり、`.codex/skills/*` と `.claude/skills/*` は symlink にする契約がある。runtime 別 copy を増やすと drift する。
Date/Author: 2026-04-26 / Codex

## 契約

Dependency: `AGENTS.md`
Reason: repo の Hot 層契約、ExecPlan 起動条件、`mise run verify` hard guard、stage / commit / PR 既定範囲を定義する。
Contract: `mise run verify` を唯一の hard guard とする契約を維持し、hook や別 pipeline を追加しない。ExecPlan 対象 task の完了条件として review-gated completion を短く参照する。

Dependency: `docs/conventions.md`
Reason: repo 固有の詳細規約、CE 方針、review calibration を置く Warm 層。
Contract: deterministic verification と review-gated completion の責務分離、hook を入れない推奨構成、Codex / Claude Code 両対応の artifact 方針を記録する。

Dependency: `PLANS.md`
Reason: ExecPlan schema と完了条件の共通契約。
Contract: ExecPlan 対象タスクでは、停止条件に該当しない限り review verdict evidence を `受け入れ条件` または `発見` に残すことを schema guidance として追加する。

Dependency: `docs/skills/exec-plan/SKILL.md`
Reason: ExecPlan 作成から実装、検証、review fix loop、stage / commit、PR 作成、CI fix までの project-local workflow。
Contract: Approval gate 1 後の実行範囲に、deterministic verification と review-gated completion の順序、review evidence の記録、runtime 制約時の停止条件を含める。

Dependency: `docs/skills/review/SKILL.md`
Reason: local diff / branch diff / staged diff / working tree diff の multi-agent review gate。
Contract: 成立済み review の定義、Codex Desktop と Claude Code の実行差分、ExecPlan への evidence 記録を明確にする。単一 reviewer や self review を APPROVE 代替にしない。

Dependency: `.codex/skills/{exec-plan,review}` and `.claude/skills/{exec-plan,review}`
Reason: Codex Desktop と Claude Code が project-local skill を発見する入口。
Contract: どちらも `docs/skills/{exec-plan,review}` への symlink のままにし、runtime 別 copy を作らない。

## 実行計画

1. Approval gate 1 として、この ExecPlan をユーザーに提示し、実装開始の明示承認を得る。

    Working directory:
        <repo-root>
    Command:
        sed -n '1,260p' docs/exec-plans/active/202604260108_local_self_review_loop/exec-plan.md
    Expected outcome:
        ユーザーが scope、強制ポイント、対象 runtime、実行範囲を確認し、実装可否を判断できる。

2. `AGENTS.md` に review-gated completion の短い参照を追加する。

    Working directory:
        <repo-root>
    Command:
        rg -n "hard guard|review|ExecPlan|検証と報告" AGENTS.md
    Expected outcome:
        `mise run verify` が唯一の hard guard である契約を維持したまま、ExecPlan 対象 task では project-local `review` skill の成立済み review verdict を完了条件に含めることが分かる。

3. `docs/conventions.md` に local self review loop の設計方針を追加する。

    Working directory:
        <repo-root>
    Command:
        rg -n "Review calibration|Verification|CE 方針|Project-local skills" docs/conventions.md
    Expected outcome:
        deterministic verification、review-gated completion、hook 非採用、Codex / Claude Code 両対応、artifact 記録先の責務が Warm 層に整理される。

4. `PLANS.md` に review verdict evidence の記録 guidance を追加する。

    Working directory:
        <repo-root>
    Command:
        rg -n "受け入れ条件|review|Autonomous phase|Approval gate 2" PLANS.md
    Expected outcome:
        ExecPlan 対象 task の acceptance が compile 成功だけでなく、review verdict と未解決 finding / 未検証範囲を含められる。

5. `docs/skills/exec-plan/SKILL.md` を更新し、Approval gate 1 後の実行フローに review-gated completion を明確化する。

    Working directory:
        <repo-root>
    Command:
        rg -n "review fix loop|完了条件|停止条件|Claude|Codex|受け入れ条件" docs/skills/exec-plan/SKILL.md
    Expected outcome:
        ExecPlan skill が `mise run verify` と `review` skill を順に実行し、成立済み review evidence を ExecPlan に残し、runtime 制約時は BLOCKED として止まる。

6. `docs/skills/review/SKILL.md` を更新し、review-gated completion の出力と evidence 記録を明確化する。

    Working directory:
        <repo-root>
    Command:
        rg -n "成立済み review|ExecPlan gate|Codex Desktop|Claude Code|出力形式|完了条件" docs/skills/review/SKILL.md
    Expected outcome:
        Codex Desktop と Claude Code の両方で、成立済み review の reviewer ids、verdict、unresolved findings、unverified scope、verification command を ExecPlan に残す契約が明確になる。

7. 静的検査と repo hard guard を実行する。

    Working directory:
        <repo-root>
    Command:
        git diff --check
        rg -n "[ \t]+$" AGENTS.md PLANS.md docs/conventions.md docs/skills docs/exec-plans/active/202604260108_local_self_review_loop
        mise run verify
    Expected outcome:
        whitespace error がなく、`mise run verify` が成功するか、既知の環境要因と未検証範囲を ExecPlan に記録できる。

8. project-local `review` skill の multi-agent review fix loop を実行する。

    Working directory:
        <repo-root>
    Command:
        review fix loop
    Expected outcome:
        `contract-reviewer` と `ce-reviewer` を含む 2 つ以上の独立 reviewer が実行され、採用 finding が 0 件になる。runtime 制約で成立しない場合は `BLOCKED` と未完了範囲を記録する。

9. 承認済みファイルを stage し、`commit` skill で commit する。

    Working directory:
        <repo-root>
    Command:
        git add AGENTS.md PLANS.md docs/conventions.md docs/skills/exec-plan/SKILL.md docs/skills/review/SKILL.md docs/exec-plans/active/202604260108_local_self_review_loop/exec-plan.md
        commit skill
    Expected outcome:
        review-gated completion の設計変更が論理的な commit になる。

10. `pr-writer` skill を通して PR を作成し、CI fix まで進める。

    Working directory:
        <repo-root>
    Command:
        pr-writer skill
        CI check and fix loop
    Expected outcome:
        PR が作成され、CI が green になるか、secret / 外部 service / 権限不足などの具体的 blocker が報告される。

## 受け入れ条件

Input: contract inspection
Observe:
    `AGENTS.md`、`docs/conventions.md`、`PLANS.md`、`docs/skills/exec-plan/SKILL.md`、`docs/skills/review/SKILL.md` が、`mise run verify` と review-gated completion の責務分離を矛盾なく説明している。
Failure signal:
    `mise run verify` を唯一の hard guard とする契約が弱まる、または hook / hidden pipeline / 別 artifact が追加される。

Input: runtime coverage inspection
Observe:
    Codex Desktop と Claude Code の両方で、project-local skill 正本が `docs/skills/` にあり、runtime 差分は skill 本体の条件分岐として書かれている。
Failure signal:
    `.codex/skills/*` と `.claude/skills/*` に runtime 別 copy が作られる、または Claude Code 経由の review が self review に縮退する。

Input: review evidence inspection
Observe:
    ExecPlan 対象 task では、成立済み review の reviewer ids、verdict、未解決 findings、未検証範囲、実行した verification command を relevant ExecPlan に残す契約がある。
Failure signal:
    review が会話内だけで完結し、再開時に evidence を追えない。

Input: `git diff --check`
Observe:
    2026-04-26 01:17+09:00 actual:
    exit 0, no output.
Failure signal:
    whitespace error が表示される。

Input: `rg -n "[ \t]+$" AGENTS.md PLANS.md docs/conventions.md docs/skills docs/exec-plans/active/202604260108_local_self_review_loop`
Observe:
    2026-04-26 01:17+09:00 actual:
    exit 1, no output.
Failure signal:
    trailing whitespace が表示される。

Input: `mise run verify`
Observe:
    2026-04-26 01:24+09:00 actual:
    lint は成功した。build は compile と TypeScript まで成功し、`MICROCMS_API_KEY is not set` で `/blog` の page data collection が停止した。
Failure signal:
    変更起因の lint、build、TypeScript error が出る。

Input: project-local review fix loop
Observe:
    2026-04-26 01:24+09:00 actual:
    reviewer ids: `contract-reviewer`, `ce-reviewer`
    verdict: APPROVE
    unresolved findings: findings なし
    unverified scope: `MICROCMS_API_KEY` 不足により `mise run verify` の `/blog` page data collection 以降は未検証。
    verification command: `git diff --check`, `rg -n "[ \t]+$" ...`, `mise run verify`
Failure signal:
    単一 reviewer、self review、または degraded local check を APPROVE 代替として扱う。

Input: PR / CI status
Observe:
    `pr-writer` skill を通して PR が作成され、CI が green になるか具体的 blocker が報告される。
Failure signal:
    `pr-writer` を通さず PR を作成する、または red CI の原因を記録せず完了扱いにする。

## 復旧

1. 文書と skill 契約の変更なので、再実行しても外部 state を壊さない。
2. wording や契約が矛盾した場合は、`AGENTS.md` の Hot 層を短く保ち、詳細を `docs/conventions.md` と `docs/skills/*` に移す。
3. hook、hidden runtime、別 artifact は追加しないため、rollback は変更ファイル単位で可能。
4. review 指摘が出た場合は、採用 finding だけを修正し、同じ reviewer set で再 review する。
5. 完了後は dev server や一時ファイルを残さず、生成物を追跡しない。

## 未完了

`mise run verify` は既知の `MICROCMS_API_KEY is not set` で停止したため、環境変数がある環境で full build の page data collection 以降を再確認する必要がある。次に multi-agent review fix loop、stage / commit、PR 作成、CI fix を実行する。

Change note: 2026-04-26 01:08+09:00 local self review loop を ExecPlan/review-gated completion として設計するための draft を作成した。

Change note: 2026-04-26 01:08+09:00 Approval gate 1 の承認を受け、review-gated completion の契約を Hot / Warm / skill / ExecPlan schema に反映した。

Change note: 2026-04-26 01:17+09:00 静的検査と `mise run verify` の結果を acceptance evidence と未完了事項に反映した。

Change note: 2026-04-26 01:17+09:00 初回 review fix loop の採用 finding を反映し、再 review 待ちに更新した。

Change note: 2026-04-26 01:17+09:00 review summary の verification command 要件を exec-plan skill と task acceptance にも揃えた。

Change note: 2026-04-26 01:24+09:00 再 review の採用 finding を反映し、review skill の ExecPlan gate summary 項目を揃えた。

Change note: 2026-04-26 01:24+09:00 再々 review の APPROVE verdict と review summary を acceptance evidence に記録した。

Change note: 2026-04-26 01:24+09:00 最終静的検査と `mise run verify` の結果を反映し、commit / PR 作成前の状態に更新した。
