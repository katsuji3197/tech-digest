---
title: create-vite 9.3 が TypeScript 7 を既定に――しかし翌日 TS6 へ一時的に戻す
date: 2026-10-19
order: 5
teaser: Go 製のネイティブ版 TypeScript 7 を多くのテンプレートで採用したが、Storybook との兼ね合いで 9.3.1 では一時的に TS6 へ。エコシステム移行の「いま」がよく分かる出来事。
cover: /images/2026-10-21/create-vite-9-3.png
cover_caption: create-vite@9.3.0 のリリースページ（画像: [GitHub](https://github.com/vitejs/vite/releases/tag/create-vite%409.3.0)）
---

Vite のプロジェクト生成ツール **create-vite 9.3.0** が10月19日にリリースされ、対応できるテンプレートで **TypeScript 7** を使うようになりました。ところが翌20日の **9.3.1** では「当面は TypeScript v6 を使う」という修正が入り、この変更は一時的に取り消されています。ネイティブ版 TypeScript への移行が、エコシステムのどこまで進んでいるのかがよく分かる出来事です。

## 背景

TypeScript 7.0 は2026年7月8日に正式リリースされました。Go で書き直したネイティブ実装で、Microsoft はフルビルドが概ね8〜12倍速くなると説明しています。ただし 7.0 にはプログラムから使う API が含まれておらず、新しい API は 7.1 で提供される予定です。そのため typescript-eslint のようにコンパイラ API に依存するツールのために、TypeScript 6 の API と `tsc6` コマンドを提供する互換パッケージ `@typescript/typescript6` が用意されています。InfoQ は、Vue、Svelte、Astro、MDX、Angular のフレームワーク向けツールもまだ 7.0 を使えないと報じています。

## 何が起きたか

**9.3.0（10月19日）**: PR #23794「use typescript v7 where possible」がマージされました。PR の説明によると、テンプレートごとの対応は次のとおりです。

- **TS7 に移行**: lit-ts、preact-ts、qwik-ts、solid-ts、vanilla-ts、react-ts（ESLint を選んだ場合のみ TS6）
- **TS6 のまま**: vue-ts、svelte-ts

同じリリースでは、生成前に create-vite のバージョンを表示する機能と、TanStack Router / Start 向けの router-only オプションも追加されています。

![TypeScript 7.0 の公式アナウンス画像](/images/2026-10-21/ts7-announcement.png "TypeScript 7.0 の正式リリース告知（画像: [TypeScript Blog](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)）")

**9.3.1（10月20日）**: PR #23841「use typescript v6 for now」が入りました。説明は「Storybook のために #23794 を一時的に取り消す。数日後に再挑戦する」という短いものです。同じリリースには、TanStack プロジェクトで Vite を使うようにする修正（#23838）も含まれています。

## なぜ重要か

TS7 が既定になれば、新しく作ったプロジェクトの型チェックやエディタ体験は大きく速くなります。その一方で、ESLint（typescript-eslint）、Vue や Svelte の型チェッカー、Storybook など、**コンパイラ API に依存するツールが揃って追いつくまでは、TS6 と TS7 が並存する期間**が続きます。チームで新規プロジェクトを作るときは、生成された `package.json` の `typescript` のバージョンを確認しましょう。あわせて、lint や Storybook を TS6 側で動かす必要がないかも検討しておくと安心です（編集部の視点）。create-vite のメンテナーは「数日後に再挑戦する」としているので、近いうちに再び TS7 が既定になる可能性があります。

## 反応・論点

Dev Daily Briefs は 9.3.0 の時点で「ネイティブ TS7 が新規 Vite プロジェクトの既定になる」ことを大きなシグナルと捉え、旧来の JS 製コンパイラ API に依存するツールの確認を呼びかけていました。翌日の一時撤回によって、その確認がまさに必要だったことが示された形です。

## 参考リンク

- [GitHub Release: create-vite@9.3.0](https://github.com/vitejs/vite/releases/tag/create-vite%409.3.0)
- [GitHub Release: create-vite@9.3.1](https://github.com/vitejs/vite/releases/tag/create-vite%409.3.1)
- [vitejs/vite PR #23794: feat(create-vite): use typescript v7 where possible](https://github.com/vitejs/vite/pull/23794)
- [vitejs/vite PR #23841: fix(create-vite): use typescript v6 for now](https://github.com/vitejs/vite/pull/23841)
- [TypeScript Blog: Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [InfoQ: Microsoft Releases TypeScript 7.0 with a Native Go Compiler](https://www.infoq.com/news/2026/08/typescript-7-released/)
- [Dev Daily Briefs: Dev News — 20 Oct 2026](https://devbrief.dev/dev-news/dev-news-2026-10-20/)

**動画:** 確認できた関連動画はありません（動画なし）。
