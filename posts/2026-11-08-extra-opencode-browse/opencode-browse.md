---
title: ログイン済みのタブをエージェントに渡す――OpenCode「Browse」が MCP＋Chrome 拡張で登場
date: 2026-11-07
order: 1
teaser: 実ブラウザのタブ・ログイン・拡張をそのまま使い、ログインや 2FA・決済だけ人に戻す。OpenCode / Claude Code / Cursor など MCP 対応。MIT、npm 最新は 0.0.14。
cover: /images/2026-11-08-extra-opencode-browse/opencode-browse-hero.jpg
cover_caption: 公式のリンクカード。「Browse — Let your agents use your real browser, with your tabs and logins.」（画像: [opencode.ai/product/browse](https://opencode.ai/product/browse)）
---

OpenCode（Anomaly）が日本時間2026年11月7日11時35分ごろ、X で「OpenCode Browse is now available」と発表しました。エージェントが**普段使っている Chromium 系ブラウザ**を、既存のタブ・ログイン・拡張付きのまま操作できる MCP サーバー＋拡張です。発表投稿は約23.1万回表示、約4,725いいね、約1,805ブックマーク。「OpenCode Browse」関連投稿はその日だけで約476件に達しました。

## 背景

コーディングエージェントのブラウザ操作は、クリーンなプロファイルやクラウドセッションが主流です。ログインや社内 SSO、2FA まで含めると準備が重い。Browse は「いま開いているブラウザ」を渡すことで、その準備を短絡します。ソースは [anomalyco/browse](https://github.com/anomalyco/browse)（MIT）。npm の `@opencode/browse` は10月30日公開、11月7日に latest が 0.0.14 になりました。

## 何ができるか

- Chrome / Edge / Brave / Arc / Vivaldi / Opera / Chromium など（Firefox は非対応）
- OpenCode、Claude Code、Cursor、Codex、Zed など任意の MCP クライアント
- エージェント用タブは折りたたみグループ（または別ウィンドウ）に置き、作業中のタブを奪わない
- ログイン・2FA・決済は人に戻し、Continue で再開。ツールバーから既存タブの貸与も可
- スクリーンショット、画面録画、HAR。セッション単位のドメイン allowlist も任意

中継はローカルのリレー（既定 `127.0.0.1:19988`）。エージェント → MCP → リレー → 拡張（`chrome.debugger`）です。

![エージェント・リレー・ブラウザの構成図](/images/2026-11-08-extra-opencode-browse/opencode-browse-how.jpg "How it works。端末・リレー・実ブラウザがローカルでつながる（画像: [anomalyco/browse README](https://github.com/anomalyco/browse)）")

## なぜ今話題なのか

公式 @opencode（フォロワー約23万）の1投稿がブックマーク約1,800件規模で拡散し、「実ログインのままエージェントにブラウザを渡せる」という一文が開発者タイムラインに広がりました。MCP 利用者にとっては導入導線が短く、画面確認やフォーム検証に直結しやすいのが芯です（編集部の視点）。

## 使い方

公式は Chrome Web Store の拡張を先に入れる手順を推奨します。CLI を直接入れる場合（Node.js 22.19+）:

```bash
curl -fsSL https://opencode.ai/browse/install | bash
# または
npm install -g @opencode/browse && browse install
npx @opencode/browse install
```

`browse install` がエージェントを選ばせ、MCP 設定を書き、拡張とペアリングします。特定クライアントだけなら `browse install -a claude cursor`。入れたあとは、エージェントに「open news.ycombinator.com and tell me the top story」と頼む、と製品ページが案内しています。

## 料金・ライセンス

無料のオープンソース（**MIT**）。Browse 自体のクラウド課金はなく、使うモデル側の料金のみ。GitHub スターは約221（2026-11-08 朝時点）。

## 注意点・制限

- サインイン済みプロファイルを渡すため、エージェントの到達範囲はそのブラウザで見られるもの全体。決済や破壊的操作はハンドオフで人が行う設計です。
- allowlist は任意だが推奨。サブリソースまでは止めきれないと README が明記しています。
- 自動化の痕跡を抑える一方、「見つかりにくくする」のであって不可能にはしない、とも書いています。

## 似たものとの違い

別プロファイルの Playwright やクラウドブラウザと違い、**日常のログイン状態ごと**渡します。Vercel Labs の agent-browser 系は構造化操作が強い系統で、既存 SSO／拡張の共有という点で Browse の置き方が異なります（編集部の視点）。

## なぜ重要か

（編集部の視点）フロントエンドのテックリードにとって痛いのは、「エージェントはコードを書けるが、ログイン後の確認で止まる」ことです。Browse はそこを短絡します。同時に、許可ドメインとハンドオフを設計しないと誤操作や誘導の影響範囲が広がるので、導入は allowlist から決めるのがよさそうです。

## 反応・論点

- 公式発表はブックマーク約1,800件規模で、「試したい」層の厚さが数字に出ています。
- @thdxr は、エージェントとブラウザを別マシンで動かせる旨を投稿しており、リモート開発との組み合わせも意識されています。

## 参考リンク

- 製品ページ: [OpenCode | Browse](https://opencode.ai/product/browse)
- GitHub: [anomalyco/browse](https://github.com/anomalyco/browse)
- npm: [@opencode/browse](https://www.npmjs.com/package/@opencode/browse)
- Chrome Web Store: [browse](https://chromewebstore.google.com/detail/browse/mfnicocicmmlkpjnaffgihfjhdgjkdjg)
- X: [OpenCode の発表投稿](https://x.com/opencode/status/2118895128152621153)

**動画:** 確認できた関連動画はありません（動画なし）。発表は上記の X 投稿で見られます。
