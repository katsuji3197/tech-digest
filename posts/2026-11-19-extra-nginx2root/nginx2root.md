---
title: nginx2root――HTTP/2 のフロー制御のバグで NGINX が乗っ取られる。10年前の 1.9.5 から全バージョンが対象
date: 2026-11-18
order: 1
teaser: HTTP/2 を有効にした NGINX に、認証なしでコードを実行される脆弱性が2件。F5 は CVSS 4.0 で 9.2 と評価し、1.30.7／1.31.9 で修正しました。RCE の PoC は GitHub で公開済み。更新できないなら HTTP/2 を切るのが当面の回避策です。
cover: /images/2026-11-19-extra-nginx2root/nginx2root-hero.jpg
cover_caption: Wiz Research による CVE-2026-123633／CVE-2026-123007 の解説画像（画像: [Wiz Blog「Unauthenticated Remote Code Execution in NGINX」](https://www.wiz.io/blog/nginx-http2-rce-vulnerabilities)）
---

世界で最も使われている Web サーバー NGINX に、認証なしで遠隔からコードを実行されうる脆弱性が見つかりました。通称 **nginx2root**。中心となる **CVE-2026-123007** と **CVE-2026-123633** はどちらも HTTP/2 の処理のバグで、F5 は CVSS 4.0 で **9.2（Critical）** と評価しています。F5 は米国時間11月18日（**日本時間19日未明**）に修正版 **NGINX 1.30.7（stable）／1.31.9（mainline）** を公開しました。CVE-2026-123007 は2015年の 1.9.5 から入っていたバグで、RCE の概念実証コード（PoC）はすでに GitHub で公開されています。

## 背景

NGINX は HTTPS を受けてアプリや API に振り分ける「玄関」として使われることが多く、Wiz によると2億2,500万以上のサイトで動いています。1台の NGINX が複数のアプリを受け持つことも多いため、ここが破られると後ろのサービスがまとめて危険にさらされます。

今回は Wiz Research、Ikotas Labs、Metnir、Rapid7、Xint の**5チームが独立に**同じ脆弱性を見つけ、F5 に報告しました。Wiz は AI を使って見つけ、Gemini 4 Carbon と ChatGPT 5.6 Sol で影響を確かめたと説明しています。10月の PHP2Shell、前日の Java4Shell と同じく、長年見つからなかったメモリ破壊のバグが AI で掘り起こされた形です。

## 何が起きたか

- **CVE-2026-123007**（HTTP/2 の send_window の整数アンダーフロー）: フロー制御の計算の誤りで不正なメモリコピーが起きる。**HTTP/2 が有効なだけで対象**。Wiz は、バックエンドもサードパーティのモジュールもない、普通の静的ファイルを TLS で配る構成で RCE を実証しました。対象は **1.9.5〜1.31.8**
- **CVE-2026-123633**（HTTP/2 の use-after-free）: リバースプロキシとして使い、`worker_connections` の空きが少なくなったときに起きる。対象は **1.19.7〜1.31.8**。nginx.org の深刻度は medium
- **同時に修正された脆弱性**: HTTP/3（CVE-2026-121810）、DNS リゾルバー（CVE-2026-123634）、メールプロキシ（CVE-2026-113425）の use-after-free も、それぞれの構成で RCE につながるとされます。1.30.7／1.31.9 はこの5件すべてを直しています（The Hacker News）
- **攻撃で得られる権限**: NGINX のワーカープロセスの権限。ただし Xint は、Linux カーネルの SCTP の別のバグと組み合わせ、Docker コンテナの中からでもホストの root を取れることを示しました
- **PoC と悪用**: Rapid7 が RCE までの PoC を GitHub で公開。一方で、この攻撃は1本の接続に**約128GB**の HTTP/2 通信を送る必要があり、デモでは2分半かかりました。約300Mbit/s より遅い回線では NGINX の既定の1時間の接続上限を超えて失敗します（The Hacker News）。18日時点で実際の攻撃の報告はなく、CISA の KEV にも載っていません
- **修正版の配布状況**: Docker Hub の公式イメージには 1.31.9 と 1.30.7 のタグが出ています（日本時間19日朝に確認）。一方、18日時点で Ubuntu と Debian のパッケージは未修正でした（The Hacker News）。ディストリは版数を変えずに修正を取り込むことがあるので、`nginx -v` ではなく各ディストリのアドバイザリで確かめます

### 確認と回避

HTTP/2 が有効かどうかは、`listen` に `http2` が付いているか、`http2 on` があるかで分かります。外から確かめるなら `openssl s_client` に `-alpn h2` を付けて接続し、`ALPN protocol: h2` と出れば HTTP/2 を受け付けています。CDN の後ろにある場合は、NGINX のオリジンそのものを確認します（The Hacker News）。

すぐ更新できない場合の回避策は HTTP/2 を止めることです（Wiz、CIRCL）。

- 1.25.1 以降: 対象の `server` ブロックで `http2 off;` を設定し、`listen` からも `http2` を外す
- 1.9.5〜1.25.0: `listen 443 ssl http2;` を `listen 443 ssl;` にする

更新したら、reload ではなく**再起動**（またはバイナリのライブ更新）が必要です。reload だけでは古い実行ファイルが動き続けます。

## なぜ重要か

フロントエンドの配信は、静的ファイルを NGINX で返すだけ、という構成がいまも多くあります。今回の CVE-2026-123007 は、その「何もしていない」構成がそのまま対象です。アプリのコードがどれだけ安全でも関係ありません。SPA を配る Docker イメージの `FROM nginx`、BFF の前に置いたリバースプロキシ、社内ツールの配信サーバーなど、まず「どこで NGINX が動いているか」の棚卸しから始めるのが近道です。（編集部の視点）

Vercel や Cloudflare などのマネージドな配信基盤に載せているサイトは自分で NGINX を動かしていませんが、オリジンや自前の API サーバーに NGINX がいれば対象になりえます。（編集部の視点）

## 反応・論点

- **Kubernetes の ingress-nginx には修正が出ない**: コミュニティ版の kubernetes/ingress-nginx は2026年3月にアーカイブされており、同梱の NGINX は 1.27.1、HTTP/2 も既定で有効です。Upwind、Aikido、JFrog はいずれも「修正は出ない」としており、ConfigMap で `use-http2: "false"` にして、保守されている Ingress／Gateway API 実装への移行を勧めています。F5 版の NGINX Ingress Controller は 5.8.0、NGINX Gateway Fabric は 2.9.0 で修正済み（Upwind）
- **HTTP/2 を切れない構成**: `grpc_pass` は HTTP/2 が必要なため、gRPC のフロントでは回避策が使えない、と Upwind は指摘しています
- **同梱している製品**: OpenResty、Kong、Apache APISIX など NGINX を内蔵する製品は、それぞれの更新が必要です（Sophos、Chainguard）
- **発見のクレジット**: X では、Xint が見つけたものを Wiz が「自分たちが公表」と打ち出した、と PHP2Shell のときと同じ構図を指摘する投稿もありました。X で NGINX の脆弱性に触れた投稿は、公表後の日本時間19日0時から8時台までで約900件です

## 参考リンク

- Wiz Blog: [Unauthenticated Remote Code Execution in NGINX: CVE-2026-123633 and CVE-2026-123007](https://www.wiz.io/blog/nginx-http2-rce-vulnerabilities)
- nginx.org: [nginx security advisories](https://nginx.org/en/security_advisories.html)
- The Hacker News: [10-Year-Old NGINX HTTP/2 Flaw Lets Unauthenticated Attackers Execute Code on Servers](https://thehackernews.com/2026/11/10-year-old-nginx-http2-flaw-lets.html)
- Upwind: [Remote Code Execution in NGINX HTTP/2: CVE-2026-123007 and CVE-2026-123633](https://www.upwind.io/blog/nginx-cve-2026-123007-and-cve-2026-123633-four-web-facing-rces-one-patch-and-where-kubernetes-is-exposed)
- Aikido: [nginx2root: Critical nginx vulnerabilities, including one RCE](https://www.aikido.dev/blog/nginx2root-critical-nginx-rce-vulnerabilities)
- JFrog Security Research: [Nginx2Shell: All You Need to Know About CVE-2026-123007 and CVE-2026-123633](https://research.jfrog.com/post/nginx2shell-all-you-need-to-know-about-cve-2026-123007-and-cve-2026-123633/)
- Sophos: [Advisory: NGINX Vulnerabilities - nginx2root](https://www.sophos.com/en-us/security-advisories/sophos-sa-20261118-nginx2root)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
