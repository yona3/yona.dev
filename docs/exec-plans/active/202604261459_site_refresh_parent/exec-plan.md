この ExecPlan は ../../../../PLANS.md の契約に準拠する。

## 目的

`codex/site-refresh-notes` ブランチで進めている yona.dev の刷新作業を、PR merge まで追跡する親 ExecPlan として維持する。現在は細かいデザイン調整中であり、完了条件はユーザーが in-app browser で見て納得すること、コンテンツ調整まで終えること、PR が作成され CI が green になり merge されることとする。

この親 ExecPlan は、細かい UI 調整ごとの子 ExecPlan を置き換えるものではない。子 ExecPlan は必要に応じて作成・完了させ、この親 ExecPlan には全体の状態、未完了タスク、ユーザー判断、PR / CI / merge 状態を更新し続ける。

## 進捗

- [x] 2026-04-26 14:59+09:00 親 ExecPlan の目的、完了条件、既存の子タスクを整理した。
- [x] 2026-04-26 14:59+09:00 `codex/site-refresh-notes` の現在の commit 履歴と completed ExecPlan を確認した。
- [ ] 2026-04-26 17:48+09:00 デザイン微調整 loop を、ユーザーが納得するまで継続する。 (codex 3 reviewer の REQUEST_CHANGES 7 件は反映 / 維持で確定済。Claude Code subagent 補助 review の新規 P3 × 3 も commit ec0e477 で反映済。残: in-app browser 確認、ユーザー納得の明示記録。)
- [x] 2026-04-26 17:48+09:00 Home / About / Notes / note detail のコンテンツを精査し、公開する文章として整える。 (Notes 3 本書き直し / Home 文言調整 / About 段落重複整理 / note detail description 削除を反映済。)
- [x] 2026-04-26 17:08+09:00 `DESIGN.md` を最終 UI と整合させる。 (Layout 章を Home の通称 yona / About 専用ページとして固定するよう更新。`DESIGN.md` commit 5205066。)
- [x] 2026-04-26 17:55+09:00 CMS 依存の扱いと Notion ベース管理の方針を、公開 runtime の契約と矛盾しない形に整理する。 (現状確認: src / lockfile / env から microCMS 参照は撤去済、`/blog` は redirect のみ。`docs/conventions.md` に Content management 方針として、microCMS 撤去状態 / `/blog` redirect 長期方針 / Notion 同期候補 (手動 / build 前) を明文化。)
- [x] 2026-04-26 17:30+09:00 `mise run verify` と project-local review fix loop を実行する。 (lint + build green、project-local review skill REQUEST_CHANGES → 3 件反映、4 件 user 判断確定。)
- [x] 2026-04-26 17:32+09:00 論理単位の commit を揃え、`pr-writer` で PR を作成または更新する。 (4 commit: 3a75af4 feat(site) / c66f674 docs(notes) / 5205066 docs(design) / 4afc271 docs(exec-plan)。PR #24 OPEN: https://github.com/yona3/yona.dev/pull/24 。)
- [x] 2026-04-26 23:03+09:00 `review` skill に Claude Code CLI を使う `claude-design-reviewer` の恒久的な起動条件を追加する。
- [x] 2026-04-26 23:46+09:00 review fix loop で stale finding を確認し、Claude 指摘の page title CSS 詳細度と親 ExecPlan の記録同期を修正した。`git diff --check` / `mise run verify` は成功し、in-app browser で `/about` と `/notes` の見出し階層を確認した。
- [ ] 2026-04-26 17:35+09:00 PR CI を green にし、ユーザー承認後に merge する。
- [ ] 2026-04-26 14:59+09:00 merge 確認後、この親 ExecPlan を completed へ移す。

## 発見

観測: 現在の作業ブランチは `codex/site-refresh-notes` である。
根拠:
    `git status --short --branch --untracked-files=all` が `## codex/site-refresh-notes` を返した。

観測: このブランチでは、Notes 中心の個人サイト刷新、デザインレビュー観点追加、review fix loop、ラベル整理、ハリネズミ / coffee emoji 調整がすでに commit されている。
根拠:
    `git log --oneline --decorate --max-count=12` に `3b1e6ab feat(site): 個人サイトを内省的な Notes 体験に刷新`、`9a10e9b docs(review): デザインレビュー観点を追加`、`b533aef fix(review): review fix loop の指摘を反映`、`c9c084b fix(site): ハリネズミ emoji の見え方を調整` が含まれる。

観測: 完了済みの子 ExecPlan は `docs/exec-plans/completed/` に整理されており、現在 `docs/exec-plans/active/` には `.gitkeep` だけが残っていた。
根拠:
    `find docs/exec-plans/active -maxdepth 2 -type f -print` が `docs/exec-plans/active/.gitkeep` だけを返した。

観測: 直近の子 ExecPlan には、名前横のハリネズミ emoji、footer coffee、mobile overflow、H1 accessible text content の検証結果が記録されている。
根拠:
    `docs/exec-plans/completed/202604261439_hedgehog_emoji_footer/exec-plan.md` と `docs/exec-plans/completed/202604261451_hedgehog_position_coffee_size/exec-plan.md`。

観測: 2026-04-26 に design 中心の project-local review skill を実行し、`contract-reviewer` / `design-reviewer` / `ui-reviewer` の 3 reviewer が `codex exec --sandbox read-only --ephemeral` で並列実行され、いずれも `REQUEST_CHANGES` を返した。採用 finding は 7 件 (P2 が 3、P3 が 4)。
根拠:
    reviewer 出力 (`/tmp/yona-review-20260426/out-*.md`)、source: contract / design / ui の集約。重複は Home 主見出し finding を contract+design で 1 件に統合。

観測: 上記 7 件のうち、user 判断不要な 3 件は反映済み。残 4 件は user 判断で反映 / 維持を確定した。
根拠:
    - 反映済 (P2): `web/src/components/site/site.module.css:245` の `.socialLinks a` の `color` を `--color-faint` → `--color-muted` (WCAG 1.4.11 で 3:1 を満たすため)。
    - 反映済 (P3): `web/src/components/site/site.module.css:191` の `.noteItem a` に `min-width: 0` を追加 (長語 overflow 予防)。
    - 反映済 (P3): `web/src/components/site/SiteShell.tsx:86-88` を `<footer>` から `<div aria-hidden="true">` に戻し、空 contentinfo landmark を解消。
    - DESIGN.md 更新済: `DESIGN.md` の Layout 章で Home の主見出しを `Koh Yonamine` から通称 `yona` の挨拶に変更し、About を「このサイトについて」専用と固定する記述を追加。
    - 維持判断: skip-link の塗り面表現と、`web/content/notes/bookish-site.md` の本文と実装罫線の併存は user 判断で維持。

観測: 上記 review fix loop 後に、同じ reviewer set による再 review、`mise run verify`、browser 確認は実行していない。
根拠:
    user 指示が「user 判断不要な 3 件だけ先行反映」であり、fix loop 完走ではなく中間反映であるため。`git diff --check` は通過済み。

観測: ユーザーは design review で Claude Code を使えるようにする恒久運用案を選択し、その後「デザイン面はデフォルトで Claude、許可不要」と明示した。
根拠:
    2026-04-26 23:03+09:00 user reply `2`。2026-04-26 23:08+09:00 user request `デザイン面はデフォルトで claude でレビューさせるようにしたい。許可とかは不要。`。`claude --help` で `claude -p` / `--print` と `--output-format` を確認済み。

## 判断

判断: この親 ExecPlan は PR merge まで active に残す。
理由: ユーザーが「PR merge まで維持される親 ExecPlan」を明示しており、完了条件もユーザー納得までの反復を含むため、子タスク完了ごとに completed へ移す通常の小 Plan とは役割が異なる。
日付/担当: 2026-04-26 / Codex

判断: 完了条件は「ユーザー納得」を最上位 gate とし、local verify / browser / review / PR / CI / merge を下位 gate として扱う。
理由: 今回の主作業は細かい UI とコンテンツの品質調整であり、機械的な test pass だけでは完了を判定できない。
日付/担当: 2026-04-26 / Codex

判断: コンテンツ調整は UI 調整と同じ親 ExecPlan に含める。
理由: 個人ブランディング、技術ブログ、日々の記録の入口として、UI と文章の方向性は分離して判断しにくい。公開前に Home / About / Notes / note detail の言葉と情報設計を一体で整える必要がある。
日付/担当: 2026-04-26 / Codex

判断: Notion は執筆元の候補として扱い、公開 runtime の正本は `web/content/notes/*.md` のまま維持する。
理由: `AGENTS.md` の禁止境界が「公開コンテンツの正本は `web/content/notes/*.md`。Notion は執筆元であり、公開 runtime から直接読まない」と定めているため。
日付/担当: 2026-04-26 / Codex

判断: Home の主見出しは通称 `yona` の挨拶で示し、本名 `Koh Yonamine` は metadata / OGP / About 補助に留める。
理由: 公開する個人ブランディングを通称 `yona` (X / GitHub / Zenn の handle と一致) に寄せ、本名は補助に留めるほうが内省的な入口の温度に合うとユーザーが判断した。`DESIGN.md` の Layout を実装に合わせて更新済み。
日付/担当: 2026-04-26 / Codex (review fix loop)

判断: About は「このサイトについて」専用ページとし、人物の自己紹介と技術的関心は Home に集約する。
理由: design-reviewer の「About が人ではなくサイト説明に偏っている」指摘に対し、Home に挨拶と関心が並んでいるため二重化を避け、About はサイトの性格と書く姿勢を置く役割に固定する設計判断をユーザーが選んだ。`DESIGN.md` の Layout を更新済み。
日付/担当: 2026-04-26 / Codex (review fix loop)

判断: skip-link の focus 表示は現状の塗り面表現を維持する。
理由: WCAG 2.4.1 Bypass Blocks の意図と、keyboard-only ユーザーの最初の focus target としての可視性を優先し、`DESIGN.md` の focus 方針より a11y を優先するとユーザーが判断した。
日付/担当: 2026-04-26 / Codex (review fix loop)

判断: `web/content/notes/bookish-site.md` の本文「Notes の罫だけを残し」と、実装の `header.border-bottom` / `bodyText.border-top` の併存は許容する。
理由: 公開 note は執筆当時の方向性を残す回想的な文章として書いており、現在の実装の罫線最小化と完全一致させる必要はないとユーザーが判断した。
日付/担当: 2026-04-26 / Codex (review fix loop)
注記: 後続 commit e639082 で `web/content/notes/bookish-site.md` 自体が削除された (ai-agent-development.md / small-tools.md と共にダミー note 撤去)。この判断は historical record として残し、現行 content には適用しない。

判断: 公開 runtime は `web/content/notes/*.md` のみを読む構成に固定し、Notion を執筆元として使う場合も runtime から Notion API を直接読まない方式 (手動同期 or build 前同期) のみを採用する。
理由: ブランチ作業で microCMS への runtime 依存はすでに撤去済 (src / lockfile / env いずれも参照なし、`/blog` は `/notes` への redirect のみ)。Notion 移行を将来検討する余地は残しつつ、secret の client / log / HTML 露出を避け、`AGENTS.md` 禁止境界と整合させる。
日付/担当: 2026-04-26 / Codex (Content management 方針整理、`docs/conventions.md` に明文化)

判断: Claude Code は通常 design-reviewer を置き換えるのではなく、design review 条件に該当した時の既定追加 reviewer として `claude-design-reviewer` を起動する。
理由: ユーザーが design review では Claude をデフォルトで使い、追加許可を不要にしたいと明示したため。design review 以外の通常レビューまでは対象にしない。
日付/担当: 2026-04-26 / Codex (`review` skill 拡張)

## 契約

依存: `web/src/app/page.tsx`, `web/src/app/about/page.tsx`, `web/src/app/notes/page.tsx`, `web/src/app/notes/[slug]/page.tsx`, `web/src/components/site/*`, `web/src/styles/globals.css`, `web/content/notes/*.md`, `web/src/lib/notes.ts`, `DESIGN.md`, `docs/skills/review/SKILL.md`, `docs/exec-plans/completed/*`
依存理由: サイト刷新の UI、ルーティング、公開コンテンツ、Markdown content pipeline、レビュー観点、過去の作業記録を一貫して管理するため。
契約: この親 ExecPlan は PR merge が確認されるまで `docs/exec-plans/active/202604261459_site_refresh_parent/exec-plan.md` に残す。
契約: 子 ExecPlan を作る場合も、この親 ExecPlan の進捗、発見、未完了を更新する。
契約: 完了条件はユーザーが in-app browser で納得した状態を明示すること。ユーザーが納得していない UI / content は完了扱いにしない。
契約: Home / About / Notes / note detail は user-visible route として扱い、変更後は browser 確認を行う。
契約: `/notes`、`/notes/[slug]`、`/blog` redirect、metadata、Markdown renderer、frontmatter schema、slug 生成規則を変更する場合は user-visible 影響としてこの親 ExecPlan に記録する。
契約: `dangerouslySetInnerHTML` は原則使わない。使う場合は sanitize 済み content と明示し、security-sensitive として扱う。
契約: Notion token や外部 API key を `NEXT_PUBLIC_*`、client component、log、HTML に出さない。
契約: 公開 runtime から Notion を直接読まない。Notion は執筆元または手動 / build 前同期の候補として扱う。
契約: root `package.json` / `yarn.lock` を復活させない。依存管理は `web/` の `pnpm`。
契約: `.next/`, `node_modules/`, `.pnpm-store/`, `tsconfig.tsbuildinfo`, `web/next-env.d.ts` など生成物を編集・追跡しない。
契約: PR 作成・更新は `pr-writer` skill から実施し、直接 `gh pr create` / `gh pr edit` / GitHub connector で作成・更新しない。
契約: Claude Code で design review を行う場合は、`review` skill の既定として `claude-design-reviewer` を追加し、scoped prompt bundle だけを `claude -p` に渡す。無効化する場合は `claude_design_review:off` を明示する。

## 実行計画

1. 現在の UI 反復を継続する。

    作業場所:
        <repo-root>
    実行:
        Home / About / Notes / note detail / demo route を in-app browser で確認し、ユーザーの指摘に応じて余白、文字階層、emoji、線、導線、一覧密度を調整する。
    期待結果:
        ミニマルで内省的、温かく入りやすい雰囲気になり、ユーザーが「この方向でよい」と判断できる。

2. コンテンツを精査する。

    作業場所:
        <repo-root>
    実行:
        Home の紹介文、About の自己紹介、Notes 一覧の見出しやラベル、初期 note markdown の文章を見直す。抽象的すぎる文言、重複する名前や説明、外向けすぎる見せ方を減らす。
    期待結果:
        個人の入口、エッセイ寄りの技術ブログ、日々の記録というコンセプトが、過度に自己宣伝的でなく伝わる。

3. 情報設計を最終化する。

    作業場所:
        <repo-root>
    実行:
        Home / About / Notes / note detail の役割分担、導線、見出し、metadata を確認する。不要な導線やラベルは削り、必要な導線だけ残す。
    期待結果:
        情報の重複が少なく、ユーザーが Notes と About に自然に辿れる。

4. content management 方針を整理する。

    作業場所:
        <repo-root>
    実行:
        既存 CMS 依存の残りを確認し、`web/content/notes/*.md` を公開正本にした運用を維持する。Notion は執筆元として使う場合の手動同期または build 前同期の候補を整理し、runtime secret / client exposure を避ける。
    期待結果:
        公開 runtime は単純で安全な markdown source に寄り、Notion 導入の判断余地も残る。

5. design contract を更新する。

    作業場所:
        <repo-root>
    実行:
        最終 UI の spacing、type scale、色、emoji 方針、Notes presentation、避ける表現を `DESIGN.md` に反映する。
    期待結果:
        実装と `DESIGN.md` が矛盾せず、今後の調整基準として使える。

6. 検証と design review fix loop を行う。

    作業場所:
        <repo-root>
    実行:
        `git diff --check`
        `mise run verify`
        browser preview
        project-local `review` skill の design review / fix loop
        design review 時は既定で `claude-design-reviewer`
    期待結果:
        lint/build が通り、mobile / desktop の overflow、tap target、a11y landmark、情報重複、visual hierarchy の主要 finding が解消される。

7. ユーザー承認 gate を通す。

    作業場所:
        <repo-root>
    実行:
        in-app browser の最終状態をユーザーに確認してもらい、納得しているかをこの ExecPlan に記録する。
    期待結果:
        「納得した」「この方向で PR に進める」などの明示承認が記録される。承認がなければ design / content loop に戻る。

8. commit history を整える。

    作業場所:
        <repo-root>
    実行:
        `git status --short --untracked-files=all`
        `git diff --staged`
        commit skill
    期待結果:
        論理単位の commit が揃い、生成物や無関係差分が残らない。

9. PR を作成または更新する。

    作業場所:
        <repo-root>
    実行:
        `pr-writer` skill で CREATE / UPDATE 判定、差分分析、title / body 生成、PR 作成または更新を行う。
    期待結果:
        PR が存在し、本文にコンセプト、主要変更、検証、残リスク、関連 issue なしが記載される。

10. CI fix と merge まで進める。

    作業場所:
        <repo-root>
    実行:
        PR CI / Vercel check を確認し、差分起因の failure を修正する。secret / 外部 service / 権限不足なら blocker として記録する。CI green とユーザー承認後に merge する。
    期待結果:
        PR が merge され、merge commit または GitHub 上の merge 状態が確認できる。

11. merge 後に親 ExecPlan を completed へ移す。

    作業場所:
        <repo-root>
    実行:
        この ExecPlan に PR URL、CI 結果、merge 結果を記録する。
        `mv docs/exec-plans/active/202604261459_site_refresh_parent docs/exec-plans/completed/202604261459_site_refresh_parent`
    期待結果:
        PR merge まで維持された親 ExecPlan が completed に移り、active には未完了 plan だけが残る。

## 受け入れ条件

入力: `http://localhost:3000/`
確認: Home が個人の入口として機能し、名前、紹介文、Notes preview、emoji、余白、footer が過度に外向けでなく内省的に見える。
確認: ユーザーが in-app browser で最終 UI に納得したことをこの ExecPlan に記録する。

入力: `http://localhost:3000/about`
確認: About が実績の押し出しではなく、技術的関心や経験、人となりが伝わる自己紹介になっている。
確認: 情報の重複、意味の薄いラベル、不要な導線が整理されている。

入力: `http://localhost:3000/notes`
確認: Notes 一覧が日付とタイトル中心で読みやすく、必要なら絵文字や種別表示が雰囲気に合っている。
確認: Articles と Notes を分けず、Notes として統合されている。

入力: `http://localhost:3000/notes/{slug}`
確認: note detail の本文、metadata、Markdown rendering が静かな読書体験を壊さない。
確認: frontmatter schema、slug 生成、Markdown renderer の変更がある場合は明示的に記録され、verify / browser で確認されている。

入力: `DESIGN.md`
確認: 最終 UI の type scale、余白、色、emoji / analog texture 方針、避ける表現が反映されている。

入力: content management 方針
確認: 既存 CMS 依存の扱いと Notion ベース管理の候補が整理されている。
確認: 公開 runtime から Notion を直接読まず、secret を client に露出しない契約が維持されている。

入力: validation commands
確認: `git diff --check` が成功する。
確認: `mise run verify` が成功するか、環境要因の blocker と未検証範囲が記録されている。
確認: browser preview で desktop / mobile の横 overflow、主要 tap target、視覚的重なりがない。
確認: project-local review / design review fix loop の最終結果が APPROVE または具体的 blocker になる。

入力: PR / CI / merge
確認: `pr-writer` skill を通して PR が作成または更新されている。
確認: PR CI / Vercel check が green になるか、secret / 外部 service / 権限不足の blocker が記録されている。
確認: ユーザー承認後に PR が merge され、この親 ExecPlan が completed へ移される。

失敗条件: ユーザーが UI / content に納得していない、Home / About / Notes の役割が曖昧、情報重複が目立つ、外向けすぎる見せ方に戻る、公開 runtime が Notion secret に依存する、生成物差分が残る、PR merge 前にこの親 ExecPlan を completed へ移す。

## 復旧

1. デザイン調整が迷走した場合は、直近の納得済み commit に戻れる粒度で commit を分け、必要なら子 ExecPlan で対象を絞る。
2. コンテンツ調整で判断が割れる場合は、Home / About / Notes / note detail のどの route の問題かを分けて、この親 ExecPlan の `発見` と `判断` に追記する。
3. Markdown/frontmatter/content loader を触って破綻した場合は、schema と renderer の変更を明示し、`mise run verify` と note detail browser 確認を再実行する。
4. Notion 方針が secret / runtime 依存に近づいた場合は、公開正本を `web/content/notes/*.md` に戻し、Notion は執筆元または同期前 source に限定する。
5. PR / CI が環境、secret、外部 service、権限で止まった場合は、失敗 command と blocker をこの ExecPlan に残し、差分起因の failure だけを修正する。

## 未完了

親 ExecPlan は PR merge まで未完了。現時点の残作業は次の通り。

- in-app browser での Home / About / Notes / note detail の最終視覚確認と、ユーザー納得の明示記録。
- PR #24 https://github.com/yona3/yona.dev/pull/24 の CI / Vercel check 監視と、差分起因の failure があれば修正。
- ユーザー承認後の merge と、この親 ExecPlan の `docs/exec-plans/completed/` 移動。

変更記録:
- 2026-04-26 14:59+09:00 PR merge まで維持する親 ExecPlan として作成した。
- 2026-04-26 17:35+09:00 review fix loop 1 周目と PR 作成までを反映 (`DESIGN.md` 同期 / `mise run verify` green / 4 commit / PR #24 OPEN)。残作業を補助 review P3、browser 確認、CMS 方針、CI、merge に整理した。
- 2026-04-26 17:48+09:00 補助 review P3 × 3 を commit ec0e477 で反映 (About 罫線除去 / About 段落重複整理 / note detail description 表示削除)。`mise run verify` green、`git diff --check` 通過。残作業を browser 確認、CMS 方針、CI、merge に絞った。
- 2026-04-26 17:55+09:00 CMS 依存 / Notion 方針整理を完了。runtime はすでに microCMS 依存ゼロであることを確認し、`docs/conventions.md` に Content management 方針 (microCMS 撤去状態 / `/blog` redirect 長期方針 / Notion 同期候補) を追加。残作業を browser 確認、PR CI、merge に絞った。
- 2026-04-26 22:00+09:00 Home に挨拶吹き出し + ハリネズミ click lap + hover wobble + 丸文字 (吹き出しのみ) を追加し、project-local review skill を 2 cycle 回した。cycle 1 で contract / design / ui の REQUEST_CHANGES を計 6 件採用し反映 (reduced-motion 早期 return / sr-only h1 名 / setTimeout cleanup / `overflow-x: clip` / DESIGN.md Typography 更新 / motion 例外明文化)。cycle 2 で REQUEST_CHANGES 3 件追加採用し反映 (`prefers-reduced-motion: reduce` 時はハリネズミを button ではなく装飾表示に切替 / nav 系 font-family override 削除 / hedgehog button hit area 44x44)。`mise run verify` green、`git diff --check` 通過、PR #24 commit 5ee7bf3 / 82c2296 で push 済。残作業は browser 確認、ユーザー承認、merge。
- 2026-04-26 22:40+09:00 commit b8a7e39 (Noto Color Emoji + 工事中 banner) と e639082 (ダミー note 撤去 / site-renewal / test-blocks) に対して project-local review skill を 2 cycle 回した。cycle 1 で contract / app / ui / design 4 reviewer 全員が REQUEST_CHANGES を返し、採用 finding 6 件のうち 5 件を反映: `.constructionNotice` の color を `var(--color-secondary)` に変更し WCAG 4.5:1 を満たす / `test-blocks.md` を `published: false` にして公開対象から除外 / 工事中 banner を `<header>` 直後から `<main>` 直後 (footer の前) に移動し最初の意味情報を site identity に戻す / `.page` と `.nameSpeech` の font-family stack で `var(--font-emoji)` を generic `sans-serif` の前に移動 / 直前の `bookish-site.md` 維持判断に「commit e639082 で削除済、historical record」を注記。`site-renewal.md:18` の serif 文言は user 編集中につき cycle 2 では再提出せず保留。cycle 2 で app / ui / design は APPROVE、contract が ExecPlan 変更記録 の追記漏れを P3 として指摘したためこの entry を追記。`mise run verify` green、`git diff --check` 通過。残作業は browser 確認、ユーザー承認、PR push、CI、merge。
- 2026-04-26 23:03+09:00 `review` skill に `claude_design_review` 入力と `claude-design-reviewer` を追加し、Claude Code CLI (`claude -p`) を design review の追加 reviewer として使えるようにした。
- 2026-04-26 23:08+09:00 ユーザー指示に合わせ、design review では `claude-design-reviewer` をデフォルト起動し、追加許可を不要とする standing approval を契約化した。通常 design-reviewer は置き換えず、無効化は `claude_design_review:off` で行う。

変更記録: 2026-04-26 23:52+09:00 review fix loop の current diff に対する `git diff --check` / `mise run verify` 成功、in-app browser での `/about` と `/notes` 確認、ui reviewer / claude-design-reviewer APPROVE を記録した。contract reviewer の残指摘は検証記録不足のみで、この変更で反映した。
