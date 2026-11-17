---
title: Java4Shell（CVE-2026-114938）――「A」64文字と「=」で OpenJDK のヒープが壊れる。対象は Java 17.0.6 以降と AVX-512 対応 CPU
date: 2026-11-17
order: 1
teaser: OpenJDK の Base64 デコードを高速化する手書きのアセンブリにバグがあり、壊れた入力で配列の外にメモリを書き込みます。Calif は人気の Java 製品で認証なしの RCE を実証。Oracle と OpenJDK は日本時間18日6時に修正を出しましたが、Temurin など各ディストリの修正版はこれからです。
cover: /images/2026-11-18-extra-java4shell/java4shell-hero.jpg
cover_caption: Calif が公開した Java4Shell のポスター（画像: [Calif「Java4Shell: Write once, RCE everywhere」](https://calif.io/java4shell/)。アートワークは Michal Zalewski 氏）
---

Java の実行環境 OpenJDK に、認証なしで遠隔からコードを実行されうる脆弱性 **Java4Shell（CVE-2026-114938）** が見つかりました。発見したセキュリティ企業 Calif によると、深刻度は CVSS 4.0 で **9.2（Critical）**。Base64 文字列をデコードするだけで発火するため、ログイン処理やファイルのアップロードといったごく普通の機能が入口になります。OpenJDK と Oracle は太平洋時間11月17日13時（**日本時間18日6時**）に修正を公開しました。X では17日（UTC）の1日で関連の投稿が約2,100件に達しています。

## 背景

Calif は、10月に PHP 本体の RCE「PHP2Shell」を公表したチームです。今回も AI を使って脆弱性を見つけ、攻撃コードに仕上げたと説明しています。発見に1時間、最初の攻撃コードにさらに2時間、トークン代は200ドル未満だったといいます。

Java は自分でメモリを管理するのでメモリ破壊の心配が少ない言語です。ただし Java 自体の一部は C/C++ やアセンブリで書かれています。今回のバグは、Base64 デコードを速くするために x86-64 の **AVX-512 VBMI** 命令を使う、手書きのアセンブリにありました。

## 何が起きたか

- **仕組み**: 64文字の「A」のあとに「=」を1つ付けた65文字を渡すと、末尾の処理で出力長が負の値になり、50バイトの配列に64バイトを書き込みます。配列の外に62バイトがはみ出し、隣のオブジェクトを壊します（古い 17 系では「A」128文字＋「=」）。Java は最終的にこの入力を拒否しますが、その時点でメモリはもう壊れています（Calif）
- **実証された製品**（いずれも初期設定、Calif による。リストはこれで全部ではない）
  - 認証不要の RCE: Keycloak、Atlassian Jira、Confluence、JFrog Artifactory、Jenkins、PingFederate
  - 認証後の RCE: Apache Kafka Broker、Apache Solr、Elasticsearch、Gerrit、Spinnaker
  - Apache Struts や Spring Boot で作ったサンプルアプリでも RCE を確認。悪意のあるサーバーへ TLS 接続するだけで Java プログラムが乗っ取られる、クライアント側の攻撃も示されています
- **影響する条件**: OpenJDK **17.0.6 以降**（Temurin、Corretto、Microsoft Build of OpenJDK、Zulu、Red Hat、Oracle Java SE などの派生も含む）で、CPU が AVX-512 VBMI に対応していること。Intel Xeon の Ice Lake・Sapphire Rapids・Emerald Rapids・Granite Rapids、AMD の EPYC／Ryzen の Zen 4 以降が該当し、**ARM64 は影響なし**
- **修正版**: OpenJDK のアドバイザリでは CVE-2026-114938 は 17／21／25／27 系が対象。Oracle の修正版は 17.0.21.1、21.0.13.1、25.0.5.1、27.0.1.1（JFrog）。修正の実体は JDK-8393212（Endor Labs）
- **ディストリの状況**: Endor Labs によると、17日時点で公開の jdk17u／jdk21u／jdk25u リポジトリにはまだ修正が入っていません。Temurin などは各社の予定で出すため、**Oracle の番号と同じでも修正済みとは限りません**
- **悪用**: 17日時点で実際の攻撃の報告はなし（Aikido、Endor Labs）。Calif は製品ごとの攻撃コードを当面公開しないとしています

### 確認と回避

Linux では次のコマンドで CPU を確認できます。4つすべてが表示されたら対象です（Calif）。

```bash
grep -m1 '^flags' /proc/cpuinfo | tr ' ' '\n' | grep -E '^(avx512f|avx512bw|avx512vbmi|bmi2)$'
```

すぐ更新できない場合は、JVM を次のどちらかのオプション付きで起動し直すと、問題のコードを通らなくなります（Calif、JFrog）。

- `-XX:-UseBASE64Intrinsics`（Base64 のハードウェア高速化を止める）
- `-XX:UseAVX=2`（AVX-512 を止める。x86-64 のみ。ARM の OpenJDK はこのフラグを認識せず起動しなくなる）

## なぜ重要か

フロントエンドの仕事でも、Java はすぐ裏にいます。ログインを任せている **Keycloak**、ビルドを回す **Jenkins**、仕様を書く **Jira／Confluence**、BFF の向こうの **Spring Boot** の API。どれも「Base64 を受け取る」場面があり、今回はそれだけで入口になります。JWT や Basic 認証のヘッダー、画像のデータ URL、アップロードされたファイルなど、フロントから送る値も Base64 です。（編集部の視点）

クラウドの x86 インスタンスの多くは、該当する Xeon や EPYC です。一方で Graviton など ARM のインスタンスは影響を受けません。コンテナの基本イメージやアプリに同梱された JDK も見落としやすいので、「どこで Java が動いているか」の棚卸しから始めるのが近道です。（編集部の視点）

## 反応・論点

- **CVSS の数字の違い**: OpenJDK の公式アドバイザリは CVSS 3.1 で 8.1 としており、Calif の 9.2（CVSS 4.0）とは基準が違います（OpenJDK、Aikido）
- **「使わないコードを消せ」**: Calif は、ごく一部のアプリしか必要としない最適化が全員に配られ、それが危険になったと指摘。AI で不要なコードを探して削る「vibe-uncoding」を呼びかけています
- **Java 8／11**: Aikido は「Java SE 8 と 11 はこの CVE の影響なし」と整理しています。Oracle の11月の更新はほかの脆弱性も直しているため、8 や 11 も更新は必要です（getrff.com）

## 参考リンク

- Calif: [Java4Shell: Write once, RCE everywhere](https://calif.io/java4shell/)
- OpenJDK: [OpenJDK Vulnerability Advisory: 2026/11/17](https://openjdk.org/groups/vulnerability/advisories/2026-11-17)
- JFrog Security Research: [Java4Shell: What We Know About the Critical OpenJDK RCE Vulnerability](https://research.jfrog.com/post/java4shell-vulnerability/)
- Endor Labs: [Java4Shell (CVE-2026-114938): Pre-Auth Heap Overflow in OpenJDK](https://www.endorlabs.com/learn/java4shell-unauthenticated-rce-reported-in-openjdk-17-cve-2026-114938)
- Aikido: [Java4Shell: pre-auth RCE flaw in Java 17 puts servers at risk](https://www.aikido.dev/blog/java-17-rce-vulnerability-cve-2026-114938)
- Hacker News: [Java4Shell: RCE in OpenJDK when processing Base64](https://news.ycombinator.com/item?id=50538240)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
