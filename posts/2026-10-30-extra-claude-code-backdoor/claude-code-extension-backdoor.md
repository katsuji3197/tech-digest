---
title: Cursor のマーケットプレイスに偽の Claude Code 拡張 2.1.313――SSH バックドアを仕込み、最大5,000人に影響
date: 2026-10-30
order: 1
teaser: 10月29日（日本時間では29日夜〜30日早朝）の約11時間、Cursor の拡張マーケットプレイスで Anthropic の Claude Code 拡張を装った悪意あるバージョンが配布されました。攻撃者の SSH 鍵を authorized_keys に追加し、リバーストンネルと常駐設定を仕込むものです。svc-telemetry という鍵がないか、今すぐ確認を。
cover: /images/2026-10-30-extra-claude-code-backdoor/claude-ext-hero.png
cover_caption: Visual Studio Marketplace の Claude Code for VS Code のページ。正規の配布元は今回の問題の対象外とされています（画像: [The Hacker News](https://thehackernews.com/2026/10/official-claude-code-vs-code-extension.html)）
---

Cursor は米国時間10月29日、自社の VS Code 拡張マーケットプレイスで **Anthropic.claude-code のバージョン 2.1.313** という悪意ある改ざん版が配布されていたと公表しました。配布されていたのは太平洋時間の午前2時27分〜午後1時35分ごろ、日本時間では **10月29日18時27分〜30日5時35分ごろ** です。Cursor は「このバージョンは Anthropic が開発したものではない」とし、影響を受けたのは **最大5,000人** で、個別に連絡するとしています。

## 背景

Claude Code の拡張は VS Code 系エディタで広く使われており、Visual Studio Marketplace のページには約2,900万インストールと表示されています。Cursor は自社の拡張マーケットプレイスを運営しており、Cursor ユーザーはそこから拡張を入れています。今回最初に警告を出したのはセキュリティ企業 OpenSourceMalware で、その後 Cursor が自社マーケットプレイスでの配布を確認しました。

## 何が起きたか

OpenSourceMalware と Cursor の説明によると、改ざん版の要点は、 `extension.js` の先頭に差し込まれた **66行のローダー**です。インストール用スクリプトは使わず、拡張が読み込まれた時点で動くため、Claude との会話を始めなくても実行されます。

- **情報収集**: ホスト名、ユーザー名、OS、ホームディレクトリ、環境変数の「名前」、作業ディレクトリ、Git のメールアドレス、グローバル IP を集めます。CellCog によると、KEY、TOKEN、SECRET などを含む環境変数名を最大40個まで拾います。
- **SSH バックドア**: `svc-telemetry` というラベル付きの攻撃者の公開鍵を `~/.ssh/authorized_keys` に追加し、ローカルの SSH サービスを有効にして `134.209.82.225` へのリバース SSH トンネルを張ろうとします。
- **常駐化**: macOS では `com.apple.sysmond` という名前の LaunchAgent、Windows では `SysMon` というタスク、Linux では再起動時に動く cron（CellCog による）を仕込み、約60秒ごとにトンネルを張り直します。
- **報告**: 収集した情報を `134.209.82.225:8099/beacon` に送ります。

Cursor によると、SSH サービスの有効化には管理者権限が必要なため、多くの macOS や Windows ではこの段階が失敗し、トンネル経由でログインはできなかったといいます。ただし鍵の追加、常駐化、情報送信は行われるので、対象者全員に後述の対処を求めています。攻撃者のサーバーはすでに停止させたとしています。Cursor は改ざん版を削除したうえでマーケットプレイス全体をいったん止め、ほかの拡張が改ざんされていないことを監査し、鍵を入れ替えて再構築しています。

![Cursor のマーケットプレイスの画面に COMPROMISED と重ねた画像](/images/2026-10-30-extra-claude-code-backdoor/claude-ext-2.jpg "OpenSourceMalware のレポートに掲載された画像（画像: [OpenSourceMalware](https://opensourcemalware.com/blog/trojanized-claude-code-extension-plants-persistent-ssh-backdoor)）")

修正版の **2.1.314** は日本時間30日午前に npm、Open VSX、VS Code Marketplace へ公開され、いずれの配布元でも 2.1.312 の次が 2.1.314 になっています（CellCog が30日に確認）。OpenSourceMalware は、npm の `@anthropic-ai/claude-code` と Microsoft の VS Code 版拡張は悪意のないものだとしています。一方、Open VSX 上の配布が影響したかどうかは報道によって書き方が分かれており、はっきりしていません。

## 自分が影響を受けたか確かめる

Cursor の告知にあるチェックは次のとおりです。

macOS:

```
grep -qs svc-telemetry ~/.ssh/authorized_keys && echo "svc-telemetry key found" || echo "No key found; machine not impacted"
```

Windows（PowerShell）:

```
$files = "$HOME\.ssh\authorized_keys", "C:\ProgramData\ssh\administrators_authorized_keys" | Where-Object { Test-Path $_ }
if ($files -and (Select-String svc-telemetry $files)) { "svc-telemetry key found" } else { "No key found; machine not impacted" }
```

見つかった場合、Cursor は **拡張を消すだけでは不十分な可能性がある** としています。告知で配っている macOS 用・Windows 用の除去スクリプト（`remediate-macos.sh`、`remediate-windows.ps1`）を使い、そのマシンから使えた認証情報をローテーションするよう求めています。Phorion は、コメントの文字列だけでなく鍵のフィンガープリント `SHA256:0Z6R+DF64Do2nwQic8a7kkfDLNNk4IiK+2U2Rci4htk` で照合するよう勧めています。CellCog は「既知の痕跡を消して信頼が戻ったとみなすより、ホストを作り直すほうが安全」としています。

## なぜ重要か

AI コーディングエージェントは、エディタ拡張として数秒で入り、自動で更新され、開発者本人の権限で動きます。SSH 鍵、クラウドの認証情報、リポジトリに手が届くものが、いちばん摩擦の少ない経路で配られているわけです。（編集部の視点）チームで Cursor を使っているなら、今回は「個人で確認してね」で済ませず、10月29日夜〜30日早朝（JST）に拡張を更新したメンバーを洗い出して、全員にチェックを回すのが確実です。今後は拡張の自動更新を止める、あるいは配布元とバージョンを固定するといった運用も検討に値します。

## 反応・論点

- OpenSourceMalware は、今回の分析は「この成果物が悪意あるもの」であることを示すだけで、Anthropic の公式配布基盤が侵害されたことまでは示さないと線を引いています。Open VSX 上の発行アカウントは Anthropic 社員のもので、そのアカウントが乗っ取られたのかどうかは分かっていません。The Hacker News は OpenSourceMalware の共同創業者 Jenn Gile の説明として、この66行のローダーの仕組みを紹介しています。
- CellCog によると、日本時間30日時点で Anthropic からの声明は見当たらないとのことです。

## 参考リンク

- Cursor: [Claude Code 拡張に関するセキュリティ告知](https://cursor.com/blog/claude-code-extension-security-notice)
- OpenSourceMalware: [Trojanized Claude Code Extension Plants an SSH Backdoor](https://opensourcemalware.com/blog/trojanized-claude-code-extension-plants-persistent-ssh-backdoor)
- The Hacker News: [Official Claude Code VS Code Extension Compromised to Install Persistent SSH Backdoor](https://thehackernews.com/2026/10/official-claude-code-vs-code-extension.html)
- CellCog: [Claude Code 拡張のバックドアに関する分析](https://cellcog.ai/blog/claude-code-extension-backdoor/)
- Phorion: [Official Claude Code Extension Compromise: Security Advisory]
- X: [トレンドのまとめ](https://x.com/i/trending/2116054158553842030)(https://phorion.io/blog/offical-claude-code-vsx-compromise/)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
