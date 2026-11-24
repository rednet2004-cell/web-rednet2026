---
name: rednet-web-cliente
description: Flujo Rednet para crear la landing premium de un cliente (demo en GitHub Pages) desde su carpeta del imagebank de Google Drive, con hero en video, reel 9:16 HyperFrames, efectos del catálogo y publicación. Úsala para "web para un cliente", "landing de <cliente>", "maqueta de <cliente>".
---

# Rednet · Web premium para un cliente

Este es el flujo con el que se hicieron `zayg/` y `wassaf-v2/` en noviembre de 2026. Léelo entero antes de crear una web de cliente. Los ejemplos reales están en el repo: ábrelos y estúdialos, pero **no copies su layout** (ver regla 1).

## Reglas aprendidas (no negociables)

1. **Cada cliente tiene un diseño distinto.** Antes de diseñar, revisa las carpetas de clientes que ya existen en el repo (`zayg/`, `wassaf-v2/`, y las que vengan) y anota su arquetipo: tipo de hero, nav, tipografías, paleta, cómo se muestran los servicios, el reel, el footer. La web nueva debe usar **otro arquetipo** (ver `crear-web-como-servicio/reference/02-archetypes.md` y `06-diversity-guardrails.md`). Wasaff v1 se rehízo entero porque se parecía a Zayg (hero oscuro con panel de vidrio, marquee, tarjetas horizontales fijadas, bento, reel en teléfono, footer gigante).
2. **Español de Chile con "tú", nunca voseo.** "Cotiza", "Escríbenos", "Conoce". Nunca "cotizá", "escribinos", "conocé".
3. **"Paquete(s)", nunca "bulto(s)".** En Chile casi no se usa.
4. **Quitar "imagen referencial"** y cualquier texto parecido que venga en las imágenes o en el borrador del cliente. Muchas imágenes son hechas con IA: si traen texto o marcas raras, recorta o pide reemplazo.
5. **Testimonios de ejemplo marcados.** Si el cliente no entregó testimonios reales, se dejan con la etiqueta visible "Testimonio de ejemplo". Nunca se presentan como reales.
6. **No inventar datos.** Teléfono, correo, dirección, RUT, cifras, certificaciones, años de experiencia: solo si vienen en los materiales del cliente. Si faltan, `[placeholder]` y se listan como pendientes. Nunca mostrar nombre ni cargo de una persona que aparezca en una tarjeta de presentación, salvo que el cliente lo pida.
7. **Hero con video mp4** (autoplay, muted, loop, playsinline, con `poster`). Si el cliente no tiene video, se hace uno provisorio con ffmpeg (efecto Ken Burns sobre sus fotos o el banner) y se marca como provisorio.
8. **Reel vertical 9:16 hecho con HyperFrames** dentro de la página (en un marco tipo teléfono o tarjeta), con música, y un **botón cuadrado "Ver video"** que hace scroll hasta el reel y lo reproduce con sonido desde el inicio. El reel se reproduce mudo solo cuando está en pantalla (IntersectionObserver) y tiene botón "♪ Activar música / Silenciar". Ver `zayg/main.js` (bloque "Video 9:16") y `zayg/index.html` (`#watchBtn`).
9. **Formulario sin backend**: mientras no haya destino real, el envío abre `mailto:` al correo del cliente (si consta) y lo dice. WhatsApp con `https://wa.me/<número>` solo si el número consta.
10. **Botones y detalles que Benito suele pedir** (aplicar salvo que la marca diga otra cosa): botones cuadrados, CTA del menú siempre en el color principal de la marca con texto blanco, textos chicos del hero más grandes de lo habitual, títulos sin cortes raros (usar `text-wrap: balance` y revisar en 390 px).
11. **Nunca pisar una versión publicada.** Si el cambio es grande o es un rediseño, se crea carpeta nueva (`<cliente>-v2/`). La anterior se deja (se puede ocultar del índice).

## Paso a paso

### 1. Materiales del cliente (Google Drive)

- Carpeta: `imagebank/clientes/<cliente>/` dentro del Drive de Rednet (dueño assets@rednet.cl). En este notebook se lee desde Google Drive para escritorio; la ruta local está en la variable de entorno `REDNET_IMAGEBANK` (ver `kit-opencode/GUIA-INSTALACION.md`).
- Suele traer: logo, banner, fotos (a menudo `.webp` hechas con IA), `Indice_imagenes.csv` (qué es cada imagen) y `maqueta-www-v.0.1/` con un borrador o captura que hizo el cliente (por ejemplo con ChatGPT).
- Lee primero el CSV y el borrador. Del borrador saca: nombre legal, servicios, proceso, datos de contacto, paleta y tono. **No copies el layout del borrador**, solo el contenido.
- Copia al repo solo las imágenes que uses, convertidas a WebP (`crear-web-como-servicio/scripts/webp_convert.py`), en `<cliente>/assets/img/`.
- Si algo no está, no lo inventes: anótalo en "Pendientes del cliente".

### 2. Ficha del cliente

Crea `clientes/<cliente>.md` en el repo con: nombre, rubro, ciudad, datos de contacto que constan, paleta (hex sacados del logo), tipografías elegidas, arquetipo elegido y por qué es distinto a los anteriores, y la lista de pendientes. Usa `kit-opencode/plantillas/ficha-cliente.md`.

### 3. Dirección visual

- Una sola skill de dirección por versión: **frontend-design** o **high-end-visual-design** (o **impeccable** si se refina algo existente). No mezclar dos.
- Paleta desde el logo. Dos tipografías (titulares + cuerpo) y una mono para datos; servirlas locales en `<cliente>/assets/fonts/` (woff2).
- Elige 2 a 4 efectos del catálogo `efectos/` (ver `efectos/assets/catalogo.js` y las demos en `efectos/demos/<slug>/`). Adáptalos, no los pegues tal cual. Si creas un efecto nuevo que sirva para otros, súmalo al catálogo (comando `/efecto`).

### 4. Construcción

Estructura (igual que los ejemplos):

```
<cliente>/
  index.html        contenido escrito en el HTML (el JS solo mejora)
  styles.css
  main.js           IIFE, cada bloque dentro de safe(...)
  lib/              gsap.min.js + ScrollTrigger.min.js locales
  assets/img/       webp
  assets/fonts/     woff2
  assets/video/     hero.mp4 (+ poster), reel 9:16 mp4
  video-src/        fuentes del reel HyperFrames y de la música
```

- HTML/CSS/JS sin build. GSAP 3 + ScrollTrigger locales. Scroll nativo.
- Respetar `prefers-reduced-motion` (sin desplazamientos, solo opacidad).
- Accesible: contraste AA, foco visible, menú móvil, `scroll-padding-top` para el header fijo.
- Videos: hero `preload="auto"` liviano (idealmente < 3 MB); reel `preload="metadata"`.
- Agregar la web al `index.html` raíz del repo (la lista de demos).

### 5. Video del hero (provisorio)

Con ffmpeg, Ken Burns de 8 a 12 s sobre 3 o 4 fotos del cliente, 1920×1080, H.264 crf 26, `-movflags +faststart`, sin audio, y póster JPG/WebP del primer cuadro. Cuando el cliente mande su video real, se reemplaza el archivo.

### 6. Reel 9:16 con HyperFrames

Usa las skills **hyperframes** (léela primero: contrato de render, movimiento, sonido, formato vertical) y **hyperframes-cli** (se instalan con `npx skills add heygen-com/hyperframes -a opencode -y`, ver la guía).

- Fuente en `<cliente>/video-src/reel-hyperframes.html` (1080×1920, 30 fps, 20 a 27 s, 4 o 5 escenas con `class="clip"` y `data-start`/`data-duration`). Ejemplos: `zayg/video-src/reel-hyperframes.html`, `zayg/video-src/reel-empresa-hyperframes.html`, `wassaf-v2/video-src/reel-hyperframes.html`.
- Para renderizar, la composición necesita a su lado una carpeta `assets/` con gsap, las fuentes (ttf/woff2) y las imágenes. Render: `npx hyperframes render` (requiere Node 22+ y FFmpeg). Corre `npx hyperframes lint` antes.
- Música: pista sintetizada con Python + numpy (ver `zayg/video-src/musica.py`): tempo fijo, acordes que cambian en los cortes del video, golpes en cada transición. Se agrega como `<audio>` en la composición. No usar música con derechos.
- Copia el mp4 final a `<cliente>/assets/video/` (comprimido, idealmente < 6 MB) y un póster.

### 7. Revisión antes de publicar

- Capturas con Playwright en 1440, 1024, 768 y 390 px (el MCP de Playwright está en `opencode.jsonc`). Sin scroll horizontal, sin errores en la consola, el hero y el reel cargan.
- Pasa la checklist de `crear-web-como-servicio/reference/08-pre-deploy-checklist.md`.
- Busca en el texto: "vos", "bulto", "referencial", "lorem", y datos inventados.
- Para una revisión más fuerte, usa el agente `revisor-diseno` (comando `/revisar`).

### 8. Publicar la demo

Comando `/publicar <cliente>`: rama `disenador/<cliente>-<cambio>`, commit en español, PR en español a `main`, merge, y esperar el deploy de GitHub Pages. URL: `https://rednet2004-cell.github.io/web-rednet2026/<cliente>/`. Nunca `push --force` a `main`.

### 9. Entrega

Responde con: el link, 3 a 6 viñetas de qué se hizo, y la lista de "Pendientes del cliente" (datos que faltan, testimonios reales, video real, destino del formulario). Actualiza `clientes/<cliente>.md`.
