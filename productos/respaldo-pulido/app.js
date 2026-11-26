/* Respaldo de Datos Seguro (P06, catálogo v2.1) · respaldo-pulido (ruta rednet-design-1 completa: impeccable → motion → pulido) */
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

/* Prueba "rómpelo y vuelve atrás": el foco pasa a la línea de tiempo y el estado se anuncia */
const sitio = document.getElementById('sitioP'), romper = document.getElementById('romper'), lt = document.getElementById('lt');
const ltSel = document.getElementById('ltSel'), estado = document.getElementById('spEstado'), okTxt = document.getElementById('spOkTxt');
const nombres = [...sitio.querySelectorAll('.sp-arch b')];
nombres.forEach(b => b.dataset.o = b.textContent);
const etiquetas = ['Hace 4 días', 'Antes de ayer', 'Ayer', 'Anoche', 'Ahora'];
const decir = v => { const t = etiquetas[v] + (v === 4 && sitio.dataset.e === 'roto' ? ' (con error)' : ''); ltSel.textContent = t; lt.setAttribute('aria-valuetext', t); };
let tOk = null;
romper.addEventListener('click', () => {
clearTimeout(tOk);
sitio.dataset.e = 'roto'; estado.textContent = 'Error';
nombres.forEach(b => b.textContent = b.dataset.r);
lt.disabled = false; lt.value = 4; decir(4);
romper.innerHTML = 'Ahora vuelve atrás <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
lt.focus({preventScroll:true});
});
lt.addEventListener('input', () => {
const v = +lt.value; decir(v);
if (sitio.dataset.e === 'roto' && v < 4){
sitio.dataset.e = 'ok2'; estado.textContent = 'Restaurado';
nombres.forEach(b => b.textContent = b.dataset.o);
okTxt.textContent = 'Restaurado desde la copia de ' + etiquetas[v].toLowerCase();
romper.textContent = 'Simular otro error';
tOk = setTimeout(() => { sitio.dataset.e = 'ok'; estado.textContent = 'En línea'; lt.disabled = true; lt.value = 4; decir(4); }, 3200);
}
});

/* Calendario: 30 copias */
const cal = document.getElementById('cal'), calN = document.getElementById('calN');
for (let d = 1; d <= 30; d++){ const i = document.createElement('i'); i.textContent = d; cal.appendChild(i); }
const dias = [...cal.children];
function llenar(p){
const n = Math.round(p * 30);
dias.forEach((d, k) => { d.classList.toggle('on', k < n && k < 29); d.classList.toggle('hoy', k === 29 && n === 30); });
calN.textContent = n;
}
llenar(1);

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

if (!hasG || reduce) return;
/* Frase palabra por palabra */
document.querySelectorAll('[data-palabras]').forEach(p => {
[...p.childNodes].forEach(n => {
if (n.nodeType !== 3) return;
const frag = document.createDocumentFragment();
n.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()){ frag.append(t); return; } const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s); });
p.replaceChild(frag, n);
});
gsap.fromTo(p.querySelectorAll('.w, .ico'), {opacity:.16}, {opacity:1, stagger:.08, ease:'none', scrollTrigger:{trigger:p, start:'top 80%', end:'bottom 45%', scrub:true}});
});
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Entrada del hero: corta y sin rebote; las copias se apilan de la más vieja a la de hoy (antes caían 200 px durante 1,4 s) */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('.copia', {y:-48, opacity:0, duration:.5, ease:'expo.out', stagger:.07, delay:.2, clearProps:'transform,opacity'});
/* Prueba: el sitio entra */
gsap.from('#sitioP', {y:32, opacity:0, duration:.6, ease:'power3.out', scrollTrigger:{trigger:'#sitioP', start:'top 80%'}});
/* Calendario: se llena con el scroll; nunca queda en 0 si la persona llega directo */
llenar(0);
const o = {p:0};
gsap.to(o, {p:1, ease:'none', onUpdate:() => llenar(o.p), scrollTrigger:{trigger:'#cal', start:'top 80%', end:'center 50%', scrub:1}});
})();
