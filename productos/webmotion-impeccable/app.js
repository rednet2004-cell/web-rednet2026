/* WebMotion Cortos Comerciales (P19) · webmotion-impeccable · paso 2 de rednet-design-1 (Impeccable: contacto real, menú móvil, pausas, contraste) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');
const $ = id => document.getElementById(id);

/* Header sólido, barra fija móvil y selector de versiones */
const hdr = $('hdr'), barra = $('barraMovil'), contacto = $('contacto');
const onScroll = () => {
hdr.classList.toggle('solido', scrollY > 40);
if (barra) barra.classList.toggle('on', scrollY > innerHeight * .8 && contacto.getBoundingClientRect().top > innerHeight);
document.body.classList.toggle('bajo', scrollY > 120);
};
addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* Menú móvil: Escape cierra, el foco va al primer link */
const menuBtn = $('menuBtn'), navP = $('navPrincipal');
if (menuBtn){
const cerrarMenu = () => { navP.classList.remove('abierto'); document.body.classList.remove('menu-abierto'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
menuBtn.addEventListener('click', () => {
const ab = !navP.classList.contains('abierto');
navP.classList.toggle('abierto', ab); document.body.classList.toggle('menu-abierto', ab); menuBtn.setAttribute('aria-expanded', ab); document.body.style.overflow = ab ? 'hidden' : '';
if (ab) navP.querySelector('a').focus();
});
navP.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
addEventListener('keydown', e => { if (e.key === 'Escape' && navP.classList.contains('abierto')){ cerrarMenu(); menuBtn.focus(); } });
}

/* 1 Hero: quieto → escaneo → línea de tiempo → en movimiento. Cada ciclo dura ~9 s, con pausa visible;
   se detiene fuera de pantalla y con reducir movimiento. Tres sitios de ejemplo. */
const sitios = [
{url:'cumbrebikes.cl', logo:'Cumbre Bikes', tit:'Cumbre Trail 29', precio:'$389.990', btn:'Comprar'},
{url:'salonaurora.cl', logo:'Salón Aurora', tit:'Balayage + corte', precio:'Desde $45.000', btn:'Agendar'},
{url:'lodgepatagonia.cl', logo:'Lodge Patagonia', tit:'3 noches frente al lago', precio:'Desde $280.000', btn:'Reservar'}
];
const estados = ['Quieto', 'Escaneando tu web', 'Armando el video', 'En movimiento'];
const mon = $('monitor'), lt = $('lt'), fmts = $('fmts'), sitio = mon.querySelector('.sitio'), tc = $('tc'), pausa = $('pausa');
const medir = () => { sitio.style.setProperty('--alto', sitio.offsetHeight + 'px'); const p = lt.querySelector('.pista>div'); lt.style.setProperty('--recorrido', (p.offsetWidth - 4) + 'px'); };
let tcTimer = null;
function pinta(s, f){
const d = sitios[s];
mon.dataset.s = s; mon.dataset.f = f; lt.dataset.f = f; fmts.classList.toggle('on', f === 3);
$('mUrl').textContent = d.url; $('sLogo').textContent = d.logo; $('sTit').textContent = d.tit; $('sPrecio').textContent = d.precio; $('sBtn').textContent = d.btn;
$('estTxt').textContent = estados[f];
clearInterval(tcTimer); tc.textContent = f === 3 ? '00:00' : '00:00';
if (f === 3 && !reduce){ let t = 0; tcTimer = setInterval(() => { t = Math.min(20, t + 1); tc.textContent = '00:' + String(t).padStart(2, '0'); if (t === 20) clearInterval(tcTimer); }, 170); }
if (f === 3 && reduce) tc.textContent = '00:20';
}
const duraciones = [1800, 1900, 1500, 3800];
let n = 0, fase = 0, timer = null, pausado = reduce, visible = true;
function paso(){
timer = null;
if (pausado || !visible) return;
pinta(n % sitios.length, fase);
const ms = duraciones[fase];
fase = (fase + 1) % 4; if (fase === 0) n++;
timer = setTimeout(paso, ms);
}
function seguir(){ if (!timer && !pausado && visible) timer = setTimeout(paso, 300); }
medir(); addEventListener('resize', medir);
if (pausa) pausa.addEventListener('click', () => {
pausado = !pausado; pausa.setAttribute('aria-pressed', pausado); pausa.setAttribute('aria-label', pausado ? 'Reanudar la animación del ejemplo' : 'Pausar la animación del ejemplo');
if (pausado){ clearTimeout(timer); timer = null; clearInterval(tcTimer); mon.classList.add('quieto'); } else { mon.classList.remove('quieto'); seguir(); }
});
if (reduce){ pinta(0, 3); if (pausa){ pausa.setAttribute('aria-pressed', 'true'); pausa.setAttribute('aria-label', 'Reanudar la animación del ejemplo'); } }
else {
new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) seguir(); else { clearTimeout(timer); timer = null; } }).observe(mon);
setTimeout(seguir, 600);
}

/* 3 Video del producto: en escritorio parte silenciado al verse; en celular, póster y botón. Se pausa fuera de pantalla. */
const v = $('vProd'), vPlay = $('vPlay'), vPlayTxt = $('vPlayTxt'), vSon = $('vSon');
const auto = !reduce && escritorio.matches && !(navigator.connection && navigator.connection.saveData);
const syncV = () => {
const on = !v.paused; vPlayTxt.textContent = on ? 'Pausar' : 'Ver video';
vPlay.setAttribute('aria-pressed', on);
if (vSon){ vSon.hidden = !on && v.currentTime === 0; $('vSonTxt').textContent = v.muted ? 'Activar sonido' : 'Silenciar'; vSon.setAttribute('aria-pressed', !v.muted); }
};
let vUsuario = false;
vPlay.addEventListener('click', () => {
vUsuario = true;
if (v.paused){ if (!vSon) v.muted = false; v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
});
if (vSon) vSon.addEventListener('click', () => { v.muted = !v.muted; syncV(); });
v.addEventListener('play', syncV); v.addEventListener('pause', syncV); v.addEventListener('volumechange', syncV);
new IntersectionObserver(([en]) => {
if (en.isIntersecting){ if (auto && !vUsuario && v.paused){ v.preload = 'auto'; v.play().catch(() => {}); } }
else if (!v.paused) v.pause();
}, {threshold:.35}).observe(v);

/* 4 Cómo funciona: el paso visible sigue al scroll */
const mesa = $('mesa'), pasos = [...document.querySelectorAll('#pasos li')];
const ponerPaso = i => { if (mesa.dataset.paso == i) return; mesa.dataset.paso = i; pasos.forEach((li, k) => li.classList.toggle('on', k === i)); };

/* 5 Formatos: grupo de radio con flechas del teclado */
const lienzo = $('lienzo'), lDim = $('lDim'), opc = [...document.querySelectorAll('#fmtOpc [role=radio]')];
const dims = {'916':['1080 × 1920','9:16'], '11':['1080 × 1080','1:1'], '169':['1920 × 1080','16:9']};
const ponerFmt = (b, foco) => {
opc.forEach(x => { const on = x === b; x.setAttribute('aria-checked', on); x.tabIndex = on ? 0 : -1; });
const f = b.dataset.fmt; lienzo.dataset.fmt = f; lDim.textContent = dims[f][0]; lienzo.setAttribute('aria-label', 'Vista previa en formato ' + dims[f][1]);
lienzo.classList.remove('cambia'); void lienzo.offsetWidth; lienzo.classList.add('cambia');
if (foco){ b.focus(); b.scrollIntoView({block:'nearest', inline:'nearest'}); }
};
opc.forEach((b, i) => {
b.addEventListener('click', () => ponerFmt(b));
b.addEventListener('keydown', e => {
const k = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[e.key];
if (k){ e.preventDefault(); ponerFmt(opc[(i + k + opc.length) % opc.length], true); }
});
});

/* 6 Propuesta: vista previa del video en el correo (la dispara el usuario, se puede pausar) */
const mini = $('miniVid'), mvBarra = $('mvBarra'), cuadros = [...mini.querySelectorAll('.mv-cuadros span')];
const DUR = 6000; let mvT = 0, mvLast = 0, mvRaf = null;
const mvPinta = () => { const p = mvT / DUR; mvBarra.style.transform = 'scaleX(' + p + ')'; const k = Math.min(2, Math.floor(p * 3)); cuadros.forEach((c, j) => c.classList.toggle('on', j === k)); };
const mvLoop = ts => { mvT += ts - mvLast; mvLast = ts; if (mvT >= DUR){ mvT = DUR; mvPinta(); mvStop(); mvT = 0; return; } mvPinta(); mvRaf = requestAnimationFrame(mvLoop); };
const mvStop = () => { cancelAnimationFrame(mvRaf); mvRaf = null; mini.setAttribute('aria-pressed', 'false'); mini.setAttribute('aria-label', 'Reproducir la vista previa del video de la propuesta'); };
mini.addEventListener('click', () => {
if (mvRaf){ mvStop(); return; }
mini.setAttribute('aria-pressed', 'true'); mini.setAttribute('aria-label', 'Pausar la vista previa del video de la propuesta');
if (reduce){ mvT = DUR; mvPinta(); mvStop(); mvT = 0; return; }
mvLast = performance.now(); mvRaf = requestAnimationFrame(mvLoop);
});
new IntersectionObserver(([en]) => { if (!en.isIntersecting && mvRaf) mvStop(); }).observe(mini);

/* 7 Rubros: pestañas con flechas del teclado */
const tabs = [...document.querySelectorAll('#rSeg [role=tab]')];
const elegir = (b, foco) => {
tabs.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $(x.getAttribute('aria-controls')).hidden = !on; });
if (foco){ b.focus(); b.scrollIntoView({block:'nearest', inline:'nearest'}); }
};
tabs.forEach((b, i) => {
b.addEventListener('click', () => elegir(b));
b.addEventListener('keydown', e => {
const k = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[e.key];
if (k){ e.preventDefault(); elegir(tabs[(i + k + tabs.length) % tabs.length], true); }
if (e.key === 'Home'){ e.preventDefault(); elegir(tabs[0], true); }
if (e.key === 'End'){ e.preventDefault(); elegir(tabs[tabs.length - 1], true); }
});
});

/* Video de fondo del contacto: solo escritorio, sin ahorro de datos ni reducir movimiento; se pausa fuera de pantalla */
const vCta = $('vCta');
if (vCta && auto) new IntersectionObserver(([en]) => { if (en.isIntersecting){ vCta.preload = 'auto'; vCta.play().catch(() => {}); } else vCta.pause(); }, {rootMargin:'200px'}).observe(vCta);

/* Los CTA con motivo o plan preseleccionan el formulario */
const fQue = $('fQue'), form = $('form');
if (form){
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => { fQue.value = a.dataset.plan; setTimeout(() => $('fNombre').focus({preventScroll:true}), 600); }));
/* Formulario (maqueta: valida y confirma, no envía) */
const fErr = $('fError'), fOk = $('fOk');
form.addEventListener('submit', e => {
e.preventDefault();
const nm = form.nombre, c = form.contacto, malos = [nm, c].filter(i => !i.value.trim());
[nm, c].forEach(i => i.setAttribute('aria-invalid', malos.includes(i)));
fErr.hidden = !malos.length;
if (malos.length){ malos[0].focus(); return; }
const btn = form.querySelector('button[type=submit]');
fOk.hidden = false;
});
}

if (!hasG || reduce){ ponerPaso(3); pasos.forEach(li => li.classList.add('on')); return; }
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:50, opacity:0, duration:.9, ease:'power3.out', stagger:.08, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Hero: entrada corta */
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.1});
gsap.from('.sala', {y:60, opacity:0, duration:1.1, ease:'power3.out', delay:.15});
/* Cómo funciona: fijo en escritorio, sigue al scroll en móvil */
const porP = p => ponerPaso(p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#flujoTrack', start:'top top', end:'bottom bottom', onUpdate:s => porP(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#mesa', start:'top 80%', end:'bottom 20%', onUpdate:s => porP(s.progress)}); });
})();
