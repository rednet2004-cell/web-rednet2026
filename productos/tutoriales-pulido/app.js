/* Tutoriales/Manuales Animados (P20) · tutoriales-pulido (Paso 4 de la ruta (pulido final: Impeccable polish + web-design-guidelines)) */
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


/* 1 Hero: manual (página que corre) → 4 pasos del tutorial con el recuadro amarillo. Ciclo continuo. */
const tut = $('tut'), app = $('app'), foco = $('foco'), focoN = $('focoN'), cc = $('cc'), pasoN = $('pasoN'), pag = $('pag'), busca = $('mnBusca'), toast = $('toast'), t1 = $('tipeo'), t2 = $('tipeo2');
const pasos = [
{el:'aProd', cc:'Entra a Productos, en el menú de la izquierda.'},
{el:'aNuevo', cc:'Toca «Nuevo producto», arriba a la derecha.'},
{el:'aForm', cc:'Escribe el nombre y el stock inicial.'},
{el:'aGuardar', cc:'Guarda. Listo: el producto ya está en tu inventario.'}
];
/* Posición del recuadro relativa a la pantalla de la app (corrige la escala del reproductor mientras entra) */
const off = el => { const a = app.getBoundingClientRect(), r = el.getBoundingClientRect(), k = a.width / app.offsetWidth || 1; return {x:(r.left - a.left) / k, y:(r.top - a.top) / k, w:r.width / k, h:r.height / k}; };
const ponerFoco = i => {
const r = off($(pasos[i].el)), m = 4;
foco.style.width = (r.w + m * 2) + 'px'; foco.style.height = (r.h + m * 2) + 'px';
foco.style.transform = `translate(${r.x - m}px,${r.y - m}px)`;
focoN.textContent = i + 1;
};
let tipeoT = null;
const tipear = (el, txt, ms, fin) => { let k = 0; el.textContent = ''; const s = () => { el.textContent = txt.slice(0, ++k); if (k < txt.length) tipeoT = setTimeout(s, ms); else if (fin) fin(); }; s(); };
let corre = null;
function pinta(f){
tut.dataset.f = f; clearTimeout(tipeoT); clearInterval(corre);
toast.classList.remove('on'); busca.classList.remove('on');
if (f === 0){
t1.textContent = ''; t2.textContent = ''; let p = 1; pag.textContent = p;
if (reduce){ pag.textContent = 23; busca.classList.add('on'); return; }
corre = setInterval(() => { p += 2; pag.textContent = Math.min(p, 23); if (p >= 23){ clearInterval(corre); busca.classList.add('on'); } }, 90);
return;
}
const i = f - 1; cc.textContent = pasos[i].cc; pasoN.textContent = 'Paso ' + f + ' de 4';
if (f === 3){ if (reduce){ t1.textContent = 'Café de grano 1 kg'; t2.textContent = '24'; } else tipear(t1, 'Café de grano 1 kg', 55, () => tipear(t2, '24', 120)); }
if (f === 4){ t1.textContent = 'Café de grano 1 kg'; t2.textContent = '24'; setTimeout(() => toast.classList.add('on'), reduce ? 0 : 900); }
requestAnimationFrame(() => ponerFoco(i)); setTimeout(() => { if (+tut.dataset.f === f) ponerFoco(i); }, 450);
}
const duraciones = [3000, 2600, 2600, 3200, 3400];
let fase = 0, timer = null, visible = true, pausado = reduce;
const pausa = $('pausa');
function paso(){
timer = null;
if (pausado || !visible) return;
pinta(fase);
const ms = duraciones[fase];
fase = (fase + 1) % 5;
timer = setTimeout(paso, ms);
}
function seguir(){ if (!timer && !pausado && visible) timer = setTimeout(paso, 300); }
pausa.addEventListener('click', () => {
pausado = !pausado; pausa.setAttribute('aria-pressed', pausado); pausa.setAttribute('aria-label', pausado ? 'Reanudar la animación del tutorial' : 'Pausar la animación del tutorial');
if (pausado){ clearTimeout(timer); timer = null; clearTimeout(tipeoT); clearInterval(corre); } else seguir();
});
addEventListener('resize', () => { const f = +tut.dataset.f; if (f) ponerFoco(f - 1); });
if (reduce){ pinta(4); pausa.setAttribute('aria-pressed', 'true'); pausa.setAttribute('aria-label', 'Reanudar la animación del tutorial'); }
else {
new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) seguir(); else { clearTimeout(timer); timer = null; } }).observe(tut);
setTimeout(seguir, 600);
}

/* 5 Del manual al capítulo: el paso visible sigue al scroll */
const mesa = $('mesa'), lis = [...document.querySelectorAll('#pasos li')];
const ponerPaso = i => { if (mesa.dataset.paso == i) return; mesa.dataset.paso = i; lis.forEach((li, k) => li.classList.toggle('on', k === i)); };

/* 6 Presentación viva: la lámina se arma por partes con la línea de tiempo */
const lamina = $('lamina'), rango = $('rango'), parte = $('parte'), subL = $('subL'), playL = $('playL'), lineaT = rango.parentElement, vModo = $('vModo');
const subs = ['Dale play o mueve la línea de tiempo.', 'Partimos por el título.', 'Septiembre y octubre, para comparar.', 'Noviembre, el mejor mes del trimestre.', 'Y el siguiente paso, para cerrar.'];
const ponerParte = p => { lamina.dataset.p = p; rango.value = p; parte.textContent = p + ' / 4'; rango.setAttribute('aria-valuetext', 'Parte ' + p + ' de 4'); subL.textContent = subs[p]; };
let playT = null;
const parar = () => { clearInterval(playT); playT = null; playL.setAttribute('aria-pressed', 'false'); playL.setAttribute('aria-label', 'Reproducir la lámina'); };
rango.addEventListener('input', () => { parar(); ponerParte(+rango.value); });
playL.addEventListener('click', () => {
if (playT){ parar(); return; }
let p = +rango.value >= 4 ? 0 : +rango.value; ponerParte(p);
playL.setAttribute('aria-pressed', 'true'); playL.setAttribute('aria-label', 'Pausar la lámina');
playT = setInterval(() => { p++; ponerParte(p); if (p >= 4) parar(); }, 1500);
});
vModo.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
vModo.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
const m = b.dataset.m; vModo.dataset.m = m; lamina.dataset.m = m; parar();
const quieta = m === 'quieta'; lineaT.classList.toggle('off', quieta); rango.disabled = quieta; playL.disabled = quieta;
if (quieta){ ponerParte(4); subL.textContent = 'Todo a la vez y en letra chica: así se presenta hoy.'; }
else ponerParte(4);
}));

/* 7 Arma tu tutorial: pestañas con flechas del teclado */
const tabs = [...document.querySelectorAll('#cTipo [role=tab]')];
const elegir = (b, f) => {
tabs.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $(x.getAttribute('aria-controls')).hidden = !on; });
if (f){ b.focus(); b.scrollIntoView({block:'nearest', inline:'nearest'}); }
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

/* 8 Manual en PDF o tutorial por capítulos */
const toggle = $('toggle'), crit = $('crit'), pc = $('pantallaC');
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
toggle.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
const m = b.dataset.m; toggle.dataset.m = m; crit.dataset.m = m; pc.dataset.m = m;
crit.querySelectorAll('b').forEach(v => { v.textContent = m === 'pdf' ? v.dataset.s : v.dataset.b; });
}));


/* Video de fondo del contacto: solo escritorio, sin ahorro de datos ni reducir movimiento; se pausa fuera de pantalla */
const vCta = $('vCta');
const sinVideo = reduce || !escritorio.matches || (navigator.connection && navigator.connection.saveData);
if (!sinVideo) new IntersectionObserver(([en]) => { if (en.isIntersecting){ vCta.preload = 'auto'; vCta.play().catch(() => {}); } else vCta.pause(); }, {rootMargin:'200px'}).observe(vCta);
/* El video de ejemplo se pausa si sale de pantalla */
const vEj = document.querySelector('.video-marco video');
new IntersectionObserver(([en]) => { if (!en.isIntersecting && !vEj.paused) vEj.pause(); }).observe(vEj);

/* Los CTA con motivo o plan preseleccionan el formulario */
const fQue = $('fQue');
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => { fQue.value = a.dataset.plan; setTimeout(() => $('fNombre').focus({preventScroll:true}), 600); }));
/* Formulario (maqueta: valida y confirma, no envía) */
const form = $('form'), fErr = $('fError'), fOk = $('fOk');
form.addEventListener('submit', e => {
e.preventDefault();
const nm = form.nombre, c = form.contacto, malos = [nm, c].filter(i => !i.value.trim());
[nm, c].forEach(i => i.setAttribute('aria-invalid', malos.includes(i)));
fErr.hidden = !malos.length;
if (malos.length){ malos[0].focus(); return; }
const btn = form.querySelector('button[type=submit]');
btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Enviando…';
setTimeout(() => { btn.removeAttribute('aria-busy'); btn.disabled = true; btn.textContent = 'Enviado'; fOk.hidden = false; }, 700);   // maqueta: simula el envío
});

if (!hasG || reduce){ ponerPaso(3); lis.forEach(li => li.classList.add('on')); return; }
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:0.55, ease:'power3.out', stagger:0.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Hero: entrada corta */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:0.6, ease:'power3.out', stagger:0.06});
gsap.from('.tut-esc', {y:32, opacity:0, duration:0.7, ease:'power3.out', delay:0.15});
/* Del manual al capítulo: fijo en escritorio, sigue al scroll en móvil */
const porP = p => ponerPaso(p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#flujoTrack', start:'top top', end:'bottom bottom', onUpdate:s => porP(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#mesa', start:'top 80%', end:'bottom 20%', onUpdate:s => porP(s.progress)}); });
})();
