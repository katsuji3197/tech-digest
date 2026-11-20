// トップページのカレンダー（日付・期間で記事を絞り込む）。依存なしの素の JS。
// データ: <script id="cal-data"> に build.mjs が埋め込む { articles: [{ d, ad, type, issue, it, no, url, t }] }
//   d = 掲載日（号の発行日、JST の YYYY-MM-DD）。カレンダーの件数はこの日付で数える。
// URL: ?date=YYYY-MM-DD（1日）または ?from=YYYY-MM-DD&to=YYYY-MM-DD（期間）。ほかのクエリ（将来の tag など）は保持する。
(() => {
  'use strict';
  const root = document.getElementById('cal');
  const dataEl = document.getElementById('cal-data');
  if (!root || !dataEl) return;
  let data;
  try { data = JSON.parse(dataEl.textContent); } catch { return; }
  const articles = data.articles || [];
  if (!articles.length) return;

  const $ = (sel, el = root) => el.querySelector(sel);
  const results = document.getElementById('cal-results');
  const list = results.querySelector('.cal-list');
  const heading = document.getElementById('cal-results-h');
  const status = document.getElementById('cal-status');
  const hint = document.getElementById('cal-hint');
  const monthLabel = document.getElementById('cal-month');
  const tbody = root.querySelector('tbody');
  const issuesList = document.querySelector('.tabs');

  // ---- dates (all as 'YYYY-MM-DD' strings, computed in UTC to avoid DST/zone drift) ----
  const RE = /^(\d{4})-(\d{2})-(\d{2})$/;
  const toDate = (s) => { const m = s.match(RE); return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); };
  const iso = (d) => d.toISOString().slice(0, 10);
  const addDays = (s, n) => { const d = toDate(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
  const valid = (s) => typeof s === 'string' && RE.test(s) && iso(toDate(s)) === s;
  const ym = (s) => s.slice(0, 7);
  const addMonths = (m, n) => { const d = new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7) - 1 + n, 1)); return iso(d).slice(0, 7); };
  const WD = '日月火水木金土';
  const jp = (s, withYear) => { const d = toDate(s); return `${withYear ? d.getUTCFullYear() + '年' : ''}${d.getUTCMonth() + 1}月${d.getUTCDate()}日（${WD[d.getUTCDay()]}）`; };
  const jpShort = (s) => { const d = toDate(s); return `${d.getUTCMonth() + 1}月${d.getUTCDate()}日`; };
  const todayJst = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

  // ---- index ----
  const byDay = new Map();
  for (const a of articles) { if (!byDay.has(a.d)) byDay.set(a.d, []); byDay.get(a.d).push(a); }
  const days = [...byDay.keys()].sort();
  const firstMonth = ym(days[0]), lastMonth = ym(days[days.length - 1]);
  const count = (s) => (byDay.get(s) || []).length;

  // ---- state ----
  // sel: null | { from, to }（1日なら from === to）。pending: 期間モードで始点だけ選んだ状態。
  const state = { mode: 'day', sel: null, pending: null, month: lastMonth, focus: null };

  // 絞り込み条件の一覧。将来タグなどを足すときはここに述語を追加する。
  const filters = [
    (a) => !state.sel || (a.d >= state.sel.from && a.d <= state.sel.to),
  ];
  const matches = () => articles.filter((a) => filters.every((f) => f(a)))
    .sort((x, y) => (y.d.localeCompare(x.d)) || (y.issue.localeCompare(x.issue)) || (x.no - y.no));

  // ---- URL ----
  function readUrl() {
    const q = new URLSearchParams(location.search);
    const date = q.get('date'), from = q.get('from'), to = q.get('to');
    if (valid(date)) return { from: date, to: date, mode: 'day' };
    if (valid(from) && valid(to)) return from <= to ? { from, to, mode: 'range' } : { from: to, to: from, mode: 'range' };
    if (valid(from)) return { from, to: from, mode: 'range' };
    return null;
  }
  function writeUrl(push) {
    const q = new URLSearchParams(location.search);
    q.delete('date'); q.delete('from'); q.delete('to');
    if (state.sel) {
      if (state.sel.from === state.sel.to && state.mode === 'day') q.set('date', state.sel.from);
      else { q.set('from', state.sel.from); q.set('to', state.sel.to); }
    }
    const qs = q.toString();
    const url = location.pathname + (qs ? '?' + qs : '') + location.hash;
    if (url === location.pathname + location.search + location.hash) return;
    history[push ? 'pushState' : 'replaceState'](null, '', url);
  }

  // ---- render calendar ----
  function cellLabel(s) {
    const n = count(s);
    const parts = [`${jpShort(s)}（${WD[toDate(s).getUTCDay()]}）、記事${n}件`];
    if (s === todayJst()) parts.push('今日');
    if (state.pending === s) parts.push('期間の開始日');
    return parts.join('、');
  }
  function inSel(s) { return state.sel && s >= state.sel.from && s <= state.sel.to; }
  function renderCalendar() {
    const m = state.month;
    const first = m + '-01';
    const startWd = toDate(first).getUTCDay();
    const dim = toDate(addMonths(m, 1) + '-01'); dim.setUTCDate(0);
    const nDays = dim.getUTCDate();
    if (!state.focus || ym(state.focus) !== m) {
      state.focus = (state.sel && ym(state.sel.from) === m && state.sel.from) || (ym(todayJst()) === m && todayJst()) || days.filter((d) => ym(d) === m).pop() || first;
    }
    const total = days.filter((d) => ym(d) === m).reduce((n, d) => n + count(d), 0);
    monthLabel.textContent = `${+m.slice(0, 4)}年${+m.slice(5, 7)}月`;
    monthLabel.dataset.total = `${total}件`;
    root.querySelector('[data-step="-1"]').disabled = m <= firstMonth;
    root.querySelector('[data-step="1"]').disabled = m >= lastMonth;
    let html = '<tr>' + '<td></td>'.repeat(startWd);
    for (let day = 1; day <= nDays; day++) {
      const s = `${m}-${String(day).padStart(2, '0')}`;
      const wd = (startWd + day - 1) % 7;
      if (wd === 0 && day !== 1) html += '</tr><tr>';
      const n = count(s);
      const cls = ['day'];
      if (!n) cls.push('zero');
      if (wd === 0) cls.push('sun'); if (wd === 6) cls.push('sat');
      if (s === todayJst()) cls.push('today');
      if (inSel(s)) {
        cls.push('in');
        if (s === state.sel.from) cls.push('start');
        if (s === state.sel.to) cls.push('end');
      }
      if (state.pending === s) cls.push('pending', 'start', 'end');
      const pressed = inSel(s) || state.pending === s;
      html += `<td><button type="button" class="${cls.join(' ')}" data-date="${s}" aria-label="${cellLabel(s)}" aria-pressed="${pressed}" tabindex="${s === state.focus ? 0 : -1}"><span class="dn">${day}</span>${n ? `<span class="cnt" aria-hidden="true">${n}件</span>` : ''}</button></td>`;
    }
    const tail = (7 - ((startWd + nDays) % 7)) % 7;
    html += '<td></td>'.repeat(tail) + '</tr>';
    tbody.innerHTML = html;
  }

  // ---- render results ----
  function renderResults(moveFocus) {
    for (const b of root.querySelectorAll('[data-mode]')) b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode));
    if (state.mode === 'range') hint.textContent = state.pending ? `開始日：${jp(state.pending)}。終了日をタップしてください。` : '期間の開始日と終了日を順にタップしてください。';
    else hint.textContent = '日付をタップすると、その日の記事に絞り込みます。';
    if (!state.sel) {
      results.hidden = true;
      if (issuesList) issuesList.hidden = false;
      return;
    }
    const hits = matches();
    const { from, to } = state.sel;
    const label = from === to ? `${jp(from, true)}の記事` : `${jp(from, true)}〜${jp(to, ym(from).slice(0, 4) !== ym(to).slice(0, 4))}の記事`;
    heading.innerHTML = `${label}<span class="cal-n">${hits.length}件</span>`;
    list.innerHTML = hits.length ? hits.map((a) => `<li class="cal-item ${a.type}">
  <a href="${a.url}">
    <span class="meta"><span class="badge ${a.type}">${a.type === 'extra' ? '号外' : '週刊'}</span><time datetime="${a.d}">${jp(a.d)}</time><span class="sep">·</span><span>No.${a.no}</span></span>
    <span class="cal-title">${esc(a.t)}</span>
    <span class="cal-issue">${esc(a.it)}</span>
  </a>
</li>`).join('') : '<li class="empty">この期間の記事はありません。前後の日付や、ほかの月も見てみてください。</li>';
    results.hidden = false;
    if (issuesList) issuesList.hidden = true;
    status.textContent = `${label}、${hits.length}件を表示しています。`;
    if (moveFocus) heading.focus({ preventScroll: true });
  }
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function render(opts = {}) { renderCalendar(); renderResults(opts.moveFocus); if (opts.focusCell) focusCell(); }
  function focusCell() { const b = tbody.querySelector(`[data-date="${state.focus}"]`); if (b) b.focus(); }

  // ---- actions ----
  function select(sel, push = true) {
    state.sel = sel; state.pending = null;
    if (sel) { state.month = ym(sel.from); }
    writeUrl(push);
  }
  function clear() {
    state.sel = null; state.pending = null;
    writeUrl(true);
    render();
    status.textContent = '絞り込みを解除しました。すべての号を表示しています。';
  }
  function onDay(s) {
    state.focus = s;
    if (state.mode === 'day') {
      if (state.sel && state.sel.from === s && state.sel.to === s) { clear(); focusCell(); return; }
      state.sel = { from: s, to: s }; state.pending = null; writeUrl(true);
    } else if (!state.pending) {
      state.pending = s;
      status.textContent = `開始日に${jp(s)}を選びました。終了日を選んでください。`;
    } else {
      const a = state.pending, b = s;
      state.sel = a <= b ? { from: a, to: b } : { from: b, to: a };
      state.pending = null; writeUrl(true);
    }
    render({ focusCell: true });
  }
  function startOfWeek(s) { return addDays(s, -toDate(s).getUTCDay()); } // 日曜始まり
  function preset(name) {
    const t = todayJst();
    let from, to;
    if (name === 'this-week') { from = startOfWeek(t); to = addDays(from, 6); }
    else if (name === 'last-week') { from = addDays(startOfWeek(t), -7); to = addDays(from, 6); }
    else if (name === 'this-month') { from = ym(t) + '-01'; to = addDays(addMonths(ym(t), 1) + '-01', -1); }
    else if (name === 'last-month') { const m = addMonths(ym(t), -1); from = m + '-01'; to = addDays(ym(t) + '-01', -1); }
    else return;
    state.mode = 'range';
    select({ from, to });
    state.month = ym(to) > lastMonth ? (ym(from) > lastMonth ? lastMonth : ym(from)) : ym(to);
    if (state.month < firstMonth) state.month = firstMonth;
    state.focus = null;
    render({ moveFocus: true });
  }

  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.date) onDay(b.dataset.date);
    else if (b.dataset.step) { state.month = addMonths(state.month, +b.dataset.step); state.focus = null; render(); }
    else if (b.dataset.mode) { if (state.mode !== b.dataset.mode) { state.mode = b.dataset.mode; state.pending = null; render(); } }
    else if (b.dataset.preset) preset(b.dataset.preset);
  });
  results.addEventListener('click', (e) => { if (e.target.closest('[data-clear]')) { clear(); focusCell(); } });

  // キーボード: 矢印キーで日付を移動、Home/End で週の端、PageUp/PageDown で前後の月、Esc で期間選択の取り消し
  tbody.addEventListener('keydown', (e) => {
    const b = e.target.closest('[data-date]');
    if (!b) return;
    const s = b.dataset.date;
    const wd = toDate(s).getUTCDay();
    const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -wd, End: 6 - wd };
    let next;
    if (e.key in moves) next = addDays(s, moves[e.key]);
    else if (e.key === 'PageUp' || e.key === 'PageDown') {
      const m = addMonths(ym(s), e.key === 'PageUp' ? -1 : 1);
      const dim = toDate(addMonths(m, 1) + '-01'); dim.setUTCDate(0);
      next = `${m}-${String(Math.min(+s.slice(8), dim.getUTCDate())).padStart(2, '0')}`;
    } else if (e.key === 'Escape' && state.pending) { state.pending = null; render({ focusCell: true }); e.preventDefault(); return; }
    else return;
    e.preventDefault();
    if (ym(next) < firstMonth || ym(next) > lastMonth) return;
    state.focus = next;
    if (ym(next) !== state.month) { state.month = ym(next); renderCalendar(); }
    else for (const c of tbody.querySelectorAll('[data-date]')) c.tabIndex = c.dataset.date === next ? 0 : -1;
    focusCell();
  });

  function restore() {
    const r = readUrl();
    state.pending = null;
    if (r) { state.mode = r.mode; state.sel = { from: r.from, to: r.to }; state.month = ym(r.from); }
    else state.sel = null;
    if (state.month < firstMonth) state.month = firstMonth;
    if (state.month > lastMonth) state.month = lastMonth;
    state.focus = null;
    render();
  }
  window.addEventListener('popstate', restore);
  root.hidden = false;
  restore();
})();
