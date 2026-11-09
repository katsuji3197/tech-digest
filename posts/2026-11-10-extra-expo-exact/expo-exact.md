---
title: Expo「Exact」――UI を Contract で宣言し、Web は約20KBのランタイムで実 DOM、Apple は UIKit/AppKit で描く「エージェント前提」のフレームワーク
date: 2026-11-09
order: 1
teaser: Rust 製のランタイムと、エージェントが書きやすいよう設計された型付き宣言言語 Contract。仮想 DOM もハイドレーションもなし。MIT、pre-1.0 で日々変わる段階。
cover: /images/2026-11-10-extra-expo-exact/exact-hero.jpg
cover_caption: 同じアプリが iPhone、Android、macOS、Web で動く様子（発表動画のサムネイル。画像: [@ccheever の発表投稿](https://x.com/ccheever/status/2119764253242695754)）
---

Expo の共同創業者 Charlie Cheever 氏が日本時間2026年11月9日21時9分、X で新しいアプリフレームワーク **Exact** のプレビューを公開しました。「Agent Native なアプリフレームワークで、Rust で書かれている」という紹介で始まる39投稿のスレッドは、約20.9万回表示、約1,618いいね、約1,258ブックマークを集めています。リポジトリ [expo/exact](https://github.com/expo/exact) は MIT ライセンスで、本稿執筆時点で約740スターです。

## それは何か

Exact はクロスプラットフォームのアプリ実行環境です。画面は **Contract** という小さな宣言型言語で書き、データ処理は **TypeScript か Rust** で書きます。Contract のコンパイラが画面を「plan」に変換し、各ホストがそれを描画します。

- **Web**: 1つの ES モジュールと約20KB のランタイムが、ブラウザの実 DOM と CSS を直接操作する
- **macOS / iOS**: Rust のランナーが CSS のルールでレイアウトを計算し、AppKit / UIKit のネイティブ部品で描く
- **Linux**: GPU（vello）か CPU（tiny-skia）で自前で描画する

README には「UI に WebView も JavaScript ブリッジもなく、最初のピクセルが出るまでアプリの JavaScript は1行も走らない」とあります。

![Exact で作ったデモストア Softwear の Web 版](/images/2026-11-10-extra-expo-exact/exact-softwear-web.jpg "1つの app.contract から生成したデモストア「Softwear」の Web 版（画像: [expo/exact README](https://github.com/expo/exact)）")

## 何ができるか

- **エージェント用の10操作**: `tree · screenshot · tap · type · state · layout · logs · clock · prefer · perf` の10操作が、Web、macOS、iOS（実機も可）、Linux のどれでも同じように動きます。
- **時計をエージェントが握る**: アニメーションの終わりを待たずに `clock +60000` で時間を進めてから結果を読むので、タイミング依存の不安定なテストが起きにくくなります。
- **書くのは CSS**: レイアウトは CSS の block / flex / grid です。プロパティ名も `font-size` や `light-dark()` など CSS の綴りで、別名はコンパイラが拒否します。
- **速度の目安**: README によれば RealWorld（Conduit）ベンチマークでは、React の SSR 版がハイドレーションを終える約300ms前に動き出しました。コード量は React の81KBに対して26KBでした。

## なぜ今話題なのか

React Native の Expo 自身が、JSX も React も使わない道を示したからです。React コアチームの Andrew Clark 氏は引用投稿で、「とても良さそうだし、React 20 が向かっていると自分が考える形に不気味なほど似ている。Ryan Carniato 氏の ReactiveScript も似た方向に収束しつつある」という趣旨を述べました。X では、ストア、カレンダー、Excalidraw 風のエディタなどを Exact で作ってみた投稿も相次いでいます。

フロントエンドの目線では、「仮想 DOM もハイドレーションもない、コンパイル時に全部わかる UI」と「エージェントが自分で動かして検証できる」という2つの流れが1つのプロダクトにまとまった点が新しいと言えます（編集部の視点）。

## 使い方（README のクイックスタート）

README の手順は Apple Silicon の macOS で検証されています。Rust（rustup）、Bun 1.4.2、Google Chrome、Xcode が必要です。

```sh
git clone https://github.com/expo/exact.git
cd exact
bun scripts/exact.mjs setup
bun host/web/dev.mjs            # Caltrain, at http://127.0.0.1:8765/
```

自分のアプリを作るときは次のとおりです。

```sh
bun scripts/exact.mjs new ../hello
cd ../hello
bun exact.mjs web                           # the dev loop, at http://127.0.0.1:8765/
bun exact.mjs test web tests/*.test.contract
```

`exact new` で作られるのは `app.contract`（画面）、`app.ts`（データ）、`app.json`（マニフェスト）です。README に載っている ToDo アプリの Contract は次のとおりです（README のまま）。

```contract
// app.contract: the view, its state, and what each action changes. It names no colour,
// font or control size: each host draws its own heading, field, button, checkbox and list.
shape Todo
  id: string
  title: string
  done: bool

shape Change
  count: number

component Todos
  state draft = ""
  mutation changed as shape Change refreshes todos
  resource todos = todos() as shape Todo[]
  derive left = todos.filter(t => not t.done).length

  action edit(value: string)
    draft = value
  action add
    if draft.trim() != ""
      send changed = addTodo(draft.trim())
      draft = ""
  action toggle(id: string, done: bool)
    send changed = setDone(id, done)
  action remove(id: string)
    send changed = removeTodo(id)

  view
    list appearance="auto" height="100%"
      section
        header
          text `${left} left` role="heading" testId="count"
        row
          input value=draft input=edit submit=add placeholder="What needs doing?" aria-label="New todo" testId="new-todo" flex=1 min-width=0
          button press=add buttonStyle="filled" testId="add"
            text "Add"
      section
        for t in todos key=t.id
          row testId=`todo-${t.id}`
            input type="checkbox" checked=t.done change=toggle(t.id) aria-label=t.title testId=`toggle-${t.id}`
            text t.title flex=1
            button press=remove(t.id) destructive=true testId=`remove-${t.id}`
              text "Delete"
```

データ側の `app.ts`（`todos` や `addTodo` を返す関数）とテストファイル `app.test.contract` の例も README にあります。

## 料金・ライセンス

OSS（MIT ライセンス）で無料です。

## 注意点・制限

- README は「pre-1.0 で日々変わる。API の安定性、後方互換、移行ガイドは意図的にない」と明記しています。
- パッケージ化された CLI はまだなく、ソースのチェックアウトから使います。初回のネイティブビルドには10〜15分かかります。
- `app.ts` からは npm パッケージのコードを import できません（型だけなら可）。JSX や React の層もありません。
- Android は「初期段階」で、配布やストア向けのパッケージングはまだありません。Windows も未完成です。
- 本番投入について Cheever 氏は「確信を持てるまで2〜3か月」と返信しています（MODEL 誌の報道による）。スレッドにある速度比較は本人のデモで、第三者による検証はまだです。

## 似たものとの違い

React Native は JS ブリッジや JSI を通じて React のコンポーネントからネイティブ UI を動かします。Exact は UI を JavaScript から完全に切り離し、Contract で静的に解析できる範囲だけを書かせます。X のトレンドまとめでは、Expo の React Native ツール群を置き換えるものではなく並行するプロジェクトだと紹介されています。Flutter のように全部を自前で描くのでもなく、Apple では OS 標準の部品を、Web では実 DOM を使う点も違います。

## 公式リンク

- GitHub: [expo/exact](https://github.com/expo/exact)
- X: [Charlie Cheever 氏の発表スレッド](https://x.com/ccheever/status/2119764253242695754)
- X: [Andrew Clark 氏の引用投稿](https://x.com/acdlite/status/2119784287436415149)
- MODEL: [Expo previews Exact, an app framework built for coding agents](https://readmodelmag.com/stories/expo-exact)

## 関連動画

**動画:** 確認できた YouTube の関連動画はありません（動画なし）。発表スレッドの先頭投稿に35秒のデモ動画があります。
