(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[zayg] " + name, e); } }

  /* Sin splash: la página aparece de inmediato */
  document.addEventListener("DOMContentLoaded", function () { document.dispatchEvent(new Event("zayg:ready")); });

  /* ---------- Video del hero: solo escritorio, sin ahorro de datos ni reducir movimiento ---------- */
  safe(function () {
    var v = $(".hero-video"); if (!v) return;
    var conn = navigator.connection || {};
    var ok = window.matchMedia("(min-width:861px)").matches && !reduced && !conn.saveData;
    if (!ok) return;
    v.src = v.getAttribute("data-src");
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
      }).observe(v);
    } else v.play();
  }, "hero-video");

  /* ---------- Barra fija móvil: aparece tras el hero, se oculta en contacto ---------- */
  safe(function () {
    var bar = $("#mBar"), hero = $(".hero"), contacto = $("#contacto"); if (!bar || !("IntersectionObserver" in window)) return;
    var pastHero = false, inContact = false;
    function upd() { bar.classList.toggle("is-on", pastHero && !inContact); }
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(function (e) { inContact = e[0].isIntersecting; upd(); }, { threshold: 0.05 }).observe(contacto);
  }, "m-bar");

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
      clearTimeout(menu._t);
      if (open) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add("is-open"); }); }
      else { menu.classList.remove("is-open"); menu._t = setTimeout(function () { menu.hidden = true; }, 260); }
      document.body.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) { var f = $("a", menu); if (f) f.focus(); } else if (document.activeElement && menu.contains(document.activeElement)) burger.focus();
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
          el.style.transitionDelay = Math.min(i, 5) * 55 + "ms";
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
      cancelAnimationFrame(el._raf); var from = parseInt(el.textContent, 10) || 0, t0 = null, d = 450;
      if (reduced) { el.textContent = to; return; }
      function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / d); var e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(from + (to - from) * e); if (p < 1) el._raf = requestAnimationFrame(step); }
      el._raf = requestAnimationFrame(step);
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
    $$(".reel-frame").forEach(function (fr) {
      var v = $(".reel-video", fr), btn = $(".reel-sound", fr); if (!v || !btn) return;
      var src = $("source", v);
      v.addEventListener("error", function () { v.style.display = "none"; }, true);
      if (src) src.addEventListener("error", function () { v.style.display = "none"; });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (en) {
          en.forEach(function (e) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
        }, { threshold: 0.25 }).observe(v);
      }
      function setSound(on) { v.muted = !on; btn.setAttribute("aria-pressed", String(on)); var s = $("span", btn); if (s) s.textContent = on ? "Silenciar" : "Activar música"; else btn.textContent = on ? "Silenciar" : "Activar música"; }
      btn.addEventListener("click", function () { setSound(v.muted); if (!v.muted) v.play(); });
      v.addEventListener("click", function () { if (v.paused) v.play(); else v.pause(); });
      if (reduced) { v.removeAttribute("data-autoplay"); }
      fr._play = function () { setSound(true); v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    });
    var w = $("#watchBtn"), ef = $(".empresa-frame");
    if (w && ef) w.addEventListener("click", function () {
      var r = ef.getBoundingClientRect();
      if (r.top < 70 || r.bottom > innerHeight) window.scrollTo({ top: scrollY + r.top - 100, behavior: "smooth" });
      if (ef._play) ef._play();
    });
  }, "reel");

  /* ---------- FAQ: solo una abierta ---------- */
  safe(function () {
    var ds = $$(".faq details");
    ds.forEach(function (d) { d.addEventListener("toggle", function () { if (d.open) ds.forEach(function (o) { if (o !== d) o.open = false; }); }); });
  }, "faq");

  /* ---------- Formulario: envío a enviar.php (SMTP) ---------- */
  safe(function () {
    var f = $("#form"), msg = $("#formMsg"), btn = $("button[type=submit]", f);
    var q = location.search.match(/envio=(ok|error)/);
    if (q) msg.textContent = q[1] === "ok" ? "Gracias, recibimos tu solicitud. Te contactaremos pronto." : "No pudimos enviar tu solicitud. Escríbenos a info@zayg.cl.";
    function mailto(d) {
      var body = ["Nombre: " + d.get("nombre") + " " + d.get("apellido"), "Empresa: " + (d.get("empresa") || "-"),
        "Correo: " + d.get("correo"), "Teléfono: " + (d.get("telefono") || "-"), "", d.get("mensaje") || ""].join("\n");
      return "mailto:info@zayg.cl?subject=" + encodeURIComponent("Solicitud desde zayg.cl · " + d.get("nombre") + " " + d.get("apellido")) + "&body=" + encodeURIComponent(body);
    }
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", f).forEach(function (i) {
        var bad = !i.value.trim() || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(i.value));
        i.classList.toggle("is-err", bad); if (bad) ok = false;
      });
      if (!ok) { msg.textContent = "Revisa los campos marcados, por favor."; return; }
      var d = new FormData(f);
      var lbl = $("span", btn), txt = lbl.textContent;
      btn.disabled = true; lbl.textContent = "Enviando…"; msg.textContent = "";
      fetch(f.getAttribute("action"), { method: "POST", body: d, headers: { "X-Requested-With": "fetch" } })
        .then(function (r) {
          var ct = r.headers.get("content-type") || "";
          if (ct.indexOf("json") < 0) throw new Error("sin-servidor");
          return r.json();
        })
        .then(function (res) {
          msg.textContent = res.mensaje;
          if (res.ok) { f.reset(); lbl.textContent = "Enviado"; btn.classList.add("is-sent"); setTimeout(function () { lbl.textContent = txt; btn.classList.remove("is-sent"); }, 4000); }
          else lbl.textContent = txt;
        })
        .catch(function () {
          // Sin PHP (vista previa): abre el correo con la solicitud lista
          lbl.textContent = txt;
          location.href = mailto(d);
          msg.textContent = "Abrimos tu correo con la solicitud lista para enviar a info@zayg.cl.";
        })
        .then(function () { btn.disabled = false; });
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
      tl.from(".hero-title .line > span", { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.07 })
        .from(".kicker, .hero-lead, .hero-ctas", { y: 16, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 }, "-=0.6")
        .from(".hero-top, .hero-bottom", { opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".spec-card", { x: 24, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.6");
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
        trigger: ".manifesto-text", start: "top 85%", end: "bottom 55%", scrub: true,
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
