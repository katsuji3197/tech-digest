---
title: Optimizely Web のスニペットに攻撃コード――178組織に暗号資産すり替え・カード窃取・iOS エクスプロイトを配信
date: 2026-11-16
order: 1
teaser: 攻撃者は顧客ごとの「Project JavaScript」に1行のローダーを書き足し、正規の cdn.optimizely.com から配信させました。Report URI の調査では 1,611 個中188個のスニペットが汚染。CSP で攻撃を止められたのは調べた組織の15％でした。
cover: /images/2026-11-17-extra-optimizely-supply-chain/optimizely-hero.jpg
cover_caption: Report URI のブログ記事のアイキャッチ画像（画像: [Report URI Blog](https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/)）
---

A/B テストツール **Optimizely Web** が顧客サイトに配るスクリプトに攻撃者のコードが入り込み、米国時間11月16日（日本時間16日午後〜17日早朝）、**178組織**のサイトの訪問者にマルウェアが配られました。Zoom、BBC、CNN、Salesforce、GitLab、IKEA、HSBC、Equifax、Air France-KLM、Ledger などが含まれ、日本向けでは Levi's Japan（levi.jp）も一覧に載っています。発見したのは、スクリプト監視サービス Report URI の創業者 **スコット・ヘルム氏** です（Report URI Blog）。

## 背景

Optimizely Web では、各サイトが Optimizely の CDN から顧客ごとの JavaScript「スニペット」（例: `cdn.optimizely.com/js/<ID>.js`）を読み込みます。中には Optimizely 本体のコード、実験の設定、そして顧客がダッシュボードで書ける任意のコード **「Project JavaScript」（projectJS）** が入っていて、全ページで実行されます。攻撃者はこの projectJS に自分のコードを書き足しました。ファイルはそのまま Optimizely の証明書付きで、各サイトがすでに信頼しているホストから配信されました。ヘルム氏は「CDN のキャッシュ汚染ではない。CDN は渡されたものをそのまま配った」としており、多数の無関係な顧客プロジェクトに書き込めた理由は「Optimizely が説明すべきこと」としています（Report URI Blog）。

## 何が起きたか

- **時系列（日本時間）**: 16日13時21分ごろ BBC のスニペットで最初の注入を確認。攻撃用ドメイン `1688360.cc` は同14時23分に登録され、17時28分には `track.js` が bbc.com で読み込まれていました。ヘルム氏が X で警告したのは17日5時10分ごろで、6時52分の時点で汚染が残っていたのは188個中1個（TalkTalk）でした（Report URI Blog、X）。
- **注入の手口**: 多くは `1688360.cc/track.js` を読み込む `<script>` を追加する1行。ほかに URL を base64 で隠して `atob()` で戻す版（「1688360.cc」で検索しても見つからない）と、読み込みがブロックされたときに `eval` で動く **ペイロードの完全なインライン複製** の3種類がありました。Smartsheet では一度きれいになったあと再感染しています。
- **ペイロードの中身**: ① ページ本文・入力欄・リンク・クリップボード・fetch/XHR の中の暗号資産アドレスを攻撃者のものにすり替え、② 自前のフォームに入力されたカード番号・有効期限・CVV を `sendBeacon` で送信（Stripe などの決済 iframe 内は対象外）、③ HttpOnly でない Cookie とページのスクリーンショットを送信、④ iPhone/iPad には iOS のバージョンに応じて **Coruna / DarkSword** のエクスプロイトキットを隠し iframe で読み込ませる、という4つです。ペイロードは1日で26回作り直されていました。
- **被害**: 日本時間17日4時25分時点で、攻撃者のウォレットには約 **7,040ドル** が入金されていました。カードや Cookie がどれだけ盗まれたかは分かっていません。
- **範囲**: Report URI は 1,611 個のスニペットを調べ、**188個（178組織）** が汚染されていたとしています。調べられなかったスニペットもあり、実数はもっと多い可能性があります。また別の調査会社 Hudson Rock は、Kissmetrics、StorifyMe、minute-ly のスクリプトからも同じ系統のローダーが配られ、早いものは11月13日からだったとしています（Cybersixt）。
- **Optimizely の対応**: 日本時間17日朝の時点で、公式の声明は出ていません（Cybersixt、Optimizely Security Announcements Center）。

## なぜ重要か

被害サイトのほとんどは、自社のコードやサーバーには何の脆弱性もありませんでした。**「信頼できるドメインから読み込んでいる」ことは、そのスクリプトが今日も安全であることを意味しない**、というのがこの事件の教訓です。

特に耳が痛いのは CSP の結果です。Report URI が被害組織の256ホストの CSP を調べたところ、CSP なしが68、CSP があっても素通りが50、`connect-src` でデータ送信だけ止まったのが17、攻撃を止められたのは **24（15％）** でした。`cdn.optimizely.com` を許可しても意味はなく（攻撃コードはそこから来た）、効いたのは必要なホストだけを並べた厳しい `script-src` でした。逆に、**`'strict-dynamic'`**（信頼したスクリプトが差し込むスクリプトも信頼する）と、Optimizely の公式ドキュメントが許可を求めている **`'unsafe-eval'`** は素通りの原因になりました。HSBC では `track.js` もデータ送信もブロックできたのに、インライン複製が `eval` で動き、アドレスのすり替えは止まりませんでした（Report URI Blog）。

A/B テスト、タグマネージャー、分析、チャットなどの外部スクリプトを入れているプロダクトなら、①どの外部スクリプトがどのページ（特にログイン・決済）で動いているか、②その管理画面に誰が書き込めるか、③CSP の `script-src` / `connect-src` が本当に絞れているか、を一度棚卸しする価値があります。中身が日々変わるスクリプトには SRI（integrity 属性）が使えないため、監視と CSP の両方で守る必要があります（編集部の視点）。

## 反応・論点

- ヘルム氏は最初の投稿で「これは驚異的だ」と書き、この投稿は X で約125万回表示、7,000超の「いいね」を集めました（X）。
- ヘルム氏と一緒に調査したトロイ・ハント氏（Have I Been Pwned 創設者）は「とてつもなく大きい。ほとんどのサイトは顧客にマルウェアを配っていたことに気づきもしないだろう。開示はどこから始めればいいのか」という趣旨を投稿しています（X）。
- Report URI がまとめた対応策は、Optimizely 利用者なら「すべての Project JavaScript と実験のカスタムコードを点検（`1688360.cc` や `atob(` を探す）」「アカウントのユーザー・API トークン・連携を見直して認証情報をローテーション」「16日に自前フォームで入力されたカードと、HttpOnly でない Cookie のセッションは漏れたものとして扱う」「`connect-src` を絞った CSP をレポート付きで入れる」。訪問者側は「iOS 18.7.3 以降か iOS 26.3 以降に更新」「16日の暗号資産送金の宛先を確認」としています。

## 参考リンク

- Report URI Blog: [World's Largest Brands Infected With Malware Via Optimizely](https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/)
- X（@Scott_Helme）: [We are tracking a breach of a 3rd-party JS host impacting hundreds of high value websites.](https://x.com/Scott_Helme/status/2122422157959471456)
- X（@troyhunt）: [I was working through this today with @Scott_Helme, and it's MASSIVE!](https://x.com/troyhunt/status/2122466658065527202)
- Cybersixt: [Suspected Optimizely breach planted card stealer on 186 websites](https://cybersixt.com/originals/suspected-optimizely-breach-planted-card-stealer-on-186-websites)
- PrivacyAffairs: [Optimizely's A/B-Testing Code Is Loading a Card Skimmer on Major Websites](https://www.privacyaffairs.com/optimizely-script-card-skimmer/)
- InfoStealers: [Poisoned Scripts on BBC, Zoom and Other Major Websites Linked to iPhone Exploit Loaders](https://www.infostealers.com/article/poisoned-scripts-on-bbc-zoom-and-other-major-websites-linked-to-iphone-exploit-loaders/)
- Optimizely: [Security Announcements Center](https://support.optimizely.com/hc/en-us/articles/28863794000909-Security-Announcements-Center)

**動画:** 確認できた関連動画はありません（動画なし）。
