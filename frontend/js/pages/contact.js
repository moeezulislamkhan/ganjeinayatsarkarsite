/* Contact page: details, map link, and the contact form (POST /api/contact). */
(function () {
  "use strict";
  var G = window.GIS, u = G.u, t = G.i18n.t, c = G.c, pick = G.pick;
  var saved = { name: "", email: "", phone: "", message: "" };

  function infoItem(iconName, label, content) {
    var it = u.el("div", "info-item"); it.appendChild(u.icon(iconName));
    var d = u.el("div"); d.appendChild(u.el("b", null, label)); d.appendChild(content); it.appendChild(d); return it;
  }
  function field(id, label, type, area) {
    var wrap = u.el("div", "form-field"); var l = u.el("label", null, label); l.htmlFor = id;
    var inp = document.createElement(area ? "textarea" : "input"); inp.id = id; inp.name = id; if (!area) inp.type = type;
    inp.value = saved[id] || ""; inp.setAttribute("aria-describedby", id + "-err");
    if (id === "email") inp.autocomplete = "email"; if (id === "name") inp.autocomplete = "name"; if (id === "phone") inp.autocomplete = "tel";
    var err = u.el("span", "field-error"); err.id = id + "-err";
    wrap.appendChild(l); wrap.appendChild(inp); wrap.appendChild(err); return wrap;
  }

  function render(site) {
    var root = u.clear(u.$("contact-root"));
    var grid = u.el("div", "contact-grid");
    var info = u.el("div");
    var list = u.el("div", "info-list");
    list.appendChild(infoItem("map-pin", t("contact.address"), u.el("span", null, pick(site.address))));
    var wa = u.link("https://wa.me/" + site.whatsappNumber, "latin", site.whatsapp); wa.target = "_blank"; wa.rel = "noopener noreferrer";
    list.appendChild(infoItem("phone", t("contact.whatsapp"), wa));
    list.appendChild(infoItem("mail", t("contact.email"), u.link("mailto:" + site.email, "latin", site.email)));
    list.appendChild(infoItem("clock", t("contact.hours"), u.el("span", null, pick(site.hours))));
    info.appendChild(list);
    var map = u.el("div", "map-card"); map.appendChild(u.el("p", null, t("contact.mapText")));
    var mb = u.link(site.map.url, "btn btn--gold", t("contact.map")); mb.target = "_blank"; mb.rel = "noopener noreferrer"; map.appendChild(mb); info.appendChild(map);
    var sh = u.el("p"); sh.style.marginTop = "var(--space-5)"; sh.appendChild(u.el("b", null, t("contact.follow"))); info.appendChild(sh); info.appendChild(G.socialLinks(site));

    var formBox = u.el("div"); formBox.appendChild(u.el("h2", null, t("contact.formTitle")));
    var status = u.el("div"); status.setAttribute("role", "status"); formBox.appendChild(status);
    var form = u.el("form"); form.noValidate = true; form.style.marginTop = "var(--space-4)";
    form.appendChild(field("name", t("contact.name"), "text")); form.appendChild(field("email", t("contact.emailField"), "email"));
    form.appendChild(field("phone", t("contact.phone"), "tel")); form.appendChild(field("message", t("contact.message"), "text", true));
    var hp = u.el("div", "hp"); hp.setAttribute("aria-hidden", "true"); var hpi = document.createElement("input"); hpi.type = "text"; hpi.name = "website"; hpi.tabIndex = -1; hpi.autocomplete = "off"; hp.appendChild(hpi); form.appendChild(hp);
    var send = u.el("button", "btn btn--primary", t("contact.send")); send.type = "submit"; form.appendChild(send);

    function val(id) { return form.elements[id].value.trim(); }
    function setErr(id, msg) { var i = form.elements[id]; u.$(id + "-err").textContent = msg || ""; if (msg) i.setAttribute("aria-invalid", "true"); else i.removeAttribute("aria-invalid"); }
    ["name", "email", "phone", "message"].forEach(function (id) { form.elements[id].addEventListener("input", function () { saved[id] = form.elements[id].value; }); });

    form.addEventListener("submit", function (e) {
      e.preventDefault(); u.clear(status);
      var ok = true;
      if (val("name").length < 2) { setErr("name", t("contact.errName")); ok = false; } else setErr("name");
      if (val("email") && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val("email"))) { setErr("email", t("contact.errEmail")); ok = false; } else setErr("email");
      if (val("message").length < 5) { setErr("message", t("contact.errMessage")); ok = false; } else setErr("message");
      if (!ok) { var first = form.querySelector('[aria-invalid="true"]'); if (first) first.focus(); return; }
      send.disabled = true; send.textContent = t("contact.sending");
      fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: val("name"), email: val("email") || null, phone: val("phone") || null, message: val("message"), website: hpi.value }) })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); })
        .then(function () { status.appendChild(u.el("p", "alert alert--ok", t("contact.ok"))); saved = { name: "", email: "", phone: "", message: "" }; form.reset(); })
        .catch(function (err) { console.error("[contact] send failed", err); status.appendChild(u.el("p", "alert alert--err", t("contact.fail"))); })
        .then(function () { send.disabled = false; send.textContent = t("contact.send"); });
    });
    formBox.appendChild(form);
    grid.appendChild(info); grid.appendChild(formBox); root.appendChild(grid);
  }
  G.mount(function () { G.data.load("site").then(render).catch(function (e) { console.error(e); u.clear(u.$("contact-root")).appendChild(c.empty(t("common.loadError"))); }); });
})();
