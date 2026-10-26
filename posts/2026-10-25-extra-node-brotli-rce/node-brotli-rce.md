---
title: Node.js の Brotli デコーダに RCE 脆弱性「Node2Shell」――fetch() と Express 5 が入口、修正版へ今すぐ更新を
date: 2026-10-25
order: 1
teaser: 細工した Brotli 圧縮データを解凍するとメモリを書き壊せる CVE-2026-111497。Imperva が公式の Node.js 24.22.0 でコード実行を実証し、Bun や Python の Brotli パッケージ、Envoy にも影響が広がっています。Node.js 内に回避策はなく、更新だけが対策です。
cover: /images/2026-10-25-extra-node-brotli-rce/brotli-hero.jpg
cover_caption: 1つの Brotli デコーダを複数の製品が共有しているため、影響が Node.js 以外にも及ぶ（画像: [The Hacker News](https://thehackernews.com/2026/10/brotli-decoder-flaw-behind-nodejs-rce.html)）
---

Node.js が同梱している Brotli デコーダに、細工した圧縮データでプロセスのメモリを書き壊せる脆弱性 **CVE-2026-111497** が見つかりました。Node.js は米国時間10月21日に修正版 **22.23.4／24.22.1／26.12.1** を出しています。その後、セキュリティ企業の Imperva が「**Node2Shell**」と名付けた検証で、公式の Node.js 24.22.0 ビルド上でのコード実行を実証しました。10月24日には、同じデコーダを使う Bun や Python のパッケージ、Envoy にも影響が及ぶことが報じられています。

## 背景

Brotli は Google が作った圧縮形式で、Web のページや API のレスポンスを小さくするのに広く使われています。HTTP では `Content-Encoding: br` として送られます。今回の問題は、この圧縮データを元に戻す C のコード（デコーダ）にあります。Node.js、Bun、Envoy などはそれぞれ自分の中に同じデコーダのコピーを持っているため、**製品ごとに個別に更新が必要**です。

修正の経緯も少し変わっています。The Hacker News によると、問題を塞ぐ変更は2月27日に Brotli のソースコードへ入っていましたが、それを含む Brotli のリリースは10月21日まで出ていませんでした。発見したのは OpenAI の Codex Security チームの Khai Tran 氏と Sylvie Mayer 氏です。

## 何が起きたか

- **中身**: Node.js の公式アドバイザリによると、ありえないブロック切り替えを含む不正な入力を、デコーダが「入力がもっと必要」という一時的な状態として扱い、8バイトの内部バッファの後ろへ書き込み続けてしまいます。`node:zlib` で攻撃者が用意した Brotli データを解凍すると、クラッシュ、メモリ内容の漏えい、リモートでのコード実行につながるおそれがあります。
- **深刻度**: Node.js は High、CVE を割り当てた Google は CVSS 4.0 で 9.2（Critical）、Red Hat は 8.1 と評価しています。シンガポールのサイバーセキュリティ庁（CSA）は CVSS 3.1 で 9.8（Critical）としています。
- **実証**: Imperva は Linux arm64 向けの公式イメージ Node.js 24.22.0 で、外から取得したレスポンス（`fetch()`）と Express のリクエストボディの両方の経路でコード実行を確認しました。成功までには何度か試行が必要でした。24.22.1 では同じ入力が拒否されています。The Hacker News によると、先に出回った公開 PoC がコード実行まで届いたのは意図的に弱くしたビルドだけで、通常のビルドではクラッシュと限られたメモリ読み出しにとどまっていました。
- **入口になるもの**: Node.js が勝手に Brotli を解凍するわけではありません。危ないのは、**組み込みの `fetch()` が `br` のレスポンスを読むとき**と、**Express 5 の `express.json()` などや body-parser 2 が Brotli のリクエストボディを解凍するとき**です。
- **ほかの製品**: Bun は 1.4.4、Python の `Brotli` は 1.2.1、`brotlicffi` は 1.2.1.0、Envoy は 1.40.0 などで修正されました。Python では、パッケージが入っているだけで requests や httpx などが自動で Brotli を解凍するため、自分のコードで import していなくても影響を受けることがあります。
- **悪用状況**: 10月23日時点で、実際の攻撃は報告されていません。

![Imperva の Node2Shell](/images/2026-10-25-extra-node-brotli-rce/node2shell.png "Imperva Threat Research による Node2Shell の解説（画像: [Imperva](https://www.imperva.com/blog/node2shell-from-brotli-data-to-remote-code-execution/)）")

## なぜ重要か

（編集部の視点）フロントエンドのチームでも、Next.js などの SSR、BFF、画像の最適化、ビルドや CI で Node.js を動かしていることがほとんどです。**外部の API や CDN から `fetch()` でデータを取ってくるだけで入口になり得る**ので、「うちはサーバーを書いていない」とは言い切れません。

Vercel は10月21日に WAF のルールを全プロジェクトへ入れ、管理しているランタイムにも修正版を順に適用しています。ただし WAF は**関数が外部から取得するレスポンスは守れない**と明記しています。Node.js 20.x のプロジェクトは修正が出ないため、22.x か 24.x に変えて再デプロイが必要です。セルフホストの Next.js について Vercel は、画像最適化で Brotli のレスポンスを止める仕組みはないとして、Node.js 自体の更新を求めています。

対応は次のとおりです。

1. Node.js を 22.23.4／24.22.1／26.12.1 以降へ上げる。コンテナイメージは作り直し、プロセスを再起動する（動いているプロセスは古いデコーダのまま）。
2. ローカル環境と CI ランナーも忘れずに更新する。
3. Bun や Python の Brotli パッケージを使っていれば、それも更新する。Python のパッケージは Dependabot などで検出されないことがあるため、手で版を確かめる。

Node.js には回避策がなく、更新が唯一の対策です。なお、`Accept-Encoding` から `br` を外しても、サーバーが Brotli を送ってくれば効かないと The Hacker News は指摘しています。

## 反応・論点

- OpenAI は、修正していないサーバーは悪意あるクライアントに、修正していないクライアント（`curl --compressed` など）は悪意あるサーバーに乗っ取られうる、という趣旨を説明しています（The Hacker News）。
- 深刻度の評価が組織で分かれており、Node.js の「High」に対して Google と CSA は Critical 相当としています。
- X では、「Node2Shell」「CVE-2026-111497」などを含む投稿が、10月22日（UTC）に約1800件、10月24日（UTC）は日本時間8時すぎまでに約3100件と、週末にかけて増えています（X API の投稿数集計より）。

## 参考リンク

- [Node.js: October 21, 2026 Security Releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
- [Imperva: Node2Shell: From Brotli Data to Remote Code Execution](https://www.imperva.com/blog/node2shell-from-brotli-data-to-remote-code-execution/)
- [Vercel: Node.js security advisory](https://vercel.com/kb/bulletin/node-js-security-advisory)
- [The Hacker News: Brotli Decoder Flaw Behind Node.js RCE Also Affects Bun, Python and Other Widely Used Software](https://thehackernews.com/2026/10/brotli-decoder-flaw-behind-nodejs-rce.html)
- [The Hacker News: Researchers Demonstrate Node2Shell RCE Exploit on Node.js Build Using Crafted Brotli Data](https://thehackernews.com/2026/10/researchers-demonstrate-node2shell-rce.html)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
