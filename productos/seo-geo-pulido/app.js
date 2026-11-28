/* SEO y GEO Rednet · seo-geo-pulido (ruta rednet-design-1 sobre productos/seo-geo, borrador J sin tocar) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');

/* Header sólido, barra fija móvil y selector de versiones */
const hdr = document.getElementById('hdr'), barra = document.getElementById('barraMovil'), contacto = document.getElementById('contacto');
const onScroll = () => {
hdr.classList.toggle('solido', scrollY > 40);
barra.classList.toggle('on', scrollY > innerHeight * .8 && contacto.getBoundingClientRect().top > innerHeight);
document.body.classList.toggle('bajo', scrollY > 120);
};
addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* Menú móvil: Escape cierra, el foco va al primer link */
const menuBtn = document.getElementById('menuBtn'), navP = document.getElementById('navPrincipal');
const cerrarMenu = () => { navP.classList.remove('abierto'); document.body.classList.remove('menu-abierto'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
menuBtn.addEventListener('click', () => {
const ab = !navP.classList.contains('abierto');
navP.classList.toggle('abierto', ab); document.body.classList.toggle('menu-abierto', ab); menuBtn.setAttribute('aria-expanded', ab); document.body.style.overflow = ab ? 'hidden' : '';
if (ab) navP.querySelector('a').focus();
});
navP.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
addEventListener('keydown', e => { if (e.key === 'Escape' && navP.classList.contains('abierto')){ cerrarMenu(); menuBtn.focus(); } });

/* 1 Buscador de ejemplo: se escribe una búsqueda y "Tu negocio" sube.
Cada ciclo dura más de 5 s, tiene botón de pausa y se detiene fuera de pantalla (WCAG 2.2.2). */
const consultas = ['reparación de notebooks cerca de mí', 'pastelería para cumpleaños en [tu comuna]', 'dentista con hora mañana', 'ferretería abierta hoy'];
const caja = document.getElementById('buscadorCaja'), res = document.getElementById('res'), bqTxt = document.getElementById('bqTxt'), bqPos = document.getElementById('bqPos'), chip = caja.querySelector('.ia-chip');
const tu = res.querySelector('.tu'), alto = 66, btnPausa = document.getElementById('pausa');
let orden = ['a', 'b', 'c', 'd', 'tu'];
const pintar = () => { orden.forEach((id, i) => res.querySelector(`[data-id="${id}"]`).style.transform = `translateY(${i * alto}px)`); const k = orden.indexOf('tu') + 1; bqPos.textContent = 'Tu negocio · #' + k; tu.classList.toggle('arriba', k <= 3); };
const subir = a => { const i = orden.indexOf('tu'); orden.splice(i, 1); orden.splice(a, 0, 'tu'); pintar(); };
const finalQuieto = () => { orden = ['a', 'b', 'c', 'd', 'tu']; bqTxt.textContent = consultas[0]; subir(2); chip.classList.add('on'); };
let pausaUsuario = false, visible = true, q = 0, paso = 0, timer = 0;
/* El ciclo es una lista de pasos con su espera; pausar solo detiene el reloj, retomar sigue donde iba */
const pasos = [];
function armarCiclo(){
pasos.length = 0;
const t = consultas[q++ % consultas.length];
pasos.push([() => { orden = ['a', 'b', 'c', 'd', 'tu']; pintar(); chip.classList.remove('on'); bqTxt.textContent = ''; }, 200]);
for (const c of t) pasos.push([() => { bqTxt.textContent += c; }, 45]);
pasos.push([() => {}, 700], [() => subir(3), 1100], [() => subir(2), 700], [() => chip.classList.add('on'), 3400]);
paso = 0;
}
function tic(){
if (pausaUsuario || !visible) return;
if (paso >= pasos.length) armarCiclo();
const [fn, ms] = pasos[paso++]; fn();
timer = setTimeout(tic, ms);
}
const reanudar = () => { clearTimeout(timer); if (!pausaUsuario && visible) tic(); };
pintar();
if (reduce){ finalQuieto(); btnPausa.hidden = true; }
else {
armarCiclo();
new IntersectionObserver(([en]) => { visible = en.isIntersecting; caja.classList.toggle('pausado', !visible || pausaUsuario); if (visible) reanudar(); else clearTimeout(timer); }).observe(caja);
btnPausa.addEventListener('click', () => {
pausaUsuario = !pausaUsuario;
btnPausa.setAttribute('aria-pressed', pausaUsuario);
btnPausa.querySelector('span').textContent = pausaUsuario ? 'Reanudar' : 'Pausar';
btnPausa.querySelector('svg') && (btnPausa.querySelector('svg').innerHTML = pausaUsuario ? '<path d="M8 5v14l11-7z"/>' : '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>');
caja.classList.toggle('pausado', pausaUsuario);
if (pausaUsuario) clearTimeout(timer); else reanudar();
});
}

/* 4 GEO: la respuesta de la IA se escribe y te nombra (o no) */
const respuestas = {
antes:{t:[['Algunas opciones conocidas son '], ['Competidor uno', 1], [' y '], ['Competidor dos', 1], ['. Revisa sus reseñas antes de ir. '], ['No encontré más negocios con información clara en tu zona.', 2]], f:[['competidor-uno.cl'], ['directorio.cl'], ['foro.cl']]},
con:{t:[['Una buena opción es '], ['Tu negocio', 1], [', en [tu comuna]. Reparan notebooks de todas las marcas, entregan diagnóstico en el día y sus clientes destacan que explican todo en simple. También puedes revisar '], ['Competidor uno', 1], ['.']], f:[['tunegocio.cl', 1], ['Google Maps · Tu negocio', 1], ['directorio.cl']]}
};
const ciA = document.getElementById('ciA'), ciF = document.getElementById('ciF'), ciQ = document.getElementById('ciQ');
let geoId = 0, geoModo = 'con';
function escribir(m){
const id = ++geoId, r = respuestas[m];
ciA.innerHTML = ''; ciF.innerHTML = '';
const ws = [];
r.t.forEach(([txt, tipo]) => {
const cont = tipo === 1 ? document.createElement('mark') : tipo === 2 ? Object.assign(document.createElement('span'), {className:'gris'}) : ciA;
txt.split(/(\s+)/).forEach(p => { if (!p) return; if (!p.trim()){ cont.append(p); return; } const s = document.createElement('span'); s.textContent = p; s.style.opacity = reduce ? 1 : 0; cont.append(s); ws.push(s); });
if (cont !== ciA) ciA.append(cont);
});
const fs = r.f.map(([txt, t]) => { const s = document.createElement('span'); s.textContent = txt; if (t) s.className = 'tu'; ciF.append(s); return s; });
if (reduce){ fs.forEach(s => s.classList.add('on')); return; }
ciA.classList.remove('entra'); void ciA.offsetWidth; ciA.classList.add('entra');
ws.forEach((s, i) => setTimeout(() => { if (id === geoId) s.style.opacity = 1; }, i * 55));
fs.forEach((s, i) => setTimeout(() => { if (id === geoId) s.classList.add('on'); }, ws.length * 55 + 200 + i * 180));
}
document.querySelectorAll('#geoTg button').forEach(b => b.addEventListener('click', () => {
document.querySelectorAll('#geoTg button').forEach(x => x.setAttribute('aria-pressed', x === b));
geoModo = b.dataset.m; escribir(geoModo);
}));

/* 5 52 semanas */
const semA = document.getElementById('semA'), semB = document.getElementById('semB');
for (let i = 0; i < 52; i++){ semA.append(document.createElement('i')); semB.append(document.createElement('i')); }
const sA = [...semA.children], sB = [...semB.children];
const semanas = p => { const n = Math.round(p * 52); sB.forEach((d, k) => d.classList.toggle('on', k < n)); sA[49].classList.toggle('on', n > 49); };

/* 3 Escalera */
const posN = document.getElementById('posN'), posPag = document.getElementById('posPag'), pel = [...document.getElementById('peldanos').children], hitos = [...document.getElementById('hitos').children], tarjeta = document.getElementById('tarjetaTu');
const marcas = [38, 27, 14, 8];
function escalera(p){
const f = p * (marcas.length - 1), k = Math.min(marcas.length - 2, Math.floor(f)), r = f - k;
const pos = Math.max(1, Math.round(marcas[k] + (marcas[k + 1] - marcas[k]) * r));
posN.textContent = '#' + pos;
posPag.textContent = pos > 30 ? 'Página 4' : pos > 20 ? 'Página 3' : pos > 10 ? 'Página 2' : 'Página 1';
const nivel = Math.round(f);
pel.forEach((e, i) => e.classList.toggle('on', i <= nivel));
hitos.forEach((h, i) => h.classList.toggle('on', i === Math.min(3, Math.floor(p * 4))));
const cajaP = document.getElementById('peldanos').getBoundingClientRect(), salto = (cajaP.height - 48) / (pel.length - 1);
tarjeta.style.transform = `translateY(${-f * salto}px)`;
}

/* Video del producto: no arranca solo; se reproduce al pulsar "Ver video" y se pausa al salir de pantalla */
const vS = document.getElementById('vSeo'), vSp = document.getElementById('vSeoPausa'), vSs = document.getElementById('vSeoSonido'), vSver = document.getElementById('vSeoVer'), vSctl = document.querySelector('.video-ctl');
let vSpausado = false, vSvisible = true, vSini = false;
function vSestado(){
  if (!vSini) return;
  if (vSvisible && !vSpausado) vS.play().catch(() => {}); else vS.pause();
  vSp.setAttribute('aria-pressed', vSpausado);
  vSp.querySelector('span').textContent = vSpausado ? 'Reproducir animación' : 'Pausar animación';
}
function vSsonido(){
  vSs.setAttribute('aria-pressed', !vS.muted);
  vSs.querySelector('span').textContent = vS.muted ? 'Activar sonido' : 'Silenciar';
}
vSver.addEventListener('click', () => {
  vSini = true; vSpausado = false; vS.muted = false; vS.preload = 'auto';
  if (vS.ended) vS.currentTime = 0;
  vSver.hidden = true; vSctl.hidden = false; vSsonido(); vSestado();
});
vS.addEventListener('ended', () => { vSini = false; vSver.querySelector('span').textContent = 'Ver de nuevo'; vSver.hidden = false; vSctl.hidden = true; });
vSp.addEventListener('click', () => { vSpausado = !vSpausado; vSestado(); });
vSs.addEventListener('click', () => { vS.muted = !vS.muted; vSsonido(); });
new IntersectionObserver(([en]) => { vSvisible = en.isIntersecting; vSestado(); }, {threshold:.25}).observe(vS);

/* Video de fondo del contacto: solo escritorio, sin ahorro de datos ni reducir movimiento; se pausa fuera de pantalla */
const vCta = document.getElementById('vCta');
const sinVideo = reduce || !escritorio.matches || (navigator.connection && navigator.connection.saveData);
if (!sinVideo) new IntersectionObserver(([en]) => { if (en.isIntersecting){ vCta.preload = 'auto'; vCta.play().catch(() => {}); } else vCta.pause(); }, {rootMargin:'200px'}).observe(vCta);

/* Los CTA con motivo o plan preseleccionan el formulario */
const fQue = document.getElementById('fQue');
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => { fQue.value = a.dataset.plan; setTimeout(() => document.getElementById('fNombre').focus({preventScroll:true}), 600); }));
/* Formulario (maqueta: valida y confirma, no envía) */
const form = document.getElementById('form'), fErr = document.getElementById('fError'), fOk = document.getElementById('fOk');
form.addEventListener('submit', e => {
e.preventDefault();
const n = form.nombre, c = form.contacto, malos = [n, c].filter(i => !i.value.trim());
[n, c].forEach(i => i.setAttribute('aria-invalid', malos.includes(i)));
fErr.hidden = !malos.length;
if (malos.length){ malos[0].focus(); return; }
const btn = form.querySelector('button[type=submit]');
btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Enviando…';
setTimeout(() => { btn.removeAttribute('aria-busy'); btn.disabled = true; btn.textContent = 'Enviado'; fOk.hidden = false; }, 700);   // maqueta: simula el envío
});

if (!hasG || reduce){ escalera(1); semanas(1); escribir('con'); return; }
/* Frase palabra por palabra */
document.querySelectorAll('[data-palabras]').forEach(p => {
const partir = nodo => [...nodo.childNodes].forEach(n => {
if (n.nodeType === 1){ partir(n); return; }
if (n.nodeType !== 3) return;
const frag = document.createDocumentFragment();
n.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()){ frag.append(t); return; } const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s); });
nodo.replaceChild(frag, n);
});
partir(p);
gsap.fromTo(p.querySelectorAll('.w'), {opacity:.16}, {opacity:1, stagger:.08, ease:'none', scrollTrigger:{trigger:p, start:'top 80%', end:'bottom 45%', scrub:true}});
});
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Entrada del hero */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.fromTo('.p-hero h1 em', {'--sub':0}, {'--sub':1, duration:.45, ease:'power3.out', delay:.5});
gsap.from('#buscador', {y:48, opacity:0, duration:.8, ease:'expo.out', delay:.15});
/* Escalera: fijada en escritorio, con el scroll en celular */
escalera(0);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#subeTrack', start:'top top', end:'bottom bottom', onUpdate:s => escalera(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'.escalera', start:'top 80%', end:'bottom 30%', onUpdate:s => escalera(s.progress)}); });
/* GEO: la conversación entra cuando se ve */
ScrollTrigger.create({trigger:'.chat-ia', start:'top 75%', once:true, onEnter:() => escribir(geoModo)});
gsap.from('.chat-ia', {y:24, opacity:0, duration:.55, ease:'power3.out', scrollTrigger:{trigger:'.chat-ia', start:'top 85%'}});
gsap.from(ciQ, {scale:.96, opacity:0, transformOrigin:'100% 100%', duration:.3, ease:'power3.out', delay:.2, scrollTrigger:{trigger:'.chat-ia', start:'top 85%'}});
/* 52 semanas con el scroll */
semanas(0);
const o = {p:0};
gsap.to(o, {p:1, ease:'none', onUpdate:() => semanas(o.p), scrollTrigger:{trigger:'#anio', start:'top 75%', end:'bottom 40%', scrub:1}});
})();
