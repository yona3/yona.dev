この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

名前横の mark を写真ではなく coffee と同じ方向の local SVG emoji に置き換え、下部の coffee mark を中央寄せにして上余白を少し詰める。変更後、Home は写真感を抑えた小さな遊び心を持ち、ページ下部はより軽く終わる。

## 進捗

- [x] 2026-04-26 14:39+09:00 ユーザー要望と現行実装を確認した。
- [x] 2026-04-26 14:39+09:00 ハリネズミ mark を local SVG emoji に置き換える。
- [x] 2026-04-26 14:39+09:00 footer coffee を中央寄せし、上余白を詰める。
- [x] 2026-04-26 14:39+09:00 `DESIGN.md` と検証結果を更新する。
- [x] 2026-04-26 14:39+09:00 verify / browser 確認 / commit を完了する。

## 発見

観測: 現在の名前横 mark は `web/public/icon.jpeg` を `next/image` で小さく丸く表示している。
根拠:
    `web/src/app/page.tsx`, `web/src/app/demo/site-refresh/page.tsx`。

観測: footer の coffee mark は右寄せで、`padding-top: 42px` が指定されている。
根拠:
    `web/src/components/site/site.module.css`。

観測: `git diff --check` と `mise run verify` は成功した。
根拠:
    2026-04-26 14:40+09:00 実行結果。

観測: agent-browser mobile 390px で `/` と `/demo/site-refresh` の `scrollWidth` は viewport 幅と一致し、名前横 mark は H1 の text content に含まれなかった。footer coffee の中心ずれは 0px だった。
根拠:
    2026-04-26 14:41+09:00 agent-browser eval。

## 判断

判断: ハリネズミ mark は写真ではなく local SVG component にする。
理由: ユーザーは coffee と同じ感じの絵文字を求めており、OS glyph ではなく local SVG にする方が既存 coffee の方針と揃う。
日付/担当: 2026-04-26 / Codex

判断: footer coffee は中央寄せにし、上余白を詰める。
理由: 下部の小さなサインは右寄せより中央に置いた方が終端として自然で、上余白を詰めると下部の間延びが減る。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `web/src/app/page.tsx`, `web/src/app/demo/site-refresh/page.tsx`, `web/src/components/site/site.module.css`, `web/src/app/demo/site-refresh/page.module.css`, `web/src/components/site/HedgehogEmoji.tsx`, `DESIGN.md`
依存理由: Home / demo の名前まわり、footer spacing、design guidance を揃えるため。
契約: route、content loader、Markdown renderer、frontmatter schema、Notion sync、secret / server-client boundary は変更しない。
契約: OS emoji glyph や外部画像 asset は追加しない。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo`, `web/next-env.d.ts` の生成的差分は残さない。

## 実行計画

1. ハリネズミ local SVG component を追加する。

    作業場所:
        <repo-root>
    実行:
        `HedgehogEmoji` component を作り、Home / demo の写真 mark を置き換える。
    期待結果:
        名前横に coffee と同じ方向の emoji-style mark が表示され、H1 の accessible name は増えない。

2. footer の coffee placement を調整する。

    作業場所:
        <repo-root>
    実行:
        `.footer` を中央寄せにし、`padding-top` を詰める。
    期待結果:
        coffee がページ下部中央に置かれ、上の余白が少し短くなる。

3. design guidance を更新する。

    作業場所:
        <repo-root>
    実行:
        `DESIGN.md` のハリネズミ mark 方針を写真から local SVG emoji へ更新する。
    期待結果:
        今回の判断が design contract に残る。

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
確認: 名前横の mark が写真ではなく local SVG emoji になる。
確認: mark は装飾扱いで、H1 の読み上げ名を増やさない。
確認: footer coffee が中央寄せになり、上余白が前より詰まる。
確認: `git diff --check` と `mise run verify` が成功する。結果: 成功。
確認: Browser で desktop / mobile の重なりや横 overflow がない。結果: agent-browser で `/` desktop / mobile と `/demo/site-refresh` mobile を確認し、横 overflow なし。
失敗条件: OS emoji glyph に依存する、写真 mark が残る、route / Markdown / content loader を変更する、生成物差分を残す。

## 復旧

1. SVG component と CSS の変更だけを戻せるようにする。
2. dev server が `web/next-env.d.ts` を書き換えた場合は元に戻す。
3. mark が重く見える場合は size / opacity を下げる。
4. 検証が環境要因で失敗した場合は原因と未検証範囲を記録する。
5. 完了後は active から completed へ移す。

## 未完了

None. PR / CI は現行の localhost UI 反復の最終 delivery で扱う。今回のユーザー指示はこの UI 調整を適宜 commit すること。

変更記録: 2026-04-26 14:39+09:00 ハリネズミ emoji と footer coffee 調整の ExecPlan を作成した。
変更記録: 2026-04-26 14:41+09:00 local SVG emoji、footer 中央寄せ、verify/browser 結果を記録した。
