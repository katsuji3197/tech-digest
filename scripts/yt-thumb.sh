#!/usr/bin/env bash
# Usage: scripts/yt-thumb.sh <post-basename> <youtube-url-or-id>
# Downloads https://img.youtube.com/vi/<id>/hqdefault.jpg -> public/images/<basename>/yt-<id>.jpg
# and prints oEmbed title/channel (verifies the video exists). Exit 1 if the video is not found.
set -euo pipefail
cd "$(dirname "$0")/.."
slug="$1"; in="$2"
id=$(python3 - "$in" <<'PY'
import sys,re,urllib.parse as u
s=sys.argv[1]
if re.fullmatch(r'[\w-]{11}',s): print(s); sys.exit()
p=u.urlparse(s)
if p.hostname=='youtu.be': print(p.path[1:].split('/')[0]); sys.exit()
q=u.parse_qs(p.query).get('v')
if q: print(q[0]); sys.exit()
m=re.match(r'/(?:shorts|embed|live)/([\w-]+)',p.path)
print(m.group(1) if m else '')
PY
)
[ -n "$id" ] || { echo "YouTube ID を抽出できません: $in" >&2; exit 1; }
meta=$(curl -sf "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=$id&format=json") || { echo "動画が見つかりません (oEmbed 失敗): $id" >&2; exit 1; }
echo "$meta" | python3 -c 'import json,sys;d=json.load(sys.stdin);print("title:",d["title"]);print("channel:",d["author_name"])'
mkdir -p "public/images/$slug"
curl -sfL "https://img.youtube.com/vi/$id/hqdefault.jpg" -o "public/images/$slug/yt-$id.jpg"
echo "saved: public/images/$slug/yt-$id.jpg"
echo "markdown: [![YouTube: <タイトル>](/images/$slug/yt-$id.jpg)](https://www.youtube.com/watch?v=$id)"
