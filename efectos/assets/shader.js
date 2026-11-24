/* Mini motor para shaders de pantalla completa (sin librerías).
   uso: fxShader(canvas, fragmentGLSL, {uColor:[r,g,b]})
   Uniforms que entrega: uTime, uRes (px), uMouse (0..1, suavizado), uniforms extra (float o vec3). */
window.fxShader=function(canvas,frag,extra){
  var gl=canvas.getContext('webgl',{antialias:false,premultipliedAlpha:false});
  if(!gl){canvas.style.background='radial-gradient(circle at 30% 30%,#ff5a3c,#2a1050 60%,#0e0d0c)';return}
  function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o}
  var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));
  gl.attachShader(p,sh(gl.FRAGMENT_SHADER,'precision highp float;uniform float uTime;uniform vec2 uRes;uniform vec2 uMouse;\n'+frag));gl.linkProgram(p);gl.useProgram(p);
  var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var a=gl.getAttribLocation(p,'p');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  var U=function(n){return gl.getUniformLocation(p,n)},uT=U('uTime'),uR=U('uRes'),uM=U('uMouse');
  var m=[.5,.5],t=[.5,.5],dpr=Math.min(devicePixelRatio||1,1.5),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){var w=canvas.clientWidth*dpr|0,h=canvas.clientHeight*dpr|0;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
  addEventListener('pointermove',function(e){t=[e.clientX/innerWidth,1-e.clientY/innerHeight]});
  var api={set:function(n,v){var l=U(n);if(typeof v==='number')gl.uniform1f(l,v);else gl.uniform3fv(l,v)}};
  for(var k in (extra||{}))api.set(k,extra[k]);
  var t0=performance.now(),vis=true;new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(canvas);
  (function loop(now){requestAnimationFrame(loop);if(!vis)return;size();m[0]+=(t[0]-m[0])*.05;m[1]+=(t[1]-m[1])*.05;
    gl.uniform1f(uT,reduce?8.:(now-t0)/1000);gl.uniform2f(uR,canvas.width,canvas.height);gl.uniform2f(uM,m[0],m[1]);gl.drawArrays(gl.TRIANGLES,0,3)})(t0);
  return api;
};
/* convierte "#ff5a3c" a [1,.35,.24] */
window.fxHex=function(h){h=h.replace('#','');return[0,2,4].map(function(i){return parseInt(h.substr(i,2),16)/255})};
