/* Borrador M · Apps Móviles: la app se arma pieza por pieza, "arma tu app", del boceto a la tienda, avisos y Android/iPhone */
(function(){
const {reduce, hasG} = RN;
const espera = ms => new Promise(r => setTimeout(r, ms));
/* 1 Hero: las piezas de la app entran una por una y llega un pedido */
const piezas = [...document.querySelectorAll('#fonoHero .pz')], toast = document.getElementById('fToast');
if (reduce){ piezas.forEach(p => p.classList.add('in')); toast.classList.add('on'); }
else (async function(){
for (;;){
await espera(500);
for (const p of piezas){ p.classList.add('in'); await espera(260); }
await espera(700); toast.classList.add('on');
await espera(3600); toast.classList.remove('on');
await espera(600); piezas.slice().reverse().forEach(p => p.classList.remove('in'));
await espera(700);
}
})();
/* 3 Arma tu app */
const rubros = [
{n:'[Tu panadería]', s:'Hola, [Nombre] 🥐', cat:'Pan amasado, tortas y empanadas', ped:'Pide hoy y retira a las 18:30', res:'Encarga tu torta con 2 días', pag:'Paga con tarjeta o transferencia', pun:'Llevas [8] de 10 cafés', not:'Pan recién salido a las 7:00', seg:'Tu pedido está en el horno'},
{n:'[Tu gimnasio]', s:'Vamos, [Nombre] 💪', cat:'Planes y clases de la semana', ped:'Compra tu pase en un toque', res:'Reserva tu cupo en spinning', pag:'Renueva tu plan sin filas', pun:'[12] clases este mes', not:'Hoy hay clase extra a las 20:00', seg:'Tu avance del mes'},
{n:'[Tu clínica]', s:'Hola, [Nombre]', cat:'Especialidades y profesionales', ped:'Pide tus exámenes', res:'Toma tu hora en segundos', pag:'Paga tu consulta antes de llegar', pun:'Beneficios para pacientes', not:'Recordatorio: tu hora es mañana', seg:'Tus resultados ya están listos'},
{n:'[Tu tienda]', s:'Hola, [Nombre] 🛍️', cat:'Lo nuevo de la temporada', ped:'Compra y retira en tienda', res:'Aparta un producto por 24 h', pag:'Paga en cuotas o al contado', pun:'Tienes [1.200] puntos', not:'Llegó tu talla favorita', seg:'Tu pedido va en camino'}
];
const mods = {cat:['▦', 'Catálogo'], ped:['◎', 'Pedidos'], res:['◷', 'Reservas'], pag:['$', 'Pagos'], pun:['★', 'Puntos'], not:['◉', 'Avisos'], seg:['➝', 'Seguimiento']};
const est = {r:0};
const aCards = document.getElementById('aCards'), aTab = document.getElementById('aTab'), aN = document.getElementById('aN');
const modBtns = [...document.querySelectorAll('#aMods button')];
function armar(){
const R = rubros[est.r], act = modBtns.filter(b => b.classList.contains('on')).map(b => b.dataset.k);
document.getElementById('aNom').textContent = R.n; document.getElementById('aSub').textContent = R.s;
aN.textContent = act.length;
aCards.innerHTML = ''; aTab.innerHTML = '';
const lista = act.length ? act : [];
if (!lista.length){ const d = document.createElement('div'); d.className = 'ac'; d.innerHTML = '<i>+</i><div><b>Elige una función</b><small>Tu app empieza aquí</small></div>'; aCards.append(d); }
lista.forEach(k => {
const d = document.createElement('div'); d.className = 'ac';
const i = document.createElement('i'); i.textContent = mods[k][0];
const t = document.createElement('div'); const b = document.createElement('b'); b.textContent = mods[k][1]; const s = document.createElement('small'); s.textContent = R[k]; t.append(b, s);
d.append(i, t); aCards.append(d);
});
['Inicio', ...lista.slice(0, 4).map(k => mods[k][1])].forEach((n, j) => { const s = document.createElement('span'); s.innerHTML = '<i>' + (j ? mods[lista[j - 1]][0] : '⌂') + '</i>'; s.append(n); aTab.append(s); });
if (hasG && !reduce) gsap.from(aCards.children, {y:20, opacity:0, duration:.45, ease:'power3.out', stagger:.05});
}
modBtns.forEach(b => b.addEventListener('click', () => { const on = !b.classList.contains('on'); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); armar(); }));
const rbs = [...document.querySelectorAll('#aRubro button')];
rbs.forEach((b, i) => b.addEventListener('click', () => { rbs.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); est.r = i; armar(); }));
armar();
/* 4 Etapas */
const fonoEt = document.getElementById('fonoEt'), etLis = [...document.querySelectorAll('#etLista li')], tiendas = document.getElementById('tiendas'), probadores = document.getElementById('probadores');
function etapa(p){
const e = Math.min(3, Math.floor(p * 4));
fonoEt.dataset.e = e;
etLis.forEach((li, k) => li.classList.toggle('on', k === e));
tiendas.classList.toggle('on', e === 3); probadores.classList.toggle('on', e === 2);
}
if (!hasG || reduce){ etapa(.99); return; }
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('.plano .fono', {y:100, rotate:-6, opacity:0, duration:1.2, ease:'power3.out', delay:.2});
gsap.from('.nota-p', {scale:0, opacity:0, duration:.6, ease:'back.out(2)', stagger:.12, delay:1});
etapa(0);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => {
ScrollTrigger.create({trigger:'#etapas', start:'top top', end:'bottom bottom', onUpdate:s => etapa(s.progress)});
gsap.fromTo('#fonoEt', {rotate:-8, y:30}, {rotate:4, y:-30, ease:'none', scrollTrigger:{trigger:'#etapas', start:'top top', end:'bottom bottom', scrub:true}});
});
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'.et-esc', start:'top 80%', end:'bottom 20%', onUpdate:s => etapa(s.progress)}); });
/* 5 Avisos caen en la pantalla de bloqueo */
gsap.from('#blLista .nt', {y:-60, opacity:0, scale:.9, duration:.7, ease:'back.out(1.6)', stagger:.25, scrollTrigger:{trigger:'#bloqueo', start:'top 70%'}});
/* 6 Android e iPhone giran hacia ti */
gsap.fromTo('.fono-d.izq', {rotateY:38, x:40}, {rotateY:-8, x:0, ease:'none', scrollTrigger:{trigger:'#dosFonos', start:'top 90%', end:'center 45%', scrub:true}});
gsap.fromTo('.fono-d.der', {rotateY:-38, x:-40}, {rotateY:8, x:0, ease:'none', scrollTrigger:{trigger:'#dosFonos', start:'top 90%', end:'center 45%', scrub:true}});
})();
