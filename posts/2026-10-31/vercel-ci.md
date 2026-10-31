---
title: Vercel が自前の CI「Vercel CI」をベータ公開――Turborepo のタスクグラフで「変更に関係するタスクだけ」を並列実行
date: 2026-10-28
order: 4
teaser: GitHub Actions の代わりに、Vercel 上で lint やテストを回せるようになりました。turbo.json のタスクに `ci` タグを付けるだけで、変更の影響を受けたタスクだけが、それぞれ専用のマシンで動きます。
cover: /images/2026-10-31/vercel-ci.jpg
cover_caption: Vercel CI 発表ブログのヒーロー画像（画像: [Vercel](https://vercel.com/blog/introducing-vercel-ci)）
---

Vercel は10月28日、継続的インテグレーション（CI）サービス **Vercel CI** をすべてのプランでベータ公開しました。Turborepo のタスクグラフを使い、**変更の影響を受けたタスクだけ**を、タスクごとに分けたマシンで並列に実行します。Vercel 社内では、プッシュから全チェックが通るまでの時間が **2〜6倍速く**なったとしています。

## 背景

モノレポの CI では、「どのパッケージに影響があるか」を判断して無駄なジョブを省く工夫が欠かせません。Vercel はもともと Turborepo でこの判定とリモートキャッシュを提供していました。今回はそれを、実行基盤（Vercel のコンピュート基盤 Hive）まで含めて自社で提供する形です。発表時点で、すでに**約800万タスク**が実行されているといいます。

## 何が起きたか

公式ドキュメントによると、使い方は turbo.json の CI で回したいタスクに `ci` タグを付けるだけです。

```json
{
  "tasks": {
    "lint": {
      "tags": ["ci"]
    }
  }
}
```

有効化は Vercel CLI の `vercel ci enable` で行います。エージェントに設定させる場合は `npx skills use vercel/ci@setup` も案内されています。主な仕様は次の通りです。

- **必要なバージョン**: Turborepo 2.11.7 以上、Vercel CLI 64.3.1 以上
- **実行環境**: 既定はタスクごとに 2 CPU / 4 GB。`ci:cpus:` タグで最大 32 CPU まで増やせる
- **キャッシュ**: Remote Cache が既定で有効
- **結果の表示**: GitHub のプルリクエストにチェックとして表示される

ベータ時点の制限として、**Linux のみ、GitHub のみ、公開リポジトリは不可、トリガーは git push のみ、リポジトリは1つの Vercel チームにだけ接続**、が挙げられています。GA までに、詳しい可観測性、`vc ci` コマンド、より細かいテスト選択を加える予定です。GitHub Actions から移行するためのガイドも公開されています。

## なぜ重要か

（編集部の視点）フロントエンドのチームにとっては、**プレビューデプロイと CI が同じ場所にそろう**ことが大きいです。turbo.json を整えておけば、ワークフローの YAML を書かずに「影響範囲だけを回す CI」が手に入ります。一方で、Linux と GitHub に限られる点、公開リポジトリで使えない点、自分のプランでの料金や上限は、採用前に確認しておく必要があります。まずは lint と型チェックだけを移して、GitHub Actions と速度を比べるのが現実的です。

## 参考リンク

- [Vercel Blog: Introducing Vercel CI](https://vercel.com/blog/introducing-vercel-ci)
- [Vercel Changelog: Vercel CI is now in beta](https://vercel.com/changelog/vercel-ci-is-now-in-beta)
- [Vercel Docs: Vercel CI](https://vercel.com/docs/ci)
- [Vercel KB: Migrate from GitHub Actions to Vercel CI](https://vercel.com/kb/guide/github-actions-to-vercel-ci)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
