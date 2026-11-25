/* WordPress a tu Medida · wordpress-impeccable-motion (paso 3 de la ruta rednet-design-1: movimiento) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');
const conMouse = matchMedia('(hover:hover) and (pointer:fine)');

/* Header sólido al salir del hero rojo, barra fija móvil y selector de versiones */
const hdr = document.getElementById('hdr'), barra = document.getElementById('barraMovil'), contacto = document.getElementById('contacto'), hero = document.querySelector('.p-hero');
const onScroll = () => {
const enHero = scrollY < hero.offsetHeight - 80;
hdr.classList.toggle('solido', !enHero); hdr.classList.toggle('sobre-hero', enHero && scrollY > 40);
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

/* Editor de ejemplo: lo que escribes aparece en la vista previa */
const editor = document.getElementById('editor'), guardado = document.getElementById('guardado'), pausa = document.getElementById('edPausa');
document.getElementById('edForm').addEventListener('submit', e => e.preventDefault());
const pares = [['inTitulo', 'outTitulo'], ['inPrecio', 'outPrecio'], ['inHorario', 'outHorario']];
let tGuard = null;
function marcarGuardado(){ guardado.textContent = 'Guardando…'; guardado.classList.add('esc'); clearTimeout(tGuard); tGuard = setTimeout(() => { guardado.textContent = 'Guardado'; guardado.classList.remove('esc'); }, 700); }
function destello(el){ if (reduce) return; el.classList.remove('cambio'); void el.offsetWidth; el.classList.add('cambio'); }
pares.forEach(([i, o]) => {
const inp = document.getElementById(i), out = document.getElementById(o);
inp.addEventListener('input', e => { out.textContent = inp.value || ' '; if (e.isTrusted) destello(out); marcarGuardado(); });
inp.addEventListener('focus', () => detenerDemo(true));
});
const outBtn = document.getElementById('outBtn'), colores = [...document.querySelectorAll('.ed-color button')];
colores.forEach(b => b.addEventListener('click', () => {
detenerDemo(true);
colores.forEach(x => x.setAttribute('aria-pressed', x === b));
outBtn.style.backgroundColor = b.dataset.c; marcarGuardado();
}));
document.getElementById('probar').addEventListener('click', e => { e.preventDefault(); detenerDemo(true); const t = document.getElementById('inTitulo'); t.focus(); t.select(); });

/* Demostración: si nadie toca el editor, se escribe un cambio solo.
Tiene botón de pausa visible, se detiene para siempre al tocar el editor y se pausa fuera de pantalla. */
let demo = null, tocado = false, enPausa = false, visible = false, paso = 0;
const guion = [['inTitulo', 'Hoy: empanadas de pino al horno'], ['inHorario', 'Domingo abierto · 9:00 a 14:00'], ['inTitulo', 'Pan amasado recién salido del horno'], ['inHorario', 'Lunes a sábado · 7:00 a 20:00']];
function correr(){ return !tocado && !enPausa && visible; }
function escribir(){
if (!correr()) return;
const [id, txt] = guion[paso % guion.length], inp = document.getElementById(id);
let k = 0;
(function sig(){
if (!correr()){ inp.value = txt; inp.dispatchEvent(new Event('input')); return; }
inp.value = txt.slice(0, k++); inp.dispatchEvent(new Event('input'));
if (k <= txt.length) demo = setTimeout(sig, 55);
else { paso++; demo = setTimeout(escribir, 5000); }   // un cambio cada 5 s como mínimo
})();
}
function detenerDemo(porUsuario){ clearTimeout(demo); if (porUsuario){ tocado = true; pausa.hidden = true; } }
pausa.addEventListener('click', () => {
enPausa = !enPausa; pausa.setAttribute('aria-pressed', enPausa); pausa.textContent = enPausa ? 'Seguir demo' : 'Pausar demo';
clearTimeout(demo); if (!enPausa) demo = setTimeout(escribir, 600);
});
if (!reduce){
pausa.hidden = false;
new IntersectionObserver(([en]) => { visible = en.isIntersecting; clearTimeout(demo); if (visible) demo = setTimeout(escribir, 1800); }, {threshold:.5}).observe(editor);
}

/* Carrera antes / ahora */
const bA = document.getElementById('barAntes'), bH = document.getElementById('barAhora'), tA = document.getElementById('tAntes'), tH = document.getElementById('tAhora');
function carrera(p){
const pa = Math.min(1, p), ph = Math.min(1, p * 4.5);   // "ahora" termina mucho antes
bA.style.setProperty('--p', pa.toFixed(3)); bH.style.setProperty('--p', ph.toFixed(3));   // scaleX, no width
const d = Math.round(pa * 3); tA.textContent = d + (d === 1 ? ' día' : ' días');
tH.textContent = Math.round(ph * 2) + ' min';
}
carrera(reduce || !hasG ? 1 : 0);

/* Acordeón: se abre al tocar o con el mouse encima; ya no avanza solo con el scroll */
const pans = [...document.querySelectorAll('.pan')], acord = document.getElementById('acordeon');
const abrir = p => pans.forEach(x => { const on = x === p; x.classList.toggle('on', on); x.querySelector('.pan-t button').setAttribute('aria-expanded', on); x.querySelector('.cont').inert = !on; });
pans.forEach(p => { p.addEventListener('mouseenter', () => conMouse.matches && abrir(p)); p.querySelector('.pan-t button').addEventListener('click', () => abrir(p)); });
/* El contenido usa desde el inicio el ancho del panel abierto, así el texto no se reacomoda mientras crece */
const medirAcordeon = () => { const W = acord.clientWidth, g = 8 * (pans.length - 1), f = 6.2; acord.style.setProperty('--ancho-abierto', ((W - g) * f / (f + pans.length - 1)) + 'px'); };
medirAcordeon(); addEventListener('resize', medirAcordeon);

/* Bloques: botón "Cambiar el orden" (teclado y táctil) y arrastre vertical solo con mouse */
const pagina = document.getElementById('paginaB');
const ordenes = [[0, 2, 1, 4, 3], [0, 3, 1, 2, 4], [0, 1, 2, 3, 4]];
const base = [...pagina.children]; let iOrden = 0;
function flip(cambio){
const antes = new Map([...pagina.children].map(el => [el, el.getBoundingClientRect().top]));
cambio();
if (!hasG || reduce) return;
[...pagina.children].forEach(el => { const dy = antes.get(el) - el.getBoundingClientRect().top; if (dy) gsap.fromTo(el, {y:dy}, {y:0, duration:.45, ease:'expo.out', overwrite:true}); });
}
document.getElementById('reordenar').addEventListener('click', () => {
const o = ordenes[iOrden++ % ordenes.length];
flip(() => o.forEach(i => pagina.appendChild(base[i])));
});
if (hasG && typeof Draggable !== 'undefined' && conMouse.matches){
gsap.registerPlugin(Draggable);
pagina.classList.add('arrastrable');
[...pagina.children].forEach(b => Draggable.create(b, {type:'y', bounds:pagina, zIndexBoost:true,
onRelease(){
const el = this.target, mid = el.getBoundingClientRect().top + el.offsetHeight / 2;
gsap.set(el, {y:0});
const otros = [...pagina.children].filter(x => x !== el);
const sig = otros.find(x => mid < x.getBoundingClientRect().top + x.offsetHeight / 2);
flip(() => pagina.insertBefore(el, sig || null));
}}));
} else document.getElementById('blAyuda').hidden = true;

/* Video de fondo del contacto: solo escritorio, sin ahorro de datos ni reducir movimiento; se pausa fuera de pantalla */
const vCta = document.getElementById('vCta');
const sinVideo = reduce || !escritorio.matches || (navigator.connection && navigator.connection.saveData);
if (!sinVideo) new IntersectionObserver(([en]) => { if (en.isIntersecting){ vCta.preload = 'auto'; vCta.play().catch(() => {}); } else vCta.pause(); }, {rootMargin:'200px'}).observe(vCta);

/* Los CTA con plan preseleccionan el formulario */
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
fOk.hidden = false;
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
document.querySelectorAll('[data-rv]').forEach(g => gsap.fromTo(g.matches('.dolor') ? g : g.children, {y:24, opacity:0}, {y:0, opacity:1, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* La demo cambia el alto del editor en móvil: se recalculan los disparadores para que nada quede a medio entrar */
let tRef = null;
new ResizeObserver(() => { clearTimeout(tRef); tRef = setTimeout(() => ScrollTrigger.refresh(), 250); }).observe(document.querySelector('.p-hero'));
/* Entrada del hero */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('#editor', {y:60, opacity:0, duration:.8, ease:'expo.out', delay:.15});
/* Carrera con el scroll */
const o = {p:0};
gsap.to(o, {p:1, ease:'none', onUpdate:() => carrera(o.p), scrollTrigger:{trigger:'#carrera', start:'top 80%', end:'bottom 40%', scrub:1}});
/* Bloques entran a la página uno tras otro */
gsap.from('.blq', {y:-24, opacity:0, duration:.5, ease:'power3.out', stagger:.06, scrollTrigger:{trigger:pagina, start:'top 75%'}});
})();
