---
title: Modern Web Guidance 1.0――Chrome・Edge・Firefox・MDN が共同で育てる「コーディングエージェント用の Web 標準スキル」
date: 2026-11-10
order: 2
teaser: AI が書きがちな「2019年風の JavaScript」を、ブラウザ標準の HTML/CSS に置き換えさせるスキル集が正式版になりました。203本のガイドに加え、既存コードの古い書き方を見つける legacy-scan が付きます。
cover: /images/2026-11-14/modern-web-guidance-hero.png
cover_caption: Chrome for Developers ブログの Modern Web Guidance 1.0 告知画像（画像: [Chrome for Developers](https://developer.chrome.com/blog/modern-web-guidance-v1)）
---

Google Chrome チームは11月10日（米国時間）、コーディングエージェントに Web プラットフォームの知識を持たせるスキル集 **Modern Web Guidance** の正式版 1.0 を公開しました。5月の Google I/O で出したプレビューの後継で、1.0 からは **Microsoft Edge、Mozilla Firefox、MDN** も運営に加わります。

## それが何か

Modern Web Guidance は、Web のベストプラクティスとブラウザ互換性データ（Baseline）を、エージェントが参照できる「スキル」としてまとめたものです。Chrome の Philip Walton 氏は告知ブログで、最新のモデルは動くコードを書けても、専門家が見ればもっと速く、アクセシブルで、安全にできる箇所が必ず見つかる、という問題意識を述べています。v1.0.0 のリリースノートによると、**203本のユースケースガイドで250の Web 機能**をカバーしています。

## 何ができるか

- **ガイドの参照**: ダイアログやポップオーバーのアニメーション、スクロール連動、パスキー、HTML のサニタイズ、CSP などで、JavaScript による自作より標準機能を優先した書き方を、プロジェクトのブラウザ対応要件に合わせて提案します。
- **legacy-scan**: 既存の HTML、CSS、JavaScript、`package.json` を静的解析して古いパターンを見つけ、置き換え先のガイドに対応づけます。現時点で対象になるのは、決定的なルールを持つ約2割のガイドです。
- **評価の公開**: すべてのガイドに評価があり、エージェントごと・ガイドごとの結果を公開ダッシュボードで見られます。

## なぜ話題か

X では、Chrome for Developers の投稿をはじめ「エージェントが書く2019年風のコードを止める」という文脈で広く共有されました。関連投稿は11月11日（UTC）に1日約700件、13日に約760件まで増えています（X の投稿数カウント）。国内の事例が載っているのも注目点です。note 社は Next.js フロントエンドで180回の評価を行い、モダン Web チェックの合格率が61%から94%に上がったと紹介されています。

## 使い方

公式ブログと README にある手順です。

```bash
npx modern-web-guidance@latest install
```

プレビュー版からの更新は次のコマンドです。

```bash
npx modern-web-guidance@latest update
```

既存コードの棚卸し（リリースノート記載）は次のとおりです。

```bash
npx modern-web-guidance@latest legacy-scan [path]
```

エージェントに近代化を頼むときは `/modern-web-guidance Modernize the code in this directory` と指示します。Claude Code、Codex、Cursor、Antigravity、Copilot、WebStorm などのプラグインマーケットプレイスからも導入できます。

## 料金・ライセンス

無料で、GitHub リポジトリと npm パッケージのライセンスは **Apache-2.0** です。

## 注意点・制限

- legacy-scan はまだ限られたパターンの静的解析です。エージェントがコードを読んで判断する監査は今後の予定とされています。
- 単一エンジンにしか実装がない機能や、出て3か月以内の不安定な機能のガイドは、`.mwgrc` で明示的に許可しないと取り出せません。
- Search Engine Journal によると、運営のオーナー席は6つで、Chrome が2、Edge と Mozilla が各1、独立した専門家が2です。**Apple の席はありません**。

## 類似との違い

（編集部の視点）ESLint のようなリンターは書かれたコードを規則で検査するだけです。これは、書く前のエージェントに「どの標準機能を使うべきか」を互換性データ付きで教える点が違います。Chrome は、実行時の検証に使う Chrome DevTools for agents との併用を勧めています。チームのブラウザ対応方針を Baseline で決めているなら、レビュー負荷を下げる候補になります。

## 参考リンク

- [Chrome for Developers: Modern Web Guidance 1.0](https://developer.chrome.com/blog/modern-web-guidance-v1)
- [GitHub: GoogleChrome/modern-web-guidance Release v1.0.0](https://github.com/GoogleChrome/modern-web-guidance/releases/tag/v1.0.0)
- [GitHub: GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance)
- [Search Engine Journal: Google Releases Modern Web Guidance 1.0 For AI Coding Agents](https://www.searchenginejournal.com/google-releases-modern-web-guidance-1-0-for-ai-coding-agents/596495/)
- [X: Chrome for Developers の投稿（11月13日）](https://x.com/ChromiumDev/status/2121339675667309047)

## 関連動画

[![YouTube: Unlock modern web capabilities in your AI coding workflows（Chrome for Developers）](/images/2026-11-14/yt-bo3i0FzDUYo.jpg "Unlock modern web capabilities in your AI coding workflows — Chrome for Developers（YouTube, 2026年5月21日。Google I/O のプレビュー発表セッション）")](https://www.youtube.com/watch?v=bo3i0FzDUYo)
