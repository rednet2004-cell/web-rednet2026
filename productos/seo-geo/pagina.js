/* Borrador J · SEO y GEO: buscador que te sube al #1, escalera de posiciones, respuesta de IA y 52 semanas */
(function(){
const {reduce, hasG} = RN;
/* 1 Buscador de ejemplo: se escribe una búsqueda y "Tu negocio" sube */
const consultas = ['reparación de notebooks cerca de mí', 'pastelería para cumpleaños en [tu comuna]', 'dentista con hora mañana', 'ferretería abierta hoy'];
const res = document.getElementById('res'), filas = [...res.children], bqTxt = document.getElementById('bqTxt'), bqPos = document.getElementById('bqPos'), chip = document.querySelector('.ia-chip');
const tu = res.querySelector('.tu'), alto = 66;
let orden = ['a', 'b', 'c', 'd', 'tu'];
const pintar = () => { orden.forEach((id, i) => res.querySelector(`[data-id="${id}"]`).style.transform = `translateY(${i * alto}px)`); const k = orden.indexOf('tu') + 1; bqPos.textContent = 'Tu negocio · #' + k; tu.classList.toggle('arriba', k === 1); };
const subir = a => { const i = orden.indexOf('tu'); orden.splice(i, 1); orden.splice(a, 0, 'tu'); pintar(); };
pintar();
if (reduce){ bqTxt.textContent = consultas[0]; subir(0); chip.classList.add('on'); }
else {
let q = 0;
const espera = ms => new Promise(r => setTimeout(r, ms));
(async function ciclo(){
for (;;){
orden = ['a', 'b', 'c', 'd', 'tu']; pintar(); chip.classList.remove('on'); bqTxt.textContent = '';
const t = consultas[q++ % consultas.length];
for (const c of t){ bqTxt.textContent += c; await espera(45); }
await espera(700); subir(2); await espera(1100); subir(0); await espera(700); chip.classList.add('on');
await espera(3200);
}
})();
}
/* 4 GEO: la respuesta de la IA se escribe y te nombra (o no) */
const respuestas = {
antes:{t:[['Algunas opciones conocidas son '], ['Competidor uno', 1], [' y '], ['Competidor dos', 1], ['. Revisa sus reseñas antes de ir. '], ['No encontré más negocios con información clara en tu zona.', 2]], f:[['competidor-uno.cl'], ['directorio.cl'], ['foro.cl']]},
con:{t:[['Una buena opción es '], ['Tu negocio', 1], [', en [tu comuna]. Reparan notebooks de todas las marcas, entregan diagnóstico en el día y sus clientes destacan que explican todo en simple. También puedes revisar '], ['Competidor uno', 1], ['.']], f:[['tunegocio.cl', 1], ['Google Maps · Tu negocio', 1], ['directorio.cl']]}
};
const ciA = document.getElementById('ciA'), ciF = document.getElementById('ciF');
let geoId = 0, geoModo = 'con';
function escribir(m){
const id = ++geoId, r = respuestas[m];
ciA.innerHTML = ''; ciF.innerHTML = '';
const ws = [];
r.t.forEach(([txt, tipo]) => {
const cont = tipo === 1 ? document.createElement('mark') : tipo === 2 ? Object.assign(document.createElement('span'), {className:'gris'}) : ciA;
txt.split(/(\s+)/).forEach(p => { if (!p) return; if (!p.trim()){ cont.append(p); return; } const s = document.createElement('span'); s.textContent = p; s.style.opacity = reduce ? 1 : 0; cont.append(s); ws.push(s); });
if (cont !== ciA) ciA.append(cont);
});
const fs = r.f.map(([txt, t]) => { const s = document.createElement('span'); s.textContent = txt; if (t) s.className = 'tu'; ciF.append(s); return s; });
if (reduce){ fs.forEach(s => s.classList.add('on')); return; }
ws.forEach((s, i) => setTimeout(() => { if (id === geoId) s.style.opacity = 1; }, i * 55));
fs.forEach((s, i) => setTimeout(() => { if (id === geoId) s.classList.add('on'); }, ws.length * 55 + 200 + i * 180));
}
document.querySelectorAll('#geoTg button').forEach(b => b.addEventListener('click', () => { geoModo = b.dataset.m; escribir(geoModo); }));
/* 5 52 semanas */
const semA = document.getElementById('semA'), semB = document.getElementById('semB');
for (let i = 0; i < 52; i++){ semA.append(document.createElement('i')); semB.append(document.createElement('i')); }
const sA = [...semA.children], sB = [...semB.children];
const semanas = p => { const n = Math.round(p * 52); sB.forEach((d, k) => d.classList.toggle('on', k < n)); sA[49].classList.toggle('on', n > 49); };
/* 3 Escalera */
const posN = document.getElementById('posN'), posPag = document.getElementById('posPag'), pel = [...document.getElementById('peldanos').children], hitos = [...document.getElementById('hitos').children], tarjeta = document.getElementById('tarjetaTu');
const marcas = [38, 27, 14, 6, 3, 1];
function escalera(p){
const f = p * (marcas.length - 1), k = Math.min(marcas.length - 2, Math.floor(f)), r = f - k;
const pos = Math.max(1, Math.round(marcas[k] + (marcas[k + 1] - marcas[k]) * r));
posN.textContent = '#' + pos;
posPag.textContent = pos > 30 ? 'Página 4' : pos > 20 ? 'Página 3' : pos > 10 ? 'Página 2' : pos > 3 ? 'Página 1' : pos > 1 ? 'Top 3' : 'Primer lugar';
const nivel = Math.round(f);
pel.forEach((e, i) => e.classList.toggle('on', i <= nivel));
hitos.forEach((h, i) => h.classList.toggle('on', i === Math.min(3, Math.floor(p * 4))));
const caja = document.getElementById('peldanos').getBoundingClientRect(), paso = (caja.height - 48) / (pel.length - 1);
tarjeta.style.transform = `translateY(${-f * paso}px)`;
}
if (!hasG || reduce){ escalera(1); semanas(1); escribir('con'); return; }
/* Entrada */
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.fromTo('.p-hero h1 em', {'--sub':0}, {'--sub':1, duration:1, ease:'power3.inOut', delay:.8});
gsap.from('#buscador', {y:80, rotate:3, opacity:0, duration:1.2, ease:'power3.out', delay:.3});
escalera(0);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#subeTrack', start:'top top', end:'bottom bottom', onUpdate:s => escalera(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'.escalera', start:'top 80%', end:'bottom 30%', onUpdate:s => escalera(s.progress)}); });
ScrollTrigger.create({trigger:'.chat-ia', start:'top 75%', once:true, onEnter:() => escribir(geoModo)});
gsap.from('.chat-ia', {y:60, rotate:-2, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:'.chat-ia', start:'top 85%'}});
semanas(0);
const o = {p:0};
gsap.to(o, {p:1, ease:'none', onUpdate:() => semanas(o.p), scrollTrigger:{trigger:'#anio', start:'top 75%', end:'bottom 40%', scrub:1}});
})();
