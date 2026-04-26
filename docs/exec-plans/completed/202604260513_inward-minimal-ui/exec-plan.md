この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

刷新済み UI の方向性を保ちながら、外向けの強い見せ方を抑え、よりミニマルで内省的な雰囲気に調整する。変更後、ユーザーは `/`, `/about`, `/notes` を見たときに、大きな自己紹介ページではなく、静かな個人のノート置き場として受け取れる。

## 進捗

- [x] 2026-04-26 05:13+09:00 ユーザーの追加フィードバックを受け、現行 CSS と Home / Notes / About の構成を確認した。
- [x] 2026-04-26 05:13+09:00 typography scale、余白、border、link/button 的な装飾を抑える。
- [x] 2026-04-26 05:13+09:00 Home の見せ場感を弱め、About preview を card ではなく静かな導線にする。
- [x] 2026-04-26 05:13+09:00 `DESIGN.md` のトーンを更新し、実装と design token のズレをなくす。
- [x] 2026-04-26 05:13+09:00 `mise run verify` と browser preview で desktop/mobile を確認する。

## 発見

観測: 現行 Home は `Koh Yonamine` の hero heading が `clamp(2.4rem, 7vw, 4.75rem)` で、広い画面ではかなり大きく出る。
根拠:
    `web/src/components/site/site.module.css` の `.hero h1, .pageTitle`。

観測: Home 下部の About preview は card と絵文字 box で囲われており、ページ全体のミニマルさより「見せるための部品」感が強い。
根拠:
    `web/src/app/page.tsx` の `aside.aboutCard` と `.tableNote`。

観測: 実装では `Koh Yonamine` の display scale を `clamp(2rem, 4.8vw, 3.2rem)` に落とし、About preview の面と絵文字 box を外した。Notes label と link list も button 的な枠をやめた。
根拠:
    `web/src/components/site/site.module.css` と `web/src/app/page.tsx` の差分。

観測: mobile preview で Notes lead の日本語本文が右端で切れて見えたため、本文系の `text-wrap: pretty` を外し、`line-break: strict` と `overflow-wrap: anywhere` を明示した。display scale もさらに `clamp(1.85rem, 4vw, 2.75rem)` へ抑えた。
根拠:
    `/tmp/yona-inward-ui-preview/02-notes-mobile.png` の初回確認と `web/src/components/site/site.module.css` の差分。

観測: Chrome の `--screenshot --window-size=375,812` は小幅 viewport で crop される挙動があり、DevTools Protocol の device metrics override で再確認した。CDP では `innerWidth`, `documentElement.scrollWidth`, `body.scrollWidth` がすべて 375、`lead` は left 18 / right 357 / width 339、overflow 要素は 0 件だった。
根拠:
    `/tmp/yona-inward-ui-preview/02-notes-mobile-cdp.png` と CDP evaluation output。

観測: 最終 guard は成功し、dev server は停止済みで port 3000 の listener は残っていない。`web/next-env.d.ts` の生成的差分も残っていない。
根拠:
    `mise run verify` と `git diff --check` が成功した。`lsof -nP -iTCP:3000 -sTCP:LISTEN` は listener なしだった。

## 判断

判断: 大きな構造変更ではなく、type scale / spacing / surface treatment / copy の調整で解く。
理由: ユーザーは「全体的に大きく外れてはいない」と言っており、情報設計や Notes 方針は維持するのが適切。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `DESIGN.md`, `web/src/components/site/site.module.css`, `web/src/app/page.tsx`, `web/src/app/about/page.tsx`, `web/src/app/notes/page.tsx`
契約: microCMS / Notion sync / content loader / route contract は変更しない。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo` は編集・追跡しない。Next dev が `web/next-env.d.ts` を dev 用に書き換えた場合は生成的副作用として差分から戻す。

## 実行計画

1. CSS token と component scale を調整する。

    作業場所:
        `web/src/components/site/site.module.css`, `web/src/styles/globals.css`
    期待結果:
        heading、lead、section、note list が小さく静かになり、border と card surface が目立ちすぎない。

2. Home の About preview を静かな導線に変える。

    作業場所:
        `web/src/app/page.tsx`
    期待結果:
        card ではなく、本文に近い軽い区切りとして表示される。

3. Design document を調整する。

    作業場所:
        `DESIGN.md`
    期待結果:
        token と principles が「外向けに見せる」より「内省的に置く」方向を明示する。

4. 検証する。

    作業場所:
        `<repo-root>`
    実行:
        `git diff --check`
        `mise run verify`
        `WATCHPACK_POLLING=true mise run dev`
    期待結果:
        lint/build が成功し、desktop/mobile で header、hero、notes list が破綻しない。

## 受け入れ条件

確認: `/` の H1 と lead が前より控えめで、個人の入口として静かに見える。
確認: Home の About preview が card ではなく、ページ内の小さな手がかりとして見える。
確認: `/notes` の heading と list が archive として読みやすく、過度に強く主張しない。
確認: `mise run verify` が成功する。
失敗条件: 情報設計を変える、Notes route を壊す、microCMS / Notion sync の契約を変える、生成物を追跡対象にする。

## 復旧

1. UI 調整は CSS と copy に閉じる。
2. 合わない場合はこの ExecPlan の差分だけを戻せるようにする。
3. dev server は確認後に停止し、`web/next-env.d.ts` の生成的差分を残さない。

## 未完了

この中間 UI 調整の delivery は後続の branch-level delivery に統合した。stage / commit は後続 commit で完了し、PR / CI は最終 branch delivery の残作業として扱う。

変更記録: 2026-04-26 05:13+09:00 inward minimal UI 調整の ExecPlan を作成した。
変更記録: 2026-04-26 05:13+09:00 typography scale、Home copy、About preview、DESIGN.md token を内省的な方向へ調整した。
変更記録: 2026-04-26 05:29+09:00 verify と desktop/mobile preview を完了した。
変更記録: 2026-04-26 12:31+09:00 design review finding に従い、stage / commit / PR 未実施の停止条件を記録した。
変更記録: 2026-04-26 13:31+09:00 delivery stop を後続 branch-level delivery への統合として具体化した。
