---
title: WebStorm 2026.3――Figma / Storybook / Chrome DevTools をつなぐ Design-Code-Production と JetBrains Air
date: 2026-11-05
order: 3
teaser: JetBrains が WebStorm 2026.3 を公開しました。IDE 内の JetBrains Air で複数エージェントを並列実行し、Figma Connect・Storybook Connect・Chrome DevTools Connect でデザインからブラウザ検証までをつなぎます。
cover: /images/2026-11-07/webstorm-2026-3-hero.jpg
cover_caption: WebStorm 2026.3 公式発表のソーシャル画像（画像: [JetBrains Blog](https://blog.jetbrains.com/webstorm/2026/11/webstorm-2026-3/)）
---

JetBrains は11月5日、**WebStorm 2026.3** を公開しました。焦点は「デザイン → コード → 本番相当の確認」を IDE の外に出さず、**JetBrains Air** 上のエージェントとつなぐことです。Figma・Storybook・Chrome DevTools の各 Connect と、複数エージェントの並列実行が中心機能です。

## 背景

UI 機能をエージェントに任せるとき、Figma から値をコピーし、Storybook で該当ストーリーを探し、プロンプトを書き、ブラウザで結果を見てループ――という切り替えコストが大きかった、と公式は説明しています。2026.3 はそのループを WebStorm 内に閉じることを狙っています。

## 何が起きたか

### JetBrains Air

- Claude Agent、Codex、Gemini、GitHub Copilot、Junie、OpenCode、その他 **ACP 互換**エージェントに対応
- 端末に入っているエージェントを検出し、プロバイダのサブスクや API キー、カスタム base URL をそのまま利用可能。**JetBrains AI のサブスクは必須ではない**
- 差分レビューや行アンカー付きフィードバックをエージェントへ返せる
- **Junie Lite** が無料枠（JetBrains Account が必要）
- 既存の AI Assistant からは移行通知あり。スキル・MCP・ACP エージェント・認証・チャット履歴は自動移行（Chat mode の履歴は対象外）

### Design-Code-Production

- **Figma Connect**: Inspect パネルで CSS・色・デザイントークンを取得し、エージェントの文脈に渡せる
- **Storybook Connect**（Storybook **10+**、別プラグイン）: ストーリーの閲覧・生成。CLI 例として `webstorm storybook-connect create-missing-stories ./src/Button.tsx` など
- **Chrome DevTools Connect**: エージェントが実ブラウザでページ遷移・DOM／コンソール／ネットワーク確認・スクリーンショット・操作まで行い、結果を人が検証する

### その他

- **TypeScript 7** サポートが Stable（Go ベースの言語サービス）。プロジェクトの TypeScript バージョンを変えずに選択可能。Kibana ではプロジェクト読み込みが約12秒から約3秒に短縮したとのこと
- スクリーンリーダー向けの**サウンドキュー**、エージェント完了／エラー／入力待ちの音
- エラーと UI フリーズの**自動レポート**（個人情報は除去。Data Sharing でオプトアウト可）

更新は Toolbox または公式サイトから行えます。

## なぜ重要か

（編集部の視点）フロントエンドのテックリードにとっては、**エージェントを「別チャット」ではなく IDE の検証ループに入れる**製品です。Figma の数値と自前コンポーネント（Storybook）とブラウザ確認が同じ文脈にそろうと、レビューの起点が「コンパイルできたコード」から「一度ブラウザで見てもらった結果」に変わります。一方で、Storybook 10+ 要件、Figma の初期セットアップ、どのエージェント契約をチーム標準にするかは導入前の設計事項です。まずは Junie Lite か既存の Claude／Codex 契約で、1 コンポーネントの実装＋Story 生成＋ブラウザ確認だけを試すのが現実的です。

## 参考リンク

- [JetBrains Blog: WebStorm 2026.3](https://blog.jetbrains.com/webstorm/2026/11/webstorm-2026-3/)
- [Mirror summary (worldprogramming.org)](https://www.worldprogramming.org/posts/webstorm-20263-new-design-code-production-workflow-jetbrains-air-in-webstorm-and-more-hu4fbf)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
