# Zayg v2.0 · Diagnóstico Impeccable (critique + audit)

Fecha: 2026-11-25. Base: `zayg-v2.0/` (versión aprobada por el cliente, la del ZIP para zayg.cl).
Método: capturas en 1440, 1024, 768 y 390 px con Playwright; `impeccable detect --json` (37 hallazgos); pruebas técnicas de overflow, consola, videos, anclas y texto chico.

## Veredicto

Ya tiene identidad propia: azul navy y cobre de la maqueta del cliente, Archivo condensada, planos y cotas como lenguaje gráfico, y dos reels propios. No se ve como una plantilla genérica. Lo que la frena son temas de ejecución: el cobre falla en contraste como texto chico, hay movimiento automático sin pausa, el video del hero pesa 1,8 MB y se precarga en el celular, y en móvil no hay ninguna forma rápida de escribir por WhatsApp hasta llegar al final.

## Heurísticas de Nielsen (0 a 4)

| # | Heurística | Puntaje | Problema principal |
|---|---|---|---|
| 1 | Visibilidad del estado | 3 | El formulario muestra "Enviando…", pero el botón no cambia de estado visible |
| 2 | Coincidencia con el mundo real | 4 | Habla como constructora: m², luz × largo, radier, portones |
| 3 | Control y libertad | 2 | El marquee y el punto que pulsa no se pueden pausar; el splash tapa la página al cargar |
| 4 | Consistencia | 3 | Mezcla de flechas ↗ y → como caracteres; ↗ en servicios que no son link |
| 5 | Prevención de errores | 3 | Validación clara; faltan `spellcheck` y `inputmode` en correo y teléfono |
| 6 | Reconocer antes que recordar | 3 | Menú claro; el contacto en móvil queda a 15.000 px del hero |
| 7 | Flexibilidad y eficiencia | n/a | Landing, no aplica |
| 8 | Estética y minimalismo | 3 | Numeración 00–09 en todas las secciones, coordenadas "X 000 · Y 000", marquee |
| 9 | Recuperarse de errores | 3 | El error del envío da el correo y el teléfono como alternativa |
| 10 | Ayuda y documentación | n/a | Landing; el FAQ cumple |

**Total: 24/32 (75 %, Bueno).**

## Audit técnico (/20)

| Dimensión | Puntaje | Notas |
|---|---|---|
| Accesibilidad | 2/4 | Cobre #BC643E sobre crema 3,7:1, sobre navy 3,4–4,0:1; gris #8A96A3 sobre blanco 3,0:1; placeholder 3,0:1; "Ejemplo" a 10 px; movimiento infinito sin pausa (WCAG 2.2.2) |
| Rendimiento | 2/4 | Video del hero 1,8 MB con `preload=auto` también en celular; reels 2,3 y 1,4 MB con `preload=metadata`; splash que retrasa el primer contenido |
| Tema y tokens | 3/4 | Paleta en variables; falta un token de cobre para texto chico; selección, caret y scrollbar con colores por defecto |
| Responsive | 3/4 | Sin scroll horizontal en 390–1440; en móvil faltan una barra fija de contacto y un atajo a WhatsApp |
| Anti‑patrones | 3/4 | Marquee, punto pulsante, fondo de grilla tipo "codex", kickers numerados en cada sección |

**Total: 13/20.**

## Qué rescatar (no tocar)

- La paleta navy, cobre y crema de la maqueta, y el azul del logo en los botones (pedido de Benito).
- Los titulares en Archivo condensada, partidos en navy y cobre.
- Los dos reels 9:16 y el botón cuadrado "Ver video".
- Las fichas de modelos 216/450/600 m² con cotas dibujadas.
- El formulario corto con envío SMTP (ya es el que se sube a zayg.cl).

## Problemas y arreglo

| Prioridad | Problema | Arreglo |
|---|---|---|
| P1 | Cobre como texto chico no llega a 4,5:1 (etiquetas, "Etapa 01", datos) | Token `--cobre-texto` #9C4F2C sobre claro y #E0946B sobre oscuro; el cobre original solo en titulares grandes y fondos |
| P1 | Marquee y punto pulsante infinitos, sin pausa | Quitar el marquee; el punto queda fijo |
| P1 | Móvil: no hay atajo a contacto ni a WhatsApp hasta el final | Barra fija abajo con "Cotiza" y "WhatsApp" que aparece tras el hero y se oculta en contacto |
| P1 | Video del hero de 1,8 MB precargado en el celular | `preload=none`, solo en escritorio (≥861 px) sin ahorro de datos ni reducir movimiento; si no, póster |
| P2 | Gris #8A96A3 y placeholder a 3:1 | Subir a #5E6A75 sobre claro y #9AA8B4 sobre oscuro |
| P2 | Splash al cargar | Quitarlo: la página ya tiene entrada animada en el hero |
| P2 | "X 000 · Y 000" y numeración 00–09 en cada sección | Quitar las coordenadas; **numeración: se mantiene porque viene de la maqueta del cliente y Benito pidió agrandarla** (ver preguntas) |
| P2 | ↗ en servicios que no son link, flechas como caracteres | Quitar ↗ decorativas; íconos SVG de trazo uniforme en el paso 4 |
| P2 | Formulario oscuro sobre fondo oscuro | Formulario blanco a ancho completo sobre navy con el reel de obra suave detrás |
| P3 | "Ejemplo" a 10 px | Mínimo 12 px |
| P3 | Selección de texto, caret y foco con colores del navegador | Tematizar con el cobre y el navy |

## Personas

- **Dueño de pyme en el celular (Antofagasta, en faena):** entiende la oferta en el hero, pero para cotizar tiene que bajar 15 pantallas o encontrar el menú. Necesita WhatsApp a un toque.
- **Primerizo que nunca ha construido un galpón:** el proceso en 6 etapas y el FAQ le sirven; las cotas y la ficha técnica le dan confianza.
- **Escéptico:** los testimonios dicen "Ejemplo" (correcto, son inventados); todavía no hay fotos reales de obras ni RUT en el pie.

## Preguntas para Benito

1. Los números de sección (00 / La empresa, 01 / Ventajas…) vienen de la maqueta del cliente y pediste agrandarlos. La ruta los considera señal de plantilla. ¿Los mantengo (opción por defecto en estas variantes) o los dejo solo como etiqueta sin número?
2. ¿Está bien quitar la franja que se mueve sola (marquee) bajo el hero?
3. ¿Hay RUT de ZAYG SpA para el pie? Por ahora queda `[RUT]`.

## detect (línea base)

37 hallazgos: 14 de contraste, 9 de padding (falsos positivos en secciones a sangre), 3 gris sobre color, 3 imágenes a opacidad 0 (son las que esperan su animación), 3 de texto a 10 px, crema como fondo, punto pulsante, marquee, brillo de color en fondo oscuro y grilla de fondo.
