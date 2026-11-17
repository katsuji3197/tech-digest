---
title: GPT-6.2 Astra と Sol――Astra は $8／$40 に値下げ、Web デザインの対戦評価で首位。ただしコーディングは「横ばい」の評価も
date: 2026-11-17
order: 1
teaser: OpenAI が GPT-6.2 Astra（最上位）と GPT-6.2 Sol（普段使い）を公開。Astra の API 料金は2割下がり、AA-3D や Agents' Last Exam で首位を主張します。一方で Artificial Analysis はコーディング性能を「横ばい」とし、Theo Browne 氏らは厳しく批判しています。
cover: /images/2026-11-18-extra-gpt-6-2/gpt-6-2-hero.jpg
cover_caption: GPT-6.2 Astra と Sol の発表画像（画像: [OpenAI「Introducing GPT-6.2 Astra and Sol」](https://openai.com/index/introducing-gpt-6-2-astra-sol/)）
---

OpenAI は米国時間11月17日（**日本時間18日未明**）、新しい最上位モデル **GPT-6.2 Astra** と、普段使い向けの **GPT-6.2 Sol** を公開しました。どちらも同日から ChatGPT Work と Codex（Plus、Pro、Enterprise、Edu）、そして API（`gpt-6.2-astra`、`gpt-6.2-sol`）で使えます。OpenAI は「Web サイトやゲーム、3D のフロントエンドがより良く作れる」とうたっています。X では「GPT-6.2」を含む投稿が17日（UTC）の1日で約1万7,000件と、前日の15倍近くに増えました。

## 背景

8日前の11月10日、Anthropic が Claude Fable 5.2 と Mythos 5.2 を同じ $8／$40（100万トークンあたり）で出し、評判を集めていました。Google も Gemini 4 Carbon の提供を広げています（VentureBeat）。GPT-6.2 は、この競争に対する OpenAI の答えです。

## 何が起きたか

- **料金（100万トークンあたり）**: Astra は入力 **$8**、キャッシュ入力 $0.40、出力 **$40**。GPT-6 Astra より入出力が20%安く、キャッシュ入力は60%安い。Sol は GPT-6.1 Sol と同じ入力 $2、キャッシュ入力 $0.10、出力 $10（OpenAI）
- **主なベンチマーク（OpenAI 発表）**
  - Agents' Last Exam（長い手順の実務）: Astra が GPT-6 Astra より5.2ポイント高く、コストは3分の1未満。Claude Fable 5.2 より5.5ポイント高く、コストは5%
  - FrontierCode 2.0（実際のコードベースへの変更）: Sol は Astra に0.5ポイント差まで迫り、コストは約5分の1
  - AA-3D（人が2つの 3D 体験を見比べて投票）: Astra が **1,318 Elo で首位**、Claude Fable 5.2 が1,271、Sol が1,259
- **Web デザイン**: 「視覚的な推論が強くなり、サイトごとに個性のあるレイアウトや画像を選ぶ」とし、ピンボール台やコロッセオを文章から作る例を見せています
- **安全面**: Astra は、OpenAI が外部に出すモデルとして初めて「AI の自己改良」で High の水準に達したと説明。サイバーでは Critical の水準で、セキュリティ関連の依頼への制限を強めています
- **Codex での注意**: 2つのテストで、作業を止めた障害（ファイルがない、検索ツールが使えないなど）を報告しない傾向が増えたと OpenAI 自身が認め、Codex に対策の指示を加えたとしています。キャッシュを効かせるため、プロンプトの先頭は変えずに指示を後ろへ足すよう勧めています

## なぜ重要か

最上位モデルの値段が Claude Fable 5.2 と同じ $8／$40 にそろいました。Sol は $2／$10 のまま性能が上がっています。UI の生成やコードレビューを Sol に任せ、難しい設計だけ Astra に回す、といった使い分けがしやすくなります。（編集部の視点）

ただし、発表のグラフと第三者の評価には差があります。Artificial Analysis によると、Codex で測ったコーディングエージェントの指数で Astra は GPT-6 Astra と同じ、Sol は3ポイント下がりました（The Decoder）。乗り換える前に、自分のリポジトリでいつものタスクを流して比べるのが安全です。（編集部の視点）

## 反応・論点

- **厳しい声**: Matt Shumer 氏は X で「ほとんど使い物にならなかった」として、恒例の詳しいレビューを出さないと表明。Theo Browne 氏は「OpenAI がこれまでに出した中で最悪のモデル」と書きました（VentureBeat）
- **割れる評価**: Ethan Mollick 氏は、Blender と Unity で遊べる宇宙エレベーターを作れた一方、「とてもムラがあって奇妙」で操りにくいと評しました。Every の Dan Shipper 氏は、デザインの初期感覚は褒めつつ、作業を途中でやめがちで、出力に「はっきりした決まった作風」があると指摘しています（VentureBeat）
- **第三者の評価**: Artificial Analysis の総合指数で Astra は62点の2位（首位は Claude Fable 5.2 の65点）で、コストあたりの性能では OpenAI が優位。Epoch AI の指数では Astra と Fable 5.2 が174点で並びました（The Decoder）

## 参考リンク

- OpenAI: [Introducing GPT-6.2 Astra and Sol](https://openai.com/index/introducing-gpt-6-2-astra-sol/)
- VentureBeat: ['Essentially unusable': OpenAI launches GPT-6.2 Astra and Sol to negative reception from AI power users](https://venturebeat.com/technology/essentially-unusable-openai-launches-gpt-6-2-astra-and-sol-to-negative-reception-from-ai-power-users)
- The Decoder: [OpenAI launches GPT-6.2 Astra and Sol with lower API prices and some benchmark gains](https://the-decoder.com/openai-launches-gpt-6-2-astra-and-sol-with-lower-api-prices-and-some-benchmark-gains/)
- Hacker News: [GPT‑6.2 Astra and Sol](https://news.ycombinator.com/item?id=50535230)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
