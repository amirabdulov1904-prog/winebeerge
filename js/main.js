/* ============================================================================
   Wine & Beer Georgia — main.js
   Handles: language switching (EN / RU / KA), scroll fade-in animations,
   mobile navigation toggle, sticky-header shadow, and contact form handling.
   Vanilla JS, no dependencies. Requires translations.js to load first.
============================================================================ */

(function () {
  "use strict";

  var SUPPORTED = ["en", "ru", "ka"];
  var STORAGE_KEY = "wbg-lang";
  var DEFAULT_LANG = "en";

  /* --------------------------------------------------------------------------
     Translation lookup with graceful fallbacks.
     - For KA, any missing key resolves to the "[KA: translation needed]"
       placeholder (the client will supply real Georgian copy later).
     - For RU, a missing key falls back to English so nothing ever renders blank.
  -------------------------------------------------------------------------- */
  function t(lang, key) {
    var dict = translations[lang] || translations.en;
    if (Object.prototype.hasOwnProperty.call(dict, key)) {
      return dict[key];
    }
    if (lang === "ka") {
      return typeof KA_PLACEHOLDER !== "undefined" ? KA_PLACEHOLDER : "[KA: translation needed]";
    }
    // RU (or anything else) → fall back to English, then to the raw key.
    if (Object.prototype.hasOwnProperty.call(translations.en, key)) {
      return translations.en[key];
    }
    return key;
  }

  function getSavedLang() {
    var saved;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      saved = null;
    }
    return SUPPORTED.indexOf(saved) !== -1 ? saved : DEFAULT_LANG;
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage unavailable (e.g. private mode) — ignore. */
    }
  }

  /* --------------------------------------------------------------------------
     Apply a language to the whole document.
       data-i18n             → element textContent
       data-i18n-placeholder → element placeholder attribute
       data-i18n-aria        → element aria-label attribute
  -------------------------------------------------------------------------- */
  function applyLanguage(lang) {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("data-lang", lang);

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(lang, nodes[i].getAttribute("data-i18n"));
    }

    var ph = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < ph.length; j++) {
      ph[j].setAttribute("placeholder", t(lang, ph[j].getAttribute("data-i18n-placeholder")));
    }

    var aria = document.querySelectorAll("[data-i18n-aria]");
    for (var k = 0; k < aria.length; k++) {
      aria[k].setAttribute("aria-label", t(lang, aria[k].getAttribute("data-i18n-aria")));
    }

    // Update the active state on the language switcher buttons.
    var buttons = document.querySelectorAll(".lang-btn");
    for (var b = 0; b < buttons.length; b++) {
      var isActive = buttons[b].getAttribute("data-lang") === lang;
      buttons[b].classList.toggle("is-active", isActive);
      buttons[b].setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function setLanguage(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    saveLang(lang);
    applyLanguage(lang);
  }

  /* --------------------------------------------------------------------------
     Wire up the language switcher buttons.
  -------------------------------------------------------------------------- */
  function initLangSwitcher() {
    var buttons = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        setLanguage(this.getAttribute("data-lang"));
      });
    }
  }

  /* --------------------------------------------------------------------------
     Mobile navigation toggle (hamburger).
  -------------------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-locked", open);
    });

    // Close the menu when a navigation link is clicked (mobile).
    var links = menu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-locked");
      });
    }
  }

  /* --------------------------------------------------------------------------
     Sticky header: add a shadow/condensed state once the user scrolls.
  -------------------------------------------------------------------------- */
  function initStickyHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------------------
     Fade-in on scroll using IntersectionObserver (with a no-JS-safe fallback:
     elements are visible by default and only animate when JS is present).
  -------------------------------------------------------------------------- */
  function initScrollReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    // Mark that JS reveal is active so CSS can hide elements pre-animation.
    document.documentElement.classList.add("reveal-ready");

    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("is-visible");
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    for (var j = 0; j < els.length; j++) observer.observe(els[j]);
  }

  /* --------------------------------------------------------------------------
     Contact form — submits to Web3Forms (https://web3forms.com), which emails
     the submission to the address registered with the access key in the form's
     hidden <input name="access_key">. No backend required.

     Until a real access key is configured (value still starts with "YOUR_"),
     it falls back to a demo success message without sending anything — so the
     form stays usable in local preview.
  -------------------------------------------------------------------------- */
  var WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

  function showStatus(el, msg, isError) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-visible");
    el.classList.toggle("is-error", !!isError);
  }

  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;
    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector('[type="submit"]');
    var keyInput = form.querySelector('input[name="access_key"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var lang = getSavedLang();
      var key = keyInput ? keyInput.value : "";

      // No real key yet → demo mode (don't actually send).
      if (!key || key.indexOf("YOUR_") === 0) {
        showStatus(status, t(lang, "contact.form.success"), false);
        form.reset();
        return;
      }

      var originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t(lang, "contact.form.sending");
      }
      showStatus(status, t(lang, "contact.form.sending"), false);

      fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.success) {
            showStatus(status, t(lang, "contact.form.success"), false);
            form.reset();
          } else {
            showStatus(status, t(lang, "contact.form.error"), true);
          }
        })
        .catch(function () {
          showStatus(status, t(lang, "contact.form.error"), true);
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        });
    });
  }

  /* --------------------------------------------------------------------------
     Footer year (keeps © current even though the design specifies 2025).
  -------------------------------------------------------------------------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     Init
  -------------------------------------------------------------------------- */
  function init() {
    applyLanguage(getSavedLang());
    initLangSwitcher();
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initContactForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
