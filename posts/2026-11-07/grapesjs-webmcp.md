---
title: GrapesJS WebMCP――ビジュアルエディタを AI ブラウザエージェント向けの構造化ツールとして公開
date: 2026-11-03
order: 4
teaser: GrapesJS が WebMCP プラグインをオープンソースで公開しました。AI ブラウザエージェントがコンポーネントやスタイルを API 経由で発見・更新でき、UI を手探りするコストを減らせます。
cover: /images/2026-11-07/grapesjs-webmcp-hero.webp
cover_caption: GrapesJS WebMCP 発表ブログのヒーロー画像（画像: [GrapesJS Blog](https://grapesjs.com/blog/webmcp-ai-browser-agents)）
---

GrapesJS チームは11月3日、オープンソースのプラグイン **GrapesJS WebMCP**（`@grapesjs/webmcp`）を発表しました。WebMCP 対応の AI ブラウザエージェントに対し、エディタの能力を**説明付きの構造化ツール**として公開し、見出し変更のような単純作業でも「画面を探してパネルを開く」迂回を減らせる、というのが狙いです。

## それが何か

**WebMCP** は、Web アプリが JavaScript ツール（説明と入力スキーマ付き）をエージェントに発見・呼び出し可能にする仕組みです。ツールはページ内で動き、アプリ既存のロジックを使います。GrapesJS WebMCP は既存の GrapesJS 統合にプラグインを足すだけで、コンポーネント・スタイル・ブロック・ページ向けのツールカタログを登録します。人が同じプロジェクトをビジュアルエディタで見ながら、エージェントが API 経由で編集する共有ワークスペースになります。

## 何ができるか

公式が示す例では、「ヒーロー見出しを変え、ボタンリンクを `/signup` に」と頼むと、エージェントは概ね次の流れを取ります。

1. `grapesjs_get_editor_state` で状態確認
2. `grapesjs_get_components` で見出し・ボタンを特定
3. `grapesjs_update_components` で更新
4. 結果を再検査

カタログの対象はコンポーネント（ツリー検査・追加更新・移動・traits）、スタイル、ブロック、ページ／デバイス／アセット、エディタ状態と出力（コード取得・undo／redo）です。編集は公開 GrapesJS API 経由のため、通常のモデル・イベント・undo・ストレージ設定に乗ります。タグ名・テキスト・クラス・属性での検索もできます。

## なぜ話題か

ビジュアルエディタを「スクリーンショットとクリック」で操作させると、トークンと時間が UI 探索に溶けます。構造化ツールなら**編集そのものに寄せられる**、というメッセージが開発者向けに刺さっています。今週の X でも WebMCP／エージェント連携の文脈で言及が増えました。

## 使い方

公式ドキュメントの最小構成は次の通りです。

```bash
npm install grapesjs @grapesjs/webmcp
```

```js
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import webMcpPlugin from '@grapesjs/webmcp';

const editor = grapesjs.init({
  container: '#gjs',
  plugins: [webMcpPlugin],
});
```

読み取り専用だけ露出する例（公式）:

```js
grapesjs.init({
  container: '#gjs',
  plugins: [
    (editor) =>
      webMcpPlugin(editor, {
        getTools: ({ tools }) =>
          tools.filter((tool) => tool.annotations?.readOnlyHint),
      }),
  ],
});
```

`getTools` でフィルタ・ラップ・独自ツール追加が可能です。`instructions` オプションは `get_editor_guide` 経由で慣習を伝えられます。

## 料金・ライセンス

プラグインは**オープンソース**。npm の `@grapesjs/webmcp` と GitHub で公開され、貢献とフィードバックを募集しています。有料 SaaS 必須の記載はありません。

## 注意点

- WebMCP 自体が**実験的**で、ブラウザ／エージェント対応は限定的
- **HTTPS または localhost** が必要
- ツールは**トップレベルページ**に登録する（iframe 内登録は、トップレベルのみ探索するエージェントからは見えない）。GrapesJS のキャンバス iframe ではなく、エディタをホストするページ側の話
- WebMCP が使えない環境ではブラウザツールは登録されないが、`webMcpManager` コマンド経由のプログラム実行は残る

## 似たものとの違い

（編集部の視点）一般的なブラウザ操作エージェントが DOM をクリックするのに対し、これは**編集対象のドメインモデル（GrapesJS コンポーネント）を直接触る**点が違います。ページビルダーやメールエディタを GrapesJS で持つチームなら、エージェント用に別 UI を書く前に、既存 API を WebMCP で露出する選択肢になります。対応エージェントと HTTPS 要件は前提条件として残ります。

## 参考リンク

- [GrapesJS Blog: Introducing GrapesJS WebMCP](https://grapesjs.com/blog/webmcp-ai-browser-agents)
- [GitHub: GrapesJS webmcp package README](https://github.com/GrapesJS/grapesjs/blob/dev/packages/webmcp/README.md)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
