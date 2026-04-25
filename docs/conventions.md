# リポジトリ規約

この文書は、この repo 固有の運用規約です。Hot 層の正本は `AGENTS.md`、
ExecPlan schema の正本は `PLANS.md`、人間向け説明は `README.md` です。

## SSoT

- agent 行動契約: `AGENTS.md`
- ExecPlan 契約: `PLANS.md`
- 詳細規約: `docs/conventions.md`
- 人間向け overview: `README.md`
- アプリコード: `web/`
- task artifact: `docs/exec-plans/{active,completed}/`
- hard guard: `mise run verify`

hidden runtime、pipeline directory、別形式の task artifact は増やしません。

## CE 方針

- Hot: すべての session で必要な制約だけを `AGENTS.md` に置く。
- Warm: repo 固有の詳細規約はこの file に置く。
- Cold: タスク固有の手順、発見、判断、evidence は ExecPlan に置く。
- README は人間が読む背景情報であり、agent の SSoT にしない。
- 同じ規約を複数 file に長文で重複させない。必要なら参照先だけを書く。
- lint で機械検出できる規約は、説明を最小限にし、詳細は設定 file を正本にする。

## ガードレール

### 秘密情報と外部 service

- `MICROCMS_API_KEY` は server-only。
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` は現在文書化されている唯一の public runtime env。
- `web/src/lib/microcms.ts` の `server-only` import を維持する。
- secret を log、metadata、client component、HTML に出さない。

### Blog content safety（記事 HTML の安全性）

- microCMS 由来の blog body HTML は信頼できない入力として扱う。
- `dangerouslySetInnerHTML` は
  `web/src/app/blog/[articleId]/page.tsx` の DOMPurify/JSDOM sanitize 後だけに限定する。
- `purifyConfig`、allowed tags、allowed attributes、highlight.js 後処理を変える変更は
  security-sensitive として最終報告で明示する。
- syntax highlight 後の最終 sanitize を bypass しない。

### Routing / ISR / metadata

- blog list/detail の canonical `revalidate` は 60 秒。
- `/blog` と `/blog/[articleId]` の route behavior を壊さない。
- pagination の不正 page は `notFound()` で観測可能にする。
- Open Graph、Twitter metadata、canonical URL、OGP image は user-visible behavior として扱う。

### Workspace 境界

- root の task runner は `mise.toml`。
- app 依存管理は `web/` の `pnpm`。
- root `package.json` と `yarn.lock` は復活させない。
- `.next/`、`node_modules/`、`.pnpm-store/`、coverage、`tsconfig.tsbuildinfo` は生成物として追跡しない。

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
- 実装は観測可能な振る舞いを 1 つずつ変え、検証結果を最終報告または ExecPlan に残す。
- test list / acceptance は、ExecPlan がある場合は ExecPlan に、ない小変更ではユーザー要求または着手前メモに置く。
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

次のどれかに当てはまれば、タスク分割または ExecPlan を検討します。

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

`MICROCMS_API_KEY` など環境変数不足で build できない場合は、失敗 command、原因、
未検証範囲を報告します。

## Review calibration（レビュー観点）

優先順位:

1. secret exposure / server-client boundary regression
2. microCMS HTML、DOMPurify、highlight.js、`dangerouslySetInnerHTML` 周辺の XSS regression
3. blog routing、pagination、ISR、metadata regression
4. build / lint / TypeScript regression
5. accessibility / responsive UI regression
6. lint で検出可能な style / naming issue

lint-only の問題は、より大きな設計問題につながる場合だけ manual review で扱います。
