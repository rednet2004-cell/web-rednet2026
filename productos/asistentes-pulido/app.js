/* Asistentes Virtuales Rednet · asistentes-pulido (ruta rednet-design-1 completa: impeccable → motion → pulido) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');
const espera = ms => new Promise(r => setTimeout(r, ms));
const dosD = v => String(v).padStart(2, '0');
const hora = min => { min = Math.round(min) % 1440; return dosD(Math.floor(min / 60)) + ':' + dosD(min % 60); };

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

/* 1 Vitrina: el reloj corre de 17:00 a 02:00 y a las 20:00 el letrero pasa a "Cerrado".
   Un mensaje nuevo cada 5,2 s. Botón de pausa; el bucle se detiene fuera de pantalla. */
const vit = document.getElementById('vitrina'), reloj = document.getElementById('reloj'), astro = vit.querySelector('.astro'), flujo = document.getElementById('flujo'), pausa = document.getElementById('pausa');
const charlas = [
['Chat de la tienda', '¿Tienen la talla M en negro?', '¡Sí! Quedan [—]. ¿Te la dejo en el carrito?'],
['WhatsApp', '¿Cuánto demora el despacho a Concepción?', 'Llega en [—] días hábiles y cuesta $[—]. ¿Lo agrego a tu pedido?'],
['Chat de la tienda', 'Busco una mochila para notebook, de menos de $40.000', 'Tengo dos: [Mochila A] a $[—] y [Mochila B] a $[—]. ¿Te muestro las dos?'],
['Chat de la tienda', '¿Cabe un sofá de 2 m en mi living?', 'El [Sofá Lino] mide [—] cm de ancho. ¿Te paso los colores disponibles?'],
['WhatsApp', '¿Puedo pagar con transferencia?', '¡Sí! Al pagar eliges transferencia y te llegan los datos.']
];
function cielo(min){
const u = (min - 1020) / 540;
vit.style.setProperty('--n', Math.max(0, Math.min(1, (min - 1140) / 120)).toFixed(3));
vit.classList.toggle('noche', min >= 1200);
reloj.textContent = hora(min);
astro.style.left = (38 + u * 44) + '%'; astro.style.top = (min < 1200 ? 18 + u * 110 : 22) + '%';
}
function burbuja(cls, txt, label){ const d = document.createElement('div'); d.className = 'm ' + cls; const s = document.createElement('small'); s.textContent = label; d.append(s, txt); flujo.append(d); while (flujo.children.length > 4) flujo.firstChild.remove(); }
const CICLO = 5200, DIA = 22000;
let t = 0, ult = 0, raf = 0, visible = true, pausado = reduce, paso = -1;
function frame(now){
if (ult) t += now - ult; ult = now;
cielo(1020 + (t % DIA) / DIA * 540);
const k = Math.floor(t / CICLO), fase = t % CICLO;
if (k !== paso && fase >= 0){ paso = k; const [c, q] = charlas[k % charlas.length]; burbuja('c', q, 'Cliente · ' + c); }
if (fase >= 1200 && !flujo.lastChild.classList.contains('a')){ const [, , a] = charlas[k % charlas.length]; burbuja('a', a, 'Asistente · al instante'); }
raf = requestAnimationFrame(frame);
}
function correr(){ cancelAnimationFrame(raf); ult = 0; if (visible && !pausado) raf = requestAnimationFrame(frame); }
cielo(reduce ? 1394 : 1020);
if (reduce){ burbuja('c', charlas[0][1], 'Cliente · ' + charlas[0][0]); burbuja('a', charlas[0][2], 'Asistente · al instante'); }
const icoPausa = '<path d="M9 6v12M15 6v12"/>', icoPlay = '<path d="M8 5.5v13l11-6.5z"/>';
const marcar = () => { pausa.querySelector('span').textContent = pausado ? 'Reproducir' : 'Pausar'; pausa.querySelector('svg').innerHTML = pausado ? icoPlay : icoPausa; pausa.setAttribute('aria-pressed', pausado); };
marcar();
pausa.addEventListener('click', () => { pausado = !pausado; marcar(); correr(); });
new IntersectionObserver(([en]) => { visible = en.isIntersecting; correr(); }).observe(vit);

/* 2 Pruébalo: rubro × tono × canal */
const rubros = [
{n:'[Tu tienda de muebles]', q:'Busco un sofá de 3 cuerpos, de menos de $400.000. ¿Cuánto demora a Concepción?', r:['¡Hola! Tengo dos: [Sofá Lino] a $[—] y [Sofá Nube] a $[—], los dos en stock. A Concepción llegan en [—] días hábiles. ¿Te dejo uno en el carrito?', 'Buenas noches. Le sugiero dos modelos: [Sofá Lino] a $[—] y [Sofá Nube] a $[—], ambos disponibles. El despacho a Concepción toma [—] días hábiles. ¿Desea que agregue alguno al carrito?', '¡Hola! Tu living va a quedar feliz 🛋️ Tengo [Sofá Lino] a $[—] y [Sofá Nube] a $[—], con stock. A Concepción, [—] días hábiles. ¿Cuál te guardo?']},
{n:'[Tu tienda de belleza]', q:'¿Qué sérum me recomiendan para piel grasa? Tengo $20.000.', r:['¡Hola! Para piel grasa tengo [Sérum A] a $[—] y [Sérum B] a $[—], los dos dentro de tu presupuesto. ¿Te dejo uno en el carrito?', 'Buenas noches. Para piel grasa le sugiero [Sérum A] a $[—] o [Sérum B] a $[—], ambos dentro de su presupuesto. ¿Desea agregar alguno al carrito?', '¡Hola! Piel grasa, misión aceptada ✨ [Sérum A] a $[—] o [Sérum B] a $[—]. ¿Cuál te guardo?']},
{n:'[Tu ferretería online]', q:'¿Tienen taladro percutor y hacen despacho?', r:['¡Hola! Sí, tengo [Taladro A] a $[—] y [Taladro B] a $[—], con stock. Despachamos a [tu comuna] en [—] días. ¿Te dejo uno en el carrito?', 'Buenas noches. Contamos con [Taladro A] a $[—] y [Taladro B] a $[—], ambos disponibles, con despacho a [tu comuna] en [—] días. ¿Desea agregar alguno al carrito?', '¡Hola! Sí, y con harta potencia 🔩 [Taladro A] a $[—] o [Taladro B] a $[—]. Llegan en [—] días. ¿Cuál te guardo?']},
{n:'[Tu tienda de ropa]', q:'¿Tienen el polerón gris en talla M? ¿Y si no me queda?', r:['¡Hola! Sí, quedan [—] en talla M. Si no te queda, tienes [—] días para cambiarlo. ¿Te lo dejo en el carrito?', 'Buenas noches. Sí, contamos con [—] unidades en talla M. El plazo de cambio es de [—] días. ¿Desea que lo agregue al carrito?', '¡Hola! Talla M, presente 🙌 Quedan [—] y tienes [—] días para cambiarlo. ¿Te lo guardo?']}
];
const est = {r:0, t:0, c:'wa'};
const tel = document.getElementById('tel'), telChat = document.getElementById('telChat'), trans = document.getElementById('trans'), pie = document.getElementById('telPie'), onda = document.getElementById('onda');
for (let i = 0; i < 26; i++){ const b = document.createElement('i'); b.style.animationDelay = (-Math.random()).toFixed(2) + 's'; b.style.animationDuration = (.5 + Math.random() * .7).toFixed(2) + 's'; onda.append(b); }
/* La onda solo se mueve mientras el teléfono está en pantalla */
new IntersectionObserver(([en]) => tel.classList.toggle('viva', en.isIntersecting && !reduce)).observe(tel);
let pid = 0, probado = false;
async function probar(){
probado = true;
const id = ++pid, R = rubros[est.r], resp = R.r[est.t], lenta = reduce ? 0 : 1;
tel.dataset.c = est.c;
document.getElementById('telNom').textContent = R.n;
document.getElementById('telEst').textContent = est.c === 'wa' ? 'chat de la tienda · 23:41' : 'WhatsApp · 23:41';
pie.classList.remove('on'); telChat.textContent = ''; trans.textContent = '';
if (est.c === 'll'){
const p1 = document.createElement('p'), p2 = document.createElement('p'), b1 = document.createElement('b'), b2 = document.createElement('b');
b1.textContent = 'Cliente'; b2.textContent = 'Asistente';
p1.append(b1, R.q); p2.append(b2, resp.replace(/\s*\p{Extended_Pictographic}️?/gu, '.'));
trans.append(p1, p2);
await espera(200 * lenta); if (id !== pid) return; p1.classList.add('on');
await espera(1400 * lenta); if (id !== pid) return; p2.classList.add('on');
} else {
const add = (cls, txt) => { const d = document.createElement('div'); d.className = 'm ' + cls; d.textContent = txt; telChat.append(d); if (lenta && hasG) gsap.from(d, {scale:.96, opacity:0, duration:.25, ease:'power3.out', overwrite:true}); return d; };
add('c', R.q);
if (lenta){ await espera(500); if (id !== pid) return; const esc = add('a esc', '• • •'); esc.setAttribute('aria-label', 'Escribiendo'); await espera(900); esc.remove(); if (id !== pid) return; }
add('a', resp);
}
await espera(300 * lenta); if (id === pid) pie.classList.add('on');
}
function chips(idG, clave, val){
const bs = [...document.querySelectorAll('#' + idG + ' button')];
bs.forEach((b, i) => b.addEventListener('click', () => { bs.forEach(x => x.setAttribute('aria-pressed', x === b)); est[clave] = val(b, i); probar(); }));
}
chips('cRubro', 'r', (b, i) => i); chips('cTono', 't', (b, i) => i); chips('cCanal', 'c', b => b.dataset.c);
new IntersectionObserver((ens, ob) => { if (ens[0].isIntersecting){ ob.disconnect(); if (!probado) probar(); } }, {rootMargin:'0px 0px -20% 0px'}).observe(tel);

/* 3 Carrera de la respuesta */
const carr = document.getElementById('carrera'), evs = [...carr.querySelectorAll('.ev')], cab = document.getElementById('cabezal'), horaG = document.getElementById('horaG');
carr.querySelectorAll('.linea').forEach(l => [...l.children].forEach((e, i) => { e.style.left = `calc(${+e.dataset.t} * (100% - min(240px, 24vw)))`; e.style.top = (10 + (i % 3) * 78) + 'px'; }));
function carrera(p){
const lin = carr.querySelector('.linea'), w = lin.offsetWidth - Math.min(240, innerWidth * .24);
cab.style.transform = `translateX(${p * w}px)`;
evs.forEach(e => e.classList.toggle('on', p >= +e.dataset.t - .001));
horaG.textContent = hora(1394 + p * 616);
}

/* 4 Pasos: fila nativa; los botones avanzan una tarjeta */
const pasos = document.getElementById('pasos'), pAnt = document.getElementById('pAnt'), pSig = document.getElementById('pSig');
const ancho = () => pasos.querySelector('.pa').offsetWidth + 14;
pAnt.addEventListener('click', () => pasos.scrollBy({left:-ancho(), behavior:reduce ? 'auto' : 'smooth'}));
pSig.addEventListener('click', () => pasos.scrollBy({left:ancho(), behavior:reduce ? 'auto' : 'smooth'}));
const bordes = () => { pAnt.disabled = pasos.scrollLeft < 4; pSig.disabled = pasos.scrollLeft > pasos.scrollWidth - pasos.clientWidth - 4; };
pasos.addEventListener('scroll', bordes, {passive:true}); addEventListener('resize', bordes); bordes();

/* 5 Toggle sin asistente / con Rednet */
const toggle = document.querySelector('.toggle'), met = document.getElementById('met');
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
toggle.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
const m = b.dataset.m; toggle.dataset.m = m;
met.querySelectorAll(':scope > div').forEach(d => { const v = d.querySelector('b'); v.textContent = m === 'antes' ? v.dataset.a : v.dataset.c; d.querySelector('.barra i').style.transform = 'scaleX(' + parseFloat(m === 'antes' ? d.dataset.wa : d.dataset.wc) / 100 + ')'; });
}));

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

if (!hasG || reduce){ carrera(1); return; }
/* Entradas */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('.vitrina-caja', {y:24, opacity:0, duration:.6, ease:'power3.out', delay:.15});
gsap.from('#tel', {y:24, opacity:0, duration:.6, ease:'power3.out', scrollTrigger:{trigger:'#tel', start:'top 90%'}});
gsap.from('.pa', {x:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:'#pasos', start:'top 85%'}});
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { carrera(0); ScrollTrigger.create({trigger:carr, start:'top top', end:'bottom bottom', onUpdate:s => carrera(s.progress)}); });
mm.add('(max-width:860px)', () => { evs.forEach(e => e.classList.add('on')); horaG.textContent = '09:30'; });
})();

/* Video: no arranca solo; se reproduce (con sonido) al pulsar "Ver video". Se pausa al salir de pantalla */
(function(){
const v = document.getElementById('vVen'); if (!v) return;
const bP = document.getElementById('vVenPausa'), bS = document.getElementById('vVenSonido'), bV = document.getElementById('vVenVer'), ctl = v.parentNode.querySelector('.video-ctl');
let pausado = false, visible = true, ini = false;
const sonido = () => { bS.setAttribute('aria-pressed', !v.muted); bS.querySelector('span').textContent = v.muted ? 'Activar sonido' : 'Silenciar'; };
const estado = () => {
  if (!ini) return;
  if (visible && !pausado) v.play().catch(() => {}); else v.pause();
  bP.setAttribute('aria-pressed', pausado);
  bP.querySelector('span').textContent = pausado ? 'Reproducir animación' : 'Pausar animación';
};
bV.addEventListener('click', () => {
  ini = true; pausado = false; v.muted = false; v.preload = 'auto';
  if (v.ended) v.currentTime = 0;
  bV.hidden = true; ctl.hidden = false; sonido(); estado();
});
v.addEventListener('ended', () => { ini = false; bV.querySelector('span').textContent = 'Ver de nuevo'; bV.hidden = false; ctl.hidden = true; });
bP.addEventListener('click', () => { pausado = !pausado; estado(); });
bS.addEventListener('click', () => { v.muted = !v.muted; sonido(); });
new IntersectionObserver(([en]) => { visible = en.isIntersecting; estado(); }, {threshold:.25}).observe(v);
})();
