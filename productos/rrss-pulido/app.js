/* Publicador RRSS Rednet · rrss-pulido (ruta rednet-design-1, ruta completa: impeccable → motion → pulido) */
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

const tile = (k, txt) => { const d = document.createElement('div'); d.className = 'tp t' + k; const s = document.createElement('span'); s.textContent = txt; d.append(s); return d; };

/* 1 Perfil que se llena solo: un post cada 5 s, con botón de pausa; se detiene fuera de pantalla y con reducir movimiento */
const textos = ['Nuevo', 'Tip del día', 'Hoy abrimos', '¿Sabías que?', 'Detrás de cámara', 'Clientes felices', 'Llegó', 'Receta', 'Finde', 'Encuesta', 'Novedades', 'Equipo'];
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], redes = ['Instagram', 'Facebook', 'LinkedIn', 'TikTok'];
const grid = document.getElementById('pfGrid'), toast = document.getElementById('toast'), toastTxt = document.getElementById('toastTxt'), pfDia = document.getElementById('pfDia');
const perfil = document.getElementById('perfil'), pausa = document.getElementById('pausa'), pausaT = pausa.querySelector('.pausa-t');
for (let i = 0; i < 9; i++) grid.append(tile((i * 3) % 8, textos[(i + 3) % textos.length]));
const cor = document.createElement('div'); cor.className = 'corazones'; cor.setAttribute('aria-hidden', 'true'); perfil.append(cor);
let n = 0, timer = 0, visible = true, pausado = reduce;
function publicar(){
const d = dias[n % 7], r = redes[n % redes.length], t = tile(n % 8, textos[n % textos.length]);
t.classList.add('nuevo'); grid.prepend(t); grid.lastChild.remove();
pfDia.textContent = d + ' · 09:00'; toastTxt.textContent = d + ' · 09:00 · ' + r;
toast.classList.remove('on'); void toast.offsetWidth; toast.classList.add('on');
for (let i = 0; i < 3; i++) setTimeout(() => { const h = document.createElement('i'); h.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>'; h.style.setProperty('--dx', (Math.random() * 50 - 25).toFixed(0) + 'px'); cor.append(h); setTimeout(() => h.remove(), 2000); }, 250 + i * 200);
n++;
}
const correr = () => { clearInterval(timer); if (!pausado && visible) timer = setInterval(publicar, 5000); };
toast.classList.add('on');
pausa.addEventListener('click', () => { pausado = !pausado; pausa.setAttribute('aria-pressed', pausado); pausaT.textContent = pausado ? 'Reanudar' : 'Pausar'; correr(); });
if (reduce){ pausa.setAttribute('aria-pressed', 'true'); pausaT.textContent = 'Reanudar'; }
new IntersectionObserver(([en]) => { visible = en.isIntersecting; correr(); }).observe(perfil);
document.addEventListener('visibilitychange', () => { visible = !document.hidden; correr(); });

/* 2 La semana se arma sola */
const mesa = document.getElementById('mesa'), pila = document.getElementById('pila'), slots = [...document.querySelectorAll('#dias i')], pasosF = [...document.querySelectorAll('#flujoP li')];
const horas = ['09:00', '12:30', '19:00', '09:00', '18:30', '11:00', '10:00'], piezas = ['Nuevo', 'Tip', 'Receta', 'Equipo', 'Finde', 'Encuesta', 'Hola'];
const cards = slots.map((s, k) => { const c = document.createElement('div'); c.className = 'pc'; c.style.zIndex = 10 - k; c.append(tile([0, 2, 1, 3, 4, 6, 5][k], piezas[k])); const em = document.createElement('em'); em.textContent = horas[k]; const u = document.createElement('u'); u.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>'; c.append(em, u); pila.append(c); return c; });
const suave = t => 1 - Math.pow(1 - t, 3);
function semana(p){
const m = mesa.getBoundingClientRect(), pt = parseFloat(getComputedStyle(mesa).paddingTop);
cards.forEach((c, k) => {
const s = slots[k].getBoundingClientRect(), w = s.width, h = s.height;
c.style.width = w + 'px'; c.style.height = h + 'px';
const px = (m.width - w) / 2 + (k - 3) * 7, py = Math.max(44, (pt - h) / 2 + 10) + k * 3, pr = (k - 3) * 5;
const tx = s.left - m.left, ty = s.top - m.top;
const l = suave(clamp((p - (.04 + k * .1)) / .16, 0, 1));
c.style.transform = `translate(${px + (tx - px) * l}px, ${py + (ty - py) * l - Math.sin(l * Math.PI) * 30}px) rotate(${pr * (1 - l)}deg)`;
c.classList.toggle('pub', p > .9 + k * .012);
});
const i = p < .22 ? 0 : p < .5 ? 1 : p < .88 ? 2 : 3;
pasosF.forEach((li, k) => li.classList.toggle('on', k === i));
}

/* 3 Abandonada vs activa */
const p2 = document.getElementById('perfil2'), tg = document.getElementById('tgPerfil'), met = document.getElementById('met');
tg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
const m = b.dataset.m; tg.dataset.m = m; p2.dataset.m = m;
tg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
met.querySelectorAll(':scope > div').forEach(d => { const v = d.querySelector('b'); v.textContent = m === 'antes' ? v.dataset.a : v.dataset.c; d.querySelector('.barra i').style.setProperty('--v', (m === 'antes' ? d.dataset.wa : d.dataset.wc) / 100); });
}));

/* 4 Ideas por rubro */
const ideas = [
[['Reel', 'Instagram', 0, 'De la molienda a tu taza', 'Así nace tu café de la mañana, en 15 segundos ☕', '#café #[tucomuna] #desayuno'], ['Carrusel', 'Instagram', 2, '3 formas de tomar café en verano', 'Frío, con tónica o con helado. ¿Cuál pruebas primero?', '#cafeteria #verano'], ['Historia', 'Instagram', 3, 'Torta del día', 'Encuesta: ¿qué torta hacemos el viernes?', '#hechoenlocal']],
[['Carrusel', 'Facebook', 1, '5 herramientas para tu casa', 'Las que todo hogar debería tener, y para qué sirve cada una.', '#ferretería #hogar'], ['Reel', 'TikTok', 0, 'Cambia una llave de paso', 'Paso a paso en un minuto. Guárdalo para cuando lo necesites.', '#hazlotumismo #[tucomuna]'], ['Historia', 'Instagram', 6, '¿Qué arreglas este finde?', 'Encuesta: pintura, jardín o baño.', '#finde']],
[['Reel', 'Instagram', 4, 'Así es una limpieza facial', 'Lo que pasa en una sesión, sin filtros y paso a paso.', '#estética #cuidadodelapiel'], ['Carrusel', 'Instagram', 5, 'Rutina para el invierno', '4 pasos para que tu piel no sufra con el frío.', '#skincare #[tucomuna]'], ['Historia', 'Instagram', 3, 'Quedan horas el sábado', 'Reserva directo por WhatsApp en un clic.', '#agenda']],
[['Reel', 'TikTok', 7, 'Recorrido: depto 2D', 'Te mostramos cada rincón en 30 segundos.', '#arriendo #[tucomuna]'], ['Carrusel', 'LinkedIn', 1, '5 cosas antes de arrendar', 'La lista que nadie te pasa y que te ahorra problemas.', '#inmobiliaria #consejos'], ['Historia', 'Instagram', 0, 'Visita abierta el sábado', 'De 11:00 a 14:00. Responde esta historia y te guardamos un cupo.', '#visitaabierta']]
];
const posts = document.getElementById('posts');
function rubro(r, animar){
posts.replaceChildren();
ideas[r].forEach(([tipo, red, k, tit, cap, tags]) => {
const a = document.createElement('article'); a.className = 'post';
const tp = document.createElement('div'); tp.className = 'tipo'; const tb = document.createElement('b'); tb.textContent = tipo; const ts = document.createElement('span'); ts.textContent = red; ts.translate = false; tp.append(tb, ts);
const p = document.createElement('p'); p.textContent = cap; const t = document.createElement('p'); t.className = 'tags'; t.textContent = tags;
a.append(tp, tile(k, tit), p, t); posts.append(a);
});
posts.scrollLeft = 0;
if (animar && hasG && !reduce) gsap.fromTo(posts.children, {y:16, opacity:0}, {y:0, opacity:1, duration:.4, ease:'power3.out', stagger:.05, overwrite:true});
}
const rbs = [...document.querySelectorAll('#cRubro button')];
rbs.forEach((b, i) => b.addEventListener('click', () => { rbs.forEach(x => x.setAttribute('aria-pressed', x === b)); rubro(i, true); }));
rubro(0, false);

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

if (!hasG || reduce){ semana(1); addEventListener('resize', () => semana(1)); return; }
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('#perfil', {y:40, opacity:0, duration:.7, ease:'power3.out', delay:.15});
let ult = 0; const pintar = p => { ult = p; semana(p); };
semana(0); addEventListener('resize', () => semana(ult));
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#semTrack', start:'top top', end:'bottom bottom', onUpdate:s => pintar(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#mesa', start:'top 85%', end:'bottom 30%', onUpdate:s => pintar(s.progress)}); });
gsap.from('#perfil2', {y:24, opacity:0, duration:.6, ease:'power3.out', scrollTrigger:{trigger:'#perfil2', start:'top 85%'}});
})();
