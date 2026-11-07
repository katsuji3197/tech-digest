---
title: Next.js 11月のセキュリティリリース――キャッシュ開示や HttpOnly Cookie 露出など7件、v16.4.5 / v15.5.29 へ
date: 2026-11-03
order: 1
teaser: Next.js が11月3日、Active LTS の v16.4.5 と Maintenance LTS の v15.5.29 で7件の脆弱性を修正しました。最高は High のクロステナント・キャッシュ開示。Edge での HttpOnly Cookie 露出も含まれます。
cover: /images/2026-11-07/nextjs-security-hero.jpg
cover_caption: Next.js v16.4.5 リリースの GitHub Open Graph 画像（画像: [GitHub Releases](https://github.com/vercel/next.js/releases/tag/v16.4.5)）
---

Next.js は11月3日（日本時間では同日夜）、**November 2026 Security Release** を公開しました。修正版は **v16.4.5**（Active LTS）と **v15.5.29**（Maintenance LTS）です。対象はキャッシュのクロステナント開示、自己ホスト時のシェル汚染、Edge ルートでの Cookie 露出、画像最適化の SVG バイパスなど **7件**です。

## 背景

先週、Next.js チームは「近日中にセキュリティリリースがある」と予告していました。今回の正式発表では、Cache Components（`use cache`）まわりと、自己ホスト／Edge の境界条件が中心です。Netlify も同日の changelog で、ホスト環境ごとに影響の有無を整理しています。

## 何が起きたか

公式ブログに挙がっている修正は次の通りです（重要度は Next.js ブログの表記）。

1. **High** — `unstable_cache` と `use cache` の組み合わせによるクロステナント・キャッシュ開示（GHSA-mfr8-8qww-v76h）。コールドキャッシュ充填中に、別リクエストの結果がルートパラメータ未確認のまま共有されうる
2. **Medium** — ネストした `use cache` でのクロス・ルートパラメータ開示（GHSA-vc7v-qv4w-wrv8）
3. **Medium** — バイナリ引数によるキャッシュ同一性の衝突と開示・汚染（GHSA-rhh4-g77r-r9qj）
4. **Medium** — 自己ホスト（`next start`）での共有シェル汚染。Partial Prefetching が無効／未設定のとき、未認証リクエストでシェルが汚染されうる
5. **Medium** — 古い圧縮レスポンスのフレーミングずれによるクロスクライアント注入・開示（GHSA-pc58-hwjq-p385）。自己ホスト＋特定の HTTP/1.1 リバースプロキシ条件
6. **Medium** — Edge の Route Handler / API で `NextResponse.cookies.set()` すると、内部ヘッダ `x-middleware-set-cookie` に Cookie が載り、同一オリジンの JS から読める（HttpOnly でも）。Node.js の Route Handler や `cookies().set()` では再現しなかったとのこと（GHSA-f3mh-rxg3-f5g2）
7. **Medium** — Image Optimization で `images.dangerouslyAllowSVG: false` を SVG 拒否バイパスしうる（GHSA-7qx7-33qx-rqx2）。許可リスト内ソースが前提

アップグレード手順は公式どおり次です。

```bash
npm install next@15.5.29  # for 15.5
npm install next@16.4.5   # for 16.x
```

Netlify 上では一部（SVG バイパス、`unstable_cache` 経路のリーク、クロスクライアント注入）はインフラ都合で非該当と説明されています。一方、ネストした `use cache`、バイナリ引数、Edge Cookie、共有シェル汚染などは条件を満たすと影響し、アダプタ `@netlify/plugin-nextjs` **5.16.6** も必要です（Middleware の Cookie ケース）。

## なぜ重要か

（編集部の視点）フロントエンドのテックリードとしては、**「キャッシュを速くする」ための API がテナント境界を壊しうる**点が一番重いです。マルチテナントや locale／site をルートパラメータで分けている App Router アプリは、まず Cache Components の利用箇所を棚卸しし、**当日中に 15.5.29 / 16.4.5 へ上げて再デプロイ**するのが安全です。Edge でセッション Cookie をセットしているチームは、HttpOnly でも `x-middleware-set-cookie` 経由で読まれうる点を確認してください。自己ホストならリバースプロキシと Partial Prefetching の設定もセットで見直す必要があります。

## 参考リンク

- [Next.js Blog: November 2026 Security Release](https://nextjs.org/blog/november-2026-security-release)
- [GitHub Releases: v16.4.5](https://github.com/vercel/next.js/releases/tag/v16.4.5)
- [Netlify Changelog: Next.js security vulnerabilities (2026-11-03)](https://www.netlify.com/changelog/2026-11-03-nextjs-security-vulnerabilities/)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
