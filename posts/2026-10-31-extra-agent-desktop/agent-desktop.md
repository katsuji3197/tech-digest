---
title: スクショを使わない computer use――Vercel Labs「agent-desktop」で AI エージェントがデスクトップアプリを操作する
date: 2026-10-31
order: 1
teaser: OS のアクセシビリティツリーを JSON で返し、エージェントは ref を指定してクリックや入力をする。macOS・Windows・Linux 対応、Apache-2.0、npm で入る。10月31日朝の紹介投稿をきっかけに X で急拡散。
cover: /images/2026-10-31-extra-agent-desktop/agent-desktop-hero.jpg
cover_caption: 紹介動画の一場面。「It reads the accessibility tree」と、`agent-desktop snapshot --app Maps -i` で地図アプリの構造を読む様子（画像: [@mdlahfir の X 投稿](https://x.com/mdlahfir/status/2116316228046500348)）
---

Vercel Labs のエンジニア Lahfir 氏（@mdlahfir）が10月31日8時48分（日本時間）、X で「Introducing agent-desktop ― Computer use for your agents」と投稿しました。AI エージェントに macOS・Windows・Linux のデスクトップアプリを操作させるための CLI で、画面のスクリーンショットから押す場所を推測するのではなく、**OS のアクセシビリティツリー**（スクリーンリーダーが使うのと同じ UI の構造情報）を読んで操作します。紹介投稿は同日18時過ぎの時点で約3.5万回表示、601件のいいね、471件のブックマークを集め、「agent-desktop」を含む X の投稿数は前日（UTC）の13件から、この日は日本時間18時までに454件へ跳ね上がりました。

## agent-desktop とは

README の説明は「Computer use for AI agents: read and operate desktop apps through the OS accessibility tree」。Rust 製の CLI と C ライブラリで、`snapshot` を実行すると、エージェントが操作できる要素ごとに **ref**（`@s8f3k2p9:e8` のような ID）が付いた JSON が返ります。エージェントはその ref を指定してクリックや入力を行い、もう一度 snapshot を取って結果を確かめる。このループはエージェント側に置いたままで、ピクセルの照合はしません。

開発元は Vercel Labs で、ブラウザを操作する [agent-browser](https://agent-browser.dev) と対になる位置づけです。Lahfir 氏は「agent-browser が Web を、agent-desktop がネイティブアプリを動かす」という趣旨で説明しています。

## 何ができるか

紹介投稿が挙げた特徴は次の5つです。

- エージェントによるデスクトップアプリの E2E テスト
- アクセシビリティツリー経由でアプリを読む
- ウィンドウの一部だけに絞って読み、トークンを節約する
- 1つのアプリを複数のエージェントで同時に操作する
- macOS・Windows・Linux で動く

コマンドは60個あり、要素の観察（`snapshot`、`find`、`screenshot` など）、ref への操作（`click`、`type`、`set-value`、`toggle`、`scroll` など）、アプリやウィンドウの管理、通知、クリップボード、待機、セッションまでそろっています。操作は既定で**ヘッドレス**で、マウスポインタを動かしたりフォーカスを奪ったりせず、アクセシビリティ API を通して行います。人が作業している横でエージェントが別のアプリを触れる、ということです。

![紹介動画の一場面。`snapshot --root` でウィンドウの一部だけを読み、75個の ref が45個に減る様子](/images/2026-10-31-extra-agent-desktop/agent-desktop-drill.jpg "「Drill into one part, save tokens」。ウィンドウ全体だと75 ref、場所カードだけなら45 ref（画像: [@mdlahfir の X 投稿](https://x.com/mdlahfir/status/2116316228046500348)）")

## なぜ今話題なのか

リポジトリ自体は2月からありましたが、10月28日に v1.0.0 が出て、10月31日朝（v1.0.2 の公開直後）に作者が正式な紹介動画を投稿したことで一気に広がりました。GitHub のスターは2,898、フォークは190（10月31日18時時点）。Vercel Sandbox 上の Linux デスクトップで動かすデモや、3つのエージェントが同じ地図アプリを同時に操作する動画も続けて公開されています。

![紹介動画の一場面。`--agent-id` を付けた3つのエージェントが同じアプリを同時に操作している](/images/2026-10-31-extra-agent-desktop/agent-desktop-multi.jpg "「Multiple agents, one task」。a1〜a3 の3エージェントがそれぞれ別の要素を操作する（画像: [@mdlahfir の X 投稿](https://x.com/mdlahfir/status/2116316228046500348)）")

## 使い方

npm で入ります（Bun・Yarn・pnpm も可。x64 と ARM64 のネイティブバイナリ同梱）。

```bash
npm install -g agent-desktop
agent-desktop version
```

macOS ではアクセシビリティの許可が必要で、`agent-desktop permissions --guide` が案内してくれます。Windows は追加の許可は不要、Linux はグラフィカルセッションと `at-spi2-core` が必要です。

最小の流れは「観察 → ref を操作 → もう一度観察」です（README の Finder の例）。

```bash
agent-desktop snapshot --app Finder -i      # interactive elements, each with a ref
agent-desktop click @s8f3k2p9:e8            # act on a ref from that snapshot
agent-desktop snapshot --app Finder -i      # observe again to verify
```

Slack のように要素の多いアプリは、まず骨組みだけを取り、必要な領域に潜ります。

```bash
agent-desktop snapshot --skeleton --app Slack -i --compact
agent-desktop snapshot --root @s8f3k2p9:e3 -i --compact
```

Claude Code や Codex、Cursor などのエージェントに覚えさせるには、skill を入れるか、`AGENTS.md` に使い方を書きます。

```bash
npx skills add https://github.com/vercel-labs/agent-desktop --skill agent-desktop
```

バイナリ自体にバージョンに合ったドキュメントが入っていて、`agent-desktop skills get desktop` と `agent-desktop skills get platform` で読めます。

## 料金・ライセンス

無料のオープンソースで、ライセンスは **Apache-2.0**（個人・商用とも利用可）。ネイティブ CLI 自体はリモートのモデルサービスを必要としません。

## 注意点・制限

- **ref は snapshot ごとに有効。** UI が変わると `STALE_REF` などが返るので、取り直して使う。ウィンドウが複数あると `AMBIGUOUS_TARGET` になり、`--window-id` で指定する。
- **アクセシビリティ情報が乏しい UI は苦手。** 作者は X で「Web の iframe の問題に似ている。自動ではフォールバックしないが、`--headed` で動かせる」と答えています。既定はアクセシビリティツリーで、スクリーンショットは必要なときだけ使う設計です。
- **プライバシー。** snapshot、クリップボード、スクリーンショットにはデスクトップ上の個人情報が入りうるので、公開ログに出さないよう README が注意しています。任意の「JEV helper」は画面の説明を設定したモデル提供元に送ります。
- **OS ごとの差。** Linux のマウス入力は X11 で `--headed` のとき、`open-system-surface` は macOS では未対応（予定）など、機能に差があります。PowerShell では ref をクォートする必要があります。
- Homebrew と Scoop の公式パッケージは申請中で、まだ使えません。

## 似たものとの違い

スクリーンショットを見てクリック位置を決める従来型の computer use と違い、構造化された JSON と安定した ref で操作するため、押し間違いが起きにくく、読む量も絞れます。同じ Vercel Labs の agent-browser はブラウザ（Chromium 系アプリを含む）担当で、agent-desktop はネイティブアプリ担当という分担です。

## なぜ重要か

（編集部の視点）フロントエンドのチームにとっては、Electron や Tauri 製のデスクトップアプリの E2E テストをエージェントに任せる道が開けます。そして、エージェントが「アクセシビリティツリーを読んで操作する」以上、ボタンに名前のない UI や role の付いていない独自コンポーネントは、人だけでなく AI からも見えなくなります。アクセシビリティ対応がそのまま「エージェントに使えるアプリかどうか」に直結する流れは、Web 側でも agent-browser で既に始まっており、デスクトップにも広がったと言えます。

## 反応・論点

- リモートのマシンで使えるかという質問に、作者は Vercel Sandbox 上で動かすデモ動画で答えました。
- 複数エージェントの衝突については、「ロックは要素単位で、他のエージェントは同じアプリの別の要素を操作できる」と説明しています。
- 作者によると、ツール自体の応答は200ミリ秒未満で、体感の遅さは使うモデル側によるという趣旨です。

## 参考リンク

- GitHub: [vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop)
- 公式サイト: [agent-desktop | Desktop Automation for AI](https://agent-browser.dev/desktop)
- GitHub: [agent-desktop FAQ](https://github.com/vercel-labs/agent-desktop/blob/main/docs/faq.md)
- npm: [agent-desktop](https://www.npmjs.com/package/agent-desktop)
- X: [Lahfir 氏の紹介投稿「Introducing agent-desktop」](https://x.com/mdlahfir/status/2116316228046500348)
- X: [Vercel Sandbox で動かすデモ](https://x.com/mdlahfir/status/2116388672446812538)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。紹介動画は上の X 投稿で見られます。
