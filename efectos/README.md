# Catálogo de efectos

Vista: https://rednet2004-cell.github.io/web-rednet2026/efectos/

## Agregar un efecto
1. Copia `demos/_plantilla/` a `demos/<slug>/` y cambia `data-slug` en el `<html>`.
2. Agrega su ficha en `assets/catalogo.js` (lista `EFECTOS`, mismo slug). La barra de info de la demo y la tarjeta del índice se arman solas con esos datos.
3. Opcional: miniatura 800×500 en `thumbs/<slug>.webp` (sin ella, la tarjeta muestra un degradado).

## Agregar un sitio o librería de referencia
Suma un objeto en `FUENTES` dentro de `assets/catalogo.js`.

## Librerías locales (`vendor/`)
gsap, ScrollTrigger, SplitText, lenis, anime.js v4 (UMD), three r170 (módulo, vía importmap), three r134 + vanta.* (Vanta necesita la versión vieja).

## React Three Fiber
La demo `r3f-escena` se compila desde `fuentes/r3f-escena/app.jsx` (comando en la cabecera del archivo).
