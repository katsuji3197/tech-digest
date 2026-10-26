---
title: Meta、ギガワット級AIクラスタ「Prometheus」の舞台裏を公開――目標は約100万GPU
date: 2026-10-19
order: 3
teaser: Muse モデルを学習させたオハイオの巨大クラスタ。NVL72 の「72基中64基で学習・8基は予備」という設計や、1年で中断を99%減らした運用の工夫が明かされた。
cover: /images/2026-10-21/meta-prometheus.jpg
cover_caption: オハイオ州ニューアルバニーの Prometheus（画像: [Engineering at Meta](https://engineering.fb.com/2026/10/19/data-center-engineering/inside-prometheus-meta-gigawatt-scale-supercluster/)）
---

Meta は10月19日、エンジニアリングブログで、オハイオ州ニューアルバニーに建設中のギガワット級 AI スーパークラスタ **Prometheus** の内部を詳しく紹介しました。第1フェーズはすでに完成しており、最新の基盤モデル群 **Muse**（Muse Wonder を含む）の学習に使われたとしています。最終的には約100万基の GPU を「1台の機械」として動かすことを目指しています。

## 背景

Meta によると、ニューアルバニーは2年前まで、Web トラフィックを処理するごく普通のデータセンターでした。ハードウェア、ネットワーク、建屋設計を作り直して、フロンティアモデルの学習拠点に転用したといいます。Meta はこれまでにも、建屋単位で2万4,000 GPU 規模のクラスタや、リージョン単位で10万 GPU 超のクラスタを運用してきました。Prometheus は、その設計思想を規模と距離の両面でさらに押し広げたものです。

## 何が起きたか（公開された主な中身）

**2世代の NVL72。** 現在は2つの NVIDIA プラットフォームが稼働しています。

- **Catalina**: GB200 NVL72 の Ariel 構成。2ラックで72 GPU のドメインを組み、GPU ごとに 800G のスケールアウト帯域を持たせています。
- **Clemente**: GB300 NVL72。GPU あたりの HBM は 288GB と GB200 の1.5倍で、72 GPU を1ラックに収めています。

次世代の Vera Rubin NVL72 も「San Miguel」プラットフォームとして近く加わる予定です。

**ネットワーク。** 学習用には、通常のデータセンターネットワークとは別に、Ethernet ベースの専用バックエンドネットワークを用意しています。1棟あたり最大2万736 GPU を接続し、建屋間は 2km から100km 超の距離を結ぶ集約ネットワーク（BAG）でつないでいます。

**信頼性の数字。** Muse Wonder の学習では、事前学習で85%超、強化学習で90%超の goodput（実効的に学習が進んだ割合）を達成しました。中断の平均間隔（MTBI）は約4万7,000 GPU 時間で、その後ファームウェアの修正によって5万4,000 GPU 時間超まで伸びています。2025年半ばには中断が「8,000 GPU あたり1日1,000件近く」に達していましたが、1年がかりの取り組みで99%減らしました。

![GB200/GB300 の中断件数の推移グラフ](/images/2026-10-21/meta-interruptions.png "2025年6月〜2026年9月の中断件数の推移。目標は 8,000 GPU あたり1日2件（画像: [Engineering at Meta](https://engineering.fb.com/2026/10/19/data-center-engineering/inside-prometheus-meta-gigawatt-scale-supercluster/)）")

**「72基中64基」設計。** StorageReview の解説によると、学習の並列化は2の累乗のグループと相性が良いため、各 NVL72 ドメインでは64 GPU で学習し、残り8基をラック内の予備にしています。GPU が故障したら予備が引き継ぎ、ジョブは直前のチェックポイントから再開します。修理を待つ必要はありません。

## なぜ重要か

数十万 GPU を動かすうえでの「中断の分類」や「ファームウェアの配布速度」は、ハイパースケーラーが普段はあまり公開しない運用の中身です。StorageReview も、その点にこの記事の価値があると評しています。フロントエンドの開発者にとっては直接の実務ではありません。それでも、毎日使う大規模モデルの性能や提供ペースが、こうした信頼性エンジニアリングに支えられていることがよく分かる資料です（編集部の視点）。

![Vera Rubin の節に掲載されたラックの写真](/images/2026-10-21/meta-vera-rubin.jpg "記事の Vera Rubin NVL72 の節に掲載された写真（画像: [Engineering at Meta](https://engineering.fb.com/2026/10/19/data-center-engineering/inside-prometheus-meta-gigawatt-scale-supercluster/)）")

## 今後

Meta は今後も GB300 と Vera Rubin を組み合わせて Prometheus を拡張していきます。そこで得た知見は、ルイジアナ州で一から設計しているスーパークラスタ **Hyperion** にも生かすとしています。

## 参考リンク

- [Engineering at Meta: Inside Prometheus: Meta’s Journey to a Gigawatt-Scale Supercluster](https://engineering.fb.com/2026/10/19/data-center-engineering/inside-prometheus-meta-gigawatt-scale-supercluster/)
- [StorageReview: Meta Prometheus: Inside the Gigawatt Supercluster Scaling to 1 Million GPUs on GB200 and GB300 NVL72](https://www.storagereview.com/news/meta-prometheus-gigawatt-supercluster-1-million-gpus-gb200-gb300-nvl72)

**動画:** YouTube 上で今回の発表に対応する動画は確認できませんでした（動画なし）。Meta の記事ページには、記事内に埋め込まれた公式の紹介動画（MP4）があります。
