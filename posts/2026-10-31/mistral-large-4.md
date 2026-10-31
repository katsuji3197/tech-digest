---
title: Mistral が1兆パラメータの「Mistral Large 4（Le Chonk）」の重みを公開――オープンウェイトでコーディング首位をうたう欧州発モデル
date: 2026-10-29
order: 6
teaser: プレビューから3週間、強化学習を続けた最終版の重みが Hugging Face で公開されました。Terminal-Bench 4.0 はプレビュー時の28%から41%に上がっています。ただし、ライセンスは純粋な MIT ではありません。
cover: /images/2026-10-31/mistral.jpg
cover_caption: Mistral の発表ページのカバー画像（画像: [Mistral AI](https://mistral.ai/news/mistral-large-4-oss/)）
---

フランスの Mistral AI は10月29日、フラッグシップモデル **Mistral Large 4（愛称 Le Chonk）** の重みを Hugging Face で公開しました。総パラメータは約1兆の MoE（Mixture of Experts）モデルで、Mistral は「コーディングで最も優れたオープンウェイトモデル」だとしています。サイバーセキュリティの評価では、悪意ある依頼を平均96.6%拒否しながら、Artificial Analysis Cyber Index で51%を記録したとしています。

## 背景

Mistral Large 4 は10月上旬にパブリックプレビューとして公開されていました。Mistral によると、その後**3週間の追加の強化学習**で、コーディングと防御的なサイバーセキュリティの性能を大きく伸ばしたといいます。欧州のインフラでゼロから学習しており、Mistral はこれを「ソブリン AI（自国・自組織で管理できる AI）」の基盤として打ち出しています。

## 何が起きたか

Hugging Face のモデルカード（`mistralai/Mistral-Large-4-1T-A52B`）によると、仕様は次の通りです。

- **規模**: 総パラメータ約1兆、アクティブ49B（埋め込みを含めると52B）。128のルーテッドエキスパートのうち4つと、共有エキスパート1つが動く
- **入出力**: テキストと画像を入力し、テキストを出力。コンテキストは100万トークンで、160以上の言語に対応
- **配布**: メモリ消費を抑えた NVFP4 の量子化チェックポイントも公開（Blackwell GPU 向け）
- **学習**: 欧州にある Mistral 自身のデータセンターで、NVIDIA Grace Blackwell GPU 3,800基を使ってゼロから学習
- **使える場所**: Mistral Studio、Mistral API、OpenRouter、Microsoft Foundry（クラウド事業者として最初）。自前ホストなら vLLM（推奨）や SGLang

Mistral の発表によるベンチマークは次の通りです。

- **Terminal-Bench 4.0**: プレビュー比13ポイント増の41%で、オープンウェイトモデルで首位。出力トークンは30%減った
- **Cognition の FrontierCode 2.0**: 19.7%で首位
- **Artificial Analysis Coding Agent Index**: 48%で GLM-5.3 とほぼ並び、タスクあたりのトークンは平均47%少ない

推論の深さを Low、Medium、High（既定）の3段階で選べるようにもなりました。

## なぜ重要か

（編集部の視点）コーディングエージェントを自社の環境で動かしたい企業にとって、**1兆パラメータ級でも重みを手元に持てる**選択肢が欧州から出たことは大きいです。ただし、ライセンスは「Mistral Ecosystem Open-Weight License」という**改変版 MIT**で、モデルをサービスとして他社に提供する（Model-as-a-Service）事業には別途商用ライセンスが必要です。社内で使う分には問題になりにくいものの、SaaS に組み込んで外部に提供する場合は条文を確認する必要があります。また、アクティブ52Bでも全体の重みは巨大なので、手元で動かすには相応の GPU が必要です。

## 反応・論点

Mistral は完全な技術レポートを「近日公開」としており、現時点のベンチマークは Mistral 自身の発表と、Cognition や Artificial Analysis など一部の評価に限られます。X では「Mistral Large 4」を含む投稿が約2,800件ありました。

## 参考リンク

- [Mistral AI: Mistral Large 4 (Le Chonk) is now open weight](https://mistral.ai/news/mistral-large-4-oss/)
- [Hugging Face: mistralai/Mistral-Large-4-1T-A52B](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B)
- [SiliconANGLE: Mistral releases open weights for Mistral Large 4, providing sovereign control for the company’s ‘Le Chonk’ AI model](https://siliconangle.com/2026/10/29/mistral-releases-open-weights-for-mistral-large-4-providing-sovereign-control-for-the-companys-le-chonk-ai-model/)
- [TechCrunch: Mistral releases weights for its trillion-parameter AI model, targeting cybersecurity](https://techcrunch.com/2026/10/29/mistral-releases-weights-for-its-trillion-parameter-ai-model-targeting-cybersecurity/)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
