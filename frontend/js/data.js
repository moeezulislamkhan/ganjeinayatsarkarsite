/* Data loading + small DOM helpers. Content files live in data/*.json (see the Data Input Guide). */
(function () {
  "use strict";
  var i18n = window.GIS.i18n;
  var cache = {};

  function load(name) {
    if (!cache[name]) {
      cache[name] = fetch("data/" + name + ".json", { headers: { Accept: "application/json" } })
        .then(function (res) { if (!res.ok) throw new Error(name + ": HTTP " + res.status); return res.json(); })
        .catch(function (err) { delete cache[name]; throw err; });
    }
    return cache[name];
  }
  // Load several files; a missing/invalid file gives null for that file instead of breaking the page.
  function loadMany(names) {
    return Promise.all(names.map(function (n) {
      return load(n).catch(function (e) { console.error("[data] could not load " + n + ".json", e); return null; });
    })).then(function (list) { var out = {}; names.forEach(function (n, i) { out[n] = list[i]; }); return out; });
  }

  /* ---- bilingual helpers ---- */
  function other(l) { return l === "ur" ? "en" : "ur"; }
  // {ur,en} or plain string -> text in the current language (falls back to the other language)
  function pick(field) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    var l = i18n.getLang();
    return (field[l] && String(field[l]).trim()) ? field[l] : (field[other(l)] || "");
  }
  // {ur:[...], en:[...]} -> { items, lang (language actually used), fallback (true when current language was empty) }
  function pickList(field) {
    var l = i18n.getLang();
    var list = (field && field[l]) || [];
    if (list.length) return { items: list, lang: l, fallback: false };
    var o = (field && field[other(l)]) || [];
    return { items: o, lang: other(l), fallback: o.length > 0 };
  }

  /* ---- DOM helpers (text is always inserted with textContent: no HTML injection) ---- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null && text !== "") n.textContent = text;
    return n;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }
  function $(id) { return document.getElementById(id); }
  function img(src, alt, opts) {
    var i = document.createElement("img");
    i.src = src; i.alt = alt || "";
    if (opts && opts.lazy !== false) i.loading = "lazy";
    if (opts && opts.width) { i.width = opts.width; i.height = opts.height; }
    i.decoding = "async";
    return i;
  }
  function link(href, cls, text) { var a = el("a", cls, text); a.href = href; return a; }

  var ICONS = {
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "chevron-left": '<path d="M15 5l-7 7 7 7"/>', "chevron-right": '<path d="M9 5l7 7-7 7"/>',
    "close": '<path d="M6 6l12 12M18 6L6 18"/>',
    "play": '<path d="M7 4l13 8-13 8z" fill="currentColor" stroke="none"/>',
    "book-open": '<path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2zM12 6.5v13"/>',
    "prayer-beads": '<circle cx="12" cy="5.5" r="1.7"/><circle cx="17.4" cy="7.7" r="1.7"/><circle cx="19.4" cy="13" r="1.7"/><circle cx="16.6" cy="17.6" r="1.7"/><circle cx="7.4" cy="17.6" r="1.7"/><circle cx="4.6" cy="13" r="1.7"/><circle cx="6.6" cy="7.7" r="1.7"/><path d="M12 19.3V22"/>',
    "users": '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14.2c3 0 5 2 5 5"/>',
    "file-text": '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    "heart-hand": '<path d="M12 10.5c-2.4-1.9-4-3.2-4-4.9a2.6 2.6 0 015-1 2.6 2.6 0 015 1c0 1.7-1.6 3-4 4.9z" transform="translate(0 -.5)"/><path d="M3 16h4l4 2.5h5a1.6 1.6 0 000-3.2h-3.5M7 16v5M11 18.5l5.5-2.5L21 14"/>',
    "map-pin": '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  function icon(name, flip) {
    var ns = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("fill", "none"); s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "1.7"); s.setAttribute("stroke-linecap", "round"); s.setAttribute("stroke-linejoin", "round");
    s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
    if (flip) s.setAttribute("class", "icon-flip");
    s.innerHTML = ICONS[name] || "";   // static strings above only, never user data
    return s;
  }

  // Page boot: renderers registered with mount() run after the layout is drawn, and again on language change.
  var mounts = [];
  function mount(fn) { mounts.push(fn); }
  function runMounts() { mounts.forEach(function (fn) { try { fn(); } catch (e) { console.error("[page] render failed", e); } }); }

  function formatDate(value) {
    if (!value) return "";
    var d = new Date(value + (String(value).length <= 10 ? "T00:00:00" : ""));
    if (isNaN(d)) return String(value);
    try { return d.toLocaleDateString(i18n.getLang() === "ur" ? "ur-PK" : "en-GB", { day: "numeric", month: "short", year: "numeric" }); }
    catch (e) { return String(value); }
  }

  window.GIS.data = { load: load, loadMany: loadMany };
  window.GIS.pick = pick; window.GIS.pickList = pickList;
  window.GIS.u = { el: el, clear: clear, $: $, img: img, link: link, icon: icon, formatDate: formatDate };
  window.GIS.mount = mount; window.GIS.runMounts = runMounts;
})();
