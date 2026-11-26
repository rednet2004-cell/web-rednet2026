/* Borrador P09 · Publicador Inteligente: artículo que se escribe, aprueba y sella; mesa de redacción con el scroll; destinos; año que se llena */
(function(){
const {reduce, hasG} = RN;
/* 1 Hero: ciclo tema → borrador → aprobado → publicado, cambiando de destino */
const ciclos = [
['Climatización', '5 señales de que tu aire acondicionado necesita mantención', 'Tu sitio web'],
['Colegio', 'Guía de tallas para uniformes escolares', 'Tu app'],
['Corredora', 'Qué revisar antes de arrendar una oficina', 'Tu portal de clientes'],
['Clínica', 'Cómo preparar tu primera consulta', 'Tu sistema']
];
const ed = document.getElementById('editor'), tit = document.getElementById('edTit'), tema = document.getElementById('edTema'), dest = document.getElementById('edDest'), est = document.getElementById('edEst'), ok = document.getElementById('edOk'), selloTxt = document.getElementById('selloTxt'), ult = document.getElementById('ultima'), ultTxt = document.getElementById('ultTxt');
const pinta = ([t, h, d], fin) => { tema.textContent = 'Tema · ' + t; dest.textContent = 'Destino · ' + d; selloTxt.textContent = 'Hoy · 09:00 · ' + d; if (fin) tit.textContent = h; };
if (reduce){
pinta(ciclos[0], true); ed.classList.add('escribe', 'ok', 'pub'); est.textContent = 'Aprobado'; ok.textContent = 'Aprobado ✓'; ult.classList.add('al-dia'); ultTxt.textContent = 'hoy';
} else {
let n = 0, timers = [];
const t = (fn, ms) => timers.push(setTimeout(fn, ms));
function ciclo(){
const c = ciclos[n % ciclos.length]; pinta(c, false);
ed.classList.remove('escribe', 'ok', 'pub'); est.textContent = 'Borrador'; ok.textContent = 'Aprobar';
if (n > 0){ ult.classList.remove('al-dia'); ultTxt.textContent = 'hace 2 semanas'; }
tit.innerHTML = '<span class="cur"></span>';
const txt = c[1]; let i = 0;
const esc = setInterval(() => { i++; tit.textContent = txt.slice(0, i); const cur = document.createElement('span'); cur.className = 'cur'; tit.append(cur); if (i >= txt.length){ clearInterval(esc); } }, 38);
const dur = txt.length * 38;
t(() => { ed.classList.add('escribe'); est.textContent = 'Borrador · revisado'; }, dur + 200);
t(() => { ed.classList.add('ok'); ok.textContent = 'Aprobado ✓'; est.textContent = 'Aprobado'; tit.textContent = txt; }, dur + 1400);
t(() => { ed.classList.add('pub'); ult.classList.add('al-dia'); ultTxt.textContent = 'hoy'; }, dur + 2200);
t(() => { n++; ciclo(); }, dur + 4600);
}
setTimeout(ciclo, 900);
}
/* 4 Mesa de redacción */
const mesa = document.getElementById('mesa'), pasos = [...document.querySelectorAll('#pasos li')];
const paso = i => { if (mesa.dataset.paso == i) return; mesa.dataset.paso = i; pasos.forEach((li, k) => li.classList.toggle('on', k === i)); };
/* 5 Destinos */
const tabs = [...document.querySelectorAll('#cDest button')];
tabs.forEach(b => b.addEventListener('click', () => {
tabs.forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
}));
/* 6 Un año de constancia */
const meses = document.getElementById('meses'), anioN = document.getElementById('anioN');
const nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const barras = [];
nombres.forEach(m => { const d = document.createElement('div'); d.className = 'mes'; const s = document.createElement('small'); s.textContent = m; d.append(s); for (let k = 0; k < 2; k++){ const i = document.createElement('i'); d.append(i); barras.push(i); } meses.append(d); });
const llena = p => { const n = Math.round(p * barras.length); barras.forEach((b, k) => b.classList.toggle('on', k < n)); anioN.textContent = n; };
if (!hasG || reduce){ paso(3); pasos.forEach(li => li.classList.add('on')); llena(1); return; }
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('#editor', {y:90, rotate:6, opacity:0, duration:1.2, ease:'power3.out', delay:.25});
gsap.from('#ultima', {y:-30, opacity:0, duration:.9, ease:'power3.out', delay:.6});
const porP = p => paso(p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#flujoTrack', start:'top top', end:'bottom bottom', onUpdate:s => porP(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#mesa', start:'top 80%', end:'bottom 20%', onUpdate:s => porP(s.progress)}); });
ScrollTrigger.create({trigger:'#anio', start:'top 80%', end:'bottom 45%', scrub:true, onUpdate:s => llena(s.progress)});
gsap.from('#anio', {y:70, rotate:2, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:'#anio', start:'top 88%'}});
})();
