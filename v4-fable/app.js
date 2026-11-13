(function(){
const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = matchMedia('(hover:hover) and (pointer:fine)').matches;
const ahorro = !!(navigator.connection && navigator.connection.saveData);
const sinVideo = reduce || ahorro || innerWidth < 861;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(...[ScrollTrigger, window.Draggable].filter(Boolean));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeIO = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
/* Observa si un elemento está en pantalla y avisa al entrar, para reanudar bucles detenidos */
const visible = (el, alEntrar) => { const o = {v:false}; new IntersectionObserver(([en]) => { o.v = en.isIntersecting; if (o.v && alEntrar) alEntrar(); }).observe(el); return o; };

/* Header y barra fija del celular */
const hdr = $('#hdr'), hero = $('.hero'), contacto = $('#contacto'), barra = $('#barraMovil');
let enContacto = false;
if (contacto) new IntersectionObserver(([en]) => { enContacto = en.isIntersecting; alScroll(); }, {rootMargin:'0px 0px -20% 0px'}).observe(contacto);
function alScroll(){
  const pasoHero = scrollY > (hero ? hero.offsetHeight : innerHeight) * .55;
  hdr.classList.toggle('solido', pasoHero);
  if (barra) barra.classList.toggle('on', scrollY > (hero ? hero.offsetHeight : innerHeight) - 120 && !enContacto);
}
addEventListener('scroll', alScroll, {passive:true}); alScroll();

/* Menú del celular */
const menuBtn = $('#menuBtn'), nav = $('#navPrincipal');
if (menuBtn){
  const menu = abre => {
    document.body.classList.toggle('menu-on', abre);
    menuBtn.setAttribute('aria-expanded', abre);
    menuBtn.setAttribute('aria-label', abre ? 'Cerrar menú' : 'Abrir menú');
    if (abre) nav.querySelector('a').focus();
  };
  menuBtn.addEventListener('click', () => menu(!document.body.classList.contains('menu-on')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) menu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-on')){ menu(false); menuBtn.focus(); } });
  matchMedia('(min-width:861px)').addEventListener('change', e => { if (e.matches) menu(false); });
}

/* 1 Carrusel 3D del hero: avanza cada 5 s, se puede pausar, girar con el teclado o arrastrar */
const anillo = $('#anillo'), escena = $('#escena');
if (anillo){
  const cards = [...anillo.children], N = cards.length, STEP = 360 / N, pausaBtn = $('#pausaHero');
  let R = 0, ang = 0, angPrev = 0, tilt = 0, tw = null, tUlt = performance.now(), raf = 0, frente = -1;
  let hovering = false, enfocado = false, pausado = false, dragging = false, moved = false, x0 = 0, lastX = 0, dragVel = 0, cardDown = null;
  const grow = cards.map(() => 1), growT = cards.map(() => 1);
  const medir = () => { const w = innerWidth; R = w < 600 ? Math.max(250, w * .72) : Math.min(660, Math.max(430, w * .37)); };
  const girarA = (a1, dur, ease) => { tw = {a0:ang, a1, t0:performance.now(), d:reduce ? 1 : dur * 1000, ease:ease || easeIO}; arrancar(); };
  const masCercano = a => Math.round(a / STEP) * STEP;
  function pintar(dt){
    const v = dt > 0 ? (ang - angPrev) / dt * 1000 : 0; angPrev = ang;
    tilt += ((reduce ? 0 : clamp(v * .15, -15, 15)) - tilt) * Math.min(1, dt / 140);
    for (let i = 0; i < N; i++){
      grow[i] += (growT[i] - grow[i]) * Math.min(1, dt / 120);
      const deg = ((i * STEP + ang) % 360 + 540) % 360 - 180, th = deg * Math.PI / 180, cos = Math.cos(th), front = (cos + 1) / 2, c = cards[i];
      c.style.transform = `translate3d(${(R * Math.sin(th)).toFixed(1)}px,0,${(R * (cos - 1)).toFixed(1)}px) rotateY(${(-deg + tilt).toFixed(2)}deg) scale(${grow[i].toFixed(3)})`;
      c.style.opacity = (front > .82 ? 1 : clamp((front - .38) / .44, 0, 1)).toFixed(3);
      c.style.filter = `brightness(${(.5 + .5 * front).toFixed(3)})`;
      c.style.zIndex = Math.round(front * 1000);
      c.style.pointerEvents = front > .55 ? 'auto' : 'none';
    }
    const f = ((Math.round(-ang / STEP) % N) + N) % N;
    if (f !== frente){ frente = f; cards.forEach((c, i) => c.setAttribute('aria-hidden', i !== f)); }
  }
  const quieto = () => !tw && !dragging && grow.every((g, i) => Math.abs(g - growT[i]) < .002) && Math.abs(tilt) < .05;
  let tPrev = performance.now();
  function frame(now){
    const dt = Math.min(64, now - tPrev); tPrev = now;
    if (tw){
      const k = Math.min(1, (now - tw.t0) / tw.d);
      ang = tw.a0 + (tw.a1 - tw.a0) * tw.ease(k);
      if (k >= 1){ tw = null; tUlt = now; }
    }
    pintar(dt);
    /* El bucle solo corre mientras algo se mueve */
    raf = quieto() ? 0 : requestAnimationFrame(frame);
  }
  function arrancar(){ if (!raf){ tPrev = performance.now(); raf = requestAnimationFrame(frame); } }
  const enHero = visible(escena, () => { tUlt = performance.now(); });
  /* Avance automático: una tarjeta cada 5 s, solo si está a la vista y nadie la está usando */
  setInterval(() => {
    if (tw || dragging || hovering || enfocado || pausado || reduce || !enHero.v || document.hidden){ tUlt = performance.now(); return; }
    if (performance.now() - tUlt >= 5000) girarA(masCercano(ang) - STEP, 1.15);
  }, 250);
  escena.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse'){ hovering = true; } });
  escena.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse'){ hovering = false; growT.fill(1); arrancar(); } });
  escena.addEventListener('focusin', () => { enfocado = true; });
  escena.addEventListener('focusout', () => { enfocado = false; arrancar(); });
  escena.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); girarA(masCercano(tw ? tw.a1 : ang) + (e.key === 'ArrowLeft' ? STEP : -STEP), .5, easeOut);
  });
  cards.forEach((c, i) => {
    c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && !dragging){ growT.fill(1); growT[i] = 1.06; arrancar(); } });
    c.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse'){ growT[i] = 1; arrancar(); } });
  });
  escena.addEventListener('pointerdown', e => {
    dragging = true; moved = false; x0 = lastX = e.clientX; dragVel = 0; tw = null; cardDown = e.target.closest('.tc');
    escena.setPointerCapture(e.pointerId); arrancar();
  });
  escena.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    if (!moved && Math.abs(e.clientX - x0) > 5){ moved = true; escena.classList.add('arrastra'); growT.fill(1); }
    if (moved){ ang += dx * .2; dragVel = dx * .2; }
  });
  const soltar = () => {
    if (!dragging) return;
    dragging = false; tUlt = performance.now(); escena.classList.remove('arrastra');
    if (moved) girarA(masCercano(ang + dragVel * 7), .7, easeOut);
    else if (cardDown){ const meta = -cards.indexOf(cardDown) * STEP; girarA(meta + Math.round((ang - meta) / 360) * 360, .7, easeOut); }
  };
  escena.addEventListener('pointerup', soltar); escena.addEventListener('pointercancel', soltar);
  if (pausaBtn){
    if (reduce) pausaBtn.hidden = true;
    pausaBtn.addEventListener('click', () => {
      pausado = !pausado; pausaBtn.setAttribute('aria-pressed', pausado);
      pausaBtn.setAttribute('aria-label', pausado ? 'Reanudar el carrusel' : 'Pausar el carrusel');
      tUlt = performance.now(); arrancar();
    });
  }
  addEventListener('resize', () => { medir(); pintar(0); }); medir(); pintar(0);
}

/* 1b Video del hero: solo en escritorio, sin ahorro de datos y sin reducir movimiento. En el resto queda el póster */
const vIntro = $('#vIntro'), vLoop = $('#vLoop');
if (vLoop){
  let vActivo = null;
  const mostrarLoop = () => vLoop.classList.add('on');
  if (sinVideo || !vIntro) mostrarLoop();
  else {
    vIntro.preload = vLoop.preload = 'auto';
    vIntro.addEventListener('ended', () => {
      vLoop.currentTime = 0;
      vLoop.play().then(() => {
        vLoop.style.transition = 'none'; mostrarLoop(); vActivo = vLoop;
        requestAnimationFrame(() => { vIntro.style.transition = 'none'; vIntro.classList.remove('on'); });
      }).catch(mostrarLoop);
    });
    vIntro.play().then(() => { vIntro.classList.add('on'); vActivo = vIntro; }).catch(mostrarLoop);
    new IntersectionObserver(([en]) => { if (vActivo) en.isIntersecting ? vActivo.play().catch(() => {}) : vActivo.pause(); }).observe(hero);
  }
}
/* 11 Video de la banda de contacto: se carga recién al acercarse */
const vCta = $('#vCta');
if (vCta && !sinVideo) new IntersectionObserver(([en]) => { if (en.isIntersecting){ vCta.preload = 'auto'; vCta.play().catch(() => {}); } else vCta.pause(); }, {rootMargin:'200px'}).observe(vCta);

/* 4 Acordeón de servicios. El contenido usa desde el inicio el ancho del panel abierto, así el texto no se reacomoda */
const acord = $('#acordeon');
if (acord){
  const pans = $$('.pan', acord);
  const medirAcordeon = () => {
    const fOn = parseFloat(getComputedStyle($('.pan.on', acord)).flexGrow) || 6.2;
    acord.style.setProperty('--ancho-abierto', ((acord.clientWidth - 8 * (pans.length - 1)) * fOn / (fOn + pans.length - 1)) + 'px');
  };
  const abrir = p => pans.forEach(x => {
    const on = x === p; x.classList.toggle('on', on);
    $('button', x).setAttribute('aria-expanded', on); $('.cont', x).inert = !on;
  });
  pans.forEach(p => {
    $('button', p).addEventListener('click', () => abrir(p));
    if (fino) p.addEventListener('mouseenter', () => abrir(p));
  });
  addEventListener('resize', medirAcordeon); medirAcordeon();
}

/* 4b (v4-fable) Índice de servicios: una fila abierta a la vez */
const indice = $('#indice');
if (indice){
  const filas = $$('.fila', indice);
  const abrirFila = f => filas.forEach(x => {
    const on = x === f; x.classList.toggle('on', on);
    $('.fila-t button', x).setAttribute('aria-expanded', on); $('.fila-c', x).inert = !on;
  });
  filas.forEach(f => {
    $('.fila-t button', f).addEventListener('click', () => abrirFila(f.classList.contains('on') && innerWidth < 861 ? null : f));
    if (fino) $('.fila-t', f).addEventListener('mouseenter', () => { if (innerWidth > 860) abrirFila(f); });
  });
}

/* 6 Chat de ejemplo */
const msgs = $('#msgs');
if (msgs){
  const guion = [['cli','Hola, ¿hacen sitios para restaurantes? ¿Cuánto cuesta?'],['bot','¡Hola! Sí, hacemos sitios a medida con carta y reservas. ¿Quieres que te agendemos una llamada de 15 minutos para cotizar?'],['cli','Dale, mañana en la tarde.'],['bot','Listo. Te agendé mañana a las 16:00 y te llegó la confirmación por correo.'],['ok','Reunión agendada en el calendario · 4 s']];
  let corrida = 0;
  const burbuja = (t, s) => {
    const d = document.createElement('div'); d.className = 'm ' + t;
    if (t === 'ok') d.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-ok"/></svg>';
    d.append(s); msgs.appendChild(d); return d;
  };
  const chat = inst => {
    const id = ++corrida; msgs.innerHTML = '';
    if (inst){ guion.forEach(([t, s]) => burbuja(t, s)); return; }
    let i = 0;
    (function sig(){
      if (id !== corrida || i >= guion.length) return;
      const [t, s] = guion[i++];
      let esc = null;
      if (t === 'bot'){ esc = document.createElement('div'); esc.className = 'm esc'; esc.innerHTML = '<i></i><i></i><i></i>'; msgs.appendChild(esc); }
      setTimeout(() => {
        if (id !== corrida) return;
        esc && esc.remove();
        const d = burbuja(t, s);
        /* Cada burbuja crece desde su esquina: el cliente a la derecha, el asistente a la izquierda */
        if (hasG) gsap.from(d, {scale:.96, y:6, opacity:0, duration:.28, ease:'power3.out', transformOrigin: t === 'cli' ? '100% 100%' : t === 'bot' ? '0% 100%' : '50% 50%'});
        setTimeout(sig, 650);
      }, t === 'bot' ? 1000 : 350);
    })();
  };
  chat(true);
  $('#repetir').addEventListener('click', () => chat(reduce));
  new IntersectionObserver((en, ob) => { if (en[0].isIntersecting){ chat(reduce); ob.disconnect(); } }, {threshold:.5}).observe(msgs);
}
/* 6 Antes / Con Rednet: las barras cambian con scaleX */
const toggle = $('#toggle');
if (toggle){
  const anchos = {antes:[1, .02, .24], con:[.04, .7, 1]}, bts = $$('button', toggle);
  bts.forEach(b => b.addEventListener('click', () => {
    bts.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    const m = toggle.dataset.m = b.dataset.m;
    $$('#met > div').forEach((d, i) => {
      const v = $('b', d); v.textContent = m === 'antes' ? v.dataset.a : v.dataset.c;
      $('.barra i', d).style.setProperty('--v', anchos[m][i]);
    });
  }));
}

/* 7 Proyectos: fila infinita que se gira arrastrando o con las flechas */
const gal = $('#galeria');
if (gal){
  const pros = [...gal.children], P = pros.length, puntos = $('#puntos'), contador = $('#contador');
  pros.forEach(() => puntos.appendChild(document.createElement('i')));
  let paso = 0, Lg = 0, off = 0, offPrev = 0, tiltG = 0, twG = null, arr = false, mov = false, gx0 = 0, gLast = 0, gVel = 0, proDown = null, act = -1, rafG = 0;
  const medirGal = () => { const m = innerWidth < 600; paso = (m ? 270 : 360) + (m ? 16 : 26); Lg = paso * P; };
  const irOff = (o1, dur, ease) => { twG = {o0:off, o1, t0:performance.now(), d:reduce ? 1 : dur * 1000, ease:ease || easeOut}; arrancarG(); };
  const idx = o => ((Math.round(-o / paso) % P) + P) % P;
  function pintarG(dt){
    const v = dt > 0 ? (off - offPrev) / dt * 1000 : 0; offPrev = off;
    tiltG += ((reduce ? 0 : clamp(v * .009, -12, 12)) - tiltG) * Math.min(1, dt / 140);
    const half = Math.max(gal.clientWidth / 2, 1);
    for (let i = 0; i < P; i++){
      let s = ((i * paso + off) % Lg + Lg) % Lg; if (s > Lg / 2) s -= Lg;
      const d = clamp(Math.abs(s) / half, 0, 1.6), el = pros[i];
      el.style.transform = `translate3d(${s.toFixed(1)}px,${(d * d * 18).toFixed(1)}px,${(-d * d * 120).toFixed(1)}px) rotateY(${(clamp(-s / half * 14, -22, 22) + tiltG).toFixed(2)}deg)`;
      el.style.filter = `saturate(${(1 - Math.min(1, d) * .7).toFixed(3)}) brightness(${(1 - Math.min(1, d) * .12).toFixed(3)})`;
      el.style.zIndex = 100 - Math.round(d * 50);
    }
    const a = idx(off);
    if (a !== act){ act = a; [...puntos.children].forEach((p, k) => p.classList.toggle('on', k === a)); contador.textContent = String(a + 1).padStart(2, '0') + ' / ' + String(P).padStart(2, '0'); }
  }
  let tG = performance.now();
  function frameG(now){
    const dt = Math.min(64, now - tG); tG = now;
    if (twG){ const k = Math.min(1, (now - twG.t0) / twG.d); off = twG.o0 + (twG.o1 - twG.o0) * twG.ease(k); if (k >= 1) twG = null; }
    pintarG(dt);
    rafG = twG || arr || Math.abs(tiltG) > .05 ? requestAnimationFrame(frameG) : 0;
  }
  function arrancarG(){ if (!rafG){ tG = performance.now(); rafG = requestAnimationFrame(frameG); } }
  gal.addEventListener('pointerdown', e => { arr = true; mov = false; gx0 = gLast = e.clientX; gVel = 0; twG = null; proDown = e.target.closest('.pro'); gal.setPointerCapture(e.pointerId); arrancarG(); });
  gal.addEventListener('pointermove', e => {
    if (!arr) return;
    const dx = e.clientX - gLast; gLast = e.clientX;
    if (!mov && Math.abs(e.clientX - gx0) > 5){ mov = true; gal.classList.add('arrastra'); }
    if (mov){ off += dx; gVel = dx; }
  });
  const soltarG = () => {
    if (!arr) return;
    arr = false; gal.classList.remove('arrastra');
    if (mov) irOff(Math.round((off + gVel * 14) / paso) * paso, .7);
    else if (proDown){ let s = ((pros.indexOf(proDown) * paso + off) % Lg + Lg) % Lg; if (s > Lg / 2) s -= Lg; if (Math.abs(s) > 4) irOff(off - s, .5); }
  };
  gal.addEventListener('pointerup', soltarG); gal.addEventListener('pointercancel', soltarG);
  const irA = d => irOff(Math.round((twG ? twG.o1 : off) / paso) * paso - d * paso, .5);
  $('#prev').onclick = () => irA(-1); $('#next').onclick = () => irA(1);
  addEventListener('resize', () => { const a = idx(off); medirGal(); off = offPrev = -a * paso; pintarG(0); });
  medirGal(); pintarG(0);
}

/* 7b (v4-fable) Proyectos en una fila con scroll nativo; las flechas avanzan de a una tarjeta */
const carril = $('#carril');
if (carril){
  const cPrev = $('#cPrev'), cNext = $('#cNext');
  const pasoC = () => carril.firstElementChild.getBoundingClientRect().width + 16;
  const mover = d => carril.scrollBy({left:d * pasoC(), behavior:reduce ? 'auto' : 'smooth'});
  const estado = () => { cPrev.disabled = carril.scrollLeft < 8; cNext.disabled = carril.scrollLeft > carril.scrollWidth - carril.clientWidth - 8; };
  cPrev.onclick = () => mover(-1); cNext.onclick = () => mover(1);
  carril.addEventListener('scroll', estado, {passive:true}); addEventListener('resize', estado); estado();
}

/* 8 Reseñas: en escritorio una mesa para ordenar; en el celular una fila que se desliza con el dedo */
const mesa = $('#mesa');
let res = [];
if (mesa && innerWidth > 760){
  res = [...mesa.children];
  const barajar = anim => {
    const W = mesa.clientWidth, H = mesa.clientHeight, cw = 270;
    res.forEach((r, i) => {
      const x = W/2 - cw/2 + (Math.random() - .5) * Math.max(0, W - cw) * .85, y = 20 + Math.random() * Math.max(0, H - 260), rot = (Math.random() - .5) * 16;
      if (hasG && anim && !reduce) gsap.to(r, {x, y, rotation:rot, duration:.5, ease:'power3.out', delay:i * .03, overwrite:true});
      else if (hasG) gsap.set(r, {x, y, rotation:rot});
      else r.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg)`;
    });
  };
  barajar(false);
  $('#barajar').onclick = () => barajar(true);
  if (hasG && fino && window.Draggable){ let z = 10; mesa.classList.add('arrastrable'); res.forEach(r => Draggable.create(r, {type:'x,y', bounds:mesa, onPress(){ this.target.style.zIndex = ++z; }})); }
}

/* 11 Formulario de contacto (maqueta: valida y muestra los estados, pero no envía) */
const form = $('#formContacto');
if (form){
  const nombre = $('#fNombre'), cto = $('#fContacto'), sel = $('#fNecesita'), enviar = $('#fEnviar'), ok = $('#formOk');
  $$('[data-pide]').forEach(a => a.addEventListener('click', () => { sel.value = a.dataset.pide; }));
  const esContacto = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || v.replace(/\D/g, '').length >= 8;
  const marcar = (campo, mal) => { campo.setAttribute('aria-invalid', mal); $('#' + campo.getAttribute('aria-describedby')).hidden = !mal; return mal; };
  [nombre, cto].forEach(c => c.addEventListener('input', () => { if (c.getAttribute('aria-invalid') === 'true') marcar(c, c === nombre ? !c.value.trim() : !esContacto(c.value.trim())); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const m1 = marcar(nombre, !nombre.value.trim()), m2 = marcar(cto, !esContacto(cto.value.trim()));
    if (m1 || m2){ (m1 ? nombre : cto).focus(); return; }
    enviar.disabled = true; enviar.textContent = 'Enviando…';
    setTimeout(() => { enviar.textContent = 'Enviado'; form.classList.add('listo'); ok.hidden = false; ok.focus(); }, reduce ? 0 : 900);
  });
  $('#fOtro').addEventListener('click', () => { form.reset(); form.classList.remove('listo'); ok.hidden = true; enviar.disabled = false; enviar.textContent = 'Pedir presupuesto'; nombre.focus(); });
}

if (!hasG || reduce) return;
/* Movimiento ligado al scroll */
if (hero){
  const st = {trigger:hero, start:'top top', end:'bottom top', scrub:true};
  gsap.to('#heroTxt', {yPercent:-22, opacity:.2, ease:'none', scrollTrigger:st});
  if (escena) gsap.to(escena, {y:60, scale:.96, ease:'none', scrollTrigger:st});
  gsap.to('.hero-video', {yPercent:12, scale:1.05, ease:'none', scrollTrigger:st});
}
const manif = $('#manif');
if (manif){
  [...manif.childNodes].forEach(n => {
    if (n.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()){ frag.append(t); return; } const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s); });
    manif.replaceChild(frag, n);
  });
  gsap.fromTo('#manif .w, #manif .ico', {opacity:.18}, {opacity:1, stagger:.08, ease:'none', scrollTrigger:{trigger:manif, start:'top 80%', end:'bottom 45%', scrub:true}});
}
/* Entradas cortas: 24 px, medio segundo, escalonadas */
const entra = (sel, trig) => { if ($(sel)) gsap.from(sel, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:trig || sel, start:'top 82%'}}); };
entra('.rv', $('.rv') && $('.rv').parentElement);
entra('.plan', '.planes');
$$('[data-entra]').forEach(c => gsap.from(c.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:c, start:'top 85%'}}));
const cuenta = $('[data-cuenta]');
if (cuenta){ const o = {v:0}, fin = +cuenta.dataset.cuenta; gsap.to(o, {v:fin, duration:.9, ease:'power2.out', scrollTrigger:{trigger:cuenta, start:'top 85%'}, onUpdate:() => cuenta.textContent = Math.round(o.v)}); }
if ($('.pasos')){
  ScrollTrigger.create({trigger:'.pasos', start:'top 55%', end:'bottom 45%', onToggle:s => document.body.classList.toggle('oscuro', s.isActive)});
  const tl = gsap.timeline({scrollTrigger:{trigger:'.escalera', start:'top 85%', end:'bottom 45%', scrub:1}});
  $$('.paso').forEach(p => {
    tl.fromTo($('.col', p), {clipPath:'inset(100% 0% 0% 0% round 18px 18px 0px 0px)'}, {clipPath:'inset(0% 0% 0% 0% round 18px 18px 0px 0px)', duration:1, ease:'none'}, 0)
      .fromTo($('.txt', p), {y:24, opacity:0}, {y:0, opacity:1, duration:.4, ease:'power2.out'}, 0);
  });
}
if (res.length) gsap.from(res, {opacity:0, scale:.96, duration:.5, ease:'power3.out', stagger:.05, scrollTrigger:{trigger:mesa, start:'top 78%'}});
})();
