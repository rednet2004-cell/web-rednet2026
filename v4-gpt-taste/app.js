(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);

/* Nav: cambia a claro al salir del hero; barra móvil */
const nav = document.getElementById('nav'), hero = document.querySelector('.hero');
const barra = document.getElementById('barraMovil'), contacto = document.getElementById('contacto'), proceso = document.getElementById('proceso');
const onScroll = () => {
const hb = hero.getBoundingClientRect().bottom, pr = proceso.getBoundingClientRect();
const sobreOscuro = hb > 60 || (pr.top < 60 && pr.bottom > 60);
nav.classList.toggle('claro', !sobreOscuro);
barra.classList.toggle('on', hb < 0 && contacto.getBoundingClientRect().top > innerHeight);
};
addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* Menú móvil */
const menu = document.getElementById('menu'), links = document.getElementById('navLinks');
const cerrar = () => { links.classList.remove('abierto'); menu.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
menu.addEventListener('click', () => {
const ab = !links.classList.contains('abierto');
links.classList.toggle('abierto', ab); menu.setAttribute('aria-expanded', ab); document.body.style.overflow = ab ? 'hidden' : '';
if (ab) setTimeout(() => links.querySelector('a').focus(), 200);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrar));
addEventListener('keydown', e => { if (e.key === 'Escape' && links.classList.contains('abierto')){ cerrar(); menu.focus(); } });

/* Video del hero: solo en pantallas grandes, sin ahorro de datos y con movimiento permitido */
const v = document.getElementById('vLoop'), pausa = document.getElementById('pausa');
const conVideo = !reduce && matchMedia('(min-width:861px)').matches && !(navigator.connection && navigator.connection.saveData);
let pausado = !conVideo;
const fijar = p => { pausado = p; pausa.setAttribute('aria-pressed', p); pausa.querySelector('span').textContent = p ? 'Reproducir video' : 'Pausar video'; p ? v.pause() : v.play().catch(() => {}); };
if (conVideo){ v.preload = 'auto'; v.play().catch(() => {}); new IntersectionObserver(([en]) => { if (!pausado) en.isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe(hero); }
else pausa.hidden = true;
pausa.addEventListener('click', () => fijar(!pausado));

/* Acordeón */
const pans = [...document.querySelectorAll('.pan')];
const abrir = p => pans.forEach(x => { const on = x === p; x.classList.toggle('on', on); x.querySelector('h3 button').setAttribute('aria-expanded', on); x.querySelector('.cont').inert = !on; });
pans.forEach(p => { p.addEventListener('mouseenter', () => matchMedia('(hover:hover) and (min-width:961px)').matches && abrir(p)); p.querySelector('h3 button').addEventListener('click', () => abrir(p)); });
abrir(pans[0]);

/* Chat */
const guion = [['cli','Hola, ¿hacen sitios para restaurantes? ¿Cuánto cuesta?'],['bot','¡Hola! Sí, hacemos sitios a medida con carta y reservas. ¿Quieres que te agendemos una llamada de 15 minutos para cotizar?'],['cli','Dale, mañana en la tarde.'],['bot','Listo. Te agendé mañana a las 16:00 y te llegó la confirmación por correo.'],['ok','Reunión agendada en el calendario · 4 s']];
const msgs = document.getElementById('msgs'); let corrida = 0;
function chat(inst){
const id = ++corrida; msgs.innerHTML = '';
if (inst){ guion.forEach(([t,s]) => { const d = document.createElement('div'); d.className = 'm ' + t; d.textContent = s; msgs.appendChild(d); }); return; }
let i = 0;
(function sig(){
if (id !== corrida || i >= guion.length) return;
const [t,s] = guion[i++]; let esc = null;
if (t === 'bot'){ esc = document.createElement('div'); esc.className = 'm esc'; esc.innerHTML = '<i></i><i></i><i></i>'; msgs.appendChild(esc); }
setTimeout(() => {
if (id !== corrida) return;
esc && esc.remove();
const d = document.createElement('div'); d.className = 'm ' + t; d.textContent = s; msgs.appendChild(d);
if (hasG) gsap.from(d, {y:16, opacity:0, duration:.6, ease:'expo.out'});
setTimeout(sig, 650);
}, t === 'bot' ? 1100 : 350);
})();
}
chat(true);
document.getElementById('repetir').addEventListener('click', () => chat(reduce));
new IntersectionObserver((en, ob) => { if (en[0].isIntersecting){ chat(reduce); ob.disconnect(); } }, {threshold:.5}).observe(msgs);

/* Toggle de métricas */
const anchos = {antes:['100%','2%','24%'], con:['4%','70%','100%']};
const toggle = document.getElementById('toggle');
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
toggle.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
const m = b.dataset.m; toggle.dataset.m = m;
document.querySelectorAll('#met > div').forEach((d,i) => { const val = d.querySelector('b'); val.textContent = m === 'antes' ? val.dataset.a : val.dataset.c; d.querySelector('.barra i').style.width = anchos[m][i]; });
}));

/* Reseñas: carrusel con flechas y deslizamiento */
const pista = document.getElementById('pistaRes'), resN = pista.children.length, cont = document.getElementById('resCont');
let ri = 0;
const irRes = i => { ri = (i + resN) % resN; pista.style.transform = `translateX(${-ri * 100}%)`; cont.textContent = `${ri + 1} / ${resN}`; [...pista.children].forEach((f,k) => f.inert = k !== ri); };
document.getElementById('resPrev').onclick = () => irRes(ri - 1);
document.getElementById('resNext').onclick = () => irRes(ri + 1);
let tx = null;
pista.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, {passive:true});
pista.addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) irRes(ri + (dx < 0 ? 1 : -1)); tx = null; });
irRes(0);

/* Planes preseleccionan el formulario; formulario de maqueta */
const fQue = document.getElementById('fQue');
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => { fQue.value = a.dataset.plan; }));
const form = document.getElementById('form');
form.addEventListener('submit', e => {
e.preventDefault();
const malos = [form.nombre, form.contacto].filter(i => !i.value.trim());
[form.nombre, form.contacto].forEach(i => i.setAttribute('aria-invalid', malos.includes(i)));
document.getElementById('fErr').hidden = !malos.length;
if (malos.length){ malos[0].focus(); return; }
document.getElementById('fOk').hidden = false; form.querySelector('[type=submit]').textContent = 'Enviado';
});

if (!hasG) return;
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
/* Entrada del hero */
gsap.from('.hero-h1 .linea', {yPercent:60, opacity:0, duration:1.4, ease:'expo.out', stagger:.12});
gsap.from('.hero-txt p, .hero-txt .ctas', {y:24, opacity:0, duration:1.2, ease:'expo.out', delay:.35, stagger:.1});
gsap.to('.hero-txt', {yPercent:-18, opacity:.25, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}});
/* Paradigma 1: texto que se revela palabra por palabra con el scroll */
const p = document.getElementById('manif');
[...p.childNodes].forEach(n => {
if (n.nodeType !== 3) return;
const frag = document.createDocumentFragment();
n.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()){ frag.append(t); return; } const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s); });
p.replaceChild(frag, n);
});
gsap.fromTo('#manif .w, #manif .pildora', {opacity:.12}, {opacity:1, stagger:.08, ease:'none', scrollTrigger:{trigger:p, start:'top 80%', end:'bottom 45%', scrub:true}});
/* Bento */
gsap.from('.cel', {y:60, opacity:0, duration:1.2, ease:'expo.out', stagger:.08, scrollTrigger:{trigger:'.bento', start:'top 82%'}});
/* Paradigma 2: título fijo a la izquierda + cartas que se apilan */
const cartas = gsap.utils.toArray('.carta');
cartas.forEach((c, i) => {
if (i === cartas.length - 1) return;
gsap.to(c, {scale:.92, opacity:.55, ease:'none', scrollTrigger:{trigger:cartas[i + 1], start:'top 85%', end:'top 25%', scrub:true}});
});
/* Imágenes de proyectos: crecen al entrar y se apagan al salir */
gsap.utils.toArray('.pro-img').forEach(img => {
gsap.fromTo(img, {scale:.82, borderRadius:28}, {scale:1, ease:'none', scrollTrigger:{trigger:img, start:'top 95%', end:'top 45%', scrub:true}});
gsap.to(img, {opacity:.2, ease:'none', scrollTrigger:{trigger:img, start:'bottom 30%', end:'bottom top', scrub:true}});
});
/* CTA */
gsap.fromTo('.cta', {scale:.94}, {scale:1, ease:'none', scrollTrigger:{trigger:'.cta', start:'top 95%', end:'top 45%', scrub:true}});
});
mm.add('(prefers-reduced-motion: no-preference) and (min-width:861px)', () => {
ScrollTrigger.create({trigger:'.split', start:'top 120px', end:() => 'bottom ' + (120 + document.getElementById('splitIzq').offsetHeight) + 'px', pin:'#splitIzq', pinSpacing:false});
});
})();
