# Agent 指示

このファイルは agent 行動契約の正本です。`README.md` は人間向け説明として読み、
行動契約としては扱いません。`CLAUDE.md` はこのファイルだけを参照します。

## 優先順位

1. ユーザーの最新指示
2. `AGENTS.md`
3. `docs/conventions.md`
4. `README.md` / 既存コード

矛盾したら高い優先順位を採用し、混ぜずに必要最小限だけ確認します。

## 作業境界

- アプリ本体は `web/` です。
- root は agent 契約、README、mise タスク、共有ドキュメントの置き場です。
- アプリ作業は原則 `web/` で実行します。root タスクを使う時だけ root で実行します。

## コマンド

root の `mise` タスクを正本にします。

- 依存導入: `mise run install`
- 開発: `mise run dev`
- lint: `mise run lint`
- build: `mise run build`
- format: `mise run format`
- 最終検証: `mise run verify`

`mise run verify` が唯一の hard guard です。別の `verify.sh` や独自 pipeline を増やしません。

## Superpowers

新規作業の開発フローは Superpowers plugin を主経路にします。

- 作業開始時は `superpowers:using-superpowers` で該当 skill を確認します。
- 方針整理が必要な時は `superpowers:brainstorming` を使い、必要なら `docs/superpowers/specs/` に設計を残します。
- 複数手順の実装は `superpowers:writing-plans` を使い、必要なら `docs/superpowers/plans/` に計画を残します。
- 実装はユーザーが選んだ方式に合わせて `superpowers:executing-plans` または `superpowers:subagent-driven-development` で進めます。
- 完了主張、commit、PR 作成の前に `superpowers:verification-before-completion` を使い、`mise run verify` を再実行します。
- review が必要な変更では project-local `review` skill を使います。結果は固定の review 出力ファイルではなく、関連する Superpowers spec / plan または最終報告に残します。

旧 ExecPlan は履歴です。`docs/exec-plans/completed/` と `docs/exec-plans/archived-active/` は過去判断の確認に限って参照し、新規作業の計画や完了判定の正本にしません。

## 確認基準

必ず確認: 解釈差で実装が変わる、破壊的変更、secret/security/auth/server-client 境界への影響、
対象 file / module / route を具体化できない。

必要なら確認: 5 ファイル以上に跨る、UI/UX tradeoff がある、既存 pattern と違う、
完了条件が主観的。

確認不要: 明確な小変更、read-only 調査、再現条件が明確な bug fix、lint/type/format の機械修正。

## 禁止境界

- Notion token や外部 API key を `NEXT_PUBLIC_*`、client component、log、HTML に出さない。
- 公開コンテンツの正本は `web/content/notes/*.md`。Notion は執筆元であり、公開 runtime から直接読まない。
- `dangerouslySetInnerHTML` は原則使わない。使う場合は sanitize 済み content と明示し、security-sensitive として扱う。
- Notes Markdown renderer の対応 syntax、frontmatter schema、slug 生成規則を暗黙に変えない。
- `/notes`、`/notes/[slug]`、`/blog` redirect、metadata の変更は user-visible 影響として扱う。
- root `package.json` / `yarn.lock` を復活させない。依存管理は `web/` の `pnpm`。
- `.next/`、`node_modules/`、`.pnpm-store/`、`tsconfig.tsbuildinfo` など生成物を編集・追跡しない。

## 参照先

- 詳細規約、分割基準、レビュー観点: `docs/conventions.md`
- テスト規約 / TDD 方針: `docs/conventions.md` の Testing / TDD policy
- Superpowers 設計 / 計画: `docs/superpowers/specs/`, `docs/superpowers/plans/`
  該当 task の spec / plan がある場合だけ参照します。
- 旧 ExecPlan 履歴: `PLANS.md`, `docs/exec-plans/`
- 人間向け説明: `README.md`

## 検証と報告

意味のあるコード変更後は `mise run verify` を実行します。環境変数不足などで失敗した場合は、
失敗コマンド、原因、未検証範囲を報告します。stage / commit は依頼された時だけ行います。
ただし Superpowers plan で実行する task では、ユーザーが明示的に除外しない限り、
stage / commit / PR 作成 / CI fix までを既定の自律実行範囲に含めます。
commit は `commit` skill を入口にして、戻しやすい論理単位で作成します。
review は `mise run verify` の代替ではありません。`mise run verify` を deterministic
hard guard として実行し、別に `review` skill の verdict を記録します。
PR 作成・更新は `pr-writer` skill を入口にします。`gh pr create` / `gh pr edit`、GitHub connector、
その他の PR 作成・更新 API を `pr-writer` の Phase 6 以外から直接実行しません。
