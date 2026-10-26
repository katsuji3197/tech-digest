---
title: TypeScript を Rust に移植した「tsrs」――TS 7.0 比で最大8倍速、メモリ約7割減。Cloudflare と VoidZero が発表
date: 2026-10-20
order: 1
teaser: TypeScript チームと連携した「フォークではない」移植で、Oxc ツールチェーンの一部として育てる。npm ですぐ試せるが、まだ実験的リリース。
cover: /images/2026-10-21-extra-tsrs/tsrs-hero.png
cover_caption: Cloudflare ブログの発表記事のアイキャッチ（画像: [Cloudflare Blog](https://blog.cloudflare.com/typescript-rust-port/)）
---

Cloudflare と VoidZero は10月20日（日本時間同日22時ごろ）、TypeScript コンパイラを Rust に移植した **tsrs** を発表しました。初期ベンチマークでは、TypeScript 7.0 と比べて型チェックが**最大8倍速く**、メモリ使用量は**約70%少ない**としています。TypeScript チームと密に連携した移植で、「フォークではない」と明言しているのが大きな特徴です。

## 背景

TypeScript は 7.0 で、コンパイラを JavaScript から Go に移植しました（いわゆる tsgo）。Cloudflare はこの移植で TypeScript が約10倍速くなったと紹介しています。一方でこの秋には、AI エージェントを使って TypeScript を Rust などに移植する試みが相次いでいました。Cloudflare のブログは「最先端の AI モデルは、大規模な移植を数日でほぼ自律的にこなせるようになった」と書いています。

tsrs も、Owner.com の Max Schwenk 氏が始めたプロジェクトです。WebProNews によると、同氏は Anthropic の Claude Opus 5.5 に Go 版コンパイラの忠実な Rust 移植を任せ、自分では「コードを1行も書いていない」と述べています。

## 何が起きたか

- Cloudflare と VoidZero が Max Schwenk 氏と組み、tsrs を **Oxc**（Rust 製の JavaScript ツールチェーン）の一部として育てていくと発表しました。リポジトリは `oxc-project/tsrs` に移っています。
- README では、tsrs を「TypeScript 7 のコンパイラと言語サーバーの**ドロップイン置き換え**」と説明しています。目標は TypeScript 7.1 に対して適合率100%の安定版を出すことです。
- 同じ数の型チェックワーカーで比べると、TS 7.0 比で最大8倍速く、メモリは約70%少ないとしています。TypeScript チームと条件をそろえて計測したとも書かれています。
- TypeScript 7.1 beta 自体も 7.0 より最大2.5倍速くなっていて、その最適化の一部は tsrs から本家に取り込まれたものだそうです。

![ベンチマーク表](/images/2026-10-21-extra-tsrs/tsrs-bench.png "TypeScript の既定設定での比較。MUI docs では tsrs が 1.29 秒（7.0.2 は 10.44 秒）（画像: [Cloudflare Blog](https://blog.cloudflare.com/typescript-rust-port/)）")

Rust で作り直した理由として、Cloudflare は **WebAssembly との相性**を挙げています。Go を Wasm にするとガベージコレクタも一緒に入ってしまいますが、Rust ならホストとのメモリのやり取りが単純で、メモリ効率がよいという説明です。`@tsrs/wasm` パッケージも用意されていて、ブラウザのプレイグラウンドや Cloudflare Workers の上でも動きます。

## 使い方

公式ブログでは、npm から実験的リリースを試す方法として次のコマンドが紹介されています。

```sh
npm install tsrs
npx tsrs
```

README とドキュメントには、pnpm を使って型チェックだけを実行する例が載っています。既存の `tsconfig.json` がそのまま使われます。

```sh
pnpm add -D tsrs
pnpm exec tsrs --noEmit
```

`tsc` と同じように、`tsrs --watch -p .` で監視モードも使えます。エディタからは `tsrs --lsp -stdio` で言語サーバーとして起動できます。インストールせずに試したいなら、[ブラウザのプレイグラウンド](https://tsrs-playground.void.app)があります。

## ライセンスと料金

ライセンスは **Apache-2.0** で無料です。README には、tsrs は TypeScript（著作権は Microsoft）から派生したもので、「Microsoft とは提携しておらず、承認も受けていない」と書かれています。npm の現在の最新版は `0.18.0-ts7.1.0-dev.20260929` で、バージョン名から、追従している TypeScript のコミットがわかるようになっています。

## 注意点・制限

- まだ**実験的なリリース**です。`--init` と `--showConfig` は使えません。
- 診断メッセージが出る順番など、本家と違うところが残っています。Cloudflare は、安定版までに違いを最小限にするとしています。
- Issue での不具合報告は受け付けていますが、レビューする余裕がないため、プルリクエストは今のところ受け付けていません。

## 似たものとの違い

Microsoft 公式の Go 版（tsgo）が本家で、tsrs はその**後を追う移植**という位置づけです。同じ時期には Theo Browne 氏による Rust 移植 **tsc-rs** も話題になりました。Cloudflare は、Theo 氏と協力して tsc-rs と tsrs を一つのパッケージにまとめ、LSP を含む TypeScript の全機能に対応させるとしています。

## なぜ重要か

（編集部の視点）大きなモノレポで CI の型チェックに何十秒もかかっているなら、そこが直接短くなる可能性があります。WebProNews によると、Owner.com のモノレポでは型チェックが CI で7秒、MacBook で約12秒になったそうです。ただし本命は、TypeScript の環境を丸ごとブラウザやエッジで動かせるようになることでしょう。Cloudflare は Oxlint での型情報を使ったルールへの統合も検討しています。Vite や Oxc を使っているフロントエンドのチームは、今後の動きを追っておく価値があります。今の段階では、本番の CI を置き換えるより、`--noEmit` で tsgo と結果を比べてみるくらいが現実的です。

## 反応・論点

- VoidZero の X での発表ポストは、21日朝の時点で表示が約37万回、いいねが約3,900件、ブックマークが約1,250件に達しています。
- The New Stack は「We are not forking TypeScript」という言葉を見出しに使い、エージェントが書き、エージェントのために作られた移植として取り上げました。
- X では、自分のモノレポで tsrs、tsc-ts、tsgo を比べ、どれも同じ診断を出した中で tsrs が一番速く、メモリも少なかったという報告がありました。

## 参考リンク

- [Cloudflare Blog: Introducing tsrs: a Port of TypeScript to Rust](https://blog.cloudflare.com/typescript-rust-port/)
- [GitHub: oxc-project/tsrs](https://github.com/oxc-project/tsrs)
- [tsrs ドキュメント: Using tsrs](https://github.com/oxc-project/tsrs/blob/main/docs/USAGE.md)
- [WebProNews: Cloudflare and VoidZero Take On tsrs, a Rust Port of the TypeScript Compiler](https://www.webpronews.com/cloudflare-voidzero-tsrs-rust-port-typescript-compiler/)
- [The New Stack: "We are not forking TypeScript": Cloudflare spearheads Rust port written by agents, for agents](https://thenewstack.io/cloudflare-rust-typescript-tsrs/)
- [X: VoidZero の発表ポスト](https://x.com/voidzerodev/status/2112531443591020965)

## 関連動画

統合が予定されている tsc-rs について、作者の Theo 氏が解説している動画です（tsrs そのものの動画ではありません）。

[![YouTube: You can rewrite typescript in rust for $420k（Theo - t3.gg）](/images/2026-10-21-extra-tsrs/yt-ND_kRgU_WlY.jpg "You can rewrite typescript in rust for $420k — Theo - t3.gg（YouTube, 2026年10月10日）")](https://www.youtube.com/watch?v=ND_kRgU_WlY)
