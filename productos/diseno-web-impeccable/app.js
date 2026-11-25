/* Diseño Web Rednet · diseno-web-impeccable (ruta rednet-design-1, paso 2) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

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

/* Piezas flotantes del hero: siguen al mouse; el bucle se detiene cuando el hero sale de pantalla */
const escena = document.getElementById('escena'), piezasF = [...escena.querySelectorAll('.pieza-f')];
if (!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, {passive:true});
const loop = () => {
cx += (tx - cx) * .06; cy += (ty - cy) * .06;
piezasF.forEach(p => { const k = +p.dataset.p; p.style.transform = `translate3d(${(cx * k).toFixed(1)}px,${(cy * k * .6).toFixed(1)}px,0)`; });
raf = requestAnimationFrame(loop);
};
new IntersectionObserver(([en]) => { cancelAnimationFrame(raf); if (en.isIntersecting) raf = requestAnimationFrame(loop); }).observe(escena);
}

/* Boceto → diseño */
const mock = document.getElementById('mock'), capas = [...document.querySelectorAll('#capas li')];
let est = -1;
function estado(i){ if (i === est) return; est = i; mock.dataset.e = i; capas.forEach((c, k) => c.classList.toggle('on', k === i)); }
estado(reduce || !hasG ? 3 : 0);

/* Comparador plantilla / a medida: arrastre con el mouse o el dedo, flechas, Inicio y Fin */
const comp = document.getElementById('comp'), mango = document.getElementById('mango');
const textoValor = p => p < 30 ? 'Casi todo diseño a medida' : p > 70 ? 'Casi todo plantilla' : 'Mitad plantilla, mitad a medida';
function poner(p){ p = clamp(p, 4, 96); comp.style.setProperty('--x', p + '%'); mango.setAttribute('aria-valuenow', Math.round(p)); mango.setAttribute('aria-valuetext', textoValor(p)); }
let arr = false;
const mover = x => { const r = comp.getBoundingClientRect(); poner((x - r.left) / r.width * 100); };
comp.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' && e.target !== mango && !mango.contains(e.target)) return; arr = true; comp.setPointerCapture(e.pointerId); mover(e.clientX); if (hasG) gsap.killTweensOf(comp); });
comp.addEventListener('pointermove', e => arr && mover(e.clientX));
comp.addEventListener('pointerup', () => arr = false);
comp.addEventListener('pointercancel', () => arr = false);
mango.addEventListener('keydown', e => {
const v = parseFloat(comp.style.getPropertyValue('--x')) || 50;
const mapa = {ArrowLeft:v - 5, ArrowDown:v - 5, ArrowRight:v + 5, ArrowUp:v + 5, Home:4, End:96};
if (e.key in mapa){ e.preventDefault(); if (hasG) gsap.killTweensOf(comp); poner(mapa[e.key]); }
});

/* Dispositivos: sin cambio automático, lo decide la persona */
const disp = document.getElementById('disp'), dbtns = [...document.querySelectorAll('.disp-btns button')];
dbtns.forEach(b => b.addEventListener('click', () => { disp.dataset.d = b.dataset.d; dbtns.forEach(x => x.setAttribute('aria-pressed', x === b)); }));

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
fOk.hidden = false; form.reset();
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
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:40, opacity:0, duration:.9, ease:'power3.out', stagger:.1, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Entrada del hero: la frase "igual a todos" se tacha */
const tacha = document.getElementById('tacha');
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.fromTo(tacha, {'--t':0}, {'--t':1, duration:.7, ease:'power3.inOut', delay:1});
gsap.from('.nav-mock', {y:140, opacity:0, duration:1.3, ease:'power4.out', delay:.3});
gsap.from('.pieza-f', {opacity:0, duration:.9, ease:'power2.out', stagger:.12, delay:.9});
gsap.to('.nav-mock', {y:-60, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Boceto → diseño: fijado en escritorio, cuatro tramos de scroll */
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => {
ScrollTrigger.create({trigger:'.boceto-sec', start:'top top', end:'+=' + innerHeight * 2, pin:true, onUpdate:s => estado(Math.min(3, Math.floor(s.progress * 4)))});
});
mm.add('(max-width:860px)', () => {
ScrollTrigger.create({trigger:'#mock', start:'top 75%', end:'bottom 25%', onUpdate:s => estado(Math.min(3, Math.floor(s.progress * 4)))});
});
/* Comparador: se abre solo la primera vez */
gsap.fromTo(comp, {'--x':'88%'}, {'--x':'50%', duration:1.4, ease:'power3.inOut', scrollTrigger:{trigger:comp, start:'top 70%'}});
/* Pila: cada tarjeta se achica un poco cuando la siguiente la tapa */
const pcs = gsap.utils.toArray('.pc');
pcs.forEach((c, i) => { if (i < pcs.length - 1) gsap.to(c, {scale:.94, filter:'brightness(.92)', ease:'none', scrollTrigger:{trigger:pcs[i + 1], start:'top 80%', end:'top 30%', scrub:true}}); });
})();
