---
title: Google「Gemini 4 Neon」公開――Carbon 並みの賢さを約半分のコストで、入力 $3／出力 $15。Artificial Analysis で総合3位・コーディングエージェント指数1位
date: 2026-11-18
order: 2
teaser: Google が Gemini 4 ファミリーの中位モデル Gemini 4 Neon を公開しました。上位の Carbon と同等以上の性能を、より速く安く出すという位置づけで、Argon を置き換えます。X では今週もっとも投稿の多かった技術トピックの一つです。
cover: /images/2026-11-21/gemini-4-neon-hero.jpg
cover_caption: Google 公式ブログ「Introducing Gemini 4 Neon」のヘッダー画像。ネオン管で「Gemini 4 Neon」と書かれている（画像: [Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/)）
---

Google は11月18日（米国時間、日本時間19日朝）、**Gemini 4 Neon** を公開しました。Google DeepMind の Koray Kavukcuoglu 氏は、複雑なソフトウェア開発や知的作業、科学のワークフローで「フロンティア級の知能」と速いタスク完了を両立するモデルだと説明しています。先週の Carbon・Hydrogen に続く投入で、Artificial Analysis は「7週間で4つ目のモデル」と数えています。

## 背景

9to5Google によると、Neon の公開前の Gemini 4 は、日常向けの **Hydrogen**、コードと分析向けの **Argon**、最も難しい作業向けの **Carbon** の3つでした。Neon は Hydrogen と Carbon の間に入り、Argon を置き換えます。Gemini アプリでは AI Pro／Ultra 向けに提供され、3.1 Pro は姿を消しました。モデル選択は「Auto」「4 Hydrogen」「4 Neon」「4 Carbon」の4つになります。

## 何が起きたか

- **価格**: 入力100万トークンあたり **$3**（キャッシュ入力は $0.15、95%引き）、出力 **$15**。コンテキストは100万トークンで、出力も背景実行などで最大100万トークンまで伸ばせます。9to5Google は Hydrogen の2倍の価格だと指摘しています。Argon と Carbon は11月30日までのキャンペーン価格（入力 $2／出力 $10）が終わると入力 $4／出力 $20 になり、その時点で Neon の方が25%安くなります。
- **思考レベル**: `low`、`medium`、`high`（既定）、`xhigh` の4段階です。モデル ID は `gemini-4-neon` です。
- **性能（Google 発表）**: Artificial Analysis Intelligence Index で61点（xhigh）の総合3位、Artificial Analysis Coding Agent Index で58.6の1位、Terminal-Bench 4.1 で65.2%、Vals Index で2位（70.9%）。既定の high では、Carbon より1タスクあたりのコストが32%低いとしています。
- **提供先**: Gemini API の有料枠（Google AI Studio）、Gemini for business、AI Pro／Ultra 向けの Google Antigravity（デスクトップ、CLI、IDE 拡張）と Gemini アプリです。防御側のセキュリティ担当者向けには Fairwind Program で順次提供します。

Google は、Antigravity 上の Neon が WebGL2 で一人称視点のスキーシミュレーターを、既製アセットなしに1万200行のシェーダーなどで書き上げた例も示しました。

## なぜ重要か

（編集部の視点）フロントエンドの現場では、上位モデルは賢いが遅くて高く、軽量モデルは速いが複数ファイルの修正で崩れる、という使い分けの悩みがありました。Neon は「Carbon 並みの品質を日常の頻度で回せる価格」を狙ったモデルで、リポジトリ単位のリファクタリングやデバッグを日常的にエージェントへ任せるチームほど恩恵があります。一方、ブランド名だけでは序列が分かりにくく、`gemini-4-neon` を採用する前に自分のリポジトリで Carbon と並べて比べるのが確実です。

## 反応・論点

- **Artificial Analysis** は、Neon（xhigh）は Carbon より知能がわずかに高く、1タスクのコストは約17%低いと評価しました。出力速度は毎秒約110トークンで Carbon（約57）のほぼ倍です。一方で、1タスクのコストは GPT-6.2 Astra（max）の約1.6倍だとも書いています。
- **Vals AI** は、Neon が Vals Index で Claude Fable 5.2 に0.4ポイント差の2位に入ったと投稿し、Demis Hassabis 氏がこれをリポストしました。
- **Simon Willison 氏**は恒例の「自転車に乗るペリカン」テストで Carbon・Neon・Hydrogen を比べたうえで、「Neon はタスクによっては Carbon より良いのか」「Argon は事実上引退なのか」と疑問を投げかけています。
- X では Gemini 4 Neon に触れた投稿が11月19日（UTC）だけで約2万件に達し、Sundar Pichai CEO の告知投稿は200万回以上表示されました（X の投稿数集計と投稿の表示回数による）。

## 参考リンク

- [Google Blog: Introducing Gemini 4 Neon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/)
- [Google AI Studio: What's new in Gemini 4 Neon](https://aistudio.google.com/docs/whats-new-gemini-4-neon)
- [Google DeepMind: Gemini 4 Neon - Model Card](https://deepmind.google/models/model-cards/gemini-4-neon/)
- [Google Antigravity Blog: Gemini 4 Neon in Google Antigravity](https://antigravity.google/blog/gemini-4-neon-in-google-antigravity/)
- [9to5Google: Google launches Gemini 4 Neon with Carbon quality at Flash speeds, live for AI Pro](https://9to5google.com/2026/11/18/gemini-4-neon-announcement/)
- [X: Artificial Analysis による Gemini 4 Neon の評価](https://x.com/ArtificialAnlys/status/2123170645777526962)
- [X: Simon Willison「So is Gemini 4 Neon better than Gemini 4 Carbon for some tasks then?」](https://x.com/simonw/status/2123808432830701909)

## 関連動画

[![YouTube: Gemini 4 Neon Is Here, And It’s a Beast!（Prompt Engineering）](/images/2026-11-21/yt-Q0ShBenKyqo.jpg "Gemini 4 Neon Is Here, And It’s a Beast! — Prompt Engineering（YouTube, 2026年11月18日。投稿者は Google に入社済みで、先行アクセスでの試用と明記）")](https://www.youtube.com/watch?v=Q0ShBenKyqo)
