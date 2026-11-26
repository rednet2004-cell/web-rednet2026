/* Nube Documental (P15) · documentos-impeccable (ruta rednet-design-1: impeccable → motion → pulido) */
(function(){
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof gsap !== 'undefined';
if (hasG) gsap.registerPlugin(ScrollTrigger);
const escritorio = matchMedia('(min-width:861px)');
const $ = id => document.getElementById(id);
const ENT = {y:40, d:.9, st:.08, h1:1, h1e:'power3.out', orden:1, ordenE:'power3.inOut', caos:.7};

/* Header sólido, barra fija móvil y selector de versiones */
const hdr = $('hdr'), barra = $('barraMovil'), contacto = $('contacto');
const onScroll = () => {
hdr.classList.toggle('solido', scrollY > 40);
barra.classList.toggle('on', scrollY > innerHeight * .8 && contacto.getBoundingClientRect().top > innerHeight);
document.body.classList.toggle('bajo', scrollY > 120);
};
addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* Menú móvil: Escape cierra, el foco va al primer link */
const menuBtn = $('menuBtn'), navP = $('navPrincipal');
const cerrarMenu = () => { navP.classList.remove('abierto'); document.body.classList.remove('menu-abierto'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
menuBtn.addEventListener('click', () => {
const ab = !navP.classList.contains('abierto');
navP.classList.toggle('abierto', ab); document.body.classList.toggle('menu-abierto', ab); menuBtn.setAttribute('aria-expanded', ab); document.body.style.overflow = ab ? 'hidden' : '';
if (ab) navP.querySelector('a').focus();
});
navP.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
addEventListener('keydown', e => { if (e.key === 'Escape' && navP.classList.contains('abierto')){ cerrarMenu(); menuBtn.focus(); } });

/* 1 Archivos del hero: del desorden a las carpetas (una sola vez; el botón lo repite). Solo transform. */
const archivos = [
['Ficha cliente Ruiz.pdf', 'ficha ruiz (2).pdf', 0, 'el correo'], ['Ficha cliente Soto.pdf', 'Escanear0034.pdf', 0, 'el escritorio'], ['Cartera clientes 2026.xlsx', 'clientes_VIEJO.xlsx', 0, 'un pendrive'], ['Datos contacto Pérez.docx', 'perez datos.docx', 0, 'WhatsApp'],
['Contrato arriendo local 2026.pdf', 'contrato_final_FINAL.pdf', 1, 'el correo'], ['Contrato proveedor café.pdf', 'IMG_2291.jpg', 1, 'WhatsApp'], ['Anexo contrato Soto.pdf', 'anexo???.pdf', 1, 'Descargas'], ['Contrato trabajo [Nombre].pdf', 'contrato nuevo v3.pdf', 1, 'un pendrive'],
['Factura 1042 marzo.pdf', 'factura.pdf', 2, 'el correo'], ['Factura 1043 marzo.pdf', 'factura (1).pdf', 2, 'el correo'], ['Facturas abril.xlsx', 'Libro1.xlsx', 2, 'el escritorio'], ['Boleta luz marzo.pdf', 'boleta luz.pdf', 2, 'WhatsApp'],
['Propuesta [Cliente] v4.docx', 'propuesta_v3_ahora_si.docx', 3, 'el correo'], ['Planos local.pdf', 'planos.pdf', 3, 'un pendrive'], ['Fotos obra.zip', 'Nueva carpeta (4).zip', 3, 'el escritorio'], ['Cronograma proyecto.xlsx', 'crono FINAL.xlsx', 3, 'Descargas']
];
const CARP = ['Clientes', 'Contratos', 'Facturas', 'Proyectos'];
const arch = $('archivo'), fichas = $('fichas');
const els = archivos.map(() => { const d = document.createElement('div'); d.className = 'ficha'; d.innerHTML = '<b></b><small></small>'; fichas.append(d); return d; });
const pos = {};
function medir(){
const W = arch.clientWidth, H = arch.clientHeight, ch = innerWidth < 900, pad = ch ? 12 : 18, gap = ch ? 6 : 10, colW = (W - pad * 2 - gap * 3) / 4;
const paso = Math.min(90, (H - pad * 2 - 42 - 60) / 3.4);
els.forEach(e => { e.style.width = colW + 'px'; });
pos.orden = archivos.map((a, i) => ({x:pad + a[2] * (colW + gap), y:pad + 42 + (i % 4) * paso, r:0, s:1}));
pos.caos = archivos.map(() => ({x:pad + Math.random() * (W - colW * 1.2 - pad * 2), y:30 + Math.random() * (H - 150), r:Math.random() * 40 - 20, s:1.12}));
}
const textos = modo => els.forEach((e, i) => { const a = archivos[i]; e.firstChild.textContent = modo === 'orden' ? a[0] : a[1]; e.lastChild.textContent = modo === 'orden' ? 'Al día' : 'En ' + a[3]; });
const css = p => `translate(${p.x}px,${p.y}px) rotate(${p.r}deg) scale(${p.s})`;
function poner(modo){ medir(); arch.classList.toggle('orden', modo === 'orden'); textos(modo); els.forEach((e, i) => { if (hasG) gsap.set(e, {x:pos[modo][i].x, y:pos[modo][i].y, rotate:pos[modo][i].r, scale:pos[modo][i].s}); else e.style.transform = css(pos[modo][i]); }); }
const anim = hasG && !reduce;
let tlArch;
function ordenar(){
medir(); arch.classList.add('orden');
els.forEach((e, i) => { const p = pos.orden[i]; gsap.to(e, {x:p.x, y:p.y, rotate:0, scale:1, duration:ENT.orden, ease:ENT.ordenE, delay:.04 * i, overwrite:true, onStart:() => { e.firstChild.textContent = archivos[i][0]; e.lastChild.textContent = 'Al día'; }}); });
}
function desordenar(){
medir(); arch.classList.remove('orden'); textos('caos');
els.forEach((e, i) => { const p = pos.caos[i]; gsap.to(e, {x:p.x, y:p.y, rotate:p.r, scale:p.s, duration:ENT.caos, ease:'power3.out', delay:.015 * i, overwrite:true}); });
}
if (anim){
poner('caos');
tlArch = gsap.delayedCall(1.2, ordenar);
$('desordenar').addEventListener('click', () => { if (tlArch) tlArch.kill(); desordenar(); tlArch = gsap.delayedCall(1.3, ordenar); });
addEventListener('resize', () => { if (arch.classList.contains('orden')) poner('orden'); });
} else {
poner('orden'); addEventListener('resize', () => poner('orden'));
$('desordenar').addEventListener('click', () => { poner('caos'); setTimeout(() => poner('orden'), 1500); });
}

/* 3 Buscador real sobre archivos de ejemplo */
const docs = [
['Contrato arriendo local 2026', 'pdf', 'Contratos', '12 mar 2026', 'Tú'], ['Contrato proveedor café', 'pdf', 'Contratos', '3 feb 2026', 'Contabilidad'], ['Anexo contrato Soto', 'pdf', 'Contratos', '28 mar 2026', 'Ventas'],
['Factura 1042 marzo', 'pdf', 'Facturas', '5 mar 2026', 'Contabilidad'], ['Factura 1043 marzo', 'pdf', 'Facturas', '9 mar 2026', 'Contabilidad'], ['Facturas abril', 'xls', 'Facturas', '30 abr 2026', 'Contabilidad'],
['Propuesta [Cliente] v4', 'doc', 'Proyectos', 'Hoy', 'Ventas'], ['Cronograma proyecto', 'xls', 'Proyectos', '18 mar 2026', 'Tú'], ['Planos local', 'pdf', 'Proyectos', '2 ene 2026', 'Tú'],
['Ficha cliente Ruiz', 'pdf', 'Clientes', '14 mar 2026', 'Ventas'], ['Ficha cliente Soto', 'pdf', 'Clientes', '20 feb 2026', 'Ventas'], ['Cartera clientes 2026', 'xls', 'Clientes', '1 ene 2026', 'Ventas'],
['Boleta luz marzo', 'pdf', 'Facturas', '20 mar 2026', 'Tú'], ['Manual de procedimientos', 'doc', 'Empresa', '7 ene 2026', 'Tú']
];
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const lista = $('lista'), bqIn = $('bqIn'), bqN = $('bqN');
function buscar(q){
const nq = norm(q.trim());
const res = docs.filter(d => !nq || norm(d.join(' ')).includes(nq));
lista.innerHTML = '';
bqN.textContent = nq ? `${res.length} ${res.length === 1 ? 'resultado' : 'resultados'}` : `${docs.length} archivos`;
if (!res.length){ const li = document.createElement('li'); li.className = 'vacio'; li.textContent = 'Nada con esa palabra. Prueba "contrato" o "marzo".'; lista.append(li); return; }
res.slice(0, 7).forEach((d, n) => {
const li = document.createElement('li');
const i = document.createElement('i'); i.className = d[1]; i.textContent = d[1].toUpperCase();
const t = document.createElement('div'), b = document.createElement('b'), s = document.createElement('small');
const k = nq ? norm(d[0]).indexOf(nq) : -1;
if (k >= 0){ b.append(d[0].slice(0, k)); const m = document.createElement('mark'); m.textContent = d[0].slice(k, k + nq.length); b.append(m, d[0].slice(k + nq.length)); } else b.textContent = d[0];
s.textContent = d[2] + ' · ' + d[4]; t.append(b, s);
const e = document.createElement('em'); e.textContent = d[3];
li.append(i, t, e); lista.append(li);
});
}
let escribio = false;
bqIn.addEventListener('input', () => { escribio = true; buscar(bqIn.value); });
document.querySelectorAll('#sugeridas button').forEach(b => b.addEventListener('click', () => { escribio = true; bqIn.value = b.textContent; buscar(b.textContent); }));
buscar('');
async function demo(){ const t = 'contrato'; for (let i = 1; i <= t.length; i++){ if (escribio) return; bqIn.value = t.slice(0, i); buscar(bqIn.value); await new Promise(r => setTimeout(r, 110)); } }

/* 4 Permisos por persona */
const ETQ = {e:'Edita', v:'Solo ve', n:'Sin acceso'};
const roles = [...document.querySelectorAll('#roles button')], filas = [...document.querySelectorAll('#permLista li')];
const verRol = r => {
roles.forEach(b => b.setAttribute('aria-pressed', +b.dataset.r === r));
filas.forEach(li => { const s = li.dataset.p.split(',')[r]; li.dataset.s = s; li.querySelector('b').textContent = ETQ[s]; });
};
roles.forEach(b => b.addEventListener('click', () => verRol(+b.dataset.r)));
verRol(0);

/* 5 Bajo tu llave: el lado visual y las barras siguen al toggle */
const tg = $('tgLlave'), met = $('met'), vis = $('llaveVis');
vis.querySelectorAll('.docs i').forEach((d, k) => d.style.setProperty('--k', k));
const ponerModo = m => {
tg.dataset.m = m; vis.dataset.m = m;
tg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.m === m));
met.querySelectorAll('li').forEach(li => {
const b = li.querySelector('b'), i = li.querySelector('.barra i');
b.textContent = m === 'antes' ? b.dataset.a : b.dataset.c;
i.style.width = (m === 'antes' ? i.dataset.a : i.dataset.c) * 100 + '%';
});
};
tg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => ponerModo(b.dataset.m)));
ponerModo('con');

/* 7 Enlace con permisos */
const sw = id => $(id).checked, url = $('url'), resEn = $('resEn');
function enlace(){
const ed = sw('swEd'), ve = sw('swVe'), pw = sw('swPw'), de = sw('swDe');
resEn.textContent = `Quien tenga el enlace ${ed ? 'puede editar' : 'solo puede ver'}${de ? ' y descargar' : ''}. ${ve ? 'Deja de funcionar en 7 días.' : 'No vence.'}${pw ? ' Pide contraseña.' : ''}`;
}
document.querySelectorAll('.switches input').forEach(i => i.addEventListener('change', enlace));
enlace();
const copiar = $('copiar'); let tCop;
copiar.addEventListener('click', () => { try { navigator.clipboard && navigator.clipboard.writeText('https://' + url.textContent); } catch(e){} copiar.innerHTML = 'Copiado ✓'; clearTimeout(tCop); tCop = setTimeout(() => copiar.textContent = 'Copiar', 1600); });
/* Los equipos se sincronizan dos veces cuando aparecen (sin bucle infinito) */
const dispos = document.querySelector('.dispos');
new IntersectionObserver((en, o) => { if (en[0].isIntersecting){ dispos.classList.add('on'); o.disconnect(); } }, {threshold:.6}).observe(dispos);

/* 8 Rubros: pestañas con flechas del teclado */
const tabs = [...document.querySelectorAll('#rubTabs [role=tab]')];
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

/* Video de fondo del contacto: solo escritorio, sin ahorro de datos ni reducir movimiento; se pausa fuera de pantalla */
const vCta = $('vCta');
const sinVideo = reduce || !escritorio.matches || (navigator.connection && navigator.connection.saveData);
if (!sinVideo) new IntersectionObserver(([en]) => { if (en.isIntersecting){ vCta.preload = 'auto'; vCta.play().catch(() => {}); } else vCta.pause(); }, {rootMargin:'200px'}).observe(vCta);

/* Los CTA con motivo o plan preseleccionan el formulario */
const fQue = $('fQue');
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => { fQue.value = a.dataset.plan; setTimeout(() => $('fNombre').focus({preventScroll:true}), 600); }));
/* Formulario (maqueta: valida y confirma, no envía) */
const form = $('form'), fErr = $('fError'), fOk = $('fOk');
form.addEventListener('submit', e => {
e.preventDefault();
const nm = form.nombre, c = form.contacto, malos = [nm, c].filter(i => !i.value.trim());
[nm, c].forEach(i => i.setAttribute('aria-invalid', malos.includes(i)));
fErr.hidden = !malos.length;
if (malos.length){ malos[0].focus(); return; }
const btn = form.querySelector('button[type=submit]');
fOk.hidden = false; form.reset();
});

if (!anim) return;
/* Entradas en grupo */
document.querySelectorAll('[data-rv]').forEach(g => gsap.from(g.children, {y:ENT.y, opacity:0, duration:ENT.d, ease:'power3.out', stagger:ENT.st, scrollTrigger:{trigger:g, start:'top 85%'}}));
/* Hero: el titular sube línea por línea */
gsap.from('.p-hero h1 .ln > *', {yPercent:100, duration:ENT.h1, ease:ENT.h1e, stagger:ENT.st * 2});
gsap.from('#heroTxt .miga, #heroTxt p, #heroTxt .hero-ctas', {y:ENT.y, opacity:0, duration:ENT.d, ease:'power3.out', stagger:ENT.st, delay:.2});
gsap.from('.archivo', {y:ENT.y * 2, opacity:0, duration:ENT.d + .2, ease:'power3.out', delay:.1});
/* Buscador: escribe "contrato" solo una vez al aparecer, si nadie escribió antes */
ScrollTrigger.create({trigger:'.buscador', start:'top 75%', once:true, onEnter:demo});
['.buscador', '.perm-lista', '.enlace', '.llave-vis'].forEach(s => gsap.from(s, {y:ENT.y * 2, opacity:0, duration:ENT.d, ease:'power3.out', scrollTrigger:{trigger:s, start:'top 88%'}}));
/* 6 Abanico de versiones y cursores con el scroll */
const abre = [{r:-22, x:-120, y:20}, {r:-9, x:-50, y:0}, {r:6, x:30, y:-6}, {r:0, x:90, y:-14}];
const k = innerWidth < 860 ? .5 : 1;
const tlV = gsap.timeline({scrollTrigger:{trigger:'#abanico', start:'top 85%', end:'center 45%', scrub:true}});
document.querySelectorAll('.hoja').forEach((h, i) => tlV.fromTo(h, {rotate:0, x:0, y:0}, {rotate:abre[i].r, x:abre[i].x * k, y:abre[i].y, ease:'none'}, 0));
tlV.fromTo('.c1', {x:0, y:0}, {x:-40, y:30, ease:'none'}, 0).fromTo('.c2', {x:0, y:0}, {x:50, y:-16, ease:'none'}, 0).from('.coment', {opacity:0, y:12, ease:'none'}, .5);
})();
