/* Shared header + footer, page title, i18n of static HTML, and page boot. */
(function () {
  "use strict";
  var G = window.GIS, i18n = G.i18n, t = i18n.t, u = G.u;

  var NAV = [["home", "index.html"], ["about", "about.html"], ["silsila", "silsila.html"], ["khidmaat", "khidmaat.html"],
             ["publications", "publications.html"], ["gallery", "gallery.html"], ["news", "news.html"], ["contact", "contact.html"]];

  function brand(withBadge) {
    var a = u.link("index.html", "brand");
    var badge = u.el("span", "brand__badge");
    var logo = u.img("assets/brand/logo.png", "", { lazy: false, width: 40, height: 40 });
    badge.appendChild(logo); a.appendChild(badge);
    var txt = u.el("span", "brand__text");
    txt.appendChild(u.el("b", null, t("brand.name"))); txt.appendChild(u.el("small", null, t("brand.tag")));
    a.appendChild(txt);
    return a;
  }

  function renderHeader(page) {
    var host = u.$("site-header"); if (!host) return;
    var header = u.el("header", "site-header");
    var inner = u.el("div", "container site-header__inner");
    inner.appendChild(brand());
    var nav = u.el("nav", "nav"); nav.id = "primary-nav"; nav.setAttribute("aria-label", t("nav.primary"));
    var ul = u.el("ul");
    NAV.forEach(function (n) {
      var li = u.el("li"); var a = u.link(n[1], null, t("nav." + n[0]));
      if (n[0] === page) a.setAttribute("aria-current", "page");
      li.appendChild(a); ul.appendChild(li);
    });
    nav.appendChild(ul); inner.appendChild(nav);
    var actions = u.el("div", "header-actions");
    var sw = u.el("button", "lang-switch", t("lang.switch")); sw.type = "button"; sw.id = "lang-switch"; sw.setAttribute("aria-label", t("lang.switchLabel"));
    sw.addEventListener("click", function () { i18n.setLang(i18n.getLang() === "ur" ? "en" : "ur"); });
    var tg = u.el("button", "nav-toggle"); tg.type = "button"; tg.id = "nav-toggle"; tg.setAttribute("aria-expanded", "false");
    tg.setAttribute("aria-controls", "primary-nav"); tg.setAttribute("aria-label", t("nav.menu"));
    tg.appendChild(u.el("span")); tg.appendChild(u.el("span")); tg.appendChild(u.el("span"));
    tg.addEventListener("click", function () { var o = nav.classList.toggle("is-open"); tg.setAttribute("aria-expanded", String(o)); });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("is-open"); tg.setAttribute("aria-expanded", "false"); } });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { nav.classList.remove("is-open"); tg.setAttribute("aria-expanded", "false"); tg.focus(); }
    });
    actions.appendChild(sw); actions.appendChild(tg); inner.appendChild(actions);
    header.appendChild(inner); u.clear(host).appendChild(header);
  }

  function socialLinks(site, cls) {
    var box = u.el("div", cls || "social-links");
    var names = { facebook: "Facebook", youtube: "YouTube", instagram: "Instagram", twitter: "X (Twitter)" };
    Object.keys(names).forEach(function (k) {
      if (site && site.social && site.social[k]) {
        var a = u.link(site.social[k], null, names[k]); a.target = "_blank"; a.rel = "noopener noreferrer"; a.className = "latin"; box.appendChild(a);
      }
    });
    return box;
  }
  G.socialLinks = socialLinks;

  function renderFooter(site) {
    var host = u.$("site-footer"); if (!host) return;
    var footer = u.el("footer", "site-footer pattern-bg");
    var grid = u.el("div", "container site-footer__grid");
    var c1 = u.el("div"); c1.appendChild(brand());
    c1.appendChild(u.el("p", null, site ? G.pick(site.footerAbout) : t("brand.tag")));
    grid.appendChild(c1);
    var c2 = u.el("div"); c2.appendChild(u.el("h3", null, t("footer.links")));
    var ul = u.el("ul", "footer-links");
    NAV.forEach(function (n) { var li = u.el("li"); li.appendChild(u.link(n[1], null, t("nav." + n[0]))); ul.appendChild(li); });
    c2.appendChild(ul); grid.appendChild(c2);
    var c3 = u.el("div"); c3.appendChild(u.el("h3", null, t("footer.contact")));
    var ul3 = u.el("ul");
    if (site) {
      ul3.appendChild(u.el("li", null, G.pick(site.address)));
      var li1 = u.el("li"); var a1 = u.link("https://wa.me/" + site.whatsappNumber, "latin", site.whatsapp); li1.appendChild(a1); ul3.appendChild(li1);
      var li2 = u.el("li"); var a2 = u.link("mailto:" + site.email, "latin", site.email); li2.appendChild(a2); ul3.appendChild(li2);
    }
    c3.appendChild(ul3);
    if (site) { c3.appendChild(socialLinks(site)); }
    grid.appendChild(c3);
    footer.appendChild(grid);
    var bar = u.el("div", "site-footer__bar"); var bc = u.el("div", "container");
    bc.appendChild(u.el("span", null, "\u00A9 " + new Date().getFullYear() + " " + t("brand.name") + ". " + t("footer.rights")));
    bc.appendChild(u.link("privacy.html", null, t("footer.privacy")));
    bar.appendChild(bc); footer.appendChild(bar);
    u.clear(host).appendChild(footer);
  }

  function applyStatic(page) {
    document.querySelectorAll("[data-i18n]").forEach(function (n) { n.textContent = t(n.getAttribute("data-i18n")); });
    var skip = document.querySelector(".skip-link"); if (skip) skip.textContent = t("skip");
    document.title = t("title." + page) + " | " + t("brand.name");
    var meta = document.querySelector('meta[name="description"]');
    G.data.load("site").then(function (s) { if (meta) meta.setAttribute("content", G.pick(s.description)); }).catch(function () {});
  }

  function render() {
    var page = document.body.getAttribute("data-page") || "";
    renderHeader(page);
    renderFooter(null);
    applyStatic(page);
    G.data.load("site").then(renderFooter).catch(function (e) { console.error("[layout] site.json", e); });
    G.runMounts();
  }

  i18n.init();
  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("gis:langchange", render);
})();
