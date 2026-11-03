/* Borrador A · Hosting: tarjeta que se inclina con el mouse, panel de estado que se arma con el scroll */
(function(){
const {reduce, hasG, clamp} = RN;
/* Barras de uptime (90 días de ejemplo: casi todo verde, un par de avisos) */
const up = document.getElementById('uptime');
for (let i = 0; i < 90; i++){ const b = document.createElement('i'); if (i === 23 || i === 61) b.className = 'amb'; if (i === 47) b.className = 'roj'; up.appendChild(b); }
/* Curva de tiempo de respuesta (ejemplo, suave y estable) */
const pts = []; let y = 92;
for (let i = 0; i <= 40; i++){ y += (Math.sin(i * 1.7) * 9 + Math.cos(i * .6) * 6) * .5; y = clamp(y + (92 - y) * .25, 55, 130); pts.push([i * 25, y]); }
const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1].toFixed(1)).join(' ');
const curva = document.getElementById('curva'), area = document.getElementById('curvaArea');
curva.setAttribute('d', d); area.setAttribute('d', d + ' L1000 160 L0 160 Z');
/* Tarjeta del hero: se inclina hacia el cursor (mismo gesto que el carrusel del home) */
const vis = document.getElementById('heroVis'), tarjeta = document.getElementById('tarjeta'), chips = [...vis.querySelectorAll('.chip-flota')];
if (!reduce && matchMedia('(hover:hover)').matches){
let tx = 0, ty = 0, cx = 0, cy = 0;
vis.addEventListener('pointermove', e => { const r = vis.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; });
vis.addEventListener('pointerleave', () => { tx = ty = 0; });
(function loop(){
cx += (tx - cx) * .08; cy += (ty - cy) * .08;
tarjeta.style.transform = `translateX(-50%) rotateY(${(cx * 16).toFixed(2)}deg) rotateX(${(-cy * 12).toFixed(2)}deg)`;
chips.forEach((c, i) => { const k = (i + 1) * 14; c.style.transform = `translate3d(${(cx * k).toFixed(1)}px,${(cy * k).toFixed(1)}px,0)`; });
requestAnimationFrame(loop);
})();
}
if (!hasG || reduce) return;
/* Entrada del hero */
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('#tarjeta', {y:80, rotateY:-25, opacity:0, duration:1.3, ease:'power3.out', delay:.2});
gsap.from('.chip-flota', {scale:.6, opacity:0, duration:.8, ease:'back.out(2)', stagger:.15, delay:.7});
/* Parallax al salir del hero */
gsap.to('#heroTxt', {yPercent:-25, opacity:.25, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
gsap.to('#heroVis', {y:90, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Monitor: se fija en escritorio mientras las barras suben y la curva se dibuja */
const largo = curva.getTotalLength ? curva.getTotalLength() : 1200;
gsap.set(curva, {strokeDasharray:largo, strokeDashoffset:largo});
const fijar = matchMedia('(min-width:861px)').matches;
const tl = gsap.timeline({scrollTrigger:{trigger:'#monitor', start:fijar ? 'center center' : 'top 75%', end:fijar ? '+=900' : 'bottom 60%', scrub:1, pin:fijar ? '.monitor-sec' : false}});
tl.from('#monitor', {scale:.92, borderRadius:60, duration:.4, ease:'none'}, 0)
.from('.mon-kpis > div', {y:30, opacity:0, stagger:.06, duration:.3}, .1)
.from('#uptime i', {scaleY:0, stagger:.006, duration:.25, ease:'power2.out'}, .2)
.to(curva, {strokeDashoffset:0, duration:.8, ease:'none'}, .35)
.from(area, {opacity:0, duration:.4}, .7);
/* Bento */
gsap.from('.velo i', {scaleX:0, duration:1.1, ease:'power3.out', stagger:.07, scrollTrigger:{trigger:'.velo', start:'top 85%'}});
/* Ticket de soporte */
gsap.from('.ticket .t-msg', {y:20, opacity:0, duration:.6, ease:'power3.out', stagger:.35, scrollTrigger:{trigger:'.ticket', start:'top 75%'}});
})();
