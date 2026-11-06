---
title: Discord が「Electron を捨てる」と宣言――Rust＋GPUI で全面再構築、初期ビルドは約290MB
date: 2026-11-05
order: 1
teaser: CTO が「Electron はなくなり、React Native もなくなる」と明言。新クライアント「Discord Phoenix」は Tauri ではなく Zed と同じ GPUI を採用。確認できた事実と、まだ未発表の点を分けて整理します。
cover: /images/2026-11-06-extra-discord-rust/discord-phoenix-taskmgr.png
cover_caption: CTO が共有した Windows タスクマネージャーのスクリーンショット。Discord Phoenix は 290.2 MB（画像: [Stanislav Vishnevskiy（X）](https://x.com/svishnevskiy/status/2118081920194203799)）
---

Discord の共同創業者兼 CTO の Stanislav Vishnevskiy 氏は、2026年11月5日5時台（日本時間）の X 投稿で、Discord が Electron を捨て、クライアント全体を Rust で作り直していると明らかにしました。モバイルの React Native も同じく廃止されます。デスクトップの UI には Tauri ではなく GPUI を使います。ただし公開テストの日程は未定で、現時点で動くのは社内の初期ビルドだけです。

## 背景

Discord のデスクトップ版は長年 Electron 製で、メモリ消費の大きさが繰り返し指摘されてきました。昨年12月には、Windows 版で使用量が 4GB を超え、ユーザーが30分間操作しておらず通話中でもない場合に自動再起動する仕組みを試験していたと報じられています（TalkEsport）。また、同サイトによると今年9月には Electron 42 へ更新して CPU 使用率の中央値を約17%下げましたが、メモリの中央値は約4%増えたといいます。今回の再構築は、そうした対症療法ではなく根本から置き換える動きです。11月3日から4日にかけて CTO が新クライアントを匂わせる投稿を続け、DiscordPreviews が「Electron から Rust 製のネイティブクライアントへの書き換え」としてまとめたのが発端でした。

## 何が起きたか

CTO の投稿（2026年11月4日20:44 UTC＝日本時間5日5:44）の要旨は次のとおりです。

- Discord は2018年から Rust を早期に採用しており、インフラ、音声技術、現行クライアントの一部がすでに Rust。「クライアント全体を Rust にすることが聖杯だった」
- したがって **Electron はなくなり、React Native もなくなる**。モバイルは UI をネイティブのまま、アプリのコードを Rust 経由でデスクトップと共有する
- **Tauri ではなく GPUI**。ユーザーによるテストは「soon™」に始めたい
- 添付のタスクマネージャーでは、「Discord Phoenix」が **290.2 MB**。同じ画面の Chrome は 1,568.6 MB（19プロセス）、Notion は 932.5 MB（9プロセス）、Spotify は 652.7 MB（8プロセス）、Steam Client WebHelper は 856.0 MB（7プロセス）

GPUI は Zed の開発元が作った、GPU アクセラレーション対応の Rust 製 UI フレームワークで、公式サイトでは `div().flex().gap_2()` のように CSS に近いメソッドチェーンでレイアウトを書くサンプルが示されています。

TalkEsport は、CTO が返信で「見た目と動作は現行版と同じ」「デスクトップとモバイルで複数アカウントに完全対応する」と述べたと伝えています。また、同サイトによればブラウザ版は、HTML と GPUI のどちらにも描画できる独自の UI ラッパーを書く方針で、アクセシビリティを正しく扱いたいとも述べたそうです。Wccftech は、YouTube 埋め込みや Activities など一部の機能は引き続きシステムの WebView を使うと報じていますが、これは公式の確認を取れていない伝聞です。

## なぜ重要か

（編集部の視点）フロントエンドの目線では、「Web 技術でクロスプラットフォームのアプリを作る」という Electron 前提の定石に、最大級の採用例が背を向けたことが大きいです。Web 版の React コードをそのまま持ち込めないため、UI はレンダラーごと書き直しになります。UI の実装コストは下がらず、ブラウザ版との二重管理が増える可能性もあります。一方で、メモリの大きさとプロセス数が体感品質に直結することも、この数字ははっきり示しています。

ただし 290MB は、2アカウントでサーバーを開いただけの初期ビルドの1点の数字です。音声通話や画面共有を使ったときの挙動は示されておらず、Wccftech も比較ベンチマークではなく「早期のスナップショット」だと注意しています。macOS と Linux 版の予定、ベータの時期、既存のプラグインやクライアント MOD の扱いも、確認できた範囲では未発表です。自社のデスクトップアプリを Electron や Tauri で作っているチームは、判断を急ぐ必要はなく、続報を待ちながら自分のアプリのメモリ使用量を測っておく程度で十分でしょう。

## 反応・論点

X では、CTO 投稿が約144万インプレッション・約1.1万いいね、Wumpus Central の解説投稿が約267万インプレッション・約2.4万いいね（いずれも日本時間11月6日18時ごろの表示）と大きく拡散しました。名前については、Discord が Elixir の著名な採用企業であるため、「Phoenix」は紛らわしいと指摘する投稿も出ています。リリース時期を尋ねる返信が多く、Grok による回答では、公開版やベータはまだ存在しないとされています。

## 参考リンク

- [Stanislav Vishnevskiy（X）: Electron と React Native を廃止し GPUI で Rust 化](https://x.com/svishnevskiy/status/2118081920194203799)
- [DiscordPreviews（X）: Electron から Rust 製ネイティブクライアントへの書き換え](https://x.com/DiscordPreviews/status/2117900707168739472)
- [Windows Latest: Discord is killing its Electron app that can eat 4GB of RAM on Windows 11, and the Rust rebuild uses just 290MB](https://www.windowslatest.com/2026/11/05/discord-is-killing-its-electron-app-that-can-eat-4gb-of-ram-on-windows-11-and-the-rust-rebuild-uses-just-290mb/)
- [TalkEsport: Discord Ditches Electron for Rust: New App Uses 290 MB RAM](https://www.talkesport.com/tech/discord-rust-client-phoenix-electron-ram/)
- [TechSpot: Discord is rebuilding its desktop app in Rust to fix its memory problem](https://www.techspot.com/news/114462-discord-rebuilding-desktop-app-rust-fix-memory-problem.html)
- [Wccftech: Discord Is Ditching Electron For Rust, With Early Windows Build Using Just 290MB Of RAM](https://wccftech.com/discord-is-ditching-electron-for-rust-with-early-windows-build-using-just-290mb-of-ram/)
- [GPUI 公式サイト](https://www.gpui.rs/)

**動画:** 確認できた関連動画はありません（動画なし）。
