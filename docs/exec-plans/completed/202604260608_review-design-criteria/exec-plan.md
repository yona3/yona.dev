この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

project-local `review` skill に、ユーザーが求めた時だけ起動するデザイン観点の reviewer を追加する。通常の code / contract review を重くせず、明示的なデザインレビュー依頼や UI / IA / DESIGN.md に関わる差分では、Design Thinking、UX Design、Information Architecture、Visual Design の 4 観点でレビューできるようにする。

## 進捗

- [x] 2026-04-26 06:08+09:00 ユーザーの `review skill` 変更依頼を確認した。
- [x] 2026-04-26 06:08+09:00 既存の `docs/skills/review/SKILL.md` と配置 symlink を確認した。
- [x] 2026-04-26 06:12+09:00 条件付き `design-reviewer` を追加する。
- [x] 2026-04-26 06:12+09:00 `design-reviewer` の 4 観点と finding 採用基準を明文化する。
- [x] 2026-04-26 06:12+09:00 diff check と最終状態を確認する。

## 発見

観測: 現在の reviewer set には `ui-reviewer` があり、UI / CSS / component の responsive、accessibility、visual regression、hover/keyboard behavior を見る。
根拠:
    `docs/skills/review/SKILL.md` の `reviewer set`。

観測: Design Thinking、UX Design、Information Architecture、Visual Design の 4 観点は明示されていない。
根拠:
    `docs/skills/review/SKILL.md` に該当語が存在しない。

観測: `.codex/skills/review` と `.claude/skills/review` はどちらも `docs/skills/review` への symlink である。
根拠:
    `ls -l .codex/skills .claude/skills`。

観測: `docs/skills/review/SKILL.md` に `design_review` 入力、`design review 起動判定`、`design-reviewer`、4 観点、finding 採用/除外基準を追加した。
根拠:
    `rg -n "design-reviewer|Design Thinking|UX Design|Information Architecture|Visual Design|design_review|design review 起動判定" docs/skills/review/SKILL.md`。

観測: `git diff --check` は成功した。
根拠:
    2026-04-26 の `git diff --check` 実行結果。

## 判断

判断: `ui-reviewer` を置き換えず、条件付きの `design-reviewer` を追加する。
理由: `ui-reviewer` は実装品質、accessibility、responsive regression の責務を持つ。デザイン思考や情報設計は別の評価軸なので、混ぜると通常 review が重くなり、finding の性質も曖昧になる。
日付/担当: 2026-04-26 / Codex

判断: `design-reviewer` は「好み」ではなく、user request、DESIGN.md、対象 route、情報構造、利用者の初回/再訪行動に根拠を持つ finding だけを出す。
理由: デザインレビューは主観が入りやすいため、採用基準を明確にしないと通常 review のノイズになる。
日付/担当: 2026-04-26 / Codex

判断: stage / commit / PR 作成は未実施として記録し、UI 反復が落ち着くまで保留する。
理由: ExecPlan skill の既定範囲には stage / commit / PR が含まれる。一方で、既存のサイト刷新差分は未確定で、review skill 変更だけを履歴固定すると同じ working tree 内の UI 差分と分離しにくくなるため、未完了として明示する。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `docs/skills/review/SKILL.md`
依存理由: project-local review skill の reviewer set と prompt 契約を更新するため。
契約: `.codex/skills/review` と `.claude/skills/review` は symlink のままにし、runtime 別 copy を作らない。
契約: app route、web code、skill 実行 runner、PR review flow は変更しない。
契約: design-reviewer は条件付き起動にし、通常の docs / skills only review で常時追加しない。

## 実行計画

1. `reviewer set` に `design-reviewer` を追加する。

    作業場所:
        `docs/skills/review/SKILL.md`
    実行:
        起動条件と観点を reviewer table に追加する。
    期待結果:
        明示的なデザインレビュー依頼や UI / IA / DESIGN.md に関わる差分だけで `design-reviewer` が起動する。

2. `design-reviewer` の観点と採用基準を明文化する。

    作業場所:
        `docs/skills/review/SKILL.md`
    実行:
        Design Thinking、UX Design、Information Architecture、Visual Design のレビュー観点と、好みだけの指摘を除外する基準を追加する。
    期待結果:
        デザインレビューが具体的な user-visible finding として出力される。

3. 検証する。

    作業場所:
        `<repo-root>`
    実行:
        `git diff --check`
        `rg` で `design-reviewer` と 4 観点の記載を確認する。
    期待結果:
        Markdown 差分に空白エラーがなく、条件付き起動と 4 観点が確認できる。

4. 完了条件を満たしたら、この ExecPlan directory を completed へ移す。

    作業場所:
        `<repo-root>`
    実行:
        `mv docs/exec-plans/active/202604260608_review-design-criteria docs/exec-plans/completed/202604260608_review-design-criteria`
    期待結果:
        完了済みの ExecPlan が active に残らない。

## 受け入れ条件

入力: `docs/skills/review/SKILL.md`
確認: `design-reviewer` が reviewer set に追加されている。
確認: 起動条件が「明示的なデザインレビュー依頼」または「UI / UX / IA / visual / DESIGN.md / user journey に関わる差分」に限定されている。
確認: Design Thinking、UX Design、Information Architecture、Visual Design の 4 観点が明記されている。
確認: 好みや未根拠の改善提案を finding にしない基準がある。
確認: `git diff --check` が成功した。
失敗条件: `ui-reviewer` の責務を曖昧にする、design-reviewer を常時起動にする、runtime 別 skill copy を増やす。

## 復旧

1. 変更は `docs/skills/review/SKILL.md` に閉じる。
2. symlink は変更しないため、戻す場合は skill 本体の差分だけを戻せる。
3. app code や route は変更しない。
4. 失敗時は active ExecPlan に blocker を残す。
5. 完了後は active から completed へ移す。

## 未完了

stage / commit / PR 作成は未実施。UI 反復中のため、ユーザーが履歴固定を承認するまで保留。

変更記録: 2026-04-26 06:08+09:00 review design criteria の ExecPlan を作成した。
変更記録: 2026-04-26 06:12+09:00 design-reviewer の条件付き起動、4 観点、採用基準を実装し、diff check を確認した。
変更記録: 2026-04-26 06:20+09:00 design review fix loop で stage / commit / PR 未実施の記録を契約に合わせて更新した。
