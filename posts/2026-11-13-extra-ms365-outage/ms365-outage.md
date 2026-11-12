---
title: Microsoft 365 で世界規模の障害――Exchange Online のサーバーが相次いで応答不能に、Teams・Copilot・Defender にも波及
date: 2026-11-13
order: 1
teaser: 日本時間13日2時54分に Microsoft が障害を公表。多数のサーバーが自動ヘルスチェックに失敗して外れ、残りのインフラに負荷が集中しました。デプロイを止め、再起動や経路の切り替えを続けていますが、7時の時点では「期待した効果が出ていない」と説明。8時ごろに一部回復が始まったばかりです。
cover: /images/2026-11-13-extra-ms365-outage/ms365-outage-hero.jpg
cover_caption: Microsoft 365 障害の概要（画像: 編集部作成。内容は [Microsoft 365 Status](https://x.com/MSFT365Status) の発表にもとづく）
---

Microsoft のクラウドサービス **Microsoft 365** で、日本時間11月13日未明から大規模な障害が続いています。メール基盤の **Exchange Online** につながりにくくなり、Outlook の Web 版・デスクトップ版・モバイル版が使えない状態になりました。影響は Teams、SharePoint Online、Microsoft 365 Copilot、Defender XDR などにも広がっています。Microsoft は一部のサーバーを戻し始めましたが、日本時間8時の時点で全面復旧のめどは示していません。

## 背景

Microsoft は日本時間13日 **2時54分**、公式 X アカウント「Microsoft 365 Status」で、米大陸のユーザーが Exchange Online のメールボックスに複数の方法でアクセスできないとの報告を調べていると発表しました（インシデント ID **EX1550543**）。13分後の3時7分には、影響は **あらゆる地域** に及ぶ可能性があると改めています。他のサービスへの影響は **MO1550821** として別に管理されています。

障害の集計サイト Downdetector では、米国で Outlook の障害報告がピーク時に **約13万件** に達しました（CNBC、朝日新聞）。日本経済新聞によると、日本でも13日4時すぎから報告が急に増え、Outlook では6時ごろに300件以上が寄せられています。

## 何が起きたか

Microsoft の発表（時刻は日本時間）を順に追うと、次のとおりです。

- **3時35分**: 複数のリージョンでインフラの一部に高い負荷がかかり、接続エラーにつながっているとみられる
- **4時6分**: 念のため、**すべてのデプロイと構成変更を止めた**。一部のトラフィックを影響のあるインフラから移した
- **4時18分**: 負荷はトラフィックの増加ではなく、**多数のサーバーが予期せず使えなくなり**、残りのインフラに集中したためと判明
- **4時57分**: サーバーが自動ヘルスチェックに失敗して外れており、そのチェックを処理する **特定のコンポーネント** が原因の可能性。サーバーの CPU 使用率が高い理由も調べている
- **5時56分**: 別の方法でヘルスチェックを行ったところ、一部のサーバーが復帰。これを広く適用し始めた。最近の **少数の構成変更** も原因の候補として調査
- **7時0分**: これまでの対策は **「期待した効果が出ていない」**。サーバー上の中心的なプロセスが処理しきれなくなって応答が止まっていると説明。インフラの一部を完全に切り離し、再起動してから少しずつトラフィックを戻す方法を試している
- **7時57分**: 一部のサーバーを戻し、今のところ安定。経路の切り替えで **一部のリージョンでは限定的に回復**。特定の拠点でトラフィックを絞る保護策も始めた。容量が戻るにつれて、クライアントが再接続して **少しずつ回復する** 見込み

影響する接続方法は、Outlook on the web、MAPI、Exchange ActiveSync、REST API です。MO1550821 では、Exchange Online、Teams、SharePoint Online、Microsoft 365 Copilot、Defender XDR、Planner、To Do、Intune、Defender for Office 365、Purview（DLP や自動ラベル付けなど）、Power BI の一部、Universal Print が挙がっています。管理者向けの Microsoft 365 管理センターも開きにくく、Microsoft は公開のステータスページを見るよう呼びかけています。次の更新は、EX1550543 が **9時0分**、MO1550821 が **9時30分** までの予定です。

なお、日本時間0時40分には北米の Teams で別の障害（TM1550488）があり、2時9分に解消したと発表されています。今回の障害との関係について、Microsoft は説明していません。

## なぜ重要か

日本は金曜の朝、ちょうど仕事が始まる時間に入ります。メールと Teams が同時に止まると、障害の連絡そのものが届かなくなります。社内の連絡手段を Microsoft 365 以外にも用意しているか、今日のうちに確かめておくと安心です。（編集部の視点）

開発チームにとっては、次の点に注意が必要です。（編集部の視点）

- **自社サービスへの波及**: Exchange の REST API や Microsoft 365 の機能に頼るアプリ（メール送信、予定表の連携、SharePoint のファイル連携など）は、タイムアウトやエラーが増えている可能性があります。リトライが殺到しないように、バックオフやエラー表示を確認しておきましょう
- **セキュリティ運用**: Defender XDR、Intune、Purview も影響を受けています。アラートやポリシーの適用が遅れている可能性があります
- **障害の教訓**: 「ヘルスチェックに失敗したサーバーが外れる → 残りに負荷が集中してさらに外れる」という連鎖は、規模を問わず起こりえます。自社のロードバランサーやオートスケールのヘルスチェックが、同じ連鎖を起こさない作りになっているか見直すきっかけになります

## 反応・論点

- 朝日新聞によると、日本の SNS では「会社のメールが読めないと思ったらこれだったのか」「朝から大混乱」といった投稿が相次いでいます。
- CNET Japan によると、米アイオワ大学の医療機関 University of Iowa Health Care は、すべての施設でメールとボイスメールに問題が出ていると報告し、患者には別の連絡手段を使うよう呼びかけました。
- 日本経済新聞は、米報道として Skydance や NBCUniversal などのメディア企業でも一時メールが使えなかったと伝えています。
- Downdetector では AWS や Gmail の報告も増えましたが、CNBC によると Amazon は X で「AWS は正常に動いている。ほかの場所の障害のせいで誤った報道が出ている」という趣旨の投稿をしています。
- The Guardian は、Microsoft の対策が「期待した効果が出ていない」と認めた点を見出しで取り上げました。

## 参考リンク

- [Microsoft 365 Status（X）: 最初の発表（日本時間2時54分）](https://x.com/MSFT365Status/status/2120938282204688468)
- [Microsoft 365 Status（X）: 7時57分ごろの最新情報](https://x.com/MSFT365Status/status/2121016338181161457)
- [Microsoft 365 Service health status（公開ステータスページ）](https://status.cloud.microsoft/)
- [ITmedia NEWS: Microsoft 365で大規模障害　「Outlook」でメールにアクセスできず、「Teams」など複数サービスに影響](https://www.itmedia.co.jp/news/article/2611/13/2000003161/)
- [日本経済新聞: マイクロソフト、「365」世界で大規模障害　メール送れずビジネスに影響](https://www.nikkei.com/article/DGXZQOGN12CY20S6A111C2000000/)
- [CNET Japan: マイクロソフトの「Outlook」で大規模障害--Microsoft 365、Copilotなどにも影響](https://japan.cnet.com/article/35254809/)
- [朝日新聞（Yahoo!ニュース）: アウトルックでメール送れず　「マイクロソフト365」で大規模障害](https://news.yahoo.co.jp/articles/d2db8300ba543f40f0228994c065f5f28dbdb002)
- [CNBC: Widespread Microsoft outage takes down Outlook and other 365 services](https://www.cnbc.com/2026/11/12/microsoft-outage-outlook-aws-google.html)
- [The Guardian: Global Microsoft outage affects Outlook and Teams as company says fixes not providing ‘anticipated relief’](https://www.theguardian.com/technology/2026/nov/13/microsoft-outage-outlook-teams-word-excel-reports)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
