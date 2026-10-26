---
title: Meta のAIエージェント「Muse」が日本上陸――メルカリ・マネフォ・ぴあと連携へ。直前には共有リンクの「DNS 漏れ」も
date: 2026-10-23
order: 4
teaser: 北米以外では初めての提供です。利用者ごとの専用 VM と、監視役のエージェント「Sentinel」で安全性を強調していますが、公開の数日前には、共有した成果物のリンクが公開 DNS から見つかってしまう問題が指摘されていました。
cover: /images/2026-10-24/muse-hero.jpg
cover_caption: Meta の日本向け発表に使われたビジュアル（画像: [Metaについて](https://about.fb.com/ja/news/2026/10/muse-personal-ai-agent-launches-in-japan/)）
---

Meta は10月23日、パーソナル AI エージェント **Muse** の日本での提供を始めました。9月に始まった北米に続く2つ目の地域で、北米以外では初めてです。iOS、Android、Web（muse.ai）で使え、基本的な機能の多くは無料、さらに使いたい人向けにサブスクリプションプランも用意されています。

## 背景

Muse は、質問に答えるだけでなく、利用者に代わって実際に作業を進めるエージェントです。メッセージを送るような感覚で頼みごとを伝えると、計画を立て、ブラウザを開いてフォームに入力するところまで進めます。時間のかかる作業は、アプリを閉じた後も続けます。メールの送信や購入のように承認が必要な場面では、通知して確認を求めます。

## 何が起きたか

- すでに連携しているのは、Gmail、Google カレンダー、Instagram、Stripe、Shopify、Trip.com、Agoda、Klook などです。
- 日本向けには、**メルカリ、マネーフォワード ME、チケットぴあ**との連携を進めるとしています。
- ITmedia NEWS は使い方の例として、「来月の大阪旅行で、予算3万円以内のホテルを探して」と頼むと、カレンダーで予定を確かめ、宿を検索・比較し、フォームに入力するといった流れを紹介しています。
- 先日の Meta Connect で発表された音声モードやアバター「Muse Realtime Avatar（英語のみ）」などの日本での提供については、別途案内するとしています。

### 安全性の仕組み

Muse は、利用者ごとに分けられたクラウド上の専用の仮想マシン **「Muse Secure VM」** で動きます。インターネットへのアクセスは、Muse とは別の **「Sentinel」** というエージェントが管理します。Muse 自身はパスワードや支払い方法を見られず、重要な操作の前には必ず本人に確認します。操作の履歴も確認できます。Meta の AI の学習に使わせない設定（オプトアウト）があり、会話や VM 内のデータは広告システムと共有しないとしています。

## 反応・論点

日本で提供が始まる直前の10月20日、Ars Technica は、セキュリティ企業 Claroc の調査を報じました。Muse で共有したページの URL は `cf.metaaiusercontent.com` の**サブドメインに会話のタイトルが入る**作りになっていて、公開されている DNS の履歴（パッシブ DNS）を検索するだけで約6,800件のリンクが見つかったというものです。中には社内の売上レビューや、融資の申込書もありました。Meta は共有機能をいったん止めました。The Verge によると、22日に修正を済ませて共有を再開し、以前のリンクは新しい URL に置き換えられています。Meta 側は、問題があったのは文書や画像などの「アーティファクト」の共有で、チャットの共有ではないと説明しています。

## なぜ重要か

（編集部の視点）日本の身近なサービスとつながる汎用エージェントが、大手プラットフォームから出てきたのは大きな一歩です。メルカリやぴあなどが連携先になると、「エージェントから自社サービスをどう操作されるか」をサービス側が設計しなければならなくなります。共有リンクの件は、Web の開発者にとって分かりやすい教訓でもあります。**秘密にしたい情報は、サブドメインではなくパスに置く**こと、そして**ホスト名は DNS を通じて外に漏れうる**ことです。

## 参考リンク

- [Metaについて: Meta、パーソナルAIエージェント「Muse」を日本で提供開始](https://about.fb.com/ja/news/2026/10/muse-personal-ai-agent-launches-in-japan/)
- [ITmedia NEWS: 「Muse」日本で提供開始 MetaのAIエージェント、メルカリやマネフォ、ぴあと連携へ](https://www.itmedia.co.jp/news/article/2610/23/2000002535/)
- [Ars Technica: Meta Muse exposes users' personal and business secrets when they share conversations](https://arstechnica.com/security/2026/10/meta-muse-exposes-users-personal-and-business-secrets-when-they-share-conversations/)
- [The Verge: Meta turns Muse sharing back on](https://www.theverge.com/tech/1017066/meta-muse-sharing-back-on-artifiacts)

**動画:** 確認できた関連動画はありません（動画なし）。Meta の発表ページには30秒の日本向けキャンペーン動画が掲載されています。
