---
title: 「ORM はもう終わり」？ .sql をそのまま import して型が付く「Reylo」を Zod 作者が公開
date: 2026-10-22
order: 1
teaser: TypeScript 7.1 beta の新機能「content mappers」で、SQL ファイルの列・パラメータ・nullability を開発用 DB から直接読み取る。コード生成なし。ベータで、TS 7.1 の正式版を待って正式リリース予定。
cover: /images/2026-10-22-extra-reylo/reylo-hero.png
cover_caption: Reylo 公式サイトの OG 画像。.sql を import した結果に型が付いている（画像: [reylo.dev](https://reylo.dev)）
---

バリデーションライブラリ Zod の作者として知られる Colin McDonnell 氏（@colinhacks）が10月22日14時46分（日本時間）、新しいツール **Reylo** を X で公開しました。`.sql` ファイルを TypeScript のモジュールとして import すると、クエリの結果やパラメータに**開発用データベースから読み取った型**が付く、というものです。「type inference from .sql files has been achieved internally. ORMs are toast（.sql ファイルからの型推論を達成した。ORM はもう終わりだ）」という挑発的な一文付きの動画投稿は、公開から約3時間半で6万回以上表示され、1,600件超のいいねと約400件のブックマークを集めました。

## Reylo とは

公式サイトの説明は「Import .sql files into TypeScript with full type inference」。たとえば `get_author.sql` に普通の SQL を書いておき、TypeScript 側からはこう呼び出します。

```ts
import postgres from "postgres";
import getAuthor from "./get_author.sql";

const db = postgres(process.env.DATABASE_URL);

// hover over author to see its type
const author = await getAuthor.run(db, { id: 1 });
```

このとき `author` には `{ id: number; name: string; post_count: number } | null` のような型が付きます。ポイントは、型を手で書いたりスキーマファイルを別に持ったりせず、**型が SQL そのものから出てくる**ことです。

## 何ができるか

公式ドキュメントによると、Reylo は開発用 DB にクエリを「実行せずに prepare」させ、DB のカタログを参照して次の情報を得ます。

- パラメータの型と列の型（Postgres の enum はラベルのユニオン型、`check (kind in ('click','key'))` も `"click" | "key"` に）
- nullability（`NOT NULL` 制約や `left join` から判断）
- 返る行数（主キー・ユニークキーで引けば `Row | null`、集約なら `Row`、`returning` なしの更新系は `void`、それ以外は `Row[]`）
- `jsonb_build_object` / `jsonb_agg` で組み立てた入れ子 JSON の形

列名を打ち間違えると、DB 自身のエラーが `.sql` ファイルの該当行・列に型エラーとして出ます。`tsc` でもエディタでも同じです。

![VS Code で .sql の列名の誤りがエラーになっている画面](/images/2026-10-22-extra-reylo/reylo-error.jpg "存在しない列「nmae」が reylo(6) のエラーとしてエディタに表示される（画像: [@colinhacks の X 投稿](https://x.com/colinhacks/status/2113162631825813664)）")

対応 DB は Postgres、MySQL（8.0.22以降）、SQLite。ドライバは `pg`、postgres.js、Neon、PGlite、`mysql2`、PlanetScale、`better-sqlite3`、`node:sqlite`、libSQL、Turso、Cloudflare D1 などを使えます。パラメータと結果の JSON Schema（`.inputSchema` / `.outputSchema`）も取り出せるので、OpenAPI やフォーム、AI エージェントのツール定義にも流用できます。

## なぜ今話題なのか

土台になっているのは、10月20日に出た **TypeScript 7.1 beta** の新機能 **content mappers** です。特定の拡張子のファイルを、TypeScript から見える仮想的なコードに変換するプラグインの仕組みで、Microsoft の発表では Vue・Astro・MDX・CSS Modules などでの利用が想定されています。Reylo はこれを SQL に使い、「コード生成なし・ウォッチャーなし」で型チェッカーが直接 Reylo に問い合わせる形を実現しました。TS 7.1 beta から2日で、新しい仕組みの使い道を具体的に見せた形です。

## 使い方

必要なのは TypeScript 7.1（beta）、Node 24 以降、動いている開発用 DB です。公式サイトのインストール手順は次のとおりです。

```sh
npm install reylo
npm install -D @reylosql/postgres  # or mysql, sqlite
npm install -D typescript@beta
```

`tsconfig.json` に content mapper として登録し、`--runExternalCode` 付きで型チェックします。

```jsonc
{
  "compilerOptions": { /* ... */ },
  "contentMappers": [
    { "package": "reylo", "extensions": [".sql"] }
  ]
}
```

```jsonc
{
  "scripts": {
    "typecheck": "tsc --noEmit --runExternalCode"
  }
}
```

実行時に `.sql` を読み込めるよう、Node なら `node --env-file=.env --import reylo/register main.ts` のようにプリロードします。Vite（`reylo/vite`）、Next.js（`withReylo`）、esbuild、webpack、Rspack、Jest、Bun、Cloudflare Workers 向けのプラグインも用意されています。DB の接続先は `DATABASE_URL`、または `.reylo.yaml` の `direct_url` で指定します。エディタは VS Code / Cursor なら TypeScript 7 拡張（`TypeScriptTeam.native-preview`）を入れ、プロジェクトの TypeScript を使うように設定します。

## 料金・ライセンス

**MIT ライセンス**で無料です。リポジトリは `colinhacks/reylo`（10月21日作成、本稿執筆時点でスター約190）。npm の最新版は `0.0.2` です。

## 注意点・制限

- **まだベータ**です。McDonnell 氏は X で「本番ですでに使っている」としつつ、TypeScript 7.1 が安定版になってから正式にリリースする考えを示しています。TS チームの計画では 7.1 の安定版は11月24日予定です。
- クエリは**別の `.sql` ファイル**に書く必要があります。TS ファイル内のインライン SQL に型を付けられないかという質問に、同氏は「content mappers では不可能」と答えています。
- 宣言的なスキーマ管理やマイグレーションは扱いません（同氏は「たぶん今後もやらない」と回答）。
- Vite では、`.sql` を import した場所にクエリがバンドルされるため、`.server/` などサーバー側のコードからだけ import するよう公式ドキュメントが注意しています。
- 型チェック時に DB へつなぐため、CI では DB を起動するか、`schema` でスキーマダンプやマイグレーションを指定します（`schema` は Postgres と SQLite のみ）。PgBouncer のようなトランザクションモードのプーラー経由では失敗しうるので、直接接続を使うよう案内されています。

## 似たものとの違い

Prisma や Drizzle のような ORM・クエリビルダーは TypeScript のコードでクエリを組み立てますが、Reylo は**生の SQL をそのまま書く**ことが前提です。また、SQL から型ファイルを生成するタイプのツールと違い、生成ファイルもウォッチャーもありません。Drizzle の公式アカウントとのやり取りでは、McDonnell 氏は Prisma の TypedSQL に触れ、「TS 7.1 の content mappers がこの種のものの前提を変える」という趣旨を述べています。

## なぜ重要か

（編集部の視点）フロントエンド寄りのチームでも、Next.js の Server Components や Route Handlers で DB を直接触る場面は増えています。ORM の学習コストを避けつつ、SQL の打ち間違いや列の削除をビルド前に捕まえられるのは魅力です。それ以上に、TypeScript 7.1 の content mappers が「TS 以外のファイルに型を付ける」新しい土台になりうることを示した点が大きく、Vue や Astro だけでなく、GraphQL や設定ファイルなどにも同じ発想が広がる可能性があります。

## 反応・論点

- X のトレンド要約によると、「ORM キラー」と歓迎する声がある一方、型チェックのたびに live な DB 接続に頼ることの大規模環境での性能を疑問視する声もあります。
- 移行を検討中だったという開発者からは「kysely か drizzle に移すつもりだったが、Reylo はよさそう」という反応が出ています（[X の投稿](https://x.com/adiazdorado/status/2113186688755515505)）。
- McDonnell 氏自身は、型が一か所にしかないので古い型が残らず、「ORM やコード生成よりエージェントに向いている」と繰り返し強調しています。

## 参考リンク

- [Reylo: 公式サイト（ドキュメント）](https://reylo.dev)
- [GitHub: colinhacks/reylo](https://github.com/colinhacks/reylo)
- [X: @colinhacks の発表投稿](https://x.com/colinhacks/status/2113145042454134986)
- [TypeScript Blog: Announcing TypeScript 7.1 Beta](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/)
- [GitHub: TypeScript 7.1 Iteration Plan](https://github.com/microsoft/TypeScript/issues/63703)

**動画:** 確認できた関連動画はありません（動画なし）。デモ動画は[発表投稿](https://x.com/colinhacks/status/2113145042454134986)で見られます。
