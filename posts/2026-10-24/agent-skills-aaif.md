---
title: 「Agent Skills」が Linux Foundation 傘下の AAIF へ――MCP に続く寄贈で、OpenAI・Hugging Face・Alibaba も新プロジェクトを持ち寄る
date: 2026-10-22
order: 2
teaser: Anthropic が SKILL.md の標準「Agent Skills」を Agentic AI Foundation に寄贈しました。同時に Open Responses、OpenEnv、OpenSandbox も加わり、AAIF のプロジェクトは1年で10個になりました。
cover: /images/2026-10-24/aaif-projects.png
cover_caption: AAIF による4つの新プロジェクト発表の告知画像（画像: [Agentic AI Foundation](https://aaif.io/news/agentic-ai-foundation-announces-four-new-projects)）
---

Anthropic は10月22日（米国時間）、AI エージェントに専門知識や作業手順を教えるオープン標準 **Agent Skills** を、Linux Foundation 傘下の **Agentic AI Foundation（AAIF）** に寄贈すると発表しました。2025年の MCP に続く寄贈です。AAIF はサンノゼで開かれた AGNTCon + MCPCon North America に合わせて、OpenAI、Hugging Face、Alibaba が持ち込んだプロジェクトも含め、4つの新プロジェクトを一度に発表しました。

## 背景

「スキル」は、`SKILL.md` というファイルを入れたフォルダです。特定の作業や分野のやり方をエージェントに教え、必要なスクリプトや参考資料も一緒に入れておけます。Anthropic は Claude Code を作る中でこの仕組みを考え、2025年10月に公開しました。12月には、独自の GitHub 組織とドメイン（agentskills.io）を持つオープン標準にしています。

## 何が起きたか

- Anthropic によると、ChatGPT、Cursor、GitHub Copilot、VS Code など**70以上のエージェント製品**がすでに Agent Skills に対応しています。公開されたスキルは**100万件**、インストール数は**約2.8億回**に上ります。
- 寄贈されるのは、名前とロゴ、GitHub 組織、agentskills.io ドメインです。AAIF に加盟しなくても、これまでどおり使ったり貢献したりできます。
- 標準は Anthropic、Google、OpenAI などのエンジニアが**個人の立場で**メンテナンスします。リードメンテナーは David Soria Parra 氏と Mahesh Murag 氏です。
- 今後のロードマップとして、バージョン付きのリリース、正式な提案プロセス、スキルを書く人・入れる人向けのセキュリティガイダンスが提案されています。

同時に AAIF に加わったプロジェクトは次のとおりです。

- **Open Responses**（OpenAI）: OpenAI の Responses API をもとにした、複数の LLM プロバイダーで共通に使えるインターフェースの仕様
- **OpenEnv**（Hugging Face）: 強化学習の環境をコンテナ化し、MCP と Gym の形で共有できるフレームワーク
- **OpenSandbox**（Alibaba）: Docker や Kubernetes で動く、コーディングエージェントなど向けの汎用サンドボックス

これで AAIF のプロジェクトは、2025年12月の立ち上げ時の3個から**10個**になりました。A2A、AGENTS.md、goose、MCP などと並びます。

## 最小の例

仕様（agentskills.io）では、`SKILL.md` は YAML のフロントマターと Markdown の本文でできています。必須の項目は `name` と `description` だけです。

```markdown
---
name: pdf-processing
description: Extract PDF text, fill forms, merge files. Use when handling PDFs.
license: Apache-2.0
---
```

`name` は小文字・数字・ハイフンだけで64文字以内とし、親フォルダの名前と一致させます。エージェントは最初に `name` と `description`（約100トークン）だけを読み込み、スキルを使うと決めたときに本文全体を読み込みます。こうした**段階的な読み込み**が前提になっています。検証には `skills-ref validate ./my-skill` が用意されています。

## なぜ重要か

（編集部の視点）チームの「このリポジトリでの作法」をスキルにまとめておけば、Claude Code でも Cursor でも Copilot でも同じものが使えます。その標準を中立の団体が管理するようになったことで、特定のベンダーに縛られる心配は小さくなりました。ただ、スキルにはスクリプトも入れられるので、npm パッケージと同じように「誰が書いたものを入れるか」が問題になります。ロードマップにセキュリティガイダンスが入っているのは、そのためでしょう。

## 反応・論点

- AAIF の CTO、Manik Surtani 氏は「4つの異なる企業が中立のガバナンスに託すことを選んだ」と述べ、特定の1社が結果を握らないことが財団の役割だと強調しました。
- X では、発表のあった10月22日に約600件、翌23日に約950件の関連ポストがありました（x API の件数集計）。

## 参考リンク

- [Anthropic: Donating Agent Skills to the Agentic AI Foundation](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation)
- [AAIF: Agentic AI Foundation Announces Four New Projects](https://aaif.io/news/agentic-ai-foundation-announces-four-new-projects)
- [Agent Skills: Specification](https://agentskills.io/specification)

**動画:** 確認できた関連動画はありません（動画なし）。
