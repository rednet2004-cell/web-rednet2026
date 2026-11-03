/* Comportamiento común de las páginas de producto (mismo lenguaje de movimiento que v4) */
window.RN = (function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
/* Header: se vuelve sólido al bajar */
const hdr = document.getElementById('hdr');
const umbral = () => (document.querySelector('.p-hero') || document.body).offsetHeight * .55;
const onScroll = () => hdr && hdr.classList.toggle('solido', scrollY > umbral());
addEventListener('scroll', onScroll, {passive:true}); onScroll();
/* Toggle Antes / Con Rednet */
document.querySelectorAll('.toggle').forEach(toggle => {
const met = document.getElementById(toggle.dataset.met);
toggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
toggle.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
const m = b.dataset.m; toggle.dataset.m = m;
met && met.querySelectorAll(':scope > div').forEach(d => {
const v = d.querySelector('b'); v.textContent = m === 'antes' ? v.dataset.a : v.dataset.c;
d.querySelector('.barra i').style.width = m === 'antes' ? d.dataset.wa : d.dataset.wc;
});
}));
});
/* Planes: mensual / anual */
document.querySelectorAll('.periodo button').forEach(b => b.addEventListener('click', () => {
document.querySelectorAll('.periodo button').forEach(x => x.classList.toggle('on', x === b));
document.querySelectorAll('.per').forEach(p => p.textContent = b.dataset.p === 'mes' ? '/mes' : '/año');
}));
if (hasG && !reduce){
/* Frase palabra por palabra (como el manifiesto del home) */
document.querySelectorAll('[data-palabras]').forEach(p => {
[...p.childNodes].forEach(n => {
if (n.nodeType !== 3) return;
const frag = document.createDocumentFragment();
n.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()){ frag.append(t); return; } const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s); });
p.replaceChild(frag, n);
});
gsap.fromTo(p.querySelectorAll('.w, .ico'), {opacity:.16}, {opacity:1, stagger:.08, ease:'none', scrollTrigger:{trigger:p, start:'top 80%', end:'bottom 45%', scrub:true}});
});
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => {
gsap.from(g.children, {y:50, opacity:0, duration:.9, ease:'power3.out', stagger:.08, scrollTrigger:{trigger:g, start:'top 82%'}});
});
/* Contadores */
document.querySelectorAll('[data-cuenta]').forEach(el => {
const fin = parseFloat(el.dataset.cuenta), dec = (el.dataset.cuenta.split('.')[1] || '').length, o = {v:0};
gsap.to(o, {v:fin, duration:1.4, ease:'power2.out', scrollTrigger:{trigger:el, start:'top 88%'}, onUpdate:() => el.textContent = o.v.toFixed(dec).replace('.', ',')});
});
/* CTA final se expande */
if (document.getElementById('cta')) gsap.fromTo('#cta', {scale:.88, borderRadius:60}, {scale:1, borderRadius:36, ease:'none', scrollTrigger:{trigger:'#cta', start:'top 95%', end:'top 40%', scrub:true}});
}
return {reduce, hasG, clamp:(v,a,b) => Math.max(a, Math.min(b, v))};
})();
