/* Borrador P17 · Mantención RRSS: perfil que pasa de abandonado a mantenido; comparador arrastrable; taller que ordena fotos en destacados; mes de tareas */
(function(){
const {reduce, hasG} = RN;
const $ = id => document.getElementById(id);
/* 1 Hero: alterna sin / con mantención */
const vit = $('vitrina');
if (reduce) vit.dataset.estado = 'despues';
else setInterval(() => { vit.dataset.estado = vit.dataset.estado === 'antes' ? 'despues' : 'antes'; }, 3500);
/* 3 Comparador: se arrastra la línea */
const comp = $('comp');
let arrastra = false;
const mover = e => { const r = comp.getBoundingClientRect(); const p = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)); comp.style.setProperty('--corte', p + '%'); };
comp.addEventListener('pointerdown', e => { arrastra = true; comp.setPointerCapture(e.pointerId); mover(e); });
comp.addEventListener('pointermove', e => { if (arrastra) mover(e); });
comp.addEventListener('pointerup', () => { arrastra = false; });
/* 4 Taller */
const taller = $('taller'), zona = $('tlZona'), pasos = [...document.querySelectorAll('#pasos li')];
const cols = [...zona.querySelectorAll('.tl-col')], labs = [...zona.querySelectorAll('.tl-lab')], tlN = $('tlN'), tlCuenta = $('tlCuenta');
const PAL = [['#E30613','#7A0910'],['#D9C6EC','#8E6FA8'],['#C8892B','#7E520F'],['#EDCB93','#C8892B'],['#5B3A66','#D9C6EC'],['#B0040F','#EDCB93']];
const fotos = [], sueltas = [];
for (let k = 0; k < 30; k++){ const f = document.createElement('i'); f.className = 'ft'; const [a, b] = PAL[k % PAL.length]; f.style.setProperty('--c', a); f.style.setProperty('--c2', b); zona.prepend(f); fotos.push(f); sueltas.push([Math.random(), Math.random(), Math.random() * 30 - 15]); }
let pasoAct = -1;
function ubicar(){
const W = zona.clientWidth, H = zona.clientHeight, t = 40, cx = g => W * (g * 2 + 1) / 6;
cols.forEach((c, g) => c.style.left = cx(g) + 'px');
fotos.forEach((f, k) => {
const g = k % 3, j = Math.floor(k / 3); let x, y, r = 0, s = 1, o = 1;
if (pasoAct <= 0){ [x, y, r] = sueltas[k]; x = x * (W - t); y = 20 + y * (H - 150); }
else if (pasoAct === 1){ x = cx(g) - t - 3 + (j % 2) * (t + 6); y = 26 + Math.floor(j / 2) * (t * .46); }
else { x = cx(g) - t / 2; y = H - 70; s = .3; o = 0; }
f.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`; f.style.opacity = o;
});
}
const paso = i => { if (pasoAct === i) return; pasoAct = i; taller.dataset.paso = i; pasos.forEach((li, k) => li.classList.toggle('on', k === i)); tlCuenta.firstChild.textContent = i >= 2 ? 'En tus destacados: ' : 'En tu Instagram: '; tlN.textContent = i >= 2 ? '30' : '4'; ubicar(); };
addEventListener('resize', ubicar);
const RUBROS = {eventos:[['Matrimonios','Empresas','Cumpleaños'],'Hola, ¿tienen fecha para un matrimonio en marzo?'], belleza:[['Uñas','Pestañas','Color'],'Hola, ¿tienes hora para el sábado en la mañana?'], restaurantes:[['Platos','El local','Eventos'],'Hola, ¿se puede reservar para 12 personas el viernes?'], gimnasios:[['Clases','Horarios','Planes'],'Hola, ¿cuánto sale el plan mensual?']};
const bRub = [...document.querySelectorAll('#rubros button')];
const rubro = r => { bRub.forEach(b => b.setAttribute('aria-pressed', b.dataset.r === r)); RUBROS[r][0].forEach((t, k) => { cols[k].textContent = t; labs[k].textContent = t; }); $('tlDm').textContent = RUBROS[r][1]; };
bRub.forEach(b => b.addEventListener('click', () => rubro(b.dataset.r)));
rubro('eventos');
/* Mes */
const tareas = [...document.querySelectorAll('.tarea')], mesN = $('mesN');
const llena = p => { const c = Math.round(p * tareas.length); tareas.forEach((t, k) => t.classList.toggle('on', k < c)); mesN.textContent = c; };
if (!hasG || reduce){ paso(2); pasos.forEach(li => li.classList.add('on')); llena(1); return; }
paso(0);
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('.perfil', {y:90, rotate:6, opacity:0, duration:1.2, ease:'power3.out', delay:.25});
const porP = p => paso(p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#flujoTrack', start:'top top', end:'bottom bottom', onUpdate:s => porP(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#taller', start:'top 80%', end:'bottom 20%', onUpdate:s => porP(s.progress)}); });
llena(0);
ScrollTrigger.create({trigger:'#mesT', start:'top 80%', end:'bottom 45%', scrub:true, onUpdate:s => llena(s.progress)});
})();
