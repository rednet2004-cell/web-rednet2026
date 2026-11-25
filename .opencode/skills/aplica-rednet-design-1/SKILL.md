---
name: "aplica-rednet-design-1"
description: "Ruta de diseño Rednet v1: diagnosticar, dirigir con Impeccable, afinar movimiento y pulir una página o proyecto web, publicando cada paso como variante aparte."
---

# Rednet Design 1

Esta es la ruta que se usó en noviembre de 2026 para llevar la home de Rednet (v4) a v4-pulido. Sirve para repetirla en otras páginas de Rednet (por ejemplo, páginas de producto) o en proyectos de clientes. El dueño es Benito (Rednet). Quien la usa ahora es el diseñador de la oficina, en OpenCode. Todo se escribe en español de Chile.

## Reglas fijas (no negociables)

- **Nunca pisar una versión.** Cada paso se publica en una carpeta nueva junto a la anterior: `<base>`, `<base>-impeccable`, `<base>-impeccable-motion`, `<base>-pulido`. Así Benito compara y decide qué rescatar.
- **Las variantes reutilizan los assets de la original** con rutas relativas (`../v4/img/...`) en vez de copiar videos o fotos.
- **No inventar datos.** Precios, métricas, reseñas, testimonios, fotos, plazos, número de WhatsApp, RUT y dirección quedan como `[placeholder]`. Si un texto afirma algo que no consta (por ejemplo "soporte 24/7" o "#1"), se marca para que Benito lo confirme. No se borra en silencio.
- **Copy en español de Chile con "tú", nunca voseo:** "Pide", "Escríbenos", "Empieza". Al diseñador y a Benito también se les responde de tú.
- **Publicar.** Rama de trabajo → PR con el título y la descripción en español → merge (comando /publicar) → esperar que el deploy de GitHub Pages quede en `success` → darle el link directo a la carpeta. Repo de la home: `rednet2004-cell/web-rednet2026`, Pages en `https://rednet2004-cell.github.io/web-rednet2026/<carpeta>/`. Agregar cada variante al `index.html` raíz.
- **Revisar antes de publicar.** Capturas con Playwright en 1440, 1024, 768 y 390 px. Sin scroll horizontal y sin errores de consola.

## Marca Rednet (si la página es de Rednet)

- **Paleta:**
  - rojo `#E30613`
  - rojo profundo `#7A0910`
  - ocre `#C8892B`
  - ocre claro `#EDCB93`
  - negro `#0E0D0C`
  - grafito `#1D1B1A` / `#2A2725`
  - gris cálido `#F2F0EC`
  - piedra `#E7E3DC`
- **Tokens de texto con contraste AA:**
  - `--gris-texto #635D57` para texto chico sobre claro
  - `--gris-noche #B3ABA4` para texto chico sobre negro
  - `--ocre-texto #7E520F` para ocre sobre claro
  - `#8D8780` queda solo para titulares grandes
- **Tipografía:** Archivo (wdth 112) para los titulares, Instrument Sans para el cuerpo, JetBrains Mono para los botones y datos.
- **Titulares partidos:** una parte en negro y otra en gris (`h2 .g`).
- **Movimiento:** GSAP 3.12.5 + ScrollTrigger (desde cdnjs).
- **Para clientes:** con otra marca, se reemplaza esta sección por su marca y se mantiene todo lo demás.

## La ruta (4 pasos, en este orden)

### Paso 1: Diagnóstico (no cambia nada)

1. Skill **impeccable**:
   - Correr `scripts/impeccable context --target <archivo>`.
   - Hacer `critique` y `audit` en dos evaluaciones aisladas (subagentes): A es la revisión de diseño con capturas. B es `impeccable detect --json` más el overlay en el navegador y las pruebas técnicas (contraste, teclado, táctil, overflow, peso de video, marcado).
2. Entregar un informe en español en `diagnosticos/<proyecto>/<base>-impeccable-critique-audit.md` con:
   - el puntaje de heurísticas (la 7, la 9 y la 10 pueden quedar n/a en una landing) y el del audit /20;
   - qué rescatar;
   - los problemas P0–P3 con su arreglo;
   - las personas (dueño de pyme en el celular, primerizo no técnico, escéptico);
   - las preguntas.
3. Guardar el snapshot con `critique-storage write` (si el script de impeccable lo soporta).

Problemas que aparecieron en la home y que conviene buscar siempre:
- CTA que no llevan a ningún lado (no hay formulario ni link real a WhatsApp).
- Ningún menú en móvil.
- Elementos de arrastre que atrapan el scroll táctil (`touch-action:none`).
- Movimiento automático sin pausa (WCAG 2.2.2).
- Gris secundario bajo 4,5:1.
- `<button>` que envuelve `h3` y `div`.
- Video de 2 MB precargado en el celular.
- Texto funcional de 10 px.
- Anclas tapadas por el header fijo.

### Paso 2: Dirección visual (una sola skill por variante)

- Ganó **Impeccable** (refinamiento que conserva la identidad).
- **gpt-taste** se probó como alternativa (`<base>-gpt-taste`), pero cambia demasiado. Solo se usa si Benito pide explícitamente comparar un rediseño.
- Nunca se mezclan dos skills de dirección en la misma variante. Los foros coinciden: "una decide, la otra revisa".

En `<base>-impeccable`, leer `reference/craft-floor.md` antes de editar y aplicar:

- **Contacto real.** Formulario corto: nombre, WhatsApp o correo, "¿Qué necesitas?" con las líneas y los planes, y un mensaje opcional. Debe tener validación, mensaje de error, estado de éxito y la nota "maqueta: no envía". También botón `https://wa.me/?text=...` hasta tener el número. Los botones de cada plan preseleccionan el plan en el formulario.
- **Banda del formulario a ancho completo.** Formulario blanco sobre fondo negro con video o animación suave detrás y un degradado oscuro a la izquierda para que se lea el titular (Benito lo prefirió así).
- **Móvil.** Menú hamburguesa a pantalla completa (Escape cierra, el foco va al primer link) y barra fija abajo con "Presupuesto" y "WhatsApp", que aparece después del hero y se oculta al llegar a contacto.
- **Movimiento automático.**
  - Avance cada 5 s como mínimo.
  - Botón de pausa visible.
  - Flechas del teclado y pausa al recibir foco.
  - `aria-hidden` en las tarjetas que no están al frente.
  - Bucles de `requestAnimationFrame` que se detienen fuera de pantalla.
- **Acordeón.** Marcado `h3 > button[aria-expanded][aria-controls]` con panel `role=region` e `inert` cuando está cerrado. No se abre con el scroll. **El contenido usa desde el inicio el ancho final del panel abierto** (`--ancho-abierto`, calculado en JS) para que el texto no se reacomode mientras el panel crece.
- **Reseñas en móvil.** Fila con scroll-snap en vez de pila arrastrable.
- **Quitar señales de plantilla.**
  - La etiqueta (kicker) sobre cada titular.
  - El marquee de logos.
  - Los brillos y halos de color.
  - Las flechas ↗ que parecen link y no lo son.
  - Los números de sección que no informan nada.
  - El toggle Mensual/Anual si no hay precio anual.
- **Texto mínimo 11–12 px.** `scroll-padding-top` para el header fijo. Link "Saltar al contenido".
- **Video.** `preload="none"`. Solo se reproduce en escritorio (≥861 px), sin ahorro de datos y sin reducir movimiento. En el resto se muestra el póster. Se pausa fuera de pantalla.

### Paso 3: Movimiento (en `<base>-impeccable-motion`)

Skill **review-animations** (criterio de Emil Kowalski) y después aplicar.

- **Curvas:**
  - `--ease-out: cubic-bezier(.23,1,.32,1)`
  - `--ease-drawer: cubic-bezier(.32,.72,0,1)`
  - Nada de ease-in ni de ease-in-out lento en la interfaz.
- **Duraciones:**
  - Interfaz: 300 ms o menos.
  - Acordeón: 500 ms.
  - Botones: 160 ms.
  - Toggles: 300 ms.
- **Botones.** `:active{transform:scale(.97)}`. El hover solo dentro de `@media (hover:hover) and (pointer:fine)`.
- **Solo `transform` y `opacity`.** Por ejemplo, barras de métricas con `scaleX` y `transform-origin:0`, no con `width`.
- **Burbujas de chat.** Entran con `scale(.96)` desde su esquina (cliente a la derecha, bot a la izquierda).
- **Entradas al hacer scroll.** Más cortas (24 px, 0,5–0,6 s, stagger de 50–60 ms). Lo que el usuario dispara debe poder interrumpirse (`overwrite:true`).
- **Menú móvil.** Fundido y 8 px de desplazamiento. Barra fija con la curva drawer.
- **FAQ.** Altura animada con `interpolate-size` y `::details-content`, como mejora progresiva.
- **Reducir movimiento.** Se mantienen la opacidad y el color (200 ms) y se quitan los desplazamientos.
- **Informe.** Tabla Antes / Después / Por qué en `diagnosticos/<proyecto>/<base>-revision-animaciones.md`.

### Paso 4: Pulido final (en `<base>-pulido`)

Impeccable `polish` y **web-design-guidelines** (bajar las reglas frescas desde `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`).

- Íconos dibujados en SVG con trazo uniforme en vez de caracteres (→ ← ▶ ↻ + ✓).
- Formulario:
  - Estados "Enviando…" → "Enviado" (con el botón deshabilitado).
  - `spellcheck="false"` en el campo de contacto.
  - Colores explícitos en el `select`.
- `width` y `height` en las imágenes, `decoding="async"`, `theme-color` y meta description.
- `touch-action:manipulation`, un color de tap intencional y `overscroll-behavior:contain` en el menú móvil.
- `translate="no"` en los nombres de marca y de producto. `tabular-nums` en las cifras. `overflow-wrap:anywhere` en las tarjetas.
- Sin `will-change` en reposo.
- Placeholders legales en el pie: RUT y dirección.
- Volver a correr `impeccable detect` y comparar con el paso 1 (en la home bajó de 76 a 31). Escribir `diagnosticos/<proyecto>/<base>-pulido-resultado.md` con la tabla comparativa y los **pendientes que dependen del cliente**.

## Video de fondo que entregue Benito

Sus videos suelen traer una marca de agua "CCM" abajo a la derecha. Para usarlos:

1. Recortar la marca con `crop=1100:619:40:15,scale=1280:720` sobre un video de 1280×720.
2. Hacer un loop sin corte: el cuerpo va de 1,5 s al final menos 1,5 s, y la cola se funde con la cabeza (`xfade` de 1,5 s).
3. Exportar WebM VP9 (crf 40) y MP4 H.264 (crf 26, faststart), más un póster JPG.
4. Comprobar que el último cuadro coincide con el primero.

## Al terminar cada paso

Responder con el link de la carpeta, 3 a 6 viñetas de qué cambió y qué decidir. Anotar en `clientes/<cliente>.md` (o en `kit-opencode/BITACORA.md` para Rednet) qué versión es la base vigente.