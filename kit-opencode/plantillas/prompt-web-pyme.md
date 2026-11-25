# Prompt plantilla · Web premium para pyme corporativa

Hay dos formas de usarlo:

- **Rápida (recomendada):** llena `clientes/<cliente>-brief.md` (copia de `plantillas/brief-cliente.md`) y escribe en OpenCode `/web-pyme <cliente>`. El comando ya contiene el prompt de abajo.
- **Manual:** copia el prompt de abajo, reemplaza lo que está entre `{llaves}` y pégalo en OpenCode.

---

```
Crea la web premium de {NOMBRE} ({DOMINIO}), una empresa de {RUBRO} en {CIUDAD}.
Vende: {QUÉ VENDE EN UNA FRASE}. Público: {PÚBLICO OBJETIVO}.
La web debe transmitir {IDEA 1}, {IDEA 2} y {IDEA 3}. Acción principal: {CTA}.

Antes de empezar, carga la skill rednet-web-cliente y síguela. Carpeta de trabajo: {cliente}/.

MATERIALES
- Lee $REDNET_IMAGEBANK/clientes/{cliente}/: logo, fotos, Indice_imagenes.csv y el borrador del cliente en maqueta-www-v.0.1/.
- Del borrador toma colores, contenido y datos de contacto. No copies su layout.
- Usa las fotos del cliente. Si alguna no sirve o falta, déjalo anotado como pendiente (se puede generar después).

DIRECCIÓN DE ARTE
- Nivel agencia (como una web de 30.000 USD). Nada de plantilla genérica ni de patrones de IA reconocibles.
- Revisa las webs de clientes que ya existen en el repo y elige un arquetipo distinto (hero, menú, tipografías, cómo se muestran los servicios, footer).
- Paleta sacada del logo. Dos tipografías con carácter + una mono para datos, servidas localmente.
- Elige 2 a 4 efectos del catálogo efectos/ que tengan sentido para el rubro y adáptalos. Animaciones con GSAP + ScrollTrigger, con prefers-reduced-motion respetado.
- Antes de construir, muéstrame en 5 líneas: arquetipo, paleta, tipografías, efectos y por qué se diferencia de las webs anteriores. Espera mi visto bueno.

SECCIONES
1. Hero potente con video mp4 de fondo (si no hay video del cliente, haz uno provisorio con sus fotos y márcalo como provisorio).
2. Ventajas / por qué elegirnos.
3. Cómo funciona (proceso en pasos).
4. {SECCIONES EXTRA, ej.: modelos con medidas, servicios, sectores, galería}.
5. Bloque con reel vertical 9:16 hecho con HyperFrames (con música sintetizada) y botón cuadrado "Ver video" que lleva al reel y lo reproduce con sonido.
6. Testimonios: inventados por ahora y marcados visiblemente como "Testimonio de ejemplo".
7. Preguntas frecuentes (acordeón accesible).
8. Contacto: formulario corto ({mailto al correo del cliente | enviar.php}), WhatsApp y datos que constan.

REGLAS
- Español de Chile con "tú", nunca voseo. "Paquete", nunca "bulto". Sin "imagen referencial".
- No inventes teléfonos, correos, direcciones, cifras, certificaciones ni años de experiencia: lo que falte va como [placeholder] en la lista de pendientes.
- No muestres nombres ni cargos de personas que aparezcan en tarjetas de presentación.
- Mobile first: revisa en 390, 768, 1024 y 1440 px, sin scroll horizontal y sin errores de consola.
- Botones cuadrados; CTA del menú siempre en el color principal con texto blanco; títulos sin cortes raros.

ENTREGA
- Crea clientes/{cliente}.md con la ficha y los pendientes.
- No publiques todavía: muéstrame capturas y la lista de pendientes. Cuando lo apruebe, uso /publicar {cliente}.

Notas extra: {LO QUE QUIERAS AGREGAR}
```

---

## Qué cambió respecto al prompt original (el de Zayg y Wasaff)

- Ya no menciona una skill de Claude (`/crear-web-como-servicio` sigue disponible, pero `rednet-web-cliente` la incluye y suma las reglas aprendidas).
- Pide **aprobar la dirección visual antes de construir**: evita rehacer una web completa, como pasó con Wasaff v1.
- Exige un **arquetipo distinto** a las webs anteriores.
- Incluye las reglas que fueron saliendo en los ajustes: tuteo, "paquete", botones cuadrados, CTA del menú, no mostrar nombres de tarjetas, datos sin inventar.
- Define el **formulario** desde el inicio (mailto o enviar.php).
- Reemplaza "busca el artefacto con 3000 webs" por fuentes que el asistente sí puede usar: el catálogo `efectos/`, las webs existentes del repo y las referencias que pongas en el brief.
