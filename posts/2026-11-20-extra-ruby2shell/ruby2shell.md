---
title: Ruby2Shell――「ß」を21個送るだけで Ruby のヒープが1バイトあふれる。初期設定の Rails と Sinatra がログイン前から対象
date: 2026-11-19
order: 1
teaser: Ruby の文字列の大文字変換に、2.4.0 から残っていた1バイトのヒープオーバーフロー。Rack::MethodOverride 経由で、認証もルーティングも通る前に届きます。修正は Ruby 4.0.10／3.4.13／3.3.14。GitLab など Ruby を同梱する製品は各社の修正待ちです。
cover: /images/2026-11-20-extra-ruby2shell/ruby2shell-hero.png
cover_caption: Veria Labs による Ruby2Shell の公表ページの画像（画像: [Veria Labs「Ruby2Shell (CVE-2026-132825)」](https://verialabs.com/ruby2shell/)）
---

Ruby の文字列処理に、認証なしで遠隔からコードを実行されうる脆弱性が見つかりました。通称 **Ruby2Shell（ruby2ßhell）**、**CVE-2026-132825**。Ruby は日本時間11月19日9時にアドバイザリを出し、同時に見つかった計7件の脆弱性とあわせて **Ruby 4.0.10／3.4.13／3.3.14** で修正しました。発見者の Veria Labs は、**初期設定の Rails と classic スタイルの Sinatra で、ログイン前のリクエストから届く**としています。Ruby の開発チームは、一部の脆弱性で RCE に至る PoC があることを把握していると書いています。

## 背景

10月の PHP2Shell、今週の Java4Shell と nginx2root に続き、主要な言語やサーバーで認証不要の RCE が相次いでいます。Sonatype はこの流れを「November2Shell」と呼んでいます。

今回の7件のうち、Ruby2Shell を含む4件のクレジットは「Stephan Lipp（Ada Logics）and Anthropic」です（Ruby のアドバイザリ）。どれも Ruby 本体（CRuby）の問題なので、**gem や Rails を `bundle update` しても直りません**（Orca Security、Oneleet）。

## 何が起きたか

- **原因**: ISO-8859 系や Windows-125x 系など、多くの1バイト文字コードには大文字の「ß」がありません。そのため `ß` を大文字にすると「SS」の2バイトになりますが、変換のループは1バイト分しか境界を確認していません。出力用のバッファは入力の長さ＋20バイトなので、**ß を21個以上**含む文字列で1バイトあふれます（Veria Labs）
- **呼ばれる場所**: `upcase`、`swapcase`、`downcase(:fold)`、`casecmp?`。UTF-8 の文字列は別の処理を通るので対象外です
- **Rails に届く道筋**: Veria Labs は手順を公開していませんが、Oneleet によると、HN の投稿者や CrowdSec のレビュアーらが同じ道筋を説明しています。`multipart/form-data` の POST で `_method` という名前の部分に `charset=ISO-8859-1` などを付け、生の `0xDF` バイトを21個以上入れる。Rack がその文字コードのまま文字列にし、`Rack::MethodOverride` が `_method` に `.upcase` をかける、という流れです。文字コードは送る側が決めるので、アプリ側の既定の文字コードは関係ありません
- **対象の Ruby**: 4.0.0〜4.0.9、3.4.0〜3.4.12、3.3.13 以前。3.2 以前はサポート終了で修正は出ません
- **残りの6件**: 正規表現エンジンの double free やヒープオーバーフロー、`Regexp#to_s` のオーバーフローなど。ユーザー入力から正規表現を組み立てるアプリでは、これらも RCE につながりうるとされています（Ruby のアドバイザリ）
- **PoC と悪用**: Veria Labs は、素の Rails での RCE を示す PoC を**11月25日に公開**する予定で、大手ベンダーの修正が出ていなければ遅らせるとしています。19日時点で攻撃の報告はなく、CISA の KEV にも載っていません（Oneleet）

### 優先して直すもの

Oneleet によると、最優先はインターネットに公開している**フルスタックの Rails**（`rails new --api` で作っていないもの）と classic スタイルの Sinatra です。どちらも `Rack::MethodOverride` を初期設定で読み込みます。API 専用の Rails、modular の Sinatra、素の Rack、Hanami、Roda は初期設定では届きませんが、Excel から書き出した CSV の取り込みなど、古い文字コードの入力を大文字にするコードがあれば対象になります。

直し方は、Ruby を修正版に上げ、`.ruby-version`、Gemfile の `ruby` 行、Dockerfile、CI のイメージを更新し、Web のワーカーや Sidekiq などの **Ruby のプロセスをすべて再起動**することです（Aikido、Oneleet）。Ruby の側で示された回避策はありません。

## なぜ重要か

フロントエンドのチームにとっても、Rails は身近です。ビューを React に移した後も、バックエンドや管理画面がフルスタックの Rails のまま、という構成はよくあります。今回の脆弱性は、ルーティングや認証より前の Rack の層で起きます。アプリのコードがどれだけ安全でも関係ありません。（編集部の視点）

もう一つは、**開発チームが毎日使う道具**です。セルフホストの GitLab や GitHub Enterprise Server は Ruby を同梱しています。ここが破られると、ソースコードや CI の秘密情報が危なくなります。（編集部の視点）

## 反応・論点

- **同梱製品の修正状況**: Veria Labs の表（日本時間20日7時59分更新）では、**GitLab 19.6.0 以前、GitHub Enterprise Server 3.22.5 以前、Chatwoot 4.20.0 以前**は修正版がありません。Mastodon（4.7.6 など）、OpenProject（17.9.8 など）、Discourse（ベースイメージ 2.0.20261119-0203）は修正済みです。Aikido と Oneleet は、修正が出るまで VPN や IP の許可リストの内側に置くよう勧めています。Hacker News には「GitLab 19.6.0 が出たがまだ Ruby2Shell と NGINX2Root に脆弱」という投稿も立ちました
- **スキャナーで見つからないことがある**: Oneleet は、ソースからビルドした Ruby は多くのスキャナーが検出できず、公式の Docker イメージもそれに当たると注意しています
- **WAF のルール**: CrowdSec が `_method` に20個を超える生の `0xDF` を含むリクエストを検出する仮想パッチのルールをレビュー中です。普通の Latin-1 のテキストにも ß は多く含まれるので、まず検出モードで試すよう Oneleet は勧めています。Rack にはマルチパートの文字コード指定を無視するオプションを足す PR（rack/rack#2555）が承認済みですが、まだリリースされていません
- **CVSS の見え方**: CVE のベクターは「ローカル」の攻撃になっていますが、知られている道筋はネットワーク越しの認証なしのリクエストです。Oneleet は、CVSS で優先度を決めている場合は公開サーバーの順位を上げるよう指摘しています
- **偽情報**: 「Ruby2Shell は CVE-2026-113840 で、Marshal の脆弱性」とする投稿がありますが、Oneleet によると Ruby とは関係がなく、Ruby に 3.5 系は存在しません
- **X での広がり**: Hacker News では Veria Labs の公表ページが日本時間19日14時台に投稿され、370ポイントを超えました。X で Ruby2Shell や Rails の RCE に触れた投稿は、19日9時から20日8時台までで約460件です

## 参考リンク

- Ruby: [Security advisories: multiple vulnerabilities in Regexp and String case conversion](https://www.ruby-lang.org/en/news/2026/11/18/multiple-vulnerabilities-in-regexp-and-string/)
- Veria Labs: [Ruby2Shell (CVE-2026-132825)](https://verialabs.com/ruby2shell/)
- Aikido: [Ruby2Shell: critical Ruby RCE, affected versions and how to fix it (CVE-2026-132825)](https://www.aikido.dev/blog/ruby2shell)
- Oneleet: [Ruby2Shell (CVE-2026-132825): affected versions, how to check, and how to fix it](https://www.oneleet.com/blog/ruby2shell-cve-2026-132825)
- Orca Security: [ruby2ßhell One-Byte Heap Overflow in Ruby Could Allow Remote Code Execution in Rails and Popular Self-Hosted Apps](https://orca.security/resources/blog/ruby2shell-ruby-heap-overflow-rce/)
- Sonatype: ['November2Shell' Continues with 7 Patches Ruby Vulnerabilities](https://www.sonatype.com/blog/november2shell-continues-with-7-patches-ruby-vulnerabilities)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
