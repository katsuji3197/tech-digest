---
title: 【号外】Ruby に認証不要の RCE「Ruby2Shell」（CVE-2026-132825）――素の Rails がそのまま対象。Ruby 4.0.10／3.4.13／3.3.14 へ即更新を
date: 2026-11-20
type: extra
time: "08:40"
summary: Ruby 2.4.0 以降の文字列の大文字変換に1バイトのヒープオーバーフロー。初期設定の Rails と classic スタイルの Sinatra で、ログイン前のリクエストから届きます。GitLab、GitHub Enterprise Server、Chatwoot は日本時間20日朝の時点で修正版なし。研究者は11月25日以降に PoC を公開予定です。
---

PHP2Shell、Java4Shell、nginx2root に続き、今度は Ruby 本体です。gem や Rails を上げても直らず、Ruby そのものの更新と再起動が必要です。影響する条件、修正版、同梱製品の状況をまとめました。（日本時間20日朝までの情報です）
