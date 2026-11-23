/* Gallery page: category chips, masonry grid, lightbox, videos. */
(function () {
  "use strict";
  var G = window.GIS, u = G.u, t = G.i18n.t, c = G.c, pick = G.pick;
  var cat = "all";
  function render() {
    G.data.loadMany(["gallery", "videos"]).then(function (d) {
      var root = u.clear(u.$("gallery-root")), items = (d.gallery && d.gallery.items) || [];
      if (items.length) {
        var cats = []; items.forEach(function (g) { if (cats.indexOf(g.category) < 0) cats.push(g.category); });
        var s = u.el("section", "section"), box = u.el("div", "container");
        if (cats.length > 1) {
          var chips = u.el("div", "chips");
          ["all"].concat(cats).forEach(function (k) {
            var b = u.el("button", "chip", t("gallery." + k)); b.type = "button"; b.setAttribute("aria-pressed", String(cat === k));
            b.addEventListener("click", function () { cat = k; render(); }); chips.appendChild(b);
          });
          box.appendChild(chips);
        }
        var shown = items.filter(function (g) { return cat === "all" || g.category === cat; });
        var lb = shown.map(function (g) { return { src: g.image, alt: pick(g.alt) }; });
        var grid = u.el("div", "masonry");
        shown.forEach(function (g, i) {
          var b = u.el("button", "masonry__item"); b.type = "button"; b.setAttribute("aria-label", t("gallery.open") + " " + (i + 1));
          b.appendChild(u.img(g.thumb || g.image, pick(g.alt))); b.addEventListener("click", function () { c.openLightbox(lb, i, b); }); grid.appendChild(b);
        });
        box.appendChild(grid); s.appendChild(box); root.appendChild(s);
      }
      var vids = (d.videos && d.videos.items) || [];
      if (vids.length) {
        var vs = u.el("section", "section section--alt"), vb = u.el("div", "container");
        vb.appendChild(u.el("h2", "section-title", t("gallery.videosTitle")));
        var g2 = u.el("div", "video-grid"); g2.style.marginTop = "var(--space-5)";
        vids.forEach(function (v, i) { g2.appendChild(c.videoCard(v, i + 1)); });
        vb.appendChild(g2); vs.appendChild(vb); root.appendChild(vs);
      }
      if (!items.length && !vids.length) root.appendChild(c.empty(t("common.loadError")));
    });
  }
  G.mount(render);
})();
