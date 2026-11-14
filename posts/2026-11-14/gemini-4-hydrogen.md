---
title: Google「Gemini 4 Hydrogen」公開――Flash の後継は入力 $1.50／出力 $7.50、Cursor・GitHub Copilot にも即日〜翌日対応
date: 2026-11-12
order: 5
teaser: Google が日常的なコーディングやエージェント作業向けの高速モデル Gemini 4 Hydrogen を公開しました。Gemini 3.8 Flash より2.5倍速く、Terminal-Bench 4.1 のスコアは3倍以上。API、AI Studio、Gemini アプリ、検索に一斉に投入されています。
cover: /images/2026-11-14/gemini-4-hydrogen-hero.jpg
cover_caption: Google 公式ブログの Gemini 4 Hydrogen キーアート（画像: [Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/)）
---

Google は11月12日（米国時間、日本時間13日未明）、Gemini 4 ファミリーの高速モデル **Gemini 4 Hydrogen** を公開しました。「Flash」の名前を引き継がず、日常的なコーディングとエージェント作業を速く安く回すための位置づけです。同じ週の10日には上位モデル Gemini 4 Carbon も有料の開発者向けに開放されており、Sundar Pichai CEO は今週の発表として TPU、Carbon、Hydrogen などを並べました。

## 背景

Gemini 4 世代では、深い推論を担う **Carbon** と **Argon** が先に出ていました（Carbon の発表は[10月29日の号外](/posts/2026-10-29-extra-touch-mac/gemini-4-carbon/)で既報）。Hydrogen は、9月に出た Gemini 3.8 Flash の後継にあたる量産向けモデルです。Google の Koray Kavukcuoglu 氏は「最先端の知能をすべての人に」と打ち出しています。

## 何が起きたか

- **性能**: Artificial Analysis Intelligence Index で、既定の high 思考レベルでは51と Argon（50）を上回り、最高の xhigh では54に達します。9to5Google が伝えた Google の説明では、3.8 Flash と比べてタスク完了が2.5倍速く、Terminal-Bench 4.1 は57%（3.8 Flash は18.2%）、事実でない主張の生成は5分の1以下に減りました。
- **価格**: 100万トークンのコンテキスト全体で一律、入力100万トークンあたり **$1.50**、出力 **$7.50** です。
- **提供先**: Gemini API（AI Studio、Android Studio）、Gemini for business、Gemini アプリ、Google 検索（AI モードの既定モデル）、Google AI Pro / Ultra の有料会員向け Antigravity です。Antigravity では、Carbon と Hydrogen を同じセッションの中で切り替える新オプション **Orchestrator** も始まりました。
- **他社ツール**: Cursor は公開当日に対応し、既定の設定で CursorBench 54.3%（3.8 Flash は39.6%）と発表しました。GitHub も13日（米国時間）に、GitHub Copilot のアプリ、CLI、VS Code で一般提供を始めたと告知しています。

## なぜ重要か

（編集部の視点）フロントエンドの現場では、UI の小さな修正、テストの追加、型エラーの解消といった**回数の多い軽い作業**こそ、エージェントのコストと待ち時間が効いてきます。上位モデルに近い指標を保ちながら、出力単価が $7.50 に収まる高速モデルが Cursor や Copilot の選択肢に並んだことで、用途ごとにモデルを使い分ける設計が現実的になりました。Antigravity の Orchestrator のように、計画は上位モデル、実装と検証は Hydrogen に任せる構成も、自前のエージェント基盤で試す価値があります。ただし、ベンチマークの数字は Google 自身と提携先の発表です。自分たちのリポジトリで計測してから乗り換えを判断しましょう。

## 反応・論点

- Artificial Analysis は、Hydrogen の知能指標は Claude Sonnet 5.5 と GPT-6.1 Sol のすぐ下で、コストは Sonnet の約3分の1、GPT-6.1 Sol の約2.5倍だと分析しました。また Google のモデルとしては AA-Robotics v0.1 で最上位（全体4位）としています。
- Google の Logan Kilpatrick 氏の告知投稿は、X で約275万回表示されました。
- 「Gemini 4 Hydrogen」を含む X の投稿は、公開翌日の11月13日（UTC）に1日1万件を超えています（X の投稿数カウント）。

## 参考リンク

- [Google Blog: Introducing Gemini 4 Hydrogen](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/)
- [Google Blog: Gemini 4 Hydrogen: everyday coding and agentic workflows for developers](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-4-hydrogen/)
- [Google Antigravity Blog: Gemini 4 Hydrogen and Orchestrator](https://antigravity.google/blog/gemini-4-hydrogen-in-google-antigravity/)
- [9to5Google: Google announces Gemini 4 Hydrogen with ‘significant leaps’ in speed, intelligence](https://9to5google.com/2026/11/12/gemini-4-hydrogen-launch/)
- [X: Cursor の対応告知](https://x.com/cursor_ai/status/2120944639633211619)
- [X: GitHub の Copilot 一般提供告知](https://x.com/github/status/2121319695626518823)
- [X: Artificial Analysis の分析](https://x.com/ArtificialAnlys/status/2120941511223185722)

**動画:** 確認できた関連動画はありません（動画なし）。
