/* News page: newest first, empty state. */
(function () {
  "use strict";
  var G = window.GIS, u = G.u, t = G.i18n.t, c = G.c, pick = G.pick;
  function render() {
    G.data.load("news").then(function (data) {
      var root = u.clear(u.$("news-root")), items = ((data && data.items) || []).slice().sort(function (a, b) { return String(b.published).localeCompare(String(a.published)); });
      if (!items.length) { root.appendChild(c.empty(t("news.empty"))); return; }
      var list = u.el("div", "news-list");
      items.forEach(function (n) {
        var card = u.el("article", "news-card");
        if (n.image) card.appendChild(u.img(n.image, "", { width: 440, height: 275 })); else card.appendChild(u.el("span"));
        var d = u.el("div"); d.appendChild(u.el("time", null, u.formatDate(n.published))); d.appendChild(u.el("h3", null, pick(n.title)));
        if (pick(n.summary)) d.appendChild(u.el("p", null, pick(n.summary)));
        if (pick(n.body)) { var det = document.createElement("details"); det.appendChild(u.el("summary", null, t("common.readMore"))); det.appendChild(u.el("p", null, pick(n.body))); d.appendChild(det); }
        card.appendChild(d); list.appendChild(card);
      });
      root.appendChild(list);
    }).catch(function (e) { console.error(e); u.clear(u.$("news-root")).appendChild(c.empty(t("common.loadError"))); });
  }
  G.mount(render);
})();
