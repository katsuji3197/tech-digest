---
title: X で話題の無料フォント「Allo」――Inter を下敷きに角の丸さを 0〜100 で変えられる UI 向け可変フォント、npm 一発で導入
date: 2026-11-16
order: 4
teaser: デザイナーの Josh Puckett 氏が公開した可変フォント Allo が、X で約57万回表示・ブックマーク9,000件超と大きな反響を呼びました。Inter の骨格に「丸さ」の軸を足した UI 向けの書体で、SIL OFL のもと商用でも無料で使えます。
cover: /images/2026-11-21/allo-hero.png
cover_caption: Allo 公式サイトの OG 画像。ウェイト・丸さ・オブリーク・約物などの特徴をステッカー風に並べている（画像: [Allo](https://allo.joshpuckett.me/)）
---

デザイナーの Josh Puckett 氏は11月16日（日本時間16日23時ごろ）、X で可変フォント **Allo** を発表しました。「親しみやすい近所の書体」をうたう UI 向けのサンセリフで、ウェイトに加えて**角の丸さ**を連続的に変えられます。無料のオープンソースで、Web には npm から入れられます。

## Allo とは

公式サイトによると、Allo は画面とインターフェースに最適化した書体です。Rasmus Andersson 氏の **Inter** を出発点に、全グリフを描き直し、字間・カーニング・機能・軸を作り込んでいます（README は Inter 4.2、公式サイトは 4.1 からと記載）。Seb McLauchlan 氏の Honk Sans へのオマージュも込めたと README にあります。Puckett 氏は、数か月前の小さな実験から始まったと投稿しています。

## 何ができるか

- **3つの可変軸**: README の表では、オプティカルサイズ `opsz` が 9〜32（既定14）、ウェイト `wght` が 100〜900、丸さ `ROND` が 0〜100（既定50）です。オプティカルサイズは文字サイズに合わせて自動で切り替わります。
- **オブリーク**: 全ウェイトに、別に描いたオブリーク（斜体）があります。
- **UI 向けの OpenType 機能**: 等幅数字 `tnum`、I・l・1・0 を区別しやすくする `ss02`、分数 `frac`、`->` と打つと矢印になる `calt` などを備えます。

![Allo の文字セットの見本](/images/2026-11-21/allo-2.png "README の見本画像。右側は「697 characters, 734 glyphs」「Latin, figures, punctuation & symbols」とあり、収録はラテン文字・数字・約物・記号（画像: [GitHub: joshpuckett/allo](https://github.com/joshpuckett/allo)）")

## なぜ話題か

発表投稿は、21日朝の時点で約57万回表示され、「いいね」は9,300件超、ブックマークは9,300件を超えました。ブックマークが「いいね」と同じくらい多く、後で使うために保存した人が多いことがうかがえます。GitHub リポジトリのスターは約1,250です。FontAlternatives によると、公開から3日で4つの版が出ました。1.0.1 ではベトナム語の文字が加わり、Puckett 氏は公開後も字形の修正を続けると投稿しています。

## 使い方

README にある Web での導入手順です。

```sh
npm install allo-font
```

```js
import "allo-font";            // the full variable font, and the obliques
// import "allo-font/friendly"; // or: roundness fixed at 50, about half the size
```

```css
body {
  font-family: "Allo", system-ui, sans-serif;
}
```

丸さには CSS のプロパティがないため、README のとおり `font-variation-settings: "ROND" 0`（角ばった形）から `"ROND" 100`（丸い形）の範囲で指定します。既定は50です。オプティカルサイズは CSS の既定 `font-optical-sizing: auto` で文字サイズに追従し、固定したい場合は `font-variation-settings: "opsz" 32` のように指定します。

自前でホストする場合は、配布 zip の `fonts/webfonts` にある `AlloVariable.woff2` を `@font-face` で読み込みます。

## 料金・ライセンス

**SIL Open Font License 1.1** で、商用を含めて無料で使用・改変・再配布できます。フォント単体での販売はできません。

## 注意点・制限

- **日本語は含みません**。収録はラテン文字中心で、FontAlternatives によるとキリル文字とギリシャ文字もありません。日本語サイトでは和文フォントと組み合わせる前提です（編集部の視点）。
- `AlloVariableFriendly.woff2` は約半分のサイズですが、丸さが50で固定され `ROND` が効きません。
- npm パッケージは Web 用の WOFF2 とスタイルシートだけです。デスクトップ用の OTF などは zip から入手します。
- 11月18日時点で Google Fonts にはありません（FontAlternatives）。
- README によると、`letter-spacing` を指定するとブラウザは合字を切ります。コードには `font-variant-ligatures: no-contextual` を勧めています。
- 字形を変えるプルリクエストは今のところ受け付けていません。

## 類似との違い

元になった Inter には丸さの軸がなく、収録文字は Inter の方がずっと多い（Inter の可変版は2,937グリフ、Allo 1.0.1 は734グリフ）と FontAlternatives は比較しています。Google Fonts の丸ゴシック系である Nunito や Quicksand はすぐ読み込めますが、Inter 由来ではありません。（編集部の視点）Inter を使っている UI に、ボタンやバッジだけ丸みを足したいときに、骨格をそろえたまま切り替えられるのが Allo の強みです。

## 参考リンク

- [Allo: Allo, your friendly neighborhood font](https://allo.joshpuckett.me/)
- [GitHub: joshpuckett/allo](https://github.com/joshpuckett/allo)
- [X: Josh Puckett「Meet Allo! 👋」](https://x.com/joshpuckett/status/2122329345670988258)
- [X: Josh Puckett「Allo 1.0.1 is out」](https://x.com/joshpuckett/status/2122721677201305804)
- [FontAlternatives Blog: Allo Font: Free Rounded Inter (OFL)](https://fontalternatives.com/blog/allo-font/)
- [Beautiful Web Type: Allo](https://www.beautifulwebtype.com/allo/)

**動画:** 確認できた関連動画はありません（動画なし）。
