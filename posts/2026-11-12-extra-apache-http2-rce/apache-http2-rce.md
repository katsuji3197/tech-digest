---
title: Apache HTTP Server の mod_http2 に重大な RCE「CVE-2026-119618」――2.4.55〜2.4.70 が対象、HTTP/2 を止めるのが暫定策
date: 2026-11-11
order: 1
teaser: HTTP/2 の処理で起きる競合状態からヒープが壊れ、認証なしで遠隔からコードを実行されうる脆弱性。Red Hat は CVSS 9.8 と評価しています。修正版は 2.4.71。Debian 安定版や Amazon Linux はまだ修正待ちです。
cover: /images/2026-11-12-extra-apache-http2-rce/apache-http2-hero.png
cover_caption: CVE-2026-119618 の要点（画像: 編集部作成。内容は [Apache HTTP Server 公式アドバイザリ](https://httpd.apache.org/security/vulnerabilities_24.html) と [Red Hat](https://access.redhat.com/security/cve/cve-2026-119618) にもとづく）
---

Apache HTTP Server の HTTP/2 モジュール **mod_http2** に、重大な脆弱性 **CVE-2026-119618** が見つかりました。Apache は2026年11月11日に修正版 **2.4.71** を公開し、重大度を最上位の critical としています。Red Hat によると、HTTP/2 を有効にしたサーバーに届く攻撃者なら、**認証なしで任意のコマンドを実行できる**おそれがあります。日本時間12日の午後から、X でもこの話題が急に増えています。

## 背景

mod_http2 は、Apache で HTTP/2 を使うためのモジュールです。HTTP/2 では1本の接続で複数のリクエストを同時に送れるため、モジュールは複数のスレッドで並行して処理します。Red Hat の説明では、このときスレッド間の同期に不備があり、あるスレッドが別のスレッドのメモリを書き換えてしまいます。

Apache の公式アドバイザリによると、最初に報告したのは Anthropic の「OSS Scanner」（10月26日）、続いて Google Cloud Vulnerability Research の Anthony Weems 氏と Simon Scannell 氏（11月3日）です。

## 何が起きたか

- **中身**: mod_http2 の `assign_headers()` で競合状態が起き、ヒープが壊れて RCE につながる（Apache 公式）
- **影響バージョン**: Apache HTTP Server **2.4.55〜2.4.70**。GitHub で配布されている単体版 mod_h2 は **2.0.8〜2.0.42**
- **条件**: `Protocols` ディレクティブで HTTP/2（`h2` または `h2c`）を有効にしているサーバーだけ。HTTP/1.1 だけなら影響しない（Red Hat）
- **深刻度**: Red Hat の評価は CVSS 9.8。ただし RHEL 9／10 の mod_http2 は HTTP/2 のストリームごとに別のメモリアロケーターを使うため、攻撃がかなり難しくなるとして Important に下げています。RHEL 8 以前は影響しません
- **2.4.71 の他の修正**: mod_md の NULL ポインタ参照（important）と、mod_vhost_alias の1バイトのスタック上書き（low）

ディストリごとの状況は次のとおりです（The Hacker News が11月12日に各トラッカーで確認した内容と、Debian のトラッカー）。

| 配布元 | 状況 |
|---|---|
| Apache 公式 | 2.4.71 で修正 |
| RHEL 9 | 修正済み（RHSA-2026:98981, `mod_http2-2.0.26-7.el9_9.1`） |
| RHEL 10 | 修正済み（RHSA-2026:98978） |
| Debian sid | `apache2 2.4.71-1` で修正 |
| Debian bookworm／trixie／forky | 未修正 |
| Amazon Linux 2／2023 | 修正待ち |
| Ubuntu | 確認時点で CVE ページなし |

単体版 mod_h2 について、Upwind は「2.0.43 で修正」としています。一方、GitHub の icing/mod_h2 は2026年6月9日にアーカイブされていて、リリースは 2.0.42 で止まっています（編集部が GitHub で確認）。

## なぜ重要か

Vercel や Netlify のようなマネージドなホスティングに置いているフロントエンドは、自分で Apache を動かしていなければ今回は関係ありません。注意したいのは、**自分たちで管理しているサーバー**です。たとえば、API の前に置いたリバースプロキシ、社内向けの静的配信、ステージングや検証用の VM、古い LAMP 構成のサイトなどです。

HTTP/2 は、TLS と組み合わせて「とりあえず有効にしておく」ことが多い設定です。2.4.67 で別の HTTP/2 の脆弱性（CVE-2026-23918）を直した後も、2.4.70 までは今回の影響範囲に入ります。「最近アップデートしたから大丈夫」とは言えません（編集部の視点）。

## 反応・論点

いちばんの論点は、**攻撃コードがあるかどうか**で情報源の言い方が違うことです。Red Hat は「公開された研究で、mod_http2 を有効にした標準設定のサーバーに対する信頼性の高いエクスプロイトが示されている」という趣旨を書いています。一方、Wiz は11月11日の公開時点で「エクスプロイトはなく、実際の悪用の報告もない」としています。The Hacker News は、Red Hat がその研究の名前やリンクを示していないと指摘しています。

Wiz によると、**クラウド環境の64%** に脆弱なリソースがあり、**51%** には外部に公開されたインスタンスがあります。ただし、この数字は HTTP/2 を有効にしているかどうかを考えていません。

X では、同じ 2.4.71 で直った mod_md の脆弱性（CVE-2026-106023）の発見者の一人、striga.ai の Bartłomiej Dmitruk 氏が、Anthropic と Google が見つけた CVE-2026-119618 と並んで自分たちの脆弱性も修正された、という趣旨を[投稿](https://x.com/hackerman_70000/status/2120619816520147412)しています。ほかに、NVD のスコアがまだ付いていないので多くのスキャナーで引っかからないのでは、と心配する[声](https://x.com/cajdavidson/status/2120622392905240910)もあります。X での言及は日本時間12日15時ごろから1時間に40〜50件に増え、11日夜からの合計は約380件です（X の投稿数カウントより）。

## やるべきこと

1. **バージョンと HTTP/2 の有無を確認する**: `httpd -v`（Debian 系は `apache2 -v`）でバージョン、`httpd -M | grep http2` で mod_http2 が読み込まれているかを見ます。設定ファイルの `Protocols` に `h2`／`h2c` がないかも確認します。サーバー全体とバーチャルホストごとの両方に書ける点に注意します（The Hacker News）。
2. **更新する**: 公式版なら 2.4.71 以降へ。ディストリ版なら、上の表の修正パッケージを入れます。
3. **すぐ更新できなければ HTTP/2 を止める**: Wiz が勧める暫定策は、`h2` と `h2c` を外して次の1行にすることです。

```apache
Protocols http/1.1
```

設定を変えたら `apachectl -t` で構文を確認して、再起動します。Apache 公式のアドバイザリには回避策が書かれていないので、これはあくまで一時しのぎです。

## 参考リンク

- Apache HTTP Server Project: [Apache HTTP Server 2.4 vulnerabilities](https://httpd.apache.org/security/vulnerabilities_24.html)
- Red Hat Customer Portal: [CVE-2026-119618](https://access.redhat.com/security/cve/cve-2026-119618)
- Wiz Blog: [Critical RCE Vulnerability in Apache HTTP Server: Everything You Need To Know](https://www.wiz.io/blog/cve-2026-119618-rce-apache-http-server-vulnerability)
- The Hacker News: [Critical Apache HTTP/2 Flaw Could Let Unauthenticated Attackers Execute Code Remotely](https://thehackernews.com/2026/11/critical-apache-http2-flaw-could-let.html)
- Upwind: [CVE-2026-119618 – Apache HTTP Server mod_http2 race in assign_headers() enables heap corruption and RCE](https://www.upwind.io/blog/threat-post/cve-2026-119618-apache-http-server-mod_http2-race-in-assign_headers-enables-heap-corruption-and-rce)
- Debian Security Tracker: [CVE-2026-119618](https://security-tracker.debian.org/tracker/CVE-2026-119618)
- Apache HTTP Server ドキュメント: [Protocols ディレクティブ（core）](https://httpd.apache.org/docs/2.4/mod/core.html#protocols)
- X: [Bartłomiej Dmitruk 氏の投稿](https://x.com/hackerman_70000/status/2120619816520147412)
- X: [Chris Davidson 氏の投稿](https://x.com/cajdavidson/status/2120622392905240910)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
