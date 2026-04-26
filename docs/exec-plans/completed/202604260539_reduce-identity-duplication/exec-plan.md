この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

Home と共通 shell の情報重複を減らし、`Koh Yonamine` が名前であることを自然に伝える。OS 絵文字そのままの coffee 表示をやめ、よりミニマルで内省的な UI に寄せる。

## 進捗

- [x] 2026-04-26 05:39+09:00 ユーザーの追加フィードバックを確認した。
- [x] 2026-04-26 05:39+09:00 Header / Footer / Home の重複表示を減らす。
- [x] 2026-04-26 05:39+09:00 Home / About の紹介文を具体化する。
- [x] 2026-04-26 05:39+09:00 OS 絵文字の coffee 表示をやめる。
- [x] 2026-04-26 05:52+09:00 verify と browser preview を確認する。

## 発見

観測: `Koh Yonamine` は header brand、Home H1、footer、About H1 など複数箇所に表示されている。
根拠:
    `web/src/components/site/SiteShell.tsx`, `web/src/app/page.tsx`, `web/src/app/about/page.tsx`。

観測: Home の `personal notes` はラベルとして情報量が薄く、ユーザーの意図に対して不要に見える。
根拠:
    `web/src/app/page.tsx` の hero kicker。

観測: coffee は `☕` 文字で表示されており、OS の絵文字表示に依存している。
根拠:
    `web/src/components/site/SiteShell.tsx` の footer。

観測: 実装では header brand を `yona.dev` に変更し、footer の名前表示を削除した。Home の `personal notes` と About preview も削除し、名前の可視表示は Home H1 に絞った。
根拠:
    `web/src/components/site/SiteShell.tsx` と `web/src/app/page.tsx` の差分。

観測: coffee は CSS の線画 mark と favicon 用 inline SVG に置き換え、OS emoji / Twemoji 依存を外した。
根拠:
    `web/src/components/site/site.module.css`, `web/src/app/layout.tsx`, `web/src/app/demo/site-refresh/page.tsx` の差分。

観測: `mise run verify` は成功した。CDP preview では Home の可視テキスト上の `Koh Yonamine` は 1 回、coffee emoji は 0 回だった。desktop / mobile とも document width と viewport width が一致した。
根拠:
    2026-04-26 の `mise run verify` 実行結果と、`/tmp/yona-dedupe-ui-preview/01-home-desktop.png`, `/tmp/yona-dedupe-ui-preview/02-home-mobile.png`。

観測: Notes / About の metadata description からも不要な名前の反復を削った。
根拠:
    `web/src/app/notes/page.tsx`, `web/src/app/about/page.tsx` の差分。

## 判断

判断: Header は site 名、Home は本人名、Footer は小さな CSS mark に役割を分ける。
理由: 同じ名前を繰り返さず、名前と site の役割を分離できる。coffee は絵文字ではなく CSS の線画にする。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `web/src/components/site/SiteShell.tsx`, `web/src/app/page.tsx`, `web/src/app/about/page.tsx`, `web/src/components/site/site.module.css`, `DESIGN.md`
契約: route、content loader、microCMS / Notion sync の契約は変更しない。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo` は編集・追跡しない。Next dev が `web/next-env.d.ts` を dev 用に書き換えた場合は生成的副作用として差分から戻す。

## 実行計画

1. Header / Footer の役割を整理する。

    作業場所:
        `web/src/components/site/SiteShell.tsx`, `web/src/components/site/site.module.css`
    期待結果:
        Header は `yona.dev`、Footer は OS 絵文字ではない小さな mark になり、名前の反復が減る。

2. Home / About copy を具体化する。

    作業場所:
        `web/src/app/page.tsx`, `web/src/app/about/page.tsx`
    期待結果:
        Koh Yonamine が人名であることと、AI Agent 開発、小さな道具、日々の考えを書く場所であることが伝わる。

3. Design document を更新する。

    作業場所:
        `DESIGN.md`
    期待結果:
        反復削減と custom mark 方針が design contract に残る。

4. 検証する。

    作業場所:
        `<repo-root>`
    実行:
        `git diff --check`
        `mise run verify`
    期待結果:
        lint/build が成功し、dev preview で重複が減っている。

## 受け入れ条件

確認: Home の `Koh Yonamine` 表示は主見出しに絞られ、header / footer では繰り返さない。
確認: `personal notes` は Home からなくなる。
確認: 紹介文が「何を書いている人か」を具体的に伝える。
確認: coffee は OS 絵文字そのままでは表示されない。
確認: `mise run verify` が成功する。
失敗条件: route や content loader を変更する、生成物を追跡対象にする、説明を増やしすぎて情報量が重くなる。

## 復旧

1. 変更は shell/copy/CSS に閉じる。
2. 合わない場合はこの ExecPlan の差分だけを戻せるようにする。
3. dev server を維持する場合でも `web/next-env.d.ts` の生成的差分は残さない。

## 未完了

この中間 UI 調整の delivery は後続の branch-level delivery に統合した。stage / commit は後続 commit で完了し、PR / CI は最終 branch delivery の残作業として扱う。

変更記録: 2026-04-26 05:39+09:00 reduce identity duplication の ExecPlan を作成した。
変更記録: 2026-04-26 05:45+09:00 header/footer/home の重複、紹介文、coffee 表示を修正した。
変更記録: 2026-04-26 05:52+09:00 verify と desktop/mobile preview を確認した。
変更記録: 2026-04-26 05:55+09:00 metadata description の名前反復を削り、`mise run verify` を再実行した。
変更記録: 2026-04-26 12:31+09:00 design review finding に従い、stage / commit / PR 未実施の停止条件を記録した。
変更記録: 2026-04-26 13:31+09:00 delivery stop を後続 branch-level delivery への統合として具体化した。
