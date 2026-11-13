/* Hosting Rednet · hosting-pulido (paso 4: pulido final sobre hosting-impeccable-motion) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const escritorio = matchMedia('(min-width:861px)');

/* Header sólido, barra fija móvil y selector de versiones */
const hdr = document.getElementById('hdr'), barra = document.getElementById('barraMovil'), contacto = document.getElementById('contacto');
const onScroll = () => {
hdr.classList.toggle('solido', scrollY > innerHeight * .55);
barra.classList.toggle('on', scrollY > innerHeight * .8 && contacto.getBoundingClientRect().top > innerHeight);
document.body.classList.toggle('bajo', scrollY > 120);
};
addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* Menú móvil: Escape cierra, el foco va al primer link */
const menuBtn = document.getElementById('menuBtn'), navP = document.getElementById('navPrincipal');
const cerrarMenu = () => { navP.classList.remove('abierto'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
menuBtn.addEventListener('click', () => {
const ab = !navP.classList.contains('abierto');
navP.classList.toggle('abierto', ab); menuBtn.setAttribute('aria-expanded', ab); document.body.style.overflow = ab ? 'hidden' : '';
if (ab) navP.querySelector('a').focus();
});
navP.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
addEventListener('keydown', e => { if (e.key === 'Escape' && navP.classList.contains('abierto')){ cerrarMenu(); menuBtn.focus(); } });

/* Monitor: barras de disponibilidad (ejemplo) con pestañas que sí cambian el período */
const up = document.getElementById('uptime'), upDesde = document.getElementById('upDesde');
const periodos = {90:{avisos:[23,61], caidas:[47], desde:'Hace 90 días', txt:'90 días'}, 30:{avisos:[11], caidas:[], desde:'Hace 30 días', txt:'30 días'}, 24:{avisos:[], caidas:[], desde:'Hace 24 horas', txt:'24 horas'}};
function pintar(n){
const p = periodos[n]; up.innerHTML = ''; up.style.setProperty('--n', n);
for (let i = 0; i < n; i++){ const b = document.createElement('i'); if (p.avisos.includes(i)) b.className = 'amb'; if (p.caidas.includes(i)) b.className = 'roj'; up.appendChild(b); }
upDesde.textContent = p.desde;
up.setAttribute('aria-label', `Disponibilidad de las últimas ${p.txt}: ` + (p.avisos.length || p.caidas.length ? `${p.avisos.length} con avisos y ${p.caidas.length} con caída breve (ejemplo)` : 'sin problemas (ejemplo)'));
}
pintar(90);
document.querySelectorAll('.mon-tabs button').forEach(b => b.addEventListener('click', () => {
document.querySelectorAll('.mon-tabs button').forEach(x => x.setAttribute('aria-pressed', x === b));
pintar(+b.dataset.n);
if (hasG && !reduce) gsap.fromTo('#uptime i', {scaleY:0}, {scaleY:1, duration:.3, ease:'expo.out', stagger:.003, overwrite:true});
}));
/* Curva de tiempo de respuesta (ejemplo) */
const pts = []; let y = 92;
for (let i = 0; i <= 40; i++){ y += (Math.sin(i * 1.7) * 9 + Math.cos(i * .6) * 6) * .5; y = clamp(y + (92 - y) * .25, 55, 130); pts.push([i * 25, y]); }
const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1].toFixed(1)).join(' ');
const curva = document.getElementById('curva'), area = document.getElementById('curvaArea');
curva.setAttribute('d', d); area.setAttribute('d', d + ' L1000 160 L0 160 Z');

/* Tarjeta del hero: se inclina hacia el cursor. El bucle solo corre mientras hay movimiento y se detiene fuera de pantalla */
const vis = document.getElementById('heroVis'), tarjeta = document.getElementById('tarjeta'), chips = [...vis.querySelectorAll('.chip-flota')];
if (!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
let tx = 0, ty = 0, cx = 0, cy = 0, corriendo = false;
const paso = () => {
cx += (tx - cx) * .08; cy += (ty - cy) * .08;
tarjeta.style.transform = `translateX(-50%) rotateY(${(cx * 16).toFixed(2)}deg) rotateX(${(-cy * 12).toFixed(2)}deg)`;
chips.forEach((c, i) => { const k = (i + 1) * 14; c.style.transform = `translate3d(${(cx * k).toFixed(1)}px,${(cy * k).toFixed(1)}px,0)`; });
if (Math.abs(tx - cx) + Math.abs(ty - cy) > .001) requestAnimationFrame(paso); else corriendo = false;
};
const despertar = () => { if (!corriendo){ corriendo = true; requestAnimationFrame(paso); } };
vis.addEventListener('pointermove', e => { const r = vis.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; despertar(); });
vis.addEventListener('pointerleave', () => { tx = ty = 0; despertar(); });
}

/* Toggle Antes / Con Rednet (barras con scaleX) */
document.querySelectorAll('#met > div').forEach(dv => dv.querySelector('.barra i').style.transform = `scaleX(${dv.dataset.wc})`);
document.querySelectorAll('.toggle').forEach(toggle => {
const met = document.getElementById(toggle.dataset.met);
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
toggle.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
const m = b.dataset.m; toggle.dataset.m = m;
met.querySelectorAll(':scope > div').forEach(dv => {
const v = dv.querySelector('b'); v.textContent = m === 'antes' ? v.dataset.a : v.dataset.c;
dv.querySelector('.barra i').style.transform = `scaleX(${m === 'antes' ? dv.dataset.wa : dv.dataset.wc})`;
});
}));
});

/* Niebla del hero: se pausa fuera de pantalla */
const heroEl = document.querySelector('.p-hero');
new IntersectionObserver(([en]) => heroEl.classList.toggle('quieta', !en.isIntersecting)).observe(heroEl);
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
gsap.fromTo(p.querySelectorAll('.w, .ico'), {opacity:.2}, {opacity:1, stagger:.08, ease:'none', scrollTrigger:{trigger:p, start:'top 80%', end:'bottom 45%', scrub:true}});
});
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Contador de disponibilidad */
document.querySelectorAll('[data-cuenta]').forEach(el => {
const fin = parseFloat(el.dataset.cuenta), o = {v:0};
gsap.to(o, {v:fin, duration:.9, ease:'expo.out', scrollTrigger:{trigger:el, start:'top 88%'}, onUpdate:() => el.textContent = o.v.toFixed(1).replace('.', ',')});
});
/* Entrada del hero */
/* Entrada del hero: corta y sin rebote; los chips aparecen desde su propio punto, sin "back.out" */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('#tarjeta', {y:40, rotateY:-12, opacity:0, duration:.8, ease:'expo.out', delay:.12, clearProps:'opacity'});
gsap.from('.chip-flota', {scale:.9, opacity:0, duration:.35, ease:'power3.out', stagger:.08, delay:.45});
/* Parallax al salir del hero */
gsap.to('#heroTxt', {yPercent:-25, opacity:.25, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
gsap.to('#heroVis', {y:90, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Monitor: se fija en escritorio (más corto que el original) mientras las barras suben y la curva se dibuja */
const largo = curva.getTotalLength ? curva.getTotalLength() : 1200;
gsap.set(curva, {strokeDasharray:largo, strokeDashoffset:largo});
const fijar = escritorio.matches;
/* En el celular ya no va atado al scroll: se reproduce una vez al entrar (antes quedaba vacío si se subía rápido) */
gsap.timeline(fijar ? {scrollTrigger:{trigger:'#monitor', start:'center center', end:'+=600', scrub:.6, pin:'.monitor-sec'}} : {scrollTrigger:{trigger:'#monitor', start:'top 80%', once:true}, defaults:{ease:'power3.out'}})
.from('#monitor', {scale:.96, duration:.4, ease:fijar ? 'none' : 'expo.out'}, 0)
.from('.mon-kpis > div', {y:30, opacity:0, stagger:.06, duration:.3}, .1)
.from('#uptime i', {scaleY:0, stagger:.006, duration:.25, ease:'power2.out'}, .2)
.to(curva, {strokeDashoffset:0, duration:.8, ease:'none'}, .35)
.from(area, {opacity:0, duration:.4}, .7);
/* Bento y ticket */
gsap.from('.velo i', {scaleX:0, duration:.8, ease:'expo.out', stagger:.05, scrollTrigger:{trigger:'.velo', start:'top 85%'}});
/* Burbujas del ticket: entran con scale(.96) desde su esquina (cliente a la derecha, Rednet a la izquierda) */
gsap.from('.ticket .t-msg.cli', {y:10, scale:.96, opacity:0, transformOrigin:'100% 100%', duration:.3, ease:'power3.out', scrollTrigger:{trigger:'.ticket', start:'top 75%'}});
gsap.from('.ticket .t-msg.rn', {y:10, scale:.96, opacity:0, transformOrigin:'0% 100%', duration:.3, ease:'power3.out', delay:.45, scrollTrigger:{trigger:'.ticket', start:'top 75%'}});
})();
