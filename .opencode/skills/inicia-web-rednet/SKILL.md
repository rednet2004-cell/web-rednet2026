---
name: inicia-web-rednet
description: Inicia una web nueva de Rednet. Pregunta dominio, cliente y tipo de web (corporativa, emprendimiento, personal, portafolio, pyme mediana, tienda) y arma la demo con el flujo Rednet.
---

# Iniciar web Rednet

Este es el punto de partida para cualquier web nueva. Primero se juntan los parámetros, después se arma el brief y recién entonces se diseña. Todo se escribe en español de Chile, tuteando y nunca con voseo.

## 1. Preguntar los parámetros iniciales (en un solo mensaje)

Pregunta **solo lo que falte**, todo en un único mensaje y con las opciones a la vista:

1. **Dominio (www):** por ejemplo `zayg.cl`. Si todavía no tiene, anota "sin dominio".
2. **Cliente:** su nombre comercial y el nombre de su carpeta en `$REDNET_IMAGEBANK/clientes/<cliente>/`. Por defecto, la carpeta se llama como el dominio sin `.cl`.
3. **Tipo de web** (se elige uno):
   - **Corporativa:** empresa establecida; transmite confianza e institucionalidad.
   - **Pyme mediana:** servicios B2B; el foco está en cotizar.
   - **Emprendimiento:** marca nueva o lanzamiento; busca captar los primeros clientes.
   - **Personal:** profesional independiente.
   - **Portafolio:** muestra trabajos.
   - **Tienda:** catálogo de productos con compra o pedido.
4. **Acción principal:** cotizar, agendar, escribir por WhatsApp o comprar.
5. **Formulario:** por ahora un mailto al correo del cliente, o un envío real con `enviar.php` en su hosting.

No preguntes nada que se pueda sacar de los materiales del cliente.

## 2. Leer los materiales

- En `$REDNET_IMAGEBANK/clientes/<cliente>/` están el logo, las fotos, `Indice_imagenes.csv` y el borrador del cliente en `maqueta-www-v.0.1/`.
- Del borrador se toman los colores, el contenido y los datos de contacto, **nunca el layout**.
- Lo que falte queda como `[placeholder]` en la lista de pendientes. No inventes datos.

## 3. Secciones según el tipo de web

Todas las webs llevan esta base:
- hero con video mp4 de fondo;
- reel 9:16 hecho con HyperFrames y un botón cuadrado "Ver video";
- preguntas frecuentes;
- contacto.

| Tipo | Agregar |
|---|---|
| Corporativa | La empresa, servicios, cifras que consten, sectores, certificaciones si constan |
| Pyme mediana | Ventajas, cómo funciona, servicios o modelos, sectores, testimonios de ejemplo |
| Emprendimiento | Problema y solución, beneficios, cómo funciona, oferta de lanzamiento, testimonios de ejemplo, captura de correos |
| Personal | Sobre mí, servicios, método, casos que consten, agendar |
| Portafolio | Galería de proyectos con una ficha por proyecto, estudio, clientes, proceso |
| Tienda | Catálogo con filtros, ficha de producto, beneficios (envío, cambios), pedido por WhatsApp o carrito |

Los testimonios que no tengan respaldo se marcan siempre como "Testimonio de ejemplo".

## 4. Brief y punto de control

1. Escribe `clientes/<cliente>-brief.md` a partir de `kit-opencode/plantillas/brief-cliente.md`.
2. Revisa las webs de clientes que ya existen en el repo y elige un **arquetipo distinto**.
3. Muestra la dirección en 5 líneas: arquetipo, paleta, tipografías, efectos de `efectos/` y por qué se diferencia de las webs anteriores. **Espera el visto bueno antes de construir.**

## 5. Construir

Sigue `kit-opencode/plantillas/prompt-web-pyme.md` y la skill `rednet-web-cliente`, adaptando las secciones al tipo elegido. Cuando esté lista, publica con `/publicar <cliente>`.
