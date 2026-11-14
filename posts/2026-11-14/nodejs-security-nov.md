---
title: Node.js が11月の定例セキュリティリリース――HTTPS で他の接続のメモリ（TLS 秘密鍵を含む）が読める欠陥など High 最大7件、22.23.5 / 24.22.3 / 26.13.1 へ更新を
date: 2026-11-11
order: 4
teaser: Node.js プロジェクトが 26.x・24.x・22.x 向けのセキュリティ更新を出しました。認証不要のクライアントが HTTP/2 サーバーを落とせる欠陥や、HTTPS で他の接続のメモリを読める欠陥が含まれます。SSR・BFF・API を Node で動かしているチームは更新が必要です。
cover: /images/2026-11-14/nodejs-security-hero.png
cover_caption: Node.js 公式ブログ「Wednesday, November 11, 2026 Security Releases」の OG 画像（画像: [Node.js](https://nodejs.org/en/blog/vulnerability/november-2026-security-releases)）
---

Node.js プロジェクトは11月11日（米国時間、日本時間12日未明）、サポート中の3系統向けにセキュリティリリース **Node.js 22.23.5（Jod）、24.22.3（Krypton）、26.13.1（Lithium）** を公開しました。最高の深刻度は High です。HTTP/2 と TLS まわりの修正が中心で、依存ライブラリの llhttp、undici、sqlite も更新されています。

## 背景

Node.js は、深刻度の高い修正をまとめて出す定例のセキュリティリリースを行っています。10月下旬には本サイトの号外で [Brotli 経由の RCE「Node2Shell」](/posts/2026-10-25-extra-node-brotli-rce/node-brotli-rce/) を取り上げました。今週は [Apache HTTP Server の mod_http2 RCE](/posts/2026-11-12-extra-apache-http2-rce/apache-http2-rce/) も出ており、HTTP/2 実装への攻撃が続いています。

## 何が起きたか

公式アドバイザリとリリースノートによると、主な修正は次のとおりです。

- **CVE-2026-123863（High）**: HTTP/2 のセッション破棄時に到達可能なアサーションがあり、認証不要のクライアントがサーバープロセスを異常終了させられます。TLS でも平文でも成立します。リクエストボディを受け取り終える前に応答する、ごく一般的なハンドラーで起きます。CVE-2024-27983 の修正が及んでいなかった変種です。
- **CVE-2026-123864（High）**: HTTPS でゼロ長の TLS 書き込みが HTTP パーサーを再入させ、use-after-free と範囲外のヒープ読み出しが起きます。認証不要のクライアントが、**TLS 秘密鍵や他ユーザーのリクエストを含む他の接続のメモリ**を読める可能性があります。22.x・24.x・26.x のすべてが対象です。
- ほかに High として、HTTP/2 ストリームの扱い（CVE-2026-123865、123866、123874）と、TLS の再開や再ネゴシエーションで SNI が変えられる問題（CVE-2026-123872）が修正されました。24.x と 26.x には、リモートから TLS サーバーを落とせる問題（CVE-2026-126051）の修正もあります。
- Medium は、プロキシ URL のエラーメッセージへの認証情報の露出（CVE-2026-123871）、https Agent の TLS ポリシーキーの分離（CVE-2026-123877）など。Low は、パーミッションモデル関連などです。
- 依存の更新は、llhttp 9.4.4、sqlite 3.54.1、undici（24.x は 7.30.2、26.x は 8.12.4）、brotli 1.2.1（24.x・26.x）です。
- サポートが終わったバージョンは、セキュリティリリースのたびに常に影響を受ける、と公式は明記しています。

## なぜ重要か

（編集部の視点）フロントエンドのチームでも、Next.js などの SSR、BFF、エッジの手前に置く Node サーバーは珍しくありません。特に CVE-2026-123864 は、TLS 終端を Node 自身が担う構成で、**他の利用者のリクエストや秘密鍵が漏れる**という重い性質です。HTTP/2 を有効にした Node サーバーは、123863 で簡単に落とされます。ロードバランサーで TLS を終端していても、内部で Node の https や http2 を使っていれば対象になりえます。

（編集部の視点）対応は、使っている系統の修正版へ上げてプロセスを再起動することです。Docker のベースイメージ、CI の `setup-node`、`.nvmrc` や `engines` の固定も忘れずに更新しましょう。Vercel などのマネージド実行環境を使う場合も、ランタイムの更新状況を確認しておくと安心です。

## 反応・論点

- Node.js 公式 X アカウントの告知は約20万回表示され、500件超のリポストで広まりました。
- カナダ・サイバーセキュリティセンターは11月12日、v22.23.5、v24.22.3、v26.13.1 より前のバージョンが影響を受けるとして、勧告 AV26-1156 で更新を呼びかけています。
- 修正の多くは Matteo Collina 氏、TLS 関連は Tim Perry 氏が手がけたことがリリースノートに記されています。

## 参考リンク

- [Node.js: Wednesday, November 11, 2026 Security Releases](https://nodejs.org/en/blog/vulnerability/november-2026-security-releases)
- [Node.js: Node.js 22.23.5 (LTS)](https://nodejs.org/en/blog/release/v22.23.5)
- [Node.js: Node.js 24.22.3 (LTS)](https://nodejs.org/en/blog/release/v24.22.3)
- [Node.js: Node.js 26.13.1 (LTS)](https://nodejs.org/en/blog/release/v26.13.1)
- [Canadian Centre for Cyber Security: Nodejs security advisory (AV26-1156)](https://www.cyber.gc.ca/en/alerts-advisories/nodejs-security-advisory-av26-1156)
- [X: Node.js 公式の告知](https://x.com/nodejs/status/2120574018311123265)

**動画:** 確認できた関連動画はありません（動画なし）。
