/* Automatizaciones de Tareas (P12) · automatizaciones-pulido (ruta rednet-design-1 completa: impeccable → motion → pulido) */
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

/* 1 Lienzo del hero: el flujo avanza nodo a nodo (cada flujo dura más de 5 s), con pausa visible;
   se detiene fuera de pantalla y con reducir movimiento. */
const flujos = [
['Facturas de proveedores', ['Correo con factura.pdf', 'RUT, monto y fecha', 'Fila nueva en la planilla', 'Correo a contabilidad'], 'Factura 4821 · registrada'],
['Aviso de despacho', ['Pedido sale de bodega', 'Cliente y dirección', 'Estado: en camino', 'WhatsApp al cliente'], 'Pedido 2231 · cliente avisado'],
['Recordatorio de pago', ['Vence en 3 días', 'Cliente y monto', 'Planilla de cobranza', 'Correo de recordatorio'], 'Factura 1184 · recordatorio enviado']
];
const nodos = [...document.querySelectorAll('.nodo')], riel = $('rielLleno'), cuenta = $('cuenta'), log = $('log'), lNombre = $('lNombre'), pausa = $('pausa'), lienzo = $('lienzo');
const pinta = f => { lNombre.textContent = 'Flujo · ' + f[0]; f[1].forEach((t, i) => { $('n' + i).textContent = t; }); };
let n = 0, fase = 0, hechas = 0, minuto = 14, timer = null, pausado = reduce, visible = true;
function paso(){
timer = null;
if (pausado || !visible) return;
const f = flujos[n % flujos.length];
if (fase === 0){ pinta(f); nodos.forEach(x => x.classList.remove('on', 'hecho')); riel.style.transform = 'scaleY(0)'; }
if (fase < 4){
nodos.forEach((x, i) => { x.classList.toggle('on', i === fase); x.classList.toggle('hecho', i < fase); });
riel.style.transform = 'scaleY(' + fase / 3 + ')';
fase++; return programar(fase === 1 ? 700 : 900);
}
nodos.forEach(x => { x.classList.remove('on'); x.classList.add('hecho'); });
hechas++; minuto++; cuenta.textContent = hechas;
const li = document.createElement('li'); li.textContent = '09:' + String(minuto).padStart(2, '0') + ' · ' + f[2]; log.prepend(li);
while (log.children.length > 3) log.lastChild.remove();
fase = 0; n++; programar(2400);
}
function programar(ms){ timer = setTimeout(paso, ms); }
function seguir(){ if (!timer && !pausado && visible) programar(300); }
pausa.addEventListener('click', () => {
pausado = !pausado; pausa.setAttribute('aria-pressed', pausado); pausa.setAttribute('aria-label', pausado ? 'Reanudar la animación del flujo' : 'Pausar la animación del flujo');
if (pausado){ clearTimeout(timer); timer = null; } else seguir();
});
if (reduce){ pinta(flujos[0]); nodos.forEach(x => x.classList.add('hecho')); riel.style.transform = 'scaleY(1)'; cuenta.textContent = '1'; pausa.setAttribute('aria-pressed', 'true'); pausa.setAttribute('aria-label', 'Reanudar la animación del flujo'); }
else {
new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) seguir(); else { clearTimeout(timer); timer = null; } }).observe(lienzo);
setTimeout(seguir, 600);
}

/* 3 Banco de trabajo: el paso visible sigue al scroll */
const banco = $('banco'), pasos = [...document.querySelectorAll('#pasos li')];
const ponerPaso = i => { if (banco.dataset.paso == i) return; banco.dataset.paso = i; pasos.forEach((li, k) => li.classList.toggle('on', k === i)); };

/* 4 Duelo: diez facturas, a mano (5 pasos cada una) o con el flujo (lo dispara la persona) */
const micro = ['Abrir correo', 'Copiar monto', 'Pegar en planilla', 'Escribir aviso', 'Enviar'];
const fMano = $('fMano'), fFlujo = $('fFlujo'), bMano = $('bMano'), bFlujo = $('bFlujo'), clics = $('clics'), eMano = $('eMano'), eFlujo = $('eFlujo');
let iF = 0, iM = 0, c = 0, corriendo = [];
const arma = ol => { ol.textContent = ''; for (let k = 0; k < 10; k++){ const li = document.createElement('li'); const i = document.createElement('i'); const s = document.createElement('span'); s.textContent = '#' + (4821 + k); li.append(i, s); ol.append(li); } };
const reinicia = () => {
corriendo.forEach(clearTimeout); corriendo = [];
arma(fMano); arma(fFlujo); iF = 0; iM = 0; c = 0; clics.textContent = 0;
bMano.disabled = false; bMano.textContent = micro[0]; bFlujo.disabled = false; bFlujo.textContent = 'Activar el flujo';
eMano.textContent = '0 de 10 facturas'; eFlujo.textContent = '0 de 10 facturas';
};
reinicia();
bMano.addEventListener('click', () => {
const li = fMano.children[iF]; c++; iM++; clics.textContent = c;
li.firstChild.style.transform = 'scaleX(' + iM / 5 + ')';
if (iM === 5){ li.classList.add('ok'); iF++; iM = 0; eMano.textContent = iF + ' de 10 facturas'; }
if (iF === 10){ bMano.disabled = true; bMano.textContent = 'Listo: ' + c + ' clics'; return; }
bMano.textContent = micro[iM];
});
bFlujo.addEventListener('click', () => {
bFlujo.disabled = true; bFlujo.textContent = 'Corriendo…';
[...fFlujo.children].forEach((li, k) => corriendo.push(setTimeout(() => {
li.firstChild.style.transform = 'scaleX(1)'; li.classList.add('ok');
if (k === 9){ bFlujo.textContent = 'Listo: 0 clics'; eFlujo.textContent = '10 de 10 facturas, sin intervención'; }
}, reduce ? 0 : k * 180)));
});
$('reini').addEventListener('click', reinicia);

/* 5 Rubros: pestañas con flechas del teclado */
const tabs = [...document.querySelectorAll('#cRub [role=tab]')];
const elegir = (b, foco) => {
tabs.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $(x.getAttribute('aria-controls')).hidden = !on; });
if (foco) b.focus();
};
tabs.forEach((b, i) => {
b.addEventListener('click', () => elegir(b));
b.addEventListener('keydown', e => {
const k = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[e.key];
if (k){ e.preventDefault(); elegir(tabs[(i + k + tabs.length) % tabs.length], true); }
if (e.key === 'Home'){ e.preventDefault(); elegir(tabs[0], true); }
if (e.key === 'End'){ e.preventDefault(); elegir(tabs[tabs.length - 1], true); }
});
});

/* 6 ¿Se puede automatizar? */
const checks = [...document.querySelectorAll('#test input')], ver = $('veredicto');
const veredictos = [
['', 'Marca al menos una', 'Y te decimos qué tan buena candidata parece.'],
[' medio', 'Puede servir', 'Depende de los detalles. Lo vemos contigo en la reunión de 45 minutos, sin costo.'],
[' alto', 'Buena candidata', 'Tiene lo que necesita una automatización. Pide tu evaluación gratis y la revisamos contigo.']
];
checks.forEach(ch => ch.addEventListener('change', () => {
const k = checks.filter(x => x.checked).length, v = veredictos[k >= 3 ? 2 : k ? 1 : 0];
ver.className = 'veredicto' + v[0]; ver.querySelector('b').textContent = v[1]; ver.querySelector('span').textContent = v[2];
}));

/* Video del producto: no arranca solo; se reproduce al pulsar "Ver video" y se pausa al salir de pantalla.
   El botón de sonido queda oculto mientras el video no tenga música (quitar `hidden` en #vAutSonido cuando se agregue). */
const vA = $('vAut'), vAp = $('vAutPausa'), vAs = $('vAutSonido'), vAver = $('vAutVer'), vActl = document.querySelector('.video-ctl');
let vApausado = false, vAvisible = true, vAini = false;
function vAestado(){
  if (!vAini) return;
  if (vAvisible && !vApausado) vA.play().catch(() => {}); else vA.pause();
  vAp.setAttribute('aria-pressed', vApausado);
  vAp.querySelector('span').textContent = vApausado ? 'Reproducir animación' : 'Pausar animación';
}
function vAsonido(){ vAs.setAttribute('aria-pressed', !vA.muted); vAs.querySelector('span').textContent = vA.muted ? 'Activar sonido' : 'Silenciar'; }
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
const nm = form.nombre, ct = form.contacto, malos = [nm, ct].filter(i => !i.value.trim());
[nm, ct].forEach(i => i.setAttribute('aria-invalid', malos.includes(i)));
fErr.hidden = !malos.length;
if (malos.length){ malos[0].focus(); return; }
const btn = form.querySelector('button[type=submit]');
btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Enviando…';
setTimeout(() => { btn.removeAttribute('aria-busy'); btn.disabled = true; btn.textContent = 'Enviado'; fOk.hidden = false; }, 700);   // maqueta: simula el envío
});

if (!hasG || reduce){ ponerPaso(3); pasos.forEach(li => li.classList.add('on')); return; }
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.055, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Hero: entrada corta */
gsap.from('#heroTxt > *', {y:24, opacity:0, duration:.6, ease:'power3.out', stagger:.06});
gsap.from('.lienzo-esc', {y:32, opacity:0, duration:.7, ease:'power3.out', delay:.15});
/* Banco de trabajo: fijo en escritorio, sigue al scroll en móvil */
const porP = p => ponerPaso(p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#flujoTrack', start:'top top', end:'bottom bottom', onUpdate:s => porP(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#banco', start:'top 80%', end:'bottom 20%', onUpdate:s => porP(s.progress)}); });
gsap.from('.carril', {y:24, opacity:0, duration:.55, ease:'power3.out', stagger:.06, scrollTrigger:{trigger:'.duelo', start:'top 85%'}});
})();
