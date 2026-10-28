---
title: Apple 初のタッチ対応 Mac、PROLED XDR 搭載 MacBook Pro が登場――「ホバー前提の UI」は Mac でも通用しなくなる
date: 2026-10-28
order: 1
teaser: タンデム OLED の PROLED XDR ディスプレイ、画面へのタッチ操作、Dynamic Island を備えた14/16インチ MacBook Pro が11月6日に発売されます。日本では499,800円（税込）から。Web フロントエンドにとっては、ホバーや小さいクリック領域に頼った UI を見直す合図です。
cover: /images/2026-10-29-extra-touch-mac/mbp-touch-hero.jpg
cover_caption: 画面上の Logic Pro の鍵盤を指で弾く新しい MacBook Pro（画像: [Apple Newsroom](https://www.apple.com/newsroom/2026/10/apple-unveils-groundbreaking-macbook-pro-with-proled-xdr-display/)）
---

Apple は米国時間10月28日（日本時間29日）、ロサンゼルスでのイベントで **PROLED XDR ディスプレイ搭載 MacBook Pro** を発表しました。14インチと16インチの2モデルで、チップは M5 Pro または M5 Max。そして **Mac として初めて、画面へのタッチ操作に対応**しています。米国では14インチが2,899ドル、16インチが3,399ドルから。日本では10月29日（木）に予約が始まり、**11月6日（金）に発売**されます。

## 背景

Apple は長いあいだ、Mac にタッチスクリーンを載せることに慎重でした。マイナビニュース（Infoseek ニュース経由）によると、画面に手を伸ばす負担や、指とマウスの操作を両立させる難しさを理由に挙げてきたといいます。今回は John Ternus CEO が米 WIRED に対し、OLED の採用で厚さや重さを増やさずにタッチを加えられる条件が整ったと説明したと伝えられています。なお、液晶（ミニ LED）の従来型 MacBook Pro も引き続き販売され、こちらはタッチに対応しません。

## 何が起きたか

- **ディスプレイ**: 2層の自発光層を持つタンデム OLED。ピーク輝度は HDR・SDR とも最大2,000ニト、コントラスト比は10,000,000:1、ProMotion で10〜120Hz の可変リフレッシュレート。P3 と Adobe RGB の両方をカバーします。画面は14.2インチと16.3インチ、254ppi（Apple の技術資料）。
- **タッチ**: タッチセンサーはパネルに直接組み込まれ、遅延を減らしたとしています。スワイプでのスクロール、ピンチでのズーム、ダブルタップでのウインドウ拡大などに対応。Apple は「**macOS がタッチを自動的にクリックに変換する**ので、多くの既存アプリはそのままタッチで動く」と説明し、タッチ向けの体験を作るためのジェスチャー API も更新しました。
- **Dynamic Island**: 画面上部の Dynamic Island が Spotlight、ライブアクティビティ、Siri AI の置き場所になります（Spotlight は Siri AI を有効にした場合）。

![Mac の Dynamic Island に表示された音楽の再生コントロール](/images/2026-10-29-extra-touch-mac/mbp-touch-2.jpg "Mac に来た Dynamic Island。ライブアクティビティで再生中の曲を操作できる（画像: [Apple Newsroom](https://www.apple.com/newsroom/2026/10/apple-unveils-groundbreaking-macbook-pro-with-proled-xdr-display/)）")

- **本体**: 最大128GB のユニファイドメモリ、最大16TB のストレージ、Thunderbolt 5 を3基。重さは14インチが1.38kg、16インチが1.82kg（日本版プレスリリース）。バッテリーは最大24時間。macOS 27 を搭載します。
- **日本での価格（税込）**: M5 Pro の14インチが **499,800円**、16インチが **599,800円** から。M5 Max は14インチ769,800円、16インチ829,800円からです（Apple 日本のプレスリリース）。

## なぜ重要か

（編集部の視点）これまで「Mac の Safari ＝ マウスかトラックパッド」と考えて、ホバーで開くメニューや、ホバーしないと出ないボタン、20px 前後の小さいアイコンボタンを作ってきたサイトは少なくありません。Apple の説明どおりタッチがクリックとして届くなら、**ホバーでしか出ない操作には指でたどり着けない**おそれがあります。CNBC によると、macOS 自身もウインドウ左上の赤いボタンを指で触れると大きくするなど、タッチ用にターゲットを広げる工夫をしています。

見直したいのは次のような点です（編集部の視点）。

- 入力の種類ごとの分岐は `mousedown` / `touchstart` の二重実装ではなく、**Pointer Events**（`pointerdown` と `event.pointerType`）にまとめる。
- CSS のメディアクエリは仕様上、`hover` / `pointer` が「主な入力」、`any-hover` / `any-pointer` が「使える入力のどれか」を表します。トラックパッドとタッチの両方があるノート PC では、`(pointer: coarse)` だけで判定すると取りこぼす可能性があり、タップ領域を広げる判定には `(any-pointer: coarse)` を使うのが定石です。
- ホバーで出す情報は、フォーカスやタップでも出せるようにする。

ただし、**このタッチ対応 Mac の Safari が `hover`・`pointer`・`any-pointer` をどう報告するかは、Apple や WebKit の公式情報では確認できませんでした**（10月29日時点。WebKit ブログの Safari 27.1／27.2 の記事にも記載なし）。発売後に実機で検証する必要があります。

## 反応・論点

- CNBC の Kif Leswing 記者は実機を短時間試し、**タッチは「完全に任意」**で、従来どおりトラックパッドとキーボードだけで使えると伝えています。指紋については、Apple が撥油コーティングを施したと説明し、記者自身も「使ってみて画面の跡に気づかなかった」と書いています。
- AppleInsider は、タップをクリックに変換するだけでは「指で操作しやすい UI になるわけではない」と指摘し、サードパーティ製アプリでどこまで一貫した体験になるかはまだ分からないとしています。

## 参考リンク

- [Apple Newsroom: Apple unveils groundbreaking MacBook Pro with PROLED XDR Display and Touch for the first time on Mac](https://www.apple.com/newsroom/2026/10/apple-unveils-groundbreaking-macbook-pro-with-proled-xdr-display/)
- [Apple（日本）: Apple、PROLED XDRディスプレイを搭載し、Macで初めてタッチ操作に対応した画期的なMacBook Proを発表](https://www.apple.com/jp/newsroom/2026/10/apple-unveils-groundbreaking-macbook-pro-with-proled-xdr-display/)
- [Apple: PROLED XDR Display Technology Overview（PDF）](https://www.apple.com/macbook-pro/proled-xdr-display/pdf/PROLED_XDR_Display_Technical_Paper.pdf)
- [CNBC: Hands-on with Apple's first touchscreen laptop: Touch is totally optional](https://www.cnbc.com/2026/10/28/apple-touchscreen-macbook-pro-hands-on.html)
- [AppleInsider: How macOS is changing on touchscreens beyond Sidecar, but only a bit](https://appleinsider.com/articles/26/10/28/how-macos-is-changing-on-touchscreens-beyond-sidecar-but-only-a-bit)
- [Infoseek ニュース（マイナビニュース）: Apple、タッチ対応MacBook Proを発表　PROLED XDR採用、薄型軽量化と両立](https://news.infoseek.co.jp/article/mynavi_3241397/)
- [MDN: pointer – CSS メディア特性](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer)

## 関連動画

[![YouTube: New MacBook Pro with PROLED XDR Display: The first-ever Mac with Touch（Apple）](/images/2026-10-29-extra-touch-mac/yt-hnZI5uUSdEo.jpg "New MacBook Pro with PROLED XDR Display: The first-ever Mac with Touch — Apple（YouTube, 2026年10月）")](https://www.youtube.com/watch?v=hnZI5uUSdEo)
