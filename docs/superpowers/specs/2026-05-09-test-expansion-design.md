# テスト拡充設計

## 背景

yona.dev は `web/content/notes/*.md` を公開コンテンツの正本にし、`ContentSource` 境界を通して `Article` と `ArticleBlock[]` を route / renderer に渡している。現在の `mise run verify` は `lint` と `build` だけで、test runner、test dependency、test file は未導入である。

今回の目的は、最近増えた content 境界と公開 route の回帰を決定的に検出できるようにすることである。特に、Markdown parser、frontmatter、公開記事 filter、slug 生成、記事本文 block、`/blog` redirect を `verify` の中で確認できる状態にする。

## 採用方針

第一段階では `Vitest + Playwright` を採用する。

- `Vitest`: `web/src/lib/content/` の純粋ロジックと content source 契約を高速に検証する。
- `Playwright`: production build 後の主要 route と記事表示の挙動を検証する。
- `mise run verify`: `lint`, `test`, `build`, `test:e2e` を順に実行する hard guard に拡張する。

`Testing Library` と screenshot / visual regression は今回の主系統にしない。component 単位の UI test や視覚差分は、記事 UI の回帰が増えた段階で別の設計に分ける。

## 対象範囲

対象は `web/` のテスト基盤と最初の回帰テストである。

- `parseArticleBlocks` の block 変換と失敗条件
- Markdown frontmatter の検証
- `published: false` の除外
- 公開記事の日付降順 sort
- slug 一覧と slug detail の契約
- 本文先頭の `# {title}` 除去
- `ArticleContent` が代表 block を安全に描画できること
- `/`, `/notes`, `/notes/[slug]`, `/blog`, `/blog/[articleId]` の主要挙動

対象外は次の通り。

- screenshot / visual regression
- CMS 本体や Notion sync の test
- 外部 network を使う test
- browser ごとの差分検証
- coverage 閾値の導入
- `dangerouslySetInnerHTML` を前提にした HTML snapshot

## Unit Test 設計

Unit test は `web/src/**/*.test.ts` に置く。最初の中心は `web/src/lib/content/blocks.ts` と `web/src/lib/content/markdown-source.ts` である。

`parseArticleBlocks` は次を確認する。

- 見出し、段落、リスト、引用、コード、画像を `ArticleBlock[]` に変換する。
- `:::callout` を `note` / `warning` として変換する。
- 閉じていない callout と code block は失敗する。
- 未対応の `::` custom syntax は失敗する。

`markdown-source.ts` は production の `web/content/notes/*.md` へ直接依存しすぎないよう、任意の notes directory から `ContentSource` を作る内部関数を追加して検証する。公開 export は今のまま既定の `content/notes` を読む。

Fixture は unit test 用に分離する。公開記事、未公開記事、invalid frontmatter、未知 custom block を含め、content source の成功条件と失敗条件を明示する。

## E2E 設計

E2E は `web/e2e/*.spec.ts` に置き、`pnpm build` 後の production server を Playwright から検証する。fixture は差し替えず、実際の `web/content/notes` を使う。

確認する route は次の通り。

- `/`: 200 で開き、主要な個人サイト導線が見える。
- `/notes`: 200 で開き、公開記事が一覧に出る。
- `/notes/site-renewal`: 200 で開き、記事 title、種別、日付、代表 block が見える。
- `/blog`: `/notes` へ redirect する。
- `/blog/anything`: `/notes` へ redirect する。

E2E は smoke だけにしない。記事一覧に未公開記事が出ないこと、記事本文が block renderer 経由で表示されること、旧 `/blog` 系 route が `/notes` に集約されることまで確認する。

## Script と Verify

`web/package.json` に次の script を追加する。

- `test`: Vitest を headless で実行する。
- `test:e2e`: Playwright test を実行する。

root の `mise.toml` は `verify` の依存に `test` と `test:e2e` を追加する。順序は `lint -> test -> build -> test:e2e` とする。unit test を先に実行して content logic の失敗を早く返し、E2E は build 済み成果物で route と static generation を確認する。

Playwright の web server は `pnpm start` を使う。既定 port が衝突する場合は Playwright 側の設定で専用 port を指定し、test 実行中だけ production server を起動する。

## 失敗時の扱い

Unit test の失敗は content 変換、frontmatter、記事公開条件の不一致として扱う。E2E の失敗は production build 後の route、redirect、記事表示の不一致として扱う。

`mise run verify` が失敗した場合、どの script で落ちたかを報告できる構成にする。環境依存で Playwright browser の導入が不足している場合は、失敗 command、原因、未検証範囲を明示し、依存導入の手順を計画側に残す。

## 成功条件

- `web/` に Vitest と Playwright の設定が追加されている。
- content parser と content source の代表的な成功条件、失敗条件が unit test で固定されている。
- 主要 route と `/blog` redirect が E2E で固定されている。
- `mise run verify` が `lint`, `test`, `build`, `test:e2e` を含む hard guard になっている。
- テスト用 fixture と production content の責務が分かれている。
- 外部 network、secret、Notion API に依存しない。

## 承認された判断

- テスト基盤は `Vitest + Playwright` とする。
- E2E は smoke だけでなく、記事一覧、記事本文 block、metadata 相当の表示、未公開記事の非表示、`/blog` redirect を確認する。
- screenshot / visual regression は今回の対象外とする。
- unit test は fixture を使い、E2E は実際の `web/content/notes` と production build を使う。
- `mise run verify` に unit test と E2E を組み込む。
