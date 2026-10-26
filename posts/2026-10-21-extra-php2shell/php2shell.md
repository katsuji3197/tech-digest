---
title: PHP 本体に致命的な脆弱性2件「php2shell」。修正版は今夜23時、情報は公開前に流出
date: 2026-10-21
order: 1
teaser: CVSS v4.0 で 9.2 の脆弱性が2件。リモートコード実行とみられ、PHP 5 以降が影響を受ける可能性がある。IPA も「事前準備のお願い」を公開した。
cover: /images/2026-10-21-extra-php2shell/php2shell-hero.png
cover_caption: GMO Flatt Security の速報記事のアイキャッチ（画像: [GMO Flatt Security Blog](https://blog.flatt.tech/entry/php2shell)）
---

PHP のセキュリティチームは10月20日、深刻度「Critical」の脆弱性2件を直すセキュリティリリースを、**10月21日 14:00 UTC（日本時間 同日23:00）**に出すと予告しました。CVSS v4.0 の評価はどちらも **9.2** です。研究者のあいだでは「**php2shell**」と呼ばれていて、外部から任意のコードを実行される（RCE）脆弱性とみられています。修正版が出る前に情報が漏れたため、各国のセキュリティ機関が「すぐ当てられるよう準備を」と呼びかけています。

## 背景

Huntress のまとめによると、10月20日の朝（米国時間）、PHP に重大な脆弱性2件が見つかったという投稿が Hacker News に出ました。投稿はすぐ消されましたが、スクリーンショットが SNS に広まりました。数時間後、セキュリティ企業 watchTowr が「脆弱性は本物だ」と認め、CVE-2026-109618 を再現できたと明かしています。watchTowr は「本来は木曜（22日）午前11時（米東部時間）まで待つはずだった」と書いており、公開は予定より1日早まった形です。

PHP は WordPress、Drupal、Magento などの CMS や EC、レンタルサーバー、管理パネルの中で広く動いています。今回はその上のアプリではなく、**PHP 本体**の問題とされているため、影響の範囲がとても広くなる可能性があります。

![PHP 公式サイトの事前告知](/images/2026-10-21-extra-php2shell/php2shell-notice.png "PHP 公式サイトに出た事前告知「Upcoming Critical PHP Security Release」（画像: [窓の杜](https://forest.watch.impress.co.jp/docs/news/2149962.html)）")

## 何が起きたか

- **公式の告知**: php.net は「Upcoming Critical PHP Security Release」として、2件の Critical な脆弱性を修正すると発表しました。影響するバージョン、修正版、技術的な詳細はリリースと同時に出すとしています。詳細が公になったり、実際の悪用が見つかったりした場合は、前倒しする可能性もあるそうです。
- **CVE 番号**: CERT-EU などは CVE-2026-109618 と CVE-2026-109619 としています。CERT-EU は「PHP 5 以降のすべてのバージョンが影響を受ける可能性がある」と書いています。
- **サポート切れの版**: Huntress や GoDaddy は、修正が出るのはサポート中のブランチだけになりそうだと伝えています。GoDaddy は、PHP 8.1 以前はもう公式の修正が出ないので、8.2 以降に上げる計画を立てるよう案内しています。
- **原因の見立て**: GMO Flatt Security は、研究者の動画に Ubuntu 26.04 の PHP 8.5.4（Apache の mod_php）で攻撃が成功する様子が映っていたことから、**メモリ破壊系**の脆弱性とみています。また、独自の調査で見つけた問題と一致するなら、既定で有効な **Session Upload Progress 機能（ext/session）**に関係するとの見立てです。ただし公式な説明はまだありません。
- **悪用の状況**: Huntress は、20日時点で実際の悪用は確認していないと書いています。一方で Flatt Security は21日14時（日本時間）の追記で、「悪用できると主張するコードがネット上に出回り始めた」としています。

## 今夜までにやること

各機関の案内をまとめると、次のとおりです。

1. **PHP が動いている場所を洗い出す**: Web サーバーだけでなく、管理パネル、ベンダー製品、ネットワーク機器の中の PHP も対象です（IPA、Huntress）。
2. **23時（日本時間）以降すぐに更新できるよう準備する**: 更新手順と、更新後の動作確認（E2E テストなど）を決めておきます（Flatt Security）。
3. **暫定の緩和策**: `php.ini` か `.user.ini` で `session.upload_progress.enabled = 0` にする方法が広まっています。ただし PHP 公式の対策ではありません。Flatt Security は追記で、これだけでは攻撃は防げず、緩和にとどまるとみています。アップロードの進捗バーが止まることもあります（GoDaddy）。
4. **すぐ当てられない場合**: CERT-EU は、インターネットに公開しているアプリをネットワークから切り離すことも検討するよう勧めています。
5. **監視**: Huntress は、`php-fpm` や `apache2` などから `sh`、`curl`、`wget` といったプロセスが起動していないかを見るよう勧めています。

## なぜ重要か

（編集部の視点）フロントエンドのチームでも、PHP と無関係とは限りません。マーケティングサイトやオウンドメディアを WordPress で運用していたり、Next.js などのフロントを WordPress のヘッドレス CMS や PHP の API とつないでいたりするケースはよくあります。レンタルサーバーに置いたままの古いキャンペーンページなど、存在を忘れている PHP こそ危険です。今夜の修正版が出る前に、自分のプロダクトの周りで PHP が動いている場所をインフラ担当と一緒に確認しておくと安心です。

## 反応・論点

- IPA は21日、「【事前準備のお願い】PHPのセキュリティリリース公開予定について」を出しました。悪用はまだ確認していないとしつつ、サポートが切れた古い PHP を使い続けているサイトがあると指摘し、攻撃者がごく短時間で攻撃する可能性があるとして、すばやい適用を求めています。
- 窓の杜は、発見者とみられる Kirill Firsov 氏（@k_firsov）の「Tomorrow is a helluva day.（明日はとんでもない日になる）」という X の投稿を紹介しています。
- X では、「PHP」と脆弱性に関する言葉を含む投稿が、21日の朝から夕方にかけて急に増えました。17時台（日本時間）だけで約5,500件です。GMO Flatt Security の解説記事は、はてなブックマークでも100件以上ブックマークされています。
- レンタルサーバー向けのパネル製品 BlueOnyx は、上記の設定を自動で入れる暫定の修正を配りました。ただし「効果は確認できていない、本当の修正ではない」と明記しています。

## 参考リンク

- [PHP: Upcoming Critical PHP Security Release（News Archive 2026）](https://www.php.net/archive/2026.php)
- [IPA: 【事前準備のお願い】PHPのセキュリティリリース公開予定について](https://www.ipa.go.jp/security/security-alert/2026/pre-alert20261021.html)
- [GMO Flatt Security Blog: PHPの重大な脆弱性「php2shell」（CVE-2026-109618、CVE-2026-109619）の概要と対応指針](https://blog.flatt.tech/entry/php2shell)
- [窓の杜: 「PHP」に“致命的”な脆弱性2件、日本時間21日深夜に緊急のセキュリティリリースへ](https://forest.watch.impress.co.jp/docs/news/2149962.html)
- [CERT-EU: Critical Vulnerabilities in PHP](https://cert.europa.eu/publications/security-advisories/2026-018)
- [Huntress: Rapid Response: php2shell, Leaked Critical PHP Vulnerabilities](https://www.huntress.com/blog/php2shell-leaked-critical-php-vulnerabilities)
- [BleepingComputer: PHP warns admins of two critical flaws, emergency patches coming tomorrow](https://www.bleepingcomputer.com/news/security/php-warns-admins-of-two-critical-flaws-emergency-patches-coming-tomorrow/)
- [GoDaddy Blog: Important PHP security update: What website owners need to do](https://www.godaddy.com/resources/news/important-php-security-update-what-website-owners-need-to-do)
- [BlueOnyx: CVE-2026-109618 and CVE-2026-109619](https://www.blueonyx.it/news/cve-2026-109618-and-cve-2026-109619.html)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。

---

※ この記事は10月21日18時台（日本時間）の情報にもとづいています。影響するバージョンと修正版は、23時のリリースで正式に発表されます。
