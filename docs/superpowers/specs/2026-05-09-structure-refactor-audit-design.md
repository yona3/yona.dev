# 構造リファクタ監査設計

## 背景

yona.dev は `web/` に Next.js App Router のアプリ本体を置き、root には agent 契約、`mise` タスク、共有ドキュメント、Superpowers の成果物を置いている。公開コンテンツの正本は `web/content/notes/*.md` で、公開 runtime は Notion API や外部 CMS API を直接読まない。

直近の変更で、`ContentSource`、`Article` / `ArticleBlock[]`、CSS Modules 分割、Vitest / Playwright の検証基盤が追加された。現時点の構造は小さく保たれているが、将来自作 CMS や記事 block の拡張、page / component の増加に備えるには、責務境界と実装順序を明確にしてからリファクタリングへ進む必要がある。

今回の第一弾は実装ではなく、構造監査と分割ロードマップを成果物化する。次の `writing-plans` がそのまま実装計画を作れる粒度まで、対象 file、触らない範囲、acceptance、検証 command、commit 候補を整理する。

## 目的

- `content` 境界、route / component 境界、styling 境界、control plane 境界をまとめて監査する。
- 挙動維持を最優先にし、公開 route、表示、文言、CSS 見た目、content schema を原則変えない。
- A-D の全体リファクタを 1 本の巨大変更にせず、検証可能な分割タスクへ落とす。
- 次の実装計画では、まず `content` 境界整理から始められる状態にする。

## 対象範囲

### A: content 境界

対象候補:

- `web/src/lib/content/markdown-source.ts`
- `web/src/lib/content/blocks.ts`
- `web/src/lib/content/types.ts`
- `web/src/lib/content/index.ts`
- `web/src/lib/content/*.test.ts`
- `web/content/notes/*.md`

確認する観点:

- `markdown-source.ts` が file system access、frontmatter parsing、content normalization、`Article` 生成、cache を同時に持っている。
- `ContentSource` の公開契約を変えず、Markdown adapter と将来自作 CMS adapter の差し替え境界を明確化できる。
- `blocks.ts` の parser、`types.ts` の schema、`ArticleContent.tsx` の renderer が同じ `ArticleBlock` 契約を共有できている。
- 未対応 custom syntax は黙って崩さず、既存どおり失敗させる。

### B: route / component 境界

対象候補:

- `web/src/app/page.tsx`
- `web/src/app/about/page.tsx`
- `web/src/app/notes/page.tsx`
- `web/src/app/notes/[slug]/page.tsx`
- `web/src/app/blog/page.tsx`
- `web/src/app/blog/[articleId]/page.tsx`
- `web/src/components/site/*`
- `web/src/hooks/*`
- `web/src/constants/links.ts`

確認する観点:

- page file が data fetch と page composition を持ち、site component が presentation を持つ境界を維持できている。
- `Home`, `About`, `Notes` の section 表現が `home.module.css` や page file に散らばり始めていないか。
- client component は Home の小さな演出に閉じ、server component の data fetch と混ざっていないか。
- `/blog` 系 redirect は互換導線として残し、今回の構造整理で意味を変えない。

### C: styling 境界

対象候補:

- `web/src/styles/globals.css`
- `web/src/components/site/layout.module.css`
- `web/src/components/site/navigation.module.css`
- `web/src/components/site/home.module.css`
- `web/src/components/site/notes.module.css`
- `web/src/components/site/article.module.css`
- `web/src/components/site/motion.module.css`

確認する観点:

- `globals.css` の design token と `DESIGN.md` の方針が同期している。
- `home.module.css` が Home 専用だけでなく Notes / About の hero、section、body text も担っているため、名前と責務がずれていないか。
- article block の styling は `article.module.css` に閉じ、route や他 component へ本文固有の CSS を広げない。
- 見た目を変えずに class 名や module 責務を整理できるか。

### D: control plane 境界

対象候補:

- `AGENTS.md`
- `docs/conventions.md`
- `README.md`
- `DESIGN.md`
- `docs/tech-stack.md`
- `docs/superpowers/specs/*`
- `docs/superpowers/plans/*`
- `docs/exec-plans/README.md`
- `PLANS.md`
- `docs/skills/review/SKILL.md`
- `mise.toml`

確認する観点:

- `AGENTS.md` が Hot 層の agent 行動契約、`docs/conventions.md` が詳細規約、`README.md` が人間向け説明として分離されている。
- 旧 ExecPlan は履歴として残し、新規計画や完了判定の正本にしない。
- `mise run verify` は唯一の hard guard として維持する。
- review、commit、PR 作成は既存の `review`、`commit`、`pr-writer` の境界を守る。
- docs だけを整理する場合も、app 側の runtime 変更と混ぜない。

## 対象外

- `web/` の code、CSS、content file の変更。
- `web/content/notes/*.md` の frontmatter schema 変更。
- 公開 route、metadata、redirect、文言、表示順、アニメーションの変更。
- 外部 CMS、Notion runtime 直読、Notion sync script、自作 CMS 本体の実装。
- `dangerouslySetInnerHTML` の導入。
- root `package.json` / `yarn.lock` の復活。
- `.next/`、`node_modules/`、`.pnpm-store/`、`test-results/` など生成物の編集や追跡。

## 挙動維持ルール

- `/`, `/about`, `/notes`, `/notes/[slug]`, `/blog`, `/blog/[articleId]` の公開挙動を変えない。
- `web/content/notes/*.md` を公開コンテンツ正本として維持する。
- `Article` / `ArticleBlock[]` と `ContentSource` の公開契約を変えない。
- CSS の見た目、色、余白、font、アニメーションは原則変えない。
- 変更は責務分離、命名、file 分割、内部 helper 抽出に限定する。
- 最終検証は root の `mise run verify` とする。
- review が必要な変更では project-local `review` skill を使い、`mise run verify` の代替にしない。

## 推奨分割順序

順序は `A -> B -> C -> D` とする。

1. `content` 境界整理
   - 入力境界を先に固めることで、route / component / styling の整理を「何を表示するか」と切り離す。
2. route / component 境界整理
   - page composition と presentation component の責務を揃え、client component の範囲を明確にする。
3. styling 境界整理
   - 見た目を変えずに module 名、class 名、token 参照、page scope / component scope を整理する。
4. control plane 整理
   - 実装後の構造に合わせて docs 側の表現を最小更新する。旧 ExecPlan 履歴は現在正本と混ぜない。

## 分割タスク案

### Task A: content 境界整理

狙い:

- `markdown-source.ts` の責務を、frontmatter validation、Markdown source adapter、content normalization、article sorting へ分ける。
- `ContentSource` の公開関数は維持する。
- `ArticleBlock` の schema と parser / renderer の対応関係を見える形にする。

対象 file:

- `web/src/lib/content/markdown-source.ts`
- `web/src/lib/content/blocks.ts`
- `web/src/lib/content/types.ts`
- `web/src/lib/content/index.ts`
- `web/src/lib/content/markdown-source.test.ts`
- `web/src/lib/content/blocks.test.ts`

触らない file:

- `web/content/notes/*.md`
- `web/src/app/*`
- `web/src/components/site/*`
- CSS Modules

acceptance:

- `getAllArticles`, `getArticleBySlug`, `getArticleSlugs` の呼び出し口が変わらない。
- published filter、日付降順 sort、本文先頭の `# {title}` 除去が維持される。
- invalid frontmatter、unsupported article kind、unsupported custom block syntax は既存どおり失敗する。
- unit test の期待値を変えずに通る。

検証 command:

```bash
cd web
pnpm test -- src/lib/content
pnpm lint
```

最終検証:

```bash
mise run verify
```

commit 候補:

```text
refactor(content): Markdown source の責務境界を整理
```

### Task B: route / component 境界整理

狙い:

- page file は data fetch と page composition に寄せ、繰り返し presentation は component へ寄せる。
- Home / About / Notes の共通 page section 表現を見直す。
- client component は Home の演出境界に閉じる。

対象 file:

- `web/src/app/page.tsx`
- `web/src/app/about/page.tsx`
- `web/src/app/notes/page.tsx`
- `web/src/app/notes/[slug]/page.tsx`
- `web/src/components/site/HomeIntro.tsx`
- `web/src/components/site/NoteList.tsx`
- `web/src/components/site/ArticleContent.tsx`
- `web/src/components/site/SiteShell.tsx`
- 必要な場合のみ `web/src/constants/links.ts`

触らない file:

- `web/content/notes/*.md`
- `web/src/lib/content/*` の公開契約
- CSS の見た目

acceptance:

- `/`, `/about`, `/notes`, `/notes/[slug]` の表示内容が変わらない。
- `/blog` と `/blog/[articleId]` は `/notes` へ redirect し続ける。
- `HomeIntro`, `HelloBubble`, `HedgehogRunner` の reduced motion 対応を壊さない。
- E2E の route 期待値が変わらない。

検証 command:

```bash
cd web
pnpm test -- src/components/site
pnpm test:e2e
```

最終検証:

```bash
mise run verify
```

commit 候補:

```text
refactor(site): page と site component の責務を整理
```

### Task C: styling 境界整理

狙い:

- 見た目を変えず、CSS Modules の責務名と利用箇所を揃える。
- `home.module.css` が Home 以外の page scaffold も担っている点を整理する。
- article block、navigation、layout、motion の境界は維持する。

対象 file:

- `web/src/components/site/home.module.css`
- `web/src/components/site/notes.module.css`
- `web/src/components/site/article.module.css`
- `web/src/components/site/layout.module.css`
- `web/src/components/site/navigation.module.css`
- `web/src/components/site/motion.module.css`
- `web/src/styles/globals.css`
- CSS import を持つ related component / page file

触らない file:

- `DESIGN.md` の方針本文。ただし実装後に drift が見つかった場合は D で扱う。
- content loader / parser。
- public content。

acceptance:

- visual output は原則変わらない。
- CSS module の責務が page scaffold、layout、navigation、article、motion へ説明可能に分かれる。
- `ArticleContent` 固有の styling は `article.module.css` に閉じる。
- focus-visible、responsive、reduced motion の挙動を維持する。

検証 command:

```bash
cd web
pnpm lint
pnpm test:e2e
```

必要に応じた確認:

- before / after の screenshot 比較。
- visual companion で module 境界の図示。

最終検証:

```bash
mise run verify
```

commit 候補:

```text
refactor(styles): CSS Modules の責務境界を整理
```

### Task D: control plane 整理

狙い:

- 実装後の構造に合わせて、repo 契約と人間向け説明を最小更新する。
- 旧 ExecPlan 履歴と現在の Superpowers flow の境界を読みやすくする。
- `AGENTS.md` と `docs/conventions.md` の重複を増やさない。

対象 file:

- `AGENTS.md`
- `docs/conventions.md`
- `docs/tech-stack.md`
- `README.md`
- `DESIGN.md`
- `docs/exec-plans/README.md`
- `PLANS.md`
- `docs/skills/review/SKILL.md`
- `mise.toml`

触らない file:

- `docs/exec-plans/completed/*`
- `docs/exec-plans/archived-active/*`
- 実装済みの app code。D で app code を再編集しない。

acceptance:

- Hot 層の `AGENTS.md` は短く保ち、詳細は `docs/conventions.md` へ置く。
- README は人間向け説明に留め、agent 行動契約を重複定義しない。
- 旧 ExecPlan は履歴として扱われ、新規計画や完了判定の正本に戻らない。
- `mise run verify`、project-local `review`、`commit`、`pr-writer` の境界が明確に残る。

検証 command:

```bash
rg -n "ExecPlan|exec-plan|PLANS.md|docs/exec-plans" AGENTS.md PLANS.md docs/conventions.md docs/exec-plans/README.md docs/superpowers
git diff --check
```

最終検証:

```bash
mise run verify
```

commit 候補:

```text
docs(harness): 構造整理後の運用境界を更新
```

## 監査で使う初期 command

次の command は実装前の監査で使う。

```bash
git status --short
rg --files
find web/src -maxdepth 4 -type f
rg -n "TODO|FIXME|HACK|deprecated|legacy|ExecPlan|exec-plan|microCMS|Tailwind|dangerouslySetInnerHTML|Notion|ContentSource|ArticleBlock" .
rg -n "from \"(\\.\\.|@/|next|react|node:)" web/src
rg -n "className=|styles\\.|homeStyles\\.|notesStyles\\.|layoutStyles\\.|navigationStyles\\.|motionStyles\\." web/src/components web/src/app
```

## リスクと対策

- 見た目変更が混ざるリスク: Task C は CSS の移動・命名を中心にし、色、余白、font、animation の値変更を原則禁止する。
- content contract を変えるリスク: Task A では `Article` / `ArticleBlock[]` / `ContentSource` の公開型を変更しない。
- route regression のリスク: Task B では Playwright の `/`, `/notes`, `/notes/[slug]`, `/blog`, `/blog/[articleId]` を維持する。
- docs が実装に先行しすぎるリスク: Task D は A-C の後に行い、実装結果に合わせて最小更新する。
- 旧 ExecPlan を現在正本へ戻すリスク: `docs/exec-plans/*` は履歴としてだけ扱い、完了判定や新規 plan の正本にしない。

## 成功条件

- A-D の構造最適化が、検証可能な 4 つの分割タスクとして説明されている。
- 各分割タスクに対象 file、触らない file、acceptance、検証 command、commit 候補がある。
- 第一実装対象は Task A として明確になっている。
- 挙動維持ルールが明記されている。
- 次の `writing-plans` で Task A の実装計画に進める。

## 承認された判断

- A-D すべてをリファクタリング対象として扱う。
- 第一弾は実装なしの構造監査と分割ロードマップにする。
- 監査は実装直前の作業分解用にし、変更候補 file、検証 command、想定 commit 単位まで具体化する。
- リファクタリング本体は挙動維持を最優先にする。
- 方針は「証拠ベース監査 + 分割ロードマップ」を採用する。
- 分割順序は `A -> B -> C -> D` を基本にする。
