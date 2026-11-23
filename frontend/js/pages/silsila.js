/* Silsila page: Tazkira article, Shajra image, Farameen cards + sayings. */
(function () {
  "use strict";
  var G = window.GIS, u = G.u, t = G.i18n.t, c = G.c, pick = G.pick;

  function render() {
    G.data.loadMany(["silsila", "farameen"]).then(function (d) {
      var nav = u.$("silsila-subnav"), root = u.$("silsila-root"); u.clear(nav); u.clear(root);
      var box = u.el("div", "container"), ul = u.el("ul");
      [["tazkira", "silsila.nav.tazkira"], ["shajra", "silsila.nav.shajra"], ["farameen", "silsila.nav.farameen"]].forEach(function (n) {
        var li = u.el("li"); li.appendChild(u.link("#" + n[0], null, t(n[1]))); ul.appendChild(li);
      });
      box.appendChild(ul); nav.appendChild(box);

      var s = d.silsila;
      if (s) {
        var a = u.el("section", "section"); a.id = "tazkira"; var ac = u.el("div", "container rich");
        ac.appendChild(u.el("h2", "section-title", pick(s.title)));
        if (pick(s.intro)) { var lead = u.el("p", "lead", pick(s.intro)); lead.style.marginBottom = "var(--space-5)"; ac.appendChild(lead); }
        c.paragraphs(ac, s.article); a.appendChild(ac); root.appendChild(a);

        if (s.shajra && s.shajra.image) {
          var sh = u.el("section", "section section--alt"); sh.id = "shajra"; var sc = u.el("div", "container");
          sc.appendChild(u.el("h2", "section-title", pick(s.shajra.title)));
          var grid = u.el("div", "shajra"); grid.style.marginTop = "var(--space-5)";
          var b = u.el("a"); b.href = s.shajra.image; b.target = "_blank"; b.rel = "noopener";
          b.setAttribute("aria-label", t("silsila.shajraOpen")); b.appendChild(u.img(s.shajra.image, pick(s.shajra.alt), { width: 800, height: 1270 }));
          var side = u.el("div", "rich"); side.appendChild(c.arrowLink(s.shajra.image, t("silsila.shajraOpen")));
          if (pick(s.shajra.text)) { side.appendChild(u.el("p", null, pick(s.shajra.text))); }
          grid.appendChild(b); grid.appendChild(side); sc.appendChild(grid); sh.appendChild(sc); root.appendChild(sh);
        }
      }
      var f = d.farameen && d.farameen.items || [];
      if (f.length) {
        var fs = u.el("section", "section"); fs.id = "farameen"; var fc = u.el("div", "container");
        fc.appendChild(u.el("h2", "section-title", t("silsila.farameenTitle")));
        var cards = f.filter(function (q) { return q.image; });
        var lb = cards.map(function (q) { return { src: q.image, alt: pick(q.text), caption: pick(q.text) }; });
        var grid2 = u.el("div", "farameen-grid"); grid2.style.marginTop = "var(--space-5)";
        cards.forEach(function (q, i) {
          var btn = u.el("button", "farman"); btn.type = "button"; btn.setAttribute("aria-label", t("gallery.open") + " " + (i + 1) + ": " + pick(q.text));
          btn.appendChild(u.img(q.image, pick(q.text), { width: 300, height: 600 })); btn.addEventListener("click", function () { c.openLightbox(lb, i, btn); }); grid2.appendChild(btn);
        });
        if (cards.length) fc.appendChild(grid2);
        fc.appendChild(u.el("h3", null, t("silsila.sayings"))).style.marginTop = "var(--space-7)";
        var sayings = u.el("div", "sayings");
        f.forEach(function (q) { var bq = u.el("blockquote", null, pick(q.text)); sayings.appendChild(bq); });
        fc.appendChild(sayings); fs.appendChild(fc); root.appendChild(fs);
      }
      if (location.hash) { var target = document.getElementById(location.hash.slice(1)); if (target) target.scrollIntoView(); }
    });
  }
  G.mount(render);
})();
