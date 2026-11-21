---
title: Microsoft が Ignite で自社コーディングモデル「MAI Code 2」を投入――GPT-6.1 Sol の98%の性能を4割の価格で、GitHub Copilot で即日一般提供
date: 2026-11-17
order: 3
teaser: Microsoft は Ignite 2026 で、自社開発の MAI モデル群を発表しました。中心は日常的なコーディング向けの MAI Code 2 と MAI Code 2 Flash で、GitHub Copilot のモデル選択に即日加わりました。OpenAI 頼みだった Microsoft が、価格で正面から勝負に出ています。
cover: /images/2026-11-21/mai-code-2-hero.jpg
cover_caption: Microsoft AI による MAI Code 2／MAI Code 2 Flash の発表画像。「Frontier price-performance for everyday enterprise coding tasks」とある（画像: [Microsoft AI](https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/)）
---

Microsoft は11月17日（米国時間、日本時間18日）、サンフランシスコで開いた年次イベント **Ignite 2026** で、自社の Microsoft AI（MAI）チームが開発した新モデル群を発表しました。目玉は、企業の日常的なコーディング作業向けの **MAI Code 2** と、軽量版の **MAI Code 2 Flash** です。同日、GitHub Copilot で一般提供が始まりました。

## 背景

Microsoft はこれまで、Copilot をはじめとする製品の最先端モデルを主に OpenAI に頼ってきました。Axios によると、Microsoft AI の Mustafa Suleyman CEO は、特定の用途に絞ったモデルを作ることで「同じパラメーター数により多くの知識と専門性を詰め込める」と説明しています。汎用のフロンティアモデルも開発中ですが、公開時期は明かしていません。

## 何が起きたか

- **MAI Code 2**: Microsoft によると、DeepSWE 1.1、Terminal Bench 2.1、SWE-Atlas、FrontierCode v1.1 の平均で、**GPT-6.1 Sol の98%の性能を40%の価格**で、**Claude Opus 5.5 の96%の性能を5%の価格**で出します。深いデバッグ、複数ファイルの実装、リポジトリ全体の推論、UI が得意分野とされています。
- **MAI Code 2 Flash**: コードの説明、狙った箇所の修正、定型的な修正など大量の作業向けです。GPT-6 Luna と同等の性能を65%の価格で、Claude Haiku 5.5 と同等を20%の価格で出すとしています。
- **フロントエンド**: ダッシュボードや可視化、ビジュアルなコーディングにも調整されており、UI、ゲーム、データ可視化、3D、SVG を対象にした目隠し比較では、開発者が GPT-6 Sol より MAI Code 2 の結果を **64%** の割合で選んだといいます（評価者258人）。
- **GitHub Copilot**: MAI Code 2 は Pro、Pro+、Max、Business、Enterprise で、Flash は Free と Student を含む全プランで使えます（年額プランの対象者）。VS Code、Visual Studio、Copilot CLI、JetBrains、Xcode などのモデル選択から選べ、使用量ベースで課金されます。12月には旧モデル MAI-Code-1.1-Flash の提供終了も予告されました。
- **そのほか**: セキュリティ向けの MAI Cyber 2 Flash、画像編集で首位をうたう MAI Image 2.7、音声対話の MAI Realtime 1 なども発表しました。企業が MAI モデルの重みをライセンスし、Azure 内で自社データを使って調整できる **MAI Licensed Weights** も始めます。

![GitHub Copilot のモデル選択に MAI Code 2 と MAI Code 2 Flash が並ぶ告知画像](/images/2026-11-21/mai-code-2-2.png "GitHub Copilot のモデル選択で MAI Code 2 を選んでいる告知画像（画像: [GitHub Changelog](https://github.blog/changelog/2026-11-17-mai-code-2-and-mai-code-2-flash-in-github-copilot/)）")

## なぜ重要か

Copilot Business／Enterprise では、管理者が全体の既定設定を切っていない限り、新モデルは自動で有効になります。チームの Copilot に、きょうから MAI Code 2 が選択肢として出ている可能性があります。（編集部の視点）価格差が大きいので、コンポーネントの量産、テストの追加、定型的なリファクタリングのような「量の多い仕事」から切り替えを試す価値があります。一方、Microsoft 自身が科学研究や非常に長いエージェント作業には**まだ調整していない**と明記しています。設計判断を伴う大きな変更は、従来の上位モデルと比べてから任せるのが安全です。Business／Enterprise の管理者は、データの扱いを含めてモデルポリシーを確認しておきましょう。

## 反応・論点

- Axios は、Microsoft の比較は**選ばれたベンチマーク**に基づき、価格の優位の一部は**キャンペーン割引**によるものだと注意を促しています。実際、Microsoft の注記でも MAI Code 2 のコストは50%のキャンペーン価格で計算されています。
- 同じ日に OpenAI は GPT-6.2 Astra／Sol を発表しました（[号外で既報](/posts/2026-11-18-extra-gpt-6-2/gpt-6-2-astra-sol/)）。Axios は、Copilot の利用の一部が外部モデルから自社モデルへ移る可能性を指摘し、Suleyman 氏は移行の目標は示さずに「かなりの採用」を見込むと答えています。
- Microsoft は OpenRouter、Vercel、OpenCode などでも近く提供するとしており、Copilot 以外での評価はこれからです。

## 参考リンク

- [Microsoft AI: MAI Code 2 and Code 2 Flash: Everyday coding at scalable prices](https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/)
- [Microsoft AI: Seven new world-class models at scalable price-performance](https://microsoft.ai/news/microsoft-ignite-2026/)
- [GitHub Changelog: MAI Code 2 and MAI Code 2 Flash in GitHub Copilot](https://github.blog/changelog/2026-11-17-mai-code-2-and-mai-code-2-flash-in-github-copilot/)
- [GitHub Changelog: Upcoming deprecation of MAI-Code-1.1-Flash in December](https://github.blog/changelog/2026-11-17-upcoming-deprecation-of-mai-code-1-1-flash-in-december/)
- [The Official Microsoft Blog: Ignite 2026: Building the frontier ecosystem](https://blogs.microsoft.com/blog/2026/11/17/ignite-2026-building-the-frontier-ecosystem/)
- [Axios: Microsoft debuts six AI models as it pushes toward frontier](https://www.axios.com/2026/11/17/microsoft-ai-models-openai-anthropic-ignite)

## 関連動画

[![YouTube: Satya Nadella's Ignite Keynote in under 5 minutes | Microsoft Ignite 2026（Microsoft）](/images/2026-11-21/yt-8Wtr78o1wnI.jpg "Satya Nadella's Ignite Keynote in under 5 minutes | Microsoft Ignite 2026 — Microsoft（YouTube, 2026年11月17日。Ignite 基調講演の要約）")](https://www.youtube.com/watch?v=8Wtr78o1wnI)
