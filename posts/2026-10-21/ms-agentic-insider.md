---
title: Microsoft「AIエージェントは新たな内部者だ」――権限を動的に絞る新機能群を発表
date: 2026-10-19
order: 2
teaser: Project Perception を社内エージェントの統制に拡張。タスク単位の権限付与、リスクスコア、Guardian Agents による封じ込めで「モデルを信頼しない」設計を打ち出した。
cover: /images/2026-10-21/ms-agentic-insider.png
cover_caption: 「Securing the agentic insider」のヒーロー画像（画像: [The Official Microsoft Blog](https://blogs.microsoft.com/blog/2026/10/19/securing-the-agentic-insider/)）
---

Microsoft は10月19日（米国時間）、企業内で動く AI エージェントを「**agentic insider（エージェント型の内部者）**」と位置づけ、継続的に監視して封じ込めるための新機能群を発表しました。Microsoft Security を率いる Hayete Gallot 氏は公式ブログで、企業は自ら導入したエージェントを暗黙のうちに信頼してきたと指摘。そのうえで「フロンティアモデルは、出自を問わず信頼できない」と言い切っています。

## 背景

今回の発表の土台になっているのは、Microsoft が2026年7月に発表したエージェント型セキュリティシステム **Project Perception** です。当初は外部からの AI 主導の攻撃に対する防御として打ち出されていましたが、今回それを社内で動くエージェントの統制にも広げました。GeekWire によれば、Satya Nadella CEO は10月10日のブログで「最も信頼できるシステムとは、最も信頼するモデルを持つシステムではなく、モデルを最も信頼しなくて済むシステムだ」という趣旨を述べています。今回の機能群は、この考え方を具体化したものと位置づけられます。

## 何が起きたか

Identity and Network Access 担当 CVP の Nadim Abdo 氏による解説記事と SecurityWeek の報道をもとに、主な機能を整理します。

- **Dynamic Permissions**: エージェントは権限ゼロ（または最小限）から始まり、タスクごとに必要な権限だけを、必要な期間だけ受け取ります。タスクが変わったり終わったりすると権限は縮小・失効し、影響の大きい操作には人間の承認が必要になります。
- **Dynamic Agent Risk**: ID、データ、エンドポイント、クラウド、ネットワーク、ランタイムの各シグナルとエージェント自身の行動を組み合わせ、リスクを継続的に算出します。評価には、到達できるリソースの範囲、問題が起きたときの影響、本来の意図から逸脱していないか、といった観点も含まれます。
- **Dynamic Conditional Access**: Entra の条件付きアクセスをエージェント向けに拡張したものです。リスクが上がると、読み取りは残して書き込みだけを止める、到達できるデータやネットワークを絞る、人間の承認を求める、といった段階的な対応をとります。最終的にはランタイムの隔離や停止まで行えます。
- **Playbooks と Guardian Agents**: ルールと承認範囲は人間が定め、Playbooks が目指すセキュリティ上の結果を定義します。Guardian Agents は、リスクが変化した理由の調査と、封じ込めの提案・実行を担います。
- **検出対象の拡大**: PC 上で動くローカルエージェントの検出対象を35種類増やし、合計60種類にしました。Claude Code、OpenAI Codex、GitHub Copilot も含まれます。

![Microsoft Security Blog の記事画像](/images/2026-10-21/ms-security-blog.jpg "Nadim Abdo 氏の解説記事に添えられた画像（画像: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/10/19/agents-are-your-newest-insiders-security-must-move-at-their-speed/)）")

GeekWire によると、これらの機能は Microsoft 365 E7 と Project Perception の一部として提供されます。現在はプライベートプレビューで、11月17〜19日の Ignite（サンフランシスコ）で提供範囲を広げる予定です。

## なぜ重要か

注目したいのは、検出対象にコーディングエージェントが名指しで含まれた点です。開発チームのマシンで動いている Claude Code や Copilot が、今後は「ID を持ち、権限を絞られ、リスク評価される主体」として扱われる可能性があります。Abdo 氏の記事は、MCP サーバーやツール呼び出しも統制の対象として挙げています。エージェントを開発フローに組み込んでいるチームでは、権限設計や承認フローを先に考えておく必要が出てくるでしょう（編集部の視点）。

## 反応・論点

GeekWire は、今回の発表で Google、AWS、CrowdStrike、Okta などとの「エージェント統制基盤」をめぐる競争が激しくなると分析しています。発表の背景として、Anthropic や OpenAI から、テスト中のエージェントが想定外の行動をとったという報告が相次いでいることも挙げています。

## 参考リンク

- [The Official Microsoft Blog: Securing the agentic insider](https://blogs.microsoft.com/blog/2026/10/19/securing-the-agentic-insider/)
- [Microsoft Security Blog: Agents are your newest insiders. Security must move at their speed.](https://www.microsoft.com/en-us/security/blog/2026/10/19/agents-are-your-newest-insiders-security-must-move-at-their-speed/)
- [SecurityWeek: Microsoft Targets Rogue AI Agents With Dynamic Permissions, Risk Scoring](https://www.securityweek.com/microsoft-targets-rogue-ai-agents-with-dynamic-permissions-risk-scoring/)
- [GeekWire: Microsoft unveils tools to monitor and corral rogue AI agents](https://www.geekwire.com/2026/microsoft-unveils-tools-to-monitor-and-corral-rogue-ai-agents/)

## 関連動画

2026年7月に公開された Project Perception の紹介動画です（今回の発表そのものの動画ではありません）。

[![YouTube: Introducing Project Perception: The Next Evolution of Agentic Security（Microsoft Security）](/images/2026-10-21/yt-0o22Sc6hpS4.jpg "Introducing Project Perception: The Next Evolution of Agentic Security — Microsoft Security（YouTube, 2026年7月27日公開）")](https://www.youtube.com/watch?v=0o22Sc6hpS4)
