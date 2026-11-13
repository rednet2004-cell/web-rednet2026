(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger, Draggable);
/* Header */
const hdr = document.getElementById('hdr');
const barraMovil = document.getElementById('barraMovil'), contacto = document.getElementById('contacto');
const onScroll = () => {
hdr.classList.toggle('solido', scrollY > innerHeight * 0.55);
const r = contacto.getBoundingClientRect();
barraMovil.classList.toggle('on', scrollY > innerHeight * 0.8 && r.top > innerHeight);
};
/* Menú móvil */
const menuBtn = document.getElementById('menuBtn'), navP = document.getElementById('navPrincipal');
const cerrarMenu = () => { navP.classList.remove('abierto'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
menuBtn.addEventListener('click', () => {
const ab = !navP.classList.contains('abierto');
navP.classList.toggle('abierto', ab); menuBtn.setAttribute('aria-expanded', ab); document.body.style.overflow = ab ? 'hidden' : '';
if (ab) navP.querySelector('a').focus();
});
navP.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
addEventListener('keydown', e => { if (e.key === 'Escape' && navP.classList.contains('abierto')){ cerrarMenu(); menuBtn.focus(); } });
addEventListener('scroll', onScroll, {passive:true}); onScroll();
/* Utilidades de movimiento (sin depender de GSAP) */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeIO = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const visible = (el, cb) => { const o = {v:true}; new IntersectionObserver(([en]) => { o.v = en.isIntersecting; if (o.v && cb) cb(); }).observe(el); return o; };
/* 1 Carrusel 3D tipo cover flow: avanza de a una tarjeta, se pausa con el mouse,
se arrastra, y las tarjetas se inclinan un poco hacia el lado al que gira el anillo */
const anillo = document.getElementById('anillo'), escena = document.getElementById('escena');
const cards = [...anillo.children], N = cards.length, STEP = 360 / N;
let heroCorre = false;
const enHero = visible(escena, () => { if (!heroCorre){ heroCorre = true; tHero = performance.now(); requestAnimationFrame(frameHero); } });
let R = 0, ang = 0, angPrev = 0, tilt = 0, tw = null, tUlt = performance.now();
let pausado = false, foco = false, hovering = false, dragging = false, moved = false, x0 = 0, lastX = 0, dragVel = 0, cardDown = null;
const grow = cards.map(() => 1), growT = cards.map(() => 1);
function medir(){ const w = innerWidth; R = w < 600 ? Math.max(250, w * .72) : Math.min(660, Math.max(430, w * .37)); }
function girarA(a1, dur, ease){ tw = {a0:ang, a1, t0:performance.now(), d:reduce ? 1 : dur * 1000, ease:ease || easeIO}; }
const masCercano = a => Math.round(a / STEP) * STEP;
function pintarHero(dt){
const v = dt > 0 ? (ang - angPrev) / dt * 1000 : 0;   // grados por segundo
angPrev = ang;
const meta = reduce ? 0 : clamp(v * .15, -15, 15);       // inclinación según la dirección del giro
tilt += (meta - tilt) * Math.min(1, dt / 140);
for (let i = 0; i < N; i++){
grow[i] += (growT[i] - grow[i]) * Math.min(1, dt / 120);
let deg = ((i * STEP + ang) % 360 + 540) % 360 - 180;
const th = deg * Math.PI / 180, cos = Math.cos(th), front = (cos + 1) / 2;
const c = cards[i];
c.style.transform = `translate3d(${(R * Math.sin(th)).toFixed(1)}px,0,${(R * (cos - 1)).toFixed(1)}px) rotateY(${(-deg + tilt).toFixed(2)}deg) scale(${grow[i].toFixed(3)})`;
c.style.opacity = (front > .82 ? 1 : clamp((front - .38) / .44, 0, 1)).toFixed(3);   // opacas al frente: sin transparencias encimadas
c.style.filter = `brightness(${(.5 + .5 * front).toFixed(3)})`;
c.style.zIndex = Math.round(front * 1000);
c.style.pointerEvents = front > .55 ? 'auto' : 'none';
}
}
let tHero = performance.now();
function frameHero(now){
const dt = Math.min(64, now - tHero); tHero = now;
if (tw){
const k = Math.min(1, (now - tw.t0) / tw.d);
ang = tw.a0 + (tw.a1 - tw.a0) * tw.ease(k);
if (k >= 1){ tw = null; tUlt = now; }
} else if (dragging || hovering || foco || pausado || reduce || !enHero.v) tUlt = now;   // en pausa
else if (now - tUlt >= 5000) girarA(masCercano(ang) - STEP, .9);   // avanza una tarjeta cada 5 s
if (enHero.v || tw || dragging){ pintarHero(dt); requestAnimationFrame(frameHero); } else heroCorre = false;   // fuera de pantalla: el bucle se detiene
}
escena.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hovering = true; });
escena.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse'){ hovering = false; growT.fill(1); } });
cards.forEach((c,i) => {
c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && !dragging){ growT.fill(1); growT[i] = 1.09; } });
c.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') growT[i] = 1; });
});
escena.addEventListener('pointerdown', e => {
dragging = true; moved = false; x0 = lastX = e.clientX; dragVel = 0; tw = null;
cardDown = e.target.closest('.tc');
escena.setPointerCapture(e.pointerId);
});
escena.addEventListener('pointermove', e => {
if (!dragging) return;
const dx = e.clientX - lastX; lastX = e.clientX;
if (!moved && Math.abs(e.clientX - x0) > 5){ moved = true; escena.classList.add('arrastra'); growT.fill(1); }
if (moved){ ang += dx * .2; dragVel = dx * .2; }
});
const soltarHero = () => {
if (!dragging) return;
dragging = false; tUlt = performance.now(); escena.classList.remove('arrastra');
if (moved) girarA(masCercano(ang + dragVel * 7), .85, easeOut);
else if (cardDown){                                   // clic en una tarjeta lateral: la trae al frente
const i = cards.indexOf(cardDown), meta = -i * STEP;
girarA(meta + Math.round((ang - meta) / 360) * 360, .95);
}
};
escena.addEventListener('pointerup', soltarHero);
escena.addEventListener('pointercancel', soltarHero);
addEventListener('resize', medir); medir(); pintarHero(0); heroCorre = true; requestAnimationFrame(frameHero);
/* Pausa visible y teclado (WCAG 2.2.2) */
const pausaBtn = document.getElementById('pausaHero');
const fijarPausa = v => { pausado = v; pausaBtn.setAttribute('aria-pressed', v); pausaBtn.querySelector('span').textContent = v ? 'Reanudar' : 'Pausar'; };
if (reduce) fijarPausa(true);
pausaBtn.addEventListener('click', () => fijarPausa(!pausado));
escena.addEventListener('focusin', () => { foco = true; });
escena.addEventListener('focusout', () => { foco = false; });
escena.addEventListener('keydown', e => {
if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
e.preventDefault();
girarA(masCercano(ang) + (e.key === 'ArrowRight' ? -STEP : STEP), .7);
if (!heroCorre){ heroCorre = true; tHero = performance.now(); requestAnimationFrame(frameHero); }
});
const actualizarFrente = () => cards.forEach((c, i) => { let d = ((i * STEP + ang) % 360 + 540) % 360 - 180; c.setAttribute('aria-hidden', Math.abs(d) > STEP / 2); });
setInterval(actualizarFrente, 600); actualizarFrente();
/* 1b Video de fondo: entrada de los anillos una vez, luego loop; se pausa fuera de pantalla */
const heroEl = document.querySelector('.hero'), vIntro = document.getElementById('vIntro'), vLoop = document.getElementById('vLoop');
let vActivo = null;
const mostrarLoop = () => vLoop.classList.add('on');
const sinVideo = reduce || !matchMedia('(min-width:861px)').matches || (navigator.connection && navigator.connection.saveData);
if (sinVideo) mostrarLoop();                                // móvil, ahorro de datos o sin movimiento: queda el póster
else {
vIntro.addEventListener('ended', () => {
vLoop.currentTime = 0;
vLoop.play().then(() => {
vLoop.style.transition = 'none'; mostrarLoop(); vActivo = vLoop;
requestAnimationFrame(() => { vIntro.style.transition = 'none'; vIntro.classList.remove('on'); });
}).catch(mostrarLoop);
});
vIntro.play().then(() => { vIntro.classList.add('on'); vActivo = vIntro; }).catch(mostrarLoop);
new IntersectionObserver(([en]) => { if (vActivo) en.isIntersecting ? vActivo.play().catch(() => {}) : vActivo.pause(); }).observe(heroEl);
}
/* 11 Video de fondo del cierre: solo se reproduce en pantalla, en escritorio y con movimiento permitido */
const vCta = document.getElementById('vCta');
if (!sinVideo) new IntersectionObserver(([en]) => { if (en.isIntersecting){ vCta.preload = 'auto'; vCta.play().catch(() => {}); } else vCta.pause(); }, {rootMargin:'200px'}).observe(vCta);
/* 4 Acordeón */
const pans = [...document.querySelectorAll('.pan')];
const abrir = p => pans.forEach(x => { const on = x === p; x.classList.toggle('on', on); x.querySelector('.pan-t button').setAttribute('aria-expanded', on); x.querySelector('.cont').inert = !on; });
pans.forEach(p => { p.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && abrir(p)); p.querySelector('.pan-t button').addEventListener('click', () => abrir(p)); });
abrir(pans[0]);
/* Ancho final del panel abierto: flex-grow 6.2 frente a 1 de los otros seis, con 8 px entre paneles */
const acord = document.getElementById('acordeon');
const medirAcordeon = () => { const W = acord.clientWidth, g = 8 * (pans.length - 1), fOn = parseFloat(getComputedStyle(document.querySelector('.pan.on')).flexGrow) || 6.2; acord.style.setProperty('--ancho-abierto', ((W - g) * fOn / (fOn + pans.length - 1)) + 'px'); };
addEventListener('resize', medirAcordeon); medirAcordeon();
/* 6 Chat */
const guion = [['cli','Hola, ¿hacen sitios para restaurantes? ¿Cuánto cuesta?'],['bot','¡Hola! Sí, hacemos sitios a medida con carta y reservas. ¿Quieres que te agendemos una llamada de 15 minutos para cotizar?'],['cli','Dale, mañana en la tarde.'],['bot','Listo. Te agendé mañana a las 16:00 y te llegó la confirmación por correo.'],['ok','Reunión agendada en el calendario · 4 s']];
const msgs = document.getElementById('msgs'); let corrida = 0;
function chat(inst){
const id = ++corrida; msgs.innerHTML = '';
if (inst){ guion.forEach(([t,s]) => { const d=document.createElement('div'); d.className='m '+t; d.textContent=s; msgs.appendChild(d); }); return; }
let i = 0;
(function sig(){
if (id !== corrida || i >= guion.length) return;
const [t,s] = guion[i++];
let esc = null;
if (t === 'bot'){ esc = document.createElement('div'); esc.className='m esc'; esc.innerHTML='<i></i><i></i><i></i>'; msgs.appendChild(esc); }
setTimeout(() => {
if (id !== corrida) return;
esc && esc.remove();
const d = document.createElement('div'); d.className='m '+t; d.textContent=s; msgs.appendChild(d);
if (hasG && !reduce) gsap.from(d, {y:10, scale:.96, opacity:0, transformOrigin:t === 'cli' ? '100% 100%' : t === 'bot' ? '0% 100%' : '50% 50%', duration:.3, ease:'power3.out'});
setTimeout(sig, 650);
}, t === 'bot' ? 1100 : 350);
})();
}
chat(true);
document.getElementById('repetir').addEventListener('click', () => chat(reduce));
new IntersectionObserver((en, ob) => { if (en[0].isIntersecting){ chat(reduce); ob.disconnect(); } }, {threshold:.5}).observe(msgs);
/* 6 Toggle métricas */
const anchos = {antes:[1,.02,.24], con:[.04,.7,1]};
document.querySelectorAll('#met .barra i').forEach((b,i) => b.style.transform = `scaleX(${anchos.con[i]})`);
const toggle = document.getElementById('toggle');
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
toggle.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
const m = b.dataset.m; toggle.dataset.m = m;
document.querySelectorAll('#met > div').forEach((d,i) => {
const v = d.querySelector('b'); v.textContent = m === 'antes' ? v.dataset.a : v.dataset.c;
d.querySelector('.barra i').style.transform = `scaleX(${anchos[m][i]})`;
});
}));
/* 7 Proyectos: fila infinita que se gira arrastrando; al soltar sigue con inercia y se acomoda al centro */
const gal = document.getElementById('galeria'), pros = [...gal.children], P = pros.length;
const puntos = document.getElementById('puntos'), contador = document.getElementById('contador');
pros.forEach(() => puntos.appendChild(document.createElement('i')));
let galCorre = false;
const enGal = visible(gal, () => { if (!galCorre){ galCorre = true; tGal = performance.now(); requestAnimationFrame(frameGal); } });
let paso = 0, Lg = 0, off = 0, offPrev = 0, tiltG = 0, twG = null, arrG = false, movG = false, gx0 = 0, gLast = 0, gVel = 0, proDown = null, actG = -1;
function medirGal(){ const w = innerWidth < 600 ? 270 : 360; paso = w + (innerWidth < 600 ? 16 : 26); Lg = paso * P; }
function irOff(o1, dur, ease){ twG = {o0:off, o1, t0:performance.now(), d:reduce ? 1 : dur * 1000, ease:ease || easeIO}; }
const idxG = o => ((Math.round(-o / paso) % P) + P) % P;
function irA(delta){ const base = Math.round(off / paso) * paso; irOff(base - delta * paso, .75); }
function pintarGal(dt){
const v = dt > 0 ? (off - offPrev) / dt * 1000 : 0;   // px por segundo
offPrev = off;
const meta = reduce ? 0 : clamp(v * .009, -12, 12);
tiltG += (meta - tiltG) * Math.min(1, dt / 140);
const half = gal.clientWidth / 2;
for (let i = 0; i < P; i++){
let s = ((i * paso + off) % Lg + Lg) % Lg; if (s > Lg / 2) s -= Lg;
const d = clamp(Math.abs(s) / Math.max(half, 1), 0, 1.6);
const ry = clamp(-s / Math.max(half, 1) * 14, -22, 22) + tiltG;
const el = pros[i];
el.style.transform = `translate3d(${s.toFixed(1)}px,${(d * d * 18).toFixed(1)}px,${(-d * d * 120).toFixed(1)}px) rotateY(${ry.toFixed(2)}deg)`;
el.style.filter = `saturate(${(1 - Math.min(1, d) * .7).toFixed(3)}) brightness(${(1 - Math.min(1, d) * .12).toFixed(3)})`;
el.style.zIndex = 100 - Math.round(d * 50);
}
const a = idxG(off);
if (a !== actG){ actG = a; [...puntos.children].forEach((p,k) => p.classList.toggle('on', k === a)); contador.textContent = String(a + 1).padStart(2,'0') + ' / ' + String(P).padStart(2,'0'); }
}
let tGal = performance.now();
function frameGal(now){
const dt = Math.min(64, now - tGal); tGal = now;
if (twG){ const k = Math.min(1, (now - twG.t0) / twG.d); off = twG.o0 + (twG.o1 - twG.o0) * twG.ease(k); if (k >= 1) twG = null; }
if (enGal.v || twG || arrG){ pintarGal(dt); requestAnimationFrame(frameGal); } else galCorre = false;
}
gal.addEventListener('pointerdown', e => {
arrG = true; movG = false; gx0 = gLast = e.clientX; gVel = 0; twG = null;
proDown = e.target.closest('.pro');
gal.setPointerCapture(e.pointerId);
});
gal.addEventListener('pointermove', e => {
if (!arrG) return;
const dx = e.clientX - gLast; gLast = e.clientX;
if (!movG && Math.abs(e.clientX - gx0) > 5){ movG = true; gal.classList.add('arrastra'); }
if (movG){ off += dx; gVel = dx; }
});
const soltarGal = () => {
if (!arrG) return;
arrG = false; gal.classList.remove('arrastra');
if (movG) irOff(Math.round((off + gVel * 14) / paso) * paso, .9, easeOut);
else if (proDown){                                    // clic en un proyecto lateral: lo trae al centro
const i = pros.indexOf(proDown); let s = ((i * paso + off) % Lg + Lg) % Lg; if (s > Lg / 2) s -= Lg;
if (Math.abs(s) > 4) irOff(off - s, .75);
}
};
gal.addEventListener('pointerup', soltarGal);
gal.addEventListener('pointercancel', soltarGal);
const despertarGal = () => { if (!galCorre){ galCorre = true; tGal = performance.now(); requestAnimationFrame(frameGal); } };
document.getElementById('prev').onclick = () => { irA(-1); despertarGal(); };
document.getElementById('next').onclick = () => { irA(1); despertarGal(); };
addEventListener('resize', () => { const a = idxG(off); medirGal(); off = -a * paso; offPrev = off; });
medirGal(); pintarGal(0); galCorre = true; requestAnimationFrame(frameGal);
/* 8 Reseñas en pila */
const mesa = document.getElementById('mesa'), res = [...mesa.children];
const mesaMovil = matchMedia('(max-width:760px)');
function barajar(anim){
if (mesaMovil.matches) return;
const W = mesa.clientWidth, H = mesa.clientHeight, cw = Math.min(270, W * .78);
res.forEach((r,i) => {
r.style.width = cw + 'px';
const x = W/2 - cw/2 + (Math.random() - .5) * Math.max(0, W - cw) * .85;
const y = 20 + Math.random() * Math.max(0, H - 260);
const rot = (Math.random() - .5) * 16;
if (hasG && anim && !reduce) gsap.to(r, {x, y, rotation:rot, duration:.55, ease:'power3.out', delay:i*.03, overwrite:true});
else if (hasG) gsap.set(r, {x, y, rotation:rot});
else r.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg)`;
});
}
barajar(false);
document.getElementById('barajar').onclick = () => barajar(true);
if (hasG && !mesaMovil.matches){ let z = 10; res.forEach(r => Draggable.create(r, {type:'x,y', bounds:mesa, onPress(){ this.target.style.zIndex = ++z; }})); }
/* 9 Planes y servicios preseleccionan el formulario */
const fQue = document.getElementById('fQue');
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => { fQue.value = a.dataset.plan; setTimeout(() => document.getElementById('fNombre').focus({preventScroll:true}), 600); }));
/* 11 Formulario (maqueta: valida y confirma, no envía) */
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
/* 9 Período */
document.querySelectorAll('.periodo button').forEach(b => b.addEventListener('click', () => {
document.querySelectorAll('.periodo button').forEach(x => x.classList.toggle('on', x === b));
document.querySelectorAll('.per').forEach(p => p.textContent = b.dataset.p === 'mes' ? '/mes' : '/año');
}));
if (!hasG || reduce) return;
/* Hero parallax */
gsap.to('#heroTxt', {yPercent:-30, opacity:.2, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}});
gsap.to('#escena', {y:80, scale:.94, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}});
gsap.to('.hero-video', {yPercent:14, scale:1.06, ease:'none', scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}});
/* 2 Manifiesto palabra por palabra */
const p = document.getElementById('manif');
[...p.childNodes].forEach(n => {
if (n.nodeType !== 3) return;
const frag = document.createDocumentFragment();
n.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()) { frag.append(t); return; } const s = document.createElement('span'); s.className='w'; s.textContent=t; frag.append(s); });
p.replaceChild(frag, n);
});
gsap.fromTo('#manif .w, #manif .ico', {opacity:.18}, {opacity:1, stagger:.08, ease:'none', scrollTrigger:{trigger:p, start:'top 80%', end:'bottom 45%', scrub:true}});
/* 3 Bento */
gsap.from('.rv', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06, scrollTrigger:{trigger:'.bento', start:'top 80%'}});
const c19 = document.querySelector('[data-cuenta]'); const o = {v:0};
gsap.to(o, {v:19, duration:.9, ease:'power3.out', scrollTrigger:{trigger:c19, start:'top 85%'}, onUpdate:() => c19.textContent = Math.round(o.v)});
/* 4 Acordeón: avanza con el scroll en desktop */
/* (v4-impeccable: el acordeón ya no se abre solo con el scroll; lo controla quien lo usa) */
/* 5 Fondo negro */
ScrollTrigger.create({trigger:'.pasos', start:'top 55%', end:'bottom 45%', onToggle:s => document.body.classList.toggle('oscuro', s.isActive)});
/* 5 Columnas: suben a medida que bajas (y bajan si vuelves a subir) */
const tlPasos = gsap.timeline({scrollTrigger:{trigger:'.escalera', start:'top 85%', end:'bottom 45%', scrub:1.2}});
document.querySelectorAll('.paso').forEach((p, i) => {
tlPasos.fromTo(p.querySelector('.col'), {clipPath:'inset(100% 0% 0% 0% round 18px 18px 0px 0px)'}, {clipPath:'inset(0% 0% 0% 0% round 18px 18px 0px 0px)', duration:1, ease:'power1.inOut'}, 0)
.fromTo(p.querySelector('.txt'), {y:26, opacity:0}, {y:0, opacity:1, duration:.4, ease:'power2.out'}, 0);
});
/* 8 Reseñas caen */
if (!mesaMovil.matches) gsap.from(res, {y:-24, opacity:0, scale:.97, duration:.5, ease:'power3.out', stagger:.05, scrollTrigger:{trigger:mesa, start:'top 75%'}});
/* 11 CTA se expande */
gsap.fromTo('#cta', {scale:.96}, {scale:1, ease:'none', scrollTrigger:{trigger:'#cta', start:'top 95%', end:'top 40%', scrub:true}});
})();
