/* Borrador L · Publicador RRSS: perfil que se llena solo, semana que se arma con el scroll, abandonado vs activo e ideas por rubro */
(function(){
const {reduce, hasG} = RN;
const tile = (k, txt) => { const d = document.createElement('div'); d.className = 'tp t' + k; const s = document.createElement('span'); s.textContent = txt; d.append(s); return d; };
/* 1 Perfil que se llena solo */
const textos = ['Nuevo', 'Tip del día', 'Hoy abrimos', '¿Sabías que?', 'Detrás de cámara', 'Clientes felices', 'Llegó', 'Receta', 'Finde', 'Encuesta', 'Novedades', 'Equipo'];
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], redes = ['Instagram', 'Facebook', 'LinkedIn', 'TikTok'];
const grid = document.getElementById('pfGrid'), toast = document.getElementById('toast'), toastTxt = document.getElementById('toastTxt'), pfDia = document.getElementById('pfDia'), cor = document.getElementById('corazones');
for (let i = 0; i < 9; i++) grid.append(tile((i * 3) % 8, textos[(i + 3) % textos.length]));
let n = 0;
function publicar(){
const d = dias[n % 7], r = redes[n % redes.length], t = tile(n % 8, textos[n % textos.length]);
t.classList.add('nuevo'); grid.prepend(t); grid.lastChild.remove();
pfDia.textContent = d + ' · 09:00'; toastTxt.textContent = d + ' · 09:00 · ' + r;
toast.classList.remove('on'); void toast.offsetWidth; toast.classList.add('on');
for (let i = 0; i < 4; i++) setTimeout(() => { const h = document.createElement('i'); h.textContent = '♥'; h.style.setProperty('--dx', (Math.random() * 60 - 30).toFixed(0) + 'px'); cor.append(h); setTimeout(() => h.remove(), 2500); }, 300 + i * 220);
n++;
}
if (reduce) toast.classList.add('on'); else { setTimeout(publicar, 1200); setInterval(publicar, 2800); }
/* 3 La semana se arma sola */
const mesa = document.getElementById('mesa'), pila = document.getElementById('pila'), slots = [...document.querySelectorAll('#dias i')], pasosF = [...document.querySelectorAll('#flujoP li')];
const horas = ['09:00', '12:30', '19:00', '09:00', '18:30', '11:00', '10:00'], piezas = ['Nuevo', 'Tip', 'Receta', 'Equipo', 'Finde', 'Encuesta', 'Hola'];
const cards = slots.map((s, k) => { const c = document.createElement('div'); c.className = 'pc'; c.style.zIndex = 10 - k; c.append(tile([0, 2, 1, 3, 4, 6, 5][k], piezas[k])); const em = document.createElement('em'); em.textContent = horas[k]; const u = document.createElement('u'); u.textContent = '✓'; c.append(em, u); pila.append(c); return c; });
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function semana(p){
const m = mesa.getBoundingClientRect();
cards.forEach((c, k) => {
const s = slots[k].getBoundingClientRect(), w = s.width, h = s.height;
c.style.width = w + 'px'; c.style.height = h + 'px';
const px = (m.width - w) / 2 + (k - 3) * 7, py = Math.max(44, (parseFloat(getComputedStyle(mesa).paddingTop) - h) / 2 + 10) + k * 3, pr = (k - 3) * 5;
const tx = s.left - m.left, ty = s.top - m.top;
const l = ease(Math.max(0, Math.min(1, (p - (.04 + k * .1)) / .16)));
c.style.transform = `translate(${px + (tx - px) * l}px, ${py + (ty - py) * l - Math.sin(l * Math.PI) * 40}px) rotate(${pr * (1 - l)}deg)`;
c.classList.toggle('pub', p > .9 + k * .012);
});
const i = p < .22 ? 0 : p < .5 ? 1 : p < .88 ? 2 : 3;
pasosF.forEach((li, k) => li.classList.toggle('on', k === i));
}
/* 4 Abandonada vs activa */
const p2 = document.getElementById('perfil2');
document.querySelectorAll('#tgPerfil button').forEach(b => b.addEventListener('click', () => p2.dataset.m = b.dataset.m));
/* 5 Ideas por rubro */
const ideas = [
[['Reel', 'Instagram', 0, 'De la molienda a tu taza', 'Así nace tu café de la mañana, en 15 segundos ☕', '#café #[tucomuna] #desayuno'], ['Carrusel', 'Instagram', 2, '3 formas de tomar café en verano', 'Frío, con tónica o con helado. ¿Cuál pruebas primero?', '#cafeteria #verano'], ['Historia', 'Instagram', 3, 'Torta del día 🍰', 'Encuesta: ¿qué torta hacemos el viernes?', '#hechoenlocal']],
[['Carrusel', 'Facebook', 1, '5 herramientas para tu casa', 'Las que todo hogar debería tener, y para qué sirve cada una.', '#ferretería #hogar'], ['Reel', 'TikTok', 0, 'Cambia una llave de paso', 'Paso a paso en un minuto. Guárdalo para cuando lo necesites.', '#hazlotumismo #[tucomuna]'], ['Historia', 'Instagram', 6, '¿Qué arreglas este finde?', 'Encuesta: pintura, jardín o baño.', '#finde']],
[['Reel', 'Instagram', 4, 'Así es una limpieza facial', 'Lo que pasa en una sesión, sin filtros y paso a paso ✨', '#estética #cuidadodelapiel'], ['Carrusel', 'Instagram', 5, 'Rutina para el invierno', '4 pasos para que tu piel no sufra con el frío.', '#skincare #[tucomuna]'], ['Historia', 'Instagram', 3, 'Quedan horas el sábado', 'Reserva directo por WhatsApp en un clic.', '#agenda']],
[['Reel', 'TikTok', 7, 'Recorrido: depto 2D', 'Te mostramos cada rincón en 30 segundos 🏡', '#arriendo #[tucomuna]'], ['Carrusel', 'LinkedIn', 1, '5 cosas antes de arrendar', 'La lista que nadie te pasa y que te ahorra problemas.', '#inmobiliaria #consejos'], ['Historia', 'Instagram', 0, 'Visita abierta el sábado', 'De 11:00 a 14:00. Responde esta historia y te guardamos un cupo.', '#visitaabierta']]
];
const posts = document.getElementById('posts');
function rubro(r){
posts.innerHTML = '';
ideas[r].forEach(([tipo, red, k, tit, cap, tags]) => {
const a = document.createElement('article'); a.className = 'post';
const tp = document.createElement('div'); tp.className = 'tipo'; tp.innerHTML = `<b>${tipo}</b><span>${red}</span>`;
const p = document.createElement('p'); p.textContent = cap; const t = document.createElement('p'); t.className = 'tags'; t.textContent = tags;
a.append(tp, tile(k, tit), p, t); posts.append(a);
});
if (hasG && !reduce) gsap.from(posts.children, {y:40, opacity:0, rotate:i => (i - 1) * 4, duration:.7, ease:'power3.out', stagger:.08});
}
const rbs = [...document.querySelectorAll('#cRubro button')];
rbs.forEach((b, i) => b.addEventListener('click', () => { rbs.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); rubro(i); }));
rubro(0);
if (!hasG || reduce){ semana(1); addEventListener('resize', () => semana(1)); return; }
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
gsap.from('#perfil', {y:90, rotate:6, opacity:0, duration:1.2, ease:'power3.out', delay:.25});
let ult = 0; const pintar = p => { ult = p; semana(p); };
semana(0); addEventListener('resize', () => semana(ult));
const mm = gsap.matchMedia();
mm.add('(min-width:861px)', () => { ScrollTrigger.create({trigger:'#semTrack', start:'top top', end:'bottom bottom', onUpdate:s => pintar(s.progress)}); });
mm.add('(max-width:860px)', () => { ScrollTrigger.create({trigger:'#mesa', start:'top 85%', end:'bottom 30%', onUpdate:s => pintar(s.progress)}); });
gsap.from('#perfil2', {y:70, rotate:3, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:'#perfil2', start:'top 85%'}});
})();
