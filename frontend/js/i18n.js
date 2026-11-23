/* UI strings (menus, buttons, labels) in English and Urdu + language state.
   Website CONTENT (bio, news, ...) lives in data/*.json, not here.
   The Urdu strings below are DRAFT translations: the institution should review them. */
(function () {
  "use strict";
  var DICT = {
    en: {
      "brand.name": "Ganj-e-Inayat Sarkar", "brand.tag": "Silsila-e-Naqshbandia",
      "nav.home": "Home", "nav.about": "About", "nav.silsila": "Silsila-e-Naqshbandia", "nav.khidmaat": "Khidmaat",
      "nav.publications": "Publications", "nav.gallery": "Gallery", "nav.news": "News", "nav.contact": "Contact",
      "nav.menu": "Open menu", "nav.primary": "Main navigation",
      "lang.switch": "اردو", "lang.switchLabel": "Switch to Urdu", "skip": "Skip to content", "breadcrumb.home": "Home",
      "common.readMore": "Read more", "common.learnMore": "Learn More", "common.loadError": "This content could not be loaded. Please try again later.",
      "note.fallback": "This text is currently available in Urdu only.",
      "slider.prev": "Previous", "slider.next": "Next", "slider.goto": "Go to slide {n}", "slider.region": "Highlights",
      "home.aboutEyebrow": "About our institution", "home.khidmaatTitle": "Our Khidmaat",
      "home.programsEyebrow": "Programs", "home.programsTitle": "Gatherings at the Darbar", "home.programsCta": "Contact us on WhatsApp",
      "home.pubEyebrow": "Latest publications", "home.pubTitle": "Books & Articles", "home.pubDesc": "Books, articles and writings of the Naqshbandi Silsila.",
      "home.pubViewAll": "View all publications", "home.pubEmpty": "Publications will be added soon.",
      "home.newsEyebrow": "News & announcements", "home.newsTitle": "Latest Updates", "home.newsViewAll": "View all news", "home.newsEmpty": "No announcements yet.",
      "home.quoteEyebrow": "Sayings of Hazoor Sarkar", "home.quoteAll": "View all sayings",
      "home.galleryEyebrow": "Our gallery", "home.galleryTitle": "Moments at the Darbar", "home.galleryDesc": "A glimpse of the Darbar Sharif.", "home.galleryCta": "View Gallery",
      "home.videosEyebrow": "Videos", "home.videosTitle": "Watch & Listen", "home.videosMore": "More on YouTube",
      "about.title": "About", "about.subtitle": "The Darbar, its blessed saints and the Sajjada Nasheen.",
      "about.nav.institution": "Institution", "about.nav.hazoor": "Hazoor Ganj-e-Inayat Sarkar", "about.nav.father": "Father", "about.nav.sahibzada": "Sahibzada",
      "about.timeline": "Key dates", "about.photos": "Photographs", "about.follow": "Follow",
      "silsila.title": "Silsila-e-Naqshbandia", "silsila.subtitle": "The blessed chain of the Naqshbandia Mujaddidia.",
      "silsila.nav.tazkira": "Tazkira", "silsila.nav.shajra": "Shajra", "silsila.nav.farameen": "Farameen",
      "silsila.shajraOpen": "View full image", "silsila.farameenTitle": "Farameen of Hazoor Ganj-e-Inayat Sarkar", "silsila.sayings": "Sayings",
      "khidmaat.title": "Khidmaat", "khidmaat.subtitle": "Spiritual guidance, learning and service to humanity.", "khidmaat.programsTitle": "Programs",
      "program.schedule": "Schedule", "program.presided": "Presided by", "program.venue": "Venue", "program.contact": "For more information, contact us on WhatsApp.",
      "publications.title": "Publications", "publications.subtitle": "Books and articles.", "publications.all": "All", "publications.books": "Books", "publications.articles": "Articles",
      "publications.empty": "Publications will be added soon.", "publications.emptyFilter": "Nothing in this category yet.", "pub.book": "Book", "pub.article": "Article", "pub.open": "Read / Download",
      "gallery.title": "Gallery", "gallery.subtitle": "Photographs of the Darbar Sharif and gatherings.", "gallery.all": "All", "gallery.darbar": "Darbar Sharif", "gallery.events": "Mehfil posters (archive)",
      "video.label": "Video {n}", "video.play": "Play video {n}",
      "gallery.videosTitle": "Videos", "gallery.close": "Close", "gallery.prev": "Previous photo", "gallery.next": "Next photo", "gallery.open": "Open photo", "gallery.count": "{n} of {total}",
      "news.title": "News", "news.subtitle": "Announcements from the Darbar.", "news.empty": "No announcements yet. Please check back soon.",
      "contact.title": "Contact", "contact.subtitle": "We would be glad to hear from you.", "contact.address": "Address", "contact.whatsapp": "WhatsApp", "contact.email": "Email", "contact.hours": "Hours",
      "contact.map": "Open in Google Maps", "contact.mapText": "Find the Darbar Sharif on the map", "contact.follow": "Follow us",
      "contact.formTitle": "Send a message", "contact.name": "Your name", "contact.emailField": "Email (optional)", "contact.phone": "Phone (optional)", "contact.message": "Message",
      "contact.send": "Send message", "contact.sending": "Sending...", "contact.ok": "Thank you. Your message has been sent.",
      "contact.fail": "Your message could not be sent. Please contact us on WhatsApp instead.",
      "contact.errName": "Please enter your name.", "contact.errEmail": "Please enter a valid email address.", "contact.errMessage": "Please write a message (at least 5 characters).",
      "footer.links": "Quick links", "footer.contact": "Contact", "footer.follow": "Follow us", "footer.rights": "All rights reserved.", "footer.privacy": "Privacy Policy",
      "title.home": "Home", "title.about": "About", "title.silsila": "Silsila-e-Naqshbandia", "title.khidmaat": "Khidmaat", "title.publications": "Publications",
      "title.gallery": "Gallery", "title.news": "News", "title.contact": "Contact", "title.privacy": "Privacy Policy", "title.notfound": "Page not found",
      "privacy.title": "Privacy Policy",
      "privacy.p1": "This website does not use advertising trackers. If you send a message through the contact form, we receive the details you type (your name, message and, if you add them, your email and phone number) so that we can reply.",
      "privacy.p2": "We use your details only to respond to you. We do not sell or share them. Your language choice is stored in your own browser so the site can remember it.",
      "privacy.p3": "Videos are loaded from YouTube only when you press play. To ask us to delete a message you sent, contact us using the details on the Contact page.",
      "privacy.note": "Draft text - to be reviewed by the institution.",
      "notfound.title": "Page not found", "notfound.text": "The page you are looking for does not exist or has moved.", "notfound.home": "Go to the home page"
    },
    ur: {
      "brand.name": "گنجِ عنایت سرکار", "brand.tag": "سلسلۂ نقشبندیہ",
      "nav.home": "پہلا صفحہ", "nav.about": "تعارف", "nav.silsila": "سلسلۂ نقشبندیہ", "nav.khidmaat": "خدمات",
      "nav.publications": "تصانیف", "nav.gallery": "گیلری", "nav.news": "خبریں", "nav.contact": "رابطہ",
      "nav.menu": "مینو کھولیں", "nav.primary": "مرکزی مینو",
      "lang.switch": "English", "lang.switchLabel": "انگریزی میں دیکھیں", "skip": "مواد پر جائیں", "breadcrumb.home": "پہلا صفحہ",
      "common.readMore": "مزید پڑھیں", "common.learnMore": "مزید جانیں", "common.loadError": "یہ مواد لوڈ نہیں ہو سکا۔ براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں۔",
      "note.fallback": "یہ متن فی الحال صرف انگریزی میں دستیاب ہے۔",
      "slider.prev": "پچھلا", "slider.next": "اگلا", "slider.goto": "سلائیڈ {n} پر جائیں", "slider.region": "نمایاں",
      "home.aboutEyebrow": "ہمارے ادارے کا تعارف", "home.khidmaatTitle": "ہماری خدمات",
      "home.programsEyebrow": "پروگرامز", "home.programsTitle": "دربار میں محافل", "home.programsCta": "واٹس ایپ پر رابطہ کریں",
      "home.pubEyebrow": "تازہ تصانیف", "home.pubTitle": "کتب و مضامین", "home.pubDesc": "سلسلۂ نقشبندیہ کی کتب، مضامین اور تحریریں۔",
      "home.pubViewAll": "تمام تصانیف دیکھیں", "home.pubEmpty": "تصانیف جلد شامل کی جائیں گی۔",
      "home.newsEyebrow": "خبریں اور اعلانات", "home.newsTitle": "تازہ ترین", "home.newsViewAll": "تمام خبریں دیکھیں", "home.newsEmpty": "ابھی کوئی اعلان نہیں۔",
      "home.quoteEyebrow": "فرامینِ حضور سرکار", "home.quoteAll": "تمام فرامین دیکھیں",
      "home.galleryEyebrow": "ہماری گیلری", "home.galleryTitle": "دربار کی جھلکیاں", "home.galleryDesc": "دربار شریف کی ایک جھلک۔", "home.galleryCta": "گیلری دیکھیں",
      "home.videosEyebrow": "ویڈیوز", "home.videosTitle": "دیکھیں اور سنیں", "home.videosMore": "یوٹیوب پر مزید",
      "about.title": "تعارف", "about.subtitle": "دربار، اس کی بابرکت ہستیاں اور سجادہ نشین۔",
      "about.nav.institution": "ادارہ", "about.nav.hazoor": "حضور گنجِ عنایت سرکار", "about.nav.father": "والد گرامی", "about.nav.sahibzada": "صاحبزادہ",
      "about.timeline": "اہم تاریخیں", "about.photos": "تصاویر", "about.follow": "رابطہ",
      "silsila.title": "سلسلۂ نقشبندیہ", "silsila.subtitle": "سلسلۂ عالیہ نقشبندیہ مجددیہ کا تعارف۔",
      "silsila.nav.tazkira": "تذکرہ", "silsila.nav.shajra": "شجرہ", "silsila.nav.farameen": "فرامین",
      "silsila.shajraOpen": "مکمل تصویر دیکھیں", "silsila.farameenTitle": "فرامینِ حضور گنجِ عنایت سرکار", "silsila.sayings": "فرامین (متن)",
      "khidmaat.title": "خدمات", "khidmaat.subtitle": "روحانی رہنمائی، علم اور خدمتِ انسانیت۔", "khidmaat.programsTitle": "پروگرامز",
      "program.schedule": "وقت", "program.presided": "زیرصدارت", "program.venue": "مقام", "program.contact": "مزید معلومات کے لیے آپ ہمیں واٹس اپ پر رابطہ کر سکتے ہیں۔",
      "publications.title": "تصانیف", "publications.subtitle": "کتب اور مضامین۔", "publications.all": "سب", "publications.books": "کتب", "publications.articles": "مضامین",
      "publications.empty": "تصانیف جلد شامل کی جائیں گی۔", "publications.emptyFilter": "اس زمرے میں ابھی کچھ نہیں۔", "pub.book": "کتاب", "pub.article": "مضمون", "pub.open": "پڑھیں / ڈاؤن لوڈ کریں",
      "gallery.title": "گیلری", "gallery.subtitle": "دربار شریف اور محافل کی تصاویر۔", "gallery.all": "سب", "gallery.darbar": "دربار شریف", "gallery.events": "محافل کے پوسٹر (آرکائیو)",
      "video.label": "ویڈیو {n}", "video.play": "ویڈیو {n} چلائیں",
      "gallery.videosTitle": "ویڈیوز", "gallery.close": "بند کریں", "gallery.prev": "پچھلی تصویر", "gallery.next": "اگلی تصویر", "gallery.open": "تصویر کھولیں", "gallery.count": "{n} از {total}",
      "news.title": "خبریں", "news.subtitle": "دربار کی جانب سے اعلانات۔", "news.empty": "ابھی کوئی اعلان نہیں۔ براہِ کرم جلد دوبارہ دیکھیں۔",
      "contact.title": "رابطہ", "contact.subtitle": "ہمیں آپ کے پیغام کا انتظار رہے گا۔", "contact.address": "پتہ", "contact.whatsapp": "واٹس ایپ", "contact.email": "ای میل", "contact.hours": "اوقات",
      "contact.map": "گوگل میپ میں کھولیں", "contact.mapText": "نقشے پر دربار شریف تلاش کریں", "contact.follow": "ہمیں فالو کریں",
      "contact.formTitle": "پیغام بھیجیں", "contact.name": "آپ کا نام", "contact.emailField": "ای میل (اختیاری)", "contact.phone": "فون (اختیاری)", "contact.message": "پیغام",
      "contact.send": "پیغام بھیجیں", "contact.sending": "بھیجا جا رہا ہے...", "contact.ok": "شکریہ۔ آپ کا پیغام بھیج دیا گیا ہے۔",
      "contact.fail": "آپ کا پیغام نہیں بھیجا جا سکا۔ براہِ کرم واٹس ایپ پر رابطہ کریں۔",
      "contact.errName": "براہِ کرم اپنا نام لکھیں۔", "contact.errEmail": "براہِ کرم درست ای میل لکھیں۔", "contact.errMessage": "براہِ کرم پیغام لکھیں (کم از کم 5 حروف)۔",
      "footer.links": "فوری روابط", "footer.contact": "رابطہ", "footer.follow": "ہمیں فالو کریں", "footer.rights": "جملہ حقوق محفوظ ہیں۔", "footer.privacy": "پرائیویسی پالیسی",
      "title.home": "پہلا صفحہ", "title.about": "تعارف", "title.silsila": "سلسلۂ نقشبندیہ", "title.khidmaat": "خدمات", "title.publications": "تصانیف",
      "title.gallery": "گیلری", "title.news": "خبریں", "title.contact": "رابطہ", "title.privacy": "پرائیویسی پالیسی", "title.notfound": "صفحہ نہیں ملا",
      "privacy.title": "پرائیویسی پالیسی",
      "privacy.p1": "اس ویب سائٹ پر اشتہاری ٹریکرز استعمال نہیں ہوتے۔ اگر آپ رابطہ فارم کے ذریعے پیغام بھیجیں تو ہمیں وہ تفصیلات ملتی ہیں جو آپ لکھتے ہیں (آپ کا نام، پیغام اور اگر آپ دیں تو ای میل اور فون نمبر) تاکہ ہم جواب دے سکیں۔",
      "privacy.p2": "ہم آپ کی تفصیلات صرف جواب دینے کے لیے استعمال کرتے ہیں۔ انہیں فروخت یا شیئر نہیں کیا جاتا۔ آپ کی منتخب زبان آپ کے اپنے براؤزر میں محفوظ ہوتی ہے تاکہ سائٹ اسے یاد رکھ سکے۔",
      "privacy.p3": "ویڈیوز صرف اس وقت یوٹیوب سے لوڈ ہوتی ہیں جب آپ پلے دباتے ہیں۔ اپنا بھیجا ہوا پیغام حذف کروانے کے لیے رابطہ صفحے پر دی گئی تفصیلات کے ذریعے ہم سے رابطہ کریں۔",
      "privacy.note": "مسودہ متن — ادارے سے منظوری درکار ہے۔",
      "notfound.title": "صفحہ نہیں ملا", "notfound.text": "جو صفحہ آپ تلاش کر رہے ہیں وہ موجود نہیں یا منتقل ہو گیا ہے۔", "notfound.home": "پہلے صفحے پر جائیں"
    }
  };

  var KEY = "gis-lang";
  var DEFAULT_LANG = "ur";   // language shown on a first visit: "ur" or "en"
  var lang = "en";
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* blocked: ignore */ } }

  function t(key, vars) {
    var s = (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
    return vars ? s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; }) : s;
  }
  function applyDoc() { var h = document.documentElement; h.lang = lang; h.dir = lang === "ur" ? "rtl" : "ltr"; }
  function setLang(next) {
    if (!DICT[next] || next === lang) return;
    lang = next; store(next); applyDoc();
    document.dispatchEvent(new CustomEvent("gis:langchange", { detail: { lang: next } }));
  }
  function init() {
    var q = new URLSearchParams(window.location.search).get("lang");
    var s = stored();
    lang = DICT[q] ? q : (DICT[s] ? s : DEFAULT_LANG);
    applyDoc();
  }

  window.GIS = window.GIS || {};
  window.GIS.i18n = { init: init, t: t, setLang: setLang, getLang: function () { return lang; }, dict: DICT };
})();
