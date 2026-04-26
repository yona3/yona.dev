# yona.dev refresh design memo

このメモは、実装前のコンセプト、情報設計、コンテンツ管理方針を固定するための draft です。デザインの正本は root の `DESIGN.md`、agent 行動契約は `AGENTS.md` です。

## コンセプト

Koh Yonamine の個人誌。

技術記事、考えたことのノート、日々の作業記録が同じ場所に積み重なるサイトにする。派手なポートフォリオや実績一覧ではなく、AI Agent を使った開発への関心、ソフトウェアを作ることへの熱中、効率より心の豊かさを優先する姿勢が、投稿や余白から自然に見える状態を目指す。

思想は直接説明しすぎない。Home の短い自己紹介と、投稿の蓄積から伝わるようにする。

## 情報設計

ナビゲーションは最小にする。

- `Home`: 個人の入口。短い自己紹介と新着 Notes。
- `About`: Koh Yonamine について。技術的な関心、経験、リンク。
- `Notes`: すべての投稿。技術記事、考えたこと、作業記録を統合する。

既存 `/blog` の記事は残さない。公開 route は `/notes` を中心にし、旧 `/blog` と `/blog/[articleId]` は `/notes` への redirect 導線として扱う。

## Home

Home は「個人の入口」にする。ヒーロー、実績カード、過度な CTA は置かない。

冒頭の自己紹介は短い段落にする。一人称は「書いています」寄りでよい。

例:

    Koh Yonamine

    ソフトウェアを作ること、その過程で考えたことを書いています。
    技術、生活、創造性についての個人的な記録です。

自己紹介の下に、日付順の Notes feed を置く。年/月の区切りはいったん入れない。

## Notes

`Articles` と `Notes` は分けない。すべて `/notes` に統合し、投稿種別だけで軽く区別する。

投稿種別の draft:

| 内部値 | 表示 | 用途 |
| --- | --- | --- |
| `article` | 記事 | 一般的な技術記事、まとまった説明 |
| `note` | ノート | 考えたことの断片、短い文章 |
| `log` | 記録 | 作業ログ、開発メモ |

Feed の最小表示:

    2026.04.26  記事    AI Agent と開発するということ
    2026.04.22  ノート  古い本屋のようなサイトについて
    2026.04.18  記録    小さな道具を育てる

ラベルは日本語で表示する。内部値は英語 enum にして、URL や frontmatter で安定して扱う。

## コンテンツ管理

Notion は執筆場所として使う。公開 runtime が Notion API を直接読む CMS にはしない。

推奨フロー:

1. Notion で下書きする。
2. 手動または半自動 sync で repo 側に `web/content/notes/*.md` を生成する。
3. repo 側の `web/content/notes/*.md` を公開正本にする。
4. Next.js は build 時または静的な loader で repo 内コンテンツを読む。

frontmatter の draft:

    title: AI Agent と開発するということ
    slug: ai-agent-development
    date: 2026-04-26
    type: article
    description: AI Agent と開発する体験についてのメモ。
    published: true

後続実装で検討すること:

- 初期 scope では `.md` に固定する。MDX は必要になった時だけ検討する。
- Notion からの sync を script にするか、手動 export にするか。
- 画像や埋め込みを初期 scope に含めるか。
- draft / published の扱い。
- slug の生成規則。

## デザイン方向

詳細は `DESIGN.md` を参照する。要約すると、Bookish Warm Minimal。

- 白ベース、薄いベージュ、古い紙の黄ばみ。
- 全体は serif 寄りで統一する。
- 写真には頼らない。
- 絵文字やアイコンは Noto Emoji、Twemoji、Fluent Emoji のような整ったスタイルを参照する。
- 手書きの猫やコーヒーカップは、最初から主役にせず、後続で小さなサインや隠し味として検討する。

## 未決事項

- Feed の最終レイアウト。日付とタイトルだけに近いが、ラベル幅、抜粋有無、絵文字併用は実データで確認する。
- About の具体的な文章。
- 投稿詳細ページの読了体験、前後導線、目次の有無。
- 404 や footer に入れる小さな遊び心。
- Notion sync の実行方法。
