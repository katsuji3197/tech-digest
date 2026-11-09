---
title: Claude Fable 5.2 / Mythos 5.2 登場――最上位モデルが速く安くなり、「難所だけ Fable」の使い分けが現実的に
date: 2026-11-09
order: 1
teaser: 出力は 5.1 比で最大30%高速、価格は入力 $8・出力 $40／100万トークン。FrontierCode 2.0 で 49.1%。Fable は全ユーザー、Mythos は審査済み組織のみ。
cover: /images/2026-11-10-extra-claude-fable-5-2/fable-hero.jpg
cover_caption: 発表ページのキービジュアル（画像: [Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2)）
---

Anthropic は日本時間2026年11月10日（火）午前4時ごろ、最上位モデル **Claude Fable 5.2** と **Claude Mythos 5.2** を発表しました。Fable 5.2 は同日から全ユーザーが使え、API のモデル ID は `claude-fable-5-2` です。公式 @claudeai の発表投稿は約660万回表示・約6.7万いいね・約1万ブックマークに達し、X 上の「Fable 5.2」を含む投稿は発表から約4時間で2.6万件を超えました。

## 背景

Fable と Mythos は**同じ基盤モデル**です。Fable にはサイバーセキュリティと生物分野の強い安全装置が付いており、そのため一般公開できます。Mythos はその安全装置を外した版で、Anthropic の Cyber Verification Program や Life Sciences Verification Program で審査を通った組織だけが使えます。前世代の Fable 5.1 / Mythos 5.1 は9月に出ており、約2か月での更新です。CNBC は、9月に Dario Amodei CEO が AI 開発のペースを落とすよう呼びかけて以来、初めてのフロンティアモデル公開であり、上場（IPO）を控えたタイミングだと報じています。

## 何が起きたか

- **速度と価格**: 出力は 5.1 比で最大30%速く、価格は入力 $8・出力 $40（100万トークンあたり）。CNBC によれば 5.1 世代より20%安い。生成を最大2.5倍速くする fast mode は入力 $16・出力 $80。
- **仕様**: コンテキスト 1M トークン、最大出力 128K トークン。Claude API、Amazon Bedrock、Google Cloud、Microsoft Foundry などで提供。
- **ベンチマーク（公式発表）**: 実際の OSS メンテナにマージされるかを測る FrontierCode 2.0 で 49.1%（Xhigh effort）。Opus 5.5 は 45.5%、GPT-6 Astra は 42.8%、Gemini 4 Carbon は 41.1%。FrontierSWE v2 は 69.9%、OSWorld 2.1 は 89.3%。一方、業務ワークフローの AutomationBench では Gemini 4 Carbon（53.9%）が Fable 5.2（51.4%）を上回っています。
- **コスパ**: High effort の Fable 5.2 は FrontierCode で 45.3% と Opus 5.5 の最高値（45.5%）とほぼ同じで、タスクあたりのコストは約半分だといいます。
- **事例**: 1,000 体超のサブエージェントを8日間動かして、ノート PC で起動する試作 OS を作った例や、約1,000 エージェントでフェルマーの最終定理の Lean による形式化を30時間で終えた例が紹介されています。
- **安全装置**: Fable 5.2 の分類器による不要なブロックは、5.1 比で約55%減ったとしています。ブロックされた質問は、サイバー系は Opus 4.8、生物系は Opus 5 が代わりに答えます。蒸留対策も過去最強だとしています。
- **ローンチ特典**: 今週は対象の有料プランに Fable の利用枠リセットが1〜3回付きます。

## なぜ重要か

公式は「日常のコーディングや知識作業は Opus 5.5 から始め、必要に応じて Fable に上げる、または Sonnet / Haiku 5.5 に下げる」と明言しています。さらに Fable 5.2 を Advisor（下位モデルが相談する役）や Orchestrator（簡単な作業を小さいモデルに振る役）として使う構成も挙げています。

フロントエンドのチームにとって実用的なのは、大規模な移行やアーキテクチャの組み替えといった「難所だけ Fable に渡す」運用が、値下げと高速化で現実的になったことです（編集部の視点）。ただし、Arena のレビュー動画の概要欄や Claire Vo 氏のレビューでは、Web の UI デザインは伸びが小さいという評価が出ています。見た目の作り込みはこれまでどおり人のレビューが欠かせません。

## 反応・論点

- 早期テスターとして発表に載った Vercel の Joe Haddad 氏は、「他のモデルで何週間も押していたプロジェクトが数日で終わり、コードレビューの指摘も少なかった」という趣旨のコメントを寄せています。
- Lenny's Newsletter の Claire Vo 氏は2日間試したうえで、動画生成や再設計の仕事は高く評価しました。一方で「Web サイトのデザインを単独で任せるつもりはない」として、Opus 5.5 との使い分けを語っています。
- X では effort（推論量）ごとのコスト比較の投稿が目立ちます。同じプロンプトで High は $24.31、Ultra は $642.42 だったという報告（@0xRhinoX）もあり、effort 設定がコストを大きく左右する点は要注意です。

## 参考リンク

- Anthropic: [Introducing Claude Fable 5.2 and Claude Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- Claude Docs: [Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/overview)
- The Verge: [Anthropic launches new Claude Fable and Mythos 5.2 models](https://www.theverge.com/ai-artificial-intelligence/1030005/anthropic-claude-fable-mythos-5-2)
- CNBC: [Anthropic releases Claude Fable 5.2 and Claude Mythos 5.2 ahead of IPO](https://www.cnbc.com/2026/11/09/anthropic-claude-fable-5-2-mythos-5-2.html)
- Lenny's Newsletter: [Claude Fable 5.2 review: fast, creative, and finally not annoying](https://www.lennysnewsletter.com/p/claude-fable-52-review-fast-creative)
- X: [@claudeai の発表投稿](https://x.com/claudeai/status/2119867114450268322)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
