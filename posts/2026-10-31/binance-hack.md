---
title: 史上最大の暗号資産流出、Binance から約63億ドル――TRM は北朝鮮 TraderTraitor と断定、起点は DevOps エンジニアのノート PC
date: 2026-10-29
order: 2
teaser: 世界最大の取引所 Binance から、約20分で約63.6億ドル相当が10チェーンにわたって流出しました。Bybit 事件の約4倍です。Binance は、侵入の起点を開発運用担当者の端末とサービスコンテナと説明しています。
cover: /images/2026-10-31/binance.jpg
cover_caption: Binance のロゴ（画像: [BleepingComputer](https://www.bleepingcomputer.com/)）
---

暗号資産取引所 **Binance** から10月29日20時05分（UTC、日本時間30日5時05分）以降、約 **63.6億ドル** 相当の資産が流出しました。ブロックチェーン分析企業の TRM Labs によると、記録上**史上最大の暗号資産窃取**で、2025年2月の Bybit 事件（約15億ドル）の約4倍にあたります。TRM と Chainalysis は、北朝鮮のハッキング集団 **TraderTraitor** の犯行と見ています。

## 背景

TraderTraitor は、FBI が Bybit 事件の実行者として名指しした集団です。TRM によると今回も、Tornado Cash からの少額の資金で作業用ウォレットを用意する、窃取の前に準備を重ねる、事前に得た署名を一気に実行する、といった過去の事件と共通する特徴が見られました。準備は**少なくとも36時間前**に始まり、攻撃コードは別のウォレットで予行演習されていました。

## 何が起きたか

TRM の分析では、最初に XRP Ledger 上の5つのウォレットから約2.33億 XRP が抜かれました。続いて Solana、Optimism、Bitcoin（18,270 BTC）、Tron（約6.1億 USDT）と、10のチェーンで**ほぼ20分のうちに**資金が攻撃者に送られています。Ethereum では、2025年の Pectra アップグレードで入った **EIP-7702**（通常のウォレットの動作をスマートコントラクトに委ねる仕組み）が悪用され、ホットウォレットが攻撃者の回収用コントラクトに書き換えられました。事前に**50件の署名済み承認**が用意されていたといいます。TRM は、ホットウォレットの署名基盤そのものが侵害されたと見ています。

Binance は30日、侵入の起点として **DevOps エンジニアのノート PC の侵害**と、サービスコンテナへのアクセスを挙げました。共同 CEO の Richard Teng 氏は「攻撃者は1人のエンジニアの権限をそのまま使ったのではなく、『ワンクリック』の単発の操作でもなかった」と説明しています。秘密鍵の流出は確認されていないものの、**追加の侵入箇所**も見つかったとしています。損失はユーザー保護基金 SAFU で補填し、入出金は停止中です。

流出した資産のうち、Tether・Circle・Ripple・World Liberty Financial がステーブルコイン約26.7億ドル分を凍結しました。Arbitrum のセキュリティ評議会も 8,426 ETH と 7,460万 ARB を凍結しています。一方で、攻撃者は凍結が及ばない 42万 ETH 超と 18,270 BTC（約24億ドル相当）を保有したままです。

## なぜ重要か

（編集部の視点）Bybit 事件では、署名画面を表示する Web UI（Safe{Wallet} のフロントエンド）の改ざんが入口でした。今回は**開発者の端末とコンテナ**が入口です。どちらも「暗号の仕組みは破られず、人と開発環境が破られた」点が共通しています。同じ週の [偽の Claude Code 拡張のバックドア](/posts/2026-10-30-extra-claude-code-backdoor/claude-code-extension-backdoor/) と合わせると、**開発者のマシンが最も価値の高い攻撃対象**になっていることがよくわかります。本番環境に届く権限を持つ端末の分離や、署名操作を複数人で承認する仕組みは、暗号資産以外の業界でも見直す価値があります。

## 反応・論点

- TRM は、資金洗浄の手口が Bybit のときのブリッジ中心のものと異なり、マーケットメイカーとの大口スワップや Aave での借り入れが中心だと指摘しています。凍結される前に USDT を売り切ろうとした動きだと分析しています。
- BBC のライブ報道によると、米シークレットサービスも盗まれた資金の追跡に協力しています。

## 参考リンク

- [TRM Labs: North Korea Steals USD 6.36 Billion From Binance in the Largest Hack in History](https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history)
- [BleepingComputer: Binance links $6.3 billion crypto theft to compromised DevOps laptop](https://www.bleepingcomputer.com/news/security/binance-links-63-billion-crypto-theft-to-compromised-devops-laptop/)
- [The Verge: Binance hackers stole $6.3 billion in record-breaking crypto heist](https://www.theverge.com/tech/1023021/binance-hack-billions-biggest-crypto-heist)
- [BBC News: Binance hack updates](https://www.bbc.com/news/live/cqrmynd3042gt)
- [ITmedia NEWS: Binanceの約1兆円流出、北朝鮮ハッカー集団「TraderTraitor」の犯行か](https://www.itmedia.co.jp/news/article/2610/31/2000002775/)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
