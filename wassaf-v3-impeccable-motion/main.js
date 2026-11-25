/* Wasaff Logística v2 · interacciones */
(function () {
  "use strict";
  window.__BRAND__ = "wasaff-v3-impeccable-motion";
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
    function setOpen(open, focusBack) {
      burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      if (open) { drawer.hidden = false; requestAnimationFrame(function () { drawer.classList.add("is-open"); var first = $("a", drawer); if (first) first.focus(); }); } else { drawer.classList.remove("is-open"); setTimeout(function () { if (!drawer.classList.contains("is-open")) drawer.hidden = true; }, 200); }
      document.documentElement.classList.toggle("menu-open", open);
      if (!open && focusBack) burger.focus();
    }
    burger.addEventListener("click", function () { setOpen(burger.getAttribute("aria-expanded") !== "true"); });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && !drawer.hidden) setOpen(false, true); });
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
        en.target.style.transitionDelay = Math.min(i, 6) * 0.055 + "s";
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
        tabs.forEach(function (o, k) { o.tabIndex = k === i ? 0 : -1; });
      });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
        e.preventDefault(); var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click();
      });
    });
  }, "modes");


  /* control de pausa compartido */
  function pauser(btn, onChange) {
    var paused = false;
    function set(p) { paused = p; btn.setAttribute("aria-pressed", String(p)); $("span", btn).textContent = p ? "Reanudar" : "Pausar"; onChange(p); }
    btn.addEventListener("click", function () { set(!paused); });
    return { set: set, get: function () { return paused; } };
  }

  /* stepper con autoavance (pausable) */
  safe(function () {
    var box = $("#stepper"), tabs = $$(".stepper__tabs button"), panels = $$(".sp"), cur = 0, timer, DUR = 6000, hold = false, pz;
    function go(i, user) {
      cur = i;
      tabs.forEach(function (t, k) {
        var on = k === i, bar = $("i", t);
        t.classList.toggle("is-on", on); t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
        bar.style.transition = "none"; bar.style.transform = "scaleX(0)";
        if (on && running() && !user) { void bar.offsetWidth; bar.style.transition = "transform " + DUR + "ms linear"; bar.style.transform = "scaleX(1)"; }
      });
      panels.forEach(function (p, k) { var on = k === i; p.classList.toggle("is-on", on); p.setAttribute("aria-hidden", String(!on)); });
    }
    function running() { return !RM && !hold && !(pz && pz.get()); }
    function start() { clearInterval(timer); if (!running()) return; timer = setInterval(function () { if (!document.hidden) go((cur + 1) % tabs.length); }, DUR); }
    function stop() { clearInterval(timer); var bar = $("i", tabs[cur]); bar.style.transition = "none"; }
    pz = pauser($("#stepPause"), function (p) { if (p) stop(); else { go(cur); start(); } });
    if (RM) pz.set(true);
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { pz.set(true); go(i, true); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
        e.preventDefault(); var n = (i + d + tabs.length) % tabs.length; tabs[n].focus(); pz.set(true); go(n, true);
      });
    });
    box.addEventListener("mouseenter", function () { hold = true; stop(); });
    box.addEventListener("mouseleave", function () { hold = false; if (running()) { go(cur); start(); } });
    box.addEventListener("focusin", function () { hold = true; stop(); });
    box.addEventListener("focusout", function (e) { if (!box.contains(e.relatedTarget)) { hold = false; if (running()) { go(cur); start(); } } });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { go(0); start(); io.disconnect(); } }, { threshold: 0.2 });
      io.observe(box);
    }
  }, "stepper");

  /* testimonios (pausables) */
  safe(function () {
    var box = $(".testi__box"), s = $$(".ts"), cur = 0, num = $("#tCur"), timer, hold = false, pz;
    function go(i) { cur = (i + s.length) % s.length; s.forEach(function (e, k) { var on = k === cur; e.classList.toggle("is-on", on); e.setAttribute("aria-hidden", String(!on)); }); num.textContent = "0" + (cur + 1); }
    function running() { return !RM && !hold && !pz.get(); }
    function start() { clearInterval(timer); if (running()) timer = setInterval(function () { if (!document.hidden) go(cur + 1); }, 7000); }
    pz = pauser($("#testiPause"), function (p) { if (p) clearInterval(timer); else start(); });
    if (RM) pz.set(true);
    $$(".tn").forEach(function (b) { b.addEventListener("click", function () { pz.set(true); go(cur + +b.getAttribute("data-dir")); }); });
    box.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { pz.set(true); go(cur + 1); } if (e.key === "ArrowLeft") { pz.set(true); go(cur - 1); } });
    box.addEventListener("mouseenter", function () { hold = true; clearInterval(timer); });
    box.addEventListener("mouseleave", function () { hold = false; start(); });
    box.addEventListener("focusin", function () { hold = true; clearInterval(timer); });
    box.addEventListener("focusout", function (e) { if (!box.contains(e.relatedTarget)) { hold = false; start(); } });
    go(0); start();
  }, "testi");

  /* videos de fondo: solo escritorio, sin ahorro de datos ni reducir movimiento; pausa fuera de pantalla */
  safe(function () {
    var ok = matchMedia("(min-width:861px)").matches && !RM && !(navigator.connection && navigator.connection.saveData);
    $$("#heroVid,#contactVid").forEach(function (v) {
      if (!ok) return;
      var loaded = false;
      var io = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) {
          if (!loaded) { v.src = v.getAttribute("data-src"); loaded = true; }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (loaded) v.pause();
      }, { threshold: 0.05 });
      io.observe(v.parentElement);
    });
  }, "bgvideo");

  /* barra fija móvil: aparece tras el hero, se oculta en contacto */
  safe(function () {
    var bar = $("#mbar"), hero = $(".hero"), contact = $("#contacto"), pastHero = false, inContact = false;
    bar.hidden = false;
    function upd() { bar.classList.toggle("is-on", pastHero && !inContact); }
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(function (e) { inContact = e[0].isIntersecting; upd(); }, { threshold: 0.05 }).observe(contact);
  }, "mbar");

  /* música del reel */
  safe(function () {
    var v = $("#reel"), b = $(".reel-sound");
    b.addEventListener("click", function () {
      v.muted = !v.muted; if (!v.muted) { v.currentTime = 0; v.play(); }
      b.setAttribute("aria-pressed", String(!v.muted)); b.textContent = v.muted ? "♪ Activar música" : "♪ Silenciar";
    });
    var rp = $(".reel-pause"), userPaused = false;
    if (rp) rp.addEventListener("click", function () {
      userPaused = !v.paused ? true : false;
      if (v.paused) { v.play(); } else { v.pause(); }
      rp.setAttribute("aria-pressed", String(userPaused)); rp.setAttribute("aria-label", userPaused ? "Reanudar video" : "Pausar video");
    });
    var w = $("#watchBtn");
    if (w) w.addEventListener("click", function () {
      var r = v.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight) window.scrollTo({ top: scrollY + r.top - 110, behavior: "smooth" });
      userPaused = false; if (rp) rp.setAttribute("aria-pressed", "false"); v.muted = false; v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {});
      b.setAttribute("aria-pressed", "true"); b.textContent = "♪ Silenciar";
    });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { if (userPaused) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
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
      if (!RM) gsap.from(".float", { y: 16, opacity: 0, scale: .96, duration: .5, ease: "power3.out", stagger: .06, delay: .6, overwrite: true });
      var draw = $("#routeDraw");
      gsap.fromTo(draw, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: ".route__body", start: "top 60%", end: "bottom 70%", scrub: .6 } });
      var mm = gsap.matchMedia();
      mm.add("(min-width:821px) and (prefers-reduced-motion:no-preference)", function () {
        gsap.fromTo(".window__frame", { scale: .9 }, { scale: 1.06, ease: "none",
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
