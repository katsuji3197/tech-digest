# publish.md — 週刊テックダイジェスト 公開手順（エージェント向け）

サイト: **https://tech-digest-psi.vercel.app**（公開・ログイン不要）
作業場所: 共有ボックスの `/workspace/tech-digest/`
デプロイ: Vercel CLI は使わない。**Vercel MCP（namespace `user-Vercel`）の `upload_file` → `create_deployment`** で行う。トークンや CLI ログインは不要で、使ってもいけない。

- Vercel プロジェクト: `tech-digest`（id `prj_g5oNakmlMlC0dCz6KXnkIsUPQTSO`）
- **`teamId` は渡さない。** デフォルトスコープ（team_iAxWmUeyQkwcOX6KRWxcWNya / katsujis-projects）が使われる。`teamId` を明示すると 403 になる。
- 別名 `tech-digest-katsujis-projects.vercel.app` とデプロイ固有 URL は Vercel Authentication で保護されている（302）。保護設定は変更しないこと。
- **Web Analytics（閲覧数計測）**: 公式スニペット（`window.va` ＋ `/_vercel/insights/script.js`）は `scripts/build.mjs` の `layout()` 内 `</head>` 直前にある。**消さずに残すこと**。計測を有効にするには Vercel ダッシュボード（プロジェクト `tech-digest` → Analytics タブ → Enable）で有効化が必要。

---

## 0. 構成：号（ハブ）＋ トピック記事

1つの号（週刊または号外）は1つのフォルダで、中身は「ハブ」1ファイルと「記事」複数ファイル。

```
posts/<issue>/index.md        ← 号のハブ（イントロ＋記事カードは自動生成）
posts/<issue>/<slug>.md       ← トピック記事 1本 = 1ファイル（週刊は4〜5本、号外は1〜3本）
public/images/<issue>/...     ← その号の画像（全記事共通フォルダ）
```

| 種類 | `<issue>` フォルダ名 | ハブ `type` | 発行タイミング |
|---|---|---|---|
| 週刊 | `YYYY-MM-DD`（発行日） | `weekly` | 毎週土曜 09:05 JST |
| 号外 | `YYYY-MM-DD-extra-<slug>`（slug は `[a-z0-9-]`） | `extra` | 大ニュースのある日の 18:09 JST |

- URL: ハブ `/posts/<issue>/`、記事 `/posts/<issue>/<slug>/`。記事の slug は英小文字・数字・ハイフンのみ（例 `gcp-london-outage`）。
- トップページは号を新しい順にカードで並べ、各カードに記事タイトル一覧が付く。「週刊」(青) と「号外」(赤) のバッジと、すべて／週刊／号外のタブがある。
- 雛形: `templates/index.md`（ハブ）と `templates/article.md`（記事）。

### ハブ `posts/<issue>/index.md`

```markdown
---
title: 週刊テックダイジェスト 2026年10月24日号      # 号外例: 【号外】OpenAI が○○を発表
date: 2026-10-24
type: weekly                                       # 号外は extra
summary: 一覧カード用の1〜2文の要約
---

イントロ 1〜3文（記事一覧は書かない。自動生成される）
```

### 記事 `posts/<issue>/<slug>.md`

frontmatter の必須項目は `title`, `date`（ニュースの日付）, `teaser`, `cover`。任意項目は `order`（表示順。1から）, `cover_caption`, `draft: true`。

本文は自然な日本語で、目安は **800〜1500字**（参考リンクを除く）。次の構成にする。

1. **リード段落**（見出しなし）
2. `## 背景`
3. `## 何が起きたか`（数字・バージョン・日付・固有名詞など、出典にある具体的な情報）
4. `## なぜ重要か`（フロントエンド寄りのテックリードの視点。推測・意見には「（編集部の視点）」と付ける）
5. `## 反応・論点`（公式声明・識者コメント・報道の論調など、**出典のある反応がある場合のみ**。無ければ節ごと省く）
6. `## 参考リンク`（箇条書き。各リンクは「媒体名: 記事タイトル」）
7. `## 関連動画`（実在を確認した YouTube 動画があれば）。無ければ `**動画:** 確認できた関連動画はありません（動画なし）。`

厳守事項:

- 事実・数字・引用・反応・URL・動画はすべて出典から取る。捏造しない。引用は原文を訳すか「〜という趣旨」と書き、出典を明記する。
- 時刻は日本時間（JST）を併記する。
- 画像は、本文の段落に `![alt](/images/<issue>/file.jpg "キャプション（画像: [出典名](URL)）")` を単独で置くと、キャプション付きの `<figure>` になる。ヒーロー画像は `cover` と `cover_caption` で指定する。
- YouTube は `[![YouTube: タイトル（チャンネル）](/images/<issue>/yt-<ID>.jpg "タイトル — チャンネル（YouTube, 公開日）")](https://www.youtube.com/watch?v=<ID>)` を単独の段落に置くと、再生ボタン付きのサムネイルになる。
- `**太字**` は日本語の句読点の隣でも使える（ビルド時に `<strong>` へ変換される）。

---

## 1. 取材と画像の用意

```bash
cd /workspace/tech-digest
ISSUE=2026-10-24                       # 号外なら ISSUE=2026-10-24-extra-<slug>
mkdir -p posts/$ISSUE public/images/$ISSUE
cp templates/index.md posts/$ISSUE/index.md
cp templates/article.md posts/$ISSUE/<slug>.md      # 記事ごと

# og:image を探す
curl -sL -A "Mozilla/5.0" "<記事URL>" | grep -oiE '<meta[^>]+og:image"[^>]*>'
# 記事内の画像を探す（WordPress 系の例）
curl -sL -A "Mozilla/5.0" "<記事URL>" | grep -oE '<img[^>]+src="[^"]+"' | head
# 保存（ファイル名は <slug>-hero.jpg, <slug>-2.png など）
curl -sL -A "Mozilla/5.0" "<画像URL>" -o public/images/$ISSUE/<slug>-hero.jpg

# YouTube：oEmbed で実在を確認してからサムネイルを保存（存在しなければ exit 1）
scripts/yt-thumb.sh $ISSUE "https://www.youtube.com/watch?v=XXXXXXXXXXX"

# 大きい画像は縮小（長辺1400px以下、1枚 ~300KB 目安）
python3 - <<'PY'
from PIL import Image; import os, glob
for f in glob.glob('public/images/'+os.environ.get('ISSUE','')+'/*'):
    im=Image.open(f)
    if os.path.getsize(f)>300_000 or max(im.size)>1600:
        im=im.convert('RGB') if f.endswith(('.jpg','.jpeg')) else im
        im.thumbnail((1400,1400)); im.save(f, quality=80, optimize=True); print('resized', f)
PY
```

（python のヒアドキュメントの前に `export ISSUE` しておくこと）

1記事あたりヒーロー画像1枚は必須。追加の画像（記事内の図・写真）があれば1〜2枚入れる。画像を保存したら Read で中身を目視確認し、キャプションが画像の内容と合っているか確かめる。

## 2. ビルド

```bash
cd /workspace/tech-digest && ./build.sh
```

- 出力されるもの: `dist/`（静的サイト一式）、`deploy/manifest.json`（create_deployment の `files` 配列）、`deploy/uploads.json`（アップロード対象）、`deploy/b64/<sha>.b64`、`deploy/urls.txt`（検証用の URL 一覧）。
- ログには記事ごとの字数が出る。`⚠ 画像が見つかりません` や `⚠ 本文が短め` が出たら直してから再ビルドする。
- ローカル確認（任意）:
  ```bash
  (cd dist && python3 -m http.server 8765 >/dev/null 2>&1 &)
  google-chrome --headless=new --no-sandbox --hide-scrollbars --window-size=1200,1500 --screenshot=/tmp/hub.png http://localhost:8765/posts/$ISSUE/
  ```
  撮ったスクリーンショットを Read で確認する。

## 3. アップロード（user-Vercel `upload_file`）

`deploy/uploads.json` の**全エントリ**について1回ずつ呼ぶ（並列で可）。

```json
CallDynamicTool namespace=user-Vercel toolName=upload_file
arguments: {
  "contentLength": <size>,
  "xVercelDigest": "<sha>",
  "requestBody": "$file:/workspace/tech-digest/deploy/b64/<sha>.b64"
}
```

- `teamId` は付けない。
- `requestBody` には `"$file:<絶対パス>"` という文字列だけを渡す。これで b64 ファイルの中身が送信される。base64 を会話に貼らないこと。
- 一覧の出し方: `python3 -c "import json;[print(f['sha'],f['size'],f['b64']) for f in json.load(open('deploy/uploads.json'))]"`
- 既にアップロード済みのファイルを再送しても問題はない。

## 4. 本番デプロイ（user-Vercel `create_deployment`）

```json
CallDynamicTool namespace=user-Vercel toolName=create_deployment
arguments: {
  "skipAutoDetectionConfirmation": "1",
  "requestBody": {
    "name": "tech-digest",
    "project": "tech-digest",
    "target": "production",
    "projectSettings": { "framework": null, "buildCommand": "", "installCommand": "", "outputDirectory": "." },
    "files": <deploy/manifest.json の配列をそのまま貼る>
  }
}
```

- `missing_files` エラーが返ったら、列挙された sha を手順3で再アップロードしてから再実行する。
- 返ってきた `dpl_...` を `deploy-log.txt` に追記する（例: `echo "dpl_xxx $ISSUE $(date '+%F %T JST')" >> deploy-log.txt`）。

## 5. 待機と検証

1. `get_deployment`（`idOrUrl` に `dpl_...`）を数秒おきに呼び、`readyState` が `READY` になるまで待つ。`ERROR` なら `list_deployment_events` でログを確認する。
2. 公開 URL の全ページと全画像が 200 を返すか確認する。
   ```bash
   B=https://tech-digest-psi.vercel.app
   while read p; do printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "$B$p")" "$p"; done < deploy/urls.txt | sort | uniq -c -w3
   while read p; do c=$(curl -s -o /dev/null -w '%{http_code}' "$B$p"); [ "$c" = 200 ] || echo "NG $c $p"; done < deploy/urls.txt
   curl -s $B/ | grep -o '<h2>[^<]*'          # 先頭に新しい号があること
   ```
   401 や 302 が返る場合（保護設定が変わった等）は、MCP の `web_fetch_vercel_url` で確認し、その旨を報告する。
3. 報告に含めるもの: ハブ URL、各記事 URL、トピック一覧、デプロイ ID、問題点。

---

## 号外（extra）の差分

- 毎日 18:09 JST のルーティンで、**大きなニュースがあるときだけ**作る。無い日は何もしない（デプロイもしない）。
- フォルダは `posts/YYYY-MM-DD-extra-<slug>/`。ハブの `type: extra`、タイトルは例えば `【号外】…`。記事は1〜3本（例: 本記事1本＋解説・影響まとめ）。
- 画像は `public/images/YYYY-MM-DD-extra-<slug>/` に置き、`scripts/yt-thumb.sh YYYY-MM-DD-extra-<slug> <URL>` を使う。
- 同じ日に複数の号外を出すときは、ハブの frontmatter に `time: HH:MM`（JST）を入れる。同日の号は time の新しい順に並ぶ（time なしは最後）。
- 手順2〜5は週刊とまったく同じ。トップでは赤い「号外」バッジ付きで日付の新しい順に並び、「号外」タブで絞り込める。
