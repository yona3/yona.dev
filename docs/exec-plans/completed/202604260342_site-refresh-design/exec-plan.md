この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

`DESIGN.md` と `docs/site-refresh.md` を追加し、yona.dev 刷新の初期方針を実装前に固定する。ユーザーが後続実装で参照できるように、コンセプト、デザイントークン、情報設計、Notion 同期方針、未決事項を明文化する。

## 進捗

- [x] 2026-04-26 03:42+09:00 ユーザーインタビューからデザイン方向、投稿統合、Notion 運用方針を整理した。
- [x] 2026-04-26 03:42+09:00 `DESIGN.md` と `docs/site-refresh.md` を追加する。
- [x] 2026-04-26 03:42+09:00 docs-only 範囲で検証し、完了済み ExecPlan を `completed` に移す。

## 発見

観測: root に `DESIGN.md` は存在せず、`docs/exec-plans/active/` には `.gitkeep` だけがある。
根拠:
    `rg --files -g 'DESIGN.md' -g 'docs/**'` と `find docs -maxdepth 3 -type d | sort` で確認した。

観測: Google Labs の DESIGN.md は YAML front matter の design tokens と Markdown prose を組み合わせる alpha 形式である。
根拠:
    https://github.com/google-labs-code/design.md の README に token schema と section order が示されている。

観測: docs-only 検証で trailing whitespace は見つからず、`web/` 配下の変更もなかった。
根拠:
    `rg -n "[[:blank:]]$" DESIGN.md docs/site-refresh.md docs/exec-plans/active/202604260342_site-refresh-design/exec-plan.md` は match なしで終了した。
    `git status --short web` は出力なしで終了した。

## 判断

判断: 今回は実装、stage、commit、PR 作成を行わず、docs-only の draft 作成で止める。
理由: ユーザーが「実装なしで、まず `DESIGN.md` と `docs` 配下の設計メモだけ作る」ことを承認したため。ExecPlan skill の既定範囲より、最新ユーザー指示の scope 制限を優先する。
日付/担当: 2026-04-26 / Codex

判断: 投稿種別の draft は `記事` / `ノート` / `記録` とし、内部 enum は `article` / `note` / `log` にする。
理由: `断片` はユーザーに聞き馴染みが薄く、表示は日本語中心、内部は安定した英語値にする方針に合うため。
日付/担当: 2026-04-26 / Codex

## 契約

依存: `AGENTS.md`, `PLANS.md`, `docs/conventions.md`, `DESIGN.md`, `docs/site-refresh.md`
依存理由: repo の docs-only 作業境界、ExecPlan schema、デザイン方針、後続実装の参照先を守るため。
契約: `web/` のアプリ実装、microCMS 関連コード、route、package manager、生成物は変更しない。
契約: Notion は公開 runtime が直接読む CMS ではなく、執筆元として使い、repo 側の Markdown/MDX + frontmatter を公開正本にする。

## 実行計画

1. `DESIGN.md` を追加する。

    作業場所:
        <repo-root>
    実行:
        Bookish Warm Minimal の design tokens と rationale を作成する。
    期待結果:
        後続 agent が色、タイポグラフィ、余白、形状、コンポーネント方針を同じ前提で実装できる。

2. `docs/site-refresh.md` を追加する。

    作業場所:
        <repo-root>
    実行:
        コンセプト、情報設計、投稿モデル、Notion 同期方針、未決事項を書く。
    期待結果:
        Home / About / Notes と `/notes` を中心にした実装前の設計メモができる。

3. docs-only 検証を行い、ExecPlan を完了へ移す。

    作業場所:
        <repo-root>
    実行:
        git diff --check
        mv docs/exec-plans/active/202604260342_site-refresh-design docs/exec-plans/completed/202604260342_site-refresh-design
    期待結果:
        whitespace error がなく、完了済み plan が active に残らない。

## 受け入れ条件

入力: ユーザーインタビューで確定した方向性。
確認: `DESIGN.md` に design.md 形式の YAML front matter と Markdown rationale を追加した。
確認: `docs/site-refresh.md` に Home / About / Notes、投稿種別、Notion 同期方針、未決事項を追加した。
確認: `git status --short web` が出力なしで、`web/` 配下の実装ファイルは変更されていない。
失敗条件: 実装ファイル、依存関係、root package 管理、microCMS 境界に変更が入る。

## 復旧

1. 追加した docs は additive なので、不要なら該当ファイルを削除すれば復旧できる。
2. 失敗時は `失敗条件:` を読んで docs-only scope に戻す。
3. migration や生成物は作らない。
4. 後続実装はこの design draft を読み、必要に応じて別 ExecPlan で扱う。
5. 完了後に temporary file、dev server、生成物を残さない。

## 未完了

None.

変更記録: 2026-04-26 03:42+09:00 docs-only refresh design draft の ExecPlan を作成した。
変更記録: 2026-04-26 03:42+09:00 `DESIGN.md` と `docs/site-refresh.md` を追加し、docs-only 検証結果を反映した。
