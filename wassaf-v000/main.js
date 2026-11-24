/* Wasaff Logística · interacciones */
(function () {
  "use strict";
  window.__BRAND__ = "wasaff";
  var root = document.documentElement;
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function safe(fn, name) { try { fn(); } catch (e) { if (window.console) console.warn("[wasaff] " + name, e); } }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  var fmt = function (n, dec) { return Number(n).toLocaleString("es-CL", { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }); };

  /* ---------- split words ---------- */
  function splitNode(el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w";
            var i = document.createElement("span"); i.textContent = p.replace(/\u00a0/g, "\u00a0");
            w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") { walk(n); }
      });
    };
    walk(el);
  }

  /* ---------- nav ---------- */
  safe(function () {
    var nav = $("#nav"), last = 0, bar = $(".progress i");
    var burger = $(".burger"), drawer = $(".drawer");
    function onScroll() {
      var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
      nav.classList.toggle("is-solid", y > innerHeight * 0.85);
      nav.classList.toggle("is-hidden", y > 300 && y > last && drawer.hidden);
      last = y;
      if (bar) bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    }
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open)); drawer.hidden = open;
      nav.classList.toggle("is-solid", !open || scrollY > innerHeight * 0.85);
    });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { burger.setAttribute("aria-expanded", "false"); drawer.hidden = true; }); });
  }, "nav");

  /* ---------- reveals (IO, sin depender de GSAP) ---------- */
  safe(function () {
    var els = $$(".reveal-up,.reveal-tile,.clip-reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, sib = el.parentElement ? $$(".reveal-up,.reveal-tile", el.parentElement) : [];
        var idx = Math.max(0, sib.indexOf(el));
        el.style.transitionDelay = Math.min(idx, 5) * 0.08 + "s";
        el.classList.add("is-in"); io.unobserve(el);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () { els.forEach(function (e) { if (e.getBoundingClientRect().top < innerHeight) e.classList.add("is-in"); }); }, 2500);
  }, "reveals");

  /* ---------- counters ---------- */
  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-count")), dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    if (RM) { el.textContent = fmt(to, dec); return; }
    var t0 = performance.now(), d = 1600;
    (function tick(t) {
      var p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, dec);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  safe(function () {
    var els = $$("[data-count]");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }, "counters");

  /* ---------- barras que crecen al entrar ---------- */
  safe(function () {
    var groups = $$(".bars,.cols");
    if (RM || !("IntersectionObserver" in window)) return;
    groups.forEach(function (g) { $$("i", g).forEach(function (i) { i.style.setProperty("--s", "0"); }); });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$("i", en.target).forEach(function (i, k) { i.style.transitionDelay = k * 0.06 + "s"; i.style.setProperty("--s", "1"); });
        io.unobserve(en.target);
      });
    }, { threshold: 0.05 });
    groups.forEach(function (g) { io.observe(g); });
    setTimeout(function () { groups.forEach(function (g) { $$("i", g).forEach(function (i) { i.style.setProperty("--s", "1"); }); }); }, 6000);
  }, "bars");

  /* ---------- consola WMS en vivo (datos de ejemplo) ---------- */
  safe(function () {
    var feed = $("#feed"); if (!feed) return;
    var ev = [
      ["t-rec", "Recepción", "OC-4602 · 18 bultos · andén 1"],
      ["t-ubi", "Ubicación", "Pallet P-0207 → rack C2-03"],
      ["t-pic", "Picking", "Pedido P-0036 · 8/8 unidades"],
      ["t-des", "Despacho", "Guía 88231 · ruta Sur"],
      ["t-rec", "Recepción", "Contenedor LCL · 42 cajas"],
      ["t-pic", "Picking", "Pedido P-0037 · 21/21 unidades"],
      ["t-ubi", "Ubicación", "Lote L-2611 → rack A1-07"],
      ["t-des", "Despacho", "Guía 88240 · retiro transportista"]
    ];
    var k = 0, min = 48, kpi = $(".console__kpis [data-count='148']"), pedidos = 148;
    function push() {
      if (document.hidden) return;
      var e = ev[k++ % ev.length]; min += 1 + (k % 3);
      var hh = 9 + Math.floor(min / 60), mm = min % 60;
      var li = document.createElement("li"); li.className = "is-new";
      li.innerHTML = "<time>" + (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm + "</time><b class='tag " + e[0] + "'>" + e[1] + "</b><span></span><em>✓</em>";
      li.querySelector("span").textContent = e[2];
      feed.insertBefore(li, feed.firstChild);
      while (feed.children.length > 4) feed.removeChild(feed.lastChild);
      if (e[1] === "Picking" && kpi) { pedidos++; kpi.textContent = fmt(pedidos); }
    }
    setInterval(push, RM ? 6000 : 2600);
  }, "feed");

  /* ---------- validación de picking (panel) ---------- */
  safe(function () {
    var list = $("#orders"); if (!list) return;
    var n = 36;
    setInterval(function () {
      if (document.hidden) return;
      var rows = $$("li", list);
      rows.forEach(function (li) {
        var em = $("em", li), bar = $(".ob i", li);
        if (em.classList.contains("ok")) return;
        var t = em.textContent.match(/(\d+)\/(\d+)/);
        if (t) {
          var a = Math.min(+t[2], +t[1] + 2 + Math.floor(Math.random() * 3));
          bar.style.setProperty("--w", (a / t[2]) * 100 + "%");
          if (a >= +t[2]) { em.textContent = "Validado"; em.classList.add("ok"); } else em.textContent = a + "/" + t[2];
        } else { var tot = 6 + Math.floor(Math.random() * 10); em.textContent = "1/" + tot; bar.style.setProperty("--w", (100 / tot) + "%"); }
      });
      if (rows[0] && $("em", rows[0]).classList.contains("ok") && $("em", rows[1]).classList.contains("ok") && $("em", rows[2]).classList.contains("ok")) {
        list.removeChild(rows[0]);
        var li = document.createElement("li");
        li.innerHTML = "<span>P-00" + (n++) + "</span><span class='ob'><i style='--w:0%'></i></span><em>En cola</em>";
        list.appendChild(li);
      }
    }, 1800);
  }, "orders");

  /* ---------- chips modulares ---------- */
  safe(function () {
    var chips = $$(".chips span"); if (!chips.length || RM) return;
    var i = 0;
    setInterval(function () { if (!document.hidden) { chips[i % chips.length].classList.toggle("on"); i += 2; } }, 1400);
  }, "chips");

  /* ---------- música del reel ---------- */
  safe(function () {
    var v = $("#reel"), btn = $(".reel-sound"); if (!v || !btn) return;
    btn.addEventListener("click", function () {
      v.muted = !v.muted;
      if (!v.muted) { v.currentTime = 0; v.play(); }
      btn.setAttribute("aria-pressed", String(!v.muted));
      btn.textContent = v.muted ? "♪ Activar música" : "♪ Silenciar";
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
      }, { threshold: 0.05 }).observe(v);
    }
  }, "reel");

  /* ---------- formulario (sin servidor: prepara el correo) ---------- */
  safe(function () {
    var f = $("#form"); if (!f) return;
    var msg = $(".form__msg", f);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", f).forEach(function (el) {
        var bad = !el.value.trim() || (el.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
        el.classList.toggle("is-err", bad); if (bad) ok = false;
      });
      var serv = $$("input[name=servicio]:checked", f).map(function (c) { return c.value; });
      $(".form__chips", f).classList.toggle("is-err", !serv.length);
      if (!serv.length) ok = false;
      if (!ok) { msg.className = "form__msg err"; msg.textContent = "Revisa los campos marcados para continuar."; return; }
      var d = new FormData(f);
      var body = "Nombre: " + d.get("nombre") + "\nEmpresa: " + d.get("empresa") + "\nCorreo: " + d.get("correo") +
        "\nTeléfono: " + (d.get("telefono") || "-") + "\nServicios: " + serv.join(", ") + "\nModalidad: " + d.get("modalidad") +
        "\n\nOperación:\n" + d.get("mensaje");
      location.href = "mailto:info@wasafflogistica.cl?subject=" + encodeURIComponent("Consulta logística · " + d.get("empresa")) + "&body=" + encodeURIComponent(body);
      msg.className = "form__msg"; msg.textContent = "¡Listo! Abrimos tu correo con la consulta preparada. Si no se abrió, escríbenos a info@wasafflogistica.cl.";
    });
    $$("input,textarea", f).forEach(function (el) { el.addEventListener("input", function () { el.classList.remove("is-err"); }); });
  }, "form");

  /* ---------- botones magnéticos ---------- */
  safe(function () {
    if (RM || !window.matchMedia("(hover:hover)").matches) return;
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.18 + "px," + (e.clientY - r.top - r.height / 2) * 0.3 + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }, "magnetic");

  /* ---------- GSAP: entrada del hero, titulares, flujo horizontal, parallax ---------- */
  function initGsap() {
    if (!window.gsap) { root.classList.add("no-anim"); return; }
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (ST) gsap.registerPlugin(ST);

    safe(function () {
      $$("[data-split]").forEach(splitNode);
      var hero = $(".hero__title");
      gsap.from($$(".w>span", hero), { yPercent: 115, duration: 1.2, ease: "power4.out", stagger: 0.07, delay: 0.15 });
      gsap.from(".hero__diamonds .dl", { scale: 0.6, opacity: 0, transformOrigin: "50% 50%", duration: 1.8, ease: "power3.out", stagger: 0.15 });
      if (!ST) return;
      $$("[data-split]").forEach(function (h) {
        if (h === hero) return;
        gsap.from($$(".w>span", h), { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.05, scrollTrigger: { trigger: h, start: "top 88%", once: true } });
      });
    }, "split");

    if (!ST) return;

    safe(function () {
      var mm = gsap.matchMedia();
      mm.add("(min-width:1024px) and (prefers-reduced-motion:no-preference)", function () {
        var track = $("#flowTrack"), pin = $(".flow__pin"), num = $("#flowNum"), bar = $("#flowBar");
        var dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
        gsap.to(track, {
          x: function () { return -dist(); }, ease: "none",
          scrollTrigger: {
            trigger: pin, start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true,
            onUpdate: function (s) { var i = Math.min(4, 1 + Math.floor(s.progress * 4 * 0.999)); num.textContent = "0" + i; bar.style.transform = "scaleX(" + (0.25 + s.progress * 0.75) + ")"; }
          }
        });
        gsap.to(".hero__video", { yPercent: 12, scale: 1.12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".hero__in", { yPercent: -10, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });
        gsap.fromTo(".wms__band img", { yPercent: -18 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".wms__band", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(".foot__big", { yPercent: 40, opacity: 0, ease: "none", scrollTrigger: { trigger: ".foot", start: "top bottom", end: "top 40%", scrub: true } });
      });
      // línea de pasos: siempre (no es intrusiva)
      var line = $("#stepsLine");
      if (line) {
        line.style.setProperty("--s", "0");
        ST.create({ trigger: ".steps", start: "top 75%", end: "bottom 60%", scrub: true,
          onUpdate: function (s) { line.style.setProperty("--s", s.progress.toFixed(3)); $$(".step").forEach(function (st, i) { st.classList.toggle("is-on", s.progress >= i / 3 - 0.02); }); } });
      }
      gsap.fromTo(".spark__line", { strokeDasharray: 600, strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", scrollTrigger: { trigger: ".spark", start: "top 90%", once: true } });
      addEventListener("load", function () { ST.refresh(); });
    }, "scroll");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGsap); else initGsap();
})();
