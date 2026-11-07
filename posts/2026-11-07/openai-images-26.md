---
title: OpenAI「Images 2.6」――生成が約50%高速化、GIF 対応。API は Flare / Sunburst
date: 2026-11-04
order: 2
teaser: OpenAI が Images 2.6 を ChatGPT・Codex・API に投入しました。生成は従来比約50%高速、GIF アニメに対応。API では GPT-Image-2.6 Flare（速度）と Sunburst（詳細・一貫性）が選べます。
cover: /images/2026-11-07/openai-images-26-hero.jpg
cover_caption: OpenAI「Introducing Images 2.6」の og:image（画像: [OpenAI](https://openai.com/index/introducing-images-2-6/)）
---

OpenAI は11月4日、画像生成・編集の新世代 **Images 2.6** を発表しました。ChatGPT と Codex は全プラン、デスクトップ・モバイル・Web で利用でき、API では **GPT-Image-2.6 Flare** と **GPT-Image-2.6 Sunburst** が提供されます。同社によると、ChatGPT・Codex・API 合わせた画像生成は週あたり **約40億枚**（1日あたり5億枚超）に達しています。

## 背景

画像生成はすでに日常の制作フローに入り、速度と「編集を重ねてもブランドやキャラが崩れないこと」が同時に求められていました。Images 2.6 はその両方を前面に出し、さらに GIF によるモーションを公式機能として追加した形です。

## 何が起きたか

公式発表の主なポイントは次の通りです。

- **速度**: 画像生成が従来比 **約50%高速**。API の Flare は quality を low にしたとき、最短で約6秒で生成できるとしています
- **品質の選択**: Flare は速度とポスター／商品画像などのレイアウト改善。Sunburst は medium／high でより高い詳細と、編集をまたいだ一貫性を重視
- **GIF**: ブランドマスコットのループや、ストーリーボード的な短い動きを生成できる。OpenArt の Coco Mao 氏（CEO & Co-founder）は「GIF はソーシャルの共通言語で、GPT-Image-2.6 なら単一プロンプトから話せる」という趣旨のコメントを寄せています
- **API の制御**: ChatGPT にあった **image markup** が API に。**SVG エクスポート**、シーンの計画量を調整する **complexity** パラメータが追加。品質（見た目の忠実度）と complexity（どれだけ計画するか）は別軸。多くの編集では low complexity を推奨
- **Figma Weave**: Creative Director の Itay Schiff 氏は、速度と制御を両立しキャラ／商品／ブランドの細部を保ったまま生成・編集できる点を評価し、Weave への追加に期待を述べています

料金の詳細は公式の pricing ページ、安全性の評価は system card を参照するよう案内されています。

## なぜ重要か

（編集部の視点）フロントエンドやプロダクトのテックリードにとっては、**「静止画の一発生成」から「編集ラウンドとモーションまで含めた制作パイプライン」**に寄ったのが実務的な変化です。マーケやデザインが ChatGPT／Codex 側で GIF やマークアップ編集を回し、エンジニアは API の Flare／Sunburst・SVG・complexity で同じ系統の出力をアプリに流し込めます。一方で、生成量の急増はコストとモデレーションの設計を同時に見直す合図でもあります。まずは既存の画像 API 呼び出しを Flare（低 quality）で置き換え、レイテンシと請求を測るのが現実的です。

## 反応・論点

公式ブログに、OpenArt の Coco Mao 氏と Figma Weave の Itay Schiff 氏のコメントが掲載されています。いずれもパートナー側の評価で、第三者報道の論調というより製品発表への寄稿に近い位置づけです。

## 参考リンク

- [OpenAI: Introducing Images 2.6](https://openai.com/index/introducing-images-2-6/)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
