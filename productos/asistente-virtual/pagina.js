/* Borrador C · Asistente Virtual: chat por canal, historia con teléfono fijo y anillo de 24 horas */
(function(){
const {reduce, hasG} = RN;
/* Conversaciones de ejemplo por canal */
const guiones = {
wsp:{canal:'Asistente IA · WhatsApp', msgs:[['cli','Hola, ¿abren el sábado?'],['bot','¡Hola! Sí, el sábado abrimos de 10:00 a 14:00. ¿Quieres que te reserve una hora?'],['cli','Sí, a las 11 porfa'],['bot','Listo, quedaste agendado el sábado a las 11:00. Te mandé la confirmación por aquí mismo.'],['ok','✓ Reserva creada · 6 s']]},
tg:{canal:'Asistente IA · Telegram', msgs:[['cli','¿Tienen despacho a regiones?'],['bot','Sí, despachamos a todo Chile. A regiones demora [2 a 4] días hábiles. ¿A qué ciudad sería?'],['cli','Temuco'],['bot','Perfecto. Te dejo el link de compra con el despacho a Temuco ya calculado.'],['ok','✓ Link de pago enviado · 5 s']]},
tel:{canal:'Asistente IA · Llamada', msgs:[['cli','Aló, quería saber si atienden hoy en la tarde.'],['bot','Hola, sí, hoy atendemos hasta las 19:00. ¿Te agendo una hora?'],['cli','Ya, a las cinco.'],['bot','Listo, quedaste a las 17:00. Te llega un SMS con la confirmación.'],['ok','✓ Hora agendada por voz']]}
};
const tel = document.getElementById('telefono'), telMsgs = document.getElementById('telMsgs'), telCanal = document.getElementById('telCanal');
const onda = document.getElementById('telOnda');
for (let i = 0; i < 24; i++){ const b = document.createElement('i'); b.style.animationDelay = (i * .07 % 1).toFixed(2) + 's'; onda.appendChild(b); }
let corrida = 0;
function pintar(caja, guion, inst){
const id = ++corrida; caja.innerHTML = '';
const poner = ([t, s]) => { const d = document.createElement('div'); d.className = 'm ' + t; d.textContent = s; caja.appendChild(d); return d; };
if (inst){ guion.forEach(poner); return; }
let i = 0;
(function sig(){
if (id !== corrida || i >= guion.length) return;
const g = guion[i++];
let esc = null;
if (g[0] === 'bot'){ esc = document.createElement('div'); esc.className = 'm esc'; esc.innerHTML = '<i></i><i></i><i></i>'; caja.appendChild(esc); }
setTimeout(() => {
if (id !== corrida) return;
esc && esc.remove();
const d = poner(g);
if (hasG) gsap.from(d, {y:14, opacity:0, duration:.45, ease:'power3.out'});
setTimeout(sig, 700);
}, g[0] === 'bot' ? 1100 : 400);
})();
}
function canal(c){
document.querySelectorAll('.canales button').forEach(b => { const on = b.dataset.c === c; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
tel.dataset.c = c; telCanal.textContent = guiones[c].canal;
pintar(telMsgs, guiones[c].msgs, reduce);
}
document.querySelectorAll('.canales button').forEach(b => b.addEventListener('click', () => canal(b.dataset.c)));
canal('wsp');
/* Historia: cada paso muestra una conversación distinta en el teléfono fijo */
const pasosChat = [
[['cli','23:40 · ¿Todavía atienden?'],['bot','¡Hola! Ahora estamos cerrados, pero te ayudo yo. ¿Qué necesitas?']],
[['cli','¿Cuánto sale el corte de pelo?'],['bot','El corte sale $[—] y dura unos 40 minutos. Si quieres, te dejo una hora tomada para mañana 😊']],
[['cli','Mañana a las 10'],['bot','Listo, quedaste mañana a las 10:00.'],['ok','✓ Reserva creada en tu calendario']],
[['cli','Quiero hacer un reclamo por un cobro'],['bot','Entiendo. Te paso con una persona del equipo para revisarlo contigo.'],['ok','→ Derivado a tu equipo con el contexto']]
];
const histMsgs = document.getElementById('histMsgs'), hps = [...document.querySelectorAll('.hp')], barras = [...document.querySelectorAll('.hist-prog i')];
let pasoAct = -1;
function paso(i){
if (i === pasoAct) return; pasoAct = i;
hps.forEach((h, k) => h.classList.toggle('on', k === i)); barras.forEach((b, k) => b.classList.toggle('on', k === i));
histMsgs.innerHTML = '';
pasosChat[i].forEach(([t, s], k) => { const d = document.createElement('div'); d.className = 'm ' + t; d.textContent = s; histMsgs.appendChild(d); if (hasG && !reduce) gsap.from(d, {y:16, opacity:0, duration:.5, delay:k * .25, ease:'power3.out'}); });
}
paso(0);
const io = new IntersectionObserver(en => en.forEach(e => { if (e.isIntersecting) paso(+e.target.dataset.paso); }), {rootMargin:'-45% 0px -45% 0px'});
hps.forEach(h => io.observe(h));
/* Anillo de 24 horas */
const C = 2 * Math.PI * 100, arcoTu = document.getElementById('arcoTu'), arcoIA = document.getElementById('arcoIA');
const g24 = document.getElementById('horas24');
[0, 6, 12, 18].forEach(h => { const a = h / 24 * 2 * Math.PI, t = document.createElementNS('http://www.w3.org/2000/svg', 'text'); t.setAttribute('x', 120 + 76 * Math.sin(a)); t.setAttribute('y', 123 - 76 * Math.cos(a)); t.textContent = String(h).padStart(2, '0') + ':00'; g24.appendChild(t); });
const TU0 = 9 / 24, TU1 = 18 / 24;   // horario del negocio [por confirmar]
arcoTu.setAttribute('stroke-dasharray', `${C * (TU1 - TU0)} ${C}`); arcoTu.setAttribute('stroke-dashoffset', -C * TU0);
arcoIA.setAttribute('stroke-dasharray', `${C} ${C}`);
const horasIA = document.getElementById('horasIA');
const ponerDial = p => { arcoIA.setAttribute('stroke-dashoffset', C * (1 - p)); arcoIA.style.opacity = .9; horasIA.textContent = Math.round(p * 24); };
ponerDial(reduce || !hasG ? 1 : 0);
if (!hasG || reduce) return;
/* Entrada y parallax del hero */
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('#telefono', {y:200, duration:1.4, ease:'power4.out', delay:.2});
gsap.from('.flota', {scale:.6, opacity:0, duration:.8, ease:'back.out(2)', stagger:.2, delay:.9});
gsap.to('#heroTxt', {yPercent:-20, opacity:.3, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
gsap.to('.flota.f1', {y:-80, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
gsap.to('.flota.f2', {y:-140, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Anillo: se completa con el scroll */
const o = {p:0};
gsap.to(o, {p:1, ease:'none', onUpdate:() => ponerDial(o.p), scrollTrigger:{trigger:'.dia', start:'top 70%', end:'center 45%', scrub:1}});
gsap.from(arcoTu, {opacity:0, duration:.8, scrollTrigger:{trigger:'.dia', start:'top 70%'}});
})();
