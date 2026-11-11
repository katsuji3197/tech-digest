---
title: AWS 公式「AWS Emulator」――CLI・SDK・コーディングエージェントを手元の偽 AWS に向ける
date: 2026-11-11
order: 1
teaser: 200超のサービスの API を 127.0.0.1:9297 で再現。アカウント不要・追加料金なし・CC0。Rust 製で、コードは全行が自律 AI エージェントによるもの。IAM 評価なし、テレメトリは既定オンなどの注意点も。
cover: /images/2026-11-12-extra-aws-emulator/aws-emulator-hero.png
cover_caption: AWS News Blog の告知画像「Test your applications against AWS locally with AWS Emulator」（画像: [AWS News Blog](https://aws.amazon.com/blogs/aws/test-your-applications-against-aws-locally-with-aws-emulator/)）
---

AWS が米国時間2026年11月11日（日本時間11日夜〜12日未明）、AWS の API を手元で再現するローカルエミュレーター **「AWS Emulator」** を一般提供（GA）にしました。AWS アカウントは不要、追加のサービス料金もなし。ソースは GitHub の [aws/aws-emulator](https://github.com/aws/aws-emulator) で、ライセンスは CC0 1.0（`vendor/` 以下のみ Apache 2.0）。しかも AWS によれば、**コードは1行残らず自律 AI エージェントが書いた**ものです。

## 背景

AWS 依存のコードをローカルでテストするには、これまで LocalStack などのサードパーティ製エミュレーターが定番でした。GeekWire によると、LocalStack は今年、無料版にアカウント登録を必須にし、非商用利用に限定しています。その状況で、AWS 本家がパブリックドメイン相当の CC0 で、全コミット履歴付きの公式エミュレーターを出した形です。

## それは何か・何ができるか

- AWS CLI、各言語の AWS SDK、コーディングエージェントが、**クラウドと同じ AWS API をローカルの HTTPS エンドポイント**（既定 `127.0.0.1:9297`）に向けて呼べる
- AWS の公開 API モデル（SDK と同じ Smithy モデル）から作られているので、リクエストもエラーも AWS と同じ形で返る。GeekWire によると400超の API モデル、200超のサービスをカバー
- 実装は Rust。ノート PC でも CPU とメモリを食いにくい設計
- 未実装の操作は HTTP 501 を返すので、テストはすぐに失敗して気づける
- Rust 向けには、テストプロセス内で動かす**組み込みモード**もある。テストごとに状態が分かれるので並列実行しやすい

## なぜ今話題なのか

「AWS 公式の LocalStack 代替」と「AI エージェントだけで作った」という2つの話題が重なったからです。Amazon の Matthew Goldberg 氏（Sr. Principal Engineer）によると、チームはコードを書くこともレビューすることもしていません。エージェントは3チームに分かれ、実際の AWS と照らし合わせる「フィデリティテスト」を書くチーム、差分を見つけて issue を立てるチーム、それを直すチームが動いています。GeekWire によると、現在は数百のエージェントが1日に数千件の issue を直しています。

X では、日本時間12日2時台から関連の投稿が増え始め、8時台までの約6時間で300件を超えました。1時間ごとの件数もずっと増え続けています（X の投稿数カウントより）。Hacker News でもトップ級の記事として流れています。

## 使い方（公式ドキュメントのとおり）

Linux は RPM か Debian パッケージを入れます。macOS と Windows では、ドキュメントにある短い Dockerfile からイメージを自分でビルドして動かします（できあいのイメージは配布していません）。AWS ブログの例（Amazon Linux 2023）は次のとおりです。

```bash
PKG=https://downloads.aws.com/aws-emulator/packages/aws-emulator/LTS/latest
sudo dnf install -y $PKG/aws-emulator-x86_64.rpm
aws-emulator
```

別のターミナルで SDK や CLI をエミュレーターに向けます。本物の認証情報が残っていると、それで署名されて弾かれるので、最後に unset します。

```bash
export AWS_ENDPOINT_URL=https://127.0.0.1:9297
export AWS_SHARED_CREDENTIALS_FILE=~/.aws/emulator/9297/emulator_credentials
export AWS_CONFIG_FILE=~/.aws/emulator/9297/config
export AWS_CA_BUNDLE=~/.aws/emulator/9297/ca.pem
export AWS_EC2_METADATA_DISABLED=true
export AWS_DISABLE_HOST_PREFIX_INJECTION=true
export AWS_REGION=us-east-1
export AWS_DEFAULT_REGION=us-east-1
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_PROFILE
```

動作確認は `aws sts get-caller-identity` で行います。`Account` が `000000000000` ならエミュレーターに届いています。そのあとは `aws s3 mb s3://local-getting-started` のように、いつものコマンドがそのまま使えます。エージェントで使うなら、`aws agent-toolkit add-skill --skill-name aws-emulator --region us-east-1` でスキルを入れる方法も README にあります（AWS CLI 2.35.0 以降）。

## フロントエンド目線のポイント

Next.js などから **JavaScript SDK v3** で S3 や DynamoDB を叩く場合は、次の3つに注意します。

- `AWS_CA_BUNDLE` は読まれないので、`NODE_EXTRA_CA_CERTS` に `ca.pem` のパスを指定する
- クライアントは `disableHostPrefix: true` で作る
- エンドポイントは `localhost` ではなく `127.0.0.1` のままにする。`localhost` だと、JS SDK はバケット名をホスト名に入れてしまい、リクエストが届かない

署名付き URL を使ったアップロードや、プレビュー環境での E2E を、クラウドに出さずに回せるのが一番の利点です（編集部の視点）。

## 料金・ライセンス

ツール自体は無料で、追加のサービス料金はありません。ライセンスは CC0 1.0（`vendor/` は Apache 2.0）。リポジトリは PR を受け付けておらず、不具合の報告は GitHub Issues で受け付けています。

## 注意点・制限

- **IAM ポリシーやリソースベースのポリシーを AWS と同じようには評価しない**ため、AWS で拒否されるリクエストが通ることがある。セキュリティの検証や本番には使わない
- エミュレーター1つが1アカウント・1リージョンの扱い。クロスアカウントやクロスリージョンの動作は再現しない
- 再現度はサービスごとにちがう。リリースごとに「k of n」形式のフィデリティスコアが公開される
- IDC の Devin Pratt 氏は InfoWorld に対し、スロットリングや障害、スナップショットとリストア、リージョンごとの可用性はまだ再現しない、と指摘している
- **テレメトリは既定でオン**。`aws-emulator --telemetry off` か `EMULATOR_TELEMETRY=off` で止められる
- ソースからのビルドには、`target/` 用に100GB以上の空きディスクが必要

## 反応・論点

InfoWorld は、開発とテストの速度とコストに効く一方で、実際のクラウドでのテストの代わりにはならない、という IDC の見方を伝えています。GeekWire は、未対応の一覧が GitHub の `things-that-do-not-work` フォルダで公開されている点に触れています。X の日本語圏では「アツそうなアップデート」「コーディングエージェントでローカルテストできそう」といった、試したいという声が目立ちます。

## 参考リンク

- AWS News Blog: [Test your applications against AWS locally with AWS Emulator](https://aws.amazon.com/blogs/aws/test-your-applications-against-aws-locally-with-aws-emulator/)
- About Amazon: [How we built the agents that built AWS Emulator](https://www.aboutamazon.com/news/aws/how-autonomous-ai-agents-built-aws-emulator)
- GitHub: [aws/aws-emulator](https://github.com/aws/aws-emulator)
- AWS Docs: [Pointing your AWS SDK at AWS Emulator](https://docs.aws.amazon.com/emulator/latest/userguide/point-sdk-to-emulator.html)
- GeekWire: [AWS gives developers a free local stand-in for its cloud, built from scratch by AI agents](https://www.geekwire.com/2026/aws-gives-developers-a-free-local-stand-in-for-its-cloud-built-from-scratch-by-ai-agents/)
- InfoWorld: [AWS unveils local emulator service to help enterprises accelerate app development and testing](https://www.infoworld.com/article/4247383/aws-unveils-local-emulator-service-to-help-enterprises-accelerate-app-development-and-testing.html)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
