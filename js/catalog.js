/* ============================================================================
   Wine & Beer Georgia — Product catalogue (data-driven)
   ----------------------------------------------------------------------------
   Source of truth for the Products page. Grouped BY CATEGORY (wines, qvevri,
   sparkling, spirits, lemonades), mixing our partner producers.

   Producers:  rtv = RTVELISI · bediani = Winery Bediani · bia = BIA
   Data: RTVELISI from the 2026 price list (items flagged for the site);
         Bediani from the winery brochure; BIA from the lemonade catalogue.

   IMAGES: each product looks for  assets/products/<slug>.png
           Until that file exists, a neutral placeholder is shown.
           TODO: drop real bottle photos into assets/products/ named by slug
           (see slugFor() below) — they appear automatically, no code change.
============================================================================ */

(function () {
  "use strict";

  // p=producer, c=category, n=name, col=colour, typ=type, g=grape, r=region, v=volume
  var CATALOG = [
    /* ============================ STILL WINES ============================ */
    // RTVELISI
    { p: "rtv", c: "wine", n: "Rkatsiteli",     col: "white", typ: "dry",        g: "Rkatsiteli",              r: "Kakheti",                    v: "750 ml" },
    { p: "rtv", c: "wine", n: "Mtsvane",        col: "white", typ: "dry",        g: "Mtsvane",                 r: "Kakheti",                    v: "750 ml" },
    { p: "rtv", c: "wine", n: "Kisi",           col: "white", typ: "dry",        g: "Kisi",                    r: "Kakheti",                    v: "750 ml" },
    { p: "rtv", c: "wine", n: "Khikhvi",        col: "white", typ: "dry",        g: "Khikhvi",                 r: "Kakheti",                    v: "750 ml" },
    { p: "rtv", c: "wine", n: "Tsinandali",     col: "white", typ: "dry",        g: "Rkatsiteli, Mtsvane",     r: "Tsinandali, Kakheti (PDO)",  v: "750 ml" },
    { p: "rtv", c: "wine", n: "Sviri",          col: "white", typ: "dry",        g: "Sviri",                   r: "Imereti (PDO)",              v: "750 ml" },
    { p: "rtv", c: "wine", n: "Alazani Valley", col: "white", typ: "semisweet",  g: "Rkatsiteli",              r: "Kakheti",                    v: "750 ml" },
    { p: "rtv", c: "wine", n: "Tvishi",         col: "white", typ: "semisweet",  g: "Tsolikauri",              r: "Tvishi, Racha-Lechkhumi (PDO)", v: "750 ml" },
    { p: "rtv", c: "wine", n: "Saperavi",       col: "red",   typ: "dry",        g: "Saperavi",                r: "Kakheti",                    v: "750 ml" },
    { p: "rtv", c: "wine", n: "Saperavi (Old Vineyards)", col: "red", typ: "dry", g: "Saperavi",               r: "Kakheti",                    v: "750 ml" },
    { p: "rtv", c: "wine", n: "Mukuzani",       col: "red",   typ: "dry",        g: "Saperavi",                r: "Mukuzani, Kakheti (PDO)",    v: "750 ml" },
    { p: "rtv", c: "wine", n: "Alazani Valley", col: "red",   typ: "semisweet",  g: "Saperavi",                r: "Kakheti",                    v: "750 ml" },
    { p: "rtv", c: "wine", n: "Kindzmarauli",   col: "red",   typ: "semisweet",  g: "Saperavi",                r: "Kindzmarauli, Kakheti (PDO)", v: "750 ml" },
    { p: "rtv", c: "wine", n: "Khvanchkara",    col: "red",   typ: "semisweet",  g: "Aleksandrouli, Mujuretuli", r: "Khvanchkara, Racha (PDO)", v: "750 ml" },
    { p: "rtv", c: "wine", n: "Alazani Valley", col: "rose",  typ: "semisweet",  g: "Saperavi",                r: "Kakheti",                    v: "750 ml" },
    { p: "rtv", c: "wine", n: "Pirosmani",      col: "rose",  typ: "semidry",    g: "Saperavi",                r: "Kakheti",                    v: "750 ml" },
    // Winery Bediani
    { p: "bediani", c: "wine", n: "Rkatsiteli",     col: "white", typ: "dry",       g: "Rkatsiteli",               r: "Kakheti",                    v: "750 ml" },
    { p: "bediani", c: "wine", n: "Mtsvane",        col: "white", typ: "dry",       g: "Mtsvane",                  r: "Kakheti",                    v: "750 ml" },
    { p: "bediani", c: "wine", n: "Kisi",           col: "white", typ: "dry",       g: "Kisi",                     r: "Kakheti",                    v: "750 ml" },
    { p: "bediani", c: "wine", n: "Khikhvi",        col: "white", typ: "dry",       g: "Khikhvi",                  r: "Akhmeta, Kakheti",           v: "750 ml" },
    { p: "bediani", c: "wine", n: "Tsinandali",     col: "white", typ: "dry",       g: "Rkatsiteli, Mtsvane",      r: "Tsinandali, Kakheti (PDO)",  v: "750 ml" },
    { p: "bediani", c: "wine", n: "Pirosmani",      col: "white", typ: "semidry",   g: "Rkatsiteli",               r: "Kakheti",                    v: "750 ml" },
    { p: "bediani", c: "wine", n: "Alazani Valley", col: "white", typ: "semisweet", g: "Rkatsiteli",               r: "Kakheti",                    v: "750 ml" },
    { p: "bediani", c: "wine", n: "Tvishi",         col: "white", typ: "semisweet", g: "Tsolikouri",               r: "Lechkhumi (PDO)",            v: "750 ml" },
    { p: "bediani", c: "wine", n: "Saperavi",       col: "red",   typ: "dry",       g: "Saperavi",                 r: "Kakheti",                    v: "750 ml" },
    { p: "bediani", c: "wine", n: "Saperavi Premium", col: "red", typ: "dry",       g: "Saperavi",                 r: "Kondoli, Kakheti",           v: "750 ml" },
    { p: "bediani", c: "wine", n: "Mukuzani",       col: "red",   typ: "dry",       g: "Saperavi",                 r: "Mukuzani, Kakheti (PDO)",    v: "750 ml" },
    { p: "bediani", c: "wine", n: "Pirosmani",      col: "red",   typ: "semidry",   g: "Saperavi",                 r: "Kakheti",                    v: "750 ml" },
    { p: "bediani", c: "wine", n: "Alazani Valley", col: "red",   typ: "semisweet", g: "Saperavi",                 r: "Kakheti",                    v: "750 ml" },
    { p: "bediani", c: "wine", n: "Akhasheni",      col: "red",   typ: "semisweet", g: "Saperavi",                 r: "Akhasheni, Kakheti (PDO)",   v: "750 ml" },
    { p: "bediani", c: "wine", n: "Kindzmarauli",   col: "red",   typ: "semisweet", g: "Saperavi",                 r: "Kindzmarauli, Kakheti (PDO)", v: "750 ml" },
    { p: "bediani", c: "wine", n: "Khvanchkara",    col: "red",   typ: "semisweet", g: "Aleksandrouli, Mujuretuli", r: "Khvanchkara, Racha (PDO)",  v: "750 ml" },
    { p: "bediani", c: "wine", n: "Rosé",           col: "rose",  typ: "semidry",   g: "Saperavi",                 r: "Kakheti",                    v: "750 ml" },

    /* ============================ QVEVRI (AMBER) ============================ */
    { p: "rtv", c: "qvevri", n: "Rkatsiteli Qvevri", col: "amber", typ: "dry", g: "Rkatsiteli", r: "Kakheti", v: "750 ml" },
    { p: "rtv", c: "qvevri", n: "Saperavi Qvevri",   col: "red",   typ: "dry", g: "Saperavi",   r: "Kakheti", v: "750 ml" },
    { p: "bediani", c: "qvevri", n: "Rkatsiteli Qvevri", col: "amber", typ: "dry", g: "Rkatsiteli", r: "Kakheti", v: "750 ml" },
    { p: "bediani", c: "qvevri", n: "Mtsvane Qvevri",    col: "amber", typ: "dry", g: "Mtsvane",    r: "Kakheti", v: "750 ml" },
    { p: "bediani", c: "qvevri", n: "Kisi Qvevri",       col: "amber", typ: "dry", g: "Kisi",       r: "Akhmeta, Kakheti", v: "750 ml" },
    { p: "bediani", c: "qvevri", n: "Khikhvi Qvevri",    col: "amber", typ: "dry", g: "Khikhvi",    r: "Kakheti", v: "750 ml" },
    { p: "bediani", c: "qvevri", n: "Tsolikouri Qvevri", col: "amber", typ: "dry", g: "Tsolikouri", r: "Imereti", v: "750 ml" },
    { p: "bediani", c: "qvevri", n: "Tsitska Qvevri",    col: "amber", typ: "dry", g: "Tsitska",    r: "Imereti", v: "750 ml" },
    { p: "bediani", c: "qvevri", n: "Saperavi Qvevri",   col: "red",   typ: "dry", g: "Saperavi",   r: "Kakheti", v: "750 ml" },
    { p: "bediani", c: "qvevri", n: "Vardisperi Rkatsiteli Qvevri", col: "rose", typ: "dry", g: "Vardisperi Rkatsiteli", r: "Kakheti", v: "750 ml" },

    /* ============================ SPARKLING ============================ */
    { p: "rtv", c: "sparkling", n: "Sparkling Wine", col: "white", typ: "brut",       g: "Sauvignon Blanc, Mtsvane", r: "Kakheti", v: "750 ml" },
    { p: "rtv", c: "sparkling", n: "Sparkling Wine", col: "white", typ: "semidry",    g: "Rkatsiteli, Mtsvane",      r: "Kakheti", v: "750 ml" },
    { p: "rtv", c: "sparkling", n: "Sparkling Wine", col: "white", typ: "semisweet",  g: "Rkatsiteli, Mtsvane",      r: "Kakheti", v: "750 ml" },
    { p: "rtv", c: "sparkling", n: "Sparkling Wine", col: "rose",  typ: "semidry",    g: "Saperavi",                 r: "Kakheti", v: "750 ml" },

    /* ============================ CHACHA & BRANDY ============================ */
    { p: "bediani", c: "spirit", n: "Chacha Silver", badge: "chacha", sub: "classic", g: "Rkatsiteli",          r: "Kakheti", v: "500 ml" },
    { p: "bediani", c: "spirit", n: "Chacha Gold",   badge: "chacha", sub: "oak",     g: "Grape distillate",    r: "Kakheti", v: "500 ml" },
    { p: "bediani", c: "spirit", n: "Brandy 3 YO",   badge: "brandy", sub: "aged3",   g: "Grape distillate",    r: "Kakheti", v: "500 ml" },
    { p: "bediani", c: "spirit", n: "Brandy 5 YO",   badge: "brandy", sub: "aged5",   g: "Grape distillate",    r: "Kakheti", v: "500 ml" },
    { p: "bediani", c: "spirit", n: "Brandy 7 YO",   badge: "brandy", sub: "aged7",   g: "Grape distillate",    r: "Kakheti", v: "500 ml" },

    /* ============================ MAISELI (presentation: name + category only) ============================ */
    { p: "maiseli", c: "wine", n: "Tsolikauri Reserve", col: "white", typ: "dry", g: "Tsolikauri", r: "Imereti", v: "750 ml" },
    { p: "maiseli", c: "wine", n: "Tsinandali Reserve", col: "white", typ: "dry", g: "Rkatsiteli, Mtsvane", r: "Tsinandali, Kakheti (PDO)", v: "750 ml" },
    { p: "maiseli", c: "wine", n: "Saperavi Reserve", col: "red", typ: "dry", g: "Saperavi", r: "Kakheti", v: "750 ml" },
    { p: "maiseli", c: "wine", n: "Kisi", col: "white", typ: "semisweet", g: "Kisi", r: "Kakheti", v: "750 ml" },
    { p: "maiseli", c: "wine", n: "Tvishi", col: "white", typ: "semisweet", g: "Tsolikauri", r: "Tvishi, Racha-Lechkhumi (PDO)", v: "750 ml" },
    { p: "maiseli", c: "wine", n: "Kindzmarauli", col: "red", typ: "semisweet", g: "Saperavi", r: "Kindzmarauli, Kakheti (PDO)", v: "750 ml" },
    { p: "maiseli", c: "wine", n: "Rose", col: "rose", typ: "semisweet", g: "Saperavi", r: "Kakheti", v: "750 ml" },
    { p: "maiseli", c: "qvevri", n: "Saperavi Qvevri", col: "red", typ: "dry", g: "Saperavi", r: "Kakheti", v: "750 ml" },

    /* ============================ PIRVELI (catalogue: full tech data) ============================ */
    { p: "pirveli", c: "wine", n: "Saperavi OAK", col: "red", typ: "dry", g: "Saperavi", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2022", abv: "13.5%" },
    { p: "pirveli", c: "wine", n: "Saperavi", col: "red", typ: "dry", g: "Saperavi", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2023", abv: "13.5%" },
    { p: "pirveli", c: "wine", n: "Saperavi Limited", col: "red", typ: "dry", g: "Saperavi", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2024", abv: "16%" },
    { p: "pirveli", c: "wine", n: "Saperavi Semi-Sweet", col: "red", typ: "semisweet", g: "Saperavi", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2022", abv: "13.5%" },
    { p: "pirveli", c: "wine", n: "Cuvée", col: "white", typ: "semisweet", g: "Khikhvi, Kisi, Mtsvane", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2022", abv: "13%" },
    { p: "pirveli", c: "wine", n: "Kisi", col: "white", typ: "dry", g: "Kisi", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2022", abv: "13.5%" },
    { p: "pirveli", c: "wine", n: "Khikhvi", col: "white", typ: "dry", g: "Khikhvi", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2022", abv: "13%" },
    { p: "pirveli", c: "wine", n: "Mtsvane", col: "white", typ: "dry", g: "Mtsvane", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2022", abv: "13.5%" },
    { p: "pirveli", c: "qvevri", n: "Saperavi Qvevri", col: "red", typ: "dry", g: "Saperavi", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2022", abv: "13%" },
    { p: "pirveli", c: "qvevri", n: "Kisi Qvevri", col: "amber", typ: "dry", g: "Kisi", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2022", abv: "12.5%" },
    { p: "pirveli", c: "qvevri", n: "Khikhvi Qvevri", col: "amber", typ: "dry", g: "Khikhvi", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2023", abv: "13%" },
    { p: "pirveli", c: "qvevri", n: "Mtsvane Qvevri", col: "amber", typ: "dry", g: "Mtsvane", r: "Gulgula, Kakheti", v: "750 ml", vintage: "2022", abv: "13%" },

    /* ============================ LEMONADES (BIA) ============================ */
    { p: "bia", c: "lemonade", n: "Saperavi", flavour: "Saperavi", v: "0.5 L" },
    { p: "bia", c: "lemonade", n: "Tarragon", flavour: "Tarragon", v: "0.5 L" },
    { p: "bia", c: "lemonade", n: "Pear",     flavour: "Pear",     v: "0.5 L" },
    { p: "bia", c: "lemonade", n: "Feijoa",   flavour: "Feijoa",   v: "0.5 L" },
    { p: "bia", c: "lemonade", n: "Lemon",    flavour: "Lemon",    v: "0.5 L" }
  ];

  var PRODUCER = { rtv: "RTVELISI", bediani: "Winery Bediani", bia: "BIA", maiseli: "Maiseli", pirveli: "Pirveli" };

  // Section order + i18n title keys
  var SECTIONS = [
    { c: "wine",      key: "cat.sec.wines" },
    { c: "qvevri",    key: "cat.sec.qvevri" },
    { c: "sparkling", key: "cat.sec.sparkling" },
    { c: "spirit",    key: "cat.sec.spirits" },
    { c: "lemonade",  key: "cat.sec.lemonades" }
  ];

  var COLOUR_CLASS = { red: "red", white: "amber", amber: "amber", rose: "rose" };

  function slugFor(item) {
    var base = [PRODUCER[item.p], item.n, item.col || item.badge || "", item.typ || item.sub || ""].join(" ");
    return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function specRow(labelKey, value) {
    return '<li><span data-i18n="' + labelKey + '"></span><b>' + esc(value) + "</b></li>";
  }

  function cardHTML(item, idx) {
    var slug = slugFor(item);
    var img = "assets/products/" + slug + ".png";
    var delay = (idx % 3) + 1;

    // badge (top-right)
    var badgeCls, badgeInner;
    if (item.c === "lemonade") {
      badgeCls = "wine-badge--lemon";
      badgeInner = '<span data-i18n="cat.badge.lemonade"></span>';
    } else if (item.c === "spirit") {
      badgeCls = item.badge === "chacha" ? "wine-badge--amber" : "wine-badge--brandy";
      badgeInner = '<span data-i18n="cat.badge.' + item.badge + '"></span>';
    } else {
      badgeCls = "wine-badge--" + (COLOUR_CLASS[item.col] || "amber");
      badgeInner = '<span data-i18n="cat.col.' + item.col + '"></span> <span data-i18n="cat.typ.' + item.typ + '"></span>';
    }

    // specs
    var specs = "";
    if (item.c === "lemonade") {
      specs += specRow("products.spec.flavour", item.flavour);
      specs += '<li><span data-i18n="products.spec.type"></span><b data-i18n="cat.lem.noalc"></b></li>';
      specs += specRow("products.spec.volume", item.v);
      specs += specRow("products.spec.producer", PRODUCER[item.p]);
    } else if (item.c === "spirit") {
      specs += '<li><span data-i18n="products.spec.type"></span><b data-i18n="cat.sub.' + item.sub + '"></b></li>';
      specs += specRow("products.spec.variety", item.g);
      specs += specRow("products.spec.region", item.r);
      specs += specRow("products.spec.volume", item.v);
      specs += specRow("products.spec.producer", PRODUCER[item.p]);
    } else {
      specs += specRow("products.spec.variety", item.g);
      specs += specRow("products.spec.region", item.r);
      if (item.vintage) specs += specRow("products.spec.vintage", item.vintage);
      if (item.abv) specs += specRow("products.spec.alcohol", item.abv);
      specs += specRow("products.spec.volume", item.v);
      specs += specRow("products.spec.producer", PRODUCER[item.p]);
    }

    return (
      '<article class="wine-card" data-reveal data-delay="' + delay + '">' +
        '<div class="wine-media is-empty">' +
          '<img src="' + img + '" alt="' + esc(item.n) + '" loading="lazy" ' +
            'onload="this.closest(\'.wine-media\').classList.remove(\'is-empty\');" ' +
            'onerror="this.remove();">' +
        "</div>" +
        '<div class="wine-body">' +
          '<div class="wine-head"><h3>' + esc(item.n) + "</h3>" +
            '<span class="wine-badge ' + badgeCls + '">' + badgeInner + "</span>" +
          "</div>" +
          '<ul class="wine-specs">' + specs + "</ul>" +
          '<a class="btn btn--outline" href="contact.html" data-i18n="common.requestInfo"></a>' +
        "</div>" +
      "</article>"
    );
  }

  function render() {
    var mount = document.getElementById("catalog");
    if (!mount) return;
    var html = "";
    SECTIONS.forEach(function (sec) {
      var items = CATALOG.filter(function (it) { return it.c === sec.c; });
      if (!items.length) return;
      html +=
        '<section class="section ' + (sec.c === "qvevri" || sec.c === "spirit" ? "section--white" : "section--cream") + '">' +
          '<div class="container">' +
            '<div class="section-head section-head--center" data-reveal>' +
              '<div class="accent-line"></div>' +
              '<h2 class="section-title" data-i18n="' + sec.key + '"></h2>' +
              '<p class="section-sub" data-i18n="' + sec.key + '.sub"></p>' +
            "</div>" +
            '<div class="grid wine-grid">' +
              items.map(cardHTML).join("") +
            "</div>" +
          "</div>" +
        "</section>";
    });
    mount.innerHTML = html;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
