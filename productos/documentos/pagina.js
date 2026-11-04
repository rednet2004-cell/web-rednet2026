/* Borrador N · Gestor Documental: archivos que se ordenan solos, buscador real, bajo tu llave, abanico de versiones y enlace con permisos */
(function(){
const {reduce, hasG} = RN;
/* 1 Archivos: del desorden a las carpetas */
const archivos = [
['Ficha cliente Ruiz.pdf', 'ficha ruiz (2).pdf', 0, 'correo'], ['Ficha cliente Soto.pdf', 'Escanear0034.pdf', 0, 'escritorio'], ['Cartera clientes 2026.xlsx', 'clientes_VIEJO.xlsx', 0, 'pendrive'], ['Datos contacto Pérez.docx', 'perez datos.docx', 0, 'WhatsApp'],
['Contrato arriendo local 2026.pdf', 'contrato_final_FINAL.pdf', 1, 'correo'], ['Contrato proveedor café.pdf', 'IMG_2291.jpg', 1, 'WhatsApp'], ['Anexo contrato Soto.pdf', 'anexo???.pdf', 1, 'descargas'], ['Contrato trabajo [Nombre].pdf', 'contrato nuevo v3.pdf', 1, 'pendrive'],
['Factura 1042 marzo.pdf', 'factura.pdf', 2, 'correo'], ['Factura 1043 marzo.pdf', 'factura (1).pdf', 2, 'correo'], ['Facturas abril.xlsx', 'Libro1.xlsx', 2, 'escritorio'], ['Boleta luz marzo.pdf', 'boleta luz.pdf', 2, 'WhatsApp'],
['Propuesta [Cliente] v4.docx', 'propuesta_v3_ahora_si.docx', 3, 'correo'], ['Planos local.pdf', 'planos.pdf', 3, 'pendrive'], ['Fotos obra.zip', 'Nueva carpeta (4).zip', 3, 'escritorio'], ['Cronograma proyecto.xlsx', 'crono FINAL.xlsx', 3, 'descargas']
];
const arch = document.getElementById('archivo'), fichas = document.getElementById('fichas');
const els = archivos.map(a => { const d = document.createElement('div'); d.className = 'ficha'; d.innerHTML = '<b></b><small></small>'; fichas.append(d); return d; });
const pos = {};
function medir(){
const W = arch.clientWidth, H = arch.clientHeight, pad = innerWidth < 900 ? 12 : 18, gap = innerWidth < 900 ? 6 : 10, colW = (W - pad * 2 - gap * 3) / 4;
pos.orden = archivos.map((a, i) => { const col = a[2], row = i % 4; return {x:pad + col * (colW + gap), y:pad + 42 + row * 90, r:0, w:colW}; });
pos.caos = archivos.map(() => ({x:pad + Math.random() * (W - colW * 1.3 - pad * 2), y:30 + Math.random() * (H - 130), r:Math.random() * 50 - 25, w:colW * 1.3}));
}
const textos = modo => els.forEach((e, i) => { const a = archivos[i]; e.firstChild.textContent = modo === 'orden' ? a[0] : a[1]; e.lastChild.textContent = modo === 'orden' ? ['Clientes', 'Contratos', 'Facturas', 'Proyectos'][a[2]] + ' · al día' : 'Guardado en: ' + a[3]; });
function poner(modo){ medir(); arch.classList.toggle('orden', modo === 'orden'); textos(modo); els.forEach((e, i) => { const p = pos[modo][i]; e.style.width = p.w + 'px'; e.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.r}deg)`; }); }
function ordenar(){
medir(); arch.classList.add('orden');
els.forEach((e, i) => { const p = pos.orden[i]; gsap.to(e, {x:p.x, y:p.y, rotate:0, width:p.w, duration:1, ease:'power3.inOut', delay:.05 * i, onStart:() => { e.firstChild.textContent = archivos[i][0]; e.lastChild.textContent = ['Clientes', 'Contratos', 'Facturas', 'Proyectos'][archivos[i][2]] + ' · al día'; }}); });
}
function desordenar(){
medir(); arch.classList.remove('orden'); textos('caos');
els.forEach((e, i) => { const p = pos.caos[i]; gsap.to(e, {x:p.x, y:p.y, rotate:p.r, width:p.w, duration:.7, ease:'power2.out', delay:.02 * i}); });
}
const anim = hasG && !reduce;
if (anim){
medir(); textos('caos');
els.forEach((e, i) => { const p = pos.caos[i]; gsap.set(e, {x:p.x, y:p.y, rotate:p.r, width:p.w}); });
gsap.delayedCall(1.4, ordenar);
document.getElementById('desordenar').addEventListener('click', () => { desordenar(); gsap.delayedCall(1.5, ordenar); });
addEventListener('resize', () => { if (arch.classList.contains('orden')){ medir(); els.forEach((e, i) => { const p = pos.orden[i]; gsap.set(e, {x:p.x, y:p.y, rotate:0, width:p.w}); }); } });
} else {
poner('orden'); addEventListener('resize', () => poner('orden'));
document.getElementById('desordenar').addEventListener('click', () => { poner('caos'); setTimeout(() => poner('orden'), 1200); });
}
/* 3 Buscador real sobre archivos de ejemplo */
const docs = [
['Contrato arriendo local 2026', 'pdf', 'Contratos', '12 mar 2026', 'Tú'], ['Contrato proveedor café', 'pdf', 'Contratos', '3 feb 2026', 'Contabilidad'], ['Anexo contrato Soto', 'pdf', 'Contratos', '28 mar 2026', 'Ventas'],
['Factura 1042 marzo', 'pdf', 'Facturas', '5 mar 2026', 'Contabilidad'], ['Factura 1043 marzo', 'pdf', 'Facturas', '9 mar 2026', 'Contabilidad'], ['Facturas abril', 'xls', 'Facturas', '30 abr 2026', 'Contabilidad'],
['Propuesta [Cliente] v4', 'doc', 'Proyectos', 'Hoy', 'Ventas'], ['Cronograma proyecto', 'xls', 'Proyectos', '18 mar 2026', 'Tú'], ['Planos local', 'pdf', 'Proyectos', '2 ene 2026', 'Tú'],
['Ficha cliente Ruiz', 'pdf', 'Clientes', '14 mar 2026', 'Ventas'], ['Cartera clientes 2026', 'xls', 'Clientes', '1 ene 2026', 'Ventas'], ['Boleta luz marzo', 'pdf', 'Facturas', '20 mar 2026', 'Tú'],
['Manual de procedimientos', 'doc', 'Empresa', '7 ene 2026', 'Tú'], ['Seguro local 2026', 'pdf', 'Contratos', '15 ene 2026', 'Contabilidad']
];
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const lista = document.getElementById('lista'), bqIn = document.getElementById('bqIn'), bqN = document.getElementById('bqN');
function buscar(q){
const nq = norm(q.trim());
const res = docs.filter(d => !nq || norm(d.join(' ')).includes(nq));
lista.innerHTML = '';
bqN.textContent = nq ? `${res.length} ${res.length === 1 ? 'resultado' : 'resultados'} · 0,4 s` : `${docs.length} archivos`;
if (!res.length){ const li = document.createElement('li'); li.className = 'vacio'; li.textContent = 'Nada con esa palabra. Prueba "contrato" o "marzo".'; lista.append(li); return; }
res.slice(0, 7).forEach(d => {
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
/* 4 Bajo tu llave */
const vis = document.getElementById('llaveVis');
vis.querySelectorAll('.docs i').forEach((d, k) => d.style.setProperty('--k', k));
document.querySelectorAll('#tgLlave button').forEach(b => b.addEventListener('click', () => vis.dataset.m = b.dataset.m));
/* 6 Enlace con permisos */
const sw = id => document.getElementById(id).checked, url = document.getElementById('url'), resEn = document.getElementById('resEn');
function enlace(){
const ed = sw('swEd'), ve = sw('swVe'), pw = sw('swPw'), de = sw('swDe');
url.textContent = 'docs.tuempresa.cl/s/k7Q2';
resEn.textContent = `Quien tenga el enlace ${ed ? 'puede editar' : 'solo puede ver'}${de ? ' y descargar' : ''}. ${ve ? 'Deja de funcionar en 7 días.' : 'No vence.'}${pw ? ' Pide contraseña.' : ''}`;
}
document.querySelectorAll('.switches input').forEach(i => i.addEventListener('change', enlace));
enlace();
const copiar = document.getElementById('copiar');
copiar.addEventListener('click', () => { try { navigator.clipboard && navigator.clipboard.writeText('https://' + url.textContent); } catch(e){} copiar.textContent = 'Copiado ✓'; setTimeout(() => copiar.textContent = 'Copiar', 1600); });
if (!anim){ return; }
gsap.from('#heroTxt > *', {y:40, opacity:0, duration:1, ease:'power3.out', stagger:.08});
ScrollTrigger.create({trigger:'.buscador', start:'top 75%', once:true, onEnter:demo});
gsap.from('.buscador', {y:60, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:'.buscador', start:'top 88%'}});
/* 5 Abanico de versiones con el scroll */
const abre = [{r:-22, x:-120, y:20}, {r:-9, x:-50, y:0}, {r:6, x:30, y:-6}, {r:0, x:90, y:-14}];
document.querySelectorAll('.hoja').forEach((h, i) => gsap.fromTo(h, {rotate:0, x:0, y:0}, {rotate:abre[i].r, x:abre[i].x * (innerWidth < 860 ? .55 : 1), y:abre[i].y, ease:'none', scrollTrigger:{trigger:'#abanico', start:'top 85%', end:'center 45%', scrub:true}}));
gsap.from('.enlace', {y:70, rotate:-2, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:'.enlace', start:'top 85%'}});
})();
