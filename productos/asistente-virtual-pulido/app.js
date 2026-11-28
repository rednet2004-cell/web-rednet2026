/* Asistente Virtual Rednet · asistente-virtual-pulido (ruta rednet-design-1: impeccable → motion → pulido) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
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
const cerrarMenu = () => { navP.classList.remove('abierto'); document.body.classList.remove('menu-abierto'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
menuBtn.addEventListener('click', () => {
const ab = !navP.classList.contains('abierto');
navP.classList.toggle('abierto', ab); document.body.classList.toggle('menu-abierto', ab); menuBtn.setAttribute('aria-expanded', ab); document.body.style.overflow = ab ? 'hidden' : '';
if (ab) navP.querySelector('a').focus();
});
navP.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
addEventListener('keydown', e => { if (e.key === 'Escape' && navP.classList.contains('abierto')){ cerrarMenu(); menuBtn.focus(); } });

/* Íconos SVG para los avisos del chat (antes eran caracteres ✓ y →) */
const ICO = {
ok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>',
ir:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};
const burbuja = ([t, s, ico]) => {
const d = document.createElement('div'); d.className = 'm ' + t;
if (t === 'ok'){ d.innerHTML = ICO[ico || 'ok']; d.append(s); } else d.textContent = s;
return d;
};
/* Entrada de burbuja: scale(.96) desde su esquina (cliente a la derecha, asistente a la izquierda) */
const entra = (d, delay = 0) => { if (hasG && !reduce) gsap.from(d, {y:8, scale:.96, opacity:0, duration:.3, delay, ease:'power3.out'}); };

/* Conversaciones de ejemplo por canal */
const guiones = {
wsp:{canal:'Asistente IA · WhatsApp', msgs:[['cli','Hola, ¿abren el sábado?'],['bot','¡Hola! Sí, el sábado abrimos de 10:00 a 14:00. ¿Quieres que te reserve una hora?'],['cli','Sí, a las 11, porfa'],['bot','Listo, quedaste agendado el sábado a las 11:00. Te mandé la confirmación por aquí mismo.'],['ok','Reserva creada · 6 s']]},
tg:{canal:'Asistente IA · Telegram', msgs:[['cli','¿Qué necesito para legalizar una firma?'],['bot','Hola. Necesitas tu cédula vigente y el documento sin firmar; la firma se hace aquí, frente al notario. Atendemos de lunes a viernes de [9:00 a 14:00].'],['cli','¿Hay que pedir hora?'],['bot','No, es por orden de llegada. Si quieres, te dejo la dirección y el valor del trámite.'],['ok','Consulta resuelta · 5 s']]},
tel:{canal:'Asistente IA · Llamada', msgs:[['cli','Aló, quería saber si atienden hoy en la tarde.'],['bot','Hola, sí, hoy atendemos hasta las 19:00. ¿Te agendo una hora?'],['cli','Ya, a las cinco.'],['bot','Listo, quedaste a las 17:00. Te llega un SMS con la confirmación.'],['ok','Hora agendada por voz']]}
};
const tel = document.getElementById('telefono'), telMsgs = document.getElementById('telMsgs'), telCanal = document.getElementById('telCanal');
const onda = document.getElementById('telOnda'), repetir = document.getElementById('repetir');
for (let i = 0; i < 24; i++){ const b = document.createElement('i'); b.style.animationDelay = (i * .07 % 1).toFixed(2) + 's'; onda.appendChild(b); }
let corrida = 0, canalAct = 'wsp';
/* La conversación se reproduce una vez (no queda en bucle) y deja un botón para verla de nuevo */
function pintar(guion){
const id = ++corrida; telMsgs.innerHTML = ''; repetir.hidden = true;
if (reduce){ guion.forEach(g => telMsgs.appendChild(burbuja(g))); repetir.hidden = false; return; }
tel.classList.add('hablando');
let i = 0;
(function sig(){
if (id !== corrida) return;
if (i >= guion.length){ tel.classList.remove('hablando'); repetir.hidden = false; return; }
const g = guion[i++];
let esc = null;
if (g[0] === 'bot'){ esc = document.createElement('div'); esc.className = 'm esc'; esc.setAttribute('aria-hidden', 'true'); esc.innerHTML = '<i></i><i></i><i></i>'; telMsgs.appendChild(esc); entra(esc); }
setTimeout(() => {
if (id !== corrida) return;
esc && esc.remove();
const d = burbuja(g); telMsgs.appendChild(d); entra(d);
setTimeout(sig, 700);
}, g[0] === 'bot' ? 1100 : 400);
})();
}
function canal(c){
canalAct = c;
document.querySelectorAll('.canales button').forEach(b => b.setAttribute('aria-pressed', b.dataset.c === c));
tel.dataset.c = c; telCanal.textContent = guiones[c].canal;
pintar(guiones[c].msgs);
}
document.querySelectorAll('.canales button').forEach(b => b.addEventListener('click', () => canal(b.dataset.c)));
repetir.addEventListener('click', () => canal(canalAct));
canal('wsp');

/* Historia: cada paso muestra una conversación distinta en el teléfono fijo */
const pasosChat = [
[['cli','23:40 · ¿Todavía atienden?'],['bot','¡Hola! Ahora estamos cerrados, pero te ayudo yo. ¿Qué necesitas?']],
[['cli','¿Cuánto sale una limpieza dental?'],['bot','La limpieza sale $[—] y dura unos 40 minutos. Si quieres, te dejo una hora tomada para mañana.']],
[['cli','Mañana a las 10'],['bot','Listo, quedaste mañana a las 10:00.'],['ok','Reserva creada en tu calendario']],
[['cli','Quiero hacer un reclamo por un cobro'],['bot','Entiendo. Te paso con una persona del equipo para revisarlo contigo.'],['ok','Derivado a tu equipo con el contexto','ir']]
];
const histMsgs = document.getElementById('histMsgs'), hps = [...document.querySelectorAll('.hp')], barras = [...document.querySelectorAll('.hist-prog i')];
let pasoAct = -1;
function paso(i){
if (i === pasoAct) return; pasoAct = i;
hps.forEach((h, k) => h.classList.toggle('on', k === i)); barras.forEach((b, k) => b.classList.toggle('on', k === i));
if (hasG) gsap.killTweensOf(histMsgs.children);
histMsgs.innerHTML = '';
pasosChat[i].forEach((g, k) => { const d = burbuja(g); histMsgs.appendChild(d); entra(d, k * .2); });
}
paso(0);
const io = new IntersectionObserver(en => en.forEach(e => { if (e.isIntersecting) paso(+e.target.dataset.paso); }), {rootMargin:'-45% 0px -45% 0px'});
hps.forEach(h => io.observe(h));

/* Anillo de 24 horas */
const C = 2 * Math.PI * 100, arcoTu = document.getElementById('arcoTu'), arcoIA = document.getElementById('arcoIA');
const g24 = document.getElementById('horas24');
[0, 6, 12, 18].forEach(h => { const a = h / 24 * 2 * Math.PI, t = document.createElementNS('http://www.w3.org/2000/svg', 'text'); t.setAttribute('x', 120 + 74 * Math.sin(a)); t.setAttribute('y', 123 - 74 * Math.cos(a)); t.textContent = String(h).padStart(2, '0') + ':00'; g24.appendChild(t); });
const TU0 = 9 / 24, TU1 = 18 / 24;   // horario del negocio [por confirmar]
arcoTu.setAttribute('stroke-dasharray', `${C * (TU1 - TU0)} ${C}`); arcoTu.setAttribute('stroke-dashoffset', -C * TU0);
arcoIA.setAttribute('stroke-dasharray', `${C} ${C}`);
const horasIA = document.getElementById('horasIA');
const ponerDial = p => { arcoIA.setAttribute('stroke-dashoffset', C * (1 - p)); horasIA.textContent = Math.round(p * 24); };
ponerDial(1);

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
/* Video del asistente: no arranca solo; se reproduce al pulsar "Ver video". Se pausa al salir de pantalla */
const vA = document.getElementById('vAsist'), vAs = document.getElementById('vAsistSonido'), vAp = document.getElementById('vAsistPausa'), vAver = document.getElementById('vAsistVer'), vActl = document.querySelector('.video-ctl');
let vApausado = false, vAvisible = true, vAini = false;
function vAestado(){
  if (!vAini) return;
  if (vAvisible && !vApausado) vA.play().catch(() => {}); else vA.pause();
  vAp.setAttribute('aria-pressed', vApausado);
  vAp.querySelector('span').textContent = vApausado ? 'Reproducir animación' : 'Pausar animación';
}
function vAsonido(){
  vAs.setAttribute('aria-pressed', !vA.muted);
  vAs.querySelector('span').textContent = vA.muted ? 'Activar sonido' : 'Silenciar';
}
vAver.addEventListener('click', () => {
  vAini = true; vApausado = false; vA.muted = false; vA.preload = 'auto';
  if (vA.ended) vA.currentTime = 0;
  vAver.hidden = true; vActl.hidden = false; vAsonido(); vAestado();
});
vA.addEventListener('ended', () => { vAini = false; vAver.querySelector('span').textContent = 'Ver de nuevo'; vAver.hidden = false; vActl.hidden = true; });
vAp.addEventListener('click', () => { vApausado = !vApausado; vAestado(); });
vAs.addEventListener('click', () => { vA.muted = !vA.muted; vAsonido(); });
new IntersectionObserver(([en]) => { vAvisible = en.isIntersecting; vAestado(); }, {threshold:.25}).observe(vA);

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
/* Entradas en grupo: cortas (24 px, .55 s, stagger 55 ms) */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Entrada del hero: corta y sin rebote */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('#telefono', {y:120, duration:.9, ease:'expo.out', delay:.12});
gsap.from('.flota', {scale:.9, opacity:0, duration:.35, ease:'power3.out', stagger:.08, delay:.5});
/* Parallax al salir del hero */
gsap.to('#heroTxt', {yPercent:-20, opacity:.3, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
gsap.to('.flota.f1', {y:-80, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
gsap.to('.flota.f2', {y:-140, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Anillo: se completa con el scroll */
ponerDial(0);
const o = {p:0};
gsap.to(o, {p:1, ease:'none', onUpdate:() => ponerDial(o.p), scrollTrigger:{trigger:'.dia', start:'top 70%', end:'center 45%', scrub:.6}});
gsap.from(arcoTu, {opacity:0, duration:.5, ease:'power3.out', scrollTrigger:{trigger:'.dia', start:'top 70%'}});
/* Resumen del día: las filas entran escalonadas */
gsap.from('.nc-lista li', {y:12, opacity:0, duration:.35, ease:'power3.out', stagger:.06, scrollTrigger:{trigger:'.nota-cel', start:'top 80%'}});
})();
