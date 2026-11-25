/* Soporte Rednet · soporte-impeccable (rednet-design-1, paso 2) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');

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

/* Hilo rojo: la chispa hace dos viajes de ida y vuelta (menos de 5 s) y se detiene; se repite al volver al hero */
const hilo = document.getElementById('hilo'), chispa = document.getElementById('chispa'), chispaV = document.getElementById('chispaV'), L = hilo.getTotalLength();
const ponerChispa = p => { const pt = hilo.getPointAtLength(L * p); chispa.setAttribute('cx', pt.x); chispa.setAttribute('cy', pt.y); chispaV.style.transform = `translateY(${(p * 32).toFixed(1)}px)`; };
ponerChispa(1);
let raf = 0;
function viaje(){
cancelAnimationFrame(raf);
const t0 = performance.now(), dur = 2200, vueltas = 2;
(function loop(now){
const t = (now - t0) / dur;
if (t >= vueltas){ ponerChispa(1); return; }
const p = t % 1; ponerChispa(p < .5 ? p * 2 : 2 - p * 2);
raf = requestAnimationFrame(loop);
})(t0);
}
if (!reduce) new IntersectionObserver(([en]) => { if (en.isIntersecting) viaje(); else cancelAnimationFrame(raf); }).observe(document.getElementById('lados'));

/* ¿Qué te pasa? Pestañas con flechas del teclado (respuestas y tiempos de ejemplo) */
const casos = [
{canal:'Te responde por WhatsApp', t:'[3] min', msg:'Hola, ya lo estoy revisando. El servidor está bien; el problema es el certificado de seguridad, que venció anoche.', pasos:['Revisamos el sitio y el servidor', 'Encontramos la causa: certificado vencido', 'Lo renovamos y activamos la renovación automática', 'Te avisamos cuando volvió a cargar'], fin:'Resuelto · sitio en línea'},
{canal:'Te responde por correo y WhatsApp', t:'[10] min', msg:'Hola, revisé tu dominio: falta un registro para que los correos lleguen bien. Lo agrego ahora.', pasos:['Revisamos la configuración del dominio', 'Agregamos los registros que faltaban', 'Probamos con correos de prueba', 'Te mandamos la guía para tu celular'], fin:'Resuelto · correos llegando'},
{canal:'Te responde por WhatsApp', t:'[2] min', msg:'Hola, te mandé un enlace seguro para crear una contraseña nueva. Si prefieres, te acompaño por llamada.', pasos:['Verificamos que seas tú', 'Te enviamos un enlace seguro', 'Te acompañamos mientras la cambias'], fin:'Resuelto · acceso recuperado'},
{canal:'Te responde por WhatsApp', t:'[15] min', msg:'Hola, gracias por la captura. Una imagen está muy pesada y descuadra la página en celulares. La ajusto.', pasos:['Revisamos tu captura y el sitio en varios celulares', 'Ajustamos la imagen y el diseño', 'Te mandamos capturas de cómo quedó'], fin:'Resuelto · se ve bien en celular'},
{canal:'Te responde una persona', t:'[—] min', msg:'Hola, cuéntame con tus palabras qué está pasando. Un audio o una captura también me sirven.', pasos:['Te escuchamos sin apuro', 'Te decimos qué haremos y cuánto se demora', 'Lo resolvemos y te contamos qué pasó'], fin:'Siempre una persona del equipo'}
];
const motivos = ['Mi sitio no carga', 'No me llegan los correos', 'Olvidé mi contraseña', 'Algo se ve raro en el celular', 'Aún no sé, quiero orientación'];
const resol = document.getElementById('resol'), msg = document.getElementById('rsMsg'), pasos = document.getElementById('rsPasos'), fin = document.getElementById('rsFin'), canal = document.getElementById('rsCanal'), tt = document.getElementById('rsT'), rsCta = document.getElementById('rsCta');
const tabs = [...document.querySelectorAll('.chips-p [role=tab]')];
let corrida = 0;
function caso(k, foco){
const c = casos[k], id = ++corrida;
tabs.forEach((b, i) => { b.setAttribute('aria-selected', i === k); b.tabIndex = i === k ? 0 : -1; });
if (foco) tabs[k].focus();
resol.setAttribute('aria-labelledby', tabs[k].id);
canal.textContent = c.canal; tt.firstChild.textContent = c.t; msg.textContent = c.msg;
rsCta.dataset.plan = motivos[k];
pasos.innerHTML = ''; fin.textContent = c.fin; fin.classList.remove('on');
c.pasos.forEach(p => { const li = document.createElement('li'); li.textContent = p; pasos.appendChild(li); });
const lis = [...pasos.children];
if (reduce){ lis.forEach(l => l.classList.add('ok')); fin.classList.add('on'); return; }
if (hasG) gsap.from(msg, {y:14, opacity:0, duration:.5, ease:'power3.out'});
lis.forEach((l, i) => setTimeout(() => { if (id === corrida) l.classList.add('ok'); }, 500 + i * 550));
setTimeout(() => { if (id === corrida) fin.classList.add('on'); }, 500 + lis.length * 550);
}
tabs.forEach((b, i) => {
b.addEventListener('click', () => caso(i));
b.addEventListener('keydown', e => {
const n = tabs.length, mapa = {ArrowRight:(i + 1) % n, ArrowDown:(i + 1) % n, ArrowLeft:(i - 1 + n) % n, ArrowUp:(i - 1 + n) % n, Home:0, End:n - 1};
if (e.key in mapa){ e.preventDefault(); caso(mapa[e.key], true); }
});
});
caso(0);

/* Bot vs persona: el toggle cambia métricas y chat */
const toggle = document.getElementById('toggle'), cmp = document.getElementById('chatCmp'), met = document.getElementById('met');
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
const m = b.dataset.m;
toggle.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
toggle.dataset.m = m; cmp.dataset.m = m;
met.querySelectorAll(':scope > div').forEach(d => {
const v = d.querySelector('b'); v.textContent = m === 'antes' ? v.dataset.a : v.dataset.c;
d.querySelector('.barra i').style.width = m === 'antes' ? d.dataset.wa : d.dataset.wc;
});
}));

/* Recorrido del ticket */
const recV = document.getElementById('recV'), items = [...recV.children], tkE = document.getElementById('tkEstado'), tkB = document.getElementById('tkBarra');
const estados = ['Recibido', 'Asignado a [Nombre]', 'En curso', 'Resuelto'];
function ticket(i){ items.forEach((li, k) => li.classList.toggle('on', k <= i)); tkE.textContent = estados[i]; tkB.style.width = ((i + 1) * 25) + '%'; }
ticket(0);

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
fOk.hidden = false;
});

if (!hasG || reduce){ ticket(3); recV.style.setProperty('--p', '100%'); return; }
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:50, opacity:0, duration:.9, ease:'power3.out', stagger:.08, scrollTrigger:{trigger:g, start:'top 82%'}}));
/* Entrada del hero */
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('.lado.tu', {x:-80, opacity:0, duration:1.1, ease:'power3.out', delay:.4});
gsap.from('.lado.rn', {x:80, opacity:0, duration:1.1, ease:'power3.out', delay:.6});
gsap.set(hilo, {strokeDasharray:L}); gsap.fromTo(hilo, {strokeDashoffset:L}, {strokeDashoffset:0, duration:1.2, ease:'power2.inOut', delay:.9});
/* Recorrido: la línea roja y el ticket avanzan con el scroll */
ScrollTrigger.create({trigger:recV, start:'top 55%', end:'bottom 55%', onUpdate:s => { recV.style.setProperty('--p', (s.progress * 100).toFixed(1) + '%'); ticket(Math.min(3, Math.floor(s.progress * 4.2))); }});
gsap.from('.resol', {y:60, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:'.resol', start:'top 80%'}});
})();
