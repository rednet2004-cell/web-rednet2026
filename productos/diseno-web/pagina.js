/* Borrador E · Diseño Web: piezas de diseño que siguen al mouse, sitio que se arma con el scroll, comparador y dispositivos */
(function(){
const {reduce, hasG, clamp} = RN;
/* Piezas flotantes del hero: parallax con el mouse */
const escena = document.getElementById('escena'), piezasF = [...escena.querySelectorAll('.pieza-f')];
const rotBase = piezasF.map(p => getComputedStyle(p).transform);
if (!reduce && matchMedia('(hover:hover)').matches){
let tx = 0, ty = 0, cx = 0, cy = 0;
addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });
(function loop(){
cx += (tx - cx) * .06; cy += (ty - cy) * .06;
piezasF.forEach((p, i) => { const k = +p.dataset.p; p.style.transform = `translate3d(${(cx * k).toFixed(1)}px,${(cy * k * .6).toFixed(1)}px,0) ${rotBase[i] === 'none' ? '' : rotBase[i]}`; });
requestAnimationFrame(loop);
})();
}
/* Boceto → diseño */
const mock = document.getElementById('mock'), capas = [...document.querySelectorAll('#capas li')];
let est = -1;
function estado(i){ if (i === est) return; est = i; mock.dataset.e = i; capas.forEach((c, k) => c.classList.toggle('on', k === i)); }
estado(reduce || !hasG ? 3 : 0);
/* Comparador plantilla / a medida */
const comp = document.getElementById('comp'), mango = document.getElementById('mango');
let arr = false;
function mover(x){ const r = comp.getBoundingClientRect(), p = clamp((x - r.left) / r.width * 100, 4, 96); comp.style.setProperty('--x', p + '%'); mango.setAttribute('aria-valuenow', Math.round(p)); }
comp.addEventListener('pointerdown', e => { arr = true; comp.setPointerCapture(e.pointerId); mover(e.clientX); });
comp.addEventListener('pointermove', e => arr && mover(e.clientX));
comp.addEventListener('pointerup', () => arr = false);
comp.addEventListener('pointercancel', () => arr = false);
mango.addEventListener('keydown', e => { const v = parseFloat(comp.style.getPropertyValue('--x')) || 50; if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){ e.preventDefault(); const n = clamp(v + (e.key === 'ArrowLeft' ? -5 : 5), 4, 96); comp.style.setProperty('--x', n + '%'); mango.setAttribute('aria-valuenow', n); } });
/* Dispositivos */
const disp = document.getElementById('disp'), dbtns = [...document.querySelectorAll('.disp-btns button')];
let autoDisp = null;
function dispositivo(d){ disp.dataset.d = d; dbtns.forEach(b => { const on = b.dataset.d === d; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); }); }
dbtns.forEach(b => b.addEventListener('click', () => { clearInterval(autoDisp); dispositivo(b.dataset.d); }));
if (!reduce){
const orden = ['esc', 'tab', 'cel']; let k = 0;
new IntersectionObserver(([en]) => { clearInterval(autoDisp); if (en.isIntersecting) autoDisp = setInterval(() => dispositivo(orden[k = (k + 1) % 3]), 2400); }, {threshold:.5}).observe(disp);
}
if (!hasG || reduce) return;
/* Entrada del hero: la palabra "igual a todos" se tacha */
const tacha = document.getElementById('tacha');
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.fromTo(tacha, {'--t':0}, {'--t':1, duration:.7, ease:'power3.inOut', delay:1});
gsap.from('.nav-mock', {y:140, opacity:0, duration:1.3, ease:'power4.out', delay:.3});
gsap.from('.pieza-f', {opacity:0, duration:.9, ease:'power2.out', stagger:.12, delay:.9});
gsap.to('.nav-mock', {y:-60, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Boceto → diseño: fijado en escritorio, cuatro tramos de scroll */
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => {
ScrollTrigger.create({trigger:'.boceto-sec', start:'top top', end:'+=' + innerHeight * 2, pin:true, onUpdate:s => estado(Math.min(3, Math.floor(s.progress * 4)))});
});
mm.add('(max-width:860px)', () => {
ScrollTrigger.create({trigger:'#mock', start:'top 75%', end:'bottom 25%', onUpdate:s => estado(Math.min(3, Math.floor(s.progress * 4)))});
});
/* Comparador: se abre solo la primera vez */
gsap.fromTo(comp, {'--x':'88%'}, {'--x':'50%', duration:1.4, ease:'power3.inOut', scrollTrigger:{trigger:comp, start:'top 70%'}});
/* Pila: cada tarjeta se achica un poco cuando la siguiente la tapa */
const pcs = gsap.utils.toArray('.pc');
pcs.forEach((c, i) => { if (i < pcs.length - 1) gsap.to(c, {scale:.94, filter:'brightness(.92)', ease:'none', scrollTrigger:{trigger:pcs[i + 1], start:'top 80%', end:'top 30%', scrub:true}}); });
})();
