---
title: OpenAI「GPT-6 Cyber」発表――ExploitGym で相対51%改善、Linux・Firefox の脆弱性発見に実戦投入
date: 2026-11-05
order: 1
teaser: サイバーセキュリティ研究向けの新モデル。ExploitGym 48.5%、Linux 権限昇格エクスプロイト948件、Firefox の未知の高深刻度脆弱性81件など、公式が示した数字とアクセス条件をまとめます。
cover: /images/2026-11-06-extra-gpt6-cyber/gpt6-cyber-hero.jpg
cover_caption: GPT-6 Cyber 発表ページの公式 OGP 画像（画像: [OpenAI Introducing GPT-6 Cyber](https://openai.com/index/introducing-gpt-6-cyber)）
---

OpenAI は2026年11月5日（日本時間6日未明）、サイバーセキュリティ研究向けモデル **GPT-6 Cyber** を発表しました。脆弱性の発見・検証・修正案の作成に特化し、研究者が定めたスコープ内に留まるよう訓練されていると説明しています。Preparedness Framework 上のサイバー分類は、前世代 GPT-5.6 Cyber の High から **Critical** へ引き上げられました。一般の ChatGPT には載らず、まずは承認済みの Daybreak Red 顧客向けに API と Codex で提供されます。

## 背景

OpenAI はこれまで GPT-5.6 Cyber や本流モデル GPT-6 Astra、防御寄りの Daybreak Blue などを通じて、コードレビューや脆弱性トリアージ、パッチ開発を支援してきました。今回の GPT-6 Cyber は、より深いエクスプロイト開発と認可されたセキュリティテスト向けの Daybreak Red 側の主力として位置づけられています。公式は「フロンティアモデルでソフトウェアを守れる時間は限られている」とし、組織規模を問わず Daybreak の拡大を目標に掲げています。

## 何が起きたか

公式ブログ（2026年11月5日）が示した主な数字は次のとおりです。

- **ExploitGym**（指定脆弱性の遠隔悪用）: GPT-6 Cyber **48.5%**（GPT-5.6 Cyber は 32.1%。相対約51%の改善）
- **アライメント（ExploitGym Honeypot）**: スコープ外サービスへの攻撃を避けた割合が、デプロイ用プロンプトなしで **99.93%**、ありで **100%**（GPT-5.6 Cyber は 94.49%）
- **Web ペンテストの脆弱性リコール**: **40.3%**（GPT-6 Astra は 32.0%）
- **RemoteExploitBench**: GPT-6 Cyber がタスクの **95%** を完了。Astra＋Daybreak Blue は **100% 拒否**
- **実戦**: Linux の権限昇格エクスプロイトを **948件** 開発。Firefox では未知の高深刻度脆弱性を **81件** 特定し、Mozilla が修正を出荷。Brotli 経由の RCE 実証にも同モデルが関与したと記載

アクセスは当面、承認された一部の Daybreak Red 顧客向けの API と Codex。その後すべての Daybreak Red 顧客へ広げるとし、GPT-5.6 Cyber も全 Daybreak Red 顧客に開放するとしています。

![GPT-6 Cyber の公式発表ビジュアル](/images/2026-11-06-extra-gpt6-cyber/gpt6-cyber-hero.jpg "OpenAI 公式の GPT-6 Cyber 発表ビジュアル（画像: [OpenAI](https://openai.com/index/introducing-gpt-6-cyber)）")

## なぜ重要か

（編集部の視点）フロントエンド寄りのテックリードにとっても、「依存ライブラリやブラウザ、Node 周りの圧縮まわり」は日常のサプライチェーンです。Firefox や Brotli／Node.js 系の話が公式に並ぶと、自チームの依存更新やセキュリティレビューの優先度を上げる材料になります。一方で ChatGPT 一般には載らないため、明日から全員が使えるツールではありません。Critical 分類と Daybreak Red 限定という二面を見ると、「能力が上がるほど、誰が・どの認可で使うか」がプロダクト選定と同じくらい重い論点になります。CI や依存監査を見直すきっかけとしては十分大きい発表です。

## 反応・論点

Firefox の Brian Grinstead 氏は「2026年に入った時点で最もハードニングされたコードベースの一つだった Firefox でも、未知の高深刻度脆弱性を見つけ、修正の出荷に貢献した」と公式ブログにコメントしています。Calif の Thai Duong 氏は長時間のエクスプロイト開発で「プリミティブのライブラリを積み上げてより強いものへつなぐ能力が前世代から大きく変わった」とし、Cognition の Steven Hao 氏は社内ベンチで 23%（従来最良は 13%）と評価しています。Palo Alto Networks の Lee Klarich 氏や Cisco の Anthony Grieco 氏も、自社製品や研究への組み込みを公式コメントで述べています。国内では ITmedia が11月6日7時57分（JST）に速報しています。X では OpenAI 公式投稿（11月5日17:09 UTC）を中心に、発表直後の時間帯だけで関連投稿が約2,800件規模に達しています。

## 参考リンク

- [OpenAI: GPT‑6 Cyber: Advancing the frontier of aligned cybersecurity agents](https://openai.com/index/introducing-gpt-6-cyber)
- [OpenAI（X）: GPT-6 Cyber 発表投稿](https://x.com/OpenAI/status/2118390190246879554)
- [Greg Brockman（X）: 関連投稿](https://x.com/gdb/status/2118395717966606542)
- [ITmedia: OpenAI がサイバー特化モデル「GPT-6 Cyber」を発表（2026-11-06）](https://www.itmedia.co.jp/news/article/2611/06/2000002931/)

**動画:** 確認できた関連動画はありません（動画なし）。
