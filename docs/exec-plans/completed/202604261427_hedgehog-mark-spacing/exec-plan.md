この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

Home の名前まわりに元の icon 写真を使った小さなハリネズミ mark を追加し、ページ下部の罫線の重なりを減らす。変更後、ユーザーは名前の横に個人的なサインを感じつつ、下部は線で閉じすぎない静かな余白として読める。

## 進捗

- [x] 2026-04-26 14:27+09:00 ユーザー要望と現行 UI / `icon.jpeg` を確認した。
- [x] 2026-04-26 14:27+09:00 Home と demo の名前まわりにハリネズミ mark を追加した。
- [x] 2026-04-26 14:29+09:00 footer と Hero / Notes 間の終端線を消し、余白で終わる形に調整した。
- [x] 2026-04-26 14:30+09:00 `DESIGN.md` と検証結果を更新した。
- [x] 2026-04-26 14:31+09:00 `git diff --check`, `mise run lint`, `mise run verify`, browser 確認を完了した。
- [x] 2026-04-26 14:31+09:00 completed へ移動し、commit 対象にした。

## 発見

観測: `web/public/icon.jpeg` は元のハリネズミ写真で、現在も OGP / Twitter image として使われている。
根拠:
    `web/public/icon.jpeg`, `web/src/app/layout.tsx`。

観測: Home の主見出しは `Koh Yonamine` の文字だけで、個人的なサインは footer の coffee mark に寄っている。
根拠:
    `web/src/app/page.tsx`, `web/src/components/site/SiteShell.tsx`。

観測: footer は上部に `border-top` を持ち、直前の Notes row / section border と合わせて下部に線が続いて見える。
根拠:
    `web/src/components/site/site.module.css`。

観測: Home の `h1` に `icon.jpeg` を decorative な `next/image` として追加し、demo も同じ構成にした。H1 の `innerText` / `textContent` は `Koh Yonamine` のままで、画像は読み上げ名に入らない。
根拠:
    `web/src/app/page.tsx`, `web/src/app/demo/site-refresh/page.tsx`, agent-browser eval output。

観測: Hero / Notes 間と footer の `border-top` を外し、余白で分ける形にした。Browser 計測では mobile viewport 390px で `documentElement.scrollWidth` と `body.scrollWidth` がともに 390、section / footer の `borderTopWidth` は `0px` だった。
根拠:
    `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`, agent-browser eval output。

観測: `git diff --check`, `mise run lint`, `mise run verify` は成功した。`mise` cache への warning は sandbox の home cache 書き込み制限で、lint/build は成功している。
根拠:
    2026-04-26 14:31+09:00 の command output。

## 判断

判断: ハリネズミは OS emoji ではなく、元の写真を小さく丸い mark として使う。
理由: ユーザーは「もともとのアイコン写真」と言っており、OS glyph より本人由来の写真を小さなサインとして使う方が人間性を出せる。
日付/担当: 2026-04-26 / Codex

判断: Hero / Notes 間と footer の終端は、罫線ではなく余白で作る。
理由: Notes list の行罫線が既に構造を作っており、section や footer の上線まで置くと線が冗長に見える。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `web/src/app/page.tsx`, `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.tsx`, `web/src/app/demo/site-refresh/page.module.css`, `DESIGN.md`
依存理由: Home / demo の名前まわり、footer spacing、design guidance をそろえるため。
契約: route、content loader、Markdown renderer、frontmatter schema、Notion sync、secret / server-client boundary は変更しない。
契約: `icon.jpeg` は既存 asset を再利用し、生成画像や新しい外部 asset は追加しない。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo`, `web/next-env.d.ts` の生成的差分は残さない。

## 実行計画

1. 名前まわりの mark を実装する。

    作業場所:
        <repo-root>
    実行:
        Home の H1 に decorative な `Image` を追加し、demo も同じ見た目にする。
    期待結果:
        見出しの accessible name は `Koh Yonamine` のまま、視覚的には小さなハリネズミ mark が横に出る。

2. 下部の線と余白を調整する。

    作業場所:
        <repo-root>
    実行:
        Hero / Notes 間と footer の `border-top` を外し、padding だけで区切る。
    期待結果:
        罫線が重ならず、余白で静かに区切られる。

3. design guidance を更新する。

    作業場所:
        <repo-root>
    実行:
        `DESIGN.md` にハリネズミ写真 mark と終端線の扱いを追記する。
    期待結果:
        今回の UI 判断が design contract に残る。

4. 検証する。

    作業場所:
        <repo-root>
    実行:
        `git diff --check`
        `mise run verify`
        browser preview
    期待結果:
        lint/build が成功し、Home / demo の mark と footer spacing が破綻しない。

5. 完了処理を行う。

    作業場所:
        <repo-root>
    実行:
        completed へ移動し、commit skill で論理単位の commit を作る。
    期待結果:
        active に完了済み ExecPlan が残らず、commit history に反映される。

## 受け入れ条件

入力: `http://localhost:3000/`, `http://localhost:3000/demo/site-refresh`
確認: Home の名前横にハリネズミ mark が表示される。
確認: mark は装飾扱いで、H1 の読み上げ名を増やさない。
確認: footer の上線が消え、下部が余白で終わる。
確認: `git diff --check` と `mise run verify` が成功する。
確認: Browser で desktop / mobile の重なりや横 overflow がない。
失敗条件: OS emoji glyph に依存する、写真が大きくなりすぎる、route / Markdown / content loader を変更する、生成物差分を残す。

## 復旧

1. mark と footer spacing の CSS だけを戻せるようにする。
2. dev server が `web/next-env.d.ts` を書き換えた場合は元に戻す。
3. 画像が重く見える場合は mark を削るか opacity / size を下げる。
4. 検証が環境要因で失敗した場合は原因と未検証範囲を記録する。
5. 完了後は active から completed へ移す。

## 未完了

PR / CI は最終 branch delivery の残作業として扱う。

変更記録: 2026-04-26 14:27+09:00 ハリネズミ mark と footer spacing 調整の ExecPlan を作成した。
変更記録: 2026-04-26 14:31+09:00 ハリネズミ mark、線の削減、DESIGN.md、verify / browser 確認結果を記録した。
変更記録: 2026-04-26 14:31+09:00 ExecPlan directory を completed へ移した。
