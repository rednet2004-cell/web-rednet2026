/* Apps Móviles Rednet · apps-pulido (ruta rednet-design-1 completa: impeccable → motion → pulido) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');
const espera = ms => new Promise(r => setTimeout(r, ms));

/* Header sobre el hero rojo, barra fija móvil y selector de versiones */
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

/* 1 Hero: la app se arma una sola vez; después llega un pedido cada 6 s.
Botón de pausa visible y el ciclo se detiene fuera de pantalla (WCAG 2.2.2). */
const piezas = [...document.querySelectorAll('#fonoHero .pz')], toast = document.getElementById('fToast'), hPausa = document.getElementById('heroPausa');
let hVisible = true, hPausado = false, hTimer = null;
function cicloAviso(){
clearTimeout(hTimer);
if (hPausado || !hVisible) return;
toast.classList.add('on');
hTimer = setTimeout(() => { toast.classList.remove('on'); hTimer = setTimeout(cicloAviso, 2400); }, 3600);
}
if (reduce){ piezas.forEach(p => p.classList.add('in')); toast.classList.add('on'); }
else {
(async () => { await espera(300); for (const p of piezas){ p.classList.add('in'); await espera(90); } await espera(500); hPausa.hidden = false; cicloAviso(); })();
new IntersectionObserver(([en]) => { hVisible = en.isIntersecting; if (hVisible) cicloAviso(); else clearTimeout(hTimer); }, {threshold:.25}).observe(document.getElementById('plano'));
hPausa.addEventListener('click', () => {
hPausado = !hPausado; hPausa.setAttribute('aria-pressed', hPausado);
hPausa.querySelector('.txt').textContent = hPausado ? 'Seguir avisos' : 'Pausar avisos';
hPausa.querySelector('path').setAttribute('d', hPausado ? 'M8 5l11 7-11 7z' : 'M9 6v12M15 6v12');
if (hPausado){ clearTimeout(hTimer); } else cicloAviso();
});
}

/* 2 Arma tu app */
const rubros = [
{n:'[Tu panadería]', s:'Hola, [Nombre]', cat:'Pan amasado, tortas y empanadas', ped:'Pide hoy y retira a las 18:30', res:'Encarga tu torta con 2 días', pag:'Paga con tarjeta o transferencia', pun:'Llevas [8] de 10 cafés', not:'Pan recién salido a las 7:00', seg:'Tu pedido está en el horno'},
{n:'[Tu gimnasio]', s:'Vamos, [Nombre]', cat:'Planes y clases de la semana', ped:'Compra tu pase en un toque', res:'Reserva tu cupo en spinning', pag:'Renueva tu plan sin filas', pun:'[12] clases este mes', not:'Hoy hay clase extra a las 20:00', seg:'Tu avance del mes'},
{n:'[Tu clínica]', s:'Hola, [Nombre]', cat:'Especialidades y profesionales', ped:'Pide tus exámenes', res:'Toma tu hora en segundos', pag:'Paga tu consulta antes de llegar', pun:'Beneficios para pacientes', not:'Recordatorio: tu hora es mañana', seg:'Tus resultados ya están listos'},
{n:'[Tu tienda]', s:'Hola, [Nombre]', cat:'Lo nuevo de la temporada', ped:'Compra y retira en tienda', res:'Aparta un producto por 24 h', pag:'Paga en cuotas o al contado', pun:'Tienes [1.200] puntos', not:'Llegó tu talla favorita', seg:'Tu pedido va en camino'},
{n:'[Tu empresa de climatización]', s:'Hola, [Técnico]', cat:'Equipos y servicios del cliente', ped:'Orden de trabajo con dirección y hora', res:'Visitas de mantención de la semana', pag:'Cobro al cerrar la visita', pun:'Historial de cada equipo', not:'Nueva orden asignada a ti', seg:'Informe con foto y firma, enviado'}
];
const nombresRubro = ['Panadería', 'Gimnasio', 'Clínica', 'Tienda', 'Climatización'];
/* Íconos SVG fijos (texto propio, no viene del usuario) */
const ICO = {"cat": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"4\" y=\"4\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"13\" y=\"4\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"4\" y=\"13\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"13\" y=\"13\" width=\"7\" height=\"7\" rx=\"1.5\"/></svg>", "ped": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 8h12l-1 12H7L6 8Z\"/><path d=\"M9 8a3 3 0 0 1 6 0\"/></svg>", "res": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"4\" y=\"5\" width=\"16\" height=\"15\" rx=\"2\"/><path d=\"M4 10h16M9 3v4M15 3v4\"/></svg>", "pag": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M3 10h18M7 15h3\"/></svg>", "pun": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6L12 4Z\"/></svg>", "not": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z\"/><path d=\"M10 20a2 2 0 0 0 4 0\"/></svg>", "seg": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z\"/><circle cx=\"12\" cy=\"11\" r=\"2.2\"/></svg>", "ini": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z\"/></svg>", "mas": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 6v12M6 12h12\"/></svg>"};
const mods = {cat:[ICO.cat, 'Catálogo'], ped:[ICO.ped, 'Pedidos'], res:[ICO.res, 'Reservas'], pag:[ICO.pag, 'Pagos'], pun:[ICO.pun, 'Puntos'], not:[ICO.not, 'Avisos'], seg:[ICO.seg, 'Seguimiento']};
const est = {r:0};
const aCards = document.getElementById('aCards'), aTab = document.getElementById('aTab'), aN = document.getElementById('aN'), aCotizar = document.getElementById('aCotizar'), fMsg = document.getElementById('fMsg');
const modBtns = [...document.querySelectorAll('#aMods button')];
const activos = () => modBtns.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.k);
function armar(animar){
const R = rubros[est.r], act = activos();
document.getElementById('aNom').textContent = R.n; document.getElementById('aSub').textContent = R.s;
aN.textContent = act.length;
aCards.innerHTML = ''; aTab.innerHTML = '';
if (!act.length){ const d = document.createElement('div'); d.className = 'ac'; d.innerHTML = '<i aria-hidden="true">' + ICO.mas + '</i><div><b>Elige una función</b><small>Tu app empieza aquí</small></div>'; aCards.append(d); }
act.forEach(k => {
const d = document.createElement('div'); d.className = 'ac';
const i = document.createElement('i'); i.innerHTML = mods[k][0]; i.setAttribute('aria-hidden', 'true');
const t = document.createElement('div'); const b = document.createElement('b'); b.textContent = mods[k][1]; const s = document.createElement('small'); s.textContent = R[k]; t.append(b, s);
d.append(i, t); aCards.append(d);
});
['Inicio', ...act.slice(0, 4).map(k => mods[k][1])].forEach((n, j) => { const s = document.createElement('span'); const i = document.createElement('i'); i.innerHTML = j ? mods[act[j - 1]][0] : ICO.ini; s.append(i, n); aTab.append(s); });
if (animar && hasG && !reduce) gsap.fromTo(aCards.children, {y:12, opacity:0}, {y:0, opacity:1, duration:.3, ease:'power3.out', stagger:.04, overwrite:true});   // interrumpible: se puede tocar rápido
}
modBtns.forEach(b => b.addEventListener('click', () => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); armar(true); }));
const rbs = [...document.querySelectorAll('#aRubro button')];
rbs.forEach((b, i) => b.addEventListener('click', () => { rbs.forEach(x => x.setAttribute('aria-pressed', x === b)); est.r = i; armar(true); }));
armar(false);
/* "Cotiza esta app" deja escrito en el formulario lo que armaste */
aCotizar.addEventListener('click', () => {
const act = activos().map(k => mods[k][1].toLowerCase());
fMsg.value = 'Rubro: ' + nombresRubro[est.r].toLowerCase() + '. Funciones: ' + (act.join(', ') || 'por definir') + '.';
});

/* 3 Etapas: el scroll avanza en escritorio y los botones eligen la etapa en cualquier tamaño */
const fonoEt = document.getElementById('fonoEt'), etBtns = [...document.querySelectorAll('#etLista button')], tiendas = document.getElementById('tiendas'), probadores = document.getElementById('probadores');
function etapa(e){
fonoEt.dataset.e = e;
etBtns.forEach((b, k) => b.setAttribute('aria-pressed', k === e));
tiendas.classList.toggle('on', e === 3); probadores.classList.toggle('on', e === 2);
}
let stEt = null;
etBtns.forEach((b, k) => b.addEventListener('click', () => {
etapa(k);
if (stEt && escritorio.matches) scrollTo({top:stEt.start + (stEt.end - stEt.start) * (k + .5) / 4, behavior:reduce ? 'auto' : 'smooth'});
}));
etapa(0);

/* Video del producto: no arranca solo; se reproduce al pulsar "Ver video" y se pausa al salir de pantalla */
const vA = document.getElementById('vApps'), vAs = document.getElementById('vAppsSonido'), vAver = document.getElementById('vAppsVer'), vAp = document.getElementById('vAppsPausa'), vActl = document.querySelector('.video-ctl');
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
vAs.addEventListener('click', () => { vA.muted = !vA.muted; vAsonido(); });
vAver.addEventListener('click', () => {
vAini = true; vApausado = false; vA.muted = false; vA.preload = 'auto'; vAsonido();
if (vA.ended) vA.currentTime = 0;
vAver.hidden = true; vActl.hidden = false; vAestado();
});
vA.addEventListener('ended', () => { vAini = false; vAver.querySelector('span').textContent = 'Ver de nuevo'; vAver.hidden = false; vActl.hidden = true; });
vAp.addEventListener('click', () => { vApausado = !vApausado; vAestado(); });
new IntersectionObserver(([en]) => { vAvisible = en.isIntersecting; vAestado(); }, {threshold:.25}).observe(vA);

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
const btn = form.querySelector('button[type=submit]');
btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Enviando…';
setTimeout(() => { btn.removeAttribute('aria-busy'); btn.disabled = true; btn.textContent = 'Enviado'; fOk.hidden = false; }, 700);   // maqueta: simula el envío
});

if (!hasG || reduce){ etapa(3); return; }
/* Entrada del hero */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('#fonoHero', {y:60, rotate:-3, opacity:0, duration:.8, ease:'expo.out', delay:.15});
gsap.from('.nota-p', {scale:.9, opacity:0, duration:.4, ease:'power3.out', stagger:.08, delay:.7});
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.fromTo(g.children, {y:24, opacity:0}, {y:0, opacity:1, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Etapas con el scroll en escritorio */
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => {
stEt = ScrollTrigger.create({trigger:'#etapas', start:'top top', end:'bottom bottom', onUpdate:s => etapa(Math.min(3, Math.floor(s.progress * 4)))});
gsap.fromTo('#fonoEt', {rotate:-8, y:30}, {rotate:4, y:-30, ease:'none', scrollTrigger:{trigger:'#etapas', start:'top top', end:'bottom bottom', scrub:true}});
return () => { stEt = null; };
});
/* En móvil el teléfono va bajo la lista: avanza mientras pasa por la pantalla */
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'.et-esc', start:'top 75%', end:'bottom 35%', onUpdate:s => etapa(Math.min(3, Math.floor(s.progress * 4)))}); });
/* Avisos caen en la pantalla de bloqueo */
gsap.from('#blLista .nt', {y:-24, opacity:0, duration:.5, ease:'power3.out', stagger:.12, scrollTrigger:{trigger:'#bloqueo', start:'top 70%'}});
/* Android e iPhone giran hacia ti */
gsap.fromTo('.fono-d.izq', {rotateY:38, x:40}, {rotateY:-8, x:0, ease:'none', scrollTrigger:{trigger:'#dosFonos', start:'top 90%', end:'center 45%', scrub:true}});
gsap.fromTo('.fono-d.der', {rotateY:-38, x:-40}, {rotateY:8, x:0, ease:'none', scrollTrigger:{trigger:'#dosFonos', start:'top 90%', end:'center 45%', scrub:true}});
})();
