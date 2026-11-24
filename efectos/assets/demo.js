/* Barra común: lee el slug de <html data-slug> y busca sus datos en catalogo.js */
(function(){
  var slug=document.documentElement.dataset.slug, list=window.EFECTOS||[], i=list.findIndex(function(e){return e.slug===slug}), e=list[i];
  if(!e) return;
  var cat=(window.CATEGORIAS||[]).find(function(c){return c.id===e.categoria})||{};
  var prev=list[(i-1+list.length)%list.length], next=list[(i+1)%list.length];
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  var bar=document.createElement('nav'); bar.className='fx-bar'; bar.setAttribute('aria-label','Catálogo de efectos');
  bar.innerHTML='<a href="../../#'+e.categoria+'" aria-label="Volver al catálogo">← Efectos</a><span class="fx-name">'+esc(e.nombre)+' <span class="fx-lib">· '+esc(e.libreria)+'</span></span><button class="fx-info" aria-expanded="false" aria-controls="fx-panel">Info</button>';
  var p=document.createElement('aside'); p.className='fx-panel'; p.id='fx-panel';
  p.innerHTML='<h2>'+esc(e.nombre)+'</h2><div class="fx-meta"><span>'+esc(cat.breve||'')+'</span><span>'+esc(e.libreria)+'</span><span>Peso: '+esc(e.peso)+'</span><span>'+(e.movil?'Funciona en celular':'Solo escritorio')+'</span>'+(e.estilo?'<span>'+esc(e.estilo)+'</span>':'')+'</div>'
   +'<p>'+esc(e.resumen)+'</p><p><b>Úsalo en:</b> '+esc(e.usar)+'</p><p><b>Fuente:</b> <a href="'+esc(e.fuente.url)+'" target="_blank" rel="noopener">'+esc(e.fuente.texto)+' ↗</a></p>'
   +'<div class="fx-nav"><a href="../'+prev.slug+'/">← '+esc(prev.nombre)+'</a><a href="../'+next.slug+'/">'+esc(next.nombre)+' →</a></div>';
  document.body.appendChild(p); document.body.appendChild(bar);
  var btn=bar.querySelector('.fx-info');
  function toggle(o){p.classList.toggle('open',o);btn.setAttribute('aria-expanded',o)}
  btn.addEventListener('click',function(ev){ev.stopPropagation();toggle(!p.classList.contains('open'))});
  document.addEventListener('keydown',function(ev){if(ev.key==='Escape')toggle(false)});
  document.addEventListener('click',function(ev){if(!p.contains(ev.target))toggle(false)});
  document.title=e.nombre+' · Efectos Rednet';
})();
