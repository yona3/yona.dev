この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

Home / About / Notes の補助ラベルと導線を見直し、説明的な UI を減らす。footer の coffee mark は OS 標準 emoji ではなく、サイト内の emoji-style SVG に置き換える。既存の未コミット差分は、ユーザー指示に従い論理単位で commit する。

## 進捗

- [x] 2026-04-26 13:47+09:00 ユーザーの質問と commit 指示を確認した。
- [x] 2026-04-26 13:47+09:00 `commit` skill と project-local `exec-plan` skill を確認した。
- [x] 2026-04-26 13:52+09:00 補助ラベル、Home 導線、coffee emoji を修正する。
- [x] 2026-04-26 13:53+09:00 `mise run verify` と browser preview を確認する。
- [x] 2026-04-26 13:55+09:00 site UI と review skill を論理単位で commit した。
- [x] 2026-04-26 13:56+09:00 ExecPlan directory を completed へ移した。
- [x] 2026-04-26 13:56+09:00 ExecPlan artifact を commit 対象として stage した。

## 発見

観測: About の `書いている人`、Notes の `すべて` は、ページタイトルと本文の役割説明に対して情報が重複している。
根拠:
    `web/src/app/about/page.tsx`, `web/src/app/notes/page.tsx`。

観測: Home の `はじめに / このサイトと書いている人について` 導線は、header navigation の About と役割が重複している。
根拠:
    `web/src/app/page.tsx`。

観測: footer の coffee mark は CSS 線画であり、ユーザーは Twemoji / Noto Emoji / Fluent Emoji のような emoji 表現を試したい。
根拠:
    `web/src/components/site/SiteShell.tsx`, `web/src/components/site/site.module.css`。

観測: Home の entry line、About / Notes の hero kicker、demo の対応要素を削除した。footer は local SVG の `CoffeeEmoji` に置き換え、`twemoji` / `noto` / `fluent` 風 palette を切り替えられるようにした。
根拠:
    `web/src/app/page.tsx`, `web/src/app/about/page.tsx`, `web/src/app/notes/page.tsx`, `web/src/app/demo/site-refresh/page.tsx`, `web/src/components/site/SiteShell.tsx`, `web/src/components/site/site.module.css`。

観測: `mise run verify` は成功した。Browser/CDP では `/`, `/about`, `/notes`, `/demo/site-refresh` の mobile 390px で横 overflow がなく、footer coffee が 24px SVG で表示され、native coffee text `☕` がないことを確認した。dev server により `web/next-env.d.ts` が dev path に書き換わったため元に戻した。
根拠:
    `mise run verify`, `/tmp/yona-labels-emoji-check/*.png`, Chrome DevTools Protocol の DOM 検証結果。

観測: site UI / design 変更は `3b1e6ab feat(site): 個人サイトを内省的な Notes 体験に刷新`、review skill 変更は `9a10e9b docs(review): デザインレビュー観点を追加` として commit した。`.codex/config.toml` は stage していない。
根拠:
    `git commit` 実行結果、`git status --short`。

観測: ExecPlan directory を active から completed へ移した。
根拠:
    `docs/exec-plans/completed/202604261347_trim-labels-emoji-commits/exec-plan.md`。

観測: completed ExecPlan artifacts は `.codex/config.toml` を含めず stage した。
根拠:
    `git diff --staged --name-status`。

## 判断

判断: About / Notes の hero kicker は削る。
理由: ページの役割は title と navigation で分かるため、補助ラベルを削る方が内省的で静かな UI になる。
日付/担当: 2026-04-26 / Codex

判断: Home の About 固定導線は削る。
理由: header navigation と重複し、Home の読み始める流れに説明感を足している。
日付/担当: 2026-04-26 / Codex

判断: coffee mark は OS emoji ではなく local SVG component にする。
理由: glyph rendering を OS に依存させず、Twemoji / Noto / Fluent 風の方向性をコード上で試せるようにする。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `web/src/app/page.tsx`, `web/src/app/about/page.tsx`, `web/src/app/notes/page.tsx`, `web/src/app/demo/site-refresh/page.tsx`, `web/src/components/site/SiteShell.tsx`, `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`, `DESIGN.md`
依存理由: UI の説明要素、footer mark、design guidance を整合させるため。
契約: route、content loader、Markdown renderer、frontmatter schema、Notion sync、secret / server-client boundary は変更しない。
契約: `.codex/config.toml` はユーザー指示により scope 外として無視する。
契約: commit は `.codex/config.toml` と生成物を含めず、論理単位で分ける。

## 実行計画

1. UI の重複要素を削る。

    作業場所:
        <repo-root>
    実行:
        Home の entry line、About / Notes の hero kicker、demo の対応要素を削る。
    期待結果:
        ページタイトルと nav だけで役割が分かり、説明的なラベルが減る。

2. coffee mark を emoji-style SVG に置き換える。

    作業場所:
        <repo-root>
    実行:
        `SiteShell` に local SVG component を追加し、footer へ配置する。
    期待結果:
        OS 標準 emoji に依存しない coffee 表現になる。

3. 検証する。

    作業場所:
        <repo-root>
    実行:
        `git diff --check`
        `mise run verify`
        browser preview
    期待結果:
        lint/build が成功し、Home / About / Notes / demo の表示が崩れない。

4. 論理単位で commit する。

    作業場所:
        <repo-root>
    実行:
        `commit` skill の規約に従って staged files を分割し、Conventional Commits の日本語 message で commit する。
    期待結果:
        既存の刷新差分が review しやすい単位の commit history になる。

## 受け入れ条件

入力: ユーザーの UI 質問と commit 指示。
確認: About / Notes の不要な hero kicker が消えている。
確認: Home の `はじめに` 導線が消えている。
確認: footer coffee が OS emoji ではなく local SVG component で表示される。
確認: `git diff --check` と `mise run verify` が成功する。
確認: `.codex/config.toml` を commit に含めない。
確認: 論理単位で commit が作成される。
失敗条件: OS emoji glyph へ戻す、route/content loader/Markdown renderer を変更する、生成物差分を残す、`.codex/config.toml` を stage する。

## 復旧

1. UI copy と SVG component の変更だけを戻せるようにする。
2. dev server が `web/next-env.d.ts` を書き換えた場合は元に戻す。
3. commit 前に staged files を確認し、scope 外 file を外す。
4. 検証が環境要因で失敗した場合は原因と未検証範囲を記録する。
5. 完了後は active から completed へ移す。

## 未完了

PR / CI は最終 branch delivery の残作業として扱う。

変更記録: 2026-04-26 13:47+09:00 trim labels / coffee emoji / commits の ExecPlan を作成した。
変更記録: 2026-04-26 13:52+09:00 補助ラベル、Home 導線、footer coffee emoji を修正した。
変更記録: 2026-04-26 13:53+09:00 `mise run verify` と Browser/CDP preview を確認した。
変更記録: 2026-04-26 13:55+09:00 site UI と review skill を論理単位で commit した。
変更記録: 2026-04-26 13:56+09:00 ExecPlan directory を completed へ移した。
変更記録: 2026-04-26 13:56+09:00 ExecPlan artifacts を commit 対象として stage した。
