---
title: ブロックスタイルテスト
slug: test-blocks
date: 2026-04-26
type: log
description: Markdown の各ブロックスタイルを確認するためのテストノート
published: true
---

ここはテスト用の導入段落です。本文の見え方とブロック間の余白を確認します。複数行で書いた段落が改行で繋がって整形されるかを見る目的です。

# 見出し 1 のサンプル (h1)

h1 直下の段落です。見出しと本文の間隔、見出しの font-size、上下マージンの収まりを見ます。

## 見出し 2 のサンプル (h2)

h2 直下の段落。続けて短い段落を 2 つ並べます。

短い段落です。

短い段落 2 つめ。

### 見出し 3 のサンプル (h3)

h3 直下の段落です。続けてリストを置き、その後に code block を置きます。

- 箇条書き 1 行目です
- 箇条書き 2 行目です
- 箇条書き 3 行目です
- 箇条書き 4 行目で長めの文章にしたとき、どこで折り返されるかを見ます

リスト後の段落です。

```ts
type Note = {
  title: string;
  slug: string;
  date: string;
  type: "article" | "note" | "log";
  description: string;
  published: boolean;
};

const sample: Note = {
  title: "テスト",
  slug: "test",
  date: "2026-04-26",
  type: "log",
  description: "サンプル",
  published: true,
};
```

code block 後の段落です。最後の文章はここで終わります 🔚。
