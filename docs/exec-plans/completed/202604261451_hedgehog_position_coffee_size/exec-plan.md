この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

名前横のハリネズミ emoji をもう少しハリネズミとして読める形に調整し、名前の前へ移動する。footer の coffee emoji は余韻を保ったまま少しだけ大きくする。

## 進捗

- [x] 2026-04-26 14:51+09:00 ユーザー要望と現行実装を確認した。
- [x] 2026-04-26 14:51+09:00 ハリネズミ emoji の形状を調整する。
- [x] 2026-04-26 14:51+09:00 名前の前に emoji を移動する。
- [x] 2026-04-26 14:51+09:00 footer coffee を少し大きくする。
- [x] 2026-04-26 14:51+09:00 verify / browser 確認 / commit を完了する。

## 発見

観測: 現在の `HedgehogEmoji` は local SVG で、H1 内では名前の後ろに配置されている。
根拠:
    `web/src/components/site/HedgehogEmoji.tsx`, `web/src/app/page.tsx`, `web/src/app/demo/site-refresh/page.tsx`。

観測: footer の coffee emoji は `24px` で表示されている。
根拠:
    `web/src/components/site/site.module.css`。

観測: `git diff --check` と `mise run verify` は成功した。
根拠:
    2026-04-26 14:52+09:00 実行結果。

観測: agent-browser で `/` desktop / mobile と `/demo/site-refresh` mobile を確認し、H1 text content は `Koh Yonamine` のまま、emoji は名前の前、横 overflow なし、footer coffee の中心ずれは 0px だった。
根拠:
    2026-04-26 14:53+09:00 agent-browser eval。

## 判断

判断: ハリネズミ emoji は local SVG のまま、輪郭・針・鼻先・足の読みやすさを上げる。
理由: 外部 asset や OS emoji 依存を増やさず、既存の coffee と同じ実装方針を維持できる。
日付/担当: 2026-04-26 / Codex

判断: 名前の前に emoji を置く。
理由: 小さな signpost として先に目に入り、名前の読みを邪魔しにくい。
日付/担当: 2026-04-26 / Codex

判断: coffee は大きすぎない範囲で `28px` にする。
理由: footer の静かな終端を保ちながら、現在より少し存在感を出せる。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `web/src/components/site/HedgehogEmoji.tsx`, `web/src/app/page.tsx`, `web/src/app/demo/site-refresh/page.tsx`, `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`
依存理由: Home / demo の名前まわりと footer coffee 表示を揃えるため。
契約: route、content loader、Markdown renderer、frontmatter schema、Notion sync、secret / server-client boundary は変更しない。
契約: OS emoji glyph、Twemoji/Noto/Fluent の外部 asset、画像ファイルは追加しない。
契約: H1 の accessible name は `Koh Yonamine` のままにする。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo`, `web/next-env.d.ts` の生成的差分は残さない。

## 実行計画

1. ハリネズミ emoji の SVG を調整する。

    作業場所:
        <repo-root>
    実行:
        針のシルエット、鼻先、足、色のコントラストを微調整する。
    期待結果:
        小さいサイズでもハリネズミとして読める。

2. 名前まわりの順序を調整する。

    作業場所:
        <repo-root>
    実行:
        Home / demo の H1 で emoji を名前の前へ移動する。
    期待結果:
        H1 の text content は `Koh Yonamine` のまま。

3. footer coffee のサイズを調整する。

    作業場所:
        <repo-root>
    実行:
        coffee SVG の表示サイズを少し大きくする。
    期待結果:
        footer の中央寄せは維持され、少しだけ見えやすくなる。

4. 検証と完了処理を行う。

    作業場所:
        <repo-root>
    実行:
        `git diff --check`
        `mise run verify`
        browser preview
        completed へ移動
        commit skill
    期待結果:
        lint/build と visual checks が通り、active に完了済み plan が残らない。

## 受け入れ条件

入力: `http://localhost:3000/`, `http://localhost:3000/demo/site-refresh`
確認: ハリネズミ emoji が名前の前に表示される。
確認: ハリネズミ emoji が以前よりハリネズミとして読める。
確認: footer coffee が中央寄せのまま、少し大きくなる。
確認: H1 の text content は `Koh Yonamine` のまま。
確認: `git diff --check` と `mise run verify` が成功する。結果: 成功。
確認: Browser で desktop / mobile の重なりや横 overflow がない。結果: `/` desktop / mobile と `/demo/site-refresh` mobile で横 overflow なし。
失敗条件: OS emoji glyph に依存する、外部 asset を追加する、route / Markdown / content loader を変更する、生成物差分を残す。

## 復旧

1. SVG と順序変更だけを戻せるようにする。
2. coffee サイズが強すぎる場合は `24px` か `26px` に戻す。
3. dev server が `web/next-env.d.ts` を書き換えた場合は元に戻す。
4. 検証が環境要因で失敗した場合は原因と未検証範囲を記録する。
5. 完了後は active から completed へ移す。

## 未完了

None. PR / CI は現行の localhost UI 反復の最終 delivery で扱う。今回のユーザー指示はこの UI 調整を適宜 commit すること。

変更記録: 2026-04-26 14:51+09:00 ハリネズミ位置と coffee size 調整の ExecPlan を作成した。
変更記録: 2026-04-26 14:53+09:00 local SVG、H1 順序、coffee size、verify/browser 結果を記録した。
