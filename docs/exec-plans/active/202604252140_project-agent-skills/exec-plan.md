この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

この変更の目的は、yona.dev 固有の実行手順を `AGENTS.md` や通常 docs の恒久規約から分離し、変更頻度の高い agent 操作を project-local skill として管理できるようにすることです。

変更後は、ExecPlan 作成から spec-to-PR、CI 修正までを進める `docs/skills/exec-plan/SKILL.md` と、user scope の review 契約を参考にした `docs/skills/review/SKILL.md` が repo 内の正本になります。Codex は `.codex/skills/{exec-plan,review}`、Claude Code は `.claude/skills/{exec-plan,review}` の symlink 経由で同じ実体を読みます。Claude Code 経由で review skill を実行する場合は、reviewer 実行を `codex exec` に委譲します。

## 進捗

- [x] 2026-04-25 21:40+09:00 既存の `PLANS.md`、`AGENTS.md`、user scope の `exec-plan` / `review` / `dotfiles-reviewer` skill を確認した。
- [x] 2026-04-25 21:40+09:00 project-local skill の配置先を `.codex/skills/{exec-plan,review}/SKILL.md` に決めた。
- [x] 2026-04-25 21:40+09:00 `exec-plan` skill を追加する。
- [x] 2026-04-25 21:40+09:00 `review` skill を追加する。
- [x] 2026-04-25 21:45+09:00 targeted review の指摘を受け、PR URL review の委譲先、ExecPlan への review summary 記録、untracked file 検査を skill に反映した。
- [x] 2026-04-25 21:47+09:00 targeted review の再指摘を受け、local review skill 本体の PR URL 除外と untracked file 検査手順を追加した。
- [x] 2026-04-25 21:50+09:00 `git diff --check`、untracked file whitespace check、targeted review を再実行した。
- [x] 2026-04-25 21:52+09:00 `mise run lint` は成功し、`mise run verify` は既知の `MICROCMS_API_KEY is not set` で停止することを確認した。
- [x] 2026-04-25 21:54+09:00 `exec-plan` / `review` skill の frontmatter、routing dry-run、必須契約、行数、untracked file 検査を実施した。
- [x] 2026-04-25 22:20+09:00 PR #18 の Vercel 失敗ログを確認し、アプリ build 自体ではなく `/blog` の page data collection が `MICROCMS_API_KEY` 不足で停止していることを確認した。
- [x] 2026-04-25 22:23+09:00 docs / skills のみの PR で Vercel Preview build を走らせないため、`web/vercel.json` に `ignoreCommand` を追加した。
- [x] 2026-04-25 22:25+09:00 `git diff --check`、`web/vercel.json` の JSON 構文、Vercel ignore command dry-run、`mise run lint` を確認した。
- [x] 2026-04-25 23:58+09:00 skill 正本を `docs/skills/{exec-plan,review}` へ移し、`.codex/skills` と `.claude/skills` に symlink を作成した。
- [x] 2026-04-25 23:58+09:00 `review` skill に Claude Code 経由では reviewer 実行を `codex exec` に固定する契約を追加した。
- [x] 2026-04-26 00:02+09:00 symlink target、frontmatter、trailing whitespace、`git diff --check` を確認した。
- [x] 2026-04-26 00:02+09:00 `mise run install` 後に `mise run verify` を実行し、lint 成功と既知の `MICROCMS_API_KEY is not set` build 停止を確認した。
- [x] 2026-04-26 00:03+09:00 `docs/conventions.md` に project-local skill の SSoT と symlink 契約を追記した。
- [x] 2026-04-26 00:03+09:00 `docs/conventions.md` 追記後に `git diff --check`、trailing whitespace、frontmatter、symlink target を再確認した。
- [x] 2026-04-26 00:13+09:00 review fix loop として `contract-reviewer` / `ce-reviewer` を独立実行し、どちらも findings なしで APPROVE だった。

## 発見

Observation: この repo には project-local skill 置き場がまだ存在しない。
Evidence:
    find . -maxdepth 4 -type d -name 'skills' -o -name '.codex' -o -name '.config' -o -name '.claude'
    # no output

Observation: user scope の review skill は、2 つ以上の独立 reviewer を成立条件にし、self review へ縮退しない。
Evidence:
    <user-scope-harness>/skills/review/SKILL.md
    - reviewer set 選定（必ず 2 つ以上）
    - 単一 reviewer / self review へ縮退しない

Observation: `.codex/skills` の作成は通常権限では拒否されたため、許可付きコマンドで作成した。
Evidence:
    mkdir: .codex: Operation not permitted
    mkdir -p .codex/skills/exec-plan .codex/skills/review
    # exit 0

Observation: 初回 targeted review で、PR URL review の委譲先、ExecPlan gate の artifact trail、untracked file の whitespace 検査に不足が見つかった。
Evidence:
    contract-reviewer: 未完了が未実行 check / review を列挙していない。
    ce-reviewer: PR URL は `pr-review`、ExecPlan gate review は ExecPlan に summary を残す、untracked files は `git diff --check` 以外でも検査する。

Observation: 再レビューで、local review skill 本体の PR URL 除外と、この ExecPlan 自体の untracked file 検査手順が不足していた。
Evidence:
    contract-reviewer: untracked 追加ファイルは `git diff --check` だけでは検査されない。
    ce-reviewer: `.codex/skills/review/SKILL.md` の scope 決定に PR URL 除外を追加する必要がある。

Observation: 最終 targeted review では CE 観点が findings なし、contract 観点は ExecPlan の状態更新不足のみを指摘した。
Evidence:
    ce-reviewer: findings なし
    contract-reviewer: 実行済み check / review の progress と evidence を ExecPlan に記録すれば解消する。

Observation: 各 project-local skill の静的テストと routing dry-run は成功した。
Evidence:
    ruby frontmatter check:
        ok .codex/skills/exec-plan/SKILL.md exec-plan
        ok .codex/skills/review/SKILL.md review
    rg contract checks:
        exec-plan: ヒアリング / multi-agent review fix loop / spec-to-PR / CI fix / PR URL 除外を検出
        review: PR URL 除外 / 2 reviewer 以上 / self review 禁止 / untracked file 検査 / ExecPlan gate summary を検出
    wc -l:
        85 .codex/skills/exec-plan/SKILL.md
        126 .codex/skills/review/SKILL.md

Observation: PR #18 の失敗 check は GitHub Actions ではなく Vercel の外部 check だった。
Evidence:
    gh pr checks 18 --watch=false
    # Vercel fail

Observation: Vercel build は compile 完了後、`/blog` の page data collection で `MICROCMS_API_KEY` 不足により停止した。
Evidence:
    npx --yes vercel inspect <deployment-id> --logs
    # Error: Failed to collect configuration for /blog
    # [cause]: Error: MICROCMS_API_KEY is not set

Observation: Codex / Claude Code の project-local skill は同じ正本を読む symlink 構成にできる。
Evidence:
    ls -l .codex/skills .claude/skills docs/skills
    .codex/skills/exec-plan -> ../../docs/skills/exec-plan
    .codex/skills/review -> ../../docs/skills/review
    .claude/skills/exec-plan -> ../../docs/skills/exec-plan
    .claude/skills/review -> ../../docs/skills/review

Observation: 配置変更後も Codex / Claude Code の symlink 経由で同じ skill frontmatter を読める。
Evidence:
    ruby frontmatter check:
        ok docs/skills/exec-plan/SKILL.md exec-plan
        ok docs/skills/review/SKILL.md review
        ok .codex/skills/exec-plan/SKILL.md exec-plan
        ok .codex/skills/review/SKILL.md review
        ok .claude/skills/exec-plan/SKILL.md exec-plan
        ok .claude/skills/review/SKILL.md review

Observation: review fix loop では採用 finding がなかったため、追加修正は不要だった。
Evidence:
    contract-reviewer: findings なし, verdict APPROVE
    ce-reviewer: findings なし, verdict APPROVE

## 判断

Decision: project-local skill の正本は `docs/skills/` 配下に置き、`.codex/skills/` と `.claude/skills/` には symlink だけを置く。
Rationale: Codex と Claude Code のどちらから起動しても同じ skill 本体を参照でき、runtime 別 copy の drift を避けられるため。通常 docs の恒久規約ではなく `docs/skills` を skill artifact の正本として扱う。
Date/Author: 2026-04-25 / Codex

Decision: `exec-plan` skill は plan 作成だけでなく、spec-to-PR と CI fix までの end-to-end 実行契約を持つ。
Rationale: ユーザーが「spec-to-pr & ci fix まで自立実行」を明示しており、計画と実行を別文書へ分散させると運用が壊れやすいため。
Date/Author: 2026-04-25 / Codex

Decision: `review` skill は user scope review skill の multi-reviewer 契約を取り込みつつ、yona.dev 固有の reviewer set を定義する。
Rationale: 共有 review skill を直接編集すると他 repo へ影響するため、この repo の routing / microCMS / UI / skill 変更に必要な観点だけを local skill に閉じ込める。
Date/Author: 2026-04-25 / Codex

Decision: docs / skills のみの PR では Vercel Preview build を `ignoreCommand` で skip する。
Rationale: この PR は web app の runtime や page generation を変更しておらず、Preview build が必須環境変数不足で落ちる問題は docs / skills 変更の検証とは独立している。`MICROCMS_API_KEY` の必須契約を緩めるより、Vercel root に変更がない場合だけ deploy を止める方が影響範囲が小さい。
Date/Author: 2026-04-25 / Codex

Decision: Claude Code 経由の project-local review は `codex exec` で reviewer を実行する。
Rationale: user scope review skill は review fallback で raw stdout や built-in `codex review` に依存せず、`codex exec --sandbox read-only --ephemeral -o ...` か wrapper を使う方針を持つ。Claude Code 自身の self review を成立済み review と扱うと、2 つ以上の独立 reviewer 契約が崩れるため。
Date/Author: 2026-04-25 / Codex

## 契約

Dependency: `AGENTS.md`
Reason: repo の Hot 層契約と verify command を定義している。
Contract: `AGENTS.md` は短く保ち、変更頻度の高い手順を増やさない。

Dependency: `docs/conventions.md`
Reason: repo 固有の詳細規約と SSoT を定義している。
Contract: project-local skill の正本を `docs/skills/`、Codex / Claude Code の入口を symlink として記録する。

Dependency: `PLANS.md`
Reason: ExecPlan schema と更新規則を定義している。
Contract: この ExecPlan と future ExecPlan skill は `PLANS.md` の必須 section、時刻形式、末尾 `Change note:` を守る。

Dependency: `docs/skills/exec-plan/SKILL.md`
Reason: ExecPlan 作成と spec-to-PR 実行の project-local skill。
Contract: ヒアリング、ExecPlan 作成、multi-agent review fix loop、PR 作成、CI 修正までの手順を持つ。

Dependency: `docs/skills/review/SKILL.md`
Reason: project-local multi-agent review gate。
Contract: user scope review skill を参考に、2 つ以上の独立 reviewer と fix loop を成立条件にする。Claude Code 経由では reviewer 実行を `codex exec` に委譲する。

Dependency: `.codex/skills/{exec-plan,review}` and `.claude/skills/{exec-plan,review}`
Reason: Codex と Claude Code が project-local skill を発見する入口。
Contract: どちらも `docs/skills/{exec-plan,review}` への symlink にし、runtime 別 copy を作らない。

## 実行計画

1. `docs/skills/exec-plan/SKILL.md` を正本として追加する。

    Working directory:
        <repo-root>
    Command:
        sed -n '1,260p' docs/skills/exec-plan/SKILL.md
    Expected outcome:
        ヒアリング、ExecPlan 作成、実装、review fix loop、PR/CI 修正の手順が定義されている。

2. `docs/skills/review/SKILL.md` を正本として追加する。

    Working directory:
        <repo-root>
    Command:
        sed -n '1,260p' docs/skills/review/SKILL.md
    Expected outcome:
        branch / staged / working tree diff の scope 決定、2 reviewer 以上の reviewer set、検証・fix loop の手順が定義されている。

3. 追加ファイルの構文、末尾契約、untracked file の whitespace を確認する。

    Working directory:
        <repo-root>
    Command:
        git diff --check
        rg -n "[ \t]+$" docs/skills docs/exec-plans/active/202604252140_project-agent-skills
    Expected outcome:
        tracked diff と untracked file のどちらにも whitespace error がない。

4. project-local skill 変更を multi-agent review で確認する。

    Working directory:
        <repo-root>
    Command:
        review skill の reviewer set を 2 つ以上起動する
    Expected outcome:
        未解決 findings が 0 件、または fix loop 後に解消済みである。

5. docs / skills のみの PR で Vercel Preview build が skip される条件を追加する。

    Working directory:
        <repo-root>
    Command:
        cd web
        git diff --quiet HEAD^ HEAD -- . ':(exclude)vercel.json'
    Expected outcome:
        web app file の変更がない場合は exit 0 になり、Vercel build が ignore される。

6. Codex / Claude Code 向けの symlink を作成する。

    Working directory:
        <repo-root>
    Command:
        ls -l .codex/skills .claude/skills
    Expected outcome:
        `.codex/skills/{exec-plan,review}` と `.claude/skills/{exec-plan,review}` が `../../docs/skills/{exec-plan,review}` を指す。

7. Claude Code 経由の review 実行契約を追加する。

    Working directory:
        <repo-root>
    Command:
        rg -n "Claude Code|codex exec" docs/skills/review/SKILL.md
    Expected outcome:
        Claude Code 経由では `codex exec --sandbox read-only --ephemeral -o ...` を使い、Claude Code 自身の self review を成立済み review としない契約がある。

## 受け入れ条件

Input: `git diff --check`
Observe:
    $ git diff --check
    # exit 0, no output
Failure signal:
    whitespace error が出る。

Input: `rg -n "[ \t]+$" docs/skills docs/exec-plans/active/202604252140_project-agent-skills`
Observe:
    $ rg -n "[ \t]+$" docs/skills docs/exec-plans/active/202604252140_project-agent-skills
    # exit 1, no output
Failure signal:
    untracked file の trailing whitespace が表示される。

Input: targeted multi-agent review
Observe:
    2026-04-26 00:13+09:00 review fix loop:
    contract-reviewer: findings なし, verdict APPROVE
    ce-reviewer: findings なし, verdict APPROVE
Failure signal:
    skill 本体に未解決の P1/P2 finding が残る。

Input: skill body inspection
Observe:
    `docs/skills/exec-plan/SKILL.md` がヒアリング徹底、multi-agent review fix loop、spec-to-PR、CI fix を含む。
Failure signal:
    いずれかが docs 側だけにあり、skill に含まれない。

Input: skill body inspection
Observe:
    `docs/skills/review/SKILL.md` が user scope review skill を参考にした 2 reviewer 以上の独立 review gate を含む。
Failure signal:
    self review への縮退、単一 reviewer APPROVE、scope 未固定の broad review が許されている。

Input: symlink inspection
Observe:
    `.codex/skills/{exec-plan,review}` and `.claude/skills/{exec-plan,review}` point to `../../docs/skills/{exec-plan,review}`.
Failure signal:
    symlink ではなく runtime 別 copy が存在する、または symlink target が壊れている。

Input: Claude Code review routing inspection
Observe:
    `docs/skills/review/SKILL.md` has a `Claude Code 経由の実行` section that requires `codex exec --sandbox read-only --ephemeral -o <output-file> <prompt>` per reviewer.
Failure signal:
    Claude Code 自身の self review や単一 reviewer を成立済み review として扱える記述が残る。

Input: project-local skill tests
Observe:
    frontmatter name matches directory name.
    `exec-plan` dry-run: small typo / read-only 調査は使わない、PR URL review は `pr-review`、spec-to-PR は PR / CI fix まで扱う。
    `review` dry-run: GitHub PR URL は `pr-review`、branch diff / staged / working tree / untracked files の scope 分岐を持つ。
    docs / skills only change uses `contract-reviewer` and `ce-reviewer`.
Failure signal:
    frontmatter が壊れる、PR URL と local diff review が混線する、untracked file 検査が消える、2 reviewer gate が消える。

Input: `mise run verify`
Observe:
    $ mise run verify
    [lint] Finished in 23.12s
    [build] ✓ Compiled successfully in 17.4s
    [build] Finished TypeScript in 7.4s
    [build] Error: Failed to collect configuration for /blog
    [cause]: Error: MICROCMS_API_KEY is not set
Failure signal:
    `MICROCMS_API_KEY is not set` 以外の変更起因 error が出る。

Input: `mise run install`
Observe:
    $ mise run install
    pnpm install
    Done in 39.7s
Failure signal:
    dependency install が失敗し、`mise run verify` が lint / build に進めない。

Input: Vercel ignore command dry-run
Observe:
    $ cd web
    $ git diff --quiet HEAD -- . ':(exclude)vercel.json'
    # exit 0
Failure signal:
    web app file に変更がないのに exit 1 になり、Vercel Preview build が実行される。

Input: `python3 -m json.tool web/vercel.json`
Observe:
    $ python3 -m json.tool web/vercel.json
    # exit 0
Failure signal:
    `web/vercel.json` が JSON として parse できない。

Input: `mise run lint`
Observe:
    $ mise run lint
    # exit 0
Failure signal:
    ESLint error が出る。

## 復旧

1. 追加するのは tracked skill file、symlink、ExecPlan だけなので、再実行しても外部 state を壊さない。
2. `.codex/skills` または `.claude/skills` の symlink 作成に失敗した場合は、通常権限と許可付き作成の evidence を残して停止する。
3. review 指摘が出た場合は、指摘対象の skill file だけを修正し、同じ reviewer set で再確認する。
4. `mise run verify` が `MICROCMS_API_KEY` 不足で止まる場合は既知の環境要因として未検証範囲を報告する。
5. Vercel Preview build が docs / skills only PR で再実行される場合は、Vercel root directory と `ignoreCommand` の実行 cwd を再確認する。
6. 誤って作成した空ディレクトリは、tracked file を含まないことを確認して片付ける。

## 未完了

`MICROCMS_API_KEY` がない環境では full verify の build 完了は確認できない。

Change note: 2026-04-25 21:40+09:00 project-local agent skills 追加作業の ExecPlan を作成した。

Change note: 2026-04-25 21:40+09:00 project-local `exec-plan` / `review` skill を追加し、commit 対象の ExecPlan から user scope の絶対 path を抽象化した。

Change note: 2026-04-25 21:45+09:00 targeted review の指摘に基づき、local review と PR URL review の責務分離、ExecPlan への review summary 記録、untracked file 検査を skill に追加した。

Change note: 2026-04-25 21:47+09:00 再レビュー指摘に基づき、project-local review skill 本体の PR URL 除外と、この ExecPlan の untracked file whitespace 検査手順を追加した。

Change note: 2026-04-25 21:50+09:00 実行済みの `git diff --check`、untracked whitespace check、targeted review の evidence と進捗を ExecPlan に反映した。

Change note: 2026-04-25 21:52+09:00 `mise run lint` 成功と `mise run verify` の既知環境変数不足による停止を ExecPlan に記録した。

Change note: 2026-04-25 21:54+09:00 project-local `exec-plan` / `review` skill の frontmatter、必須契約、routing dry-run、untracked file 検査結果を ExecPlan に記録した。

Change note: 2026-04-25 22:23+09:00 PR #18 の Vercel 失敗原因を記録し、docs / skills only change では Preview build を skip する `web/vercel.json` を追加した。

Change note: 2026-04-25 22:25+09:00 `web/vercel.json` の JSON 構文、Vercel ignore command dry-run、`git diff --check`、`mise run lint` の検証結果を ExecPlan に記録した。

Change note: 2026-04-25 23:58+09:00 project-local skill の正本を `docs/skills` へ移し、Codex / Claude Code 向け symlink と Claude Code 経由の `codex exec` review 契約を追加した。

Change note: 2026-04-26 00:02+09:00 symlink / frontmatter / whitespace 検査、`mise run install`、`mise run verify` の実行結果を記録した。

Change note: 2026-04-26 00:03+09:00 `docs/conventions.md` に project-local skill の正本と runtime symlink 契約を追記した。

Change note: 2026-04-26 00:03+09:00 `docs/conventions.md` 追記後の最終静的検査結果を進捗に反映した。

Change note: 2026-04-26 00:13+09:00 review fix loop の reviewer 結果と未解決 finding なしを記録した。
