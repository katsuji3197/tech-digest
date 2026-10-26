// Static site builder for 週刊テックダイジェスト (issue hubs + standalone topic articles).
//
//   posts/<issue>/index.md        issue hub   (frontmatter: title, date, type: weekly|extra, summary)
//   posts/<issue>/<slug>.md       topic article (frontmatter: title, date, teaser, cover, cover_caption, order)
//   public/images/<issue>/...     images for the issue and its articles
//
//   <issue> = YYYY-MM-DD (weekly) | YYYY-MM-DD-extra-<slug> (extra)
//   URLs:  /posts/<issue>/  and  /posts/<issue>/<slug>/
//
// Output: dist/ (pure static) + deploy/manifest.json, deploy/uploads.json, deploy/b64/<sha>.b64 (for Vercel MCP).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS = path.join(ROOT, 'posts');
const PUBLIC = path.join(ROOT, 'public');
const ASSETS = path.join(ROOT, 'assets');
const DIST = path.join(ROOT, 'dist');
const DEPLOY = path.join(ROOT, 'deploy');
const SITE_TITLE = '週刊テックダイジェスト';
const SITE_DESC = 'フロントエンドエンジニアのための週刊テックニュース（＋号外）。1トピック1記事でじっくり読む。';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const warnings = [];
const warn = (m) => { warnings.push(m); console.warn('⚠ ' + m); };

function parseFrontmatter(src, file) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) throw new Error(`${file}: frontmatter (--- ... ---) がありません`);
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!mm) continue;
    let v = mm[2].replace(/\s+#\s.*$/, '').trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    data[mm[1]] = v;
  }
  return { data, body: src.slice(m[0].length) };
}

function ytId(href) {
  try {
    const u = new URL(href);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null;
    if (/(^|\.)youtube\.com$/.test(u.hostname)) {
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,})/);
      if (m) return m[1];
    }
  } catch {}
  return null;
}

function makeMarked(issue) {
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const id = external ? ytId(href) : null;
        const cls = id && /<img /.test(text) ? ' class="yt"' : '';
        const t = title ? ` title="${esc(title)}"` : '';
        const tgt = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${esc(href)}"${t}${tgt}${cls}>${text}</a>`;
      },
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        const aux = depth === 2 && /^(参考リンク|関連動画|出典)/.test(text.trim());
        return `<h${depth}${aux ? ' class="aux"' : ''}>${inner}</h${depth}>\n`;
      },
      image({ href, title, text }) {
        return `<img src="${esc(href)}" alt="${esc(text)}" loading="lazy" decoding="async">`;
      },
      paragraph({ tokens, text }) {
        const bare = text.trim();
        // 1) bare YouTube URL paragraph -> thumbnail card (if thumbnail downloaded)
        const id = /^https?:\/\/\S+$/.test(bare) ? ytId(bare) : null;
        if (id && fs.existsSync(path.join(PUBLIC, 'images', issue, `yt-${id}.jpg`))) {
          return `<figure class="video"><a class="yt" href="${esc(bare)}" target="_blank" rel="noopener noreferrer"><img src="/images/${issue}/yt-${id}.jpg" alt="YouTube 動画サムネイル" loading="lazy"></a><figcaption>YouTube で再生</figcaption></figure>\n`;
        }
        // 2) paragraph with a single image (optionally linked) -> <figure> with caption from image title
        if (tokens.length === 1 && (tokens[0].type === 'image' || (tokens[0].type === 'link' && tokens[0].tokens?.length === 1 && tokens[0].tokens[0].type === 'image'))) {
          const img = tokens[0].type === 'image' ? tokens[0] : tokens[0].tokens[0];
          const isVideo = tokens[0].type === 'link' && ytId(tokens[0].href);
          const capText = img.title ? this.parser.parseInline(marked.Lexer.lexInline(img.title)) : '';
          const cap = isVideo ? `<figcaption><span class="yt-label">▶ YouTube で再生（新しいタブ）</span>${capText}</figcaption>` : (capText ? `<figcaption>${capText}</figcaption>` : '');
          return `<figure${isVideo ? ' class="video"' : ''}>${this.parser.parseInline(tokens)}${cap}</figure>\n`;
        }
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
      },
    },
  });
  return marked;
}

function fmtDate(d) {
  const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return esc(d);
  const wd = '日月火水木金土'[new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).getUTCDay()];
  return `${+m[1]}年${+m[2]}月${+m[3]}日（${wd}）`;
}
const badge = (type) => type === 'extra' ? '<span class="badge extra">号外</span>' : '<span class="badge weekly">週刊</span>';
// CommonMark's emphasis rules often fail next to Japanese punctuation (e.g. **非推奨（deprecated）**に).
// Convert **bold** to <strong> outside fenced code blocks / inline code before parsing.
function cjkBold(md) {
  return md.split(/(^```[\s\S]*?^```)/m).map((chunk, i) => i % 2 ? chunk :
    chunk.split(/(`[^`\n]*`)/).map((c, j) => j % 2 ? c : c.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')).join('')).join('');
}
const textLen = (html) => html.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, '').length;

function layout({ title, desc, body, ogImage, wide }) {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
<meta name="robots" content="noindex">
<link rel="stylesheet" href="/styles.css">
<script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
<script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
<header class="site"><div class="wrap"><a class="brand" href="/"><span aria-hidden="true">📰 </span>${esc(SITE_TITLE)}</a></div></header>
<main class="${wide ? 'wide' : 'narrow'}">
${body}
</main>
<footer class="site"><div class="wrap">各記事は出典をもとに作成しています。画像の権利は各出典元に帰属します。詳細は必ずリンク先の一次情報をご確認ください。</div></footer>
</body>
</html>
`;
}

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}
function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out); else out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out.sort();
}
function writePage(rel, html) {
  const out = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}
function checkImages(html, where) {
  for (const [, src] of html.matchAll(/<img src="(\/[^"]+)"/g)) {
    if (!fs.existsSync(path.join(DIST, decodeURI(src)))) warn(`画像が見つかりません: ${src} (${where})`);
  }
}

// ---- load ----
rmrf(DIST); fs.mkdirSync(DIST, { recursive: true });
copyDir(PUBLIC, DIST);
copyDir(ASSETS, DIST);

const ISSUE_RE = /^(\d{4}-\d{2}-\d{2})(?:-extra-([a-z0-9-]+))?$/;
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const issues = [];
for (const e of fs.readdirSync(POSTS, { withFileTypes: true })) {
  if (!e.isDirectory()) { if (e.name.endsWith('.md')) warn(`posts/${e.name}: 旧形式（フラットな .md）は無視されます。posts/<issue>/index.md へ移行してください`); continue; }
  const m = e.name.match(ISSUE_RE);
  if (!m) { warn(`posts/${e.name}: フォルダ名規則外のためスキップ`); continue; }
  const issue = e.name, dir = path.join(POSTS, issue);
  const hubFile = path.join(dir, 'index.md');
  if (!fs.existsSync(hubFile)) { warn(`posts/${issue}/index.md がありません（スキップ）`); continue; }
  const hub = parseFrontmatter(fs.readFileSync(hubFile, 'utf8'), `${issue}/index.md`);
  if (hub.data.draft === 'true') { console.log(`skip draft issue: ${issue}`); continue; }
  for (const k of ['title', 'date', 'summary']) if (!hub.data[k]) throw new Error(`${issue}/index.md: frontmatter に ${k} がありません`);
  const type = (hub.data.type || (m[2] ? 'extra' : 'weekly')).toLowerCase() === 'extra' ? 'extra' : 'weekly';
  const marked = makeMarked(issue);
  const articles = [];
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'index.md')) {
    const slug = f.replace(/\.md$/, '');
    if (!SLUG_RE.test(slug)) { warn(`${issue}/${f}: slug は [a-z0-9-] のみ（スキップ）`); continue; }
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(dir, f), 'utf8'), `${issue}/${f}`);
    if (data.draft === 'true') continue;
    for (const k of ['title', 'date', 'teaser', 'cover']) if (!data[k]) throw new Error(`${issue}/${f}: frontmatter に ${k} がありません`);
    const html = marked.parse(cjkBold(body));
    const len = textLen(html);
    if (len < 700) warn(`${issue}/${slug}: 本文が短めです（${len}字）`);
    articles.push({ ...data, slug, html, len, order: Number(data.order ?? 99) });
  }
  articles.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  if (!articles.length) warn(`${issue}: 記事がありません`);
  issues.push({ ...hub.data, issue, type, introHtml: marked.parse(cjkBold(hub.body)), articles, cover: hub.data.cover || articles[0]?.cover || '' });
}
// 同じ日付の号は任意の frontmatter `time`（HH:MM, JST）が新しい順、次にフォルダ名の逆順
issues.sort((a, b) => (a.date === b.date ? (String(b.time || '').localeCompare(String(a.time || '')) || b.issue.localeCompare(a.issue)) : b.date.localeCompare(a.date)));

// ---- article pages ----
for (const is of issues) {
  is.articles.forEach((a, i) => {
    const prev = is.articles[i - 1], next = is.articles[i + 1];
    const hero = `<figure class="hero"><img src="${esc(a.cover)}" alt="" decoding="async">${a.cover_caption ? `<figcaption>${makeMarked(is.issue).parseInline(a.cover_caption)}</figcaption>` : ''}</figure>`;
    const others = is.articles.map((o, j) => `<li${o === a ? ' aria-current="page"' : ''}><span class="num">${j + 1}</span>${o === a ? `<span>${esc(o.title)}</span>` : `<a href="/posts/${is.issue}/${o.slug}/">${esc(o.title)}</a>`}</li>`).join('\n');
    const body = `<nav class="crumbs" aria-label="パンくずリスト"><ol><li><a href="/">トップ</a></li><li class="crumb-issue" title="${esc(is.title)}"><a href="/posts/${is.issue}/">${esc(is.title)}</a></li><li aria-current="page">No.${i + 1}</li></ol></nav>
<article class="article ${is.type}">
<header class="article-head">
  <div class="meta">${badge(is.type)}<a href="/posts/${is.issue}/"><span class="num">No.${i + 1}</span></a><span>全${is.articles.length}本中</span><span class="sep">·</span><time datetime="${esc(a.date)}">${fmtDate(a.date)}</time><span class="sep">·</span><span>${Math.max(1, Math.round(a.len / 500))}分で読めます</span></div>
  <h1>${esc(a.title)}</h1>
  <p class="lead">${esc(a.teaser)}</p>
</header>
${hero}
<div class="prose">
${a.html}
</div>
</article>
<nav class="pager" aria-label="前後の記事">
  ${prev ? `<a class="prev" href="/posts/${is.issue}/${prev.slug}/"><small>← 前の記事</small>${esc(prev.title)}</a>` : '<span></span>'}
  ${next ? `<a class="next" href="/posts/${is.issue}/${next.slug}/"><small>次の記事 →</small>${esc(next.title)}</a>` : '<span></span>'}
</nav>
<nav class="issue-toc" aria-labelledby="toc-h">
  <h2 id="toc-h">${badge(is.type)}この号の記事</h2>
  <ol>${others}</ol>
  <p><a href="/posts/${is.issue}/">${esc(is.title)} の目次へ</a></p>
</nav>`;
    const html = layout({ title: `${a.title} | ${SITE_TITLE}`, desc: a.teaser, body, ogImage: a.cover });
    checkImages(html, `${is.issue}/${a.slug}`);
    writePage(`posts/${is.issue}/${a.slug}/index.html`, html);
  });
}

// ---- issue hub pages ----
const articleCard = (is, a, i) => `<li class="acard">
  <a href="/posts/${is.issue}/${a.slug}/">
    <img class="thumb" src="${esc(a.cover)}" alt="" loading="lazy">
    <div class="acard-body">
      <div class="meta"><span class="num">No.${i + 1}</span><time datetime="${esc(a.date)}">${fmtDate(a.date)}</time></div>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.teaser)}</p>
    </div>
  </a>
</li>`;
for (const is of issues) {
  const body = `<nav class="crumbs" aria-label="パンくずリスト"><ol><li><a href="/">トップ</a></li><li class="crumb-issue" title="${esc(is.title)}" aria-current="page">${esc(is.title)}</li></ol></nav>
<section class="hub-head ${is.type}">
  <div class="meta">${badge(is.type)}<time datetime="${esc(is.date)}">${fmtDate(is.date)}</time><span class="sep">·</span><span>${is.articles.length}本の記事</span></div>
  <h1>${esc(is.title)}</h1>
  <div class="intro">${is.introHtml}</div>
</section>
<ul class="acards">
${is.articles.map((a, i) => articleCard(is, a, i)).join('\n')}
</ul>`;
  const html = layout({ title: `${is.title} | ${SITE_TITLE}`, desc: is.summary, body, ogImage: is.cover, wide: true });
  checkImages(html, `${is.issue}/index`);
  writePage(`posts/${is.issue}/index.html`, html);
}

// ---- top page ----
const cards = issues.map((is, idx) => `<li class="card" data-type="${is.type}">
  <a class="card-main" href="/posts/${is.issue}/">
    ${is.cover ? `<img class="thumb" src="${esc(is.cover)}" alt="" loading="lazy">` : '<div class="thumb ph"></div>'}
    <div class="card-body">
      <div class="meta">${badge(is.type)}<time datetime="${esc(is.date)}">${fmtDate(is.date)}</time><span class="sep">·</span><span>${is.articles.length}本</span>${idx === 0 ? '<span class="latest">最新号</span>' : ''}</div>
      <h2>${esc(is.title)}</h2>
      <p>${esc(is.summary)}</p>
    </div>
  </a>
  <ol class="card-articles">
    ${is.articles.map((a) => `<li><a href="/posts/${is.issue}/${a.slug}/">${esc(a.title)}</a></li>`).join('\n    ')}
  </ol>
</li>`).join('\n');
const nW = issues.filter((p) => p.type === 'weekly').length, nE = issues.length - nW;
const indexBody = `<section class="hero-top">
<h1>${esc(SITE_TITLE)}</h1>
<p>${esc(SITE_DESC)}</p>
</section>
<div class="tabs" role="radiogroup" aria-label="号の種類で絞り込み">
  <input type="radio" name="f" id="f-all" checked><label for="f-all">すべて（${issues.length}）</label>
  <input type="radio" name="f" id="f-weekly"${nW ? '' : ' disabled'}><label for="f-weekly">週刊（${nW}）</label>
  <input type="radio" name="f" id="f-extra"${nE ? '' : ' disabled'}><label for="f-extra">号外（${nE}）</label>
  <ul class="cards">
${cards || '<li class="empty">まだ記事がありません。</li>'}
  </ul>
</div>`;
writePage('index.html', layout({ title: SITE_TITLE, desc: SITE_DESC, body: indexBody, wide: true }));
writePage('404.html', layout({ title: `ページが見つかりません | ${SITE_TITLE}`, desc: SITE_DESC, body: '<section class="hero-top"><h1>ページが見つかりません</h1><p><a href="/">トップへ戻る</a></p></section>' }));

// ---- deploy manifest (Vercel MCP upload_file + create_deployment) ----
rmrf(DEPLOY); fs.mkdirSync(path.join(DEPLOY, 'b64'), { recursive: true });
const files = walk(DIST).map((rel) => {
  const buf = fs.readFileSync(path.join(DIST, rel));
  const sha = crypto.createHash('sha1').update(buf).digest('hex');
  fs.writeFileSync(path.join(DEPLOY, 'b64', `${sha}.b64`), buf.toString('base64'));
  return { file: rel, sha, size: buf.length };
});
fs.writeFileSync(path.join(DEPLOY, 'manifest.json'), JSON.stringify(files));
const uniq = [...new Map(files.map((f) => [f.sha, f])).values()];
fs.writeFileSync(path.join(DEPLOY, 'uploads.json'), JSON.stringify(uniq.map((f) => ({ sha: f.sha, size: f.size, b64: path.join(DEPLOY, 'b64', `${f.sha}.b64`), example: f.file })), null, 2));
// URL list for verification
const urls = ['/', ...issues.flatMap((is) => [`/posts/${is.issue}/`, ...is.articles.map((a) => `/posts/${is.issue}/${a.slug}/`)]), ...files.filter((f) => f.file.startsWith('images/')).map((f) => '/' + f.file)];
fs.writeFileSync(path.join(DEPLOY, 'urls.txt'), urls.join('\n') + '\n');

for (const is of issues) {
  console.log(`[${is.type}] ${is.issue}: ${is.title}`);
  for (const a of is.articles) console.log(`   - ${a.slug} (${a.len}字) ${a.title}`);
}
console.log(`✔ ${issues.length} issue(s), ${issues.reduce((n, i) => n + i.articles.length, 0)} article(s), ${files.length} files (${uniq.length} unique) -> dist/ ; deploy/manifest.json, deploy/urls.txt`);
if (warnings.length) console.log(`⚠ warnings: ${warnings.length}`);
