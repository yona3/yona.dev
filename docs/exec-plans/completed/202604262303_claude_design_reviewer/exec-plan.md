この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

project-local `review` skill に、Claude Code CLI を使う `claude-design-reviewer` を恒久的な既定 reviewer として追加する。デザイン面のレビューでは Claude Code をデフォルトで使いたいというユーザー意図に応えつつ、design review 以外の通常レビューまでは外部モデルへ切り替えない。

## 進捗

- [x] 2026-04-26 23:03+09:00 ユーザーが恒久運用案を選択した。
- [x] 2026-04-26 23:08+09:00 ユーザーが「デザイン面はデフォルトで Claude、許可不要」を明示した。
- [x] 2026-04-26 23:03+09:00 `claude` CLI が存在し、`claude -p` / `--print` の非対話実行口があることを確認した。
- [x] 2026-04-26 23:03+09:00 `docs/skills/review/SKILL.md` に `claude-design-reviewer` の入力契約、起動条件、実行契約を追加する。
- [x] 2026-04-26 23:03+09:00 親 ExecPlan に review skill 拡張を記録する。
- [x] 2026-04-26 23:03+09:00 docs diff check と commit を完了する。

## 発見

観測: ローカル環境には `claude` CLI があり、非対話実行は `claude -p` / `claude --print` で行える。
根拠:
    `command -v claude` が `/Users/yonakintv/.local/bin/claude` を返した。
    `claude --help` に `-p, --print` と `--output-format` が表示された。

観測: project-local review skill は `.claude/skills/review` と `.codex/skills/review` の両方から同じ `docs/skills/review/SKILL.md` を参照している。
根拠:
    `ls -la .claude/skills .codex/skills docs/skills`。

観測: 既存の review skill は Claude Code 経由で呼ばれた場合も reviewer 実行を `codex exec` に固定している。
根拠:
    `docs/skills/review/SKILL.md` の `Claude Code 経由の実行` section。

観測: 作業中に今回の docs 変更と無関係な `web/src/components/site/MarkdownContent.tsx` の変更を一時的に観測したが、最終 stage 前の確認では同ファイルの差分は残っていなかった。
根拠:
    `git diff -- web/src/components/site/MarkdownContent.tsx` が空。

観測: ユーザーは design review では Claude をデフォルトで使い、追加許可を不要にしたいと明示した。
根拠:
    2026-04-26 23:08+09:00 user request: `デザイン面はデフォルトで claude でレビューさせるようにしたい。許可とかは不要。`

観測: docs 対象の `git diff --check` は成功した。
根拠:
    2026-04-26 23:10+09:00 `git diff --check -- docs/skills/review/SKILL.md docs/exec-plans/active/202604261459_site_refresh_parent/exec-plan.md docs/exec-plans/active/202604262303_claude_design_reviewer/exec-plan.md`。

## 判断

判断: `claude-design-reviewer` は design review 条件に該当したら既定で起動し、`claude_design_review:off` の時だけ無効化する。
理由: ユーザーが design review では Claude をデフォルトで使い、追加許可を不要にしたいと明示したため。design review 以外の通常レビューまでは対象にしない。
日付/担当: 2026-04-26 / Codex

判断: `claude-design-reviewer` は編集禁止、read-only prompt bundle、structured output の reviewer として扱う。
理由: reviewer は finding を出すだけで、採用判断と修正は coordinator が行うという既存 skill の契約を維持するため。
日付/担当: 2026-04-26 / Codex

判断: Claude Code 経由で review skill を呼ぶ場合でも、Claude 自身の self review は成立済み reviewer の代替にしない。
理由: 既存の `Claude Code 経由の実行` section と multi-agent review の独立性を維持するため。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `docs/skills/review/SKILL.md`, `.claude/skills/review`, `.codex/skills/review`, `docs/exec-plans/active/202604261459_site_refresh_parent/exec-plan.md`
依存理由: 正本 skill、Claude/Codex adapter、親計画に同じ運用契約を反映するため。
契約: `review` skill の正本は `docs/skills/review/SKILL.md` のままにする。
契約: `.claude/skills/review` と `.codex/skills/review` は symlink のまま変更しない。
契約: Claude に送る情報は scoped diff、関連 file snippets、DESIGN.md、ExecPlan acceptance、browser verification summary など review に必要な範囲に絞る。
契約: `claude-design-reviewer` は design review 条件に該当したら既定で起動し、通常の `design-reviewer` を置き換えず追加 reviewer として扱う。
契約: design review での Claude 利用はユーザーの standing approval 済みとして扱い、追加許可は不要。無効化する場合は `claude_design_review:off` を使う。
契約: `claude -p` の実 model call はこの docs 変更の検証では実行しない。実行時にユーザーが Claude review を求めた turn で行う。
契約: 無関係な app 差分が存在する場合は今回の commit に含めない。

## 実行計画

1. `review` skill に入力契約と起動判定を追加する。

    作業場所:
        <repo-root>
    実行:
        `docs/skills/review/SKILL.md` に `claude_design_review` 入力、design review 時の既定起動条件、`claude-design-reviewer` reviewer row を追加する。
    期待結果:
        Claude design review を起動する条件と、起動しない条件が明確になる。

2. Claude 実行契約を追加する。

    作業場所:
        <repo-root>
    実行:
        `claude -p --output-format json` を使う read-only reviewer 実行、失敗時の `BLOCKED` / skip 条件、output contract を記載する。
    期待結果:
        `codex exec` と同様に、Claude review の使い方と失敗時の扱いが再現可能になる。

3. 親 ExecPlan に記録する。

    作業場所:
        <repo-root>
    実行:
        `docs/exec-plans/active/202604261459_site_refresh_parent/exec-plan.md` に Claude design review を利用可能にする作業を追記する。
    期待結果:
        PR merge まで残る親計画にも、review gate の選択肢が記録される。

4. 検証と commit を行う。

    作業場所:
        <repo-root>
    実行:
        docs 対象の `git diff --check`
        staged diff 確認
        commit skill
    期待結果:
        docs / skill 変更だけが commit され、既存の app 差分は混ざらない。

## 受け入れ条件

入力: `docs/skills/review/SKILL.md`
確認: `claude_design_review` または同等の明示的な入力契約がある。
確認: `claude-design-reviewer` は design review 条件に該当したら既定で起動し、`claude_design_review:off` で無効化できる。
確認: `claude -p` の read-only 実行契約、失敗時の扱い、output contract が書かれている。
確認: Claude 自身の self review を成立済み multi-agent review の代替にしない契約が残っている。

入力: `docs/exec-plans/active/202604261459_site_refresh_parent/exec-plan.md`
確認: Claude design review を利用可能にする作業が親計画に記録されている。

入力: validation commands
確認: docs 対象の `git diff --check` が成功する。結果: 成功。
確認: `claude --help` により CLI の非対話実行口を確認済みである。
確認: `mise run verify` は docs / skill の契約変更であるため実行しないことを記録する。

失敗条件: Claude review が通常 design-reviewer を置き換える、design review 以外の通常レビューまで外部モデルへ送る、`.claude/skills` の symlink を崩す、無関係な `MarkdownContent.tsx` 変更を commit に混ぜる。

## 復旧

1. `docs/skills/review/SKILL.md` の追加 section は独立した塊にし、必要なら戻しやすくする。
2. Claude CLI が実行時に auth / network / quota で失敗した場合は `BLOCKED: claude design review unavailable` として扱う。
3. `claude-design-reviewer` が noisy な finding を出す場合は、aggregation で好みだけの提案を除外する。
4. 無関係な app 差分は stage 対象から外す。
5. docs 変更後も `.claude/skills/review` と `.codex/skills/review` が正本 skill を参照していることを保つ。

## 未完了

None. `mise run verify` と実際の `claude -p` model call は未実行。理由: 今回は docs / skill の契約変更であるため。Claude model call は次回 design review 実行時に scoped prompt bundle で行う。

変更記録: 2026-04-26 23:03+09:00 Claude design reviewer 恒久化の子 ExecPlan を作成した。
変更記録: 2026-04-26 23:08+09:00 ユーザー指示に合わせ、Claude design review を明示起動ではなく design review 時の既定起動へ変更した。
変更記録: 2026-04-26 23:10+09:00 review skill と親 ExecPlan への反映、および docs diff check の成功を記録した。
変更記録: 2026-04-26 23:12+09:00 一時的に観測した `MarkdownContent.tsx` 差分が最終確認では残っていないことに合わせ、未完了と契約の記述を更新した。
