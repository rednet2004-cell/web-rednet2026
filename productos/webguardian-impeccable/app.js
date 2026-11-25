/* WebGuardian · webguardian-impeccable (ruta rednet-design-1, paso 2) */
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
const cerrarMenu = () => { navP.classList.remove('abierto'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
menuBtn.addEventListener('click', () => {
const ab = !navP.classList.contains('abierto');
navP.classList.toggle('abierto', ab); menuBtn.setAttribute('aria-expanded', ab); document.body.style.overflow = ab ? 'hidden' : '';
if (ab) navP.querySelector('a').focus();
});
navP.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
addEventListener('keydown', e => { if (e.key === 'Escape' && navP.classList.contains('abierto')){ cerrarMenu(); menuBtn.focus(); } });

/* Radar: el chip cambia cada 5 s (antes 2 s), con botón de pausa; todo se detiene fuera de pantalla */
const radar = document.getElementById('radar'), radarTxt = document.getElementById('radarTxt'), pausa = document.getElementById('radarPausa');
const msgs = ['Todo en orden', 'Intento bloqueado', 'Revisión completa', 'Plugin actualizado'];
let k = 0, timer = 0, pausado = reduce, visible = true;
function cambiarChip(){ radarTxt.textContent = msgs[k = (k + 1) % msgs.length]; }
function estadoRadar(){
const corre = !pausado && visible;
radar.classList.toggle('quieto', !corre);
clearInterval(timer);
if (corre) timer = setInterval(cambiarChip, 5000);
}
pausa.addEventListener('click', () => {
pausado = !pausado;
pausa.setAttribute('aria-pressed', pausado);
pausa.querySelector('span').textContent = pausado ? 'Reanudar animación' : 'Pausar animación';
estadoRadar();
});
if (reduce){ pausa.setAttribute('aria-pressed', 'true'); pausa.querySelector('span').textContent = 'Reanudar animación'; }
new IntersectionObserver(([en]) => { visible = en.isIntersecting; estadoRadar(); }).observe(radar);

/* Noche de guardia: eventos de ejemplo entre 22:00 y 07:00 (minutos desde las 22:00) */
const eventos = [
[8, 'ok', 'Revisión', 'Sitio en línea · respuesta normal'],
[47, 'bloq', 'Bloqueado', 'Intento de acceso a /wp-admin desde una IP desconocida'],
[95, 'act', 'Actualizado', 'Plugin de formularios a la última versión'],
[130, 'bloq', 'Bloqueado', '12 intentos de contraseña seguidos'],
[188, 'ok', 'Revisión', 'Escaneo de malware: limpio'],
[236, 'bloq', 'Bloqueado', 'Tráfico sospechoso desde una red de bots'],
[290, 'act', 'Actualizado', 'WordPress a la versión de seguridad'],
[330, 'ok', 'Respaldo', 'Copia diaria guardada'],
[388, 'bloq', 'Bloqueado', 'Intento de subir un archivo malicioso'],
[452, 'act', 'Actualizado', 'Tema y 2 plugins revisados y actualizados'],
[505, 'ok', 'Revisión', 'Todo en orden · informe listo para la mañana'],
[535, 'ok', 'Revisión', 'Sitio en línea · 07:00']
];
const lista = document.getElementById('regLista'), horaG = document.getElementById('horaG');
const cB = document.getElementById('cBloq'), cA = document.getElementById('cAct'), cR = document.getElementById('cRev');
const hhmm = m => { const t = (22 * 60 + m) % 1440; return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); };
let mostrados = 0;
function noche(p){
const m = Math.round(p * 540);
horaG.textContent = hhmm(m);
const n = eventos.filter(e => e[0] <= m).length;
if (n < mostrados){ lista.innerHTML = ''; mostrados = 0; }
for (; mostrados < n; mostrados++){
const [t, tipo, etq, txt] = eventos[mostrados];
const li = document.createElement('li');
li.innerHTML = `<time>${hhmm(t)}</time><span class="tag ${tipo}">${etq}</span><span></span>`;
li.lastChild.textContent = txt;
lista.appendChild(li);
}
const vis = eventos.slice(0, n);
cB.textContent = vis.filter(e => e[1] === 'bloq').length;
cA.textContent = vis.filter(e => e[1] === 'act').length;
cR.textContent = vis.filter(e => e[1] === 'ok').length;
}
noche(reduce || !hasG ? 1 : 0);

/* Escudo de capas */
const caps = [...document.querySelectorAll('.cap')], lis = [...document.querySelectorAll('#listaCapas li')];
const largos = caps.map(c => 2 * Math.PI * c.r.baseVal.value);
function capas(p){
caps.forEach((c, i) => {
const k = Math.min(1, Math.max(0, p * caps.length - i));
c.style.strokeDasharray = largos[i]; c.style.strokeDashoffset = largos[i] * (1 - k);
c.classList.toggle('on', k > 0);
lis[i].classList.toggle('on', k > 0);
});
}
capas(reduce || !hasG ? 1 : 0);

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
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('#radar', {scale:.7, opacity:0, duration:1.3, ease:'power3.out', delay:.2});
gsap.to('#heroTxt', {yPercent:-20, opacity:.3, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Noche: fijada en escritorio; en móvil avanza mientras el registro cruza la pantalla */
const o = {p:0};
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => {
gsap.to(o, {p:1, ease:'none', onUpdate:() => noche(o.p), scrollTrigger:{trigger:'.guardia-sec', start:'top top', end:'+=' + innerHeight * 2, pin:true, scrub:.5}});
});
mm.add('(max-width:860px)', () => {
gsap.to(o, {p:1, ease:'none', onUpdate:() => noche(o.p), scrollTrigger:{trigger:'.registro', start:'top 85%', end:'bottom 30%', scrub:.5}});
});
/* Capas: se dibujan con el scroll */
const c = {p:0};
gsap.to(c, {p:1, ease:'none', onUpdate:() => capas(c.p), scrollTrigger:{trigger:'#incluye', start:'top 60%', end:'bottom 85%', scrub:1}});
gsap.from('#informe', {y:80, rotate:10, opacity:0, duration:1.1, ease:'power3.out', scrollTrigger:{trigger:'#informe', start:'top 80%'}});
gsap.from('.inf-fila i', {'--w':'0%', duration:1.2, ease:'power3.out', stagger:.1, scrollTrigger:{trigger:'#informe', start:'top 70%'}});
})();
