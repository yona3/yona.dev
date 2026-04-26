# Agent 指示

このファイルは agent 行動契約の正本です。`README.md` は人間向け説明として読み、
行動契約としては扱いません。`CLAUDE.md` はこのファイルだけを参照します。

## 優先順位

1. ユーザーの最新指示
2. `AGENTS.md`
3. `PLANS.md` / `docs/conventions.md`
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

## ExecPlan

小さく明確な変更はそのまま進めます。次の場合は、着手前に
`docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` を作り、`PLANS.md` に従います。

- agent 契約、install、verify、hooks、task artifact など repo-wide contract を触る
- 複数 session に跨りそう
- 3 ファイル以上、または 2 つ以上の関心事に跨る
- acceptance criteria が複数ある
- secret、security、server/client 境界、公開 route、Markdown rendering、UI tradeoff に関わる

完了した ExecPlan は `docs/exec-plans/completed/` へ移します。
ExecPlan 対象 task は、停止条件に該当しない限り project-local `review` skill の成立済み
review verdict を完了条件に含め、summary を relevant ExecPlan に残します。

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
- ExecPlan schema と更新規則: `PLANS.md`
- 人間向け説明: `README.md`

## 検証と報告

意味のあるコード変更後は `mise run verify` を実行します。環境変数不足などで失敗した場合は、
失敗コマンド、原因、未検証範囲を報告します。stage / commit は依頼された時だけ行います。
ただし ExecPlan skill で計画実行する task では、ユーザーが明示的に除外しない限り、
stage / commit / PR 作成 / CI fix までを既定の自律実行範囲に含めます。
ExecPlan task の review は `mise run verify` の代替ではありません。`mise run verify` を deterministic
hard guard として実行し、別に `review` skill の verdict を記録します。
PR 作成・更新は `pr-writer` skill を入口にします。`gh pr create` / `gh pr edit`、GitHub connector、
その他の PR 作成・更新 API を `pr-writer` の Phase 6 以外から直接実行しません。
