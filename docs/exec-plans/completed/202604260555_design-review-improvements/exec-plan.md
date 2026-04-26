この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

Home / Notes / About の UI を、直前のデザインレビューで出した 4 観点に沿って改善する。初見で「誰の何を読む場所か」が伝わり、Home と Notes の役割が分かれ、内省的でミニマルな雰囲気を保ったまま、キーボード操作と文字組みの品質を上げる。

## 進捗

- [x] 2026-04-26 05:55+09:00 ユーザーの改善依頼を確認した。
- [x] 2026-04-26 06:01+09:00 Home の入口設計と導線を改善する。
- [x] 2026-04-26 06:01+09:00 Notes / About の文言と役割を整理する。
- [x] 2026-04-26 06:01+09:00 focus state、文字組み、coffee mark の小さな相互作用を改善する。
- [x] 2026-04-26 06:06+09:00 verify と browser preview を確認する。

## 発見

観測: Home は名前、紹介文、最近の Notes だけで構成されており、初回訪問者が次に読むべき固定の入口がない。
根拠:
    `web/src/app/page.tsx`。

観測: Home と Notes はどちらも説明文と Notes 一覧で構成され、役割差が薄い。
根拠:
    `web/src/app/page.tsx`, `web/src/app/notes/page.tsx`。

観測: link hover はあるが `:focus-visible` が定義されていない。
根拠:
    `web/src/components/site/site.module.css`。

観測: `word-break: break-all` が本文やタイトルに複数箇所で指定されており、英単語や `AI Agent` の分割で活字感を損ねる可能性がある。
根拠:
    `web/src/components/site/site.module.css`。

観測: 実装では Home に About への固定導線を 1 つだけ足し、`最近` / `すべて` / `書いている人` の補助ラベルへ変更した。
根拠:
    `web/src/app/page.tsx`, `web/src/app/notes/page.tsx`, `web/src/app/about/page.tsx` の差分。

観測: 実装では link focus、`text-wrap: pretty`、`word-break: break-all` の削除、coffee mark link の hover / focus state と reduced motion 対応を追加した。
根拠:
    `web/src/components/site/SiteShell.tsx`, `web/src/components/site/site.module.css` の差分。

観測: `mise run verify` は成功した。browser preview では desktop / mobile とも document width と viewport width が一致した。Home は `はじめに` と `最近` を表示し、Notes は `すべて`、About は `書いている人` を表示した。coffee emoji は 0 件だった。Tab 操作では link focus が `:focus-visible` に一致し、outline が `solid 1px` で表示された。
根拠:
    2026-04-26 の `mise run verify` 実行結果、`/tmp/yona-design-improve-preview-final/*.png`、Chrome DevTools Protocol の keyboard Tab 検証結果。

## 判断

判断: 新しい装飾やカードを足すより、Home に小さな固定導線を 1 つだけ足し、focus と文字組みを整える。
理由: ユーザーはミニマルで内向きの雰囲気を求めており、情報量や外向け感を増やす改善は逆方向になる。導線は一つに絞り、罫線と余白で構造を作る。
日付/担当: 2026-04-26 / Codex

判断: stage / commit / PR 作成は未実施として記録し、UI 反復が落ち着くまで保留する。
理由: ExecPlan skill の既定範囲には stage / commit / PR が含まれる。一方で、直前の流れではユーザーが画面改善を反復依頼しており、未確定の UI 反復中に履歴を固めるとレビュー対象が不安定になるため、未完了として明示する。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `web/src/app/page.tsx`, `web/src/app/notes/page.tsx`, `web/src/app/about/page.tsx`, `web/src/components/site/SiteShell.tsx`, `web/src/components/site/site.module.css`, `web/src/styles/globals.css`, `DESIGN.md`
依存理由: Home / Notes / About の情報設計、共通 shell の micro interaction、全体の visual token を調整するため。
契約: `/`, `/about`, `/notes`, `/notes/[slug]`, `/blog` redirect、content loader、Markdown renderer、frontmatter schema は変更しない。
契約: OS 絵文字依存を戻さない。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo` は編集・追跡しない。Next dev が `web/next-env.d.ts` を dev 用に書き換えた場合は差分から戻す。

## 実行計画

1. Home の入口を改善する。

    作業場所:
        `web/src/app/page.tsx`
    実行:
        Home の紹介文を少し具体化し、固定導線を 1 つだけ追加する。
    期待結果:
        初見で「ソフトウェア、AI Agent、小さな道具、日々の考えを読む場所」だと伝わり、最近の一覧以外にも自然な入口がある。

2. Notes / About の役割差を明確にする。

    作業場所:
        `web/src/app/notes/page.tsx`, `web/src/app/about/page.tsx`
    実行:
        `recent` / `archive` などの補助ラベルと説明文を、内省的で日本語中心の語調に合わせて調整する。
    期待結果:
        Home は入口、Notes は蓄積、About は書いている人、という役割が読み取れる。

3. Visual / interaction の品質を上げる。

    作業場所:
        `web/src/components/site/SiteShell.tsx`, `web/src/components/site/site.module.css`, `web/src/styles/globals.css`
    実行:
        `:focus-visible`、`text-wrap: pretty`、`word-break` の調整、coffee mark の控えめな hover / focus interaction を追加する。
    期待結果:
        キーボード操作時の位置が見え、英語混じりの日本語が不自然に割れにくくなり、遊び心は隠し味の範囲に留まる。

4. Design document を更新する。

    作業場所:
        `DESIGN.md`
    実行:
        Home の固定導線、focus state、文字組みの方針を追記する。
    期待結果:
        実装した判断が design contract に残る。

5. 検証する。

    作業場所:
        `<repo-root>`
    実行:
        `git diff --check`
        `mise run verify`
        browser preview
    期待結果:
        lint/build が成功し、desktop/mobile で overflow と視覚破綻がない。

## 受け入れ条件

入力: `http://localhost:3000/`, `http://localhost:3000/notes`, `http://localhost:3000/about`
確認: Home に固定導線が 1 つだけ追加され、Notes 一覧との重複感が減った。
確認: `recent` / `archive` を使わず、`最近` / `すべて` / `書いている人` に整理した。
確認: link / nav / coffee mark に `:focus-visible` 対応を追加し、Tab 操作で outline 表示を確認した。
確認: `AI Agent` などの英語混じりテキストに対し、通常本文から `word-break: break-all` を外した。
確認: `git diff --check` と `mise run verify` が成功した。
失敗条件: Home がランディングページ風に外向きになる、カードや説明が増えすぎる、OS emoji 依存を戻す、route / content loader / Markdown renderer を変更する。

## 復旧

1. 変更は UI copy、CSS、共通 shell に閉じる。
2. 合わない場合はこの ExecPlan の差分だけを戻せる。
3. route、content loader、Markdown renderer には触れない。
4. dev server を維持する場合でも `web/next-env.d.ts` の生成的差分は残さない。
5. 完了後は active から completed へ移す。

## 未完了

stage / commit / PR 作成は未実施。UI 反復中のため、ユーザーが履歴固定を承認するまで保留。

変更記録: 2026-04-26 05:55+09:00 design review improvements の ExecPlan を作成した。
変更記録: 2026-04-26 06:01+09:00 review findings に沿って Home entry、補助ラベル、focus、文字組み、coffee interaction を実装した。
変更記録: 2026-04-26 06:06+09:00 verify と browser preview の結果を反映した。
変更記録: 2026-04-26 06:20+09:00 design review fix loop で stage / commit / PR 未実施の記録を契約に合わせて更新した。
