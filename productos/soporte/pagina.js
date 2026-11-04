/* Borrador I · Soporte: hilo rojo, "¿qué te pasa?", recorrido del ticket y bot vs persona */
(function(){
const {reduce, hasG} = RN;
/* Hilo rojo: una chispa recorre el hilo entre los dos lados */
const hilo = document.getElementById('hilo'), chispa = document.getElementById('chispa'), L = hilo.getTotalLength();
const ponerChispa = p => { const pt = hilo.getPointAtLength(L * p); chispa.setAttribute('cx', pt.x); chispa.setAttribute('cy', pt.y); };
ponerChispa(1);
if (!reduce){ let t0 = performance.now(); (function loop(now){ const p = ((now - t0) / 2200) % 1; ponerChispa(p < .5 ? p * 2 : 2 - p * 2); requestAnimationFrame(loop); })(t0); }
/* ¿Qué te pasa? (respuestas y tiempos de ejemplo) */
const casos = [
{canal:'Te responde por WhatsApp', t:'[3] min', msg:'Hola, ya lo estoy revisando. Veo que el servidor está bien; el problema es el certificado, que venció anoche.', pasos:['Revisamos el sitio y el servidor', 'Encontramos la causa: certificado vencido', 'Lo renovamos y activamos la renovación automática', 'Te avisamos cuando volvió a cargar'], fin:'✓ Resuelto · sitio en línea'},
{canal:'Te responde por correo y WhatsApp', t:'[10] min', msg:'Hola, revisé tu dominio: falta un registro para que los correos lleguen bien. Lo agrego ahora.', pasos:['Revisamos la configuración del dominio', 'Agregamos los registros que faltaban', 'Probamos enviando correos de prueba', 'Te mandamos la guía para tu celular'], fin:'✓ Resuelto · correos llegando'},
{canal:'Te responde por WhatsApp', t:'[2] min', msg:'Hola, te mandé un enlace seguro para crear una contraseña nueva. Si prefieres, te acompaño por llamada.', pasos:['Verificamos que seas tú', 'Te enviamos un enlace seguro', 'Te acompañamos mientras la cambias'], fin:'✓ Resuelto · acceso recuperado'},
{canal:'Te responde por WhatsApp', t:'[15] min', msg:'Hola, gracias por la captura. Una imagen está muy pesada y descuadra la página en celulares. La ajusto.', pasos:['Revisamos tu captura y el sitio en varios celulares', 'Ajustamos la imagen y el diseño', 'Te mandamos capturas de cómo quedó'], fin:'✓ Resuelto · se ve bien en celular'},
{canal:'Te responde una persona', t:'[—] min', msg:'Hola, cuéntame con tus palabras qué está pasando. Un audio o una captura también me sirven.', pasos:['Te escuchamos sin apuro', 'Te decimos qué haremos y cuánto se demora', 'Lo resolvemos y te contamos qué pasó'], fin:'✓ Siempre una persona del equipo'}
];
const msg = document.getElementById('rsMsg'), pasos = document.getElementById('rsPasos'), fin = document.getElementById('rsFin'), canal = document.getElementById('rsCanal'), tt = document.getElementById('rsT');
const chips = [...document.querySelectorAll('.chips-p button')];
let corrida = 0;
function caso(k){
const c = casos[k], id = ++corrida;
chips.forEach((b, i) => { b.classList.toggle('on', i === k); b.setAttribute('aria-selected', i === k); });
canal.textContent = c.canal; tt.textContent = c.t; msg.textContent = c.msg;
pasos.innerHTML = ''; fin.textContent = c.fin; fin.classList.remove('on');
c.pasos.forEach(p => { const li = document.createElement('li'); li.textContent = p; pasos.appendChild(li); });
const lis = [...pasos.children];
if (reduce){ lis.forEach(l => l.classList.add('ok')); fin.classList.add('on'); return; }
if (hasG) gsap.from(msg, {y:14, opacity:0, duration:.5, ease:'power3.out'});
lis.forEach((l, i) => setTimeout(() => { if (id === corrida) l.classList.add('ok'); }, 500 + i * 550));
setTimeout(() => { if (id === corrida) fin.classList.add('on'); }, 500 + lis.length * 550);
}
chips.forEach((b, i) => b.addEventListener('click', () => caso(i)));
caso(0);
/* Bot vs persona: el chat sigue al toggle */
const cmp = document.getElementById('chatCmp');
document.querySelectorAll('.bot-sec .toggle button').forEach(b => b.addEventListener('click', () => cmp.dataset.m = b.dataset.m));
/* Recorrido del ticket */
const recV = document.getElementById('recV'), items = [...recV.children], tkE = document.getElementById('tkEstado'), tkB = document.getElementById('tkBarra');
const estados = ['Recibido', 'Asignado a [Nombre]', 'En curso', 'Resuelto ✓'];
function ticket(i){ items.forEach((li, k) => li.classList.toggle('on', k <= i)); tkE.textContent = estados[i]; tkB.style.width = ((i + 1) * 25) + '%'; }
ticket(0);
if (!hasG || reduce){ ticket(3); recV.style.setProperty('--p', '100%'); return; }
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('.lado.tu', {x:-80, opacity:0, duration:1.1, ease:'power3.out', delay:.4});
gsap.from('.lado.rn', {x:80, opacity:0, duration:1.1, ease:'power3.out', delay:.6});
gsap.set(hilo, {strokeDasharray:L}); gsap.fromTo(hilo, {strokeDashoffset:L}, {strokeDashoffset:0, duration:1.2, ease:'power2.inOut', delay:.9});
ScrollTrigger.create({trigger:recV, start:'top 55%', end:'bottom 55%', onUpdate:s => { recV.style.setProperty('--p', (s.progress * 100).toFixed(1) + '%'); ticket(Math.min(3, Math.floor(s.progress * 4.2))); }});
gsap.from('.resol', {y:60, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:'.resol', start:'top 80%'}});
})();
