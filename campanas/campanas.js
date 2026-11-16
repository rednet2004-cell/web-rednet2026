/* Rednet · Landings de campaña por rubro: comportamiento común (sin librerías) */
(function(){
document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Encabezado sólido al bajar; barra fija móvil visible entre la primera pantalla y el contacto */
const hdr = document.getElementById('hdr'), barra = document.getElementById('barraMovil'), contacto = document.getElementById('contacto');
const onScroll = () => {
hdr.classList.toggle('solido', scrollY > innerHeight * .5);
if (barra) barra.classList.toggle('on', scrollY > innerHeight * .7 && contacto.getBoundingClientRect().top > innerHeight * .9);
};
addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* Video de fondo del hero: se carga solo si no hay ahorro de datos ni movimiento reducido; si no, queda la imagen fija */
document.querySelectorAll('.hero-bg video').forEach(v => {
const ahorro = navigator.connection && navigator.connection.saveData;
if (reduce || ahorro) return;
[['webm','video/webm'],['mp4','video/mp4']].forEach(([k, t]) => { if (v.dataset[k]){ const s = document.createElement('source'); s.src = v.dataset[k]; s.type = t; v.appendChild(s); } });
v.load(); v.play().catch(() => {});
new IntersectionObserver(en => en.forEach(e => e.isIntersecting ? v.play().catch(() => {}) : v.pause())).observe(v);
});

/* Aparición al entrar en pantalla (y la conversación dibujada, burbuja por burbuja) */
const io = new IntersectionObserver(en => en.forEach(e => { if (e.isIntersecting){ e.target.classList.add('visto'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -12% 0px'});
document.querySelectorAll('[data-rv], .chat.anim').forEach(el => io.observe(el));
document.querySelectorAll('.chat-msgs').forEach(c => [...c.children].forEach((m, i) => m.style.setProperty('--i', i)));

/* Video demo: no se descarga ni se reproduce hasta que se toca.
   Para activarlo, poner la ruta del archivo en data-src (y data-src-webm si hay) del contenedor .video */
document.querySelectorAll('.video').forEach(box => {
const btn = box.querySelector('.portada');
btn.addEventListener('click', () => {
const src = box.dataset.src;
if (!src){
if (!box.querySelector('.video-msg')){ const p = document.createElement('p'); p.className = 'video-msg'; p.setAttribute('role', 'status'); p.innerHTML = 'El video se está grabando. Mientras tanto, abajo tienes una conversación de ejemplo. <span class="ph">[VIDEO DEMO 45–60 s]</span>'; box.appendChild(p); }
return;
}
const v = document.createElement('video');
v.controls = true; v.playsInline = true; v.preload = 'auto';
if (box.dataset.poster) v.poster = box.dataset.poster;
if (box.dataset.srcWebm){ const s = document.createElement('source'); s.src = box.dataset.srcWebm; s.type = 'video/webm'; v.appendChild(s); }
const s2 = document.createElement('source'); s2.src = src; s2.type = 'video/mp4'; v.appendChild(s2);
btn.remove(); box.appendChild(v); v.play().catch(() => {});
});
});

/* Selector de variante (clínicas: dental / radiología). ?v=radiologia abre directo esa variante */
const sel = document.querySelector('.variante');
if (sel){
const poner = v => {
document.body.dataset.v = v;
sel.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v));
document.querySelectorAll('[data-cta-' + v + ']').forEach(a => { a.textContent = a.getAttribute('data-cta-' + v); });
document.querySelectorAll('.chat.anim').forEach(c => { c.classList.remove('visto'); requestAnimationFrame(() => io.observe(c)); });
};
sel.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
poner(b.dataset.v);
const u = new URL(location.href); if (b.dataset.v === 'radio') u.searchParams.set('v', 'radiologia'); else u.searchParams.delete('v'); history.replaceState(null, '', u);
}));
const q = new URLSearchParams(location.search).get('v');
poner(q && q.startsWith('radio') ? 'radio' : 'dental');
}

/* Esquema animado (oficinas contables): ilumina cada paso en orden */
const flujo = document.querySelector('.f-pasos');
if (flujo){
const pasos = [...flujo.children]; let i = 0, t = null;
const tick = () => { pasos.forEach((p, k) => p.classList.toggle('on', k === i)); i = (i + 1) % pasos.length; };
if (reduce) pasos.forEach(p => p.classList.add('on'));
else new IntersectionObserver(en => en.forEach(e => { clearInterval(t); if (e.isIntersecting){ tick(); t = setInterval(tick, 1600); } }), {threshold:.3}).observe(flujo);
}

/* Formulario (maqueta): valida y confirma, todavía no envía datos */
const form = document.getElementById('form');
if (form){
const err = document.getElementById('fError'), ok = document.getElementById('fOk');
form.addEventListener('submit', e => {
e.preventDefault();
const req = [...form.querySelectorAll('[required]')];
let falta = null;
req.forEach(inp => { const v = inp.value.trim().length > 1; inp.setAttribute('aria-invalid', !v); if (!v && !falta) falta = inp; });
err.hidden = !falta; ok.hidden = !!falta;
if (falta){ falta.focus(); return; }
form.querySelector('button[type=submit]').disabled = true;
});
}
})();
