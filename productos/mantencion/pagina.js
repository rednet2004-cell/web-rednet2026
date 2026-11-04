/* Borrador O · Mantención Web: chequeo con pulso, perilla de 12 meses, mes que se completa con el scroll y pedidos que pasan a "hecho" */
(function(){
const {reduce, hasG} = RN;
const espera = ms => new Promise(r => setTimeout(r, ms));
/* 1 Chequeo continuo */
const items = [...document.querySelectorAll('#chLista li')], chEst = document.getElementById('chEst');
if (reduce){ items.forEach(i => i.classList.add('ok')); chEst.textContent = 'Todo en orden'; }
else (async function(){
for (;;){
items.forEach(i => i.classList.remove('ok', 'rev')); chEst.textContent = 'Revisando…';
await espera(600);
for (const i of items){ i.classList.add('rev'); await espera(650); i.classList.replace('rev', 'ok'); }
chEst.textContent = 'Todo en orden'; await espera(3800);
}
})();
/* 3 Perilla de 12 meses */
const perilla = document.getElementById('perilla'), pomo = document.getElementById('pomo'), marcas = document.getElementById('marcas');
for (let k = 0; k < 12; k++){ const i = document.createElement('i'); i.style.transform = `rotate(${k * 30}deg) translateY(-104px)`; if (!k) i.className = 'cero'; marcas.append(i); }
const ms = [...marcas.children], sin = document.getElementById('sitioSin');
const $ = id => document.getElementById(id);
let mesAct = -1;
function mes(m){
const mi = Math.max(0, Math.min(12, Math.round(m)));
if (mi === mesAct) return; mesAct = mi;
$('pMes').textContent = mi; $('pMesTxt').textContent = mi === 1 ? 'mes' : 'meses';
perilla.setAttribute('aria-valuenow', mi);
$('sAct').textContent = mi * 4; $('sEnl').textContent = Math.floor(mi * 1.5);
$('sVel').textContent = (1.8 + mi * .35).toFixed(1).replace('.', ',') + ' s'; $('sSeg').textContent = mi >= 6 ? mi - 5 : 0;
$('tN').textContent = mi * 14;
sin.style.setProperty('--d', (mi / 12).toFixed(2));
['m3', 'm6', 'm9'].forEach(c => sin.classList.toggle(c, mi >= +c.slice(1)));
sin.classList.remove('m12'); if (mi === 12){ void sin.offsetWidth; sin.classList.add('m12'); }
ms.forEach((e, k) => e.classList.toggle('on', k > 0 && k <= mi));
}
mes(0);
let drag = null;
const girar = r => { if (hasG) gsap.set(pomo, {rotation:r}); else pomo.style.transform = `rotate(${r}deg)`; if (drag) drag.update(); mes(r / 30); };
perilla.addEventListener('keydown', e => {
const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
if (!d) return; e.preventDefault(); girar(Math.max(0, Math.min(12, mesAct + d)) * 30);
});
if (hasG && typeof Draggable !== 'undefined'){
gsap.registerPlugin(Draggable);
drag = Draggable.create(pomo, {type:'rotation', bounds:{minRotation:0, maxRotation:360}, onDrag(){ mes(this.rotation / 30); }, onThrowUpdate(){ mes(this.rotation / 30); }})[0];
} else perilla.addEventListener('click', () => girar(((mesAct + 1) % 13) * 30));
/* 4 Semanas */
const lis = [...document.querySelectorAll('#semanas li')], sems = [...document.querySelectorAll('#semanas .sem')];
function semanas(p){ const n = Math.round(p * lis.length); lis.forEach((l, k) => l.classList.toggle('ok', k < n)); sems.forEach(s => s.classList.toggle('lista', [...s.querySelectorAll('li')].every(l => l.classList.contains('ok')))); }
/* 5 Pídelo */
const pedidos = [['Cambiar un precio', '"El menú del día ahora cuesta $[—]."'], ['Subir fotos nuevas', '"Te mando 6 fotos del local renovado."'], ['Nuevo horario', '"En verano abrimos de 9:00 a 21:00."'], ['Agregar un banner', '"Quiero avisar del descuento de aniversario."']];
const est = [...document.querySelectorAll('#tkEst li')], pbs = [...document.querySelectorAll('#pedidos button')];
let pid = 0;
async function pedir(k){
const id = ++pid; $('tkTit').textContent = pedidos[k][0]; $('tkDet').textContent = pedidos[k][1];
est.forEach(e => e.classList.remove('on'));
if (reduce){ est.forEach(e => e.classList.add('on')); return; }
for (let i = 0; i < est.length; i++){ await espera(i ? 900 : 300); if (id !== pid) return; est[i].classList.add('on'); }
}
pbs.forEach((b, k) => b.addEventListener('click', () => { pbs.forEach(x => x.classList.toggle('on', x === b)); pedir(k); }));
if (!hasG || reduce){ semanas(1); pedir(0); return; }
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('.chequeo', {y:80, opacity:0, duration:1.1, ease:'power3.out', delay:.25});
/* La perilla se gira sola una vez para mostrar que se puede */
ScrollTrigger.create({trigger:'#perilla', start:'top 70%', once:true, onEnter:() => {
const o = {r:0};
gsap.to(o, {r:180, duration:1.6, ease:'power2.inOut', delay:.2, onUpdate:() => girar(o.r)});
}});
semanas(0);
const s = {p:0};
gsap.to(s, {p:1, ease:'none', onUpdate:() => semanas(s.p), scrollTrigger:{trigger:'#semanas', start:'top 80%', end:'bottom 45%', scrub:1}});
ScrollTrigger.create({trigger:'#ticket', start:'top 80%', once:true, onEnter:() => pedir(0)});
gsap.from('#ticket', {y:60, rotate:2, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:'#ticket', start:'top 88%'}});
})();
