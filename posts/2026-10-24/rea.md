---
title: GitHub で37万スター超、「REA」でAIエージェントがバイナリを読み解く――Ghidra や IDA を MCP でつなぐリバースエンジニアリング基盤
date: 2026-10-18
order: 3
teaser: 「アプリの機能がどう作られているかを、バイナリのレベルまで調べる」MCP サーバーが、今週も GitHub と X で話題になり続けました。セットアップは `npx rea-agents setup` の1行ですが、調べてよい対象かどうかは自分で確認する必要があります。
cover: /images/2026-10-24/rea-hero.png
cover_caption: REA 公式サイトのソーシャルカード（画像: [rea.tools](https://rea.tools/)）
---

**REA（Reverse Engineer Anything）** は、Claude Code や Codex などのコーディングエージェントに、リバースエンジニアリングのツールを MCP 経由で使わせるオープンソースプロジェクトです。GitHub のスター増加数を日次で集計する X の Good AI List で今週は連日1位となり、スター数は10月17日時点の約30万から、24日朝には**約37.3万**まで伸びました。npm パッケージ `rea-agents` は18日に v6.7.0 が出ています。

## 何ができるか

README によると、REA は「リバースエンジニアリングのための1つの MCP」です。ネイティブバイナリ、JavaScript や Electron のアプリ、.NET アセンブリ、Web サイトを調べるツールにエージェントをつなぎます。

- ネイティブバイナリでは、Hopper、Ghidra、IDA を使って疑似コード、アセンブリ、文字列、シンボル、呼び出し関係を返します。
- JavaScript や Electron のアプリは、ネイティブの解析エンジンがなくても静的に解析でき、モジュールや import、Electron の境界を返します。
- 結論には必ず、その**根拠と限界（Evidence）**が付きます。解析は手元のマシンで行われます。
- ほかにも Android の APK、Flutter、Unity の IL2CPP、ファームウェア、パケットキャプチャなど、対応する対象は多岐にわたります。

公式のショーケースには、Notion の Electron アプリでクリップボードの処理を追った例があります。ほかに、クラシックゲーム「DX-Ball」の関数を C に復元し、元の x86 の 3,205 ケースすべてと一致させた例もあります。

## なぜ話題か

InfoQ は17日の記事で、すでに20万スターを超えていたと紹介しています。Hacker News には「エージェントに Ghidra を入れさせるのと何が違うのか」という声もありましたが、以前より良い結果が出たという報告もありました。X では「欲しい機能を持つアプリを調べて、自分のプロジェクトに作る」という使い方が繰り返し紹介されていました。x API の件数集計では、関連ポストは17日に約1,050件、23日に約250件でした。

## 使い方

README の手順では、Node.js と npm を入れたうえで次を実行します。

```bash
npx rea-agents setup
```

使うエージェントを選び、提案された変更を確認して承認したら、エージェントを再起動します。既存の設定はバックアップされます。対応しているのは Claude Code、Codex、Cursor、Gemini CLI、Grok Build などです。

ターミナルから、展開済みの Electron アプリや ASAR を直接調べることもできます。

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

エージェントには、たとえば「Notes アプリの検索がどう動いているか調べて、根拠を見せて、似た機能を私のプロジェクトに作って」と頼みます。

## ライセンスと料金

REA 自体は **MIT ライセンス**で無料です。ただし、IDA Pro や Hopper などの商用ツールは、正規に入手し、使う権利を持っている必要があると明記されています。

## 注意点・制限

- README は、元のソースコードを復元するツールではないとしています。返ってくるのは疑似コードや構造の情報で、実装はエージェントが書きます。
- README の Disclaimer 節では、合法的な研究、教育、相互運用性、ソフトウェアの保存、そして**自分が所有しているか、調べる許可を得たソフトウェア**の解析に限ると書かれています。InfoQ は、Reddit で個人開発者から「ゲームやアプリを真似されやすくなる」という懸念が出ていることも伝えています。
- 公式の入手先は morluto/rea、rea.tools、npm の rea-agents だけです。README には「似た名前のリポジトリや README のコピーは、公式であることの証明にならない」という注意書きがあります。
- README では、Node.js 22.x（22.23.4以上）、24.x（24.22.1以上）、または 26.12.1 以上が必要とされています。Linux では procps 互換の `ps` も必要です。

## 似たものとの違い

Ghidra や IDA はそれ自体が解析ツールです。REA はそれらを**エージェントから使うための共通の窓口**で、根拠付きの結果を返す形がそろっています。

（編集部の視点）Electron 製のデスクトップアプリやバンドルされた JS を解析できるということは、フロントエンドのコードは「読まれる前提」で書く必要がある、ということでもあります。

## 参考リンク

- [GitHub: morluto/rea](https://github.com/morluto/rea)
- [REA 公式サイト](https://rea.tools/)
- [npm: rea-agents](https://www.npmjs.com/package/rea-agents)
- [InfoQ: Reverse Engineer Anything Project Brings AI Agents to Binary Analysis](https://www.infoq.com/news/2026/10/reverse-engineer-anything/)

## 関連動画

[![YouTube: Morluto/rea — Reverse engineer anything with agents（Signal Coders）](/images/2026-10-24/yt-U_8af4oJpMo.jpg "Morluto/rea — Reverse engineer anything with agents, from app behavior down to native binaries. — Signal Coders（YouTube, 2026年10月9日）")](https://www.youtube.com/watch?v=U_8af4oJpMo)
