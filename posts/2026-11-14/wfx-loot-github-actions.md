---
title: GitHub Actions と npm フックを狙う「wfx-loot」――乗っ取られた約4,800アカウントから6万超のリポジトリに CI シークレット窃取コード
date: 2026-11-12
order: 1
teaser: 11月10日から、盗まれた GitHub 認証情報で他人のリポジトリにシークレット窃取スクリプトを仕込む攻撃が広がりました。GitHub はワークフロー改変型を保留しましたが、package.json の postinstall 経由の型はすり抜けて実行されました。
cover: /images/2026-11-14/wfx-loot-hero.png
cover_caption: GitGuardian による wfx-loot 解説記事のヘッダー画像。npm の postinstall フックが GitHub の保留をすり抜けて実行されたことを示している（画像: [GitGuardian Blog](https://blog.gitguardian.com/wfx-loot-a-ci-secret-stealer-pushed-with-stolen-github-credentials/)）
---

2026年11月10日 12:45 UTC（日本時間21:45）ごろから、盗まれた GitHub の認証情報を使い、他人のリポジトリに CI シークレットを盗むスクリプトを押し込む攻撃キャンペーンが広がりました。Aikido Security が **wfx-loot** と名付けたこの攻撃では、約4,800アカウントから6万件を超えるリポジトリに「調査用」の PR が作られています。国内でも GMO Flatt Security が11月12日夜に注意喚起を出しました。

## 背景

書き込み権限のある他人のリポジトリにワークフローを注入する手口自体は新しくありません。GitGuardian は、2025年から2026年10月まで追跡してきた GhostAction や Shai-Hulud 系と同じ系統だと位置づけています。最近の攻撃に対しては、GitHub が不審なワークフローの実行前に明示的な承認を求めることで被害を抑えてきました。今回の特徴は、その保留を **npm のライフサイクルフック**ですり抜けた点にあります。

## 何が起きたか

- **手順**: まず `wfx-docs` ブランチから `docs: dependency audit notes` という PR を作り、書き込み権限を確かめます。続いて `ci: refresh build cache`（既存ワークフローへの注入）、`chore: add dependency audit workflow`（使い捨てワークフロー）、`chore: add ci helper`（`.ci-xxxxxx.sh` と `package.json` の `postinstall`）のいずれかで本体を仕込み、1分以内に元に戻して実行履歴とログを消します（Aikido）。
- **規模**: Aikido の集計では、4,837アカウントが61,764リポジトリに PR を作り、少なくとも1,835リポジトリでペイロードが動いて認証情報が持ち出されました。PR の92%は開いたままです。SafeDep は悪性コミットを受けたリポジトリを8,093件、GitGuardian は独自データで17,715件と数えています。
- **盗む対象**: Actions の secrets と vars（`toJSON(secrets)` で全件）、`GITHUB_TOKEN`、OIDC トークン、AWS・GCP・Azure の認証情報、`~/.npmrc`、SSH 鍵、`.env`、OpenAI や Anthropic などの AI サービスのキー、ランナーのメモリなどです。
- **居座り**: AWS ではアクセスキーの新規作成やロールの信頼ポリシーの書き換え、Azure では `wfx-ci-` という名前のフェデレーション資格情報の追加を試みます。シークレットを入れ替えた後も侵入口が残るおそれがあります。
- **保留とすり抜け**: GitGuardian によると、11月に確認できたワークフロー改変型の実行は7件すべて `action_required` で止まっていました。一方 npm フック型は、既存の正当なワークフローが `npm install` を実行するだけなので保留されません。ジョブログが公開されている19リポジトリのうち18で送信成功が記録されていました。フック型のコミットは11月11日朝に3時間で838件、12日朝には1,210件まで増えています。
- **パッケージへの波及**: 自動リリースを通じて、Packagist の `digitalelvis/neuronai-studio` 3.14.3 と、Go モジュール `github.com/onuragtas/docker-env`（`redock`）の一部バージョンにペイロードが入りました。

![GMO Flatt Security の注意喚起記事のアイキャッチ](/images/2026-11-14/wfx-loot-flatt.png "国内向けに影響と対策をまとめた GMO Flatt Security の注意喚起（画像: [GMO Flatt Security Blog](https://blog.flatt.tech/entry/github_actions_widespread_supply_chain_attack)）")

## なぜ重要か

フロントエンドのリポジトリはほぼ必ず `package.json` を持ち、CI で `npm ci` を回しています。今回の攻撃は、まさにその「普通の install」を入口にしました。フックは CI の外でも動くため、該当コミットを取り込んで手元で `npm install` した開発者のマシンも被害の対象になります（GitGuardian、SafeDep）。

（編集部の視点）まずは担当するリポジトリで、上記の PR 名・コミット名・ブランチ名と、ワークフロー実行番号の欠番を確認しましょう。あわせて、CI の install を `--ignore-scripts` 前提にできないか、Actions の secrets をワークフローや environment ごとに絞れているか、OIDC の信頼条件を特定のブランチに限定できているかも見直す価値があります。今回は Actions の脆弱性ではなく、**盗まれた正規の認証情報**が起点です。個人の PAT と OAuth 許可の棚卸しも欠かせません。

## 反応・論点

- GMO Flatt Security は、悪性コードの実行が疑われる場合は GitHub・クラウド・レジストリ・AI API・SSH・DB などの資格情報をすぐに入れ替え、AWS のロール信頼ポリシーと Azure のフェデレーション資格情報の変更も点検するよう呼びかけました。
- BleepingComputer は、侵害されたアカウントに Fortune 100 企業、米国一般調達局（GSA）、フランス政府、Nextcloud、WebdriverIO の関係者が含まれていたと報じています。
- Aikido と GitGuardian はいずれも、10月の GhostAction と被害アカウントが重なっていると指摘しています。そのうえで、インフラや手口が違うため別の攻撃者の可能性が高いという見方です。漏れた認証情報が複数の攻撃者に使い回されている、という論点です。

## 参考リンク

- [GMO Flatt Security Blog: GitHub Actions を狙った広域サプライチェーン攻撃（11/10~11/12）に関する注意喚起](https://blog.flatt.tech/entry/github_actions_widespread_supply_chain_attack)
- [Aikido: wfx-loot campaign pushes CI secret stealer to tens of thousands of repositories](https://www.aikido.dev/blog/compromised-github-accounts-push-ci-secret-stealer-to-tens-of-thousands-of-repositories)
- [GitGuardian Blog: wfx-loot: A CI Secret Stealer Pushed With Stolen GitHub Credentials](https://blog.gitguardian.com/wfx-loot-a-ci-secret-stealer-pushed-with-stolen-github-credentials/)
- [SafeDep: wfx: GitHub Actions Credential Stealer Hits 8,000 Repos](https://safedep.io/blog/github-actions-wfx-credential-stealer)
- [BleepingComputer: Hackers compromise 4,800 GitHub accounts to steal cloud credentials](https://www.bleepingcomputer.com/news/security/hackers-compromise-4-800-github-accounts-to-steal-cloud-credentials/)

**動画:** 確認できた関連動画はありません（動画なし）。
