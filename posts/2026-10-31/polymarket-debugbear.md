---
title: 計測用の外部スクリプトが「財布の抜き取り役」に――Polymarket、DebugBear の RUM スクリプト改ざんで約250万〜270万ドルの被害
date: 2026-10-29
order: 1
teaser: パフォーマンス計測サービス DebugBear の配信スクリプトが差し替えられ、Polymarket のログイン中ユーザーの資産が約1時間で抜き取られました。サイトが CSP を設定していても防げなかった点が、フロントエンドにとって一番の教訓です。
cover: /images/2026-10-31/polymarket.jpg
cover_caption: Polymarket のロゴ（画像: [BleepingComputer](https://www.bleepingcomputer.com/news/security/polymarket-halts-trading-after-crypto-draining-script-breach-25m-traced/)）
---

予測市場の **Polymarket** は10月29日（日本時間30日未明）、国際版の取引を一時停止しました。原因は、Web パフォーマンス計測サービス **DebugBear** の RUM（Real User Monitoring）スクリプトが攻撃者に差し替えられ、暗号資産を抜き取るコードとして配信されたことです。被害額は調査元によって **約219万〜271万ドル** と幅があります。Polymarket は影響を受けたトレーダー全員に補償すると表明しています。

## 背景

DebugBear の RUM は、訪問者のブラウザでページ速度を測るための JavaScript で、顧客ごとに `cdn.debugbear[.]com` 上の専用ファイルを埋め込んで使います。Polymarket が読み込んでいたのは `C7xcKKrjUnXK.js` でした。Internet Archive には2025年6月から10月29日朝まで、正規の RUM コードの写しが残っています。つまり、**長く安全に使われてきた計測タグ**が、ある日突然中身だけ変わったことになります。

## 何が起きたか

研究者 Kirk 氏の分析（ohey.ca）によると、時系列は次の通りです（UTC、カッコ内は日本時間）。

- **16:54（30日 1:54）**: スクリプトの配信元が Cloudflare から到達不能になり、別のサーバーが応答し始める
- **17:10（2:10）**: 攻撃者ウォレットに最初の資金が着金
- **17:59（2:59）**: Polymarket がスクリプトを除いたビルドを公開。コミットメッセージは `chore(polymarket): remove debugbear rum script (#15337)`
- **18:00（3:00）**: DebugBear が X で「進行中のセキュリティインシデントの影響を受けている。RUM 製品の利用者は埋め込みコードを削除してほしい」と告知

差し替えられたコードは、ログイン中のユーザーを見つけると、**ページ上にある Polymarket 自身の取引クライアントと署名機能をそのまま使い**、ポジションの売却や資産の送金を Polymarket の正規のリレイヤー経由で実行しました。Hudson Rock は「秘密鍵やシードフレーズを送り出す処理は見つからなかった。中心にあるのは、認証済みアプリがすでに持っている権限の再利用だ」と述べています。

被害額は、ブロックチェーン上の分析で BleepingComputer が約257万ドル相当の POL、GoPlus が約271万ドル（710のデポジットウォレット経由）としています。米国版の Polymarket は影響を受けていません。

## なぜ重要か

（編集部の視点）ohey.ca の分析で最も重い一文は、**「DebugBear 以外に攻撃コードが呼び出したホストは、すべて Polymarket の CSP で許可されていた」** という点です。CSP で外部への送信先を絞っていても、攻撃コードが自社の API とリレイヤーを使えば素通りになります。

フロントエンドで見直すべき点は次の通りです。

- **Subresource Integrity（SRI）**: 中身が固定のスクリプトには `integrity` 属性を付ける。ただし、顧客ごとに更新される計測タグには付けにくいことが多い
- **認証済みページに置くサードパーティ JS を最小限にする**: 計測やチャットのタグは、取引や決済の画面から外す
- **自前ホストやプロキシ経由での配信**: 外部 CDN の中身が変わってもすぐには反映されない構成にする

## 反応・論点

CNBC によると、Polymarket は事案を英国の当局に通報しました。DebugBear が英国の企業だからです。0xCERT は、補償や復旧をうたう非公式のリンクや DM による**二次的なフィッシング**に注意するよう呼びかけています。

## 参考リンク

- [ohey.ca: Polymarket wallet drainer served from DebugBear's script CDN](https://ohey.ca/research/polymarket-debugbear-wallet-drainer/)
- [BleepingComputer: Polymarket halts trading after crypto-draining script breach, $2.5M traced](https://www.bleepingcomputer.com/news/security/polymarket-halts-trading-after-crypto-draining-script-breach-25m-traced/)
- [SecurityWeek: $2 Million+ Drained From Polymarket Traders in New Supply Chain Attack](https://www.securityweek.com/2-million-drained-from-polymarket-traders-in-new-supply-chain-attack/)
- [CNBC: Some Polymarket user funds stolen, matter referred to UK authorities](https://www.cnbc.com/2026/10/29/polymarket-reports-outage-on-international-exchange-halts-trading.html)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
