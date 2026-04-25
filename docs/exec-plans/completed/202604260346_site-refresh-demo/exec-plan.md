この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

`DESIGN.md` と `docs/site-refresh.md` の方向性を、既存サイトを置き換えずに確認できる簡単な UI デモとして実装する。新しい isolated route `/demo/site-refresh` を追加し、Bookish Warm Minimal の色、serif typography、Home / About / Notes の情報設計、日付順 feed の雰囲気をブラウザで見られる状態にする。

## 進捗

- [x] 2026-04-26 03:46+09:00 既存 App Router、global CSS、package scripts、デザイン文書を確認した。
- [x] 2026-04-26 03:46+09:00 `/demo/site-refresh` の静的デモ画面を追加する。
- [x] 2026-04-26 03:46+09:00 lint / verify とローカル表示確認を行う。
- [x] 2026-04-26 03:46+09:00 完了済み ExecPlan を `completed` に移す。

## 発見

観測: 既存 root layout は `Noto_Sans_JP` を html class に適用しており、global CSS は Tailwind import と `--font-noto` だけを定義している。
根拠:
    `web/src/app/layout.tsx` と `web/src/styles/globals.css` を確認した。

観測: `DESIGN.md` は serif 主体、薄いベージュ背景、細い罫線、日付順 Notes feed、`記事` / `ノート` / `記録` の種別ラベルを指定している。
根拠:
    `DESIGN.md` と `docs/site-refresh.md` を確認した。

観測: `mise run lint` は成功した。
根拠:
    `mise run lint` が exit code 0 で終了した。

観測: `mise run verify` は build 中の `/blog` page data collection で失敗した。
根拠:
    `mise run verify` の build step が `MICROCMS_API_KEY is not set` により `Failed to collect page data for /blog` で exit code 1 になった。

観測: `mise run dev` は通常 watcher だと EMFILE 後に dev manifest が `_not-found` だけになり、全 route が 404 になった。`WATCHPACK_POLLING=true mise run dev` では `/demo/site-refresh` が HTTP 200 を返した。
根拠:
    `curl -I --max-time 20 http://localhost:3000/demo/site-refresh` が `HTTP/1.1 200 OK` を返した。

## 判断

判断: 本番 `/` や `/notes` ではなく、`/demo/site-refresh` に isolated demo route を作る。
理由: ユーザーは「簡単にデモ」を求めており、現時点ではデザイン確認が目的である。既存 `/blog`、microCMS、metadata、ISR への user-visible 影響を避ける。
日付/担当: 2026-04-26 / Codex

判断: stage / commit / PR は行わず、ローカルデモと検証結果までで止める。
理由: 今回はプロトタイプ確認のためのデモで、ユーザーがまだ最終デザインや本番反映を承認していない。PR 化はデモ確認後の次 task に分ける方が review しやすい。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `DESIGN.md`, `docs/site-refresh.md`, `web/src/app/demo/site-refresh/page.tsx`, `web/src/app/demo/site-refresh/page.module.css`
依存理由: デザイン方針を UI に写しつつ、本番 route から隔離して確認するため。
契約: 既存 `/`, `/blog`, `/blog/[articleId]`, microCMS client、sanitize / highlight pipeline、package files は変更しない。
契約: JavaScript interaction は入れず、静的な server component と CSS Modules で作る。
契約: デモ route は本番採用前の見本であり、Notion sync や Markdown loader は実装しない。

## 実行計画

1. `web/src/app/demo/site-refresh/page.tsx` と `page.module.css` を追加する。

    作業場所:
        <repo-root>
    実行:
        `DESIGN.md` の token と `docs/site-refresh.md` の情報設計を静的 HTML/CSS に落とす。
    期待結果:
        `/demo/site-refresh` で Bookish Warm Minimal の Home demo を確認できる。

2. UI とコードの最小検証を行う。

    作業場所:
        <repo-root>
    実行:
        mise run lint
        mise run verify
    期待結果:
        lint と verify が通る。環境要因で失敗した場合は原因と未検証範囲を記録する。

3. ローカル dev server を起動して demo route を確認する。

    作業場所:
        <repo-root>
    実行:
        mise run dev
    期待結果:
        `http://localhost:3000/demo/site-refresh` でデモを見られる。

4. 完了条件を満たしたら、この ExecPlan directory を completed へ移す。

    作業場所:
        <repo-root>
    実行:
        mv docs/exec-plans/active/202604260346_site-refresh-demo docs/exec-plans/completed/202604260346_site-refresh-demo
    期待結果:
        完了済みの ExecPlan が active に残らない。

## 受け入れ条件

入力: `DESIGN.md` と `docs/site-refresh.md` のデザイン方針。
確認: `/demo/site-refresh` が静的に描画され、Home / About / Notes と日付順 feed の雰囲気を見られる。`curl -I --max-time 20 http://localhost:3000/demo/site-refresh` は `HTTP/1.1 200 OK`。
確認: `web/` の既存 route と microCMS 境界を変更しない。
確認: `mise run lint` は成功した。
確認: `mise run verify` は既存 `/blog` の `MICROCMS_API_KEY` 未設定で失敗した。今回の `/demo/site-refresh` 差分は dev server で HTTP 200 を確認した。
失敗条件: 本番 route、microCMS 境界、依存関係、root package 管理に変更が入る。

## 復旧

1. 追加 route は additive なので、不要なら `web/src/app/demo/site-refresh/` を削除すれば復旧できる。
2. 失敗時は `失敗条件:` を読んで isolated demo scope に戻す。
3. migration、外部 service、生成物は使わない。
4. 本番反映は別 task で扱う。
5. 完了後に temporary file を残さず、dev server 状態を最終報告に明示する。

## 未完了

None.

変更記録: 2026-04-26 03:46+09:00 site refresh demo の ExecPlan を作成した。
変更記録: 2026-04-26 03:46+09:00 `/demo/site-refresh` を追加し、lint と dev server 表示確認の結果を反映した。
