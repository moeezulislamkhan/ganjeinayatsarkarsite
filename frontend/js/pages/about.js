/* About page: institution, Hazoor Sarkar (timeline + biography), father, Sahibzada. */
(function () {
  "use strict";
  var G = window.GIS, u = G.u, t = G.i18n.t, c = G.c, pick = G.pick;

  function archBlock(src, alt) { var a = u.el("div", "arch"); a.appendChild(u.img(src, alt, { width: 280, height: 350 })); return a; }
  function photos(list) {
    if (!list || !list.length) return null;
    var row = u.el("div", "person__photos");
    var items = list.map(function (s) { return { src: s, alt: "" }; });
    list.forEach(function (src, i) {
      var b = u.el("button"); b.type = "button"; b.setAttribute("aria-label", t("gallery.open") + " " + (i + 1));
      b.appendChild(u.img(src, "", { width: 120, height: 150 })); b.addEventListener("click", function () { c.openLightbox(items, i, b); }); row.appendChild(b);
    });
    return row;
  }
  function person(id, data, extra) {
    var s = u.el("section", "person"); s.id = id;
    var box = u.el("div", "container"); var split = u.el("div", "split split--top");
    split.appendChild(archBlock(data.image, pick(data.imageAlt || data.name)));
    var body = u.el("div", "split__body rich");
    body.appendChild(u.el("h2", "person__name", pick(data.name)));
    if (data.known || data.role) body.appendChild(u.el("p", "person__role", pick(data.known || data.role)));
    if (data.paragraphs) c.paragraphs(body, data.paragraphs);
    if (extra) extra(body);
    split.appendChild(body); box.appendChild(split); s.appendChild(box); return s;
  }

  function render() {
    G.data.load("about").then(function (about) {
      var nav = u.$("about-subnav"), root = u.$("about-root"); u.clear(nav); u.clear(root);
      var box = u.el("div", "container"), ul = u.el("ul");
      [["institution", "about.nav.institution"], ["hazoor", "about.nav.hazoor"], ["father", "about.nav.father"], ["sahibzada", "about.nav.sahibzada"]].forEach(function (n) {
        var li = u.el("li"); li.appendChild(u.link("#" + n[0], null, t(n[1]))); ul.appendChild(li);
      });
      box.appendChild(ul); nav.appendChild(box);

      var inst = about.institution;
      var si = person("institution", { image: inst.image, imageAlt: inst.imageAlt, name: inst.title, paragraphs: inst.paragraphs });
      root.appendChild(si);

      var h = about.hazoor;
      root.appendChild(person("hazoor", h, function (body) {
        if (h.timeline && h.timeline.length) {
          body.appendChild(u.el("h3", null, t("about.timeline")));
          var tl = u.el("ol", "timeline");
          h.timeline.forEach(function (e) { var li = u.el("li"); li.appendChild(u.el("b", null, pick(e.year))); li.appendChild(u.el("span", null, pick(e.text))); tl.appendChild(li); });
          body.appendChild(tl);
        }
        var ph = photos(h.photos); if (ph) body.appendChild(ph);
      }));
      // biography accordion (full width, under the Hazoor block)
      var accWrap = u.el("div", "container accordion"); accWrap.style.paddingBottom = "var(--space-7)";
      (h.sections || []).forEach(function (sec, i) {
        var d = document.createElement("details"); if (i === 0) d.open = true;
        d.appendChild(u.el("summary", null, pick(sec.title)));
        var rich = u.el("div", "rich"); c.paragraphs(rich, sec.paragraphs); d.appendChild(rich); accWrap.appendChild(d);
      });
      root.appendChild(accWrap);

      root.appendChild(person("father", about.father));
      root.appendChild(person("sahibzada", about.sahibzada, function (body) {
        var l = about.sahibzada.links;
        if (l) { var s = u.el("div", "social-links"); [["facebook", "Facebook"], ["youtube", "YouTube"]].forEach(function (k) {
          if (l[k[0]]) { var a = u.link(l[k[0]], "latin", k[1]); a.target = "_blank"; a.rel = "noopener noreferrer"; s.appendChild(a); } }); body.appendChild(s); }
        var ph = photos(about.sahibzada.photos); if (ph) body.appendChild(ph);
      }));
      if (location.hash) { var target = document.getElementById(location.hash.slice(1)); if (target) target.scrollIntoView(); }
    }).catch(function (e) { console.error(e); var r = u.clear(u.$("about-root")); r.appendChild(c.empty(t("common.loadError"))); });
  }
  G.mount(render);
})();
