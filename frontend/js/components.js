/* Reusable UI pieces: slider, lightbox, video card, paragraphs, empty state. */
(function () {
  "use strict";
  var u = window.GIS.u;
  var i18n = window.GIS.i18n;
  var t = i18n.t;
  var rtl = function () { return i18n.getLang() === "ur"; };

  function navButton(kind, label, onClick) {
    var b = u.el("button", "slider-btn");
    b.type = "button"; b.setAttribute("aria-label", label);
    b.appendChild(u.icon(kind === "prev" ? "chevron-left" : "chevron-right", true));
    b.addEventListener("click", onClick);
    return b;
  }

  /* Accessible slider logic. opts: root, count, interval (ms, 0 = no autoplay), onShow(index) */
  function createSlider(opts) {
    var count = opts.count, idx = 0, timer = null, paused = false;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var controls = u.el("div", "slider-controls");
    var dotsWrap = u.el("div", "slider-dots");
    var dots = [];
    function go(i) {
      idx = (i + count) % count;
      dots.forEach(function (d, n) { d.setAttribute("aria-current", n === idx ? "true" : "false"); });
      opts.onShow(idx);
      start();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (opts.interval && !reduced && count > 1) timer = setInterval(function () { if (!paused) go(idx + 1); }, opts.interval);
    }
    for (var i = 0; i < count; i++) {
      (function (n) {
        var d = u.el("button", "slider-dot"); d.type = "button";
        d.setAttribute("aria-label", t("slider.goto", { n: n + 1 }));
        d.addEventListener("click", function () { go(n); });
        dots.push(d); dotsWrap.appendChild(d);
      })(i);
    }
    controls.appendChild(navButton("prev", t("slider.prev"), function () { go(idx - 1); }));
    if (opts.dots !== false) controls.appendChild(dotsWrap);
    controls.appendChild(navButton("next", t("slider.next"), function () { go(idx + 1); }));
    if (count < 2) controls.hidden = true;

    var root = opts.root;
    root.addEventListener("mouseenter", function () { paused = true; });
    root.addEventListener("mouseleave", function () { paused = false; });
    root.addEventListener("focusin", function () { paused = true; });
    root.addEventListener("focusout", function () { paused = false; });
    var x0 = null;
    root.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) < 40) return;
      var forward = rtl() ? dx > 0 : dx < 0;
      go(idx + (forward ? 1 : -1));
    }, { passive: true });
    root.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      var forward = (e.key === "ArrowRight") !== rtl();
      go(idx + (forward ? 1 : -1));
    });
    go(0);
    return { controls: controls, go: go, destroy: stop };
  }

  /* Lightbox. items: [{src, alt, caption}] */
  function openLightbox(items, start, trigger) {
    if (!items.length) return;
    var idx = start || 0;
    var root = u.el("div", "lightbox");
    root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", t("gallery.open"));
    var fig = u.el("figure", "lightbox__fig");
    var im = document.createElement("img"); im.alt = "";
    var cap = u.el("figcaption");
    fig.appendChild(im); fig.appendChild(cap);
    function btn(cls, label, iconName, fn) {
      var b = u.el("button", cls); b.type = "button"; b.setAttribute("aria-label", label);
      b.appendChild(u.icon(iconName, iconName !== "close")); b.addEventListener("click", fn); return b;
    }
    var closeBtn = btn("lightbox__close", t("gallery.close"), "close", close);
    var prevBtn = btn("lightbox__prev", t("gallery.prev"), "chevron-left", function () { show(idx - 1); });
    var nextBtn = btn("lightbox__next", t("gallery.next"), "chevron-right", function () { show(idx + 1); });
    if (items.length < 2) { prevBtn.hidden = true; nextBtn.hidden = true; }
    root.appendChild(fig); root.appendChild(closeBtn); root.appendChild(prevBtn); root.appendChild(nextBtn);

    function show(i) {
      idx = (i + items.length) % items.length;
      im.src = items[idx].src; im.alt = items[idx].alt || "";
      cap.textContent = items[idx].caption || t("gallery.count", { n: idx + 1, total: items.length });
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") { show(idx + (((e.key === "ArrowRight") !== rtl()) ? 1 : -1)); return; }
      if (e.key === "Tab") {
        var f = [closeBtn, prevBtn, nextBtn].filter(function (b) { return !b.hidden; });
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    function close() {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (root.parentNode) root.parentNode.removeChild(root);
      if (trigger && trigger.focus) trigger.focus();
    }
    root.addEventListener("click", function (e) { if (e.target === root) close(); });
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.appendChild(root);
    show(idx);
    closeBtn.focus();
  }

  /* YouTube card: no third-party request until the visitor presses play (thumbnail aside). */
  function videoCard(item, n) {
    var wrap = u.el("div", "video-wrap");
    var label = window.GIS.pick(item.title) || t("video.label", { n: n });
    var box = u.el("div", "video");
    var id = String(item.youtubeId || "");
    var thumb = u.img("https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/hqdefault.jpg", "");
    thumb.onerror = function () { if (thumb.parentNode) thumb.parentNode.removeChild(thumb); };
    box.appendChild(thumb);
    var b = u.el("button", "video__btn"); b.type = "button";
    b.setAttribute("aria-label", t("video.play", { n: n }) + (window.GIS.pick(item.title) ? ": " + label : ""));
    var s = u.el("span"); s.appendChild(u.icon("play")); b.appendChild(s);
    b.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
      f.title = label; f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true;
      u.clear(box); box.appendChild(f);
    });
    box.appendChild(b);
    wrap.appendChild(box);
    wrap.appendChild(u.el("p", "video-title", label));
    return wrap;
  }

  // Appends paragraphs of {ur:[...], en:[...]}; adds a notice when the other language had to be used.
  function paragraphs(container, field) {
    var r = window.GIS.pickList(field);
    if (!r.items.length) return false;
    if (r.fallback) container.appendChild(u.el("p", "lang-note", t("note.fallback")));
    r.items.forEach(function (txt) {
      var p = u.el("p", null, txt); p.lang = r.lang; p.dir = r.lang === "ur" ? "rtl" : "ltr";
      container.appendChild(p);
    });
    return true;
  }

  function empty(text) { return u.el("p", "empty", text); }
  function arrowLink(href, text) { var a = u.link(href, "link-arrow", text); a.appendChild(u.icon("arrow-right", true)); return a; }
  function arrowBtn(href, cls, text) { var a = u.link(href, "btn " + cls, text); a.appendChild(u.icon("arrow-right", true)); return a; }

  window.GIS.c = { createSlider: createSlider, openLightbox: openLightbox, videoCard: videoCard, paragraphs: paragraphs, empty: empty, arrowLink: arrowLink, arrowBtn: arrowBtn };
})();
