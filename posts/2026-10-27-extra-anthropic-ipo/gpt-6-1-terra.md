---
title: OpenAI が GPT-6.1 Terra を公開――API 料金は従来の半額、PC 操作とコーディングが大きく向上
date: 2026-10-26
order: 2
teaser: OpenAI の新モデル GPT-6.1 Terra は、入力100万トークン1ドル・出力5ドル。GPT-5.6 Terra や GPT-6.1 Sol より API 料金が50%安く、Terminal-Bench 4.0 のスコアは前モデルの2倍以上です。ChatGPT Work、Codex、API、Amazon Bedrock で使えます。
cover: /images/2026-10-27-extra-anthropic-ipo/terra-hero.jpg
cover_caption: GPT-6.1 Terra の発表画像（画像: [OpenAI](https://openai.com/index/introducing-gpt-6-1-terra)）
---

OpenAI は米国時間10月26日、新しいモデル **GPT-6.1 Terra** を公開しました。速さと安さを重視したモデルで、画面を読み取ってパソコンを操作する力、事実の正確さ、コーディングが前の GPT-5.6 Terra から大きく伸びています。**標準の API 料金は GPT-5.6 Terra と GPT-6.1 Sol より50%安い**とされ、日本の X でも「GPT-6.1 Terra」がトレンド入りしています。

## 背景

OpenAI のモデルは現在、最上位の GPT-6 Astra、その下の GPT-6.1 Sol、速さと安さ重視の Terra という並びになっています。Terra は大量の日常業務を自動化する用途を想定したモデルで、今回はその後継です。OpenAI は、請求書を読んで会計ソフトに入力するような大量の作業を例に挙げています。

## 何が起きたか

- **料金**: 標準 API で入力100万トークンあたり **1ドル**、キャッシュされた入力は0.05ドル、出力は **5ドル** です。
- **提供先**: ChatGPT Work と Codex の Plus、Pro、Enterprise、Edu の全ユーザーが当日から使えます。API のモデル名は `gpt-6.1-terra` です。AWS も同じ日に Amazon Bedrock での一般提供を発表し、入力は最大100万トークン、テキストと画像を受け付けるとしています。
- **PC 操作**: 専門的な作業を集めたベンチマーク「Agents’ Last Exam」で、中程度の推論設定では GPT-5.6 Terra より15ポイント高く、コストは約3分の1です。GPT-6 Astra とほぼ同じ成績を、トークン単価10分の1で出すとしています。最大設定では Claude Opus 5.5 よりトークン効率が3倍以上、単価は4分の1で、1タスクあたりのコストは約9分の1だといいます。処理は GPT-6 Astra や GPT-6.1 Sol より3倍以上速いとされます。
- **正確さ**: 誤りを誘う質問を集めた社内テストで、低い推論設定の誤答率が53.6%から16.7%に下がりました。最大設定では4.3%です。
- **コーディング**: コマンドラインで課題を解く Terminal-Bench 4.0 では、最大設定で50.3%を解き、GPT-5.6 Terra の21.5%から2倍以上になりました。課題の例には「読み込み中にレイアウトがずれる Web ページを直す」が挙がっています。ただし OpenAI 自身、**最も複雑なコーディングには GPT-6.1 Sol や GPT-6 Astra のほうが向いている**と書いています。
- **安全性**: OpenAI の準備態勢フレームワークで、サイバーセキュリティの「Critical」基準に達したとしており、GPT-6 Astra 向けに作った保護策をそのまま適用しています。

## なぜ重要か

（編集部の視点）フロントエンドの現場では、UI の E2E 確認、フォームの入力テスト、デザインの画像からの実装など、「画面を見て操作する」作業を AI に任せる場面が増えています。Terra はまさにこの領域を、上位モデルに近い品質で大幅に安く回せると主張しています。CI で毎回エージェントを走らせるような使い方では、料金の差がそのまま運用コストに効きます。

使い分けとしては、量の多い定型作業や画面操作は Terra、設計判断を含む難しい実装は Sol や Astra、という分け方が OpenAI の説明に沿ったものです。ベンチマークはすべて OpenAI 自身の発表なので、自分たちのタスクで試してから切り替えるのが安全です（編集部の視点）。

## 参考リンク

- [OpenAI: Introducing GPT-6.1 Terra](https://openai.com/index/introducing-gpt-6-1-terra)
- [AWS: OpenAI GPT-6.1 Terra is now generally available on Amazon Bedrock](https://aws.amazon.com/about-aws/whats-new/2026/10/openai-gpt-6-1-terra-on-amazon-bedrock/)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
