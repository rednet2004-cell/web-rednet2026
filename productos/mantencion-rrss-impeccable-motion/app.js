/* Mantención RRSS (P17) · mantencion-rrss-impeccable-motion (ruta rednet-design-1) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');
const $ = id => document.getElementById(id);

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
fOk.hidden = false;   // maqueta: no envía
});


/* 1 Vitrina del hero: el mismo perfil, sin y con mantención. Cambia cada 6 s, con pausa visible;
   se detiene fuera de pantalla y con reducir movimiento (queda en "con mantención"). */
const vit = $('vitrina'), pausa = $('pausa');
let pausado = reduce, visible = true, tVit = null;
const ponerEstado = e => { vit.dataset.estado = e; };
function cicloVit(){ tVit = null; if (pausado || !visible) return; ponerEstado(vit.dataset.estado === 'antes' ? 'despues' : 'antes'); tVit = setTimeout(cicloVit, 6000); }
const seguirVit = () => { if (!tVit && !pausado && visible) tVit = setTimeout(cicloVit, 2500); };
pausa.addEventListener('click', () => {
pausado = !pausado; pausa.setAttribute('aria-pressed', pausado); pausa.setAttribute('aria-label', pausado ? 'Reanudar la animación del perfil' : 'Pausar la animación del perfil');
if (pausado){ clearTimeout(tVit); tVit = null; } else seguirVit();
});
if (reduce){ ponerEstado('despues'); pausa.setAttribute('aria-pressed', 'true'); pausa.setAttribute('aria-label', 'Reanudar la animación del perfil'); }
else new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) seguirVit(); else { clearTimeout(tVit); tVit = null; } }).observe(vit);

/* 3 Comparador: control nativo (teclado y táctil sin atrapar el scroll) */
const comp = $('comp'), rCorte = $('rCorte');
const corte = v => { comp.style.setProperty('--corte', v + '%'); rCorte.setAttribute('aria-valuetext', v <= 5 ? 'Todo después' : v >= 95 ? 'Todo antes' : v + ' % antes, el resto después'); };
rCorte.addEventListener('input', () => corte(rCorte.value));

/* 4 Taller: 30 fotos sueltas → por tipo → destacados → mensaje nuevo */
const taller = $('taller'), zona = $('tlZona'), pasos = [...document.querySelectorAll('#pasos li')];
const cols = [...zona.querySelectorAll('.tl-col')], labs = [...zona.querySelectorAll('.tl-lab')], tlN = $('tlN'), tlCuenta = $('tlCuenta');
const PAL = [['#E30613','#7A0910'],['#D9C6EC','#8E6FA8'],['#C8892B','#7E520F'],['#EDCB93','#C8892B'],['#5B3A66','#D9C6EC'],['#B0040F','#EDCB93']];
const fotos = [];
let semilla = 7; const azar = () => (semilla = (semilla * 9301 + 49297) % 233280) / 233280;
const sueltas = [];
for (let k = 0; k < 30; k++){
const f = document.createElement('i'); f.className = 'ft';
const [a, b] = PAL[k % PAL.length]; f.style.setProperty('--c', a); f.style.setProperty('--c2', b);
zona.prepend(f); fotos.push(f); sueltas.push([azar(), azar(), azar() * 30 - 15]);
}
let pasoAct = -1;
function ubicar(){
const W = zona.clientWidth, H = zona.clientHeight, t = 40;
const cx = g => W * (g * 2 + 1) / 6;
cols.forEach((c, g) => { c.style.left = cx(g) + 'px'; });
fotos.forEach((f, k) => {
const g = k % 3, j = Math.floor(k / 3);
let x, y, r = 0, s = 1, o = 1;
if (pasoAct <= 0){ [x, y, r] = sueltas[k]; x = x * (W - t); y = 20 + y * (H - 150); }
else if (pasoAct === 1){ x = cx(g) - t - 3 + (j % 2) * (t + 6); y = 26 + Math.floor(j / 2) * (t * .46); r = 0; }
else { x = cx(g) - t / 2; y = H - 70; s = .3; o = 0; }
f.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`; f.style.opacity = o;
});
}
function ponerPaso(i){
if (pasoAct === i) return; pasoAct = i; taller.dataset.paso = i;
pasos.forEach((li, k) => li.classList.toggle('on', k === i));
if (i >= 2){ tlCuenta.firstChild.textContent = 'En tus destacados: '; tlN.textContent = '30'; }
else { tlCuenta.firstChild.textContent = 'En tu Instagram: '; tlN.textContent = '4'; }
ubicar();
}
addEventListener('resize', ubicar, {passive:true});

/* Rubros: cambian los tipos, los destacados y el mensaje de ejemplo */
const RUBROS = {
eventos:{tipos:['Matrimonios','Empresas','Cumpleaños'], carpeta:'fotos de tus eventos', dm:'Hola, ¿tienen fecha para un matrimonio en marzo?'},
belleza:{tipos:['Uñas','Pestañas','Color'], carpeta:'fotos de tus trabajos', dm:'Hola, ¿tienes hora para el sábado en la mañana?'},
restaurantes:{tipos:['Platos','El local','Eventos'], carpeta:'fotos de tus platos', dm:'Hola, ¿se puede reservar para 12 personas el viernes?'},
gimnasios:{tipos:['Clases','Horarios','Planes'], carpeta:'fotos de tus clases', dm:'Hola, ¿cuánto sale el plan mensual?'}
};
const bRub = [...document.querySelectorAll('#rubros button')];
const ponerRubro = r => {
const d = RUBROS[r];
bRub.forEach(b => b.setAttribute('aria-pressed', b.dataset.r === r));
d.tipos.forEach((t, k) => { cols[k].textContent = t; labs[k].textContent = t; });
$('tlCarpeta').textContent = 'Carpeta del celular · ' + d.carpeta; $('tlDm').textContent = d.dm;
};
bRub.forEach(b => b.addEventListener('click', () => ponerRubro(b.dataset.r)));
ponerRubro('eventos');

/* 5 Comparador sin / con mantención */
const toggle = $('toggle'), met = $('met');
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
toggle.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
const m = b.dataset.m; toggle.dataset.m = m; met.dataset.m = m;
met.querySelectorAll(':scope > div').forEach(d => {
const v = d.querySelector('b'); v.textContent = m === 'antes' ? v.dataset.a : v.dataset.c;
d.querySelector('.barra i').style.transform = 'scaleX(' + (m === 'antes' ? d.dataset.wa : d.dataset.wc) + ')';
});
}));

/* Un mes de tareas: se marcan con el scroll */
const tareas = [...document.querySelectorAll('.tarea')], mesN = $('mesN');
const llenaMes = p => { const c = Math.round(p * tareas.length); tareas.forEach((t, k) => t.classList.toggle('on', k < c)); mesN.textContent = c; };

if (!hasG || reduce){ ponerPaso(2); pasos.forEach(li => li.classList.add('on')); llenaMes(1); return; }
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Hero: entrada corta */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('.vitrina', {y:32, opacity:0, duration:.7, ease:'power3.out', delay:.15});
/* Taller: fijo en escritorio, sigue al scroll en móvil */
const porP = p => ponerPaso(p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3);
ponerPaso(0);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#flujoTrack', start:'top top', end:'bottom bottom', onUpdate:s => porP(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#taller', start:'top 80%', end:'bottom 20%', onUpdate:s => porP(s.progress)}); });
/* Mes: las tareas se marcan con el scroll */
llenaMes(0);
ScrollTrigger.create({trigger:'#mesT', start:'top 80%', end:'bottom 45%', scrub:true, onUpdate:s => llenaMes(s.progress), onLeave:() => llenaMes(1)});
})();
