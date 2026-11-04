/* Borrador D · Hosting: rack que se abre servidor por servidor, velocímetro y ruta de migración */
(function(){
const {reduce, hasG} = RN;
/* Rack del hero: la luz roja ("tu sitio") recorre los servidores */
const bladesHero = [...document.querySelectorAll('#rackHero .blade')];
if (!reduce){ let k = 2; setInterval(() => { bladesHero[k].classList.remove('on'); k = (k + 1 + Math.floor(Math.random() * 3)) % bladesHero.length; bladesHero[k].classList.add('on'); }, 2600); }
/* Rack abierto: un servidor activo por paso */
const blades = [...document.querySelectorAll('#rackGrande .blade')], piezas = [...document.querySelectorAll('.pieza')], prog = [...document.querySelectorAll('.piezas-prog i')];
let act = -1;
function activar(i){
if (i === act) return; act = i;
blades.forEach((b, k) => b.classList.toggle('on', k === i));
piezas.forEach((p, k) => p.classList.toggle('on', k === i));
prog.forEach((p, k) => p.classList.toggle('on', k <= i));
}
activar(0);
/* Marcas del velocímetro */
const mg = document.getElementById('marcasG');
for (let i = 0; i <= 10; i++){
const a = (-90 + i * 18) * Math.PI / 180, r1 = i % 5 ? 104 : 96, r2 = 112;
const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
l.setAttribute('x1', 160 + r1 * Math.sin(a)); l.setAttribute('y1', 170 - r1 * Math.cos(a));
l.setAttribute('x2', 160 + r2 * Math.sin(a)); l.setAttribute('y2', 170 - r2 * Math.cos(a));
l.setAttribute('stroke', 'rgba(255,255,255,.3)'); l.setAttribute('stroke-width', i % 5 ? 1.5 : 3);
mg.appendChild(l);
}
const agujaG = document.getElementById('agujaG'), agujaR = document.getElementById('agujaR'), arco = document.getElementById('gaugeArco');
const L = arco.getTotalLength();
arco.style.strokeDasharray = L;
function gauge(p){
agujaG.setAttribute('transform', `rotate(${-90 + p * 50} 160 170)`);   // genérico: se queda en la zona lenta
agujaR.setAttribute('transform', `rotate(${-90 + p * 165} 160 170)`);  // Rednet: llega a la zona rápida
arco.style.strokeDashoffset = L * (1 - p);
}
gauge(reduce || !hasG ? 1 : 0);
const hitos = [...document.querySelectorAll('.hito')];
if (!hasG || reduce){ hitos.forEach(h => h.classList.add('on')); return; }
/* Entrada del hero */
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('#rackHero .blade', {x:120, opacity:0, duration:.9, ease:'power3.out', stagger:.08, delay:.3});
gsap.from('.pulso-chip', {scale:.6, opacity:0, duration:.8, ease:'back.out(2)', delay:1.1});
gsap.to('#rackHero', {y:70, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
gsap.to('#heroTxt', {yPercent:-20, opacity:.3, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Rack abierto: fijado en escritorio, cada tramo de scroll saca un servidor */
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => {
ScrollTrigger.create({trigger:'.rack-sec', start:'top top', end:'+=' + innerHeight * 2.4, pin:true, onUpdate:s => activar(Math.min(blades.length - 1, Math.floor(s.progress * blades.length)))});
gsap.from('#rackGrande', {rotateY:-30, scale:.9, opacity:0, duration:1.1, ease:'power3.out', scrollTrigger:{trigger:'.rack-sec', start:'top 70%'}});
});
mm.add('(max-width:860px)', () => {
blades.forEach((b, i) => ScrollTrigger.create({trigger:piezas[i], start:'top 60%', end:'bottom 40%', onToggle:s => s.isActive && activar(i)}));
});
/* Velocímetro */
const o = {p:0};
gsap.to(o, {p:1, ease:'power2.out', onUpdate:() => gauge(o.p), scrollTrigger:{trigger:'.gauge', start:'top 80%', end:'center 45%', scrub:1}});
/* Ruta de migración: la línea se llena y los nodos se encienden */
const llena = document.getElementById('rutaLlena'), Lr = 1000;
gsap.set(llena, {strokeDasharray:Lr, strokeDashoffset:Lr});
gsap.to(llena, {strokeDashoffset:0, ease:'none', scrollTrigger:{trigger:'#ruta', start:'top 75%', end:'bottom 55%', scrub:1, onUpdate:s => hitos.forEach((h, i) => h.classList.toggle('on', s.progress >= i / 2.2))}});
gsap.from('.hito', {y:40, opacity:0, duration:.9, ease:'power3.out', stagger:.12, scrollTrigger:{trigger:'#ruta', start:'top 80%'}});
})();
