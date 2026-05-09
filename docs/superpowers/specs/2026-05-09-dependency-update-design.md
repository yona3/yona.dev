# 依存関係アップデート設計

## 背景

yona.dev のアプリ本体は `web/` にあり、依存管理は `web/package.json` と
`web/pnpm-lock.yaml` で行っている。root の `mise.toml` は `web/` の `pnpm`
スクリプトを呼ぶ実行入口であり、最終検証は `mise run verify` を正本にする。

現在の依存は `Next.js 16`、`React 19`、`TypeScript 6`、`ESLint`、
`Vitest`、`Playwright` 周辺が中心である。今回の目的は、これらを npm レジストリ
の安定版 `latest` に寄せ、検証で壊れた箇所だけを必要最小限に直すことである。

## 採用方針

更新は「まとめて `latest` 化し、失敗時だけ分割」で進める。

`dependencies` と `devDependencies` を一括で npm レジストリの安定版 `latest` へ
寄せる。`canary`、`beta`、`rc` などの事前公開版は対象外にする。依存数が少なく、
現行バージョンも比較的新しいため、最初から 1 パッケージずつ分けるよりも、一括更新後の
`mise run verify` で実際の破損箇所を見るほうが戻しやすい。

`pnpm.overrides.postcss` は更新後の依存解決で必要性を確認する。不要なら削除し、
まだ必要なら理由を実装計画に残す。

## 対象範囲

対象は `web/` の依存関係である。

- `web/package.json` の `dependencies`
- `web/package.json` の `devDependencies`
- `web/package.json` の `pnpm.overrides.postcss`
- `web/pnpm-lock.yaml`

root の `mise.toml`、`engines.node: "24.x"`、アプリコード、テストコードは、依存更新後の
検証失敗を直すために必要な場合だけ触る。

## 実行手順

実装時は、まず作業環境の `mise` trust 状態を確認する。未 trust の場合は `mise trust`
を実行してから、root のタスクを使う。

依存更新は `web/` で行うが、検証は root の `mise` タスクを正本にする。

1. npm レジストリの安定版 `latest` を確認する。
2. `web/package.json` の対象依存を `latest` に更新する。
3. `mise run install` で `web/pnpm-lock.yaml` を再生成する。
4. `mise run verify` を実行する。
5. 失敗した場合だけ、失敗した段階に合わせて修正範囲を分ける。

## 失敗時の切り分け

`mise run verify` は `pnpm lint && pnpm test && pnpm build && pnpm test:e2e` を順に実行する。
失敗時は最初に落ちた段階を基準に原因を分ける。

- `lint`: `ESLint`、`typescript-eslint`、plugin、設定差分を確認する。
- `test`: `Vitest`、TypeScript 型、content parser 周辺の実行差分を確認する。
- `build`: `Next.js`、`React`、App Router、metadata、server/client 境界を確認する。
- `test:e2e`: `Playwright`、production server、主要 route、redirect を確認する。

環境変数不足、ブラウザ未導入、`mise` trust、不完全な依存導入など、実行環境由来の失敗は
コード破損と混ぜない。失敗 command、原因、未検証範囲を報告する。

## 検証方針

成功条件は root からの `mise run verify` 通過である。依存更新そのものは
`pnpm install` の成功だけでは完了扱いにしない。

意味のあるコード修正が発生した場合も、最終確認は同じく `mise run verify` とする。
依存更新だけで通る場合は、追加のアプリ変更を入れない。

## 成功条件

- `web/package.json` の対象依存が npm レジストリの安定版 `latest` に寄っている。
- `web/pnpm-lock.yaml` が更新後の依存解決を反映している。
- `pnpm.overrides.postcss` の扱いが、削除または必要理由付き維持のどちらかに決まっている。
- `mise run verify` が通っている、または環境由来の停止要因と未検証範囲が明示されている。
- root `package.json` や `yarn.lock` を復活させていない。
- 事前公開版の依存を入れていない。

## 対象外

- `canary`、`beta`、`rc` など事前公開版への更新
- `Next.js` / `React` 以外のフレームワーク移行
- パッケージ管理方式の変更
- root `package.json` / `yarn.lock` の復活
- 依存更新と無関係なリファクタリング
- 新しい実行時依存や外部サービスの導入

## 承認された判断

- 更新方針は最新化優先とする。
- 対象は npm レジストリの安定版 `latest` とし、事前公開版は含めない。
- `web/package.json` の `dependencies` と `devDependencies` を両方対象にする。
- `pnpm.overrides.postcss` は必要性を確認し、不要なら削除候補に含める。
- 実装方針は「まとめて `latest` 化し、失敗時だけ分割」とする。
