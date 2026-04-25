---
name: exec-plan
description: yona.dev専用ExecPlan運用。意図ヒアリングからPLANS準拠計画、実装、multi-agent review、PR/CI修正まで進める。
---

# yona.dev ExecPlan Skill

この skill は、yona.dev で `PLANS.md` 準拠の ExecPlan を作成し、その計画から実装、検証、multi-agent review fix loop、PR 作成、CI 修正まで進めるための project-local skill です。変更頻度の高い運用はここに置き、`AGENTS.md` や `docs/` を肥大化させません。

## 入力契約

| 入力 | 必須 | 説明 |
| --- | --- | --- |
| task | 必須 | ユーザーが達成したい変更、調査、修正 |
| scope | 任意 | 対象 file / route / module / command |
| constraints | 任意 | 変えてはいけない仕様、secret、UI、互換性 |
| acceptance | 任意 | 成功時に観測できる状態 |
| tradeoff | 任意 | 競合時の優先順位 |

## 使う場面

- `AGENTS.md` の ExecPlan 条件に該当する task。
- ユーザーが「exec-plan」「spec to PR」「計画からPRまで」「CI fixまで」と依頼した時。
- 複数 session、3 files 以上、2 concerns 以上、複数 acceptance、security / server-client / public route / microCMS / ISR / UI tradeoff に触れる時。

## 使わない場面

- 1 file の typo、lint の機械修正、read-only 調査など、`AGENTS.md` が確認不要とする小変更。
- PR URL からの review だけを行う時。この場合は `pr-review` を使う。project-local `review` は local diff / branch diff / staged diff / working tree diff 専用。
- `README.md` や `docs/conventions.md` の恒久規約そのものを増やす目的。頻繁に変わる手順は skill に置く。

## 最初に読むもの

1. `AGENTS.md`
2. `PLANS.md`
3. `docs/conventions.md`
4. 既存の relevant ExecPlan
5. review が必要になったら `.codex/skills/review/SKILL.md`

## ヒアリング

ExecPlan draft の前に、次の 5 軸を必ず埋めます。ユーザーが明示していない軸は、実装判断が変わるものだけ質問し、変わらないものは `Assumption:` として ExecPlan に残します。

| 軸 | 最低限集める内容 |
| --- | --- |
| 目的 | ユーザーから見える成果、避けたい失敗 |
| 制約 | 触らない file / route / API、secret、互換性 |
| 受け入れ条件 | command、UI、PR/CI、観測可能な成功状態 |
| scope 境界 | 対象と対象外、review scope command |
| tradeoff | 速度、完全性、互換性、UI、security の優先順位 |

質問は最大 3 問ずつに分けます。回答が `特になし` の場合も、該当軸を「制約なし」ではなく「明示制約なし」として記録します。

## commit / PR 運用

commit は `commit` skill を正本にします。ExecPlan の承認 scope に commit / PR 作成が含まれる場合は、`commit` skill を使って小さく論理的な単位で commit します。通常 task で commit / PR 作成が scope に含まれない場合は、`AGENTS.md` に従い user が依頼した時だけ commit します。

commit 粒度は、Pro Git、Google Engineering Practices、Conventional Commits の共通原則に従い、次を基準にします。

- 1 commit は 1 つの論理的に独立した changeset にする。1 issue / 1 acceptance / 1 関心事を目安にする。
- review しやすく、あとから revert / drop しやすい単位にする。迷ったら大きすぎる commit より小さめを選ぶ。
- feature / bug fix と大きな refactor、機械的変更、設定変更、生成物更新は原則分ける。小さな局所 cleanup は同じ commit に含めてよい。
- 挙動変更に対応する test / docs / 型更新は、reviewer がその変更を理解・検証するために必要なら同じ commit に含める。
- commit ごとに repo が意味的に壊れないようにする。検証が環境要因で止まる場合は ExecPlan と最終報告に未検証範囲を残す。
- Conventional Commits の type が複数にまたがる場合は、可能な限り複数 commit に分ける。

PR 作成・更新は `pr-writer` skill を正本にします。ExecPlan から PR へ進む場合は `pr-writer` skill を使い、title / body / 既存 PR 判定 / UI preview / issue 記載を委譲します。関連 issue が無い場合も blocker にせず、`issueなし` を明示入力として `pr-writer` に渡して PR 作成を継続します。

## 実行フロー

1. **scope 判定**: ExecPlan が必要か `AGENTS.md` で判定する。必要なら次へ進む。
2. **ヒアリング**: 5 軸を埋める。Must Ask は実装前に必ず確認する。
3. **ExecPlan 作成**: `docs/exec-plans/active/{YYYYMMDDHHmm_slug}/exec-plan.md` を作る。`PLANS.md` の skeleton を使い、冒頭準拠文と末尾 `Change note:` を含める。
4. **Approval gate 1**: 大きな実装前に user の `go` / 承認を得る。承認後は scope 内を自律実行する。
5. **実装**: `具体手順` に沿って小さく編集する。判断変更は `判断記録` と `Change note:` に残す。
6. **検証**: 原則 `mise run verify`。環境変数不足で止まる場合は、失敗 command、原因、未検証範囲を ExecPlan と最終報告に残す。
7. **multi-agent review fix loop**: project-local `review` skill を使い、2 つ以上の独立 reviewer を起動する。未解決 finding は scope 内で修正し、同じ reviewer set で最大 2 cycle 再確認する。成立しない場合は完了扱いにしない。
8. **commit**: commit / PR 作成が承認 scope に含まれる場合は、`commit` skill を使って論理単位ごとにこまめに commit する。spec-to-PR として承認済みの task では、PR 作成に必要な commit を approved scope 内の自律実行として扱う。
9. **PR 作成**: user が PR 作成を求めた、または task が spec-to-PR として承認済みなら `pr-writer` skill で PR を作成・更新する。関連 issue が無い場合は `issueなし` を明示して進める。
10. **CI fix**: PR CI が失敗したらログを読み、差分起因の failure を修正する。環境・secret・外部障害は blocker として報告し、推測で隠さない。

## spec-to-PR 契約

- PR まで進める task では、ExecPlan の `検証と受け入れ条件` に PR 作成条件と CI 成功条件を書く。
- PR 作成・更新は `pr-writer` skill を使う。issue が無い task でも PR 作成は止めず、PR body の関連 issue を `なし` として扱う。
- commit は `commit` skill を使い、PR 作成前に論理的に独立した commit history に整える。必要なら `commit --auto` 相当の自動分割方針を使う。
- CI fix は同じ ExecPlan の scope 内で扱う。scope を超える修正が必要なら user に確認する。
- PR 作成後も CI が red のままなら、green まで fix loop を続けるか、具体的な blocker を報告する。

## 停止条件

- 目的、scope、acceptance のどれかが未確定で、実装結果が変わる。
- destructive action、secret、auth、server-client boundary に関わる確認が未承認。
- multi-agent review が runtime 制約で成立しない。
- CI failure が secret / 外部 service / 権限不足で、local から修正できない。

## 完了条件

- ExecPlan が `PLANS.md` の必須 section を満たす。
- `mise run verify` または失敗理由と未検証範囲が記録されている。
- project-local `review` skill の multi-agent review fix loop が成立している。
- spec-to-PR task では PR が作成され、CI が green、または blocker が具体的に報告されている。
