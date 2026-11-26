/* Publicador Inteligente (P09) · publicador-ia-pulido (ruta rednet-design-1 completa: impeccable → motion → pulido) */
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

/* 1 Editor del hero: tema → borrador → aprobado → publicado. Cada artículo dura más de 5 s,
   con pausa visible; se detiene fuera de pantalla y con reducir movimiento. */
const ciclos = [
['Climatización', '5 señales de que tu aire acondicionado necesita mantención', 'Tu sitio web'],
['Colegio', 'Guía de tallas para uniformes escolares', 'Tu app'],
['Corredora', 'Qué revisar antes de arrendar una oficina', 'Tu portal de clientes'],
['Clínica', 'Cómo preparar tu primera consulta', 'Tu sistema']
];
const ed = $('editor'), tit = $('edTit'), tema = $('edTema'), dest = $('edDest'), est = $('edEst'), ok = $('edOk'), selloTxt = $('selloTxt'), ult = $('ultima'), ultTxt = $('ultTxt'), pausa = $('pausa');
const pinta = ([t, h, d]) => { tema.textContent = 'Tema · ' + t; dest.textContent = 'Destino · ' + d; selloTxt.textContent = 'Hoy · 09:00 · ' + d; tit.textContent = h; };
const final = () => { ed.classList.add('escribe', 'ok', 'pub'); est.textContent = 'Aprobado'; ok.textContent = 'Aprobado'; ult.classList.add('al-dia'); ultTxt.textContent = 'hoy'; };
let n = 0, fase = 0, letra = 0, timer = null, pausado = reduce, visible = true;
function paso(){
timer = null;
if (pausado || !visible) return;
const c = ciclos[n % ciclos.length];
if (fase === 0){ pinta(c); tit.textContent = ''; ed.classList.remove('escribe', 'ok', 'pub'); est.textContent = 'Borrador'; ok.textContent = 'Aprobar'; if (n > 0){ ult.classList.remove('al-dia'); ultTxt.textContent = 'hace 2 semanas'; } letra = 0; fase = 1; }
if (fase === 1){ letra++; tit.textContent = c[1].slice(0, letra); const cur = document.createElement('span'); cur.className = 'cur'; tit.append(cur); if (letra >= c[1].length) fase = 2; return programar(fase === 2 ? 400 : 40); }
if (fase === 2){ tit.textContent = c[1]; ed.classList.add('escribe'); est.textContent = 'Borrador · revisado'; fase = 3; return programar(1300); }
if (fase === 3){ ed.classList.add('ok'); ok.textContent = 'Aprobado'; est.textContent = 'Aprobado'; fase = 4; return programar(900); }
if (fase === 4){ ed.classList.add('pub'); ult.classList.add('al-dia'); ultTxt.textContent = 'hoy'; fase = 0; n++; return programar(3200); }
}
function programar(ms){ timer = setTimeout(paso, ms); }
function seguir(){ if (!timer && !pausado && visible) programar(300); }
pausa.addEventListener('click', () => {
pausado = !pausado; pausa.setAttribute('aria-pressed', pausado); pausa.setAttribute('aria-label', pausado ? 'Reanudar la animación del artículo' : 'Pausar la animación del artículo');
if (pausado){ clearTimeout(timer); timer = null; if (fase === 1){ tit.textContent = ciclos[n % ciclos.length][1]; fase = 2; } } else seguir();
});
if (reduce){ pinta(ciclos[0]); final(); pausa.setAttribute('aria-pressed', 'true'); pausa.setAttribute('aria-label', 'Reanudar la animación del artículo'); }
else {
new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) seguir(); else { clearTimeout(timer); timer = null; } }).observe(ed);
setTimeout(seguir, 600);
}

/* 3 Mesa de redacción: el paso visible sigue al scroll */
const mesa = $('mesa'), pasos = [...document.querySelectorAll('#pasos li')];
const ponerPaso = i => { if (mesa.dataset.paso == i) return; mesa.dataset.paso = i; pasos.forEach((li, k) => li.classList.toggle('on', k === i)); };

/* 4 Destinos: pestañas con flechas del teclado */
const tabs = [...document.querySelectorAll('#cDest [role=tab]')];
const elegir = (b, foco) => {
tabs.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $(x.getAttribute('aria-controls')).hidden = !on; });
if (foco) b.focus();
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

/* 5 Comparador */
const toggle = $('toggle'), met = $('met');
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
toggle.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
const m = b.dataset.m; toggle.dataset.m = m; met.dataset.m = m;
met.querySelectorAll(':scope > div').forEach(d => {
const v = d.querySelector('b'); v.textContent = m === 'antes' ? v.dataset.a : v.dataset.c;
d.querySelector('.barra i').style.transform = 'scaleX(' + (m === 'antes' ? d.dataset.wa : d.dataset.wc) + ')';
});
}));

/* Un año de constancia: 12 meses × 2 artículos */
const meses = $('meses'), anioN = $('anioN'), barras = [];
['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].forEach(m => { const d = document.createElement('div'); d.className = 'mes'; const s = document.createElement('small'); s.textContent = m; d.append(s); for (let k = 0; k < 2; k++){ const i = document.createElement('i'); d.append(i); barras.push(i); } meses.append(d); });
const llena = p => { const c = Math.round(p * barras.length); barras.forEach((b, k) => b.classList.toggle('on', k < c)); anioN.textContent = c; };

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
const nm = form.nombre, c = form.contacto, malos = [nm, c].filter(i => !i.value.trim());
[nm, c].forEach(i => i.setAttribute('aria-invalid', malos.includes(i)));
fErr.hidden = !malos.length;
if (malos.length){ malos[0].focus(); return; }
const btn = form.querySelector('button[type=submit]');
btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Enviando…';
setTimeout(() => { btn.removeAttribute('aria-busy'); btn.disabled = true; btn.textContent = 'Enviado'; fOk.hidden = false; }, 700);   // maqueta: simula el envío
});

if (!hasG || reduce){ ponerPaso(3); pasos.forEach(li => li.classList.add('on')); llena(1); return; }
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Hero: entrada corta */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('.editor-esc', {y:32, opacity:0, duration:.7, ease:'power3.out', delay:.15});
/* Mesa de redacción: fija en escritorio, sigue al scroll en móvil */
const porP = p => ponerPaso(p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#flujoTrack', start:'top top', end:'bottom bottom', onUpdate:s => porP(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#mesa', start:'top 80%', end:'bottom 20%', onUpdate:s => porP(s.progress)}); });
/* Año: se llena con el scroll */
llena(0);
ScrollTrigger.create({trigger:'#anio', start:'top 80%', end:'bottom 45%', scrub:true, onUpdate:s => llena(s.progress), onLeave:() => llena(1)});
})();
