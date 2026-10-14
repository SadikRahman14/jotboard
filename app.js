/* Jotboard — local-first notes. No remote APIs or runtime dependencies. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const svgPaths = {
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'layout-grid': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    'pin': '<path d="m16 9 3 3-5 2-1 6-4-4-6 5 5-6-4-4 6-1 2-5 3 3"/>',
    'archive': '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/>',
    'trash': '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
    'hash': '<path d="M5 9h14M4 15h14M11 3 7 21M17 3l-4 18"/>',
    'sliders': '<path d="M4 7h16M4 17h16M8 4v6M16 14v6"/>',
    'shield-check': '<path d="M12 2 4 5v6c0 6 4 9 8 11 4-2 8-5 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    'menu': '<path d="M4 6h16M4 12h16M4 18h16"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'moon': '<path d="M20.5 13.1A8.5 8.5 0 0 1 11 3.5 8.8 8.8 0 1 0 20.5 13.1Z"/>',
    'upload': '<path d="M12 16V3m-5 5 5-5 5 5M4 17v4h16v-4"/>',
    'download': '<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',
    'search': '<circle cx="10.8" cy="10.8" r="7"/><path d="m16.2 16.2 4.4 4.4"/>',
    'list-checks': '<path d="m3 6 2 2 3-4M11 6h10M3 16l2 2 3-4M11 16h10"/>',
    'image': '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    'file-code': '<path d="M6 2h9l5 5v14H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M15 2v5h5M10 12l-2 2 2 2M14 12l2 2-2 2"/>',
    'arrow-down-up': '<path d="M7 3v18m-4-4 4 4 4-4M17 21V3m-4 4 4-4 4 4"/>',
    'rows': '<rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="18" height="7" rx="1"/>',
    'notebook': '<rect x="5" y="3" width="16" height="18" rx="2"/><path d="M9 3v18M3 8h4M3 16h4M13 9h5M13 13h5"/>',
    'move-horizontal': '<path d="M3 12h18m-4-4 4 4-4 4M7 8l-4 4 4 4"/>',
    'x': '<path d="M18 6 6 18M6 6l12 12"/>',
    'palette': '<path d="M12 3C6.5 3 3 7 3 12c0 5 4 9 9 9 2 0 3-2 2-3s-1-3 2-3h3c2 0 3-1.8 3-3.5C22 6.5 18 3 12 3Z"/><circle cx="7.5" cy="12" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="8" r="1"/><circle cx="18" cy="12" r="1"/>',
    'highlighter': '<path d="m9 11 5 5M3 21h18M14 4l6 6-10 10-6-6L14 4Z"/>',
    'list': '<path d="M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01"/>',
    'list-ordered': '<path d="M10 6h11M10 12h11M10 18h11M3 5h2v4M3 12h3l-3 3h3M3 19h3"/>',
    'table': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18M10 3v18M3 15h18"/>',
    'link': '<path d="M10 13a5 5 0 0 0 7 .1l2-2A5 5 0 1 0 12 4l-1 1M14 11a5 5 0 0 0-7-.1l-2 2A5 5 0 1 0 12 20l1-1"/>',
    'quote': '<path d="M3 11h7v9H3v-9ZM14 11h7v9h-7v-9ZM10 4C6 4 3 7 3 11M21 4c-4 0-7 3-7 7"/>',
    'remove-formatting': '<path d="M4 7h13M10 7l-4 12M15 7l-3 12M3 21h18M17 10l4 4M21 10l-4 4"/>',
    'paintbrush': '<path d="m14 6 4 4M15 3l6 6-9 9-6-6 9-9ZM6 12c-3 0-4 2-4 5s-1 4-1 4 7 0 9-5"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    'check': '<path d="m4 12 5 5L20 6"/>',
    'image-plus': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 16 5-5 5 5 3-3 5 5M14 7h6m-3-3v6"/>',
    'more-vertical': '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
    'copy': '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    'restore': '<path d="M3 11a9 9 0 1 1 3 7M3 5v6h6M12 7v5l3 2"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    'maximize': '<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>',
    'tag': '<path d="M3 3h9l9 9-9 9-9-9V3Z"/><circle cx="7.5" cy="7.5" r="1"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>'
  };
  const ico = (name, css = '') => `<svg class="${css}" viewBox="0 0 24 24" aria-hidden="true">${svgPaths[name] || svgPaths.notebook}</svg>`;
  const injectIcons = (root = document) => root.querySelectorAll('[data-icon]').forEach((node) => { node.innerHTML = ico(node.dataset.icon); });
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const id = () => (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : ('note-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
  const PALETTE = [
    { id: 'charcoal', name: 'Charcoal', hex: '#292d35' }, { id: 'forest', name: 'Forest', hex: '#264b3f' },
    { id: 'ocean', name: 'Deep blue', hex: '#294760' }, { id: 'clay', name: 'Warm clay', hex: '#514639' },
    { id: 'plum', name: 'Plum', hex: '#4b3d55' }, { id: 'rust', name: 'Cinnamon', hex: '#69473c' },
    { id: 'sage', name: 'Sage', hex: '#3e5a4c' }, { id: 'ink', name: 'Midnight', hex: '#202b42' },
    { id: 'sand', name: 'Golden', hex: '#66502c' }
  ];
  const COLUMNS = [4, 6, 8, 12];
  const TODAY = Date.now();
  const defaultSettings = { id: 'main', theme: 'dark', sort: 'manual', view: 'grid', wallpaper: null };
  const state = { notes: [], settings: { ...defaultSettings }, filter: 'all', tag: null, search: '', draft: null, editorMode: 'visual', openMenu: null, draggingId: null, editingIsNew: false };
  let database, boardObserver, saveTimer, toastTimer, selectionRange;

  function openDatabase() { return new Promise((resolve, reject) => { if (!('indexedDB' in window)) { reject(new Error('IndexedDB unavailable')); return; } const r = indexedDB.open('jotboard_local_v1', 1); r.onupgradeneeded = () => { const db = r.result; if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath: 'id' }); if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' }); }; r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error || new Error('Could not open database')); }); }
  function dbReq(store, method, arg) { return new Promise((resolve, reject) => { if (!database) { reject(new Error('Database is not available')); return; } const t = database.transaction(store, method === 'put' || method === 'delete' || method === 'clear' ? 'readwrite' : 'readonly'); const req = arg === undefined ? t.objectStore(store)[method]() : t.objectStore(store)[method](arg); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); t.onerror = () => reject(t.error); }); }
  async function putNote(note) { const persistable = { ...note }; delete persistable._temp; await dbReq('notes', 'put', persistable); }
  async function persistSettings() { try { await dbReq('settings', 'put', state.settings); } catch (e) { toast('Could not save settings: ' + e.message); } }
  const isRichEmpty = (html) => !String(html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim();
  function noteHasContent(n) { return Boolean((n.title || '').trim() || (n.type === 'markdown' ? (n.markdown || '').trim() : !isRichEmpty(n.html))); }
  const safeHex = (s) => /^#[a-f0-9]{3,8}$/i.test(s);
  const palette = (value) => (PALETTE.find(x => x.id === value) || PALETTE[0]);
  function safeImgUrl(url) { const val = String(url || '').trim(); return /^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(val) || /^https:\/\/[^\s<>"']+$/i.test(val) ? val : null; }
  function safeLink(url) { const v = String(url || '').trim(); return /^(https?:\/\/|mailto:|tel:|#|\/[^/])/i.test(v) ? v : null; }
  /* Sanitize imported Markdown HTML and the rich-text DOM before displaying or storing it. */
  function sanitizeHTML(html) {
    const parsed = new DOMParser().parseFromString(String(html || ''), 'text/html');
    const allowed = new Set('div p br b strong em i u s del strike span font mark h1 h2 h3 h4 h5 h6 ul ol li blockquote pre code a table thead tbody tfoot tr th td hr img input sup sub'.split(' '));
    const blocked = new Set('script style iframe frame object embed svg math meta link form button textarea select option audio video template noscript base'.split(' '));
    // Only store font families intentionally supported by the Jotboard editor.
    const allowedFonts = ['Arial', 'Georgia', 'Verdana', 'Trebuchet MS', 'Courier New'];
    /* Preserve safe attributes as nodes are walked: no event handlers or javascript: URLs. */
    function clean(parent) {
      for (const child of [...parent.childNodes]) {
        if (child.nodeType === 8) { child.remove(); continue; }
        if (child.nodeType !== 1) continue;
        const tag = child.tagName.toLowerCase();
        if (blocked.has(tag)) { child.remove(); continue; }
        if (!allowed.has(tag)) { clean(child); child.replaceWith(...[...child.childNodes]); continue; }
        const attributes = [...child.attributes];
        const href = child.getAttribute('href'); const src = child.getAttribute('src'); const alt = child.getAttribute('alt'); const title = child.getAttribute('title');
        const cls = child.getAttribute('class'); const inputType = child.getAttribute('type'); const checked = child.hasAttribute('checked'); const disabled = child.hasAttribute('disabled');
        const start = child.getAttribute('start'); const colSpan = child.getAttribute('colspan'); const rowSpan = child.getAttribute('rowspan');
        const color = child.style.color; const bg = child.style.backgroundColor; const align = child.style.textAlign; const weight = child.style.fontWeight; const fontStyle = child.style.fontStyle; const decoration = child.style.textDecorationLine || child.style.textDecoration;
        // Capture styles before stripping unsafe attributes. execCommand may use
        // <span style="font-family:..."> or the legacy <font face="..."> tag.
        const family = child.style.fontFamily || child.getAttribute('face') || '';
        for (const a of attributes) child.removeAttribute(a.name);
        if (tag === 'a') { const good = safeLink(href); if (good) { child.setAttribute('href', good); child.setAttribute('rel', 'noopener noreferrer'); if (/^https?:\/\//.test(good)) child.setAttribute('target', '_blank'); } if (title) child.setAttribute('title', title.slice(0, 200)); }
        if (tag === 'img') { const good = safeImgUrl(src); if (!good) { child.replaceWith(document.createTextNode(alt || '[image]')); continue; } child.setAttribute('src', good); child.setAttribute('alt', (alt || 'Image').slice(0, 250)); child.setAttribute('loading', 'lazy'); }
        if (tag === 'input') { if (inputType !== 'checkbox') { child.remove(); continue; } child.setAttribute('type', 'checkbox'); if (checked) child.setAttribute('checked', ''); if (disabled) child.setAttribute('disabled', ''); else child.setAttribute('disabled', ''); }
        if (cls && /^(?:task-list-item|contains-task-list|language-[\w-]+)(?:\s+(?:task-list-item|contains-task-list|language-[\w-]+))*$/.test(cls)) child.setAttribute('class', cls);
        if (tag === 'ol' && /^\d{1,4}$/.test(start || '')) child.setAttribute('start', start);
        if (['td', 'th'].includes(tag)) { if (/^(?:[1-9]|1[0-2])$/.test(colSpan || '')) child.setAttribute('colspan', colSpan); if (/^(?:[1-9]|1[0-2])$/.test(rowSpan || '')) child.setAttribute('rowspan', rowSpan); }
        const safeColor = (v) => v && (/^#[0-9a-f]{3,8}$/i.test(v) || /^(?:rgb|rgba|hsl|hsla)\([0-9\s.,%]+\)$/i.test(v) || /^[a-z]{3,20}$/i.test(v));
        if (safeColor(color)) child.style.color = color;
        if (safeColor(bg)) child.style.backgroundColor = bg;
        if (/^(?:left|center|right|justify)$/.test(align)) child.style.textAlign = align;
        if (/^(?:normal|bold|bolder|lighter|[1-9]00)$/.test(weight)) child.style.fontWeight = weight;
        if (/^(?:normal|italic|oblique)$/.test(fontStyle)) child.style.fontStyle = fontStyle;
        if (/^(?:none|underline|line-through|overline|underline line-through|line-through underline)$/.test(decoration)) child.style.textDecorationLine = decoration;
        const selectedFamily = family.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
        const fontChoice = allowedFonts.find(font => font.toLowerCase() === selectedFamily);
        if (fontChoice) child.style.fontFamily = fontChoice;
        clean(child);
      }
    }
    // Walk the detached tree before it can be attached to the page.
    clean(parsed.body);
    return parsed.body.innerHTML;
  }
  function markdownToHTML(markdown) { try { return sanitizeHTML(window.marked.parse(String(markdown || ''), { gfm: true, breaks: true, headerIds: false, mangle: false })); } catch (e) { return '<pre>' + esc(markdown || '') + '</pre>'; } }
  function noteHTML(note) { return note.type === 'markdown' ? markdownToHTML(note.markdown) : sanitizeHTML(note.html || ''); }
  const stripHTML = (html) => { const d = document.createElement('div'); d.innerHTML = sanitizeHTML(html); return (d.textContent || '').trim(); };
  function htmlToMarkdown(html) {
    const root = document.createElement('div'); root.innerHTML = sanitizeHTML(html); let result = '';
    const walk = (node, depth = 0) => {
      if (node.nodeType === 3) return node.textContent.replace(/\u00a0/g, ' '); if (node.nodeType !== 1) return ''; const tag = node.tagName.toLowerCase(); const kids = () => [...node.childNodes].map(ch => walk(ch, depth + 1)).join('');
      if (/^h[1-6]$/.test(tag)) return '\n' + '#'.repeat(+tag[1]) + ' ' + kids().trim() + '\n\n';
      if (tag === 'strong' || tag === 'b') return '**' + kids() + '**'; if (tag === 'em' || tag === 'i') return '*' + kids() + '*'; if (tag === 's' || tag === 'del' || tag === 'strike') return '~~' + kids() + '~~';
      if (tag === 'code') return node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre' ? kids() : '`' + kids() + '`';
      if (tag === 'pre') return '\n```\n' + node.textContent.trimEnd() + '\n```\n\n';
      if (tag === 'a') return '[' + kids() + '](' + (node.getAttribute('href') || '#') + ')';
      if (tag === 'img') return '![' + (node.getAttribute('alt') || 'Image') + '](' + (node.getAttribute('src') || '') + ')';
      if (tag === 'br') return '  \n'; if (tag === 'hr') return '\n---\n';
      if (tag === 'blockquote') return '\n' + kids().trim().split('\n').map(line => '> ' + line).join('\n') + '\n\n';
      if (tag === 'ul' || tag === 'ol') return '\n' + [...node.children].map((ch, i) => ((tag === 'ol' ? (i + 1) + '. ' : '- ') + walk(ch, depth).trim()).replace(/\n/g, '\n  ')).join('\n') + '\n\n';
      if (tag === 'li') return kids();
      if (tag === 'table') {
        const rows = [...node.querySelectorAll('tr')].map(tr => [...tr.children].map(td => td.textContent.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim()));
        if (!rows.length) return ''; let n = rows[0].length; return '\n| ' + rows[0].join(' | ') + ' |\n| ' + Array(n).fill('---').join(' | ') + ' |\n' + rows.slice(1).map(r => '| ' + r.join(' | ') + ' |').join('\n') + '\n\n';
      }
      if (tag === 'p' || tag === 'div') return kids().trim() + '\n\n'; return kids();
    };
    result = [...root.childNodes].map(n => walk(n)).join(''); return result.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }
  const noteAsMarkdown = (n) => n.type === 'markdown' ? n.markdown || '' : htmlToMarkdown(n.html || '');

  function elapsed(ts) { const secs = Math.max(0, (Date.now() - Number(ts || Date.now())) / 1000); if (secs < 60) return 'just now'; if (secs < 3600) return Math.floor(secs / 60) + 'm ago'; if (secs < 86400) return Math.floor(secs / 3600) + 'h ago'; if (secs < 172800) return 'yesterday'; return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
  function allTags() { const counts = new Map(); state.notes.filter(n => !n.deleted && !n.archived).forEach(n => (n.tags || []).forEach(t => counts.set(t, (counts.get(t) || 0) + 1))); return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])); }
  function visibleNotes() {
    const q = state.search.trim().toLowerCase(); let notes = state.notes.filter(n => {
      if (state.filter === 'trash') return n.deleted;
      if (n.deleted) return false;
      if (state.filter === 'archived') return n.archived;
      if (n.archived) return false;
      if (state.filter === 'pinned' && !n.pinned) return false;
      if (state.tag && !(n.tags || []).includes(state.tag)) return false;
      return true;
    });
    if (q) notes = notes.filter(n => [n.title, ...(n.tags || []), n.type === 'markdown' ? n.markdown : stripHTML(n.html)].some(t => String(t || '').toLowerCase().includes(q)));
    const sort = state.settings.sort;
    notes.sort((a, b) => {
      if (state.filter !== 'trash' && a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (sort === 'recent') return b.updatedAt - a.updatedAt;
      if (sort === 'oldest') return a.createdAt - b.createdAt;
      if (sort === 'title') return (a.title || '').localeCompare(b.title || '');
      return (a.order ?? 9999) - (b.order ?? 9999);
    });
    return notes;
  }
  function renderNavigation() {
    const all = state.notes.filter(n => !n.deleted && !n.archived).length;
    $('countAll').textContent = all.toString();
    document.querySelectorAll('.side-link[data-filter]').forEach(b => b.classList.toggle('is-active', b.dataset.filter === state.filter && !state.tag));
    const tags = allTags(); $('tagsNav').innerHTML = tags.length ? tags.map(([tag, count]) => `<button type="button" class="tag-link ${state.tag === tag ? 'is-active' : ''}" data-tag="${esc(tag)}">${ico('tag', 'sm')}<span>${esc(tag)}</span><span>${count}</span></button>`).join('') : '';
    const name = state.tag ? '#' + state.tag : ({ all: 'All notes', pinned: 'Pinned', archived: 'Archive', trash: 'Trash' }[state.filter] || 'All notes');
    $('currentSectionName').textContent = name;
    $('boardHeading').textContent = state.search ? 'Search results' : state.tag ? name : ({ all: 'Notes', pinned: 'Pinned', archived: 'Archive', trash: 'Trash' }[state.filter] || 'Notes');
    $('sortSelect').value = state.settings.sort;
    for (const [buttonId, value] of [['gridView','grid'], ['customView','custom'], ['listView','list']]) {
      const active = state.settings.view === value;
      $(buttonId).classList.toggle('is-active', active);
      $(buttonId).setAttribute('aria-pressed', String(active));
    }
    // Hide the new-note menu if the quick composer is unavailable.
    $('quickCompose').hidden = state.filter === 'trash';
    if (state.filter === 'trash') hideNoteTypeMenu();
  }
  function renderCard(note) {
    const bg = palette(note.color); const img = safeImgUrl(note.backgroundImage); const width = COLUMNS.includes(Number(note.width)) ? Number(note.width) : 4;
    const cardBg = img ? `background-image:url(&quot;${esc(img)}&quot;);` : '';
    const content = noteHTML(note);
    const plain = note.type === 'markdown' ? note.markdown || '' : stripHTML(note.html || '');
    const isLong = plain.length > 210 || /\<table|\<pre|\<ul|\<ol/i.test(content) && plain.length > 110;
    const menu = state.openMenu === note.id ? `<div class="note-menu" data-menu="1"><div class="menu-header">WIDTH</div>${[4, 6, 8, 12].map((w, i) => `<button type="button" data-action="width" data-width="${w}" class="${width === w ? 'selected' : ''}">${ico('move-horizontal', 'sm')} ${['Compact', 'Medium', 'Wide', 'Full width'][i]}${width === w ? ' · ✓' : ''}</button>`).join('')}<hr/>${note.deleted ? `<button type="button" data-action="restore">${ico('restore')} Restore note</button><button type="button" data-action="delete-forever">${ico('trash')} Delete forever</button>` : `<button type="button" data-action="duplicate">${ico('copy')} Duplicate</button><button type="button" data-action="export">${ico('download')} Export .md</button><button type="button" data-action="${note.archived ? 'unarchive' : 'archive'}">${ico('archive')} ${note.archived ? 'Unarchive' : 'Archive'}</button><button type="button" data-action="trash">${ico('trash')} Move to trash</button>`}</div>` : '';
    return `<article tabindex="0" draggable="${note.deleted ? 'false' : 'true'}" role="button" aria-label="Open ${esc(note.title || 'Untitled note')}" data-id="${esc(note.id)}" data-type="${note.type === 'markdown' ? 'markdown' : 'rich'}" data-width="${width}" class="note-card ${img ? 'has-image' : ''} ${note.deleted ? 'is-trash' : ''} ${state.openMenu === note.id ? 'has-open-menu' : ''}" style="--span:${width};--note-bg:${bg.hex};--note-ink:#f7f8fa;${cardBg}">
      <div class="note-heading"><h3>${esc(note.title || 'Untitled note')}</h3>${note.type === 'markdown' ? `<span class="note-kind" title="Markdown Note">MD</span>` : ''}${note.pinned ? `<span class="pin-indicator" title="Pinned">${ico('pin', 'sm')}</span>` : ''}</div>
      <div class="note-preview ${isLong ? 'is-long' : ''}">${content ? `<div class="note-content">${content}</div>` : '<div class="note-preview-empty">Empty note — click to write</div>'}</div>
      ${(note.tags || []).length ? `<div class="note-meta">${note.tags.slice(0, 4).map(t => `<span class="note-chip">#${esc(t)}</span>`).join('')}</div>` : '<div class="note-meta"></div>'}
      <div class="note-footer"><span class="note-date">${esc(elapsed(note.updatedAt))}</span>${note.deleted ? `<button class="card-button" data-action="restore" title="Restore">${ico('restore')}</button>` : `<button class="card-button ${note.pinned ? 'active' : ''}" data-action="pin" title="${note.pinned ? 'Unpin' : 'Pin'}">${ico('pin')}</button>`}<button class="card-button" data-action="menu" title="More options" aria-label="More options">${ico('more-vertical')}</button></div>${menu}
    </article>`;
  }
  function measureGrid() {
    if (boardObserver) boardObserver.disconnect();
    if (state.settings.view === 'list') return;
    boardObserver = new ResizeObserver(entries => {
      // Masonry-style rows are only needed for grids, not the list layout.
      for (const entry of entries) {
        const card = entry.target;
        const height = entry.borderBoxSize?.[0]?.blockSize || card.getBoundingClientRect().height;
        const computed = getComputedStyle($('notesGrid'));
        const rowHeight = parseFloat(computed.gridAutoRows) || 8;
        const gap = parseFloat(computed.rowGap) || 17;
        card.style.setProperty('--row-span', String(Math.max(1, Math.ceil((height + gap) / (rowHeight + gap)))));
      }
    });
    document.querySelectorAll('.note-card').forEach(card => boardObserver.observe(card));
  }
  function renderBoard() {
    renderNavigation();
    const notes = visibleNotes();
    $('resultsCount').textContent = String(notes.length);
    const board = $('notesGrid');
    board.classList.toggle('is-list', state.settings.view === 'list');
    board.classList.toggle('is-compact', state.settings.view === 'grid');
    board.classList.toggle('is-custom', state.settings.view === 'custom');
    board.innerHTML = notes.map(renderCard).join('');
    $('emptyState').hidden = notes.length > 0;
    if (!notes.length) $('emptyHeading').textContent = state.filter === 'trash' ? 'Trash is empty' : state.search ? 'No matching notes' : 'No notes yet';
    measureGrid();
  }
  function useSettings() { document.body.dataset.theme = state.settings.theme; $('themeToggle').innerHTML = ico(state.settings.theme === 'dark' ? 'sun' : 'moon'); const url = safeImgUrl(state.settings.wallpaper); const main = document.querySelector('.main-shell'); main.classList.toggle('has-wallpaper', Boolean(url)); if (url) main.style.setProperty('--wallpaper', `url("${url}")`); else main.style.removeProperty('--wallpaper'); }
  function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3300); }
  async function saveSingle(note) { try { await putNote(note); return true; } catch (e) { console.error(e); toast('Could not save this note. Check browser storage or image size.'); return false; } }
  async function setNote(id, changes) { const note = state.notes.find(n => n.id === id); if (!note) return; Object.assign(note, changes, { updatedAt: Date.now() }); if (await saveSingle(note)) renderBoard(); }
  async function handleCardAction(action, note, button) {
    if (action === 'menu') { state.openMenu = state.openMenu === note.id ? null : note.id; renderBoard(); return; }
    if (action === 'pin') { await setNote(note.id, { pinned: !note.pinned }); toast(note.pinned ? 'Note pinned' : 'Note unpinned'); return; }
    if (action === 'width') {
      state.openMenu = null;
      // Width applies in Flexible grid; Compact/List must not be overridden.
      state.settings.view = 'custom';
      await Promise.all([setNote(note.id, { width: Number(button.dataset.width) }), persistSettings()]);
      renderBoard();
      toast('Card width updated');
      return;
    }
    if (action === 'duplicate') { const copy = { ...note, id: id(), title: (note.title || 'Untitled') + ' (copy)', pinned: false, createdAt: Date.now(), updatedAt: Date.now(), order: state.notes.length }; state.notes.push(copy); await saveSingle(copy); state.openMenu = null; renderBoard(); toast('Note duplicated'); return; }
    if (action === 'export') { downloadText((note.title || 'Untitled') + '.md', noteAsMarkdown(note), 'text/markdown;charset=utf-8'); state.openMenu = null; renderBoard(); return; }
    if (action === 'archive' || action === 'unarchive') { await setNote(note.id, { archived: action === 'archive', pinned: false }); state.openMenu = null; toast(action === 'archive' ? 'Note archived' : 'Note returned'); return; }
    if (action === 'trash') { await setNote(note.id, { deleted: true, pinned: false }); state.openMenu = null; toast('Note moved to trash'); return; }
    if (action === 'restore') { await setNote(note.id, { deleted: false, archived: false }); state.openMenu = null; toast('Note restored'); return; }
    if (action === 'delete-forever') { if (!confirm('Delete this note permanently? This cannot be undone.')) return; state.notes = state.notes.filter(n => n.id !== note.id); await dbReq('notes', 'delete', note.id); state.openMenu = null; renderBoard(); toast('Note deleted permanently'); }
  }
  function renderSwatches() { if (!state.draft) return; $('backgroundColors').innerHTML = PALETTE.map(p => `<button type="button" class="color-swatch ${p.id === state.draft.color ? 'selected' : ''}" style="--swatch:${p.hex}" data-color="${p.id}" title="${esc(p.name)}" aria-label="${esc(p.name)}"></button>`).join(''); $('backgroundImageStatus').hidden = !state.draft.backgroundImage; }
  function draftFrom(note) { return JSON.parse(JSON.stringify(note)); }
  function blankNote(type = 'rich') { return { id: id(), title: '', type: type === 'markdown' ? 'markdown' : 'rich', html: '', markdown: '', color: 'charcoal', width: 4, pinned: false, tags: [], archived: false, deleted: false, createdAt: Date.now(), updatedAt: Date.now(), order: state.notes.length, backgroundImage: null, editorWidth: 800 }; }
  // Rich Text and Markdown are permanent note formats, not interchangeable tabs.
  // Preview never changes the stored content or its formatting.
  function displayEditorMode(mode) {
    if (!state.draft) return;
    const isMarkdown = state.draft.type === 'markdown';
    const editableMode = isMarkdown ? 'markdown' : 'visual';
    if (mode !== editableMode && mode !== 'preview') mode = editableMode;
    state.editorMode = mode;
    document.querySelectorAll('.editor-tab').forEach(button => {
      button.hidden = button.dataset.mode !== 'preview' && button.dataset.mode !== editableMode;
      const active = button.dataset.mode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    $('editorToolbar').hidden = mode !== 'visual';
    $('richEditor').hidden = mode !== 'visual';
    $('markdownEditor').hidden = mode !== 'markdown';
    $('previewEditor').hidden = mode !== 'preview';
    if (mode === 'preview') $('previewEditor').innerHTML = noteHTML(state.draft);
  }
  function openEditor(noteId = null, newType = 'rich') {
    const original = noteId ? state.notes.find(n => n.id === noteId) : null;
    if (noteId && !original) return;
    hideNoteTypeMenu();
    state.editingIsNew = !original;
    state.draft = draftFrom(original || blankNote(newType));
    state.openMenu = null;
    $('editorTitle').value = state.draft.title || '';
    $('richEditor').innerHTML = sanitizeHTML(state.draft.html || '');
    $('markdownEditor').value = state.draft.markdown || '';
    $('editorTags').value = (state.draft.tags || []).join(', ');
    const editorWidth = [600, 800, 1040].reduce((a, b) => Math.abs(b - (Number(state.draft.editorWidth) || 800)) < Math.abs(a - (Number(state.draft.editorWidth) || 800)) ? b : a);
    state.draft.editorWidth = editorWidth;
    $('editorWidthSelect').value = String(editorWidth);
    $('editorModal').style.setProperty('--editor-width', editorWidth + 'px');
    $('editorModal').dataset.noteType = state.draft.type === 'markdown' ? 'markdown' : 'rich';
    $('editorPin').classList.toggle('is-on', state.draft.pinned);
    $('editorKind').textContent = state.draft.type === 'markdown' ? 'Markdown' : 'Rich text';
    $('editorStatus').textContent = state.editingIsNew ? 'New note' : 'Editing note';
    $('saveStatus').textContent = 'Saved';
    renderSwatches();
    displayEditorMode(state.draft.type === 'markdown' ? 'markdown' : 'visual');
    $('editorOverlay').hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (state.editingIsNew) $('editorTitle').focus();
      else if (state.draft?.type === 'markdown') $('markdownEditor').focus();
      else $('richEditor').focus();
    }, 40);
  }
  function getLatestEditorContent() { if (!state.draft) return; if (state.draft.type === 'markdown') state.draft.markdown = $('markdownEditor').value; else state.draft.html = sanitizeHTML($('richEditor').innerHTML); }
  async function saveDraft() {
    if (!state.draft) return;
    getLatestEditorContent(); state.draft.title = $('editorTitle').value.trim(); state.draft.tags = $('editorTags').value.split(',').map(s => s.trim()).filter(Boolean).slice(0, 12);
    state.draft.editorWidth = Number($('editorWidthSelect').value) || 800;
    if (!noteHasContent(state.draft)) { $('saveStatus').textContent = 'Start writing to save'; return; }
    state.draft.updatedAt = Date.now(); let existed = state.notes.find(n => n.id === state.draft.id); const clone = draftFrom(state.draft);
    if (!await saveSingle(clone)) { $('saveStatus').textContent = 'Save failed'; return; }
    if (existed) Object.assign(existed, clone); else state.notes.push(clone);
    state.editingIsNew = false; $('editorStatus').textContent = 'Editing note'; $('saveStatus').textContent = 'Saved'; renderBoard();
  }
  function queueSave() { if (!state.draft) return; $('saveStatus').textContent = 'Saving...'; clearTimeout(saveTimer); saveTimer = setTimeout(() => { saveDraft().catch(console.error); }, 520); }
  async function closeEditor() { if (!state.draft) return; clearTimeout(saveTimer); await saveDraft(); state.draft = null; $('editorOverlay').hidden = true; document.body.style.overflow = ''; selectionRange = null; renderBoard(); }
  function changeEditorMode(mode) {
    if (!state.draft || mode === state.editorMode) return;
    const editableMode = state.draft.type === 'markdown' ? 'markdown' : 'visual';
    if (mode !== editableMode && mode !== 'preview') return;
    getLatestEditorContent();
    displayEditorMode(mode);
    // Switching to Preview or back is display-only. No Markdown conversion.
  }
  function saveSelection() { const sel = window.getSelection(); if (sel && sel.rangeCount && $('richEditor').contains(sel.anchorNode)) selectionRange = sel.getRangeAt(0).cloneRange(); }
  function restoreSelection() { if (selectionRange) { const sel = window.getSelection(); sel.removeAllRanges(); try { sel.addRange(selectionRange); } catch (e) { $('richEditor').focus(); } } else $('richEditor').focus(); }
  function execRich(cmd, val = null) { if (!state.draft || state.editorMode !== 'visual') return; restoreSelection(); try { document.execCommand('styleWithCSS', false, true); document.execCommand(cmd, false, val); } catch (e) { toast('Your browser could not apply this formatting'); } saveSelection(); state.draft.html = sanitizeHTML($('richEditor').innerHTML); queueSave(); }
  function insertHTML(html) { execRich('insertHTML', sanitizeHTML(html)); }
  function richAction(action) {
    switch (action) {
      case 'h1': case 'h2': case 'h3': execRich('formatBlock', action); break;
      case 'normal': execRich('formatBlock', 'p'); break;
      case 'bold': execRich('bold'); break; case 'italic': execRich('italic'); break; case 'underline': execRich('underline'); break; case 'strike': execRich('strikeThrough'); break;
      case 'bullets': execRich('insertUnorderedList'); break; case 'numbers': execRich('insertOrderedList'); break;
      case 'quote': execRich('formatBlock', 'blockquote'); break;
      case 'checklist': insertHTML('<ul><li>☐ First task</li><li>☐ Next task</li></ul>'); break;
      case 'table': { const html = '<table><thead><tr><th>Column 1</th><th>Column 2</th><th>Column 3</th></tr></thead><tbody><tr><td>Cell</td><td>Cell</td><td>Cell</td></tr><tr><td>Cell</td><td>Cell</td><td>Cell</td></tr></tbody></table><p><br></p>'; insertHTML(html); toast('Table inserted — click a cell to edit'); break; }
      case 'link': { const input = prompt('Enter link URL (https://...)'); if (!input) return; const url = safeLink(input); if (!url) { toast('Please use a valid https:// or http:// URL'); return; } execRich('createLink', url); break; }
      case 'clear': execRich('removeFormat'); break;
    }
  }
  function parseTSV(text) { const lines = text.trim().split(/\r?\n/).filter(Boolean); const cells = lines.map(line => line.split('\t')); if (cells.length < 2 || cells.some(r => r.length < 2) || cells.length > 120) return null; return '<table><thead><tr>' + cells[0].map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + cells.slice(1).map(row => '<tr>' + row.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table><p><br></p>'; }
  function handleRichPaste(e) {
    const plain = e.clipboardData?.getData('text/plain') || ''; const table = plain.includes('\t') ? parseTSV(plain) : null;
    if (table) { e.preventDefault(); insertHTML(table); toast('Pasted as an editable table'); return; }
    const html = e.clipboardData?.getData('text/html'); if (html) { e.preventDefault(); insertHTML(sanitizeHTML(html)); }
  }

  function downloadText(filename, body, mime) { const blob = new Blob([body], { type: mime || 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename.replace(/[\\/:*?"<>|]/g, '_').slice(0, 180); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1200); }
  function loadImage(file, maxWidth = 1700, maxHeight = 1100) {
    return new Promise((resolve, reject) => {
      if (!file || !/^image\/(png|jpeg|webp|gif)$/.test(file.type)) { reject(new Error('Choose PNG, JPEG, WebP or GIF')); return; }
      if (file.size > 12 * 1024 * 1024) { reject(new Error('Image is too large. Please choose one under 12 MB.')); return; }
      const objectUrl = URL.createObjectURL(file); const img = new Image();
      img.onload = () => { try { const ratio = Math.min(1, maxWidth / img.naturalWidth, maxHeight / img.naturalHeight); const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio)); canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio)); const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height); const data = canvas.toDataURL('image/jpeg', .78); URL.revokeObjectURL(objectUrl); resolve(data); } catch (e) { URL.revokeObjectURL(objectUrl); reject(e); } };
      img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Could not read this image')); }; img.src = objectUrl;
    });
  }
  async function importMarkdown(files) {
    if (!files.length) return; let added = 0;
    for (const file of files) { if (!/\.(md|markdown|txt)$/i.test(file.name) && file.type !== 'text/markdown') continue; try { const source = await file.text(); const first = source.match(/^\s*#\s+(.+)$/m); const title = (first ? first[1].trim() : file.name.replace(/\.(md|markdown|txt)$/i, '')) || 'Imported note'; const n = { ...blankNote(), title, type: 'markdown', markdown: source, color: 'ocean', width: 6, tags: ['Imported'], createdAt: Date.now(), updatedAt: Date.now() }; state.notes.push(n); if (await saveSingle(n)) added++; } catch (e) { console.error(e); toast('Could not import ' + file.name); } }
    state.filter = 'all'; state.tag = null; state.search = ''; $('searchInput').value = ''; renderBoard(); toast(added + ' Markdown ' + (added === 1 ? 'note' : 'notes') + ' imported');
  }
  async function exportBackup() {
    if (!database) { toast('Wait for your notes to finish loading.'); return false; }
    try {
      // Read the saved data directly from IndexedDB to avoid an incomplete backup.
      if (state.draft) { clearTimeout(saveTimer); await saveDraft(); }
      const [notes, savedSettings] = await Promise.all([
        dbReq('notes', 'getAll'), dbReq('settings', 'get', 'main')
      ]);
      const out = {
        format: 'jotboard-backup', version: 1,
        exportedAt: new Date().toISOString(),
        notes, settings: savedSettings || state.settings
      };
      const filename = 'jotboard-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      downloadText(filename, JSON.stringify(out, null, 2), 'application/json;charset=utf-8');
      toast('JSON backup downloaded (' + notes.length + ' notes)');
      return true;
    } catch (e) {
      console.error('JSON backup failed', e);
      toast('Could not download JSON backup: ' + e.message);
      return false;
    }
  }
  function showBackupInfo(isOpen) {
    $('backupInfoPopover').hidden = !isOpen;
    $('backupInfoButton').setAttribute('aria-expanded', String(isOpen));
  }
  async function restoreBackup(file) {
    try {
      const raw = await file.text(); const data = JSON.parse(raw); if (data?.format !== 'jotboard-backup' || !Array.isArray(data.notes)) throw new Error('Not a Jotboard backup'); if (data.notes.length > 10000) throw new Error('Backup contains too many notes');
      if (!confirm('Restore this backup? This REPLACES all current notes in this browser. Export your existing notes first if needed.')) return;
      const restored = data.notes.map((n, i) => ({ id: typeof n.id === 'string' ? n.id : id(), title: String(n.title || '').slice(0, 180), type: n.type === 'markdown' ? 'markdown' : 'rich', html: sanitizeHTML(String(n.html || '')), markdown: String(n.markdown || ''), color: palette(n.color).id, width: COLUMNS.includes(Number(n.width)) ? Number(n.width) : 4, pinned: !!n.pinned, tags: Array.isArray(n.tags) ? n.tags.filter(t => typeof t === 'string').map(t => t.slice(0, 65)).slice(0, 12) : [], archived: !!n.archived, deleted: !!n.deleted, createdAt: Number(n.createdAt) || Date.now(), updatedAt: Number(n.updatedAt) || Date.now(), order: Number.isFinite(n.order) ? n.order : i, backgroundImage: safeImgUrl(n.backgroundImage), editorWidth: Number(n.editorWidth) || 800 }));
      await dbReq('notes', 'clear'); for (const n of restored) await putNote(n); state.notes = restored;
      if (data.settings) { state.settings = { ...defaultSettings, ...data.settings, id: 'main', theme: data.settings.theme === 'light' ? 'light' : 'dark', sort: ['manual', 'recent', 'oldest', 'title'].includes(data.settings.sort) ? data.settings.sort : 'manual', view: ['grid', 'custom', 'list'].includes(data.settings.view) ? data.settings.view : 'grid', wallpaper: safeImgUrl(data.settings.wallpaper) }; await persistSettings(); useSettings(); }
      state.filter = 'all'; state.tag = null; state.search = ''; $('searchInput').value = ''; renderBoard(); closeSettings(); toast('Backup restored: ' + restored.length + ' notes');
    } catch (e) { console.error(e); toast('Could not restore backup: ' + e.message); }
  }
  function showSettings() { $('settingsOverlay').hidden = false; document.body.style.overflow = 'hidden'; }
  function closeSettings() { $('settingsOverlay').hidden = true; if ($('editorOverlay').hidden) document.body.style.overflow = ''; }
  function setFilter(filter, tag = null) { state.filter = filter; state.tag = tag; state.openMenu = null; renderBoard(); $('sidebar').classList.remove('is-open'); $('mobileScrim').hidden = true; }
  function hideNoteTypeMenu() {
    $('noteTypeMenu').hidden = true;
    $('quickCompose').setAttribute('aria-expanded', 'false');
    $('newSidebar').setAttribute('aria-expanded', 'false');
  }
  function toggleNoteTypeMenu(force) {
    if (state.filter === 'trash') setFilter('all');
    const willShow = typeof force === 'boolean' ? force : $('noteTypeMenu').hidden;
    $('noteTypeMenu').hidden = !willShow;
    $('quickCompose').setAttribute('aria-expanded', String(willShow));
    $('newSidebar').setAttribute('aria-expanded', String(willShow));
    if (willShow) $('noteTypeMenu').querySelector('[data-new-type="rich"]').focus();
  }
  function eventListeners() {
    injectIcons();
    $('newSidebar').addEventListener('click', () => {
      $('sidebar').classList.remove('is-open');
      $('mobileScrim').hidden = true;
      toggleNoteTypeMenu(true);
    });
    $('quickCompose').addEventListener('click', () => toggleNoteTypeMenu());
    $('noteTypeMenu').addEventListener('click', e => {
      const choice = e.target.closest('[data-new-type]');
      if (!choice) return;
      openEditor(null, choice.dataset.newType);
    });
    document.addEventListener('click', e => {
      if (!$('noteTypeMenu').hidden && !e.target.closest('#composeWrap') && !e.target.closest('#newSidebar')) hideNoteTypeMenu();
    });
    document.querySelectorAll('.side-link[data-filter]').forEach(btn => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));
    $('tagsNav').addEventListener('click', e => { const b = e.target.closest('[data-tag]'); if (b) setFilter('all', b.dataset.tag); });
    $('searchInput').addEventListener('input', e => { state.search = e.target.value; renderBoard(); });
    $('sortSelect').addEventListener('change', async e => { state.settings.sort = e.target.value; await persistSettings(); renderBoard(); });
    for (const [buttonId, view] of [['gridView','grid'],['customView','custom'],['listView','list']]) {
      $(buttonId).addEventListener('click', async () => {
        state.settings.view = view;
        await persistSettings();
        renderBoard();
      });
    }
    $('themeToggle').addEventListener('click', async () => { state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark'; useSettings(); await persistSettings(); });
    $('backupInfoButton').addEventListener('click', () => showBackupInfo($('backupInfoPopover').hidden));
    $('downloadJsonBackup').addEventListener('click', async () => {
      if (await exportBackup()) showBackupInfo(false);
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('#backupInfoWrap')) showBackupInfo(false);
    });
    $('importMarkdownTop').addEventListener('click', () => $('markdownFileInput').click());
    $('mobileMenu').addEventListener('click', () => { $('sidebar').classList.toggle('is-open'); $('mobileScrim').hidden = !$('sidebar').classList.contains('is-open'); });
    $('mobileScrim').addEventListener('click', () => { $('sidebar').classList.remove('is-open'); $('mobileScrim').hidden = true; });
    $('notesGrid').addEventListener('click', async e => { const card = e.target.closest('.note-card'); if (!card) return; const note = state.notes.find(n => n.id === card.dataset.id); if (!note) return; const btn = e.target.closest('[data-action]'); if (btn) { e.stopPropagation(); await handleCardAction(btn.dataset.action, note, btn); } else if (!e.target.closest('.note-menu')) openEditor(note.id); });
    $('notesGrid').addEventListener('keydown', e => { if (e.target.classList.contains('note-card') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openEditor(e.target.dataset.id); } });
    $('notesGrid').addEventListener('dragstart', e => { if (e.target.closest('button') || state.filter === 'trash') { e.preventDefault(); return; } const card = e.target.closest('.note-card'); if (!card) return; state.draggingId = card.dataset.id; card.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', card.dataset.id); });
    $('notesGrid').addEventListener('dragover', e => { if (!state.draggingId) return; const card = e.target.closest('.note-card'); if (card && card.dataset.id !== state.draggingId) { e.preventDefault(); document.querySelectorAll('.note-card.drop-target').forEach(x => x.classList.remove('drop-target')); card.classList.add('drop-target'); } });
    $('notesGrid').addEventListener('drop', async e => { if (!state.draggingId) return; const target = e.target.closest('.note-card'); const from = state.draggingId; state.draggingId = null; if (!target || target.dataset.id === from) return; e.preventDefault(); let ordered = [...state.notes].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)); const move = ordered.find(n => n.id === from); if (!move) return; ordered = ordered.filter(n => n.id !== from); const ix = ordered.findIndex(n => n.id === target.dataset.id); ordered.splice(Math.max(0, ix), 0, move); state.settings.sort = 'manual'; const changed = []; ordered.forEach((n, i) => { if (n.order !== i) { n.order = i; changed.push(n); } }); await Promise.all(changed.map(putNote)); await persistSettings(); renderBoard(); toast('Custom order saved'); });
    $('notesGrid').addEventListener('dragend', () => { state.draggingId = null; document.querySelectorAll('.note-card.dragging,.note-card.drop-target').forEach(x => x.classList.remove('dragging', 'drop-target')); });
    document.addEventListener('click', e => { if (state.openMenu && !e.target.closest('.note-menu') && !e.target.closest('[data-action="menu"]')) { state.openMenu = null; renderBoard(); } });

    $('editorClose').addEventListener('click', closeEditor); $('editorDone').addEventListener('click', closeEditor);
    $('editorOverlay').addEventListener('mousedown', e => { if (e.target === $('editorOverlay')) closeEditor(); });
    $('editorTitle').addEventListener('input', queueSave); $('editorTags').addEventListener('input', queueSave);
    $('editorWidthSelect').addEventListener('change', e => { $('editorModal').style.setProperty('--editor-width', e.target.value + 'px'); queueSave(); });
    $('editorPin').addEventListener('click', () => { state.draft.pinned = !state.draft.pinned; $('editorPin').classList.toggle('is-on', state.draft.pinned); queueSave(); });
    $('richEditor').addEventListener('input', () => { state.draft.html = sanitizeHTML($('richEditor').innerHTML); queueSave(); });
    $('richEditor').addEventListener('paste', handleRichPaste);
    $('richEditor').addEventListener('keyup', saveSelection); $('richEditor').addEventListener('mouseup', saveSelection);
    $('markdownEditor').addEventListener('input', () => { state.draft.markdown = $('markdownEditor').value; queueSave(); });
    document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => changeEditorMode(b.dataset.mode)));
    $('editorToolbar').addEventListener('mousedown', e => { if (e.target.closest('button[data-format]')) { e.preventDefault(); saveSelection(); } });
    // Do not crash if an older copy of index.html lacks the font dropdown.
    const fontSelect = $('fontSelect');
    if (fontSelect) {
      fontSelect.addEventListener('pointerdown', saveSelection);
      fontSelect.addEventListener('change', e => {
        const font = e.target.value;
        if (font) execRich('fontName', font);
        e.target.value = '';
      });
    }
    $('editorToolbar').addEventListener('click', e => { const b = e.target.closest('button[data-format]'); if (b) richAction(b.dataset.format); });
    $('textColorInput').addEventListener('pointerdown', saveSelection);
    $('textColorInput').addEventListener('input', e => { if (safeHex(e.target.value)) execRich('foreColor', e.target.value); });
    $('highlightColorInput').addEventListener('pointerdown', saveSelection);
    $('highlightColorInput').addEventListener('input', e => { if (safeHex(e.target.value)) execRich('hiliteColor', e.target.value); });
    $('backgroundColors').addEventListener('click', e => { const b = e.target.closest('[data-color]'); if (!b || !state.draft) return; state.draft.color = b.dataset.color; renderSwatches(); queueSave(); });
    $('backgroundUploadBtn').addEventListener('click', () => $('backgroundFileInput').click());
    $('removeNoteBackground').addEventListener('click', () => { state.draft.backgroundImage = null; renderSwatches(); queueSave(); toast('Note background removed'); });
    $('backgroundFileInput').addEventListener('change', async e => { const f = e.target.files[0]; if (!f || !state.draft) return; try { state.draft.backgroundImage = await loadImage(f); renderSwatches(); queueSave(); toast('Custom note background applied'); } catch (err) { toast(err.message); } e.target.value = ''; });
    $('exportCurrentMd').addEventListener('click', () => { if (!state.draft) return; getLatestEditorContent(); state.draft.title = $('editorTitle').value; downloadText((state.draft.title || 'Untitled') + '.md', noteAsMarkdown(state.draft), 'text/markdown;charset=utf-8'); });
    $('deleteCurrent').addEventListener('click', async () => { if (!state.draft) return; if (!noteHasContent(state.draft) && state.editingIsNew) { state.draft = null; $('editorOverlay').hidden = true; document.body.style.overflow = ''; return; } const old = state.notes.find(n => n.id === state.draft.id); if (old) { old.deleted = true; old.pinned = false; old.updatedAt = Date.now(); await putNote(old); } else { const n = draftFrom(state.draft); n.deleted = true; n.pinned = false; state.notes.push(n); await putNote(n); } clearTimeout(saveTimer); state.draft = null; $('editorOverlay').hidden = true; document.body.style.overflow = ''; renderBoard(); toast('Note moved to trash'); });

    $('openSettings').addEventListener('click', showSettings); $('avatarSettings').addEventListener('click', showSettings);
    $('settingsClose').addEventListener('click', closeSettings); $('settingsOverlay').addEventListener('mousedown', e => { if (e.target === $('settingsOverlay')) closeSettings(); });
    $('chooseWallpaper').addEventListener('click', () => $('wallpaperFileInput').click());
    $('removeWallpaper').addEventListener('click', async () => { state.settings.wallpaper = null; useSettings(); await persistSettings(); toast('Workspace wallpaper removed'); });
    $('wallpaperFileInput').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; try { state.settings.wallpaper = await loadImage(f, 1900, 1200); useSettings(); await persistSettings(); toast('Workspace wallpaper applied'); } catch (err) { toast(err.message); } e.target.value = ''; });
    $('exportBackup').addEventListener('click', exportBackup); $('importBackup').addEventListener('click', () => $('jsonFileInput').click());
    $('settingsImportMd').addEventListener('click', () => $('markdownFileInput').click());
    $('markdownFileInput').addEventListener('change', async e => { const fs = [...e.target.files]; await importMarkdown(fs); e.target.value = ''; closeSettings(); });
    $('jsonFileInput').addEventListener('change', async e => { if (e.target.files[0]) await restoreBackup(e.target.files[0]); e.target.value = ''; });
    document.addEventListener('keydown', e => {
      const mod = e.ctrlKey || e.metaKey; const target = e.target; const typing = target.matches('input,textarea,[contenteditable=true],select') || !!target.closest('[contenteditable=true]');
      if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); if (!$('editorOverlay').hidden) closeEditor(); $('searchInput').focus(); $('searchInput').select(); return; }
      if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); if (state.draft) { clearTimeout(saveTimer); saveDraft(); toast('Note saved'); } else exportBackup(); return; }
      if (e.key === 'Escape') { if (!$('noteTypeMenu').hidden) { hideNoteTypeMenu(); $('quickCompose').focus(); return; } if (!$('backupInfoPopover').hidden) { showBackupInfo(false); $('backupInfoButton').focus(); return; } if (!$('settingsOverlay').hidden) closeSettings(); else if (!$('editorOverlay').hidden) closeEditor(); else if (state.openMenu) { state.openMenu = null; renderBoard(); } return; }
      if (!typing && !mod && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'n' && $('editorOverlay').hidden && $('settingsOverlay').hidden) { e.preventDefault(); toggleNoteTypeMenu(true); }
    });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && state.draft) { clearTimeout(saveTimer); saveDraft(); } });
  }
  async function initialize() {
    eventListeners();
    try {
      database = await openDatabase(); let [notes, settings] = await Promise.all([dbReq('notes', 'getAll'), dbReq('settings', 'get', 'main')]);
      if (!settings) { settings = { ...defaultSettings }; await dbReq('settings', 'put', settings); }
      state.settings = { ...defaultSettings, ...settings }; state.notes = notes;
      $('downloadJsonBackup').disabled = false;
      $('exportBackup').disabled = false;
    } catch (e) {
      console.error('Could not open Jotboard storage', e);
      $('notesGrid').innerHTML = '<p style="color:#ffa9a9">Could not open saved notes. Please check browser storage.</p>';
      toast('Local storage unavailable: ' + e.message);
      return;
    }
    // A display/formatting problem is not a database failure.
    try { useSettings(); renderBoard(); }
    catch (e) {
      console.error('Could not display Jotboard notes', e);
      $('notesGrid').innerHTML = '<p style="color:#ffa9a9">Could not display notes. Check the browser Console for details.</p>';
      toast('Could not display notes: ' + e.message);
    }
  }
  initialize();
})();
