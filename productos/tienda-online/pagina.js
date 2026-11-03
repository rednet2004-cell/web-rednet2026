/* Borrador B · Tienda Online: pedidos arrastrables, recorrido horizontal fijado y reloj de día a noche */
(function(){
const {reduce, hasG} = RN;
/* Marcas del reloj */
const marcas = document.getElementById('marcas');
for (let i = 0; i < 12; i++){
const a = i * 30 * Math.PI / 180, r1 = i % 3 ? 82 : 76, r2 = 88;
const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
l.setAttribute('x1', 100 + r1 * Math.sin(a)); l.setAttribute('y1', 100 - r1 * Math.cos(a));
l.setAttribute('x2', 100 + r2 * Math.sin(a)); l.setAttribute('y2', 100 - r2 * Math.cos(a));
l.setAttribute('stroke', 'currentColor'); l.setAttribute('stroke-width', i % 3 ? 2 : 4); l.setAttribute('stroke-linecap', 'round');
marcas.appendChild(l);
}
const hora = document.getElementById('hora'), min = document.getElementById('min'), horaDig = document.getElementById('horaDig'), ped = document.getElementById('pedNoche');
const H0 = 20, HORAS = 10, PEDIDOS = 27;   // de 20:00 a 06:00; cantidad de pedidos de ejemplo
function ponerHora(p){
const t = H0 * 60 + p * HORAS * 60, h = Math.floor(t / 60) % 24, m = Math.floor(t % 60);
hora.setAttribute('transform', `rotate(${(t / 60 % 12) * 30} 100 100)`);
min.setAttribute('transform', `rotate(${(t % 60) * 6} 100 100)`);
horaDig.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
ped.textContent = Math.round(Math.pow(p, 1.2) * PEDIDOS);
}
ponerHora(reduce || !hasG ? 1 : 0);
/* Caso: el lado visual sigue al toggle */
const caso = document.querySelector('.caso-t'); caso.dataset.m = 'con';
caso.querySelectorAll('.toggle button').forEach(b => b.addEventListener('click', () => caso.dataset.m = b.dataset.m));
/* Tarjetas de "qué incluye": se inclinan hacia el cursor */
if (!reduce && matchMedia('(hover:hover)').matches){
document.querySelectorAll('.inc').forEach(c => {
c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 12}deg) translateZ(10px)`; });
c.addEventListener('pointerleave', () => { c.style.transform = ''; });
});
}
if (!hasG) return;
/* Pedidos del hero: se arrastran como las reseñas del home */
gsap.registerPlugin(Draggable);
let z = 10;
document.querySelectorAll('.pedido').forEach(p => Draggable.create(p, {type:'x,y', bounds:'#pila', onPress(){ this.target.style.zIndex = ++z; }}));
if (reduce) return;
/* Entrada del hero: el titular sube línea por línea */
gsap.from('.p-hero h1 .ln > *', {yPercent:100, duration:1.1, ease:'power4.out', stagger:.12});
gsap.from('#heroTxt .miga, #heroTxt .etq, #heroTxt p, #heroTxt .hero-ctas', {y:30, opacity:0, duration:.9, ease:'power3.out', stagger:.08, delay:.3});
gsap.from('.foto-tienda', {y:60, rotate:12, opacity:0, duration:1.2, ease:'power3.out', delay:.2});
gsap.from('.pedido', {y:-160, rotation:'+=30', opacity:0, duration:1, ease:'bounce.out', stagger:.12, delay:.6});
gsap.to('.sol', {yPercent:30, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Recorrido horizontal (escritorio): la sección se fija y el pedido avanza de etapa en etapa */
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => {
const tren = document.getElementById('tren');
const dist = () => Math.max(0, tren.scrollWidth - innerWidth);
const tl = gsap.timeline({scrollTrigger:{trigger:'.recorrido', start:'top top', end:() => '+=' + (dist() + innerHeight * .4), scrub:1, pin:true, invalidateOnRefresh:true}});
tl.to(tren, {x:() => -dist(), ease:'none'}, 0)
.to('#recProg', {width:'100%', ease:'none'}, 0)
.to('#caja', {left:'100%', rotation:360, ease:'none'}, 0);
document.querySelectorAll('.etapa').forEach(e => gsap.from(e.querySelector('.mini'), {y:30, opacity:0, duration:.5, ease:'power3.out', scrollTrigger:{trigger:e, containerAnimation:tl, start:'left 70%'}}));
});
mm.add('(max-width:860px)', () => {
gsap.from('.etapa', {y:60, opacity:0, duration:.9, ease:'power3.out', stagger:.1, scrollTrigger:{trigger:'#tren', start:'top 80%'}});
});
/* Día a noche: el reloj avanza con el scroll y la sección se oscurece; al final amanece */
const fijar = matchMedia('(min-width:861px)').matches;
const o = {p:0};
gsap.timeline({scrollTrigger:{trigger:'#noche', start:fijar ? 'center center' : 'top 70%', end:fijar ? '+=1100' : 'bottom 30%', scrub:1, pin:fijar}})
.to(o, {p:1, ease:'none', duration:1, onUpdate:() => ponerHora(o.p)}, 0)
.to('#noche', {backgroundColor:'#0E0D0C', color:'#F2F0EC', duration:.3, ease:'none'}, .02)
.to('#noche', {backgroundColor:'#EDCB93', color:'#141210', duration:.15, ease:'none'}, .85);
/* Caso */
gsap.from('.cuaderno', {x:-60, rotate:-14, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:'.caso-vis', start:'top 75%'}});
gsap.from('.panel-t', {x:60, opacity:0, duration:1, ease:'power3.out', delay:.15, scrollTrigger:{trigger:'.caso-vis', start:'top 75%'}});
})();
