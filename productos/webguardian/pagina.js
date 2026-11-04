/* Borrador G · WebGuardian: radar, noche de guardia con registro y escudo de capas */
(function(){
const {reduce, hasG} = RN;
/* Radar: el chip cuenta lo que va encontrando */
const radarTxt = document.getElementById('radarTxt');
const msgs = ['Todo en orden', 'Intento bloqueado', 'Revisión completa', 'Todo en orden', 'Plugin actualizado'];
if (!reduce){ let k = 0; setInterval(() => { radarTxt.textContent = msgs[k = (k + 1) % msgs.length]; }, 2000); }
/* Noche de guardia: eventos de ejemplo entre 22:00 y 07:00 (minutos desde las 22:00) */
const eventos = [
[8, 'ok', 'Revisión', 'Sitio en línea · respuesta normal'],
[47, 'bloq', 'Bloqueado', 'Intento de acceso a /wp-admin desde IP desconocida'],
[95, 'act', 'Actualizado', 'Plugin de formularios a la última versión'],
[130, 'bloq', 'Bloqueado', '12 intentos de contraseña seguidos'],
[188, 'ok', 'Revisión', 'Escaneo de malware: limpio'],
[236, 'bloq', 'Bloqueado', 'Tráfico sospechoso desde una red de bots'],
[290, 'act', 'Actualizado', 'WordPress a la versión de seguridad'],
[330, 'ok', 'Respaldo', 'Copia diaria guardada'],
[388, 'bloq', 'Bloqueado', 'Intento de subir un archivo malicioso'],
[452, 'act', 'Actualizado', 'Tema y 2 plugins probados y actualizados'],
[505, 'ok', 'Revisión', 'Todo en orden · informe listo para la mañana'],
[535, 'ok', 'Revisión', 'Sitio en línea · 07:00']
];
const lista = document.getElementById('regLista'), horaG = document.getElementById('horaG');
const cB = document.getElementById('cBloq'), cA = document.getElementById('cAct'), cR = document.getElementById('cRev');
const hhmm = m => { const t = (22 * 60 + m) % 1440; return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); };
let mostrados = 0;
function noche(p){
const m = Math.round(p * 540);
horaG.textContent = hhmm(m);
const n = eventos.filter(e => e[0] <= m).length;
if (n < mostrados){ lista.innerHTML = ''; mostrados = 0; }
for (; mostrados < n; mostrados++){
const [t, tipo, etq, txt] = eventos[mostrados];
const li = document.createElement('li');
li.innerHTML = `<time>${hhmm(t)}</time><span class="tag ${tipo}">${etq}</span><span></span>`;
li.lastChild.textContent = txt;
lista.appendChild(li);
}
const vis = eventos.slice(0, n);
cB.textContent = vis.filter(e => e[1] === 'bloq').length;
cA.textContent = vis.filter(e => e[1] === 'act').length;
cR.textContent = vis.filter(e => e[1] === 'ok').length;
}
noche(reduce || !hasG ? 1 : 0);
/* Escudo de capas */
const caps = [...document.querySelectorAll('.cap')], lis = [...document.querySelectorAll('#listaCapas li')];
const largos = caps.map(c => 2 * Math.PI * c.r.baseVal.value);
function capas(p){
caps.forEach((c, i) => {
const k = Math.min(1, Math.max(0, p * caps.length - i));
c.style.strokeDasharray = largos[i]; c.style.strokeDashoffset = largos[i] * (1 - k);
c.classList.toggle('on', k > 0);
lis[i].classList.toggle('on', k > 0);
});
}
capas(reduce || !hasG ? 1 : 0);
if (!hasG || reduce) return;
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('#radar', {scale:.7, opacity:0, duration:1.3, ease:'power3.out', delay:.2});
gsap.to('#heroTxt', {yPercent:-20, opacity:.3, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Noche: fijada en escritorio */
const o = {p:0};
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => {
gsap.to(o, {p:1, ease:'none', onUpdate:() => noche(o.p), scrollTrigger:{trigger:'.guardia-sec', start:'top top', end:'+=' + innerHeight * 2, pin:true, scrub:.5}});
});
mm.add('(max-width:860px)', () => {
gsap.to(o, {p:1, ease:'none', onUpdate:() => noche(o.p), scrollTrigger:{trigger:'.registro', start:'top 80%', end:'bottom 20%', scrub:.5}});
});
/* Capas: se dibujan con el scroll */
const c = {p:0};
gsap.to(c, {p:1, ease:'none', onUpdate:() => capas(c.p), scrollTrigger:{trigger:'.capas-sec', start:'top 70%', end:'bottom 70%', scrub:1}});
gsap.from('#informe', {y:80, rotate:10, opacity:0, duration:1.1, ease:'power3.out', scrollTrigger:{trigger:'#informe', start:'top 80%'}});
gsap.from('.inf-fila i', {'--w':'0%', duration:1.2, ease:'power3.out', stagger:.1, scrollTrigger:{trigger:'#informe', start:'top 70%'}});
})();
