/* ============================================================
   4A REAL ESTATE — SITE BEHAVIOURS
   WhatsApp, calculator, lead form, menu, reveals, counters,
   lightbox, rayed-motion-safe
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Config ---------- */
  var PHONE_TEL = "+923333959207";
  var WA_NUMBER = "923333959207";
  var GENERAL_MSG =
    "Hello Muhammad Ayan, I found 4A Real Estate and I'm interested in " +
    "property investment. Please share the available projects and payment plans.";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function waUrl(text) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  }
  function openWa(text, target) {
    (target || window.open)(waUrl(text), "_blank", "noopener");
  }

  /* [36] Current year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  var backTop = document.getElementById("backToTop");
  var stickyCta = document.getElementById("stickyCta");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (backTop) backTop.classList.toggle("show", y > 640);
    if (stickyCta) stickyCta.classList.toggle("show", y > 380);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobileNav");

  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    if (hamburger) {
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open navigation menu");
    }
  }
  function toggleMenu() {
    if (!mobileNav) return;
    var open = mobileNav.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    if (hamburger) {
      hamburger.setAttribute("aria-expanded", String(open));
      hamburger.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    }
  }
  if (hamburger) hamburger.addEventListener("click", toggleMenu);
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1199) closeMenu();
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scroll-spy: active nav state [37] ---------- */
  var navLinks = document.querySelectorAll(".nav-links a");
  if (navLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) {
              l.classList.toggle(
                "active",
                l.getAttribute("href") === "#" + entry.target.id
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ["hero", "projects", "locations", "investment", "ayan", "contact"]
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean)
      .forEach(function (sec) { spy.observe(sec); });
  }

  /* ---------- Reveal on scroll [38][45] ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------- Counters ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400;
    var t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counted = [];
  var counters = document.querySelectorAll(".stat-num[data-count]");
  if (reduced || !("IntersectionObserver" in window)) {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || ""); });
  } else {
    var countObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && counted.indexOf(entry.target) === -1) {
            counted.push(entry.target);
            animateCounter(entry.target);
            countObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { countObs.observe(el); });
  }

  /* ---------- Hero video ---------- */
  var heroEl = document.getElementById("hero");
  var heroVideo = document.querySelector(".hero-video");
  if (heroEl && heroVideo) {
    var posterD = heroVideo.getAttribute("poster");
    var posterM = heroVideo.getAttribute("data-poster-mobile") || posterD;
    function showHeroPoster() {
      if (heroEl.classList.contains("poster-mode")) return;
      heroEl.classList.add("poster-mode");
      try { heroVideo.pause(); } catch (e) {}
      var poster = window.matchMedia("(max-width: 767px)").matches ? posterM : posterD;
      if (poster) heroEl.style.backgroundImage = 'url("' + poster + '")';
    }
    if (reduced) {
      showHeroPoster();
    } else {
      heroVideo.addEventListener("error", showHeroPoster, { once: true });
      if (typeof heroVideo.play === "function") {
        var heroPlay = heroVideo.play();
        if (heroPlay && typeof heroPlay.catch === "function") heroPlay.catch(showHeroPoster);
      }
      window.setTimeout(function () {
        if (heroVideo.readyState === 0) showHeroPoster();
      }, 4000);
    }
  }

  /* ---------- Calculator [22] ---------- */
  var propValue = document.getElementById("propValue");
  var downPct = document.getElementById("downPct");
  var duration = document.getElementById("duration");
  var resInitial = document.getElementById("resInitial");
  var resBalance = document.getElementById("resBalance");
  var resMonthly = document.getElementById("resMonthly");
  var calcWaBtn = document.getElementById("calcWaBtn");

  function fmtPkr(n) {
    return "PKR " + Math.round(n).toLocaleString("en-PK");
  }
  function calc() {
    var v = parseFloat(propValue.value) || 0;
    var d = parseFloat(downPct.value) || 0;
    var m = parseInt(duration.value, 10) || 96;
    var initial = v * (d / 100);
    var balance = v - initial;
    var monthly = m > 0 ? balance / m : 0;
    if (resInitial) resInitial.textContent = fmtPkr(initial);
    if (resBalance) resBalance.textContent = fmtPkr(balance);
    if (resMonthly) resMonthly.textContent = fmtPkr(monthly);
    return { v: v, d: d, m: m, initial: initial, balance: balance, monthly: monthly };
  }
  if (propValue && downPct && duration) {
    [propValue, downPct, duration].forEach(function (el) {
      el.addEventListener("input", calc);
      el.addEventListener("change", calc);
    });
    calc();
  }
  if (calcWaBtn) {
    calcWaBtn.addEventListener("click", function () {
      var r = calc();
      var msg =
        "Hello Ayan, I used the 4A Real Estate calculator.\n" +
        "Property Value: " + fmtPkr(r.v) + "\n" +
        "Down Payment: " + r.d + "% (" + fmtPkr(r.initial) + ")\n" +
        "Duration: " + r.m + " months\n" +
        "Estimated Monthly Installment: " + fmtPkr(r.monthly) + "\n" +
        "Please share the best matching MGC project and current payment details.";
      openWa(msg);
    });
  }

  /* ---------- Matching questionnaire [23] ---------- */
  var matchForm = document.getElementById("matchForm");
  var matchResult = document.getElementById("matchResult");
  var matchTitle = document.getElementById("matchTitle");
  var matchText = document.getElementById("matchText");
  var matchWa = document.getElementById("matchWa");

  var MATCH_COPY = {
    Apartment: {
      title: "A home — residential focus",
      text: "Start with the residential options 4A represents right now — MGC Jewel (1–2 bedroom, jacuzzi and beach-view apartments, penthouses), El Casa by MGC (1–3 bedroom with Margalla views), Liberty Terraces (open terrace apartments) or MGC-5 (Phase 7). Tell Ayan your size preference and area, and he'll shortlist real availability on WhatsApp."
    },
    Commercial: {
      title: "A commercial investment",
      text: "MGC Jewel offers brand-committed shops, an IT Mart, kiosks and a 12-kanal HyperMart; MGC Divine has retail shops and executive offices; Picasso by MGC is a food-business destination near Food Street. Share your budget with Ayan and he'll match you to open units."
    },
    Hospitality: {
      title: "A hospitality investment",
      text: "Best Western PLUS inside MGC Jewel (Standard, Executive, Deluxe suites), the MGC Hotel inside MGC Divine, and the Holiday Inn &amp; Suites on GT Road — Pakistan's first 4-star Holiday Inn, an IHG franchise. These earn through professionally managed hotel operations."
    },
    "Long-Term Investment": {
      title: "A long-term investment",
      text: "Bahria Town Phase 8 anchors flagship appreciation (MGC Jewel, Liberty Terraces), Mumtaz City offers airport-side growth (El Casa), and GT Road hospitality compounds over many years. Let's map your budget against 4A's current shortlist."
    },
    "Not Sure": {
      title: "Not sure yet — perfect.",
      text: "Most good investments start exactly here. Ayan will ask three questions — budget, timeline, and whether it's for living or earning — and recommend just two or three projects worth your attention. No pressure, no jargon."
    }
  };

  function matchRecommend() {
    var budget = document.getElementById("mBudget").value;
    var type = document.getElementById("mType").value;
    var loc = document.getElementById("mLoc").value;
    var purpose = document.getElementById("mPurpose").value;

    var empty = [budget, type, loc, purpose].indexOf("") !== -1;
    if (empty) {
      if (matchResult) matchResult.classList.remove("show");
      return;
    }

    var c = MATCH_COPY[type] || MATCH_COPY["Not Sure"];
    var lead;
    if (loc === "Bahria Town") {
      lead = "Bahria Town holds the dense commercial core — MGC Jewel, Divine, Liberty Terraces, MGC-5 and Picasso all sit there. ";
    } else if (loc === "DHA / GT Road") {
      lead = "The GT Road / DHA-II belt is where the Holiday Inn &amp; Suites will rise, and it links directly to Bahria Town's core. ";
    } else if (loc === "Mumtaz City") {
      lead = "Mumtaz City is the airport-side growth corridor — home of El Casa by MGC. ";
    } else {
      lead = "Across the whole Islamabad–Rawalpindi corridor, ";
    }

    var budgetNote =
      budget === "Under 50 Lac" ? " With an under-50-lac entry point, ask Ayan which starter units currently fit."
      : budget === "5 Crore+" ? " At the 5-crore-plus level, Ayan can compare the flagship and hospitality options head to head."
      : " Against your " + budget + " budget, Ayan can point you at the plans that currently fit.";

    if (matchTitle) matchTitle.textContent = c.title;
    if (matchText) matchText.innerHTML = lead + c.text + budgetNote;
    if (matchWa) {
      matchWa.setAttribute("href", waUrl(
        "Hello Ayan, I used the 4A Real Estate matching questionnaire.\n" +
        "Budget: " + budget + "\n" +
        "Property Type: " + type + "\n" +
        "Preferred Location: " + loc + "\n" +
        "Purpose: " + purpose + "\n" +
        "Please recommend the best matching MGC projects and share current availability and payment plans."
      ));
    }
    if (matchResult) {
      matchResult.classList.add("show");
      matchResult.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
    }
  }

  if (matchForm) matchForm.addEventListener("submit", function (e) { e.preventDefault(); matchRecommend(); });

  /* ---------- Lead form [29] ---------- */
  var leadForm = document.getElementById("leadForm");
  var formSuccess = document.getElementById("formSuccess");
  var formWaBtn = document.getElementById("formWaBtn");
  var pendingMsg = GENERAL_MSG;

  function submitForm(e) {
    e.preventDefault();
    var name = (document.getElementById("name").value || "").trim();
    var phone = (document.getElementById("phone").value || "").trim();

    if (!name || !phone) {
      leadForm.reportValidity();
      return;
    }
    var interest = document.getElementById("interest").value;
    var project = document.getElementById("preferredProject").value;
    var budget = document.getElementById("budget").value;
    var message = document.getElementById("message").value.trim();

    var msg =
      "New property inquiry from the 4A Real Estate website.\n" +
      "Name: " + name + "\n" +
      "Phone: " + phone + "\n" +
      "Interested In: " + interest + "\n" +
      "Preferred Project: " + project + "\n" +
      "Budget: " + budget +
      (message ? "\nMessage: " + message : "");

    pendingMsg = msg;
    if (formWaBtn) formWaBtn.setAttribute("href", waUrl(msg));
    leadForm.hidden = true;
    if (formSuccess) formSuccess.hidden = false;
  }
  if (leadForm) leadForm.addEventListener("submit", submitForm);

  /* ---------- Lightbox ---------- */
  var LB_SEL = ".gal-item img, .type-card img, .duo-item img";
  var lightbox = null;
  var LB_DECK = [];
  var LB_IDX = 0;

  function renderLightbox() {
    if (!lightbox) return;
    var item = LB_DECK[LB_IDX];
    if (!item) return;
    lightbox.querySelector("img").setAttribute("src", item.src);
    lightbox.querySelector("img").setAttribute("alt", item.alt || "");
    lightbox.querySelector(".lb-caption").textContent = item.cap || "";
    lightbox.querySelector(".lb-count").textContent = (LB_IDX + 1) + " / " + LB_DECK.length;
  }
  function stepLightbox(d) {
    if (!LB_DECK.length) return;
    LB_IDX = (LB_IDX + d + LB_DECK.length) % LB_DECK.length;
    renderLightbox();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  function ensureLightbox() {
    if (lightbox) return;
    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.innerHTML =
      '<button class="lb-close" aria-label="Close image">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous image">&#8249;</button>' +
      '<button class="lb-next" aria-label="Next image">&#8250;</button>' +
      '<span class="lb-count" aria-live="polite"></span>' +
      '<img alt="">' +
      '<div class="lb-caption"></div>';
    document.body.appendChild(lightbox);

    lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lb-prev").addEventListener("click", function (e) {
      e.stopPropagation();
      stepLightbox(-1);
    });
    lightbox.querySelector(".lb-next").addEventListener("click", function (e) {
      e.stopPropagation();
      stepLightbox(1);
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    window.addEventListener("keydown", function (e) {
      if (!lightbox || !lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") stepLightbox(-1);
      else if (e.key === "ArrowRight") stepLightbox(1);
    });
    var x0 = null;
    lightbox.addEventListener("touchstart", function (e) {
      x0 = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) stepLightbox(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  document.querySelectorAll(LB_SEL).forEach(function (img) {
    img.addEventListener("click", function () {
      var imgs = document.querySelectorAll(LB_SEL);
      var items = [];
      imgs.forEach(function (im) {
        items.push({
          src: im.currentSrc || im.src,
          alt: im.alt || "",
          cap: im.getAttribute("data-cap") || ""
        });
      });
      var cur = img.currentSrc || img.src;
      var idx = -1;
      for (var i = 0; i < items.length; i++) {
        if (items[i].src === cur) { idx = i; break; }
      }
      ensureLightbox();
      LB_DECK = items;
      LB_IDX = idx >= 0 ? idx : 0;
      renderLightbox();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  /* ---------- FAQ (native details; nothing needed) ---------- */
})();