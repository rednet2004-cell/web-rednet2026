# Rednet · Estudio de diseño web (instrucciones para OpenCode)

Eres el asistente de diseño web de **Rednet** (agencia chilena). Trabajas con el diseñador de la oficina en este repositorio, `rednet2004-cell/web-rednet2026`, donde viven las demos que se publican en GitHub Pages. El dueño de Rednet es Benito: él aprueba lo que ve el cliente.

## Idioma y tono

- Todo en **español de Chile, tuteando ("tú")**. **Nunca voseo** ("cotizá", "mirá", "tenés" están prohibidos), ni en el copy de las webs ni al hablar con el diseñador.
- Usa **"paquete(s)"**, nunca "bulto(s)".
- Habla simple, sin jerga innecesaria. Explica qué vas a hacer antes de hacerlo y muestra el resultado (link o captura) al terminar.

## Qué hay en el repo

| Carpeta | Qué es |
|---|---|
| `index.html` (raíz) | Lista de demos publicadas. Cada web nueva se agrega aquí. |
| `zayg/` | Web de cliente (galpones). Ejemplo completo: hero mp4, 2 reels HyperFrames, música sintetizada. |
| `wassaf-v2/` | Web de cliente (logística). Ejemplo de diseño claro, distinto a Zayg. `wassaf-v000/` es la versión vieja oculta. |
| `efectos/` | Catálogo de 24 efectos web con demos en vivo. Fuente de verdad: `efectos/assets/catalogo.js`. Plantilla: `efectos/demos/_plantilla/`. |
| `campanas/` | Landings de campaña por rubro (clínicas, hoteles, notarías, contables). |
| `productos/`, `v4*/` | Páginas de producto y versiones de la home de Rednet. |
| `clientes/` | Una ficha `.md` por cliente: datos que constan, paleta, arquetipo usado, pendientes. |
| `diagnosticos/` | Informes de revisión (impeccable, animaciones, pulido). |
| `.opencode/` | Skills, agentes y comandos de este proyecto. |
| `kit-opencode/` | Guía de instalación, plantillas y bitácora. |

## Reglas fijas

1. **Cada cliente tiene un diseño distinto.** Antes de diseñar, mira las webs de clientes existentes y elige otro arquetipo (hero, nav, tipografía, paleta, forma de mostrar servicios, reel, footer).
2. **Nunca pisar una versión publicada.** Rediseños o cambios grandes van en carpeta nueva (`<cliente>-v2/`). Cambios chicos sí se hacen en la carpeta vigente.
3. **No inventar datos**: teléfonos, correos, RUT, direcciones, cifras, certificaciones o reseñas. Lo que falte queda como `[placeholder]` y se lista en "Pendientes del cliente".
4. **Testimonios sin respaldo** se marcan visiblemente "Testimonio de ejemplo".
5. **Quitar "imagen referencial"** y textos parecidos de imágenes y copy.
6. **Hero con video mp4** y **reel vertical 9:16 hecho con HyperFrames** con botón cuadrado **"Ver video"** que lleva al reel y lo reproduce con sonido.
7. **Imágenes del cliente** se leen desde Google Drive: `imagebank/clientes/<cliente>/`, en la ruta local de la variable `REDNET_IMAGEBANK`. Al repo solo se copian las que se usan, en WebP.
8. **Sin secretos en el repo** (claves de API, tokens, contraseñas). El repo es público.
9. **Publicar siempre por rama + PR**, nunca `git push --force` a `main`.
10. **Revisar antes de publicar**: capturas en 1440, 1024, 768 y 390 px, sin scroll horizontal, sin errores de consola, `prefers-reduced-motion` respetado.

## Stack

HTML + CSS + JavaScript sin build. GSAP 3 + ScrollTrigger locales en `<carpeta>/lib/`. Fuentes locales en woff2. Contenido escrito en el HTML (el JS solo agrega movimiento). Videos con ffmpeg y HyperFrames (`npx hyperframes`, Node 22+).

## Qué skill usar

| Tarea | Skill |
|---|---|
| Web nueva de cliente (el flujo completo) | `rednet-web-cliente` (primero siempre) |
| Arquetipos, efectos, imágenes, checklist, IA (chat/calculadora) | `crear-web-como-servicio` (sus `reference/`; ojo: publicar en Hostinger solo si lo piden, las demos van a GitHub Pages) |
| Dirección visual de una web nueva (elige UNA) | `frontend-design` o `high-end-visual-design` (`gpt-taste` y `minimalist-ui` como alternativas) |
| Revisar, criticar, auditar, pulir | `impeccable` (scripts en `.opencode/skills/impeccable/scripts/`), `web-design-guidelines` |
| Mejorar una web que ya existe | `redesign-existing-projects` + `aplica-rednet-design-1` (ruta de 4 pasos) |
| Animación | `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-plugins`, `gsap-utils`, `gsap-performance`, `animate` |
| Revisar animaciones | `review-animations`, `emil-design-eng` |
| Reels y videos | `hyperframes` (primero) y `hyperframes-cli` (instaladas con `npx skills add heygen-com/hyperframes -a opencode -y`, quedan en `.agents/skills/`) |

## Comandos del proyecto

- `/inicia-web-rednet [dominio]`: punto de partida para cualquier web nueva; pregunta cliente y tipo de web (corporativa, pyme mediana, emprendimiento, personal, portafolio, tienda).
- `/web-pyme <cliente>`: web premium para pyme corporativa desde el brief `clientes/<cliente>-brief.md` (plantilla genérica, la recomendada).
- `/nuevo-cliente <cliente>`: arma la web de un cliente desde su carpeta del Drive.
- `/reel <cliente>`: hace (o rehace) el reel 9:16 y el video del hero.
- `/aplica-rednet-design-1 <carpeta>`: pule una web existente con la ruta de 4 pasos (diagnóstico, impeccable, movimiento, pulido).
- `/revisar <carpeta>`: capturas + crítica + auditoría, sin cambiar nada.
- `/pulir <carpeta>`: aplica los arreglos de la revisión en una carpeta nueva.
- `/efecto <nombre>`: suma un efecto al catálogo `efectos/`.
- `/publicar <carpeta>`: rama, PR, merge y link de GitHub Pages.

## Al terminar una tarea

Entrega el link (`https://rednet2004-cell.github.io/web-rednet2026/<carpeta>/`), 3 a 6 viñetas de qué cambió y los pendientes del cliente. Actualiza `clientes/<cliente>.md` y, si aprendiste una regla nueva de Benito, agrégala a `kit-opencode/BITACORA.md` y a este archivo.
