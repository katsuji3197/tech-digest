---
title: 【号外】Java に認証不要の RCE「Java4Shell」（CVE-2026-114938）――Base64 を処理するだけで突破、Keycloak・Jira・Jenkins で実証
date: 2026-11-18
type: extra
time: "08:40"
summary: OpenJDK の Base64 デコーダー（AVX-512 向けの最適化コード）にメモリ破壊の脆弱性。Calif は Keycloak、Jira、Confluence、Jenkins などで認証なしの遠隔コード実行を実証しました。修正版は日本時間18日朝に公開。Java 17.0.6 以降を x86-64 で動かしているなら、更新か JVM フラグでの回避を今日中に。
---

社内の認証基盤、CI、チケット管理、API サーバー。フロントエンドの裏側で動いている Java を、今日のうちに洗い出してください。影響する条件、修正版、すぐ使える回避策をまとめました。（日本時間18日朝までの情報です）
