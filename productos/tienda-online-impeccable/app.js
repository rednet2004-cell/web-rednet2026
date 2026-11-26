/* Tienda Online (P04) · tienda-online-impeccable (ruta rednet-design-1: impeccable) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');
const mouse = matchMedia('(hover:hover) and (pointer:fine)').matches;
const $ = id => document.getElementById(id);
const ENT = {y:40, d:.9, st:.1, h1:1.1, h1e:'power4.out', ped:-120, pedE:'power3.out'};

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

/* 1 Pedidos del hero: se arrastran solo con mouse (en pantallas táctiles no atrapan el scroll) */
if (hasG && mouse && typeof Draggable !== 'undefined'){
gsap.registerPlugin(Draggable);
$('pila').classList.add('arrastrable');
let z = 10;
document.querySelectorAll('.pedido').forEach(p => Draggable.create(p, {type:'x,y', bounds:'#pila', onPress(){ this.target.style.zIndex = ++z; }}));
}

/* 3 Veinte mensajes: el lado visual y las barras siguen al toggle */
const toggle = $('toggle'), met = $('met'), msjVis = $('msjVis');
const ponerModo = m => {
toggle.dataset.m = m; msjVis.dataset.m = m;
toggle.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.m === m));
met.querySelectorAll('li').forEach(li => {
const b = li.querySelector('b'), i = li.querySelector('.barra i');
b.textContent = m === 'antes' ? b.dataset.a : b.dataset.c;
i.style.transform = `scaleX(${m === 'antes' ? i.dataset.a : i.dataset.c})`;
});
};
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => ponerModo(b.dataset.m)));
ponerModo('con');

/* 5 Reloj de día a noche */
const marcas = $('marcas');
for (let i = 0; i < 12; i++){
const a = i * 30 * Math.PI / 180, r1 = i % 3 ? 82 : 76, r2 = 88;
const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
l.setAttribute('x1', 100 + r1 * Math.sin(a)); l.setAttribute('y1', 100 - r1 * Math.cos(a));
l.setAttribute('x2', 100 + r2 * Math.sin(a)); l.setAttribute('y2', 100 - r2 * Math.cos(a));
l.setAttribute('stroke', 'currentColor'); l.setAttribute('stroke-width', i % 3 ? 2 : 4); l.setAttribute('stroke-linecap', 'round');
marcas.appendChild(l);
}
const hora = $('hora'), min = $('min'), horaDig = $('horaDig'), noche = $('noche'), cielo = $('cielo');
const peds = [...document.querySelectorAll('#nochePed li')];
const T0 = 20 * 60, T1 = 31 * 60 + 30;   // de 20:00 a 07:30 del día siguiente
function ponerHora(p){
const t = T0 + p * (T1 - T0), h = Math.floor(t / 60) % 24, m = Math.floor(t % 60);
hora.setAttribute('transform', `rotate(${(t / 60 % 12) * 30} 100 100)`);
min.setAttribute('transform', `rotate(${(t % 60) * 6} 100 100)`);
horaDig.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
peds.forEach(li => li.classList.toggle('on', t >= +li.dataset.t));
/* anochece al principio y amanece al final */
const o = p < .04 ? 0 : p < .2 ? (p - .04) / .16 : p < .86 ? 1 : p < .94 ? 1 - (p - .86) / .08 : 0;
cielo.style.opacity = o.toFixed(3); noche.classList.toggle('oscuro', o > .5);
}

/* 8 Rubros: pestañas con flechas del teclado */
const tabs = [...document.querySelectorAll('#rubTabs [role=tab]')];
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

/* Tarjetas de "qué incluye": se inclinan hacia el cursor, solo con mouse */
if (!reduce && mouse){
document.querySelectorAll('.inc').forEach(c => {
c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`; });
c.addEventListener('pointerleave', () => { c.style.transform = ''; });
});
}

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

btn.disabled = true; fOk.hidden = false;
});

if (!hasG || reduce){ ponerHora(1); return; }
ponerHora(0);
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:ENT.y, opacity:0, duration:ENT.d, ease:'power3.out', stagger:ENT.st, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Hero: el titular sube línea por línea */
gsap.from('.p-hero h1 .ln > *', {yPercent:100, duration:ENT.h1, ease:ENT.h1e, stagger:ENT.st * 2});
gsap.from('#heroTxt .miga, #heroTxt p, #heroTxt .hero-ctas', {y:ENT.y, opacity:0, duration:ENT.d, ease:'power3.out', stagger:ENT.st, delay:.2});
gsap.from('.foto-tienda', {y:ENT.y * 2, opacity:0, duration:ENT.d + .2, ease:'power3.out', delay:.15});
gsap.from('.pedido', {y:ENT.ped, opacity:0, duration:ENT.d + .1, ease:ENT.pedE, stagger:ENT.st * 2, delay:.4});
/* Comparador */
gsap.from('#msjVis', {y:ENT.y, opacity:0, duration:ENT.d, ease:'power3.out', scrollTrigger:{trigger:'#msjVis', start:'top 85%'}});
/* Recorrido horizontal (escritorio): la sección se fija y el pedido avanza de etapa en etapa */
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => {
const tren = $('tren'), linea = $('recLinea');
const dist = () => Math.max(0, tren.scrollWidth - innerWidth);
const tl = gsap.timeline({scrollTrigger:{trigger:'.recorrido', start:'top top', end:() => '+=' + (dist() + innerHeight * .4), scrub:1, pin:true, invalidateOnRefresh:true}});
tl.to(tren, {x:() => -dist(), ease:'none'}, 0)
.to('#recProg', {scaleX:1, ease:'none'}, 0)
.to('#caja', {x:() => linea.offsetWidth, rotation:360, ease:'none'}, 0);
document.querySelectorAll('.etapa').forEach(e => gsap.from(e.querySelector('.mini'), {y:ENT.y, opacity:0, duration:ENT.d, ease:'power3.out', scrollTrigger:{trigger:e, containerAnimation:tl, start:'left 75%'}}));
});
mm.add('(max-width:860px)', () => {
gsap.from('.etapa', {y:ENT.y, opacity:0, duration:ENT.d, ease:'power3.out', stagger:ENT.st, scrollTrigger:{trigger:'#tren', start:'top 85%'}});
});
/* Día a noche: el reloj avanza con el scroll; la capa oscura aparece y al final amanece */
const fijar = escritorio.matches;
const o = {p:0};
gsap.to(o, {p:1, ease:'none', onUpdate:() => ponerHora(o.p), scrollTrigger:{trigger:'#noche', start:fijar ? 'center center' : 'top 70%', end:fijar ? '+=1100' : 'bottom 35%', scrub:1, pin:fijar}});
})();
