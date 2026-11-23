/* Home page: hero slider, about, khidmaat, programs band, publications/news/quote, gallery strip, videos. */
(function () {
  "use strict";
  var G = window.GIS, u = G.u, t = G.i18n.t, c = G.c, pick = G.pick;
  var sliders = [];

  function section(host, cls) { u.clear(host); host.className = cls || host.className; return host; }

  function renderHero(hero) {
    var host = u.$("hero"); if (!host) return;
    u.clear(host);
    var items = (hero && hero.items) || [];
    if (!items.length) { host.hidden = true; return; }
    host.hidden = false;
    var root = u.el("div", "hero__root");
    root.setAttribute("role", "region"); root.setAttribute("aria-roledescription", "carousel"); root.setAttribute("aria-label", t("slider.region"));
    var wrap = u.el("div", "hero__slides"), slides = [];
    items.forEach(function (s, i) {
      var slide = u.el("div", "hero__slide");
      slide.setAttribute("role", "group"); slide.setAttribute("aria-roledescription", "slide"); slide.setAttribute("aria-label", (i + 1) + " / " + items.length);
      var im = u.img(s.image, pick(s.alt), { lazy: i > 0, width: 1920, height: 860 }); im.className = "hero__img";
      if (i === 0) im.fetchPriority = "high";
      slide.appendChild(im); slide.appendChild(u.el("div", "hero__overlay"));
      var box = u.el("div", "container"); var cont = u.el("div", "hero__content");
      if (s.eyebrow) cont.appendChild(u.el("p", "hero__eyebrow", pick(s.eyebrow)));
      cont.appendChild(u.el(i === 0 ? "h1" : "h2", "hero__title", pick(s.title)));
      if (s.subtitle) cont.appendChild(u.el("p", "hero__subtitle", pick(s.subtitle)));
      if (s.text) cont.appendChild(u.el("p", "hero__text", pick(s.text)));
      if (s.ctaLabel && s.ctaHref) { var cta = u.el("div", "hero__cta"); cta.appendChild(c.arrowBtn(s.ctaHref, "btn--gold", pick(s.ctaLabel))); cont.appendChild(cta); }
      box.appendChild(cont); slide.appendChild(box); wrap.appendChild(slide); slides.push(slide);
    });
    root.appendChild(wrap);
    root.appendChild(u.el("span", "orn hero__orn")); root.appendChild(u.el("span", "orn hero__orn hero__orn--b"));
    var slider = c.createSlider({
      root: root, count: items.length, interval: 6500,
      onShow: function (i) { slides.forEach(function (sl, n) { var a = n === i; sl.classList.toggle("is-active", a); sl.inert = !a; sl.setAttribute("aria-hidden", String(!a)); }); }
    });
    sliders.push(slider);
    var ctl = u.el("div", "hero__controls"); var cc = u.el("div", "container"); cc.appendChild(slider.controls); ctl.appendChild(cc);
    root.appendChild(ctl); host.appendChild(root);
  }

  function renderAbout(about) {
    var host = u.$("home-about"); if (!host) return; u.clear(host);
    var inst = about && about.institution; if (!inst) { host.hidden = true; return; } host.hidden = false;
    var box = u.el("div", "container split");
    var arch = u.el("div", "arch"); arch.appendChild(u.img(inst.image, pick(inst.imageAlt), { width: 280, height: 350 }));
    var body = u.el("div", "split__body");
    body.appendChild(u.el("p", "eyebrow", t("home.aboutEyebrow")));
    body.appendChild(u.el("h2", "section-title", pick(inst.title)));
    c.paragraphs(body, inst.paragraphs);
    body.appendChild(c.arrowBtn("about.html", "btn--primary", t("common.learnMore")));
    box.appendChild(arch); box.appendChild(body); host.appendChild(box);
  }

  function renderKhidmaat(k) {
    var host = u.$("home-khidmaat"); if (!host) return; u.clear(host);
    var items = (k && k.items) || []; if (!items.length) { host.hidden = true; return; } host.hidden = false;
    var box = u.el("div", "container");
    box.appendChild(u.el("h2", "visually-hidden", t("home.khidmaatTitle")));
    var grid = u.el("div", "feature-grid");
    items.forEach(function (it) {
      var a = u.link("khidmaat.html", "feature-card"); a.appendChild(u.icon(it.icon || "book-open"));
      a.appendChild(u.el("h3", null, pick(it.title)));
      if (pick(it.description)) a.appendChild(u.el("p", null, pick(it.description)));
      grid.appendChild(a);
    });
    box.appendChild(grid); host.appendChild(box);
  }

  function renderPrograms(programs, site) {
    var host = u.$("home-programs"); if (!host) return; u.clear(host);
    var items = (programs && programs.items) || []; if (!items.length) { host.hidden = true; return; } host.hidden = false;
    host.appendChild(u.el("span", "orn", null));
    var box = u.el("div", "container");
    box.appendChild(u.el("p", "eyebrow", t("home.programsEyebrow")));
    box.appendChild(u.el("h2", "section-title", t("home.programsTitle")));
    var grid = u.el("div", "band-grid");
    items.forEach(function (p) {
      var card = u.el("article", "program");
      card.appendChild(u.el("p", "program__kind", pick(p.kind)));
      card.appendChild(u.el("h3", null, pick(p.title)));
      if (pick(p.about)) card.appendChild(u.el("p", null, pick(p.about)));
      var dl = u.el("dl");
      function row(k, v) { if (!v) return; dl.appendChild(u.el("dt", null, t(k))); dl.appendChild(u.el("dd", null, v)); }
      row("program.schedule", pick(p.schedule)); row("program.presided", pick(p.presidedBy)); row("program.venue", pick(p.venue));
      card.appendChild(dl); grid.appendChild(card);
    });
    box.appendChild(grid);
    var foot = u.el("div"); foot.style.marginTop = "var(--space-5)";
    foot.appendChild(u.el("p", null, t("program.contact")));
    if (site) { var b = u.link("https://wa.me/" + site.whatsappNumber, "btn btn--gold", t("home.programsCta")); b.target = "_blank"; b.rel = "noopener noreferrer"; b.style.marginTop = "var(--space-3)"; foot.appendChild(b); }
    box.appendChild(foot); host.appendChild(box);
  }

  function renderTriple(pubs, news, farameen) {
    var host = u.$("home-triple"); if (!host) return; u.clear(host);
    var box = u.el("div", "container triple");
    // publications
    var c1 = u.el("div");
    c1.appendChild(u.el("p", "eyebrow", t("home.pubEyebrow"))); c1.appendChild(u.el("h2", "col-title", t("home.pubTitle")));
    c1.appendChild(u.el("p", "col-desc", t("home.pubDesc")));
    var books = ((pubs && pubs.items) || []).slice(0, 4);
    if (books.length) {
      c1.appendChild(c.arrowLink("publications.html", t("home.pubViewAll")));
      var mb = u.el("div", "mini-books");
      books.forEach(function (b) {
        var a = u.link(b.file || "publications.html", "book"); if (b.cover) a.appendChild(u.img(b.cover, pick(b.title), { width: 150, height: 200 }));
        a.appendChild(u.el("b", null, pick(b.title))); if (pick(b.author)) a.appendChild(u.el("small", null, pick(b.author))); mb.appendChild(a);
      });
      c1.appendChild(mb);
    } else { var e = c.empty(t("home.pubEmpty")); e.style.marginTop = "var(--space-4)"; c1.appendChild(e); }
    // news
    var c2 = u.el("div");
    c2.appendChild(u.el("p", "eyebrow", t("home.newsEyebrow"))); c2.appendChild(u.el("h2", "col-title", t("home.newsTitle")));
    var list = ((news && news.items) || []).slice().sort(function (a, b) { return String(b.published).localeCompare(String(a.published)); }).slice(0, 3);
    if (list.length) {
      var wrap = u.el("div"); wrap.style.marginTop = "var(--space-3)";
      list.forEach(function (n) {
        var row = u.el("a", "news-item"); row.href = "news.html";
        if (n.image) row.appendChild(u.img(n.image, "", { width: 72, height: 56 })); else row.appendChild(u.el("span"));
        var d = u.el("div"); d.appendChild(u.el("time", null, u.formatDate(n.published))); d.appendChild(u.el("b", null, pick(n.title)));
        if (pick(n.summary)) d.appendChild(u.el("p", null, pick(n.summary))); row.appendChild(d); wrap.appendChild(row);
      });
      c2.appendChild(wrap);
      var more = c.arrowLink("news.html", t("home.newsViewAll")); more.style.marginTop = "var(--space-4)"; c2.appendChild(more);
    } else { var e2 = c.empty(t("home.newsEmpty")); e2.style.marginTop = "var(--space-4)"; c2.appendChild(e2); }
    // quote card
    var c3 = u.el("div");
    var quotes = ((farameen && farameen.items) || []).filter(function (q) { return pick(q.text); });
    if (quotes.length) {
      var card = u.el("div", "quote-card");
      card.appendChild(u.el("p", "eyebrow", t("home.quoteEyebrow")));
      card.appendChild(u.el("div", "quote-card__mark", "\u201C"));
      var bq = u.el("blockquote"); bq.setAttribute("aria-live", "polite"); card.appendChild(bq);
      var s = c.createSlider({ root: card, count: quotes.length, interval: 9000, dots: false, onShow: function (i) { bq.textContent = pick(quotes[i].text); } });
      sliders.push(s); card.appendChild(s.controls);
      card.appendChild(c.arrowLink("silsila.html#farameen", t("home.quoteAll")));
      c3.appendChild(card);
    }
    box.appendChild(c1); box.appendChild(c2); if (quotes.length) box.appendChild(c3);
    host.appendChild(box);
  }

  function renderGallery(gallery) {
    var host = u.$("home-gallery"); if (!host) return; u.clear(host);
    var photos = ((gallery && gallery.items) || []).filter(function (g) { return g.category === "darbar"; }).slice(0, 12);
    if (!photos.length) { host.hidden = true; return; } host.hidden = false;
    var inner = u.el("div", "container gallery-strip__inner");
    var left = u.el("div");
    left.appendChild(u.el("p", "eyebrow", t("home.galleryEyebrow"))); left.appendChild(u.el("h2", null, t("home.galleryTitle")));
    left.appendChild(u.el("p", null, t("home.galleryDesc"))); left.appendChild(c.arrowBtn("gallery.html", "btn--gold", t("home.galleryCta")));
    var wrap = u.el("div", "strip-wrap"), track = u.el("div", "gallery-strip__track");
    var lb = photos.map(function (g) { return { src: g.image, alt: pick(g.alt) }; });
    photos.forEach(function (g, i) {
      var b = u.el("button", "strip-thumb"); b.type = "button"; b.setAttribute("aria-label", t("gallery.open") + " " + (i + 1));
      b.appendChild(u.img(g.thumb || g.image, pick(g.alt), { width: 150, height: 112 }));
      b.addEventListener("click", function () { c.openLightbox(lb, i, b); }); track.appendChild(b);
    });
    function scroll(dir) { var step = 320 * dir * (document.documentElement.dir === "rtl" ? -1 : 1); track.scrollBy({ left: step, behavior: "smooth" }); }
    var prev = u.el("button", "slider-btn"); prev.type = "button"; prev.setAttribute("aria-label", t("slider.prev")); prev.appendChild(u.icon("chevron-left", true)); prev.addEventListener("click", function () { scroll(-1); });
    var next = u.el("button", "slider-btn"); next.type = "button"; next.setAttribute("aria-label", t("slider.next")); next.appendChild(u.icon("chevron-right", true)); next.addEventListener("click", function () { scroll(1); });
    wrap.appendChild(prev); wrap.appendChild(track); wrap.appendChild(next);
    inner.appendChild(left); inner.appendChild(wrap); host.appendChild(inner);
  }

  function renderVideos(videos) {
    var host = u.$("home-videos"); if (!host) return; u.clear(host);
    var items = ((videos && videos.items) || []).slice(0, 3); if (!items.length) { host.hidden = true; return; } host.hidden = false;
    var box = u.el("div", "container");
    var head = u.el("div", "section-head"); var h = u.el("div");
    h.appendChild(u.el("p", "eyebrow", t("home.videosEyebrow"))); h.appendChild(u.el("h2", "section-title", t("home.videosTitle")));
    head.appendChild(h);
    if (videos.channelUrl) { var a = c.arrowLink(videos.channelUrl, t("home.videosMore")); a.target = "_blank"; a.rel = "noopener noreferrer"; head.appendChild(a); }
    box.appendChild(head);
    var grid = u.el("div", "video-grid"); items.forEach(function (v, i) { grid.appendChild(c.videoCard(v, i + 1)); });
    box.appendChild(grid); host.appendChild(box);
  }

  function render() {
    sliders.forEach(function (s) { s.destroy(); }); sliders = [];
    G.data.loadMany(["hero", "about", "khidmaat", "programs", "farameen", "gallery", "publications", "news", "videos", "site"]).then(function (d) {
      renderHero(d.hero); renderAbout(d.about); renderKhidmaat(d.khidmaat); renderPrograms(d.programs, d.site);
      renderTriple(d.publications, d.news, d.farameen); renderGallery(d.gallery); renderVideos(d.videos);
    });
  }
  G.mount(render);
})();
