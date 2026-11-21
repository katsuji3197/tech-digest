---
title: Claude Code の実験機能「Code Mode」が X で話題――Claude が JavaScript を書いてツール呼び出しをまとめて実行、往復と文脈を節約
date: 2026-11-12
order: 5
teaser: Claude Code 2.1.323 で、Claude がツールを1回ずつ呼ぶ代わりに JavaScript を書いて複数の呼び出しをまとめて実行する Code Mode が実験的に入りました。今週 X で使い方や効果の検証が盛んに共有されています。既定ではオフで、使える環境はまだ限られます。
cover: /images/2026-11-21/claude-code-mode-hero.png
cover_caption: Claude Code 公式ドキュメント「Run tool calls from code with Code Mode」の OG 画像（画像: [Claude Code Docs](https://code.claude.com/docs/en/code-mode)）
---

Anthropic のコーディングエージェント **Claude Code** に、実験的な **Code Mode** が加わりました。2.1.323（11月12日）で入った機能で、今週は X で有効化の手順や効果の検証が相次いで共有されました。Code Mode に触れた投稿は、11月14日からの1週間で約1,800件です（X の投稿数集計）。

## Code Mode とは

公式ドキュメントによると、通常の Claude Code では、Claude が Bash、Read、Edit などのツールを1回ずつ呼び、結果を読んでから次の手を決めます。Code Mode では、Claude がツールを呼ぶ **JavaScript** を書き、Claude Code がそれをセッション内で実行します。コードは `REPL` という名前のツールで動きます。

## 何ができるか

ドキュメントは、1つのコードで次のことができると説明しています。

- 独立したコマンドを**並列**に実行する
- ある結果を次の呼び出しに**渡す**
- 出力を絞り込み、Claude が読む必要のある部分だけを**返す**

公式の例は、リトライ回数の上限を上げる作業です。ファイルを探し、書き換え、テストを走らせ、結果をまとめて返します。

```javascript
const files = await $`rg -l "function retryPolicy" src`.text();
const target = files.trim().split("\n")[0];
await edit(target, "maxAttempts: 3", "maxAttempts: 5");
({ edited: target, tests: $`npm test -- retryPolicy`.nothrow() });
```

会話には差分などのツール呼び出しが表示され、コード自体は `Ctrl+O` のトランスクリプト表示で確認できます。

## なぜ話題か

（編集部の視点）フロントエンドのリポジトリでは、多数のコンポーネントにまたがる同じ修正や、検索結果を絞り込んでから読む作業が多く、1回ずつのツール呼び出しは往復とトークンを食います。ドキュメントが勧める用途も「多数のファイルにまたがる同じ変更」「絞り込みが必要な検索」「同時に走らせられる独立したコマンド」です。Cloudflare が2025年に名付けた「Code Mode」の考え方を、CLI 自身のツールに持ち込んだ形だと MarkTechPost は整理しています。

## 使い方

ドキュメントの手順です。まず `claude --version` で 2.1.323 以降かを確かめ、古ければ `claude update` を実行します。次に環境変数を付けて起動します。

```bash
CLAUDE_CODE_EXPERIMENTAL_CODE_MODE=1 claude
```

常にオンにするなら `~/.claude/settings.json` に書きます。

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_CODE_MODE": "1"
  }
}
```

![MarkTechPost による Code Mode 解説記事のバナー](/images/2026-11-21/claude-code-mode-2.jpg "MarkTechPost の解説記事のバナー。有効化のコマンドと「バックグラウンドで最大2時間」を示している（画像: [MarkTechPost](https://www.marktechpost.com/2026/11/17/anthropic-claude-code-code-mode-javascript-tool-calls/)）")

初回は確認が出るので「Yes, turn on Code Mode」を選びます。プロジェクトの設定ファイルに書いた値は無視されるため、クローンしたリポジトリが勝手に Code Mode をオンにすることはありません。組織で禁止するには、管理設定で値を `0` にします。

## 料金・ライセンス

利用には Claude のサブスクリプションか Console アカウントが必要です。ゲートウェイ、Amazon Bedrock、Google Cloud、Microsoft Foundry 経由では使えません。

## 注意点・制限

- 実験機能で既定はオフです。どのリリースで変更・削除されてもおかしくないと明記されています。
- 対応モデルは Claude Opus 5.5、Sonnet 5.5、Haiku 5.5、Fable 5.2。ネイティブ版のターミナルでの対話セッションだけで、VS Code のパネル、デスクトップアプリ、クラウドのセッションでは動きません。HIPAA 構成やゼロデータ保持の組織も対象外です。
- Claude が待つコードは10分で止まります。バックグラウンドなら最大2時間動かせます（MarkTechPost）。
- auto モードでは、分類器が個々のツール呼び出しではなく**コード全体**を審査し、実行時に決まる値（検索結果から得たパスなど）は見えません。止めたい操作はルールやフックで守るよう、ドキュメントは勧めています。`git push` が `cd 'app' && git push` の形でフックに届くこともあります。
- Code Mode のセッションは、Code Mode をオンにした状態でしか再開できません。

## 類似との違い・反応

X では「Code Mode でトークンが37%減る」という数字が広まりましたが、これは2025年11月に Anthropic が API の Programmatic Tool Calling について公表した数字（4万3588→2万7297トークン）だと指摘する投稿が出ました。MarkTechPost も、Code Mode のドキュメントには節約量の数字がないと書いています。同誌は、Code Mode ありでシステムツールの文脈が11.1k、なしで24.6k トークンだったという第三者の測定を紹介しつつ、「1件の測定として扱うべき」としています。19日の 2.1.329 では、OpenTelemetry を有効にしたままでも使えるようになるなど、改善が続いています。

## 参考リンク

- [Claude Code Docs: Run tool calls from code with Code Mode](https://code.claude.com/docs/en/code-mode)
- [Claude Code Docs: Changelog](https://code.claude.com/docs/en/changelog)
- [MarkTechPost: Anthropic Adds Code Mode to Claude Code: Claude Now Chains Tool Calls in JavaScript](https://www.marktechpost.com/2026/11/17/anthropic-claude-code-code-mode-javascript-tool-calls/)
- [ClaudeKit: Claude Code 2.1.323](https://claudekit.io/en/updates/claude-code-2-1-323/)
- [X: 「37%」の数字は Code Mode のものではないとする投稿](https://x.com/lukeSSK0/status/2121905091494179267)

**動画:** 確認できた関連動画はありません（動画なし）。
