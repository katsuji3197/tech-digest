---
title: TanStack DB が 1.0 RC に――API のデータを「型付きコレクション」にして、ライブクエリと楽観的更新をクライアントで完結
date: 2026-10-29
order: 5
teaser: TanStack Query の延長線上で「クライアント側のリアクティブなデータベース」を目指す TanStack DB が、18か月の開発を経て 1.0 RC1 を出しました。独立したモデルをテストの判定役にする「オラクル」での検証が X の開発者のあいだで話題になっています。
cover: /images/2026-10-31/tanstack-db.jpg
cover_caption: TanStack DB 1.0 RC1 発表ブログのヒーロー画像（画像: [TanStack Blog](https://tanstack.com/blog/tanstack-db-1.0-rc1-going-all-in-on-oracles)）
---

**TanStack DB** は、「API のためのリアクティブなクライアントストア」をうたう TypeScript のライブラリです。10月29日、Kyle Mathews 氏がメンテナーの Sam Willis 氏と Kevin De Porre 氏に代わって **1.0 RC1** を発表しました。開発開始から18か月で、npm には `1.0.0-rc.1` が `rc` タグで公開されています。

## 何ができるか

- **コレクション**: API から取ってきたレコードを、型の付いたコレクションとしてクライアントに持つ
- **ライブクエリ**: コンポーネントがコレクションに対して `where` や `orderBy`、結合をかけたクエリを書くと、データの変化に合わせて結果が自動で更新される
- **楽観的更新**: 編集は画面にすぐ反映され、サーバーへの送信に失敗すると元に戻る
- **段階的な導入**: 既存の REST API と TanStack Query から始められる

0.6 以降で SSR、TanStack Start との統合、Neon Realtime と Convex のアダプターが加わりました。フレームワークは React、Preact（6つ目として追加）、Solid、Svelte、Vue、Angular に対応しています。

## なぜ話題か

1つ目は利用の伸びです。コアパッケージの週間ダウンロードは**100万を超え**、React のダウンロード数に対する比率で見ると、この1年で約10倍に伸びました。Prisma Studio や Unkey のダッシュボードでも使われています。2つ目は検証の方法です。RC に向けて「オラクル」、つまり**実装とは独立したモデルにテストの正解を判定させる**手法に全面的に頼ったことを、発表タイトル（Going All In on Oracles）で打ち出しています。なお、DB はもともと ElectricSQL で開発が始まったもので、開発チームは8月に Neon に買収されています。

## 使い方

公式のクイックスタートでは、React と TanStack Query の組み合わせで次のようにインストールします。

```bash
npm install @tanstack/react-db @tanstack/query-db-collection @tanstack/query-core
```

コレクションに対するライブクエリと、楽観的更新の例です（クイックスタートからの抜粋）。

```tsx
const { data: todos } = useLiveQuery({
  query: (q) =>
    q.from({ todo: todoCollection })
     .where(({ todo }) => eq(todo.completed, false))
     .orderBy(({ todo }) => todo.createdAt, 'desc'),
})

const toggleTodo = (todo: { id: string }) => {
  // Instantly applies optimistic state, then syncs to server
  todosCollection.update(todo.id, (draft) => {
    draft.completed = !draft.completed
  })
}
```

`todoCollection` は `collectionOptions` と `queryCollectionOptions` で定義し、`DbProvider` に渡した `DbClient` から取り出します。完全なコードはクイックスタートにあります。

## ライセンスと料金

ライブラリは **MIT ライセンス**のオープンソースで、利用は無料です。

## 注意点・制限

0.9.2 から 1.0 RC へは**破壊的変更**があり、移行ガイドが用意されています。主な変更は次の通りです。

- `$synced` が `$hasPendingWrites` に変わり、意味が逆になる
- `transaction.isPersisted.promise` が `transaction.when('settled')` になる
- Query Collection が自動で再取得しなくなる
- Electric との同期で `collection.utils.awaitTxId(txid)` が必要になる
- ライブクエリのフックから依存配列がなくなる
- エラーは `health` で扱う

また、`@tanstack/query-db-collection` と `@tanstack/offline-transactions` は、RC より前に誤って 1.0 として公開されてしまったとのことです。バージョンの組み合わせには注意してください。

## 似たものとの違い

（編集部の視点）TanStack Query は「サーバーの状態をキャッシュする」道具で、取得したデータを画面ごとに組み合わせるのはアプリ側の仕事でした。TanStack DB はその上に**クエリエンジン**を載せ、結合や絞り込みをクライアントで差分計算します。専用の同期エンジンを前提にせず、**既存の REST API のままで始められる**点が、フロントエンドのチームにとって入りやすいところです。

## 参考リンク

- [TanStack Blog: TanStack DB 1.0 RC1: Going All In on Oracles](https://tanstack.com/blog/tanstack-db-1.0-rc1-going-all-in-on-oracles)
- [TanStack DB Docs: Quick Start](https://tanstack.com/db/latest/docs/quick-start)
- [TanStack DB Docs: Installation](https://tanstack.com/db/latest/docs/installation)
- [GitHub: TanStack/db](https://github.com/TanStack/db)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
