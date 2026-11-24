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

  /* imagen que sigue al cursor en el índice de ventajas */
  safe(function () {
    if (!matchMedia("(hover:hover) and (min-width:1061px)").matches) return;
    var box = $(".cursor-img"), img = $("img", box), x = 0, y = 0, cx = 0, cy = 0, raf;
    $$(".index__row").forEach(function (r) {
      r.addEventListener("mouseenter", function () { img.src = r.getAttribute("data-img"); box.classList.add("is-on"); });
      r.addEventListener("mouseleave", function () { box.classList.remove("is-on"); });
    });
    addEventListener("mousemove", function (e) { x = e.clientX + 170; y = e.clientY; if (!raf) loop(); });
    function loop() {
      cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
      box.style.left = cx + "px"; box.style.top = cy + "px";
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.5 ? requestAnimationFrame(loop) : null;
    }
  }, "cursor");

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

  /* simulador WMS (datos de ejemplo) */
  safe(function () {
    var D = [
      { q: "SKU-1043", name: "Filtro de aceite FX-20", code: "SKU-1043 · Lote L-2611", stock: 1248, loc: "B1-04", zone: "Rack B · nivel 1", rot: "Alta",
        h: [["Hoy 09:46", "Picking · pedido P-0031 · −12"], ["Hoy 08:10", "Ubicación · pallet P-0192 → B1-04"], ["Ayer 16:32", "Recepción · OC-4587 · +240"]] },
      { q: "SKU-2210", name: "Crema hidratante 200 ml", code: "SKU-2210 · Lote L-3108", stock: 3560, loc: "C2-11", zone: "Rack C · nivel 2", rot: "Media",
        h: [["Hoy 10:02", "Packing · pedido P-0044 · −36"], ["Ayer 11:20", "Inventario cíclico · sin diferencias"], ["Lun 15:05", "Recepción · OC-4590 · +1.200"]] },
      { q: "SKU-3307", name: "Audífonos inalámbricos A3", code: "SKU-3307 · Serie S-77", stock: 418, loc: "A1-07", zone: "Jaula de seguridad", rot: "Alta",
        h: [["Hoy 09:15", "Despacho · guía 88240 · −24"], ["Hoy 08:40", "Picking validado · 24/24"], ["Mar 17:50", "Recepción · contenedor LCL · +600"]] }
    ];
    var btns = $$(".sim__opts button"), res = $("#simRes"), q = $("#simQuery"), cur = 0, auto;
    function show(i) {
      cur = i; var d = D[i];
      btns.forEach(function (b, k) { b.classList.toggle("is-on", k === i); });
      res.classList.add("is-load");
      var txt = d.q, n = 0; q.textContent = "";
      var typer = setInterval(function () { q.textContent = txt.slice(0, ++n); if (n >= txt.length) clearInterval(typer); }, RM ? 0 : 45);
      setTimeout(function () {
        $("#simName").textContent = d.name; $("#simCode").textContent = d.code;
        $("#simLoc").textContent = d.loc; $("#simZone").textContent = d.zone; $("#simRot").textContent = d.rot;
        var el = $("#simStock"), t0 = performance.now();
        (function tick(t) { var p = Math.min(1, (t - t0) / 700); el.textContent = fmt(Math.round(d.stock * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); })(t0);
        $("#simHist").innerHTML = d.h.map(function (r) { return "<li><time>" + r[0] + "</time><span>" + r[1] + "</span></li>"; }).join("");
        res.classList.remove("is-load");
      }, 420);
    }
    btns.forEach(function (b, i) { b.addEventListener("click", function () { clearInterval(auto); show(i); }); });
    if (!RM) auto = setInterval(function () { if (!document.hidden) show((cur + 1) % D.length); }, 6500);
  }, "sim");

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
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
    }, { threshold: 0.05 }).observe(v);
  }, "reel");

  /* formulario: prepara el correo */
  safe(function () {
    var f = $("#form"), msg = $(".form__msg", f);
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var ok = true;
      $$("[required]", f).forEach(function (el) {
        var bad = !el.value.trim() || (el.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
        el.classList.toggle("is-err", bad); if (bad) ok = false;
      });
      var serv = $$("input[name=servicio]:checked", f).map(function (c) { return c.value; });
      $(".form__chips", f).classList.toggle("is-err", !serv.length); if (!serv.length) ok = false;
      if (!ok) { msg.className = "form__msg err"; msg.textContent = "Elige al menos un servicio y completa los campos marcados."; return; }
      var d = new FormData(f);
      var body = "Nombre: " + d.get("nombre") + "\nEmpresa: " + d.get("empresa") + "\nCorreo: " + d.get("correo") + "\nTeléfono: " + (d.get("telefono") || "-") +
        "\nServicios: " + serv.join(", ") + "\nModalidad: " + d.get("modalidad") + "\n\nOperación:\n" + d.get("mensaje");
      location.href = "mailto:info@wasafflogistica.cl?subject=" + encodeURIComponent("Consulta logística · " + d.get("empresa")) + "&body=" + encodeURIComponent(body);
      msg.className = "form__msg"; msg.textContent = "¡Listo! Abrimos tu correo con la consulta preparada. Si no se abrió, escríbenos a info@wasafflogistica.cl.";
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
