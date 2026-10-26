---
title: React Router 8.5――独自の View Transition API を非推奨化し、React の <ViewTransition> へ
date: 2026-10-19
order: 4
teaser: viewTransition プロップや useViewTransitionState は v9 で削除予定。静的 HTML を CDN に置き、loader/action だけをサーバーで動かす「API-only Mode」も unstable で登場した。
cover: /images/2026-10-21/react-router-8-5.png
cover_caption: react-router@8.5.0 のリリースページ（画像: [GitHub](https://github.com/remix-run/react-router/releases/tag/react-router%408.5.0)）
---

React Router **8.5.0** が10月19日にリリースされました。目玉は、ルーター独自の View Transition API を**非推奨（deprecated）**にし、React 19.3 以降に入った `<ViewTransition>` コンポーネントへ移行する方針を明確にしたことです。あわせて、静的 HTML とランタイムサーバーを分けて配置できる **API-only Mode（unstable）** なども加わりました。

## 背景

React Router はこれまで、`<Link viewTransition>` や `navigate(to, { viewTransition: true })` を指定すると、ナビゲーションの更新を `document.startViewTransition()` で包む独自の仕組みを提供してきました。一方で React 本体にも `<ViewTransition>` が入り、ライブラリと React の両方が同じブラウザ API を扱う状態になっていました。公式ドキュメントは、両方を同時に有効にするとアニメーションが中断されることがあると注意しています。

## 何が変わったか

**非推奨になる API**

- `<Link>` / `<NavLink>` / `<Form>` の `viewTransition` プロップ
- ナビゲーション・送信オプションの `viewTransition: true`
- `useViewTransitionState`、`NavLink` の `isTransitioning`、`.transitioning` クラス

これらは v8 のあいだは動き続け、**v9 で削除予定**です。

**新しい推奨パターン。** 永続的なレイアウトで `<Outlet>` を `<ViewTransition>` で包みます。

```tsx
import { ViewTransition } from "react";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <ViewTransition>
      <Outlet />
    </ViewTransition>
  );
}
```

React Router は既定でルーターの状態更新を `startTransition` で包むため、追加の設定は要りません。ただし `useTransitions={false}` を指定すると動かなくなります。ドキュメントには、React は `popstate` による同期更新ではビュー遷移をスキップするため、ブラウザの戻る・進むではアニメーションしない場合があるとも書かれています。

**API-only Mode（unstable）。** `react-router.config.ts` で `ssr: "unstable_api-only"` を指定すると、静的 HTML を CDN から配信しつつ、loader / action / 再検証 / ルート探索だけをランタイムサーバーで処理できます。サーバーを別オリジンに置く場合は `unstable_apiServerOrigin` を使い、CORS と `allowedActionOrigins` を設定します。

このほか、データ取得リクエストをカスタマイズできる `unstable_fetch` と、ルート探索をアプリ側で制御する `future.unstable_customRouteDiscovery` も追加されました。

## なぜ重要か

View Transition を使っているアプリでは、v9 に向けた移行作業がはっきり見えてきました。`isTransitioning` に合わせて `view-transition-name` を切り替える実装をしている場合は、React の View Transition クラスや、同じ name を持つ `<ViewTransition>` による共有要素アニメーションへ書き換える必要があります。API-only Mode は、「HTML は CDN に、API は別のランタイムに」という構成を Framework Mode のまま実現する選択肢になります。静的ホスティングを中心にした構成と相性が良さそうです（編集部の視点）。

## 反応・論点

開発者向けのニュースまとめ Dev Daily Briefs は、この変更を「ライブラリ独自の API を手放し、共有プリミティブに寄せる流れ」と位置づけています。

## 参考リンク

- [React Router CHANGELOG（v8.5.0）](https://github.com/remix-run/react-router/blob/main/CHANGELOG.md#v850)
- [GitHub Release: react-router@8.5.0](https://github.com/remix-run/react-router/releases/tag/react-router%408.5.0)
- [React Router Docs: View Transitions](https://reactrouter.com/how-to/view-transitions)
- [Dev Daily Briefs: Dev News — 20 Oct 2026](https://devbrief.dev/dev-news/dev-news-2026-10-20/)

**動画:** 確認できた関連動画はありません（動画なし）。
