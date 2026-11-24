/* Wasaff Logística v2 · interacciones */
(function () {
  "use strict";
  window.__BRAND__ = "wasaff-v2";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function safe(fn, n) { try { fn(); } catch (e) { if (window.console) console.warn("[wasaff] " + n, e); } }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  var fmt = function (n) { return Number(n).toLocaleString("es-CL"); };

  /* nav */
  safe(function () {
    var nav = $("#nav"), last = 0, burger = $(".burger"), drawer = $(".drawer");
    addEventListener("scroll", function () {
      var y = scrollY;
      nav.classList.toggle("is-hidden", y > 400 && y > last && drawer.hidden);
      last = y;
    }, { passive: true });
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open)); drawer.hidden = open;
    });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { burger.setAttribute("aria-expanded", "false"); drawer.hidden = true; }); });
  }, "nav");

  /* reveals */
  safe(function () {
    var t = $(".hero__title");
    requestAnimationFrame(function () { setTimeout(function () { t.classList.add("is-in"); }, 80); });
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var sib = $$(".reveal", en.target.parentElement), i = Math.max(0, sib.indexOf(en.target));
        en.target.style.transitionDelay = Math.min(i, 6) * 0.07 + "s";
        en.target.classList.add("is-in"); io.unobserve(en.target);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () { els.forEach(function (e) { if (e.getBoundingClientRect().top < innerHeight) e.classList.add("is-in"); }); }, 2500);
  }, "reveals");

  /* estaciones de la ruta se encienden */
  safe(function () {
    var st = $$(".station");
    if (!("IntersectionObserver" in window)) { st.forEach(function (s) { s.classList.add("is-on"); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-on"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -35% 0px", threshold: 0.01 });
    st.forEach(function (s) { io.observe(s); });
  }, "stations");


  /* selector de modalidades */
  safe(function () {
    var sw = $(".switch"), tabs = $$("[role=tab]", sw);
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        tabs.forEach(function (o, k) {
          o.setAttribute("aria-selected", String(k === i));
          var p = document.getElementById(o.getAttribute("aria-controls"));
          p.hidden = k !== i; p.classList.toggle("is-on", k === i);
        });
        sw.classList.toggle("is-2", i === 1);
      });
    });
  }, "modes");


  /* stepper con autoavance */
  safe(function () {
    var tabs = $$(".stepper__tabs button"), panels = $$(".sp"), cur = 0, timer, DUR = 6000;
    function go(i, user) {
      cur = i;
      tabs.forEach(function (t, k) {
        var on = k === i, bar = $("i", t);
        t.classList.toggle("is-on", on); t.setAttribute("aria-selected", String(on));
        bar.style.transition = "none"; bar.style.transform = "scaleX(0)";
        if (on && !RM && !user) { void bar.offsetWidth; bar.style.transition = "transform " + DUR + "ms linear"; bar.style.transform = "scaleX(1)"; }
      });
      panels.forEach(function (p, k) { p.classList.toggle("is-on", k === i); });
    }
    function start() { clearInterval(timer); if (RM) return; timer = setInterval(function () { if (!document.hidden) go((cur + 1) % tabs.length); }, DUR); }
    tabs.forEach(function (t, i) { t.addEventListener("click", function () { clearInterval(timer); go(i, true); }); });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { go(0); start(); io.disconnect(); } }, { threshold: 0.2 });
      io.observe($("#stepper"));
    }
  }, "stepper");

  /* testimonios */
  safe(function () {
    var s = $$(".ts"), cur = 0, num = $("#tCur"), timer;
    function go(i) { cur = (i + s.length) % s.length; s.forEach(function (e, k) { e.classList.toggle("is-on", k === cur); }); num.textContent = "0" + (cur + 1); }
    $$(".tn").forEach(function (b) { b.addEventListener("click", function () { clearInterval(timer); go(cur + +b.getAttribute("data-dir")); }); });
    if (!RM) timer = setInterval(function () { if (!document.hidden) go(cur + 1); }, 7000);
  }, "testi");

  /* música del reel */
  safe(function () {
    var v = $("#reel"), b = $(".reel-sound");
    b.addEventListener("click", function () {
      v.muted = !v.muted; if (!v.muted) { v.currentTime = 0; v.play(); }
      b.setAttribute("aria-pressed", String(!v.muted)); b.textContent = v.muted ? "♪ Activar música" : "♪ Silenciar";
    });
    var w = $("#watchBtn");
    if (w) w.addEventListener("click", function () {
      var r = v.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight) window.scrollTo({ top: scrollY + r.top - 110, behavior: "smooth" });
      v.muted = false; v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {});
      b.setAttribute("aria-pressed", "true"); b.textContent = "♪ Silenciar";
    });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
    }, { threshold: 0.05 }).observe(v);
  }, "reel");

  /* formulario: envío a enviar.php (SMTP autenticado); sin PHP abre el correo */
  safe(function () {
    var f = $("#form"), msg = $(".form__msg", f), btn = $("button[type=submit]", f);
    var q = location.search.match(/envio=(ok|error)/);
    if (q) msg.textContent = q[1] === "ok" ? "Gracias, recibimos tu solicitud. Te contactaremos pronto." : "No pudimos enviar tu solicitud. Escríbenos a info@wasafflogistica.cl.";
    function mailto(d) {
      var body = ["Nombre: " + d.get("nombre") + " " + d.get("apellido"), "Empresa: " + (d.get("empresa") || "-"),
        "Correo: " + d.get("correo"), "Teléfono: " + (d.get("telefono") || "-"), "", "¿Qué necesita?", d.get("mensaje") || ""].join("\n");
      return "mailto:info@wasafflogistica.cl?subject=" + encodeURIComponent("Solicitud desde la web · " + d.get("nombre") + " " + d.get("apellido")) + "&body=" + encodeURIComponent(body);
    }
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var ok = true;
      $$("[required]", f).forEach(function (el) {
        var bad = !el.value.trim() || (el.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
        el.classList.toggle("is-err", bad); if (bad) ok = false;
      });
      if (!ok) { msg.className = "form__msg err"; msg.textContent = "Revisa los campos marcados, por favor."; return; }
      var d = new FormData(f);
      btn.disabled = true; msg.className = "form__msg"; msg.textContent = "Enviando…";
      fetch(f.getAttribute("action"), { method: "POST", body: d, headers: { "X-Requested-With": "fetch" } })
        .then(function (r) {
          if ((r.headers.get("content-type") || "").indexOf("json") < 0) throw new Error("sin-servidor");
          return r.json();
        })
        .then(function (res) {
          msg.className = res.ok ? "form__msg" : "form__msg err"; msg.textContent = res.mensaje;
          if (res.ok) f.reset();
        })
        .catch(function () {
          location.href = mailto(d);
          msg.className = "form__msg"; msg.textContent = "Abrimos tu correo con la solicitud lista para enviar a info@wasafflogistica.cl.";
        })
        .then(function () { btn.disabled = false; });
    });
    $$("input,textarea", f).forEach(function (el) { el.addEventListener("input", function () { el.classList.remove("is-err"); }); });
  }, "form");

  /* GSAP: ventana del hero que se expande, línea de la ruta, flotantes */
  function initGsap() {
    if (!window.gsap || !window.ScrollTrigger) return;
    var gsap = window.gsap, ST = window.ScrollTrigger; gsap.registerPlugin(ST);
    safe(function () {
      gsap.from(".float", { y: 24, opacity: 0, scale: .9, duration: .8, ease: "back.out(1.7)", stagger: .18, delay: .9 });
      var draw = $("#routeDraw");
      gsap.fromTo(draw, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: ".route__body", start: "top 60%", end: "bottom 70%", scrub: .6 } });
      var mm = gsap.matchMedia();
      mm.add("(min-width:821px) and (prefers-reduced-motion:no-preference)", function () {
        gsap.fromTo(".window__frame", { scale: .9, borderRadius: 28 }, { scale: 1.08, borderRadius: 10, ease: "none",
          scrollTrigger: { trigger: ".window", start: "top 85%", end: "bottom 35%", scrub: true } });
        gsap.to(".float", { y: function (i) { return [-40, -70, -30, -60][i]; }, ease: "none",
          scrollTrigger: { trigger: ".window", start: "top 60%", end: "bottom top", scrub: true } });
        $$(".station__img").forEach(function (im) {
          gsap.fromTo(im, { y: 50 }, { y: -50, ease: "none", scrollTrigger: { trigger: im, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
      addEventListener("load", function () { ST.refresh(); });
    }, "gsap");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGsap); else initGsap();
})();
