/* Mantención Web Rednet · mantencion-pulido (ruta rednet-design-1 completa: impeccable → motion → pulido) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');
const mouse = matchMedia('(hover:hover) and (pointer:fine)');
const $ = id => document.getElementById(id);
const espera = ms => new Promise(r => setTimeout(r, ms));

/* Header sólido, barra fija móvil y selector de versiones */
const hdr = $('hdr'), barra = $('barraMovil'), contacto = $('contacto');
const onScroll = () => {
hdr.classList.toggle('solido', scrollY > 40);
barra.classList.toggle('on', scrollY > innerHeight * .8 && contacto.getBoundingClientRect().top > innerHeight);
document.body.classList.toggle('bajo', scrollY > 120);
};
addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* Menú móvil: Escape cierra, el foco va al primer link */
const menuBtn = $('menuBtn'), navP = $('navPrincipal');
const cerrarMenu = () => { navP.classList.remove('abierto'); document.body.classList.remove('menu-abierto'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
menuBtn.addEventListener('click', () => {
const ab = !navP.classList.contains('abierto');
navP.classList.toggle('abierto', ab); document.body.classList.toggle('menu-abierto', ab); menuBtn.setAttribute('aria-expanded', ab); document.body.style.overflow = ab ? 'hidden' : '';
if (ab) navP.querySelector('a').focus();
});
navP.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
addEventListener('keydown', e => { if (e.key === 'Escape' && navP.classList.contains('abierto')){ cerrarMenu(); menuBtn.focus(); } });

/* 1 Chequeo del hero: bucle con pausa visible; se detiene fuera de pantalla y con reducir movimiento */
const chequeo = $('chequeo'), items = [...document.querySelectorAll('#chLista li')], chEst = $('chEst'), pausa = $('pausa');
let pausado = reduce, visible = true;
const todoOk = () => { items.forEach(i => { i.classList.remove('rev'); i.classList.add('ok'); }); chEst.textContent = 'Todo en orden'; };
const corriendo = () => !pausado && visible;
const marcarPausa = () => {
chequeo.classList.toggle('quieto', pausado);
pausa.setAttribute('aria-pressed', pausado);
pausa.setAttribute('aria-label', pausado ? 'Reanudar la revisión animada' : 'Pausar la revisión animada');
pausa.innerHTML = pausado ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
};
async function ciclo(){
for (;;){
while (!corriendo()){ await espera(300); }
items.forEach(i => i.classList.remove('ok', 'rev')); chEst.textContent = 'Revisando…';
await espera(600);
for (const i of items){
if (!corriendo()) break;
i.classList.add('rev'); await espera(650); i.classList.replace('rev', 'ok');
}
if (!corriendo()){ todoOk(); continue; }
chEst.textContent = 'Todo en orden'; await espera(5000);
}
}
pausa.addEventListener('click', () => { pausado = !pausado; marcarPausa(); if (pausado) todoOk(); });
marcarPausa();
if (reduce){ todoOk(); pausa.hidden = true; }
else {
new IntersectionObserver(([en]) => { visible = en.isIntersecting; chequeo.classList.toggle('quieto', pausado || !visible); }).observe(chequeo);
ciclo();
}

/* 2 Perilla de 12 meses: el slider nativo manda (táctil, teclado, lector); con mouse, además, se gira la perilla */
const perilla = $('perilla'), pomo = $('pomo'), marcas = $('marcas'), slider = $('meses');
const radio = () => perilla.offsetWidth / 2 - 16;
for (let k = 0; k < 12; k++){ const i = document.createElement('i'); if (!k) i.className = 'cero'; marcas.append(i); }
const ms = [...marcas.children];
const ubicarMarcas = () => ms.forEach((m, k) => m.style.transform = `rotate(${k * 30}deg) translateY(-${radio()}px)`);
ubicarMarcas(); addEventListener('resize', ubicarMarcas);
const sin = $('sitioSin');
let mesAct = -1, drag = null;
function mes(m){
const mi = Math.max(0, Math.min(12, Math.round(m)));
if (mi === mesAct) return; mesAct = mi;
const txt = mi === 1 ? 'mes' : 'meses';
$('pMes').textContent = mi; $('pMesTxt').textContent = txt;
slider.value = mi; slider.setAttribute('aria-valuetext', `${mi} ${txt}`);
$('sAct').textContent = mi * 4; $('sEnl').textContent = Math.floor(mi * 1.5);
$('sVel').textContent = (1.8 + mi * .35).toFixed(1).replace('.', ',') + ' s'; $('sSeg').textContent = mi >= 6 ? mi - 5 : 0;
$('tN').textContent = mi * 14;
sin.style.setProperty('--d', (mi / 12).toFixed(2));
['m3', 'm6', 'm9'].forEach(c => sin.classList.toggle(c, mi >= +c.slice(1)));
sin.classList.remove('m12'); if (mi === 12 && !reduce){ void sin.offsetWidth; sin.classList.add('m12'); }
ms.forEach((e, k) => e.classList.toggle('on', k > 0 && k <= mi));
}
const ponerPomo = r => { if (hasG) gsap.set(pomo, {rotation:r}); else pomo.style.transform = `rotate(${r}deg)`; if (drag) drag.update(); };
const ir = (m, animar) => {
m = Math.max(0, Math.min(12, m));
if (hasG && animar && !reduce){
gsap.to(pomo, {rotation:m * 30, duration:.3, ease:'power3.out', overwrite:true, onUpdate:() => { if (drag) drag.update(); mes(gsap.getProperty(pomo, 'rotation') / 30); }, onComplete:() => mes(m)});
} else { ponerPomo(m * 30); mes(m); }
};
mes(0);
slider.addEventListener('input', () => ir(+slider.value, false));
$('menos').addEventListener('click', () => ir(mesAct - 1, true));
$('mas').addEventListener('click', () => ir(mesAct + 1, true));
if (hasG && typeof Draggable !== 'undefined' && mouse.matches){
gsap.registerPlugin(Draggable);
perilla.classList.add('puede-girar');
drag = Draggable.create(pomo, {type:'rotation', bounds:{minRotation:0, maxRotation:360}, onDrag(){ mes(this.rotation / 30); }, onRelease(){ ir(Math.round(this.rotation / 30), true); }})[0];
}

/* 3 Semanas: se completan con el scroll */
const lis = [...document.querySelectorAll('#semanas li')], sems = [...document.querySelectorAll('#semanas .sem')];
function semanas(p){ const n = Math.round(p * lis.length); lis.forEach((l, k) => l.classList.toggle('ok', k < n)); sems.forEach(s => s.classList.toggle('lista', [...s.querySelectorAll('li')].every(l => l.classList.contains('ok')))); }

/* 4 Pídelo: el estado se anuncia; un pedido nuevo interrumpe al anterior */
const pedidos = [['Cambiar un precio', '"El menú del día ahora cuesta $[—]."'], ['Subir fotos nuevas', '"Te mando 6 fotos del local renovado."'], ['Nuevo horario', '"En verano abrimos de 9:00 a 21:00."'], ['Agregar un banner', '"Quiero avisar del descuento de aniversario."']];
const est = [...document.querySelectorAll('#tkEst li')], pbs = [...document.querySelectorAll('#pedidos button')], vivo = $('tkVivo');
const nombresEst = ['recibido', 'en curso', 'hecho'];
let pid = 0, tocado = false;
async function pedir(k){
const id = ++pid; $('tkTit').textContent = pedidos[k][0]; $('tkDet').textContent = pedidos[k][1];
est.forEach(e => e.classList.remove('on'));
if (reduce){ est.forEach(e => e.classList.add('on')); vivo.textContent = `${pedidos[k][0]}: hecho`; return; }
for (let i = 0; i < est.length; i++){ await espera(i ? 700 : 200); if (id !== pid) return; est[i].classList.add('on'); }
vivo.textContent = `${pedidos[k][0]}: ${nombresEst[2]}`;
}
pbs.forEach((b, k) => b.addEventListener('click', () => { tocado = true; pbs.forEach(x => x.setAttribute('aria-pressed', x === b)); pedir(k); }));

/* 5 Comparador: barras con scaleX */
const toggle = $('toggle'), met = $('met');
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
toggle.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
const m = b.dataset.m; toggle.dataset.m = m; met.dataset.m = m;
met.querySelectorAll(':scope > div').forEach(d => {
const v = d.querySelector('b'); v.textContent = m === 'antes' ? v.dataset.a : v.dataset.c;
d.querySelector('.barra i').style.transform = `scaleX(${m === 'antes' ? d.dataset.wa : d.dataset.wc})`;
});
}));

/* Video de fondo del contacto: solo escritorio, sin ahorro de datos ni reducir movimiento; se pausa fuera de pantalla */
const vCta = $('vCta');
const sinVideo = reduce || !escritorio.matches || (navigator.connection && navigator.connection.saveData);
if (!sinVideo) new IntersectionObserver(([en]) => { if (en.isIntersecting){ vCta.preload = 'auto'; vCta.play().catch(() => {}); } else vCta.pause(); }, {rootMargin:'200px'}).observe(vCta);

/* Los CTA con motivo o plan preseleccionan el formulario */
const fQue = $('fQue');
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => { fQue.value = a.dataset.plan; setTimeout(() => $('fNombre').focus({preventScroll:true}), 600); }));
/* Formulario (maqueta: valida y confirma, no envía) */
const form = $('form'), fErr = $('fError'), fOk = $('fOk');
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

if (!hasG || reduce){ semanas(1); pedir(0); return; }
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Hero: entrada corta */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('.chequeo', {y:32, opacity:0, duration:.6, ease:'power3.out', delay:.15});
/* La perilla se gira sola una vez, hasta 6 meses, para mostrar que se mueve (se cancela si la persona la toca) */
ScrollTrigger.create({trigger:'#perilla', start:'top 70%', once:true, onEnter:() => { if (mesAct === 0){ const o = {m:0}; gsap.to(o, {m:6, duration:.9, ease:'power3.out', delay:.15, id:'demo', onUpdate:() => { if (mesAct > 6) return; ponerPomo(o.m * 30); mes(o.m); }}); } }});
['pointerdown', 'keydown'].forEach(t => $('tiempo').addEventListener(t, () => { const d = gsap.getById('demo'); if (d) d.kill(); }, {once:true}));
/* Semanas: se completan con el scroll (scrub suave) */
semanas(0);
const s = {p:0};
gsap.to(s, {p:1, ease:'none', onUpdate:() => semanas(s.p), scrollTrigger:{trigger:'#semanas', start:'top 80%', end:'center 50%', scrub:.6}});
ScrollTrigger.create({trigger:'#ticket', start:'top 80%', once:true, onEnter:() => { if (!tocado) pedir(0); }});
gsap.from('#ticket', {y:24, opacity:0, duration:.55, ease:'power3.out', scrollTrigger:{trigger:'#ticket', start:'top 88%'}});
})();
