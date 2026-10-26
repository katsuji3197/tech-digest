---
title: Google Cloud ロンドン リージョンで約8時間の障害、英国の銀行・物流・裁判所まで波及
date: 2026-10-20
order: 1
teaser: europe-west2 の「power event」で Revolut や Lloyds、HSBC などが影響。単一リージョンへの依存とクラウド集中のリスクが改めて浮き彫りに。
cover: /images/2026-10-21/gcp-outage.jpg
cover_caption: 障害の影響を受けたサービスのひとつ Revolut（画像: [BBC News](https://www.bbc.com/news/articles/cxdd8mm6qy4mo) / Getty Images）
---

2026年10月20日、Google Cloud のロンドン リージョン **europe-west2** で大規模な障害が発生しました。原因について Google は「power event（電源関連の事象）」と説明しています。英国のデジタル銀行や大手銀行、配送、公共サービスまでが同時に止まり、「見かけ上は無関係なサービスが、実は同じ基盤に依存している」ことを強く印象づける一日になりました。

## 背景

europe-west2 は、BBC によれば英国で唯一の Google Cloud リージョンです。英国では2026年7月、Google Cloud・Microsoft・AWS・Oracle が金融業界の「重要第三者（critical third party）」として当局の直接監督下に置かれていました（RTÉ 報道）。EU でも Google Cloud は前年、金融業界が依存する重要 ICT 事業者19社の1社に指定されています。さらに BBC は、今回の障害が AWS 最大のリージョンで1,000以上のサイトが停止した障害から「ちょうど1年後」に起きたと指摘しています。

## 何が起きたか

- Reuters 配信の CNA の報道によると、障害は **06:08 GMT（日本時間15:08）** に始まり、Google は **12:10 GMT（同21:10）** までに大半のサービスが復旧したと発表しました。Google Cloud のステータスページでは、インシデントの継続時間は **7時間52分**。影響を受けたプロダクトは AlloyDB for PostgreSQL、Apigee、BigQuery Data Transfer Service ほか35製品と記録されています。
- **Revolut**、**Lloyds**（Halifax、Bank of Scotland を含むグループ）、**HSBC** が一部サービスの不具合を認めました。BBC によると、Revolut については 08:00 BST 過ぎに障害監視サイトへ1,500件超の報告が寄せられています。
- Revolut の影響は英国外にも広がりました。CNA によれば、シンガポールでは同社ステータスページの全27サービスが「一部利用不可」に。RTÉ はアイルランドの顧客340万人も影響を受けたと報じています。
- 銀行以外でも、Royal Mail、DPD、電動自転車シェアの Forest、不動産サイト Rightmove などで不具合が報告されました。英国の裁判所・審判所サービス（HMCTS）では、リモート審理に使うビデオ基盤に障害が出ています。
- Google は影響を受けた利用者に謝罪し、社内調査のあとで詳細なインシデントレポートを公開するとしています。

## なぜ重要か

アプリケーション開発の視点で見ると、今回の障害はゾーン単位ではなく**リージョン全体**に及びました。単一リージョン構成のサービスでは、マルチゾーンで冗長化していても止まりうることを示しています。フロントエンドの責任範囲でも、次のような点を見直すきっかけになります。

- 決済や認証など外部 SaaS が落ちたときに、画面がどう**縮退（degrade）**するか
- ステータス表示やエラーメッセージを、どこまで自前の基盤に依存せず出せるか
- 自社の依存先がどのクラウド・どのリージョンに載っているかを把握できているか

※上記は編集部の視点です。

## 反応・論点

- Revolut は「顧客の資金とデータは安全」とコメントし、第三者側の問題が原因だと説明しました。Lloyds も午後に「根本的な問題は解消されたと理解している」と述べています。
- Bayes Business School の Feng Li 教授は BBC に対し、今回の障害は経済が一握りのクラウド事業者にいかに深く依存しているかを思い出させるものだと指摘。「障害は起きるもの。重要なのは、どこまで波及するか、どれだけ早く復旧するか、顧客に現実的な代替手段があるかだ」と語りました。
- サリー大学の Alan Woodward 教授は Reuters に対し、こうした拠点は「局所的なインフラ障害の影響を受けやすい」と述べ、AI ブームで依存は強まっていると指摘しています。
- RTÉ は、今回の件で英国と EU の規制当局が抱える集中リスクへの懸念に再び注目が集まっていると報じています。

## 参考リンク

- [BBC News: Google says services recovering after cloud outage hits UK banks and websites](https://www.bbc.com/news/articles/cxdd8mm6qy4mo)
- [BBC News ライブ: Google Cloud says services are recovering…](https://www.bbc.com/news/live/c58jd2kjp93xt)
- [CNA（Reuters）: Google Cloud services largely back up in UK; Revolut services remain disrupted in Singapore](https://www.channelnewsasia.com/business/google-cloud-service-outage-london-revolut-6475076)
- [RTÉ: Google Cloud outage eases after impacting Revolut](https://www.rte.ie/news/business/2026/1020/1596063-some-revolut-services-down/)
- [Google Cloud Service Health（Europe）](https://status.cloud.google.com/regional/europe)

**動画:** 確認できた関連動画はありません（動画なし）。
