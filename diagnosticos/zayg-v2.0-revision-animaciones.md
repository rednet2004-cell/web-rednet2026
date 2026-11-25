# Zayg v2.0 · Revisión de animaciones (paso 3)

Carpeta: `zayg-v2.0-impeccable-motion/` (parte de `zayg-v2.0-impeccable/`). Criterio: review-animations / Emil Kowalski.

| Elemento | Antes | Después | Por qué |
|---|---|---|---|
| Curva base | `cubic-bezier(.22,1,.36,1)` | `--ease-out: cubic-bezier(.23,1,.32,1)` + `--ease-drawer: cubic-bezier(.32,.72,0,1)` | Una salida rápida que frena suave; el drawer para la barra móvil |
| Entradas al hacer scroll | 40 px, 1 s, stagger 70 ms | 24 px, 0,55 s, stagger 55 ms | Se sentían lentas en una página de 15.000 px |
| Entrada del hero (GSAP) | 1,2 s + 0,9 s + 1 s encadenados | 0,9 s título, 0,6 s el resto | El hero sigue siendo el momento principal, pero no hace esperar |
| Botones | 0,35 s, sin respuesta al presionar | 160 ms, `:active scale(.97)` | Respuesta inmediata al dedo y al clic |
| Relleno azul de botones | 0,45 s | 0,3 s | Hover ≤300 ms |
| Header | animaba `padding` 0,4 s | solo color, sombra y `transform` | `padding` recalcula el layout en cada cuadro |
| Lista de servicios | animaba `padding-left` 0,5 s | `translateX(12px)` 0,3 s, solo con mouse | Solo `transform`; en táctil no hay hover pegado |
| Cambio de modelo 216/450/600 | imagen 1,2 s, recorte 1 s | 0,5 s y 0,45 s | Lo dispara el usuario: no puede tardar más que su siguiente clic |
| Contador de m² | 700 ms, dos contadores podían pelear | 450 ms, cancela el anterior | Interrumpible si cambias de modelo rápido |
| Menú móvil | aparecía de golpe | fundido + 8 px en 0,25 s, `overscroll-behavior:contain` | Transición corta que orienta sin demorar |
| Barra fija móvil | (nueva en paso 2) | curva drawer 0,35 s | Entra como una hoja desde abajo |
| FAQ | abre de golpe | altura con `interpolate-size` y `::details-content` (0,5 s) | Mejora progresiva: donde no hay soporte, abre igual |
| Tarjetas y testimonios en táctil | hover pegado tras tocar | hover solo con `(hover:hover) and (pointer:fine)` | Evita estados que quedan "encendidos" en el celular |
| Reducir movimiento | se quitaban algunas entradas | sin desplazamientos; quedan opacidad y color en 200 ms | Respeta la preferencia sin dejar la página muerta |

Sin cambios: el parallax suave de imágenes, los reels (pausa con clic desde el paso 2) y el llenado de palabras del texto de La empresa.
