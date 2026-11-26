/* Borrador P12 · Automatizaciones de Tareas: lienzo de nodos con pulso; banco de trabajo con el scroll; duelo a mano vs flujo; rubros; test */
(function(){
const {reduce, hasG} = RN;
const $ = id => document.getElementById(id);
/* 1 Hero: el pulso recorre los nodos y el contador suma */
const flujos = [
['Facturas de proveedores', ['Correo con factura.pdf', 'RUT, monto y fecha', 'Fila nueva en la planilla', 'Correo a contabilidad'], 'Factura 4821 · registrada'],
['Aviso de despacho', ['Pedido sale de bodega', 'Cliente y dirección', 'Estado: en camino', 'WhatsApp al cliente'], 'Pedido 2231 · cliente avisado'],
['Recordatorio de pago', ['Vence en 3 días', 'Cliente y monto', 'Planilla de cobranza', 'Correo de recordatorio'], 'Factura 1184 · recordatorio enviado']
];
const nodos = [...document.querySelectorAll('.nodo')], pulso = $('pulso'), cuenta = $('cuenta'), log = $('log'), lNombre = $('lNombre');
let n = 0, hechas = 0, hora = 14;
const pinta = f => { lNombre.textContent = 'Flujo · ' + f[0]; f[1].forEach((t, i) => $('n' + i).textContent = t); };
if (reduce){ nodos.forEach(x => x.classList.add('hecho')); cuenta.textContent = '37'; }
else {
function ciclo(){
const f = flujos[n % flujos.length]; pinta(f);
nodos.forEach(x => x.classList.remove('on', 'hecho'));
nodos.forEach((x, i) => {
setTimeout(() => {
nodos.forEach(y => y.classList.remove('on')); x.classList.add('on');
if (i > 0) nodos[i - 1].classList.add('hecho');
pulso.style.opacity = 1; pulso.style.transition = 'top .5s ease'; pulso.style.top = (x.offsetTop + x.offsetHeight / 2 - 6) + 'px';
}, 300 + i * 800);
});
setTimeout(() => {
nodos[3].classList.remove('on'); nodos[3].classList.add('hecho'); pulso.style.opacity = 0;
hechas++; hora++; cuenta.textContent = hechas;
const s = document.createElement('span'); s.textContent = '09:' + String(hora).padStart(2, '0') + ' · ' + f[2]; log.prepend(s); while (log.children.length > 3) log.lastChild.remove();
}, 300 + 4 * 800);
setTimeout(() => { n++; ciclo(); }, 5600);
}
setTimeout(ciclo, 800);
}
/* 4 Banco de trabajo */
const banco = $('banco'), pasos = [...document.querySelectorAll('#pasos li')];
const paso = i => { if (banco.dataset.paso == i) return; banco.dataset.paso = i; pasos.forEach((li, k) => li.classList.toggle('on', k === i)); };
/* 5 Duelo: diez facturas, a mano (5 clics cada una) o con el flujo */
const micro = ['Abrir correo', 'Copiar monto', 'Pegar en planilla', 'Escribir aviso', 'Enviar'];
const fMano = $('fMano'), fFlujo = $('fFlujo'), bMano = $('bMano'), bFlujo = $('bFlujo'), clics = $('clics');
let iF = 0, iM = 0, c = 0;
const arma = ol => { ol.innerHTML = ''; for (let k = 0; k < 10; k++){ const li = document.createElement('li'); li.innerHTML = '<i></i><span>#' + (4821 + k) + '</span>'; ol.append(li); } };
const reinicia = () => { arma(fMano); arma(fFlujo); iF = 0; iM = 0; c = 0; clics.textContent = 0; bMano.disabled = false; bMano.textContent = micro[0]; bFlujo.disabled = false; bFlujo.textContent = 'Activar el flujo'; };
reinicia();
bMano.addEventListener('click', () => {
const li = fMano.children[iF]; c++; iM++; clics.textContent = c;
li.querySelector('i').style.transform = 'scaleX(' + iM / 5 + ')';
if (iM === 5){ li.classList.add('ok'); iF++; iM = 0; }
if (iF === 10){ bMano.disabled = true; bMano.textContent = 'Listo · ' + c + ' clics'; return; }
bMano.textContent = micro[iM];
});
bFlujo.addEventListener('click', () => {
bFlujo.disabled = true; bFlujo.textContent = 'Corriendo…';
[...fFlujo.children].forEach((li, k) => setTimeout(() => { li.querySelector('i').style.transform = 'scaleX(1)'; li.classList.add('ok'); if (k === 9) bFlujo.textContent = 'Listo · 0 clics'; }, k * 220));
});
$('reini').addEventListener('click', reinicia);
/* 6 Rubros */
const tabs = [...document.querySelectorAll('#cRub button')];
tabs.forEach(b => b.addEventListener('click', () => {
tabs.forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); $(x.getAttribute('aria-controls')).hidden = !on; });
}));
/* 7 Test */
const checks = [...document.querySelectorAll('#test input')], ver = $('veredicto');
checks.forEach(ch => ch.addEventListener('change', () => {
const k = checks.filter(x => x.checked).length;
ver.className = 'veredicto' + (k >= 3 ? ' alto' : k ? ' medio' : '');
ver.innerHTML = k >= 3 ? '<b>Buena candidata</b><span>Tiene todo para correr sola. Conversemos en la evaluación gratis.</span>' : k ? '<b>Puede servir</b><span>Depende de los detalles. Lo vemos contigo en la reunión de 45 minutos.</span>' : '<b>Marca al menos una</b><span>Y te decimos qué tan buena candidata es.</span>';
}));
if (!hasG || reduce){ paso(3); pasos.forEach(li => li.classList.add('on')); return; }
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('#lienzo', {y:90, rotate:-5, opacity:0, duration:1.2, ease:'power3.out', delay:.25});
gsap.from('#contador', {y:-30, opacity:0, duration:.9, ease:'power3.out', delay:.6});
const porP = p => paso(p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#flujoTrack', start:'top top', end:'bottom bottom', onUpdate:s => porP(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#banco', start:'top 80%', end:'bottom 20%', onUpdate:s => porP(s.progress)}); });
gsap.from('.carril', {y:70, opacity:0, duration:1, ease:'power3.out', stagger:.12, scrollTrigger:{trigger:'.duelo', start:'top 85%'}});
})();
