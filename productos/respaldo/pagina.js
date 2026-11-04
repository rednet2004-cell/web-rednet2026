/* Borrador H · Respaldo: mazo de copias, prueba "rómpelo y vuelve atrás" y calendario de 30 copias */
(function(){
const {reduce, hasG} = RN;
/* Prueba */
const sitio = document.getElementById('sitioP'), romper = document.getElementById('romper'), lt = document.getElementById('lt');
const ltSel = document.getElementById('ltSel'), estado = document.getElementById('spEstado');
const nombres = [...sitio.querySelectorAll('.sp-arch b')];
nombres.forEach(b => b.dataset.o = b.textContent);
const etiquetas = ['Hace 4 días · 02:00', 'Antes de ayer · 02:00', 'Ayer · 02:00', 'Anoche · 02:00', 'Ahora'];
let tOk = null;
romper.addEventListener('click', () => {
clearTimeout(tOk);
sitio.dataset.e = 'roto'; estado.textContent = 'Error';
nombres.forEach(b => b.textContent = b.dataset.r);
lt.disabled = false; lt.value = 4; ltSel.textContent = 'Ahora (con error)';
romper.disabled = true; romper.textContent = 'Ahora vuelve atrás →';
});
lt.addEventListener('input', () => {
const v = +lt.value;
ltSel.textContent = etiquetas[v] + (v === 4 && sitio.dataset.e === 'roto' ? ' (con error)' : '');
if (sitio.dataset.e === 'roto' && v < 4){
sitio.dataset.e = 'ok2'; estado.textContent = 'Restaurado';
nombres.forEach(b => b.textContent = b.dataset.o);
document.getElementById('spOk').textContent = '✓ Restaurado desde la copia de ' + etiquetas[v].toLowerCase() + ' · sin perder nada';
tOk = setTimeout(() => { sitio.dataset.e = 'ok'; estado.textContent = 'En línea'; lt.disabled = true; lt.value = 4; ltSel.textContent = 'Ahora'; romper.disabled = false; romper.textContent = 'Simular otro error'; }, 3200);
}
});
/* Calendario */
const cal = document.getElementById('cal'), calN = document.getElementById('calN');
for (let d = 1; d <= 30; d++){ const i = document.createElement('i'); i.textContent = d; cal.appendChild(i); }
const dias = [...cal.children];
function llenar(p){
const n = Math.round(p * 30);
dias.forEach((d, k) => { d.classList.toggle('on', k < n && k < 29); d.classList.toggle('hoy', k === 29 && n === 30); });
calN.textContent = n;
}
llenar(reduce || !hasG ? 1 : 0);
if (!hasG || reduce) return;
/* Entrada del hero: las copias se apilan una sobre otra */
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('.copia', {y:-260, opacity:0, duration:.9, ease:'power3.out', stagger:.12, delay:.3, clearProps:'transform'});
gsap.to('.sol', {xPercent:20, yPercent:-20, ease:'none', scrollTrigger:{trigger:'.p-hero', start:'top top', end:'bottom top', scrub:true}});
/* Prueba: el sitio entra */
gsap.from('#sitioP', {y:80, opacity:0, duration:1.1, ease:'power3.out', scrollTrigger:{trigger:'#sitioP', start:'top 80%'}});
/* Calendario con el scroll */
const o = {p:0};
gsap.to(o, {p:1, ease:'none', onUpdate:() => llenar(o.p), scrollTrigger:{trigger:'#cal', start:'top 75%', end:'bottom 45%', scrub:1}});
})();
