---
title: Vercel Chat SDK、json-render で生成 UI をストリーム――Slack Block Kit / Teams Adaptive Cards へ
date: 2026-11-06
order: 5
teaser: Vercel が Chat SDK エージェント向けに json-render 連携を公開しました。型付きカタログから JSON 仕様を生成し、streamCard で Slack や Teams のネイティブカードとしてストリーム更新できます。
cover: /images/2026-11-07/vercel-json-render-hero.png
cover_caption: Vercel Changelog「json-render and Chat SDK agents」の og:image（画像: [Vercel Changelog](https://vercel.com/changelog/json-render-and-chat-sdk-agents)）
---

Vercel は11月6日、Chat SDK のエージェントが **json-render** で生成 UI をストリームできるようになったと changelog で発表しました。著者は Railly Hugo、Lahfir、Ben Sabic の各氏です。エージェントは型付きコンポーネントカタログに沿った JSON 仕様を書き、各アダプタが Slack の Block Kit や Teams の Adaptive Cards など**プラットフォームネイティブ形式**で投稿します。

## 背景

チャット上に表・チャート・ボタンを出すたびに、メッセージ形状ごとのツールを用意・保守するのはコストが高いです。json-render はカタログでコンポーネントを定義し、モデルにはそのプロンプトを渡すだけで仕様を書かせる、という分離を取ります。

## 何が起きたか

公式が示す最小の bot 実装は次の通りです。

```typescript
import { defineCatalog } from "@json-render/core";
import {
  schema,
  standardComponentDefinitions,
  streamCard,
} from "@json-render/chat";
import { streamText } from "ai";

const catalog = defineCatalog(schema, {
  components: standardComponentDefinitions,
});

bot.onNewMention(async (thread, message) => {
  const result = streamText({
    model: "anthropic/claude-haiku-5.5",
    system: catalog.prompt(),
    prompt: message.text,
  });
  await streamCard(thread, result.textStream);
});
```

挙動の要点は次の通りです。

- **`streamCard`**: ルート要素に中身が乗った時点で一度投稿し、要素が増えるたびにメッセージを更新。既定では **最大 500ms に1回**（Chat SDK のストリーム間隔に合わせる）。ストリーム終了後は検証済みの最終カードを表示
- **`toCard`**: 各要素の props をスキーマ検証し、不正なら `CardSpecError`。問題は読み取り可能な issue としてモデルへ差し戻せる
- **プラットフォーム上限**: 上限超過時はアダプタが内容を劣化させる。例として Slack アダプタは**2つ目の表をコードブロックに落とす**。拒否したい場合は `limits` オプションを渡す

カタログにはテーブル、チャート、ボタンなどが含まれ、メッセージ形状ごとの個別ツールをメンテしなくてよい、と説明されています。ドキュメントと playground への導線もあります。

## なぜ重要か

（編集部の視点）社内 bot やサポート bot をフロント／フルスタックが持つチームにとって、**「LLM のテキスト」ではなく「検証されたカード UI」をストリームする**経路が公式になったのが大きいです。Slack／Teams のネイティブ部品に載るので、別途 Block Kit ビルダーをメンテする必要が減ります。一方で、モデルが出した仕様の検証失敗や、2つ目の表がコードブロックになるような劣化はプロダクト要件に直結します。`limits` で落とすか、劣化を許容して再プロンプトするかは、公開前に決めておくべきです。

## 参考リンク

- [Vercel Changelog: Chat SDK agents can now stream generative UI with json-render](https://vercel.com/changelog/json-render-and-chat-sdk-agents)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
