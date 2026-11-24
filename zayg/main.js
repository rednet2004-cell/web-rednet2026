(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[zayg] " + name, e); } }

  /* ---------- Splash (doble red de seguridad) ---------- */
  var splash = $("#splash");
  var splashDone = false;
  function hideSplash() {
    if (splashDone || !splash) return;
    splashDone = true;
    splash.classList.add("is-out");
    document.dispatchEvent(new Event("zayg:ready"));
  }
  window.addEventListener("load", function () { setTimeout(hideSplash, 500); });
  setTimeout(hideSplash, 2600);

  /* ---------- Nav ---------- */
  safe(function () {
    var nav = $("#nav"), lastY = 0;
    function onScroll() {
      var y = window.scrollY;
      nav.classList.toggle("is-solid", y > window.innerHeight * 0.6);
      nav.classList.toggle("is-hidden", y > lastY && y > 600 && !document.body.classList.contains("menu-open"));
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var burger = $("#burger"), menu = $("#mobileMenu");
    function setMenu(open) {
      burger.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
      document.body.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }
    burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }, "nav");

  /* ---------- Coordenadas del hero ---------- */
  safe(function () {
    var c = $("#coords"); if (!c || !fine) return;
    var hero = $(".hero");
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = Math.round((e.clientX - r.left) / r.width * 999);
      var y = Math.round((e.clientY - r.top) / r.height * 999);
      c.textContent = "X " + String(x).padStart(3, "0") + " · Y " + String(y).padStart(3, "0");
    });
  }, "coords");

  /* ---------- Reveal con IntersectionObserver (umbral bajo + timeout) ---------- */
  safe(function () {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target, sibs = $$(".reveal", el.parentNode), i = Math.max(0, sibs.indexOf(el));
          el.style.transitionDelay = Math.min(i, 5) * 70 + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in"); }); }, 3500);
  }, "reveal");

  /* ---------- Modelos ---------- */
  safe(function () {
    var models = [
      { name: "Modelo 216 · Taller compacto", area: 216, dim: "12 × 18 m", h: "6,0 m", hu: "4,5 m", doors: "1 enrollable", use: "Taller, bodega de apoyo, pyme" },
      { name: "Modelo 450 · Bodega y taller", area: 450, dim: "15 × 30 m", h: "7,0 m", hu: "5,5 m", doors: "1 enrollable", use: "Bodegaje, taller, distribución" },
      { name: "Modelo 600 · Operación logística", area: 600, dim: "20 × 30 m", h: "8,0 m", hu: "6,0 m", doors: "2 enrollables", use: "Logística, producción, packing" }
    ];
    var tabs = $$(".model-tabs [role=tab]"), imgs = $$(".model-imgs img");
    var areaEl = $("#mArea");
    function countTo(el, to) {
      var from = parseInt(el.textContent, 10) || 0, t0 = null, d = 700;
      if (reduced) { el.textContent = to; return; }
      function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / d); var e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(from + (to - from) * e); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    function select(i) {
      var m = models[i];
      tabs.forEach(function (t, k) { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; });
      imgs.forEach(function (im, k) { im.classList.toggle("is-on", k === i); });
      $("#mName").textContent = m.name; $("#mDim").textContent = m.dim; $("#mH").textContent = m.h;
      $("#mHu").textContent = m.hu; $("#mDoors").textContent = m.doors; $("#mUse").textContent = m.use;
      countTo(areaEl, m.area);
      var cta = $("[data-model-cta]"); if (cta) cta.dataset.model = m.area;
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          var n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length; tabs[n].focus(); select(n);
        }
      });
    });
    var cta = $("[data-model-cta]");
    if (cta) cta.addEventListener("click", function () {
      var a = parseInt(cta.dataset.model || "450", 10);
      var txt = $("textarea[name=mensaje]"); if (txt && !txt.value) txt.value = "Me interesa el modelo de " + a + " m².";
      var v = a <= 250 ? "Hasta 250 m²" : a <= 500 ? "250 a 500 m²" : "500 a 1.000 m²";
      var r = $('input[name=m2][value="' + v + '"]'); if (r) r.checked = true;
    });
  }, "modelos");

  /* ---------- Manifiesto: palabras que se llenan con el scroll ---------- */
  var fillWords = [];
  safe(function () {
    var p = $("[data-fill]"); if (!p) return;
    var words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map(function (w) { return '<span class="w">' + w.replace(/</g, "&lt;") + "</span>"; }).join(" ");
    fillWords = $$(".w", p);
    if (reduced) fillWords.forEach(function (w) { w.style.opacity = 1; });
  }, "fill");

  /* ---------- Servicios: imagen que sigue al cursor ---------- */
  safe(function () {
    if (!fine) return;
    var follow = $(".svc-follow"), img = $("img", follow);
    var x = 0, y = 0, cx = 0, cy = 0, active = false, raf = null;
    function loop() {
      cx += (x - cx) * 0.14; cy += (y - cy) * 0.14;
      follow.style.transform = "translate(" + (cx - 150) + "px," + (cy - 112) + "px) scale(" + (active ? 1 : 0.6) + ")";
      if (active || Math.abs(x - cx) > 0.5) raf = requestAnimationFrame(loop); else raf = null;
    }
    $$(".svc").forEach(function (li) {
      li.addEventListener("mouseenter", function (e) {
        img.src = li.dataset.img; active = true; follow.style.opacity = 1;
        if (!cx) { cx = e.clientX; cy = e.clientY; }
        if (!raf) raf = requestAnimationFrame(loop);
      });
      li.addEventListener("mouseleave", function () { active = false; follow.style.opacity = 0; });
      li.addEventListener("mousemove", function (e) { x = e.clientX + 120; y = e.clientY; });
    });
  }, "svc-follow");

  /* ---------- Botones magnéticos ---------- */
  safe(function () {
    if (!fine || reduced) return;
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.18 + "px," + (e.clientY - r.top - r.height / 2) * 0.28 + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }, "magnetic");

  /* ---------- Video 9:16: reproducir solo cuando se ve ---------- */
  safe(function () {
    var v = $(".reel-video"), btn = $(".reel-sound"); if (!v) return;
    var src = $("source", v);
    v.addEventListener("error", function () { v.style.display = "none"; }, true);
    if (src) src.addEventListener("error", function () { v.style.display = "none"; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
      }, { threshold: 0.25 }).observe(v);
    }
    btn.addEventListener("click", function () {
      v.muted = !v.muted; btn.setAttribute("aria-pressed", String(!v.muted)); btn.textContent = "Sonido · " + (v.muted ? "OFF" : "ON");
      if (!v.muted) v.play();
    });
  }, "reel");

  /* ---------- FAQ: solo una abierta ---------- */
  safe(function () {
    var ds = $$(".faq details");
    ds.forEach(function (d) { d.addEventListener("toggle", function () { if (d.open) ds.forEach(function (o) { if (o !== d) o.open = false; }); }); });
  }, "faq");

  /* ---------- Formulario (demo) ---------- */
  safe(function () {
    var f = $("#form"), msg = $("#formMsg");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", f).forEach(function (i) {
        var bad = !i.value.trim() || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(i.value));
        i.classList.toggle("is-err", bad); if (bad) ok = false;
      });
      if (!ok) { msg.textContent = "Revisa tu nombre y correo, por favor."; return; }
      msg.textContent = "¡Gracias! Recibimos tu solicitud y te contactaremos en un día hábil.";
      f.reset();
    });
  }, "form");

  /* ---------- GSAP ---------- */
  function initGsap() {
    if (!window.gsap || !window.ScrollTrigger) return;
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);

    // Entrada del hero
    safe(function () {
      if (reduced) return;
      var tl = gsap.timeline({ delay: 0.1 });
      tl.from(".hero-title .line > span", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.09 })
        .from(".kicker, .hero-lead, .hero-ctas", { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, "-=0.8")
        .from(".hero-top, .hero-bottom", { opacity: 0, duration: 1 }, "-=0.6")
        .from(".spec-card", { x: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.9");
    }, "hero-in");

    if (reduced) return;
    var mm = gsap.matchMedia();

    // Parallax del video del hero
    safe(function () {
      gsap.to(".hero-video", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-copy", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });
    }, "hero-parallax");

    // Manifiesto
    safe(function () {
      if (!fillWords.length) return;
      ST.create({
        trigger: ".manifesto", start: "top 75%", end: "bottom 45%", scrub: true,
        onUpdate: function (s) {
          var n = Math.round(s.progress * fillWords.length);
          for (var i = 0; i < fillWords.length; i++) fillWords[i].style.opacity = i < n ? 1 : 0.14;
        }
      });
    }, "manifesto");

    // Parallax de imágenes
    safe(function () {
      $$(".parallax img").forEach(function (img) {
        gsap.fromTo(img, { yPercent: -8 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: img.closest("section") || img, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, "parallax");

    // Proceso: scroll horizontal fijado (solo escritorio)
    mm.add("(min-width: 761px)", function () {
      var steps = $("#steps"), pin = $(".proceso-pin"), bar = $("#procBar");
      function dist() { return Math.max(0, steps.scrollWidth - (window.innerWidth - steps.getBoundingClientRect().left) + 40); }
      var tw = gsap.to(steps, {
        x: function () { return -dist(); }, ease: "none",
        scrollTrigger: {
          trigger: pin, start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (s) { bar.style.transform = "scaleX(" + s.progress + ")"; }
        }
      });
      return function () { tw.kill(); };
    });

    // Footer gigante
    safe(function () {
      gsap.from(".footer-giant", { yPercent: 40, opacity: 0, ease: "power2.out", scrollTrigger: { trigger: ".footer", start: "top 90%", end: "bottom bottom", scrub: true } });
    }, "footer");

    window.addEventListener("load", function () { ST.refresh(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { safe(initGsap, "gsap"); });
  else safe(initGsap, "gsap");
})();
