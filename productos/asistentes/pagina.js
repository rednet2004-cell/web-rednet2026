/* Borrador K · Asistentes Virtuales: vitrina día→noche, prueba por rubro/tono/canal, carrera de la respuesta y pasos arrastrables */
(function(){
const {reduce, hasG} = RN;
const espera = ms => new Promise(r => setTimeout(r, ms));
/* 1 Vitrina: el reloj corre de 17:00 a 02:00; a las 20:00 el letrero pasa a "Cerrado" y el asistente sigue */
const vit = document.getElementById('vitrina'), reloj = document.getElementById('reloj'), astro = vit.querySelector('.astro'), flujo = document.getElementById('flujo');
const charlas = [
['WhatsApp', '¿Atienden mañana sábado?', '¡Hola! Sí, de 10:00 a 14:00. ¿Te reservo una hora?'],
['Telegram', '¿Cuánto cuesta el despacho?', 'Dentro de [tu comuna] es $[—] y llega en 24 h.'],
['Llamada', '¿Puedo cambiar mi hora del lunes?', 'Listo, te la cambié al martes 11:00 ✓'],
['WhatsApp', '¿Tienen estacionamiento?', 'Sí, frente al local. Te mando la ubicación 📍'],
['WhatsApp', '¿Aceptan transferencia?', '¡Sí! Te paso los datos por aquí mismo.']
];
const dosD = v => String(v).padStart(2, '0');
function hora(min){ min = Math.round(min) % 1440; return dosD(Math.floor(min / 60)) + ':' + dosD(min % 60); }
function cielo(min){
const u = (min - 1020) / 540; // 17:00 → 02:00
const n = Math.max(0, Math.min(1, (min - 1140) / 120)); // oscurece de 19:00 a 21:00
vit.style.setProperty('--n', n.toFixed(3));
vit.classList.toggle('noche', min >= 1200);
reloj.textContent = hora(min);
astro.style.left = (38 + u * 44) + '%'; astro.style.top = (min < 1200 ? 18 + u * 110 : 22) + '%';
}
function burbuja(cls, txt, label){ const d = document.createElement('div'); d.className = 'm ' + cls; if (label){ const s = document.createElement('small'); s.textContent = label; d.append(s); } d.append(txt); flujo.append(d); while (flujo.children.length > 5) flujo.firstChild.remove(); }
if (reduce){ cielo(1394); burbuja('c', charlas[0][1], 'Cliente · ' + charlas[0][0]); burbuja('a', charlas[0][2], 'Asistente · 2 s'); }
else {
let t0 = performance.now();
(function loop(now){ const min = 1020 + ((now - t0) / 22000 % 1) * 540; cielo(min); requestAnimationFrame(loop); })(t0);
(async function(){ let k = 0; await espera(900); for (;;){ const [c, q, a] = charlas[k++ % charlas.length]; burbuja('c', q, 'Cliente · ' + c); await espera(1100); burbuja('a', a, 'Asistente · respondido en 2 s'); await espera(2600); } })();
}
/* 3 Pruébalo: rubro × tono × canal */
const rubros = [
{n:'[Tu clínica]', q:'¿Tienen hora para una limpieza esta semana?', r:['¡Hola! Sí, tenemos el jueves a las 10:00 o a las 16:30. ¿Cuál te acomoda? Te la dejo reservada al tiro.', 'Buenas noches. Sí, tenemos horas disponibles el jueves a las 10:00 y a las 16:30. ¿Desea que le reserve alguna?', '¡Hola! Tus dientes van a estar felices 😁 Hay hora el jueves a las 10:00 o a las 16:30. ¿Cuál te guardo?']},
{n:'[Tu restaurante]', q:'¿Puedo reservar para 6 personas el sábado en la noche?', r:['¡Hola! Sí, para 6 el sábado tenemos a las 20:30 o a las 21:30. ¿A nombre de quién la dejo?', 'Buenas noches. Sí, tenemos mesa para 6 personas el sábado a las 20:30 o a las 21:30. ¿A nombre de quién la reservo?', '¡Hola! Mesa para 6, el mejor plan 🍷 Hay a las 20:30 o a las 21:30. ¿A nombre de quién?']},
{n:'[Tu ferretería]', q:'¿Tienen taladro percutor y hacen despacho?', r:['¡Hola! Sí, tenemos varios desde $[—] y despachamos en 24 horas dentro de [tu comuna]. ¿Te mando las opciones?', 'Buenas noches. Sí, contamos con taladros percutores desde $[—] y despacho en 24 horas dentro de [tu comuna]. ¿Le envío las opciones?', '¡Hola! Sí, y con harta potencia 🔩 Desde $[—], con despacho en 24 horas en [tu comuna]. ¿Te mando las opciones?']},
{n:'[Tu inmobiliaria]', q:'¿El depto de 2 dormitorios sigue disponible? ¿Puedo verlo?', r:['¡Hola! Sí, sigue disponible. ¿Te acomoda verlo el martes o el miércoles? Dime la hora y lo agendo.', 'Buenas noches. Sí, la propiedad sigue disponible. Podemos coordinar una visita el martes o el miércoles. ¿Qué horario le acomoda?', '¡Hola! Sigue disponible y con harta luz ☀️ ¿Lo vamos a ver el martes o el miércoles?']}
];
const est = {r:0, t:0, c:'wa'};
const tel = document.getElementById('tel'), telChat = document.getElementById('telChat'), trans = document.getElementById('trans'), pie = document.getElementById('telPie'), onda = document.getElementById('onda');
for (let i = 0; i < 26; i++){ const b = document.createElement('i'); b.style.animationDelay = (-Math.random()).toFixed(2) + 's'; b.style.animationDuration = (.5 + Math.random() * .7).toFixed(2) + 's'; onda.append(b); }
let pid = 0;
async function probar(){
const id = ++pid, R = rubros[est.r], resp = R.r[est.t];
tel.dataset.c = est.c;
document.getElementById('telNom').textContent = R.n;
document.getElementById('telEst').textContent = est.c === 'wa' ? 'en línea · 23:41' : est.c === 'tg' ? 'bot · 23:41' : 'llamada entrante · 23:41';
pie.classList.remove('on'); telChat.innerHTML = ''; trans.innerHTML = '';
const lenta = reduce ? 0 : 1;
if (est.c === 'll'){
const p1 = document.createElement('p'), p2 = document.createElement('p');
p1.innerHTML = '<b>Cliente</b>'; p1.append(R.q); p2.innerHTML = '<b>Asistente</b>'; p2.append(resp.replace(/\s*\p{Extended_Pictographic}\uFE0F?/gu, '.'));
trans.append(p1, p2);
await espera(200 * lenta); if (id !== pid) return; p1.classList.add('on');
await espera(1400 * lenta); if (id !== pid) return; p2.classList.add('on');
} else {
const add = (cls, txt) => { const d = document.createElement('div'); d.className = 'm ' + cls; d.textContent = txt; telChat.append(d); if (!reduce && hasG) gsap.from(d, {y:16, opacity:0, duration:.45, ease:'power3.out'}); return d; };
add('c', R.q);
if (lenta){ await espera(500); if (id !== pid) return; const esc = add('a esc', '• • •'); await espera(900); esc.remove(); if (id !== pid) return; }
add('a', resp);
}
await espera(300 * lenta); if (id === pid) pie.classList.add('on');
}
function chips(idG, clave, val){
const bs = [...document.querySelectorAll('#' + idG + ' button')];
bs.forEach((b, i) => b.addEventListener('click', () => { bs.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); est[clave] = val(b, i); probar(); }));
}
chips('cRubro', 'r', (b, i) => i); chips('cTono', 't', (b, i) => i); chips('cCanal', 'c', b => b.dataset.c);
/* 4 Carrera de la respuesta */
const carr = document.getElementById('carrera'), evs = [...carr.querySelectorAll('.ev')], cab = document.getElementById('cabezal'), horaG = document.getElementById('horaG');
carr.querySelectorAll('.linea').forEach(l => [...l.children].forEach((e, i) => { const t = +e.dataset.t; e.style.left = `calc(${t} * (100% - min(210px, 22vw)))`; e.style.top = (10 + (i % 3) * 68) + 'px'; }));
function carrera(p){
const lin = carr.querySelector('.linea'), w = lin.offsetWidth - Math.min(210, innerWidth * .22);
cab.style.transform = `translateX(${p * w}px)`;
evs.forEach(e => e.classList.toggle('on', p >= +e.dataset.t - .001));
horaG.textContent = hora(1394 + p * 616);
}
/* 5 Pasos arrastrables */
const vp = document.querySelector('.pasos-vp'), pasos = document.getElementById('pasos');
if (!hasG){ carrera(1); probar(); return; }
let drag;
if (typeof Draggable !== 'undefined'){
gsap.registerPlugin(Draggable);
const lim = () => ({minX:Math.min(0, vp.clientWidth - pasos.scrollWidth - parseFloat(getComputedStyle(vp).paddingLeft)), maxX:0});
drag = Draggable.create(pasos, {type:'x', bounds:lim(), edgeResistance:.85, dragResistance:.05, cursor:'grab', activeCursor:'grabbing', allowNativeTouchScrolling:true})[0];
addEventListener('resize', () => drag.applyBounds(lim()));
}
if (reduce){ carrera(1); probar(); return; }
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('#vitrina', {y:90, opacity:0, rotate:2, duration:1.2, ease:'power3.out', delay:.25});
ScrollTrigger.create({trigger:'#tel', start:'top 80%', once:true, onEnter:probar});
gsap.from('#tel', {y:80, opacity:0, duration:1.1, ease:'power3.out', scrollTrigger:{trigger:'#tel', start:'top 90%'}});
gsap.from('.pa', {x:120, opacity:0, duration:1, ease:'power3.out', stagger:.08, scrollTrigger:{trigger:'#pasos', start:'top 85%'}});
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { carrera(0); ScrollTrigger.create({trigger:carr, start:'top top', end:'bottom bottom', onUpdate:s => carrera(s.progress)}); });
mm.add('(max-width:860px)', () => { evs.forEach(e => e.classList.add('on')); horaG.textContent = '09:30'; });
})();
