// =============================================================
//  script.js — SEO Preview Studio
// =============================================================

// ── Constants ─────────────────────────────────────────────────
const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN  = 70;
const DESC_MAX  = 160;

// ── State ──────────────────────────────────────────────────────
// Single object that holds all form values.
// Every input updates its property here, then calls update().
const state = {
  title: '', desc: '', site: 'mywebsite.com', slug: '',
  ogTitle: '', ogDesc: '', ogImg: '',
  canonical: '', robots: 'index, follow',
  view: 'desktop', engine: 'google',
};

// ── Utility Helpers ────────────────────────────────────────────

/** Convert a string to a URL-safe slug */
function slugify(str) {
  return str.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Truncate a string and append ellipsis if over maxLen */
function truncate(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

/** Escape special HTML characters to prevent XSS */
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/** Get first letter of domain for favicon circle */
function faviconLetter(domain) {
  return domain ? domain[0].toUpperCase() : 'W';
}

/** Formatted date string e.g. "Mar 19, 2026" */
function getDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Progress bar fill colour based on character count */
function barColor(len, min, max) {
  if (len === 0)       return '#535d74';
  if (len > max)       return '#ff5c6a';
  if (len > max * 0.9) return '#f5a623';
  if (len >= min)      return '#34d17a';
  return '#f5a623';
}

/** CSS class for the character counter pill */
function pillClass(len, min, max) {
  if (len === 0)  return '';
  if (len > max)  return 'bad';
  if (len >= min) return 'good';
  return 'warn';
}

// ── UI Toggles ─────────────────────────────────────────────────

function setView(v) {
  state.view = v;
  document.getElementById('viewDesktop').style.display = v === 'desktop' ? 'block' : 'none';
  document.getElementById('viewMobile').style.display  = v === 'mobile'  ? 'block' : 'none';
  document.getElementById('tabDesktop').classList.toggle('active', v === 'desktop');
  document.getElementById('tabMobile').classList.toggle('active',  v === 'mobile');
}

function setEngine(e) {
  state.engine = e;
  document.getElementById('engineGoogle').classList.toggle('active', e === 'google');
  document.getElementById('engineBing').classList.toggle('active',   e === 'bing');
  document.getElementById('googleDesktopFrame').style.display = e === 'google' ? 'block' : 'none';
  document.getElementById('bingDesktopFrame').style.display   = e === 'bing'   ? 'block' : 'none';
}

// ── Toast ───────────────────────────────────────────────────────

function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Master Update ───────────────────────────────────────────────
// Called on every input event — updates all panels at once.

function update() {
  const t  = state.title;
  const d  = state.desc;
  const s  = state.site || 'mywebsite.com';
  const sl = state.slug;
  const fullUrl    = s + (sl ? '/' + sl : '');
  const displayT   = t ? truncate(t, TITLE_MAX) : null;
  const displayD   = d ? truncate(d, DESC_MAX)  : null;
  const searchText = t ? truncate(t, 40) : 'Search query…';

  // Timestamp
  document.getElementById('lastUpdated').textContent =
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // ── Title field UI
  const tLen = t.length;
  document.getElementById('titleCount').textContent = tLen + ' / ' + TITLE_MAX;
  document.getElementById('titleCount').className   = 'char-pill ' + pillClass(tLen, TITLE_MIN, TITLE_MAX);
  document.getElementById('titleBar').style.width      = Math.min(tLen / TITLE_MAX * 100, 100) + '%';
  document.getElementById('titleBar').style.background = barColor(tLen, TITLE_MIN, TITLE_MAX);
  const tHint = document.getElementById('titleHint');
  if      (tLen === 0)        { tHint.textContent = 'Aim for 30–60 characters for best results';    tHint.className = 'field-hint'; }
  else if (tLen > TITLE_MAX)  { tHint.textContent = 'Too long — Google will cut it at ~60 chars';   tHint.className = 'field-hint bad'; }
  else if (tLen < TITLE_MIN)  { tHint.textContent = 'A bit short — add more descriptive keywords';  tHint.className = 'field-hint warn'; }
  else                        { tHint.textContent = 'Great title length!';                           tHint.className = 'field-hint good'; }

  // ── Description field UI
  const dLen = d.length;
  document.getElementById('descCount').textContent = dLen + ' / ' + DESC_MAX;
  document.getElementById('descCount').className   = 'char-pill ' + pillClass(dLen, DESC_MIN, DESC_MAX);
  document.getElementById('descBar').style.width      = Math.min(dLen / DESC_MAX * 100, 100) + '%';
  document.getElementById('descBar').style.background = barColor(dLen, DESC_MIN, DESC_MAX);
  const dHint = document.getElementById('descHint');
  if      (dLen === 0)       { dHint.textContent = 'Aim for 70–160 characters for best results';    dHint.className = 'field-hint'; }
  else if (dLen > DESC_MAX)  { dHint.textContent = 'Too long — Google truncates at ~160 chars';     dHint.className = 'field-hint bad'; }
  else if (dLen < DESC_MIN)  { dHint.textContent = 'Too short — add more context to improve CTR';   dHint.className = 'field-hint warn'; }
  else                       { dHint.textContent = 'Great description length!';                      dHint.className = 'field-hint good'; }

  // ── OG title counter
  const ogLen = state.ogTitle.length;
  document.getElementById('ogTitleCount').textContent = ogLen + ' / 95';
  document.getElementById('ogTitleCount').className   = 'char-pill ' + (ogLen > 95 ? 'bad' : ogLen > 70 ? 'warn' : ogLen > 0 ? 'good' : '');

  // ── Auto-slugify
  const slugged = slugify(sl);
  if (slugged !== sl) { state.slug = slugged; document.getElementById('slugInput').value = slugged; }

  // ── Google desktop preview
  document.getElementById('gSearchText').textContent = searchText;
  document.getElementById('gFavicon').textContent    = faviconLetter(s);
  document.getElementById('gSitename').textContent   = s;
  document.getElementById('gUrlCrumb').textContent   = fullUrl;
  document.getElementById('gTitle').innerHTML = displayT
    ? escHtml(displayT)
    : '<span class="empty-tag" style="font-size:18px;">Your page title will appear here</span>';
  document.getElementById('gDate').textContent = displayD ? getDate() + ' — ' : '';
  document.getElementById('gSnippet').innerHTML = displayD
    ? escHtml(displayD)
    : '<span class="empty-tag">Your meta description will appear here. Write something compelling!</span>';

  // ── Bing desktop preview
  document.getElementById('bSearchText').textContent = searchText;
  document.getElementById('bUrlLine').textContent    = fullUrl;
  document.getElementById('bTitle').innerHTML = displayT
    ? '<span style="color:#1b6f9b;">' + escHtml(displayT) + '</span>'
    : '<span class="empty-tag">Your page title will appear here</span>';
  document.getElementById('bSnippet').innerHTML = displayD
    ? escHtml(displayD)
    : '<span class="empty-tag">Your meta description will appear here.</span>';

  // ── Mobile preview
  document.getElementById('mSearchBar').textContent = searchText;
  document.getElementById('mUrlText').textContent   = 'google.com/search?q=' + encodeURIComponent(searchText);
  document.getElementById('mFavicon').textContent   = faviconLetter(s);
  document.getElementById('mSitename').textContent  = s;
  document.getElementById('mUrlCrumb').textContent  = sl ? '› ' + sl : '';
  document.getElementById('mTitle').innerHTML = displayT
    ? escHtml(truncate(t, 55))
    : '<span class="empty-tag">Your page title will appear here</span>';
  document.getElementById('mSnippet').innerHTML = displayD
    ? escHtml(truncate(d, 120))
    : '<span class="empty-tag">Your meta description will appear here.</span>';

  // ── Code block, score, checklist
  updateCodeBlock();
  updateScore();
  updateChecklist();
}

// ── Code Block ──────────────────────────────────────────────────

function updateCodeBlock() {
  const t   = state.title, d = state.desc, s = state.site, sl = state.slug;
  const og  = state.ogTitle || t, od = state.ogDesc || d, oi = state.ogImg;
  const ca  = state.canonical || (s ? 'https://' + s + (sl ? '/' + sl : '') : '');
  const url = s ? 'https://' + s + (sl ? '/' + sl : '') : '';

  const P = (a, b) =>
    `<span class="code-attr">${a}</span><span class="code-punct">="</span><span class="code-val">${escHtml(b)}</span><span class="code-punct">"</span>`;
  const O = tag => `<span class="code-punct">&lt;</span><span class="code-tag">${tag}</span>`;
  const C = tag => `<span class="code-punct">&lt;/</span><span class="code-tag">${tag}</span><span class="code-punct">&gt;</span>`;
  const S = ` <span class="code-punct">/&gt;</span>`;

  const lines = [
    `${O('title')}<span class="code-punct">&gt;</span>${escHtml(t||'')}${C('title')}`,
    `${O('meta')} ${P('name','description')} ${P('content',d||'')}${S}`,
    `${O('meta')} ${P('name','robots')} ${P('content',state.robots)}${S}`,
  ];
  if (ca)  lines.push(`${O('link')} ${P('rel','canonical')} ${P('href',ca)}${S}`);
  lines.push('');
  if (og)  lines.push(`${O('meta')} ${P('property','og:title')} ${P('content',og)}${S}`);
  if (od)  lines.push(`${O('meta')} ${P('property','og:description')} ${P('content',od)}${S}`);
  if (url) lines.push(`${O('meta')} ${P('property','og:url')} ${P('content',url)}${S}`);
  if (oi)  lines.push(`${O('meta')} ${P('property','og:image')} ${P('content',oi)}${S}`);
  lines.push(`${O('meta')} ${P('property','og:type')} ${P('content','website')}${S}`);
  if (t) {
    lines.push('');
    lines.push(`${O('meta')} ${P('name','twitter:card')} ${P('content','summary_large_image')}${S}`);
    lines.push(`${O('meta')} ${P('name','twitter:title')} ${P('content',og||t)}${S}`);
    if (d) lines.push(`${O('meta')} ${P('name','twitter:description')} ${P('content',od||d)}${S}`);
  }
  document.getElementById('codeBlock').innerHTML = lines.join('\n');
}

// ── SEO Score ───────────────────────────────────────────────────

function updateScore() {
  const tLen = state.title.length, dLen = state.desc.length;
  let score = 0;
  if (tLen >= TITLE_MIN && tLen <= TITLE_MAX) score += 30; else if (tLen > 0) score += 10;
  if (dLen >= DESC_MIN  && dLen <= DESC_MAX)  score += 30; else if (dLen > 0) score += 10;
  if (state.slug)                             score += 20;
  if (state.ogTitle || state.ogDesc)          score += 10;
  if (state.ogImg)                            score += 10;

  const CIRC = 138.2;
  const ring = document.getElementById('scoreRing');
  ring.style.strokeDashoffset = CIRC - (CIRC * score / 100);

  const clr = score >= 80 ? '#34d17a' : score >= 50 ? '#f5a623' : score > 0 ? '#ff5c6a' : '#535d74';
  ring.style.stroke = clr;
  const numEl = document.getElementById('scoreNum');
  numEl.textContent = score;
  numEl.style.color = clr;

  const si = (id, pass, warn) => {
    document.getElementById('si-' + id).className = 'score-item ' + (pass ? 'pass' : warn ? 'warn-item' : 'fail');
  };
  si('title',    tLen >= TITLE_MIN && tLen <= TITLE_MAX, tLen > 0);
  si('desc',     dLen >= DESC_MIN  && dLen <= DESC_MAX,  dLen > 0);
  si('slug',     !!state.slug,                           false);
  si('keywords', tLen > 0 && dLen > 0,                   false);
}

// ── SEO Checklist ───────────────────────────────────────────────

function updateChecklist() {
  const tLen = state.title.length, dLen = state.desc.length;

  const ICONS = {
    pass: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    warn: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 9v4M12 17h.01"/></svg>',
    fail: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  };

  function setCheck(id, status, detail) {
    document.getElementById('ck-' + id).querySelector('.check-icon').className = 'check-icon ' + status;
    document.getElementById('ck-' + id).querySelector('.check-icon').innerHTML = ICONS[status];
    document.getElementById('ck-' + id + '-d').textContent = detail;
  }

  if      (tLen === 0)        setCheck('title', 'fail', 'Add a title between 30–60 characters');
  else if (tLen > TITLE_MAX)  setCheck('title', 'warn', 'Too long — will be truncated by Google');
  else if (tLen < TITLE_MIN)  setCheck('title', 'warn', tLen + ' chars — a bit short');
  else                        setCheck('title', 'pass', tLen + ' characters — ideal ✓');

  if      (dLen === 0)        setCheck('desc', 'fail', 'Add a description between 70–160 characters');
  else if (dLen > DESC_MAX)   setCheck('desc', 'warn', 'Too long — Google will truncate it');
  else if (dLen < DESC_MIN)   setCheck('desc', 'warn', dLen + ' chars — expand your description');
  else                        setCheck('desc', 'pass', dLen + ' characters — ideal ✓');

  if      (!state.slug)             setCheck('slug', 'fail', 'Add a URL slug for clean URLs');
  else if (state.slug.length > 60)  setCheck('slug', 'warn', 'Slug is long — consider shortening');
  else                              setCheck('slug', 'pass', '/' + state.slug);

  const hasOg = !!(state.ogTitle || state.ogDesc || state.ogImg);
  setCheck('og', hasOg ? 'pass' : 'fail', hasOg ? 'Open Graph tags configured ✓' : 'Add OG tags for social sharing');

  setCheck('robots', 'pass', state.robots);
}

// ── Export / Copy ────────────────────────────────────────────────

function buildRawMeta() {
  const t = state.title, d = state.desc, s = state.site, sl = state.slug;
  const og = state.ogTitle || t, od = state.ogDesc || d, oi = state.ogImg;
  const ca  = state.canonical || (s ? 'https://' + s + (sl ? '/' + sl : '') : '');
  const url = s ? 'https://' + s + (sl ? '/' + sl : '') : '';
  const lines = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta name="robots" content="${state.robots}" />`,
  ];
  if (ca)  lines.push(`<link rel="canonical" href="${ca}" />`);
  lines.push('');
  if (og)  lines.push(`<meta property="og:title" content="${og}" />`);
  if (od)  lines.push(`<meta property="og:description" content="${od}" />`);
  if (url) lines.push(`<meta property="og:url" content="${url}" />`);
  if (oi)  lines.push(`<meta property="og:image" content="${oi}" />`);
  lines.push(`<meta property="og:type" content="website" />`);
  if (t) {
    lines.push('');
    lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
    lines.push(`<meta name="twitter:title" content="${og||t}" />`);
    if (d) lines.push(`<meta name="twitter:description" content="${od||d}" />`);
  }
  return lines.join('\n');
}

function copyMeta() {
  navigator.clipboard.writeText(buildRawMeta()).then(() => {
    const btn = document.getElementById('copyCodeBtn');
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    showToast('Meta tags copied to clipboard!');
  });
}

function exportMeta() {
  const filename = (state.slug || 'page') + '.html';
  const content  = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n\n${buildRawMeta().split('\n').map(l=>'  '+l).join('\n')}\n</head>\n<body>\n  <!-- Your page content here -->\n</body>\n</html>`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/html' }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Exported as ' + filename);
}

// ── Event Listeners ──────────────────────────────────────────────

document.getElementById('titleInput').addEventListener('input',  e => { state.title     = e.target.value; update(); });
document.getElementById('descInput').addEventListener('input',   e => { state.desc      = e.target.value; update(); });
document.getElementById('siteInput').addEventListener('input',   e => { state.site      = e.target.value; update(); });
document.getElementById('slugInput').addEventListener('input',   e => { state.slug      = e.target.value; update(); });
document.getElementById('ogTitleInput').addEventListener('input',e => { state.ogTitle   = e.target.value; update(); });
document.getElementById('ogDescInput').addEventListener('input', e => { state.ogDesc    = e.target.value; update(); });
document.getElementById('ogImgInput').addEventListener('input',  e => { state.ogImg     = e.target.value; update(); });
document.getElementById('canonicalInput').addEventListener('input',e=>{ state.canonical = e.target.value; update(); });
document.getElementById('robotsInput').addEventListener('change',e => { state.robots    = e.target.value; update(); });

// ── Init ─────────────────────────────────────────────────────────
update();
