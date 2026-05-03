この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

`harness-architect` 標準仕様に合わせて、yona.dev の repo-wide contract を最小差分で再構築する。既存の `AGENTS.md` / `PLANS.md` / `docs/conventions.md` / project-local skills / `mise run verify` の SSoT 構造は維持し、標準仕様から不足している意図確認、責務境界、委譲、review scope 再現性だけを補う。

## 進捗

- [x] 2026-05-03 11:35+09:00 `harness-architect` に従って Discover / Profile / Proposal を実施し、ユーザーの `go` で承認1を得た。
- [x] 2026-05-03 11:35+09:00 `PLANS.md` / `docs/conventions.md` / `docs/skills/exec-plan/SKILL.md` / `docs/skills/review/SKILL.md` を標準仕様へ寄せた。
- [x] 2026-05-03 11:52+09:00 `git diff --check`、untracked ExecPlan の whitespace check、`mise run verify` を実行した。
- [x] 2026-05-03 11:52+09:00 project-local review gate を `contract-reviewer` / `ce-reviewer` で実行し、採用 finding を修正して APPROVE を得た。
- [x] 2026-05-03 11:52+09:00 完了条件を記録した。
- [x] 2026-05-03 11:53+09:00 この ExecPlan を `docs/exec-plans/completed/202605031135_harness_standard_rebuild` へ移した。
- [ ] 2026-05-03 11:35+09:00 承認済みファイルを stage / commit し、PR 作成または blocker 記録まで進める。

## 発見

観測: repo root に `AGENTS.md`, `PLANS.md`, `docs/conventions.md`, `docs/skills/exec-plan/SKILL.md`, `docs/skills/review/SKILL.md`, `mise.toml` が存在し、app 本体は `web/` にある。
根拠:
    `rg --files -g 'AGENTS.md' -g 'PLANS.md' -g 'docs/**' -g 'mise.toml' -g 'web/package.json'` で確認した。

観測: hidden `.harness`、`.agents`、`.system` は repo 内に存在しない。
根拠:
    `find . -maxdepth 3 -type d -name '.harness' -o -name '.agents' -o -name '.system'` は出力なし。

観測: `.codex/skills/exec-plan`, `.codex/skills/review`, `.claude/skills/exec-plan`, `.claude/skills/review` は `docs/skills/*` への symlink で、skill SSoT はすでに `docs/skills/` にある。
根拠:
    `ls -la .codex/skills .claude/skills` が symlink を返した。

観測: `mise run verify` は root task として `lint` と `build` に依存し、実処理は `web/` の `pnpm` で実行される。
根拠:
    `mise.toml` の `[tasks.verify] depends = ["lint", "build"]` と各 task の `dir = "{{config_root}}/web"`。

観測: 現行 contract は、標準仕様のうち task artifact、hard guard、project-local review、pr-writer gate、completed move は持っている。一方で `grill-me` 型の設計木、質問省略理由、明示的な人間 / agent 責務、委譲期待出力、review scope command / untracked paths の共通契約が薄い。
根拠:
    `PLANS.md`, `docs/conventions.md`, `docs/skills/exec-plan/SKILL.md`, `docs/skills/review/SKILL.md` の `rg` 結果。

観測: 現在の git 状態は detached HEAD で、作業開始時点の tracked 変更はない。
根拠:
    `git status --short --branch` が `## HEAD (no branch)` を返した。

観測: `grill-me` 型 Interview の設計木は、標準仕様への寄せ方、変更対象、既存 runtime、導入しない事項、完了 gate の分岐で整理した。追加質問は不要と判断した。
根拠:
    標準仕様への寄せ方は `harness-architect` の `PLANS.md` 標準指示で閉じた。変更対象は Discover で `PLANS.md`, `docs/conventions.md`, `docs/skills/*` に限定できた。既存 runtime は `web/` と root `mise.toml` で確認した。hidden runtime は存在しないため導入しない。完了 gate は `AGENTS.md` と project-local skills により `mise run verify`、review gate、completed move、commit / PR が既定と分かった。

観測: deterministic verification は最新差分で成功した。
根拠:
    `git diff --check` は出力なしで成功した。
    `git diff --no-index --check /dev/null docs/exec-plans/active/202605031135_harness_standard_rebuild/exec-plan.md` は exit 1 だが whitespace warning 出力なし。no-index diff の差分あり終了として扱う。completed move 後も path-sensitive 記録を更新した。
    `mise run verify` は lint と build を実行し、Next.js build は 8 pages を生成して成功した。mise cache 書き込み warning は出たが command は exit 0。

観測: project-local review gate は `contract-reviewer` と `ce-reviewer` の 2 reviewer で成立し、最終 verdict は APPROVE。
根拠:
    `contract-reviewer`: verdict APPROVE、findings なし、blocker なし、confidence high。
    `ce-reviewer`: verdict APPROVE、findings なし、blocker なし、confidence high。
    review fix loop では `docs/skills/exec-plan/SKILL.md` の使う場面 / 使わない場面の見出し構造と、`docs/skills/review/SKILL.md` の output example を修正した。
    reviewer 実行は `codex exec --sandbox read-only --ephemeral -o <output-file>`。Codex plugin auth warning は出たが reviewer 出力は取得できた。

## 判断

判断: 標準仕様への再構築は `PLANS.md` を中心に、必要最小限の docs / skill 契約更新として扱う。
理由: `harness-architect` 標準はルート `PLANS.md` を ExecPlan SSoT とするため。既存構成も同じ責務分離に寄っており、別 scaffold や hidden runtime を増やす必要はない。
日付/担当: 2026-05-03 / Codex

判断: 既存 completed ExecPlan は一括変換しない。
理由: `harness-architect` 標準は過去 artifact を履歴として扱い、今回触る active / relevant artifact だけを追従対象にするため。
日付/担当: 2026-05-03 / Codex

判断: `AGENTS.md` は Hot 層のまま維持し、詳細な標準仕様は `PLANS.md` / `docs/conventions.md` / skill 本体へ寄せる。
理由: `AGENTS.md` は agent 行動契約の正本だが、長い手順や可変な運用詳細を置くと Hot 層が重くなるため。
日付/担当: 2026-05-03 / Codex

判断: PR 作成まで進める前に、detached HEAD であることを blocker 候補として扱う。
理由: commit / PR 作成には branch が必要であり、現在は `## HEAD (no branch)` のため。実装と検証は進められるが、PR 作成時は branch 作成または既存 branch への切り替えが必要になる。
日付/担当: 2026-05-03 / Codex

## 契約

依存: `AGENTS.md`, `PLANS.md`, `docs/conventions.md`, `docs/skills/exec-plan/SKILL.md`, `docs/skills/review/SKILL.md`, `mise.toml`, `docs/exec-plans/completed/202605031135_harness_standard_rebuild/exec-plan.md`
依存理由: repo-wide contract、ExecPlan schema、詳細規約、project-local skill、検証 gate、今回の task artifact を整合させるため。
契約: hidden `.harness`、別 pipeline、別 task artifact、独自 runner framework は追加しない。
契約: ExecPlan の共通ルールは `PLANS.md` に置き、タスク固有手順は各 `exec-plan.md` に置く。
契約: `README.md` は人間向け説明であり、agent 行動契約として扱わない。
契約: 既存 completed ExecPlan は履歴として扱い、今回の変更で一括 rewrite しない。
契約: review scope には tracked diff だけでなく、必要な untracked files と completed move を含める。
契約: review は `mise run verify` の代替ではなく、deterministic verification と分けて記録する。
review.scope_command: `git diff -- PLANS.md docs/conventions.md docs/skills/exec-plan/SKILL.md docs/skills/review/SKILL.md docs/exec-plans/completed/202605031135_harness_standard_rebuild/exec-plan.md`
review.untracked_paths: `docs/exec-plans/completed/202605031135_harness_standard_rebuild/exec-plan.md`

## 実行計画

1. 標準仕様の不足点を `PLANS.md` へ補う。

    作業場所:
        <repo-root>
    実行:
        `PLANS.md` の意図確認、記述規則、section skeleton に、設計木、1 問ずつの質問、質問省略理由、人間 / agent 責務、委譲期待出力、review scope command / untracked paths を追加する。
    期待結果:
        ExecPlan 共通契約だけを増やし、タスク固有手順や hidden pipeline を追加しない。

2. `docs/conventions.md` と project-local skills を `PLANS.md` に合わせる。

    作業場所:
        <repo-root>
    実行:
        `docs/conventions.md` と `docs/skills/exec-plan/SKILL.md` のヒアリング / review scope / 委譲文言を、`harness-architect` 標準の語彙へ寄せる。必要なら `docs/skills/review/SKILL.md` に review scope command / untracked paths の入力契約だけ補足する。
    期待結果:
        `PLANS.md` と skill の運用文言が矛盾しない。

3. 検証を実行する。

    作業場所:
        <repo-root>
    実行:
        `git diff --check`
        `mise run verify`
    期待結果:
        Markdown 差分の whitespace 問題がなく、lint / build が通る。環境要因で止まる場合は原因と未検証範囲を記録する。

4. project-local review gate を実行する。

    作業場所:
        <repo-root>
    実行:
        `review` skill 相当で docs / contract scope を review する。runtime 制約で 2 つ以上の独立 reviewer を起動できない場合は BLOCKED として記録する。
        委譲: `contract-reviewer` は `AGENTS.md`, `PLANS.md`, local skills, `mise.toml`, task scope の矛盾を担当する。
        委譲: `ce-reviewer` は SSoT、context clash、lost-in-middle、artifact trail、日本語文体を担当する。
        委譲: 対象範囲は `review.scope_command` と `review.untracked_paths` に限定する。
        委譲: 2 reviewer は独立した `codex exec --sandbox read-only --ephemeral -o <output-file>` で並列実行する。
        委譲: 期待出力は `verdict`, `findings`, `evidence`, `blocker`, `confidence` とする。
        委譲: coordinator は findings を source reviewer 付きで統合し、scope 外 / 重複 / 好みだけの指摘を除外し、採用 finding だけを修正する。
        委譲: reviewer が失敗、時間切れ、出力不正、または 2 reviewer 未満の場合は `BLOCKED` として `受け入れ条件` と `未完了` に記録する。
    期待結果:
        reviewer ids、verdict、未解決 finding、未検証範囲、verification command がこの ExecPlan に記録される。

5. 完了処理を行う。

    作業場所:
        <repo-root>
    実行:
        `docs/exec-plans/active/202605031135_harness_standard_rebuild` を `docs/exec-plans/completed/202605031135_harness_standard_rebuild` へ移し、path-sensitive な記録を確認する。
    期待結果:
        完了済み plan が active に残らず、移動も commit 対象に含まれる。

6. stage / commit、PR 作成または blocker 記録まで進める。

    作業場所:
        <repo-root>
    実行:
        `git add <approved files>`
        `commit` skill
        `pr-writer` skill
    期待結果:
        承認済みファイルが stage / commit され、PR が作成される。detached HEAD などの blocker が残る場合は、具体的に報告する。

## 受け入れ条件

入力: `harness-architect` 標準仕様への再構築。
確認: `PLANS.md` / `docs/conventions.md` / project-local skills が、設計木ヒアリング、人間 / agent 責務、委譲期待出力、review scope 再現性を持つ。実測: 反映済み。
確認: hidden runtime namespace、別 pipeline、別 task artifact が追加されていない。実測: 追加なし。
確認: `git diff --check` と `mise run verify` の結果が記録されている。実測: `git diff --check` と `mise run verify` は成功。
確認: project-local review gate の verdict または runtime blocker が記録されている。実測: `contract-reviewer` / `ce-reviewer` ともに APPROVE。
失敗条件: ExecPlan 共通ルールと skill 運用が矛盾する。
失敗条件: `PLANS.md` にタスク固有手順や pipeline 実装詳細を混ぜる。
失敗条件: completed ExecPlan の無関係な一括変換が発生する。

## 復旧

1. docs-only の変更に留めるため、差分は `git diff` で容易に確認できる。
2. 問題があれば対象文書の該当 hunks だけを戻し、既存の `AGENTS.md` / `PLANS.md` 構造へ復旧する。
3. 生成物、依存 lock、runtime code は変更しない。
4. `mise run verify` が環境要因で失敗した場合は、差分起因かどうかを分けて記録する。
5. 完了時はこの ExecPlan を completed へ移し、active には作業中 plan だけを残す。

## 未完了

stage / commit / PR 作成が未完了。completed move 後に `commit` skill と `pr-writer` skill で継続する。

変更記録: 2026-05-03 11:35+09:00 承認1後に標準仕様再構築の ExecPlan を作成した。
変更記録: 2026-05-03 11:35+09:00 標準仕様の docs patch を反映し、この ExecPlan に review scope を追記した。
変更記録: 2026-05-03 11:40+09:00 review finding を受け、設計木の質問省略理由と review gate の委譲契約を追記した。
変更記録: 2026-05-03 11:52+09:00 deterministic verification と multi-agent review gate の最終 APPROVE を記録した。
変更記録: 2026-05-03 11:53+09:00 ExecPlan を completed へ移し、path-sensitive な review scope を更新した。
