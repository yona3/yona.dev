# リポジトリ規約

この文書は、この repo 固有の運用規約です。Hot 層の正本は `AGENTS.md`、Superpowers の開発方法は plugin 側、Superpowers の repo-local 出力は `docs/superpowers/`、人間向け説明は `README.md` です。

## SSoT

- agent 行動契約: `AGENTS.md`
- Superpowers の開発方法: Superpowers plugin
- Superpowers の repo-local 出力: `docs/superpowers/{specs,plans}/`
- 旧 ExecPlan 履歴: `PLANS.md`, `docs/exec-plans/{completed,archived-active}/`
- 詳細規約: `docs/conventions.md`
- 人間向け overview: `README.md`
- アプリコード: `web/`
- hard guard: `mise run verify`

hidden runtime、pipeline directory、別形式の task artifact は増やしません。

## CE 方針

- Hot: すべての session で必要な制約だけを `AGENTS.md` に置く。
- Warm: repo 固有の詳細規約はこの file に置く。
- Cold: タスク固有の手順、発見、判断、evidence は必要に応じて Superpowers spec / plan に置く。
- README は人間が読む背景情報であり、agent の SSoT にしない。
- 同じ規約を複数 file に長文で重複させない。必要なら参照先だけを書く。
- Superpowers plugin の個別 skill 名、起動条件、内部手順は repo 側で重複定義しない。repo 側には保存先、hard guard、review、commit、PR gate だけを書く。
- lint で機械検出できる規約は、説明を最小限にし、詳細は設定 file を正本にする。
- Superpowers plan を使う task は、ユーザーが明示的に除外しない限り stage / commit、PR 作成、CI fix までを既定の実行範囲に含める。
- commit は `commit` skill を入口にし、戻しやすい論理単位で作成する。`git commit` / `git commit --amend` を先に実行して message だけ後から合わせない。
- review が必要な task は、`mise run verify` による deterministic verification と project-local `review` skill の成立済み review verdict を分けて扱う。
- PR 作成・更新は `pr-writer` skill を入口にする。`pr-writer` の Phase 6 以外で `gh pr create` / `gh pr edit`、GitHub connector、その他の PR 作成・更新 API を直接呼ばない。

## ガードレール

### 秘密情報と外部 service

- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` は現在文書化されている唯一の public runtime env。
- Notion token や外部 API key は server-only。公開 runtime から Notion API を直接読まない。
- secret を log、metadata、client component、HTML に出さない。

### Notes content safety（投稿 Markdown の安全性）

- 公開コンテンツの正本は `web/content/notes/*.md`。
- frontmatter は `title`, `slug`, `date`, `type`, `description`, `published` を基本 schema とする。
- `type` は `article`, `note`, `log` のいずれか。表示は `記事`, `ノート`, `記録`。
- 本文先頭の `# {title}` は page title と重複するため、loader で本文から除外する。
- Markdown renderer は HTML を直接挿入しない。`dangerouslySetInnerHTML` を使う変更は
  security-sensitive として最終報告で明示する。
- Notion sync は repo 内 Markdown を生成する境界に閉じる。公開 page は repo 内 content を読む。

### Content management 方針

- 公開 runtime は `web/content/notes/*.md` のみを読む。microCMS / 外部 CMS への runtime 依存は無い (`web/src/lib/microcms.ts`、microcms 関連 env、microcms-js-sdk は撤去済)。
- `/blog` と `/blog/[articleId]` は `/notes` への redirect だけを残し、旧記事 URL の互換を保つ。撤去や redirect map の更新は user-visible 影響として扱い、別の Superpowers spec / plan で判断する。
- Notion を執筆元として使う場合は、次のいずれかに限定する。runtime から Notion API を直接読む構成は採用しない。
    - 手動同期: 執筆者が Notion 上で書いた内容を `web/content/notes/*.md` へ手で move する。
    - build 前同期: build 前に Notion API を読む sync script を実行し、生成された Markdown を repo に commit する。Notion token は CI / local の server-only env として扱い、`NEXT_PUBLIC_*` や client component、log、HTML に出さない。
- いずれの方式でも、上記 Notes content safety の frontmatter schema と loader 側の `# {title}` 除去を維持する。

### Routing / ISR / metadata

- `/`, `/about`, `/notes`, `/notes/[slug]` は user-visible route として扱う。
- `/blog` と `/blog/[articleId]` は `/notes` への移行導線として扱う。
- Open Graph、Twitter metadata、canonical URL は user-visible behavior として扱う。

### Workspace 境界

- root の task runner は `mise.toml`。
- app 依存管理は `web/` の `pnpm`。
- root `package.json` と `yarn.lock` は復活させない。
- `.next/`、`node_modules/`、`.pnpm-store/`、coverage、`tsconfig.tsbuildinfo` は生成物として追跡しない。

### Project-local skills

- project-local skill の正本は `docs/skills/`。
- Codex 向けの `.codex/skills/*` と Claude Code 向けの `.claude/skills/*` は `docs/skills/*` への symlink にする。
- runtime ごとの違いは copy を分けず、対象 skill 本体の条件分岐として書く。

### Local self review loop

- `mise run verify` は唯一の hard guard として維持し、review はその代替にしない。
- Superpowers plan 対象 task では、停止条件に該当しない限り `docs/skills/review/SKILL.md` の成立済み review verdict を完了条件に含める。
- review gate の evidence は新しい固定 artifact ではなく、関連する Superpowers spec / plan または最終報告に残す。
- 記録する summary は reviewer ids、verdict、未解決 finding、未検証範囲、実行した verification command を含める。
- hidden pipeline は追加しない。local hook や pre-commit hook が必要になった場合は、別の Superpowers spec / plan で visible task として設計し、`mise run verify` との責務分離を再確認する。
- Codex Desktop と Claude Code は同じ `docs/skills/` 正本を使う。Claude Code 経由の review 実行は `docs/skills/review/SKILL.md` の `Claude Code 経由の実行` に従い、self review へ縮退しない。

## Coding conventions（コード規約）

正本は `web/eslint.config.mjs` と `web/tsconfig.json` です。

- TypeScript strict / `strictNullChecks` を維持する。
- `@/*` は `web/src/*` に対応する。
- TypeScript `enum` は使わない。
- default `React` import は使わない。
- import order は `simple-import-sort` に従う。
- React hooks、a11y、Next core web vitals の lint を尊重する。
- App Router file の local override を、理由なく全体化しない。
- Prettier は semicolon と double quote。

## Testing / TDD policy（テスト規約）

この repo の開発は、t-wada の TDD を前提に進めます。ここでの TDD は
「動作するきれいなコード」を目指し、テストリストから 1 つ選び、Red → Green →
Refactor を小さく回す進め方を指します。

現時点では test runner、test dependency、test file は未導入です。これらは別タスクで
明示的に導入するまで追加しません。`mise run verify` は引き続き唯一の hard guard です。

テスト基盤がない間も、TDD の意図は維持します。

- 実装前に、期待する振る舞いを test list または acceptance として明示する。
- バグ修正では、先に失敗している振る舞いと期待する成功状態を書く。
- 実装は観測可能な振る舞いを 1 つずつ変え、検証結果を最終報告または Superpowers spec / plan に残す。
- test list / acceptance は、Superpowers spec / plan がある場合は該当 artifact に、ない小変更ではユーザー要求または着手前メモに置く。
- Green 相当とは、明示した test list / acceptance を観測可能に満たした状態を指す。
- Green 相当の状態を確認してから refactor する。挙動変更と refactor を混ぜない。

テスト基盤を導入した後は、次を守ります。

- user-visible behavior、public API、共有関数の契約、regression を優先してテストする。
- 実装前に失敗するテストを書き、最小実装で Green にする。
- Green の間だけ refactor し、test と production code の意図を保ったまま整理する。
- テスト名は実装詳細ではなく、期待する振る舞いを説明する。
- brittle snapshot や private implementation detail への過度な依存を primary assertion にしない。
- 外部 service、時刻、乱数、network に依存するテストは、決定的に観測できる境界を作る。

## Question policy（確認基準）

必ず確認:

- 解釈が複数あり、実装が変わる。
- 破壊的変更やデータ削除を含む。
- secret、security、auth、server/client boundary に影響する。
- scope を file / module / route の具体名で列挙できない。

必要なら確認:

- 5 ファイル以上に跨り、境界の切り方に選択肢がある。
- UI tradeoff が user-visible。
- 既存 pattern と異なる実装を選ぶ。
- acceptance criteria が主観的。

確認不要:

- 小さく明確な変更。
- read-only 調査。
- 再現条件が明確な bug fix。
- lint / type / format の機械修正。

## Task decomposition（タスク分割）

次のどれかに当てはまれば、タスク分割または Superpowers plan を検討します。

| 指標 | 初期閾値 |
| --- | --- |
| 推定変更量 | 200 LOC 超 |
| 影響 file | 10 files 超 |
| 独立した関心事 | 3 以上 |
| 推定 session | 2 以上 |
| 逐次依存 | 4 step 以上 |

IVSE で task を切ります。

- Independent: 他タスクと独立に実装・検証できる。
- Verifiable: command、screenshot、HTTP response などの proof がある。
- Small: 上記閾値に収まる。
- Estimable: 1 session で終えられる。見積もれなければ分ける。

機能変更と refactor は、user が明示しない限り分けます。

## Verification（検証）

作業中は最小の有効な command を使います。意味のある code change の最終確認は:

    mise run verify

依存がなければ:

    mise run install
    mise run verify

環境変数不足などで build できない場合は、失敗 command、原因、未検証範囲を報告します。

## Review calibration（レビュー観点）

優先順位:

1. secret exposure / server-client boundary regression
2. Notes Markdown renderer、frontmatter schema、`dangerouslySetInnerHTML` 周辺の XSS regression
3. `/notes` routing、slug、metadata regression
4. build / lint / TypeScript regression
5. accessibility / responsive UI regression
6. lint で検出可能な style / naming issue

lint-only の問題は、より大きな設計問題につながる場合だけ manual review で扱います。
