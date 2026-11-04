/* Borrador F · WordPress: editor de ejemplo que funciona, carrera antes/ahora, acordeón del home y bloques arrastrables */
(function(){
const {reduce, hasG} = RN;
/* Editor: lo que escribes aparece en la vista previa */
const pares = [['inTitulo', 'outTitulo'], ['inPrecio', 'outPrecio'], ['inHorario', 'outHorario']];
const guardado = document.getElementById('guardado');
let tGuard = null, demo = null, tocado = false;
function marcarGuardado(){ guardado.textContent = 'Guardando…'; guardado.classList.add('esc'); clearTimeout(tGuard); tGuard = setTimeout(() => { guardado.textContent = 'Guardado'; guardado.classList.remove('esc'); }, 700); }
function destello(el){ el.classList.remove('cambio'); void el.offsetWidth; el.classList.add('cambio'); }
pares.forEach(([i, o]) => {
const inp = document.getElementById(i), out = document.getElementById(o);
inp.addEventListener('input', () => { out.textContent = inp.value || ' '; destello(out); marcarGuardado(); });
inp.addEventListener('focus', () => { tocado = true; clearTimeout(demo); });
});
const outBtn = document.getElementById('outBtn');
document.querySelectorAll('.ed-color button').forEach(b => b.addEventListener('click', () => {
tocado = true; clearTimeout(demo);
document.querySelectorAll('.ed-color button').forEach(x => x.classList.toggle('on', x === b));
outBtn.style.background = b.dataset.c; marcarGuardado();
}));
/* Demostración: si nadie toca el editor, se escribe un cambio solo */
function escribir(inp, txt, fin){
let k = 0; inp.value = ''; inp.dispatchEvent(new Event('input'));
(function sig(){ if (tocado) return; if (k > txt.length){ fin && (demo = setTimeout(fin, 1600)); return; } inp.value = txt.slice(0, k++); inp.dispatchEvent(new Event('input')); demo = setTimeout(sig, 55); })();
}
if (!reduce){
const tit = document.getElementById('inTitulo'), hor = document.getElementById('inHorario');
const ciclo = () => escribir(tit, 'Hoy: empanadas de pino al horno', () => escribir(hor, 'Domingo abierto · 9:00 a 14:00', () => escribir(tit, 'Pan amasado recién salido del horno', () => escribir(hor, 'Lunes a sábado · 7:00 a 20:00', ciclo))));
new IntersectionObserver(([en], ob) => { if (en.isIntersecting){ demo = setTimeout(ciclo, 1800); ob.disconnect(); } }, {threshold:.5}).observe(document.getElementById('editor'));
}
/* Acordeón (igual al home) */
const pans = [...document.querySelectorAll('.pan')];
const abrir = p => pans.forEach(x => { x.classList.toggle('on', x === p); x.setAttribute('aria-expanded', x === p); });
pans.forEach(p => { p.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && abrir(p)); p.addEventListener('click', () => abrir(p)); });
/* Carrera antes / ahora */
const bA = document.getElementById('barAntes'), bH = document.getElementById('barAhora'), tA = document.getElementById('tAntes'), tH = document.getElementById('tAhora');
function carrera(p){
const pa = Math.min(1, p), ph = Math.min(1, p * 4.5);   // "ahora" termina mucho antes
bA.style.setProperty('--p', (pa * 100).toFixed(1) + '%'); bH.style.setProperty('--p', (ph * 100).toFixed(1) + '%');
tA.textContent = Math.round(pa * 3) + (Math.round(pa * 3) === 1 ? ' día' : ' días');
tH.textContent = Math.round(ph * 2) + ' min';
}
carrera(reduce || !hasG ? 1 : 0);
if (!hasG) return;
/* Bloques arrastrables */
gsap.registerPlugin(Draggable);
let z = 10;
document.querySelectorAll('.blq').forEach(b => Draggable.create(b, {type:'x,y', bounds:'#paginaB', onPress(){ this.target.style.zIndex = ++z; }}));
if (reduce) return;
/* Entrada del hero */
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('#editor', {y:80, rotate:6, opacity:0, duration:1.2, ease:'power3.out', delay:.25});
gsap.to('#heroTxt', {yPercent:-20, opacity:.3, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Carrera con el scroll */
const o = {p:0};
gsap.to(o, {p:1, ease:'none', onUpdate:() => carrera(o.p), scrollTrigger:{trigger:'#carrera', start:'top 80%', end:'bottom 40%', scrub:1}});
/* Acordeón avanza con el scroll en escritorio (como el home) */
if (matchMedia('(min-width:861px)').matches){
ScrollTrigger.create({trigger:'#acordeon', start:'top 70%', end:'bottom 20%', onUpdate:s => { const i = Math.min(pans.length - 1, Math.floor(s.progress * pans.length)); if (!pans[i].classList.contains('on')) abrir(pans[i]); }});
}
/* Bloques caen dentro de la página (como las reseñas del home) */
gsap.from('.blq', {y:-420, rotation:() => gsap.utils.random(-25, 25), opacity:0, duration:1, ease:'bounce.out', stagger:.12, scrollTrigger:{trigger:'#paginaB', start:'top 75%'}});
})();
