---
version: "alpha"
name: "Bookish Warm Minimal"
description: "Koh Yonamine の個人誌として、古い本屋の棚の間にある小さな作業机のような温かさを持つデザインシステム。"
colors:
  primary: "#211C18"
  secondary: "#5F574D"
  muted: "#6F665A"
  faint: "#B8AA98"
  background: "#FBF7EE"
  surface: "#FFFDF8"
  surface-warm: "#F5ECD8"
  border: "#DDD0BC"
  border-soft: "#ECE1CF"
  accent: "#8F4D32"
  accent-soft: "#E9D2BC"
  link: "#70462C"
  mark: "#F1D99E"
  on-accent: "#FFF8EA"
typography:
  display:
    fontFamily: "Noto Serif JP, Source Serif 4, Yu Mincho, serif"
    fontSize: "2.75rem"
    fontWeight: "500"
    lineHeight: "1.15"
    letterSpacing: "0"
  heading:
    fontFamily: "Noto Serif JP, Source Serif 4, Yu Mincho, serif"
    fontSize: "1.5rem"
    fontWeight: "500"
    lineHeight: "1.4"
    letterSpacing: "0"
  body:
    fontFamily: "Noto Serif JP, Source Serif 4, Yu Mincho, serif"
    fontSize: "1rem"
    fontWeight: "400"
    lineHeight: "1.9"
    letterSpacing: "0"
  meta:
    fontFamily: "Noto Sans JP, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: "500"
    lineHeight: "1.5"
    letterSpacing: "0"
  code:
    fontFamily: "SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: "400"
    lineHeight: "1.65"
    letterSpacing: "0"
rounded:
  xs: "2px"
  sm: "4px"
  md: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "64px"
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
  surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  nav-link:
    textColor: "{colors.secondary}"
    typography: "{typography.meta}"
    padding: "{spacing.sm}"
  nav-link-active:
    textColor: "{colors.primary}"
    typography: "{typography.meta}"
  note-row:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    padding: "{spacing.sm}"
  note-label:
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.secondary}"
    typography: "{typography.meta}"
    rounded: "{rounded.xs}"
    padding: "{spacing.xs}"
  inline-link:
    textColor: "{colors.link}"
    typography: "{typography.body}"
---

## Overview

Bookish Warm Minimal は、Koh Yonamine の個人誌のためのデザイン方針である。第一印象は「暖かくて入りやすい」。古い本屋の棚の間にある小さな作業机のように、技術、生活、考えたことが静かに積み重なる場所にする。

実績を強く売り込まない。効率の良さや情報密度よりも、余白、読みやすさ、人間の気配を優先する。遊び心は主役ではなく、触れた人だけが気づく小さな余韻として扱う。

## Colors

白ベースだが純白にはしない。背景は薄いベージュと古い紙の黄ばみを含んだ `background` を使い、本文は黒ではなく深いインク色の `primary` を使う。

- `background` はページ全体の紙色。
- `surface` は本文や一覧の上に置く、ほぼ白の紙面。
- `accent` はリンク、フォーカス、控えめな強調だけに使う赤茶。
- `mark` は引用、選択、短い注釈などに使う薄い栞色。

色は少ないほどよい。種類ラベルや状態表示も、強い彩度ではなく文字、余白、罫線で区別する。

## Typography

全体の統一感を出すため、本文と見出しは serif を主役にする。日本語は明朝寄りでもよいが、読みにくい装飾書体は使わない。ナビゲーション、日付、種別ラベル、補助情報だけ sans-serif にして、本文との階層を作る。

本文はややゆったりした行間にする。投稿一覧は日付とタイトルが中心なので、文字の静けさと揃いを優先する。コード、日付、slug などの機械的な情報は monospace を使ってもよい。

## Layout

Home は個人の入口であり、ランディングページではない。短い自己紹介の下に、Notes の新着を日付順で静かに並べる。

基本構成:

1. `Koh Yonamine` と短い段落の自己紹介。
2. Home / About / Notes の小さなナビゲーション。
3. 日付、種別ラベル、タイトルだけを中心にした Notes feed。

余白は広めに取るが、空白を装飾として誇張しない。ページ幅は長文が読みやすい範囲に制限する。カードを多用せず、罫線、行間、日付の揃いで構造を作る。

## Elevation & Depth

影はほぼ使わない。古い紙、棚、作業机の質感は、写真や重いテクスチャではなく、薄い背景色、細い罫線、余白、文字色の差で表現する。

必要な場合だけ、紙が一枚置かれている程度のごく薄い境界を使う。浮いたカード UI、強いドロップシャドウ、ガラス風、グラデーション装飾は使わない。

## Shapes

角丸は小さく、`2px` から `8px` の範囲に収める。大きな丸みは避ける。ラベル、コード、補助的な小物は `2px` から `4px`、面として扱う要素は `8px` までにする。

線は細く、古い紙面の罫線のように淡く使う。太い border を装飾として使わない。

## Components

### Navigation

ナビゲーションは `Home / About / Notes` の 3 つに絞る。上部または余白内に静かに置き、現在地は色を強く変えるのではなく、文字色と下線で示す。

### Notes Feed

投稿は `Articles` と `Notes` に分けず、`Notes` に統合する。一覧では日付とタイトルを主役にし、種別ラベルは小さく添える。

表示ラベルの draft:

- `記事`: 一般的な技術記事。
- `ノート`: 考えたことの断片。
- `記録`: 作業ログや開発メモ。

内部値は `article`, `note`, `log` を使う。

### Icons And Emoji

絵文字やアイコンは、Noto Emoji、Twemoji、Fluent Emoji のような整った雰囲気を参照する。UI 全体を絵文字で賑やかにしない。投稿種別や小さな状態の補助に限る。

猫やコーヒーカップは、既存サイトの模倣ではなく、独自の小さなサインとして後から検討する。最初の実装では無理に入れなくてよい。

### Links

リンクは青ではなく `link` の赤茶を使う。本文中のリンクは下線か、hover 時の薄い mark で示す。ボタン化しすぎない。

## Do's and Don'ts

Do:

- 文章、日付、余白で人間の気配を出す。
- 白に近い暖色の紙色を使う。
- serif を中心にして、読み物としての統一感を出す。
- 投稿を日付順に淡々と積み重ねる。
- 遊び心は隠し味として扱う。

Don't:

- 無駄のなさを優先しすぎて無機質にしない。
- 情報量を増やしすぎて読む流れを阻害しない。
- 方向性の違うモチーフを同時に並べない。
- 既存の個人サイトや手書き猫をそのまま真似しない。
- 写真や重いテクスチャに雰囲気づくりを依存しない。
