/* Borrador P18 · Mailing a Contactos: planilla dormida que se ordena, recibe un correo y muestra quién abrió; campaña de la lista al informe con el scroll; correo por tipo de cliente con baja de un clic; spam o bien hecho */
(function(){
const {reduce, hasG} = RN;
const $ = id => document.getElementById(id);
/* 1 Planilla del hero: dormida → ordenada → enviada → informe. Ciclo continuo. */
const ciclos = [
{rubro:'Eventos', tipos:['Celebró en diciembre','Cotizó','Celebró en diciembre','Cumpleaños','Celebró en diciembre','Cotizó'], asunto:'¿Repetimos la fiesta de fin de año?', btn:'Reservar fecha', res:['Respondió','','Abrió','','Abrió','']},
{rubro:'Supermercado', tipos:['Compra cada semana','Compra a veces','Compra cada semana','Compra cada semana','Nuevo','Compra a veces'], asunto:'Tus ofertas de esta semana', btn:'Ver ofertas', res:['Abrió','','Abrió','Respondió','','']},
{rubro:'Tienda online', tipos:['Compró hace +6 meses','Compra seguido','Nuevo','Compró hace +6 meses','Compró hace +6 meses','Compra seguido'], asunto:'Llegó lo nuevo de la temporada', btn:'Ver lo nuevo', res:['Abrió','','','Respondió','Abrió','']}
];
const pl = $('planilla'), filas = [...document.querySelectorAll('#plTabla .pl-fila:not(.pl-cab)')], plRubro = $('plRubro'), asunto = $('asunto'), cBtn = $('cBtn'), ult = $('ultimo'), ultTxt = $('ultTxt');
const seg = c => c.tipos[0];
function pinta(c, f){
pl.dataset.f = f; plRubro.textContent = 'clientes.xlsx · ' + c.rubro; asunto.textContent = c.asunto; cBtn.textContent = c.btn;
filas.forEach((fi, k) => {
const sel = c.tipos[k] === seg(c), tipo = fi.querySelector('.tipo'), est = fi.querySelector('.est');
fi.classList.toggle('sel', f > 0 && sel);
if (f === 0) tipo.textContent = '—'; else { tipo.textContent = ''; const em = document.createElement('em'); em.textContent = c.tipos[k]; tipo.append(em); }
est.className = 'est'; est.textContent = 'Nunca';
if (f >= 2 && sel){ est.textContent = 'Hoy'; est.classList.add('ok'); }
if (f === 3 && sel && c.res[k]){ est.textContent = c.res[k]; est.classList.add(c.res[k] === 'Respondió' ? 'resp' : 'ok'); }
});
const aldia = f >= 2; ult.classList.toggle('al-dia', aldia); ultTxt.textContent = aldia ? 'hoy' : 'nunca';
}
const duraciones = [1800, 1700, 1600, 3600];
let n = 0, fase = 0, timer = null, pausado = reduce, visible = true;
function paso(){
timer = null;
if (pausado || !visible) return;
pinta(ciclos[n % ciclos.length], fase);
const ms = duraciones[fase];
fase = (fase + 1) % 4; if (fase === 0) n++;
timer = setTimeout(paso, ms);
}
function seguir(){ if (!timer && !pausado && visible) timer = setTimeout(paso, 300); }
if (reduce){ pinta(ciclos[0], 3); }
else {
new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) seguir(); else { clearTimeout(timer); timer = null; } }).observe(pl);
setTimeout(seguir, 600);
}

/* 3 Campaña: el paso visible sigue al scroll */
const mesa = $('mesa'), pasos = [...document.querySelectorAll('#pasos li')];
const ponerPaso = i => { if (mesa.dataset.paso == i) return; mesa.dataset.paso = i; pasos.forEach((li, k) => li.classList.toggle('on', k === i)); };

/* 4 Tipo de cliente: pestañas con flechas del teclado */
const tabs = [...document.querySelectorAll('#cSeg [role=tab]')];
const bAsunto = $('bAsunto'), bPrev = $('bPrev');
const elegir = (b, foco) => {
tabs.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $(x.getAttribute('aria-controls')).hidden = !on; });
if (foco){ b.focus(); b.scrollIntoView({block:'nearest', inline:'nearest'}); }
};
tabs.forEach((b, i) => {
b.addEventListener('click', () => elegir(b));
b.addEventListener('keydown', e => {
const k = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[e.key];
if (k){ e.preventDefault(); elegir(tabs[(i + k + tabs.length) % tabs.length], true); }
if (e.key === 'Home'){ e.preventDefault(); elegir(tabs[0], true); }
if (e.key === 'End'){ e.preventDefault(); elegir(tabs[tabs.length - 1], true); }
});
});
/* Baja de un clic: funciona de verdad en el ejemplo */
document.querySelectorAll('.prev-pie').forEach(pie => {
const original = pie.innerHTML;
const armar = () => {
pie.querySelector('.baja').addEventListener('click', () => {
pie.innerHTML = '<span class="bajado" role="status">Listo, te diste de baja en un clic. No te volveremos a escribir.</span> <button class="deshacer" type="button">Deshacer (ejemplo)</button>';
const d = pie.querySelector('.deshacer'); d.focus();
d.addEventListener('click', () => { pie.innerHTML = original; armar(); pie.querySelector('.baja').focus(); });
});
};
armar();
});

/* 5 Spam o bien hecho */
const toggle = $('toggle'), crit = $('crit'), bandeja = $('bandeja');
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
toggle.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
const m = b.dataset.m; toggle.dataset.m = m; crit.dataset.m = m; bandeja.dataset.m = m;
crit.querySelectorAll('b').forEach(v => { v.textContent = m === 'spam' ? v.dataset.s : v.dataset.b; });
bAsunto.textContent = m === 'spam' ? 'TU NEGOCIO · ¡¡ÚLTIMO DÍA!! 50% EN TODO, SOLO HOY' : 'Tu negocio · Antes que nadie: lo nuevo de este mes';
bPrev.textContent = m === 'spam' ? 'Ofertas, ofertas, ofertas. Si no quieres recibir más correos…' : 'Como vuelves seguido, te avisamos primero.';
}));

if (!hasG || reduce){ ponerPaso(3); pasos.forEach(li => li.classList.add('on')); return; }
/* Hero: entrada corta */
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.1});
gsap.from('.planilla-esc', {y:60, opacity:0, duration:1.1, ease:'power3.out', delay:.2});
/* Campaña: fija en escritorio, sigue al scroll en móvil */
const porP = p => ponerPaso(p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3);
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#flujoTrack', start:'top top', end:'bottom bottom', onUpdate:s => porP(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#mesa', start:'top 80%', end:'bottom 20%', onUpdate:s => porP(s.progress)}); });
})();
