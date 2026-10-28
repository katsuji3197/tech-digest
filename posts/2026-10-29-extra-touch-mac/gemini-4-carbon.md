---
title: Google が Gemini 4 Carbon を発表――AA Intelligence Index で首位、サイバー防御で最高水準。ただし開発者向け API はまだ
date: 2026-10-28
order: 2
teaser: Gemini 4 Argon の2週間後に登場した Carbon は、Artificial Analysis Intelligence Index v5.0 で59と首位。SEC-bench Pro 88.2%、ExploitGym 54.8% とサイバー防御の指標で先頭に立ちました。最初は Fairwind Program 経由の一部のサイバー防御組織だけが使え、開発者への提供時期は「できるだけ早く」とされています。
cover: /images/2026-10-29-extra-touch-mac/gemini-carbon-hero.jpg
cover_caption: Gemini 4 Carbon の発表画像（画像: [Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)）
---

Google は米国時間10月28日（日本時間29日）、新しい最上位モデル **Gemini 4 Carbon** を発表しました。Google DeepMind の Koray Kavukcuoglu 氏は公式ブログで「サイバーセキュリティと長時間のタスクで最先端の能力を持つ、最も強力なモデル」と紹介しています。ただし最初に使えるのは、選ばれたサイバー防御の担い手だけです。

## 背景

Google は2週間前に Gemini 4 Argon を出したばかりです。Carbon はその上に作られたモデルで、Google は「フロンティアを押し広げるペースを示すもの」と位置づけています。ここ最近は、AI が脆弱性を見つけ、攻撃コードまで書けるようになってきたことが各社の課題になっており、Google も公開の前に米国政府の任意の事前テストに参加していると書いています。

## 何が起きたか

- **総合性能**: 第三者評価の Artificial Analysis Intelligence Index v5.0 で **59** を記録し、首位に立ちました。Google DeepMind の比較表では Claude Opus 5.5 が58、GPT-6 Astra が57、Gemini 4 Argon が50です。
- **サイバー防御**: 脆弱性を見つける SEC-bench Pro で **88.2%**、脆弱性が実際に悪用できるか確かめる ExploitGym で **54.8%**、根本原因を直す CWE-bench で **71.0%**。いずれもガードレールなしで評価した数字です。
- **長時間タスク**: 社内では、大きなコードベースの微妙なバグの原因を突き止めて直すような作業を、Carbon が「何日も」続けて行ったといいます。WebDev Arena では89ポイント上がって4位（1768）です。
- **安全性**: Terminal-Bench 4.0 でのズル（不正な近道）の成功率は0.0%、根拠のない主張は Argon の約半分、間接プロンプトインジェクションの攻撃成功率は0.0% だったとしています。
- **文脈長**: Artificial Analysis によると **100万トークン**。入力はテキスト、画像、音声、動画で、出力はテキストです。
- **提供と料金**: 今週から一部のサイバー防御組織に提供し、**Fairwind Program** を通じて信頼できるパートナーへ段階的に広げます。開発者・企業・一般向けは、ガードレールを改善したうえで「できるだけ早く」とされ、具体的な日付はありません。料金は導入価格で **入力100万トークンあたり2ドル、出力10ドル**（Argon と同じ）。導入期間の後は入力4ドル、出力20ドルになります。

## なぜ重要か

（編集部の視点）まず押さえたいのは、**今日の時点では一般の開発者は Gemini API で Carbon を呼べない**という点です。Artificial Analysis も「まだ一般公開されていない」と書いています。当面は Gemini 4 Argon を使い、Carbon が来たら差し替えられるように、モデル名を設定で切り替えられる作りにしておくのが現実的です。

フロントエンドのチームにとって気になるのは、セキュアなコードを生成する力です。Google は社内ベンチマークで、Argon の2倍以上の成功率を示したとしています。依存パッケージの脆弱性が次々と見つかる今、**AI に脆弱性の発見と修正パッチまで任せる流れ**は強まりそうです。一方で、同じ能力は攻撃にも使えます。Google が最初に防御側だけへ渡しているのはそのためで、攻撃者が同等の道具を手にする前に、自分たちのコードを点検しておく価値は上がっています（編集部の視点）。

## 反応・論点

- Artificial Analysis は、Carbon が Intelligence Index v5 で首位になった一方、コーディングエージェントの指標では Claude Opus 5.5 にわずかに及ばず2位で、知識労働の一部の評価でも首位ではないと分析しています。料金は標準価格で計算し、1タスクあたりのコストは Claude Opus 5.5 より約23%安いとしています。
- The Verge は、Carbon が一部のベンチマークで OpenAI と Anthropic の最上位モデルを上回る一方、現在はサイバー防御企業の一部にしか提供されていない点を伝えています。

## 参考リンク

- [Google: Gemini 4 Carbon: our next frontier model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)
- [Google DeepMind: Gemini 4](https://deepmind.google/models/gemini/)
- [Artificial Analysis: Gemini 4 Carbon is the new #1 on the Artificial Analysis Intelligence Index v5](https://artificialanalysis.ai/articles/gemini-4-carbon-new-number-1)
- [The Verge: Google launches Gemini 4 Carbon with a 'significant leap' in cybersecurity](https://www.theverge.com/tech/1021339/google-gemini-4-carbon-cybersecurity-frontier)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
