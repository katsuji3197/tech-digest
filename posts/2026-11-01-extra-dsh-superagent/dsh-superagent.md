---
title: DeepSeek「dsh-superagent」とは――1つのルーターと並列ワーカーで、人の注意を使わずに GitHub の仕事を片付ける
date: 2026-11-01
order: 1
teaser: GitHub（と任意で Feishu）を監視し、許可された人の依頼をチケットにして、チケットごとに独立したセッションとディレクトリで作業、結果を PR で元のスレッドに返す。MIT ライセンスの研究用プロトタイプで、公式製品ではない。
cover: /images/2026-11-01-extra-dsh-superagent/dsh-harness.jpg
cover_caption: DeepSeek Harness のロゴ。dsh-superagent はこの Harness 上で動くバンドルとして配布されている（画像: [DeepSeek Harness 公式サイト](https://www.deepseek.com/en/harness/)）
---

DeepSeek の Harness チームが10月31日、GitHub リポジトリに常駐して依頼をこなすコーディングエージェントの研究用プロトタイプ **dsh-superagent** を、MIT ライセンスで [GitHub](https://github.com/deepseek-ai/dsh-superagent-prototype) に公開しました。リポジトリの作成は日本時間10月31日18時32分で、11月1日18時過ぎの時点でスターは4,602、フォークは426。X では「dsh-superagent」を含む投稿が10月31日21時（日本時間）ごろから増え始め、11月1日18時までに829件、日中はほぼ毎時50〜60件のペースで続いています。

## 背景

Investing.com によると、DeepSeek は今年、米国の AI 研究所の製品と競えるエージェントを開発する専任の Harness チームを立ち上げていました。「ハーネス」とは、モデルの周りでタスクの調整やツール呼び出しを担うソフトウェア基盤のことです。発表は10月31日（土）に同チームが WeChat で行い、Bloomberg（11月1日12時48分、日本時間）は「Anthropic の Claude Code に対抗する、より自律的なコーディングエージェント」と報じました。同時に「Exploring Super-agent Design: Towards a More Autonomous Agent System」という設計論の記事も出ています。

## dsh-superagent とは

README の説明は「1つの GitHub リポジトリのための、能動的なコーディングエージェント。DeepSeek Harness 用のバンドルとして提供する」。GitHub と、任意で Feishu（飛書）を監視し、許可された人がエージェントに依頼すると作業項目（Ticket）を開き、専用のエージェントセッションとディレクトリで作業して、元の会話に答えます。答えは例えば PR です。人の対応が必要なものだけを表示する Web パネル（既定はポート 3082、ループバックのみ）も付きます。

設計の中心は「**人の注意をできるだけ使わず、できるだけ大きな価値を返す**」という原則です。エージェントが動くのは依頼されたときか、チームが書いたルールが許すときだけ。話しかけるのは、人が何かをする必要があるときか、結果が使えるときだけと定めています。

## 何ができるか（仕組み）

![dsh-superagent の構成を1枚にまとめた解説図。ソース、ゲート、ルーター、チケットごとのワーカーという流れ](/images/2026-11-01-extra-dsh-superagent/dsh-lvwerra.jpg "Router が判断し、チケットごとのワーカーが並列に作業して同じスレッドに返す（画像: [Leandro von Werra 氏の X 投稿](https://x.com/lvwerra/status/2116634303073321237)）")

- **Trigger → Eval → Ticket。** GitHub や Feishu のイベントが Trigger になり、まず送り主を許可リストで機械的にふるい分け、残りをメインセッション（Router）のモデルが判断して、受ける・既存の仕事に付ける・止める・無視するを決めます。
- **チケットごとのワーカー。** 受けた Ticket には1つのワーカーセッションと1つのディレクトリ（通常は git worktree）が割り当てられ、`maxWorkers` の上限まで並列で動きます。PR に後から付いたコメントは、ルーターを通さず担当ワーカーに直接届きます。
- **長いコマンドは自動で裏へ。** ワーカーのシェルは5秒でバックグラウンドジョブに移り、作業中でも新しいメッセージを次のステップで受け取れます。ターン後のバックグラウンド作業は最長30分です。
- **3つの受け入れモード。** 頼まれていない「先回りの仕事」は、`off`、`observe`（既定。「受けていたはず」と記録するだけ）、`auto` の3段階。明示的な依頼はどのモードでも動きます。

## なぜ今話題なのか

DeepSeek が出したのがモデルの重みではなく、エージェントの運用設計そのものだったからです。Hugging Face の Leandro von Werra 氏が日本時間11月1日5時51分に投稿した紹介は、約7.9万回表示、1,274件のいいね、1,333件のブックマークを集めました。AIReport.NET によると、設計論の記事には同チームの社内シミュレーション（約300メッセージ・20件の依頼）で、タスク完了時間の中央値が12.4分、単一セッション方式は95パーセンタイルで29.5分だったという数字もあります（いずれもベンダー自身の数字）。

## 使い方

README の推奨は、セットアップ自体をコーディングエージェントに任せることです。リポジトリを手元に置き、エージェントにこう頼みます。

> Read SETUP.md in this repository and set up dsh-superagent with me.

エージェントが1問ずつ質問し、計画を一度見せてからインストールと設定を行います。前提は Node.js 22.19+ か 24+、pnpm、git 2.32+、tmux、Python 3.8+、GitHub CLI 2.48+、DeepSeek Harness（DSH）と、DSH に設定したモデルプロバイダーです。手動の場合のインストール手順（docs/006-deployment.md）は次のとおりです。

```sh
npm install -g @deepseek-ai/dsh@0.2.1-rc.3
git clone <this repository> dsh-superagent && cd dsh-superagent
pnpm install && pnpm build
dsh superagent --from-default-profile web --dump-config > /dev/null
dsh plugin --profile superagent add "link:$PWD"
```

起動と状態確認は次の2つ。

```sh
scripts/dsh-superagent start
scripts/dsh-superagent status
```

エージェント専用の GitHub アカウントを作り、そのアカウントだけでログインした `gh` のラッパー（例 `gh-agent`）を用意するのが前提です。試すときは、許可リストにあるアカウントから Issue に `@<agent login> <request>` とコメントすると、1分ほどでパネルに Ticket が現れます。

## 料金・ライセンス

コードは **MIT ライセンス**で無料。ただし実際の推論は DSH に設定したモデルプロバイダーで行うので、その利用料は別にかかります。

## 注意点・制限

- **研究用プロトタイプ。** README の冒頭に「公式製品ではない」「本番向けではなく、バグもありうる」とあり、多くの部分をコーディングエージェントが書いたとも明記しています。公開版は社内版とも設計論の記事とも同じではなく、記事にある設計の一部は未実装です。
- **ワーカーはあなたの OS ユーザーで、承認なしに動く。** ワーカーとルーターのプリセットは `danger-full-access` で、ホームディレクトリも読めます。名前に KEY・PASSWORD・SECRET・TOKEN を含む環境変数の除去や `GH_TOKEN` の削除などの防護はありますが、ドキュメント自身が「隔離するなら、エージェントの認証情報だけを置いた専用の OS アカウントを使う」よう求めています。
- **対象は github.com の1リポジトリ。** GitHub Enterprise Server は非対応で、GitHub App はエージェントになれません（通知を読むため、ユーザーアカウントが必要）。
- **Issue 本文の編集でメンションを足しても届かない。** 新しいコメントで呼ぶ必要があります。

## 似たものとの違い

Claude Code や Codex は、人が1つのセッションで指示し、エージェントが作業して次の指示を待つ形が基本です。dsh-superagent は、DeepSeek が Weibo の投稿で語ったとされるとおり（Stocktwits の報道）、「複数の仕事が同時に走るとき、ボトルネックはモデルではなく人の注意だ」という考えから、常駐する Router と並列の Worker に分けています。

## なぜ重要か

（編集部の視点）フロントエンドのチームでよくある「依存の更新」「型エラーの修正」「小さな UI の不具合」といった細かい Issue を、コメント1つで PR にして返してくれる形は、レビューさえ回せればチームの手を大きく空けます。一方で、エージェントが毎日見るアカウントの名前で PR やコメントを出す以上、「誰が頼めるか」「先回りをどこまで許すか」を Policy として書くことが、ツール選び以上に大事になります。observe モードで記録だけ取り、狭い許可リストから始めるという README の勧めは、他のエージェントを入れるときにもそのまま使える考え方です。

## 反応・論点

- Bloomberg と Investing.com は、Anthropic の Claude Code への対抗という文脈で報じました。
- DEV Community の記事は「既定は observe モードだが、ワーカーはあなたとして全権限で動く」と題し、専用 OS アカウントでの運用を強く勧めています。
- Nvdium は「名前の最後が prototype であり、価格表で買える DeepSeek の製品ではない」と、過度な期待をいさめています。

## 参考リンク

- GitHub: [deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)
- GitHub: [SETUP.md](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/SETUP.md)
- GitHub: [006 Deployment](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/006-deployment.md)
- DeepSeek: [DeepSeek Harness](https://www.deepseek.com/en/harness/)
- Bloomberg: [DeepSeek Drops Enhanced Coding Agent With Aim to Rival Anthropic](https://www.bloomberg.com/news/articles/2026-11-01/deepseek-drops-enhanced-coding-agent-with-aim-to-rival-anthropic)
- Investing.com: [DeepSeek launches autonomous coding agent to challenge Anthropic’s Claude Code](https://www.investing.com/news/company-news/deepseek-launches-autonomous-coding-agent-to-challenge-anthropics-claude-code-4989391)
- AIReport.NET: [dsh-superagent: DeepSeek Team Publishes MIT-Licensed Prototype for Always-On Multi-Session Coding Agents](https://www.aireport.net/Gn_5c6bf5b85c96)
- DEV Community: [DeepSeek's Super-agent Defaults to Observe Mode, but Its Workers Get Full Access as You](https://dev.to/gabrielanhaia/deepseeks-super-agent-defaults-to-observe-mode-but-its-workers-get-full-access-as-you-427)
- X: [Leandro von Werra 氏の紹介投稿](https://x.com/lvwerra/status/2116634303073321237)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
