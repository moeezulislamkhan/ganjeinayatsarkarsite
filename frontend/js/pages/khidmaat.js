/* Khidmaat page: intro, five cards, programs. */
(function () {
  "use strict";
  var G = window.GIS, u = G.u, t = G.i18n.t, c = G.c, pick = G.pick;
  function render() {
    G.data.loadMany(["khidmaat", "programs", "site"]).then(function (d) {
      var root = u.clear(u.$("khidmaat-root"));
      var k = d.khidmaat, items = (k && k.items) || [];
      var s1 = u.el("section", "section"), b1 = u.el("div", "container");
      if (k && pick(k.intro)) { b1.appendChild(u.el("p", "lead", pick(k.intro))); }
      var grid = u.el("div", "feature-grid"); grid.style.marginTop = "var(--space-6)";
      items.forEach(function (it) {
        var card = u.el("article", "feature-card"); card.appendChild(u.icon(it.icon || "book-open"));
        card.appendChild(u.el("h3", null, pick(it.title))); if (pick(it.description)) card.appendChild(u.el("p", null, pick(it.description))); grid.appendChild(card);
      });
      b1.appendChild(grid); s1.appendChild(b1); root.appendChild(s1);

      var progs = (d.programs && d.programs.items) || [];
      if (progs.length) {
        var s2 = u.el("section", "section section--alt"); s2.id = "programs"; var b2 = u.el("div", "container");
        b2.appendChild(u.el("h2", "section-title", t("khidmaat.programsTitle")));
        var list = u.el("div", "program-list"); list.style.marginTop = "var(--space-5)";
        progs.forEach(function (p) {
          var row = u.el("article", "program-row"), left = u.el("div");
          left.appendChild(u.el("p", "program-row__kind", pick(p.kind))); left.appendChild(u.el("h3", null, pick(p.title)));
          if (pick(p.about)) left.appendChild(u.el("p", null, pick(p.about)));
          var dl = u.el("dl");
          function r(key, v) { if (!v) return; dl.appendChild(u.el("dt", null, t(key))); dl.appendChild(u.el("dd", null, v)); }
          r("program.schedule", pick(p.schedule)); r("program.presided", pick(p.presidedBy)); r("program.venue", pick(p.venue));
          var right = u.el("div"); right.appendChild(dl);
          if (p.image) { var im = u.img(p.image, pick(p.title)); im.style.marginTop = "var(--space-3)"; right.appendChild(im); }
          row.appendChild(left); row.appendChild(right); list.appendChild(row);
        });
        b2.appendChild(list);
        var foot = u.el("p", null, t("program.contact")); foot.style.marginTop = "var(--space-5)"; b2.appendChild(foot);
        if (d.site) { var w = u.link("https://wa.me/" + d.site.whatsappNumber, "btn btn--primary", t("home.programsCta")); w.target = "_blank"; w.rel = "noopener noreferrer"; w.style.marginTop = "var(--space-3)"; b2.appendChild(w); }
        s2.appendChild(b2); root.appendChild(s2);
      }
      if (location.hash) { var target = document.getElementById(location.hash.slice(1)); if (target) target.scrollIntoView(); }
    }).catch(function (e) { console.error(e); });
  }
  G.mount(render);
})();
