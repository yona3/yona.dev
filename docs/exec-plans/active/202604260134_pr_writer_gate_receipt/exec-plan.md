この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

PR 作成・更新時に `pr-writer` skill を入口にする契約を、単なる禁止文ではなく、ExecPlan と review gate で検出できる形に強化する。

変更前は、`AGENTS.md`、`PLANS.md`、`docs/skills/exec-plan/SKILL.md` に `pr-writer` を入口にする契約がある。しかし実作業では、`pr-writer` skill を読んだだけで Phase 1-7 の receipt を残さず、`gh pr create` / `gh pr edit` を直接実行してしまった。これは「禁止」はあるが、完了 evidence と review checklist が十分に機械的でなかったことが原因。

変更後は、ExecPlan task で PR 作成・更新を行った場合、relevant ExecPlan の `受け入れ条件` または `発見` に `pr-writer receipt` を残す。receipt は mode、base/head、既存 PR 判定、issue 判定、template 判定、UI preview 判定、Phase 5 title/body 生成、Phase 6 実行 command、Phase 7 `gh pr view` 検証を含む。project-local `review` skill は、PR 作成・更新前の review gate では receipt 記録手順の有無を確認し、PR 作成・更新済みの completion gate では receipt 実体の欠落を finding として扱う。

この task は、PR #22 の body を `pr-writer` UPDATE モードで再生成済みであることを前提に、再発防止の harness 契約を同じ PR に追加する。実装前にユーザー承認を得る。

## 進捗

- [x] 2026-04-26 01:34+09:00 ユーザー指摘により、PR #22 作成・更新で `pr-writer` workflow を通していなかった問題を確認した。
- [x] 2026-04-26 01:34+09:00 `pr-writer` UPDATE モードの Phase 1-7 に沿って PR #22 body を再生成・反映した。
- [x] 2026-04-26 01:34+09:00 Approval gate 1 のため、この ExecPlan draft を作成した。
- [x] 2026-04-26 01:34+09:00 ユーザーから `go` の承認を受けた。
- [x] 2026-04-26 01:34+09:00 `PLANS.md`、`docs/skills/exec-plan/SKILL.md`、`docs/skills/review/SKILL.md` に `pr-writer receipt` 契約を追加した。
- [x] 2026-04-26 01:34+09:00 静的検査と `mise run verify` を実行した。
- [x] 2026-04-26 01:34+09:00 multi-agent review fix loop の初回で receipt 検査タイミングと receipt 欠落に関する finding を確認した。
- [x] 2026-04-26 01:34+09:00 採用 finding を `docs/skills/review/SKILL.md`、`docs/skills/exec-plan/SKILL.md`、この ExecPlan に反映した。
- [x] 2026-04-26 01:34+09:00 同じ reviewer set で再 review し、PLANS と review skill の事前/完了 gate 表現に関する finding を確認した。
- [x] 2026-04-26 01:34+09:00 採用 finding を `PLANS.md`、`docs/skills/review/SKILL.md`、この ExecPlan に反映した。
- [x] 2026-04-26 01:34+09:00 同じ reviewer set で再々 review し、ExecPlan 内の古い引用と期待文に関する finding を確認した。
- [x] 2026-04-26 01:34+09:00 採用 finding をこの ExecPlan に反映した。
- [x] 2026-04-26 01:34+09:00 最終 review で `contract-reviewer` は APPROVE、`ce-reviewer` は ExecPlan 状態更新漏れの P3 finding 1 件を報告した。
- [x] 2026-04-26 01:34+09:00 採用 finding をこの ExecPlan の進捗と未完了に反映した。
- [ ] 2026-04-26 01:34+09:00 final static check、commit、PR #22 更新、checks 確認を進める。

## 発見

Observation: 既存契約は `pr-writer` 入口を禁止文として持っている。
Evidence:
    AGENTS.md:
        PR 作成・更新は `pr-writer` skill を入口にします。
        その他の PR 作成・更新 API を `pr-writer` の Phase 6 以外から直接実行しません。

Observation: `docs/skills/exec-plan/SKILL.md` には PR 作成 gate checklist があるが、実行後に ExecPlan へ `pr-writer` phase receipt を残す必須契約はない。
Evidence:
    docs/skills/exec-plan/SKILL.md:
        PR 作成・更新前 checklist:
        1. `pr-writer` の CREATE / UPDATE 判定が済んでいる。
        ...
        7. title / body を `pr-writer` の Phase 5 で生成済み。

Observation: `docs/skills/review/SKILL.md` の reviewer set は contract と CE 観点を持つが、PR 作成・更新時の `pr-writer receipt` を明示的な review 対象にしていない。
Evidence:
    docs/skills/review/SKILL.md:
        contract-reviewer: `AGENTS.md`, `PLANS.md`, local skills, `mise.toml`, ExecPlan, task scope の矛盾
        ce-reviewer: SSoT, context clash, lost-in-middle, artifact trail, 日本語文体

Observation: PR #22 body は指摘後に `pr-writer` UPDATE モードとして再生成済み。
Evidence:
    gh pr view 22 --json number,title,body,url,state
    # body contains:
    # ### 実装メモ
    # この PR body は、指摘を受けて `pr-writer` UPDATE モードの Phase 1-7 に沿って再生成しました。

Observation: `pr-writer receipt` 契約は、ExecPlan schema、ExecPlan skill、review skill の 3 箇所に最小追加した。
Evidence:
    PLANS.md:
        PR 作成・更新を行った場合は、`pr-writer` の mode、base/head、既存 PR 判定、issue 判定、template 判定、UI preview 判定、title/body 生成、実行 command、`gh pr view` 検証を `発見` または `受け入れ条件` に残します。
    docs/skills/exec-plan/SKILL.md:
        PR 作成・更新後は、relevant ExecPlan の `発見` または `受け入れ条件` に `pr-writer receipt` を残します。
    docs/skills/review/SKILL.md:
        PR 作成・更新前の review gate では receipt 記録手順を確認し、PR 作成・更新済みの completion gate では receipt 実体の欠落を finding として扱う。

Observation: 静的検査では whitespace error と trailing whitespace は見つからなかった。
Evidence:
    git diff --check
    # exit 0, no output
    rg -n "[ \t]+$" PLANS.md docs/skills docs/exec-plans/active/202604260134_pr_writer_gate_receipt
    # exit 1, no output

Observation: `mise run verify` は lint、compile、TypeScript まで進み、既知の `MICROCMS_API_KEY is not set` で停止した。
Evidence:
    mise run verify
    [lint] Finished in 11.24s
    [build] ✓ Compiled successfully in 8.1s
    [build] Finished TypeScript in 3.6s
    [cause]: Error: MICROCMS_API_KEY is not set

Observation: PR #22 body 更新は `pr-writer` UPDATE モードとして実行した。
Evidence:
    pr-writer receipt:
        mode: UPDATE
        base/head: main <- codex/local-self-review-loop
        existing PR: #22 OPEN
        issue: issueなし
        template: templateなし / 標準フォーマット
        UI preview: docs / skills / ExecPlan のみで UI 可視変化なし。preview不要
        Phase 5 title/body: title `docs(harness): self review gate を明文化`; body は標準フォーマット（概要、背景・動機、やったこと、確認方法、影響範囲とリスク、実装メモ、関連Issue）で再生成
        Phase 6 command: gh pr edit 22 --title ... --body ...
        Phase 7 verification: gh pr view 22 --json number,title,body,url,state

Observation: 初回 review fix loop で、receipt 検査タイミングとこの ExecPlan 自体の receipt 欠落が見つかった。
Evidence:
    contract-reviewer:
        P1 docs/skills/review/SKILL.md:99 PR 作成前の review fix loop でも `pr-writer receipt` 欠落を finding 扱いしてしまう。
        P2 docs/skills/review/SKILL.md:99 receipt 必須項目から「既存 PR 判定」が落ちている。
        P2 docs/exec-plans/active/202604260134_pr_writer_gate_receipt/exec-plan.md:16 PR #22 UPDATE 済みと書いているが `pr-writer receipt` の実フィールドがない。
    ce-reviewer:
        P2 docs/exec-plans/active/202604260134_pr_writer_gate_receipt/exec-plan.md:45 receipt が残っていない。
        P2 docs/skills/review/SKILL.md:99 PR 作成前 review でまだ生成できない receipt を要求している。
        P3 docs/skills/exec-plan/SKILL.md:119 bypass 復旧文が `PR 作成後` だけを対象にしている。

Observation: 再 review で、PLANS の receipt 項目と review skill の prompt / 完了条件に表現のずれが残っていた。
Evidence:
    contract-reviewer:
        P1 docs/skills/review/SKILL.md:152 PR 作成・更新前の ExecPlan gate でも `pr-writer receipt` 記録済みを完了条件にしている。
        P2 PLANS.md:60 canonical guidance の receipt 項目に「既存 PR 判定」がない。
    ce-reviewer:
        P2 PLANS.md:60 `pr-writer receipt` 必須項目から「既存 PR 判定」が抜けている。
        P3 docs/skills/review/SKILL.md:85 reviewer prompt 契約が PR 作成・更新前後を分けず常に `pr-writer receipt` を渡す表現のまま。
        P3 docs/exec-plans/active/202604260134_pr_writer_gate_receipt/exec-plan.md:9 ExecPlan 本文が pre gate と completion gate を一括表現している。

Observation: 最終 review では契約差分に未解決 finding はなく、この ExecPlan の状態更新漏れだけが残った。
Evidence:
    contract-reviewer: APPROVE findings なし
    ce-reviewer:
        P3 docs/exec-plans/active/202604260134_pr_writer_gate_receipt/exec-plan.md:289 未完了が古い状態のまま。

## 判断

Decision: `pr-writer` 利用の強制は、追加 hook ではなく ExecPlan evidence と review gate で行う。
Rationale: 現在の harness 方針は hidden pipeline や hook を追加しないこと、ExecPlan 対象 task の完了 evidence を task artifact に残すことを優先しているため。
Date/Author: 2026-04-26 / Codex

Decision: PR 作成・更新を含む ExecPlan task では `pr-writer receipt` を必須 evidence にする。
Rationale: 「pr-writer を使う」という禁止文だけでは、今回のように skill を読んだだけで直接 API を呼ぶ失敗を防げない。Phase ごとの receipt があれば、review gate が artifact trail の欠落として検出できる。
Date/Author: 2026-04-26 / Codex

Decision: review skill に `pr-writer receipt` の検査観点を追加する。
Rationale: 完了前の review で、PR 作成・更新を含む task が `pr-writer` を通したかを第三者視点で確認できるようにするため。
Date/Author: 2026-04-26 / Codex

## 契約

Dependency: `docs/skills/exec-plan/SKILL.md`
Reason: ExecPlan task の stage / commit / PR 作成 / CI fix workflow を定義する。
Contract: PR 作成・更新を行った場合は、`pr-writer receipt` を relevant ExecPlan に残す。

Dependency: `docs/skills/review/SKILL.md`
Reason: local diff / branch diff / staged diff / working tree diff の review gate。
Contract: PR 作成・更新を含む ExecPlan gate review では、`pr-writer receipt` の有無を contract / CE 観点に含める。

Dependency: `PLANS.md`
Reason: ExecPlan schema と acceptance evidence の共通契約。
Contract: task 固有手順は増やしすぎず、PR 作成・更新時に必要な evidence guidance だけを追加する。

Dependency: `docs/exec-plans/active/202604260134_pr_writer_gate_receipt/exec-plan.md`
Reason: この改善の task artifact。
Contract: PR #22 body を `pr-writer` UPDATE で再生成した事実と、この再発防止の判断・検証を残す。

## 実行計画

1. Approval gate 1 として、この ExecPlan をユーザーに提示し、実装開始の明示承認を得る。

    Working directory:
        <repo-root>
    Command:
        sed -n '1,260p' docs/exec-plans/active/202604260134_pr_writer_gate_receipt/exec-plan.md
    Expected outcome:
        ユーザーが `pr-writer receipt` 契約の追加方針を確認し、実装可否を判断できる。

2. `docs/skills/exec-plan/SKILL.md` の PR 作成 gate に `pr-writer receipt` を追加する。

    Working directory:
        <repo-root>
    Command:
        rg -n "PR 作成 gate|PR 作成・更新前 checklist|PR 作成後" docs/skills/exec-plan/SKILL.md
    Expected outcome:
        PR 作成・更新後に mode、base/head、既存 PR 判定、issue 判定、template 判定、UI preview 判定、Phase 5 title/body、Phase 6 command、Phase 7 `gh pr view` を ExecPlan に残す契約がある。

3. `docs/skills/review/SKILL.md` に `pr-writer receipt` 検査観点を追加する。

    Working directory:
        <repo-root>
    Command:
        rg -n "reviewer set|reviewer prompt 契約|集約と検証|完了条件" docs/skills/review/SKILL.md
    Expected outcome:
        PR 作成・更新前の ExecPlan gate では receipt 記録手順、PR 作成・更新済みの completion gate では receipt 実体の欠落が finding になる。

4. 必要なら `PLANS.md` に PR 作成・更新 evidence guidance を最小追加する。

    Working directory:
        <repo-root>
    Command:
        rg -n "受け入れ条件|PR 作成|review" PLANS.md
    Expected outcome:
        PR 作成・更新時の evidence guidance が ExecPlan schema と矛盾しない。

5. 静的検査と `mise run verify` を実行する。

    Working directory:
        <repo-root>
    Command:
        git diff --check
        rg -n "[ \t]+$" PLANS.md docs/skills docs/exec-plans/active/202604260134_pr_writer_gate_receipt
        mise run verify
    Expected outcome:
        whitespace error がなく、`mise run verify` が成功するか既知の `MICROCMS_API_KEY is not set` を記録できる。

6. project-local `review` skill の multi-agent review fix loop を実行する。

    Working directory:
        <repo-root>
    Command:
        review fix loop
    Expected outcome:
        `contract-reviewer` と `ce-reviewer` が、`pr-writer receipt` 契約の整合性を含めて APPROVE する。

7. 承認済みファイルを stage し、`commit` skill で commit する。

    Working directory:
        <repo-root>
    Command:
        git add docs/skills/exec-plan/SKILL.md docs/skills/review/SKILL.md PLANS.md docs/exec-plans/active/202604260134_pr_writer_gate_receipt/exec-plan.md
        commit skill
    Expected outcome:
        `pr-writer receipt` の再発防止契約が論理的な commit になる。

8. `pr-writer` UPDATE モードで PR #22 を更新し、CI / checks を確認する。

    Working directory:
        <repo-root>
    Command:
        pr-writer skill UPDATE
        gh pr checks 22 --watch=false
    Expected outcome:
        PR #22 body にこの追加改善が反映され、checks が green になるか具体的 blocker が記録される。ExecPlan に `pr-writer receipt` を残す。

## 受け入れ条件

Input: contract inspection
Observe:
    `docs/skills/exec-plan/SKILL.md` に `pr-writer receipt` の必須記録項目がある。
Failure signal:
    `pr-writer` を入口にする禁止文だけで、Phase 実行 evidence が不要なまま残る。

Input: review gate inspection
Observe:
    `docs/skills/review/SKILL.md` が、PR 作成・更新前の ExecPlan gate では receipt 記録手順、PR 作成・更新済みの completion gate では `pr-writer receipt` 実体の欠落を finding にできる。
Failure signal:
    review が PR 作成・更新の direct API 実行を artifact trail から検出できない。

Input: PR #22 body
Observe:
    2026-04-26 01:34+09:00 actual:
    mode: UPDATE
    base/head: main <- codex/local-self-review-loop
    existing PR: #22 OPEN
    issue: issueなし
    template: templateなし / 標準フォーマット
    UI preview: docs / skills / ExecPlan のみで UI 可視変化なし。preview不要
    Phase 5 title/body: title `docs(harness): self review gate を明文化`; body は標準フォーマットで再生成
    Phase 6 command: `gh pr edit 22 --title ... --body ...`
    Phase 7 verification: `gh pr view 22 --json number,title,body,url,state`
Failure signal:
    direct `gh pr edit` のみで更新され、Phase 1-7 の判断が記録されていない。

Input: `git diff --check`
Observe:
    2026-04-26 01:34+09:00 actual:
    exit 0, no output.
Failure signal:
    whitespace error が表示される。

Input: `mise run verify`
Observe:
    2026-04-26 01:34+09:00 actual:
    lint は成功した。build は compile と TypeScript まで成功し、`MICROCMS_API_KEY is not set` で `/blog` の page data collection が停止した。
Failure signal:
    変更起因の lint、build、TypeScript error が出る。

Input: review fix loop
Observe:
    2 つ以上の独立 reviewer が実行され、採用 finding が 0 件になる。
Failure signal:
    単一 reviewer、self review、または degraded local check を APPROVE 代替として扱う。

Input: PR / CI status
Observe:
    PR #22 が更新され、checks が green になるか具体的 blocker が報告される。
Failure signal:
    PR body が古いまま、または red CI の原因を記録せず完了扱いにする。

## 復旧

1. 文書と skill 契約の変更なので、再実行しても外部 state を壊さない。
2. `pr-writer receipt` が過剰に重い場合は、receipt 項目を減らすのではなく、必須項目と任意項目を分ける。
3. hook、hidden pipeline、別 artifact は追加しない。
4. review 指摘が出た場合は、採用 finding だけを修正し、同じ reviewer set で再 review する。
5. 完了後は PR #22 body と checks を再確認する。

## 未完了

契約差分の review は完了。`mise run verify` は既知の `MICROCMS_API_KEY is not set` で停止したため、環境変数がある環境で full build の page data collection 以降を再確認する余地が残る。次に final static check、commit、PR #22 更新、checks 確認まで進める。

Change note: 2026-04-26 01:34+09:00 `pr-writer` workflow bypass の再発防止として、receipt 契約を追加する ExecPlan draft を作成した。

Change note: 2026-04-26 01:34+09:00 Approval gate 1 の承認を受け、`pr-writer receipt` 契約を ExecPlan schema / exec-plan skill / review skill に追加した。

Change note: 2026-04-26 01:34+09:00 静的検査と `mise run verify` の結果を acceptance evidence と未完了事項に反映した。

Change note: 2026-04-26 01:34+09:00 初回 review fix loop の採用 finding を反映し、receipt 検査タイミングと PR #22 UPDATE receipt を明確化した。

Change note: 2026-04-26 01:34+09:00 再 review の採用 finding を反映し、PLANS の既存 PR 判定と review skill の事前/完了 gate 表現を揃えた。

Change note: 2026-04-26 01:34+09:00 再々 review の採用 finding を反映し、ExecPlan 内の古い引用と期待文を現行契約へ揃えた。

Change note: 2026-04-26 01:34+09:00 最終 review の採用 finding を反映し、ExecPlan の進捗と未完了を現在状態へ更新した。
