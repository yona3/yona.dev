---
version: "alpha"
name: "Bookish Warm Minimal"
description: "Koh Yonamine の個人誌として、外へ見せるより内側に書き留める静けさを持つデザインシステム。"
colors:
  primary: "#2C261F"
  secondary: "#675D51"
  muted: "#7A6E60"
  faint: "#B8AA98"
  background: "#FCF8F0"
  surface: "#FFFDF8"
  surface-warm: "#F6EFDF"
  border: "#E6D9C7"
  border-soft: "#EFE5D6"
  accent: "#9B7657"
  accent-soft: "#E9D2BC"
  link: "#6C4D35"
  mark: "#F1D99E"
  on-accent: "#FFF8EA"
typography:
  display:
    fontFamily: "Noto Serif JP, Source Serif 4, Yu Mincho, serif"
    fontSize: "2rem"
    fontWeight: "400"
    lineHeight: "1.2"
    letterSpacing: "0"
  heading:
    fontFamily: "Noto Serif JP, Source Serif 4, Yu Mincho, serif"
    fontSize: "1.2rem"
    fontWeight: "400"
    lineHeight: "1.4"
    letterSpacing: "0"
  body:
    fontFamily: "Noto Serif JP, Source Serif 4, Yu Mincho, serif"
    fontSize: "0.98rem"
    fontWeight: "400"
    lineHeight: "2"
    letterSpacing: "0"
  meta:
    fontFamily: "Noto Sans JP, system-ui, sans-serif"
    fontSize: "0.75rem"
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
  section: "48px"
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
  surface:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "0"
    padding: "0"
  nav-link:
    textColor: "{colors.muted}"
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
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.meta}"
    rounded: "{rounded.xs}"
    padding: "0"
  inline-link:
    textColor: "{colors.link}"
    typography: "{typography.body}"
---

## Overview

Bookish Warm Minimal は、Koh Yonamine の個人誌のためのデザイン方針である。第一印象は「暖かくて入りやすい」だが、外へ強く見せるより、内側に書き留める静けさを優先する。古い本屋の棚の間にある小さな作業机のように、技術、生活、考えたことが静かに積み重なる場所にする。

実績を強く売り込まない。大きな見出しや強いコントラストで印象を取りに行かず、余白、読みやすさ、人間の気配を優先する。遊び心は主役ではなく、触れた人だけが気づく小さな余韻として扱う。

## Colors

白ベースだが純白にはしない。背景は薄いベージュと古い紙の黄ばみを含んだ `background` を使い、本文は黒ではなく深いインク色の `primary` を使う。

- `background` はページ全体の紙色。
- `surface` は本文や一覧の上に置く、ほぼ白の紙面。
- `accent` はリンク、フォーカス、控えめな強調だけに使う赤茶。
- `mark` は引用、選択、短い注釈などに使う薄い栞色。

色は少ないほどよい。種類ラベルや状態表示も、強い彩度ではなく文字、余白、罫線で区別する。

## Typography

全体の統一感を出すため、本文と見出しは serif を主役にする。日本語は明朝寄りでもよいが、読みにくい装飾書体は使わない。ナビゲーション、日付、種別ラベル、補助情報だけ sans-serif にして、本文との階層を作る。

本文はややゆったりした行間にする。見出しは過度に大きくせず、本文と地続きの声量にする。投稿一覧は日付とタイトルが中心なので、文字の静けさと揃いを優先する。コード、日付、slug などの機械的な情報は monospace を使ってもよい。

## Layout

Home は個人の入口であり、ランディングページではない。短い挨拶と自己紹介の下に、Notes の新着を日付順で静かに並べる。名前は必要以上に大きくせず、読み始めるための小さな標識として扱う。

基本構成:

1. Header は site 名として `yona.dev` だけを置く。
2. Home の主見出しは通称 `yona` を含む短い挨拶として示す。本名 `Koh Yonamine` は metadata / OGP / About の補助に留め、Home の H1 では使わない。
3. 短い段落で、ソフトウェア、AI Agent、小さな道具、生活の記録を書く人だと伝える。
4. 日付、種別ラベル、タイトルだけを中心にした Notes feed。

About は「このサイトについて」専用ページとして扱い、人物の自己紹介と技術的関心は Home の挨拶と短い段落に集約する。About には書く姿勢、Notes 統合の意図、サイトの性格を置き、Home と内容を重複させない。

余白は広めに取るが、空白を装飾として誇張しない。ページ幅は長文が読みやすい範囲に制限する。カードを多用せず、罫線、行間、日付の揃いで構造を作る。囲いは「部品感」が出るので、必要な反復要素以外では避ける。

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

絵文字やアイコンは、Noto Emoji、Twemoji、Fluent Emoji のような整った雰囲気を参照してもよいが、OS 絵文字そのままの表示に依存しない。UI 全体を絵文字で賑やかにしない。投稿種別や小さな状態の補助に限る。

ハリネズミは coffee と同じ local SVG emoji の方向で扱う。名前の横に置く場合も、本人由来の小さなサインに留め、プロフィール写真のように大きく扱わない。

猫やコーヒーカップは、既存サイトの模倣ではなく、独自の小さなサインとして扱う。使う場合は専用 SVG にし、OS の絵文字グリフに任せない。Twemoji / Noto Emoji / Fluent Emoji の方向性は、最終的な絵柄を選ぶための参照として扱う。

小さなサインは隠し味として使う。hover や focus でわずかに反応してよいが、動きは `transform` と `opacity` に限定し、本文を読む流れを邪魔しない。

区切りは線と余白のどちらかに寄せる。Notes row が既に線で構造を作っている場合、Hero と Notes の境界や footer の上線は足さず、余白で終わらせてもよい。

### Links

リンクは青ではなく `link` の赤茶を使う。本文中のリンクは下線か、hover 時の薄い mark で示す。ボタン化しすぎない。

すべてのリンクは `:focus-visible` で位置が分かるようにする。focus 表現は太い枠や強い面ではなく、細い outline と少しの余白で、紙面の静けさを壊さない。

## Writing And Labels

UI ラベルは日本語中心にする。`Home / About / Notes` の navigation は短い固有名として残してよい。補助ラベルは情報が増える時だけ使い、ページタイトルや navigation と役割が重複するものは置かない。

日本語と英語が混ざる本文では、`AI Agent` などの語が不自然に分割されないようにする。長い文字列への保険は `overflow-wrap` で行い、通常の本文には `word-break: break-all` を使わない。

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
