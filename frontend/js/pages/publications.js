/* Publications page: filter chips + grid, empty state. */
(function () {
  "use strict";
  var G = window.GIS, u = G.u, t = G.i18n.t, c = G.c, pick = G.pick;
  var filter = "all";
  function render() {
    G.data.load("publications").then(function (data) {
      var root = u.clear(u.$("publications-root")), items = (data && data.items) || [];
      if (!items.length) { root.appendChild(c.empty(t("publications.empty"))); return; }
      var chips = u.el("div", "chips");
      [["all", "publications.all"], ["book", "publications.books"], ["article", "publications.articles"]].forEach(function (f) {
        var b = u.el("button", "chip", t(f[1])); b.type = "button"; b.setAttribute("aria-pressed", String(filter === f[0]));
        b.addEventListener("click", function () { filter = f[0]; render(); }); chips.appendChild(b);
      });
      root.appendChild(chips);
      var shown = items.filter(function (i) { return filter === "all" || i.type === filter; });
      if (!shown.length) { root.appendChild(c.empty(t("publications.emptyFilter"))); return; }
      var grid = u.el("div", "book-grid");
      shown.forEach(function (b) {
        var card = u.el("article", "book-card");
        if (b.cover) card.appendChild(u.img(b.cover, pick(b.title), { width: 300, height: 400 }));
        var body = u.el("div", "book-card__body");
        body.appendChild(u.el("span", "badge", t(b.type === "article" ? "pub.article" : "pub.book")));
        body.appendChild(u.el("h3", null, pick(b.title))); if (pick(b.author)) body.appendChild(u.el("p", null, pick(b.author)));
        if (pick(b.description)) body.appendChild(u.el("p", null, pick(b.description)));
        if (b.file) { var a = c.arrowLink(b.file, t("pub.open")); a.target = "_blank"; a.rel = "noopener"; a.style.marginTop = "auto"; body.appendChild(a); }
        card.appendChild(body); grid.appendChild(card);
      });
      root.appendChild(grid);
    }).catch(function (e) { console.error(e); u.clear(u.$("publications-root")).appendChild(c.empty(t("common.loadError"))); });
  }
  G.mount(render);
})();
