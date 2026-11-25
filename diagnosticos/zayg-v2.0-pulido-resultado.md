# Zayg v2.0 · Resultado del pulido (paso 4)

Carpeta final de la ruta: `zayg-v2.0-pulido/`. Las variantes usan los assets de `zayg-v2.0/` con rutas relativas; el ZIP del pulido los incluye.

## Comparación con el diagnóstico

| Medida | v2.0 (base) | impeccable | motion | pulido |
|---|---|---|---|---|
| Hallazgos de `impeccable detect` | 37 | 29 | 28 | 26 |
| Texto chico en cobre o gris bajo 4,5:1 (medido en el navegador) | 30+ elementos | ~12 | ~12 | 0 |
| Texto funcional bajo 11 px | 3 | 0 | 0 | 0 |
| Movimiento infinito sin pausa | marquee + punto | ninguno | ninguno | ninguno |
| Video del hero en celular | 1,8 MB precargado | póster (video solo ≥861 px) | igual | igual |
| Atajo a contacto en móvil | no | barra Cotiza + WhatsApp | con curva drawer | igual |
| Scroll horizontal (390–1440 px) | no | no | no | no |
| Errores de consola | 0 | 0 | 0 | 0 |

Lo que `detect` sigue marcando y por qué queda:
- **Contraste** en titulares grandes con cobre (`em` de los h2): son texto grande y pasan 3:1; el detector no aplica la regla de tamaño.
- **cramped-padding (8):** secciones a sangre con su contenido ya separado por `--gut`; falsos positivos.
- **buried-raster (3):** imágenes de modelos y fotos que parten en opacidad 0 a la espera de su animación.
- **marquee y punto:** el CSS antiguo sigue en el archivo, pero el elemento ya no está en la página y la animación del punto está desactivada.
- **Crema de fondo, grilla y brillo azul:** vienen de la maqueta del cliente (paleta crema y planos); se mantienen a propósito.

## Qué cambió en el pulido

- Íconos SVG de trazo uniforme en vez de caracteres (→ ↗ ↑ ♪).
- Botón del formulario: "Enviando…" → "Enviado" con el botón bloqueado mientras envía.
- `spellcheck="false"` en nombre, apellido y correo; `inputmode` en correo y teléfono.
- `width`, `height` y `decoding="async"` en todas las imágenes.
- `touch-action:manipulation`, color de toque de marca, `tabular-nums` en cifras y `overflow-wrap:anywhere` en tarjetas; sin `will-change` en reposo.
- `translate="no"` en la marca ZAYG.
- Pie con `RUT [RUT]` y la dirección.
- Contrastes AA para etiquetas, metadatos de etapas y placeholders.

## Pendientes que dependen del cliente

1. **RUT** de Constructora e Ingeniería ZAYG SpA para el pie.
2. **Video real del hero** (hoy es un Ken Burns del banner).
3. **Testimonios reales** (hoy son de ejemplo y lo dicen).
4. **Fotos reales de obras** para reemplazar imágenes hechas con IA.
5. Confirmar si se mantienen los **números de sección** (00 / La empresa…) que vienen de su maqueta.
6. **Clave de info@zayg.cl** en `config.php` al subir el sitio.
