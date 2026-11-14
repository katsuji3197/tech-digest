---
title: Vercel「UI SDK」――フォーカス・選択・ポップアップなど50超の「振る舞い」を、エージェントが組み立てて使う UI ライブラリ
date: 2026-11-12
order: 3
teaser: Vercel が、キーボード操作や ARIA を含む UI の振る舞いをまとめた TypeScript ライブラリ UI SDK をベータ公開しました。React・Vue・Svelte・Solid・Web Components に対応し、作った UI はエージェントからも操作できます。
cover: /images/2026-11-14/vercel-ui-sdk-hero.png
cover_caption: 「Introducing UI SDK」の OG 画像。Select を createPopup・createSelection・createTypeahead の組み合わせとして図示している（画像: [UI SDK](https://ui-sdk.dev/docs/core/changelog/introducing-ui-sdk)）
---

Vercel は11月12日（米国時間）、**UI SDK** を公開しました。キーボードナビゲーション、フォーカス、選択、ポップアップ、ドラッグ＆ドロップと、それらに必要な ARIA 属性をまとめた TypeScript の「振る舞い（behavior）」ライブラリです。ベータ版で、リポジトリは `vercel-labs/ui` です。

## それが何か

公式の紹介記事は、UI SDK を「コンポーネントライブラリを構成する層」と位置づけています。たとえば `createRovingFocus` は矢印キーでフォーカスを移し、`createTypeahead` は入力に合わせて選択肢を探し、`createPopup` はボタンの隣にポップアップを開きます。こうした振る舞いを50以上用意し、人やエージェントが組み合わせて独自のコンポーネントを作る、という設計です。同じ振る舞いで作った50超の既製コンポーネント（Select から Date Picker まで）も、5つのフレームワーク向けに同じパーツ構成で提供されます。スタイルは付いていません。

## 何ができるか

- **コンポーネントを組む**: `@ui-sdk/core` の `definePrimitive` と `createPopup` でポップオーバーを定義し、`@ui-sdk/react/primitive` の `createParts` で React コンポーネントにできます。
- **エージェントに操作させる**: `createAgent` に許可条件（どのコンポーネントのどの操作か）を渡すと、エージェントが `snapshot()` で画面を読み、`act()` で値を設定できます。
- **WebMCP**: `registerTools` を呼ぶと、ブラウザ内蔵のエージェントがコンポーネントを読み取り、操作を呼び出せます。

## なぜ話題か

Vercel の告知投稿は、X で約65万回表示され、5,700件超の「いいね」を集めました。shadcn 氏は、エージェントにアクセシビリティを正しく扱わせることを重視して振る舞いを設計した、という趣旨を投稿しています。既存の UI キットを UI SDK に載せ替える開発者も出ています。同じページを UI SDK の有無で作り比べ、エージェントの所要時間やツール呼び出し回数が減ったとする個人の検証も共有されました。

## 使い方

README の手順です（React の場合）。

```bash
npm install @ui-sdk/react @ui-sdk/core
```

ほかのフレームワークでは、`@ui-sdk/react` を `@ui-sdk/vue`、`@ui-sdk/svelte`、`@ui-sdk/solid`、`@ui-sdk/web` に替えます。エージェントにスキルを入れる場合は次のコマンドです。

```bash
npx skills add vercel-labs/ui --skill ui-sdk
```

既製コンポーネントの最小例（公式記事）を示します。

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"

function Example() {
  return (
    <Select placeholder="Select a role">
      <SelectLabel>Role</SelectLabel>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## 料金・ライセンス

GitHub リポジトリのライセンスは **Apache-2.0** です。ベータ期間中は Vercel のベータ規約が適用され、フレームワーク、API、ドキュメント、挙動は正式版までに変わる可能性があると明記されています。

## 注意点・制限

- React 版は **React 19 / React DOM 19 以上**が必要です。TypeScript では `@types/react` 19.2.10 以上も要ります。
- `@ui-sdk/react` にはルートからの import がなく、`@ui-sdk/react/button` のようにパスを指定して読み込みます。
- コンポーネントはスタイルなしです。既定の見た目が欲しければ `@ui-sdk/core/web.css` を読み込みます。
- 11月13日にはモーダルの多重表示などを直すベータ2が出ており、更新の頻度は高めです。

## 類似との違い

公式は Radix、Base UI、React Aria、shadcn/ui などに謝辞を寄せています。（編集部の視点）これらとの大きな違いは2点です。1つは、振る舞いを**フレームワーク非依存のコア**に集め、5つのアダプターで共有していること。もう1つは、**エージェントが作った UI をエージェントが操作する**ための `createAgent` や WebMCP 連携を最初から持っていることです。既存の shadcn/ui をすぐ置き換えるものではありません。社内管理画面のように、エージェントに操作させたい UI から試すのが現実的です。

## 参考リンク

- [UI SDK: Introducing UI SDK](https://ui-sdk.dev/docs/core/changelog/introducing-ui-sdk)
- [UI SDK: Installation（React）](https://ui-sdk.dev/docs/react/installation)
- [GitHub: vercel-labs/ui](https://github.com/vercel-labs/ui)
- [GitHub: vercel-labs/ui Releases](https://github.com/vercel-labs/ui/releases)
- [X: Vercel「Introducing the UI SDK.」](https://x.com/vercel/status/2120950020249895314)
- [X: shadcn のアクセシビリティに関する投稿](https://x.com/shadcn/status/2121210951961641451)

**動画:** 確認できた関連動画はありません（動画なし）。
