# 週刊テックダイジェスト（tech-digest）

フロントエンドエンジニア向けのテックニュースを、**1トピック1記事**の画像付き長文記事として読む静的サイトです。週刊号は毎週土曜 09:05 JST、号外は大ニュースのある日の 18:09 JST に発行します。

- 本番（公開）: https://tech-digest-psi.vercel.app
- ソース: https://github.com/katsuji3197/tech-digest （public, main）
- Vercel プロジェクト: `tech-digest`（`prj_g5oNakmlMlC0dCz6KXnkIsUPQTSO`）。GitHub と連携済みで、**main への push で本番へ自動デプロイされる**（`buildCommand` は `npm run build`、`outputDirectory` は `dist`）。公開手順の詳細は **publish.md** を参照。
- 保護: `tech-digest-katsujis-projects.vercel.app` とデプロイ固有 URL は Vercel ログインが必要。
- **Web Analytics（閲覧数計測）**: 公式スニペット（`window.va` ＋ `/_vercel/insights/script.js`）は `scripts/build.mjs` の `layout()` 内 `</head>` 直前にある。**消さずに残すこと**。計測を有効にするには Vercel ダッシュボード（プロジェクト `tech-digest` → Analytics タブ → Enable）で有効化が必要。

## 構成

```
/workspace/tech-digest/
├── build.sh                 # ビルド（marked + sharp。node_modules が無ければ自動で install）
├── publish.md               # 公開手順（エージェント向け）← 公開時はこれに従う
├── README.md
├── templates/               # index.md（号のハブ）/ article.md（記事）の雛形
├── scripts/build.mjs        # posts → dist の変換と検証用 URL 一覧の生成
├── scripts/yt-thumb.sh      # YouTube の実在確認（oEmbed）とサムネイル保存
├── assets/styles.css        # デザイン（ライト/ダーク自動、レスポンシブ、長文向けタイポグラフィ）
├── posts/<issue>/index.md   # 号のハブ（type: weekly | extra）
├── posts/<issue>/<slug>.md  # トピック記事
├── public/images/<issue>/   # その号の画像
├── dist/                    # ビルド成果物（Vercel の outputDirectory。Git 管理外）
├── deploy/                  # urls.txt など（ビルドで再生成。Git 管理外）
└── deploy-log.txt           # デプロイ履歴
```

`<issue>` は週刊なら `YYYY-MM-DD`、号外なら `YYYY-MM-DD-extra-<slug>`。URL はハブが `/posts/<issue>/`、記事が `/posts/<issue>/<slug>/`。

## ページ

- **トップ**: 号を新しい順にカード表示（カバー画像、週刊/号外バッジ、要約、記事タイトル一覧）。すべて／週刊／号外のタブは CSS だけで動く。
- **号のハブ**: イントロ文と記事カード（カバー、No.、タイトル、ティーザー）。先頭の記事は大きく表示する。
- **記事**: パンくず、バッジと日付、読了時間の目安、リード、キャプション付きのヒーロー画像、本文（背景／何が起きたか／なぜ重要か／反応・論点／参考リンク／関連動画）、前後の記事へのリンク、その号の目次。
- 外部リンクは新しいタブで開く。単独の段落に置いた画像は `<figure>` になり、title がキャプションになる。YouTube は再生ボタン付きのサムネイルで表示する。

## 使い方（概要）

1. `posts/<issue>/` にハブと記事、`public/images/<issue>/` に画像を置く
2. `npm run build`（または `./build.sh`）。png/jpg は WebP も生成し、HTML の `<img>` に width/height を付ける。`og:image` は元形式のまま。
3. 変更をコミットして `origin/main` に push する（トークンは環境変数 `TECH_DIGEST_GH_TOKEN` を `http.extraheader` 経由でのみ使う。リモート URL やリポジトリには埋め込まない）
4. Vercel の本番デプロイが `READY` になるのを待ち、記事・ハブ・トップ、画像（WebP と元画像）、`deploy/urls.txt` の全 URL が `https://tech-digest-psi.vercel.app` で 200 を返すことを確認する

詳細は publish.md を参照。本番が壊れた場合は、直前の READY デプロイに alias を戻す（publish.md の「障害時」を参照）。
