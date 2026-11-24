/*
  CATÁLOGO DE EFECTOS · Rednet
  ------------------------------------------------------------
  Este archivo es la única "base de datos" del catálogo.
  Para agregar un efecto nuevo:
    1. Crea la carpeta demos/<slug>/ con su index.html
       (copia demos/_plantilla/index.html como punto de partida).
    2. Agrega un objeto en EFECTOS (abajo) con el mismo slug.
    3. (Opcional) Pon una miniatura en thumbs/<slug>.webp.
       Si no hay miniatura, la tarjeta muestra un degradado.
  Para agregar un sitio o librería de referencia, suma un objeto en FUENTES.
  Para una categoría nueva, suma un objeto en CATEGORIAS.

  Campos de un efecto:
    slug        nombre de la carpeta en demos/
    nombre      título visible
    categoria   id de CATEGORIAS
    libreria    con qué está hecho (texto corto)
    estilo      (opcional) a qué sitio se parece: "Estilo React Bits", etc.
    fuente      { texto, url } enlace a la librería o referencia original
    resumen     una frase: qué hace
    usar        cuándo conviene usarlo en una web de cliente
    peso        "liviano" | "medio" | "pesado"  (impacto en rendimiento)
    movil       true si funciona bien en celular
    etiquetas   palabras para el buscador
    agregado    fecha AAAA-MM-DD (los que se sumen después de la primera tanda muestran "Nuevo" por 30 días)
*/

window.CATEGORIAS = [
  { id: 'fondos', nombre: 'Fondos interactivos', breve: 'Fondos', desc: 'Lo que va detrás del hero: shaders, partículas, auroras y grillas que responden al mouse.' },
  { id: 'scroll', nombre: 'Efectos de scroll y texto', breve: 'Scroll y texto', desc: 'Títulos que aparecen, textos que se pintan, secciones que se fijan y galerías que avanzan con la rueda.' },
  { id: 'ui', nombre: 'Componentes UI 3D y hover', breve: 'UI y hover', desc: 'Tarjetas con inclinación, botones magnéticos, bordes de luz y detalles que premian el mouse.' },
  { id: '3d', nombre: 'Escenas y objetos 3D', breve: 'Escenas 3D', desc: 'Three.js y React Three Fiber: vidrio, globos, recorridos de cámara e imágenes con distorsión.' }
];

window.EFECTOS = [
  /* ───────── FONDOS ───────── */
  { slug: 'vanta', nombre: 'Vanta.js: 8 fondos animados', categoria: 'fondos', libreria: 'Vanta.js + Three.js r134',
    fuente: { texto: 'vantajs.com', url: 'https://www.vantajs.com/' },
    resumen: 'Olas, red de nodos, niebla, pájaros, globo, halo, puntos y células. Cambia entre ellos y ajusta el color.',
    usar: 'Hero de una landing cuando quieres algo vistoso en 5 minutos. Elige uno y úsalo con color de marca.',
    peso: 'medio', movil: true, etiquetas: ['olas', 'red', 'niebla', 'webgl', 'hero'], agregado: '2026-11-24' },
  { slug: 'shader-aurora', nombre: 'Aurora de luz (shader)', categoria: 'fondos', libreria: 'WebGL puro (GLSL)', estilo: 'Estilo Shadertoy',
    fuente: { texto: 'shadertoy.com', url: 'https://www.shadertoy.com/' },
    resumen: 'Cortinas de luz que ondulan y se inclinan hacia el cursor. Un solo shader, sin librerías.',
    usar: 'Hero oscuro y elegante (tecnología, finanzas, salud premium). Pesa casi nada.',
    peso: 'liviano', movil: true, etiquetas: ['shader', 'glsl', 'aurora', 'degradado'], agregado: '2026-11-24' },
  { slug: 'shader-tinta', nombre: 'Tinta líquida (shader)', categoria: 'fondos', libreria: 'WebGL puro (GLSL)', estilo: 'Estilo Shadertoy',
    fuente: { texto: 'The Book of Shaders: ruido', url: 'https://thebookofshaders.com/13/?lan=es' },
    resumen: 'Humo de colores que se deforma sin fin; el mouse lo revuelve. Paleta editable.',
    usar: 'Fondos de marca con mucha personalidad, portadas de campaña, pantallas de carga.',
    peso: 'liviano', movil: true, etiquetas: ['shader', 'humo', 'fluido', 'ruido'], agregado: '2026-11-24' },
  { slug: 'particulas', nombre: 'Partículas que esquivan el cursor', categoria: 'fondos', libreria: 'Canvas 2D (JS puro)', estilo: 'Estilo React Bits',
    fuente: { texto: 'reactbits.dev', url: 'https://reactbits.dev/' },
    resumen: 'Puntos conectados por líneas que se apartan del mouse y vuelven a su lugar.',
    usar: 'Tecnología, redes, logística, "conectamos todo". Muy compatible con celulares.',
    peso: 'liviano', movil: true, etiquetas: ['particulas', 'red', 'constelación', 'canvas'], agregado: '2026-11-24' },
  { slug: 'grilla-foco', nombre: 'Grilla de puntos con foco', categoria: 'fondos', libreria: 'CSS + JS mínimo', estilo: 'Estilo Aceternity / Magic UI',
    fuente: { texto: 'ui.aceternity.com', url: 'https://ui.aceternity.com/components' },
    resumen: 'Patrón de puntos que se ilumina donde está el mouse, con haces de luz que cruzan.',
    usar: 'SaaS, software, fondos de secciones de precios o funciones. Ultra liviano.',
    peso: 'liviano', movil: true, etiquetas: ['grilla', 'puntos', 'spotlight', 'beams'], agregado: '2026-11-24' },
  { slug: 'aurora-css', nombre: 'Aurora de colores (solo CSS)', categoria: 'fondos', libreria: 'CSS puro', estilo: 'Estilo Aceternity',
    fuente: { texto: 'Aceternity: Aurora Background', url: 'https://ui.aceternity.com/components/aurora-background' },
    resumen: 'Manchas de color difuminadas que se mueven lento. Cero JavaScript.',
    usar: 'Cuando el cliente quiere "algo moderno" pero la web tiene que volar en celular.',
    peso: 'liviano', movil: true, etiquetas: ['aurora', 'blur', 'degradado', 'css'], agregado: '2026-11-24' },

  /* ───────── SCROLL Y TEXTO ───────── */
  { slug: 'gsap-titulos', nombre: 'Títulos que aparecen al hacer scroll', categoria: 'scroll', libreria: 'GSAP + ScrollTrigger + SplitText',
    fuente: { texto: 'gsap.com/docs: SplitText', url: 'https://gsap.com/docs/v3/Plugins/SplitText/' },
    resumen: 'Cuatro formas de revelar un título: por letras, palabras, líneas con máscara y desenfoque.',
    usar: 'En casi cualquier web premium. Es el efecto que más "sube el nivel" con menos riesgo.',
    peso: 'liviano', movil: true, etiquetas: ['texto', 'titulo', 'reveal', 'splittext'], agregado: '2026-11-24' },
  { slug: 'gsap-texto-pintado', nombre: 'Texto que se pinta con el scroll', categoria: 'scroll', libreria: 'GSAP + ScrollTrigger',
    fuente: { texto: 'gsap.com/scroll', url: 'https://gsap.com/scroll/' },
    resumen: 'La sección se fija y el párrafo se va encendiendo palabra por palabra mientras bajas.',
    usar: 'Manifiesto de marca, "quiénes somos", la frase que el cliente quiere que se lea sí o sí.',
    peso: 'liviano', movil: true, etiquetas: ['scrub', 'pin', 'manifiesto', 'texto'], agregado: '2026-11-24' },
  { slug: 'gsap-horizontal', nombre: 'Galería horizontal fijada', categoria: 'scroll', libreria: 'GSAP + ScrollTrigger',
    fuente: { texto: 'gsap.com/scroll', url: 'https://gsap.com/scroll/' },
    resumen: 'Bajas con la rueda y las tarjetas avanzan de lado, con barra de progreso.',
    usar: 'Servicios, proyectos, pasos de un proceso. Muy bueno para mostrar 4 a 8 ítems.',
    peso: 'liviano', movil: true, etiquetas: ['horizontal', 'pin', 'galeria', 'proyectos'], agregado: '2026-11-24' },
  { slug: 'gsap-cartas-apiladas', nombre: 'Cartas que se apilan', categoria: 'scroll', libreria: 'GSAP + ScrollTrigger',
    fuente: { texto: 'gsap.com/scroll', url: 'https://gsap.com/scroll/' },
    resumen: 'Cada tarjeta se queda pegada arriba y la siguiente la cubre; las de atrás se achican.',
    usar: 'Servicios o beneficios con foto. Ordena mucha información sin aburrir.',
    peso: 'liviano', movil: true, etiquetas: ['stack', 'sticky', 'tarjetas', 'servicios'], agregado: '2026-11-24' },
  { slug: 'gsap-portada-zoom', nombre: 'Portada que se abre y parallax', categoria: 'scroll', libreria: 'GSAP + ScrollTrigger + Lenis',
    fuente: { texto: 'lenis.darkroom.engineering', url: 'https://lenis.darkroom.engineering/' },
    resumen: 'La foto del hero se expande desde una ventana a pantalla completa; luego capas en parallax.',
    usar: 'Inmobiliarias, hoteles, construcción, turismo: rubros donde la foto vende.',
    peso: 'liviano', movil: true, etiquetas: ['parallax', 'clip-path', 'hero', 'smooth scroll'], agregado: '2026-11-24' },
  { slug: 'anime-texto', nombre: 'Anime.js v4: letras, contadores y trazos', categoria: 'scroll', libreria: 'Anime.js v4',
    fuente: { texto: 'animejs.com', url: 'https://animejs.com/' },
    resumen: 'Letras que rebotan en ola, números que cuentan hasta su valor y un logo que se dibuja solo.',
    usar: 'Cifras de la empresa ("+500 clientes"), intros de marca, íconos que se dibujan al aparecer.',
    peso: 'liviano', movil: true, etiquetas: ['contador', 'svg', 'stagger', 'trazo'], agregado: '2026-11-24' },
  { slug: 'texto-descifrado', nombre: 'Texto que se descifra', categoria: 'scroll', libreria: 'JS puro', estilo: 'Estilo React Bits',
    fuente: { texto: 'React Bits: Decrypted Text', url: 'https://reactbits.dev/text-animations/decrypted-text' },
    resumen: 'Las letras pasan por caracteres al azar hasta formar la palabra. Al cargar y al pasar el mouse.',
    usar: 'Tecnología, ciberseguridad, datos. Un toque "hacker" en títulos cortos o menús.',
    peso: 'liviano', movil: true, etiquetas: ['scramble', 'decrypt', 'hacker', 'menu'], agregado: '2026-11-24' },
  { slug: 'marquee-scroll', nombre: 'Cinta infinita que reacciona al scroll', categoria: 'scroll', libreria: 'GSAP',
    fuente: { texto: 'gsap.com/docs: horizontalLoop', url: 'https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop/' },
    resumen: 'Texto o logos en cinta sin fin que se acelera y cambia de sentido según cómo bajas.',
    usar: 'Logos de clientes, rubros atendidos, frases de marca entre secciones.',
    peso: 'liviano', movil: true, etiquetas: ['marquee', 'logos', 'cinta', 'velocidad'], agregado: '2026-11-24' },

  /* ───────── UI 3D Y HOVER ───────── */
  { slug: 'tarjeta-inclinacion', nombre: 'Tarjetas con inclinación 3D y brillo', categoria: 'ui', libreria: 'CSS 3D + JS puro', estilo: 'Estilo Aceternity 3D Card',
    fuente: { texto: 'Aceternity: 3D Card', url: 'https://ui.aceternity.com/components/3d-card-effect' },
    resumen: 'La tarjeta sigue al mouse en 3D, con capas a distinta profundidad y un reflejo de luz.',
    usar: 'Planes y precios, productos destacados, equipo. En celular reacciona al giro del teléfono.',
    peso: 'liviano', movil: true, etiquetas: ['tilt', 'glare', 'tarjeta', 'precios'], agregado: '2026-11-24' },
  { slug: 'cursor-magnetico', nombre: 'Botones magnéticos y cursor propio', categoria: 'ui', libreria: 'GSAP (quickTo)', estilo: 'Estilo Awwwards',
    fuente: { texto: 'gsap.com/docs: quickTo', url: 'https://gsap.com/docs/v3/GSAP/gsap.quickTo()/' },
    resumen: 'Los botones se "pegan" al mouse cuando te acercas y el cursor cambia según lo que tocas.',
    usar: 'Webs de agencias, portafolios, marcas creativas. En celular se desactiva solo.',
    peso: 'liviano', movil: false, etiquetas: ['magnetico', 'cursor', 'boton', 'hover'], agregado: '2026-11-24' },
  { slug: 'borde-luz', nombre: 'Tarjetas con borde de luz', categoria: 'ui', libreria: 'CSS + JS mínimo', estilo: 'Estilo Magic UI',
    fuente: { texto: 'magicui.design', url: 'https://magicui.design/docs/components/magic-card' },
    resumen: 'Un foco sigue al mouse por la grilla iluminando bordes, y un haz recorre la tarjeta destacada.',
    usar: 'Grillas de funciones o servicios en webs oscuras. Muy de producto digital.',
    peso: 'liviano', movil: true, etiquetas: ['spotlight', 'border beam', 'bento', 'grilla'], agregado: '2026-11-24' },
  { slug: 'lista-imagen-flotante', nombre: 'Lista con imagen que sigue al cursor', categoria: 'ui', libreria: 'GSAP', estilo: 'Estilo Awwwards',
    fuente: { texto: 'gsap.com', url: 'https://gsap.com/' },
    resumen: 'Pasas el mouse por una lista de servicios y la foto de cada uno aparece flotando junto al cursor.',
    usar: 'Listas de servicios, proyectos o sucursales con foto. Elegante y muy liviano.',
    peso: 'liviano', movil: false, etiquetas: ['hover', 'imagen', 'lista', 'servicios'], agregado: '2026-11-24' },
  { slug: 'dock-iconos', nombre: 'Barra de íconos que se agranda', categoria: 'ui', libreria: 'JS puro', estilo: 'Estilo Magic UI Dock',
    fuente: { texto: 'Magic UI: Dock', url: 'https://magicui.design/docs/components/dock' },
    resumen: 'Como el dock de Mac: los íconos crecen según la distancia al mouse.',
    usar: 'Accesos rápidos, redes sociales, menú de una app o un demo de producto.',
    peso: 'liviano', movil: false, etiquetas: ['dock', 'iconos', 'mac', 'menu'], agregado: '2026-11-24' },

  /* ───────── ESCENAS 3D ───────── */
  { slug: 'three-vidrio', nombre: 'Objetos de vidrio flotando', categoria: '3d', libreria: 'Three.js',
    fuente: { texto: 'threejs.org', url: 'https://threejs.org/' },
    resumen: 'Formas de vidrio que refractan luz, flotan y giran hacia el mouse. Misma estética que los videos Rednet.',
    usar: 'Hero de marca tecnológica o premium. Reemplaza una foto genérica por algo único.',
    peso: 'pesado', movil: true, etiquetas: ['vidrio', 'glass', 'transmission', 'hero'], agregado: '2026-11-24' },
  { slug: 'three-globo', nombre: 'Globo con rutas', categoria: '3d', libreria: 'Three.js',
    fuente: { texto: 'threejs.org', url: 'https://threejs.org/' },
    resumen: 'Planeta de puntos que gira con arcos de luz entre ciudades. Se arrastra con el mouse.',
    usar: 'Logística, importación, exportación, cobertura nacional o internacional.',
    peso: 'medio', movil: true, etiquetas: ['globo', 'mapa', 'rutas', 'logistica'], agregado: '2026-11-24' },
  { slug: 'three-recorrido', nombre: 'Recorrido 3D con el scroll', categoria: '3d', libreria: 'Three.js + GSAP ScrollTrigger',
    fuente: { texto: 'threejs.org/examples', url: 'https://threejs.org/examples/' },
    resumen: 'La cámara viaja por un túnel de piezas mientras bajas; cada tramo muestra un texto.',
    usar: 'Contar un proceso en etapas ("así trabajamos") o una presentación de producto.',
    peso: 'medio', movil: true, etiquetas: ['camara', 'scroll', 'storytelling', 'tunel'], agregado: '2026-11-24' },
  { slug: 'r3f-escena', nombre: 'Escena interactiva en React Three Fiber', categoria: '3d', libreria: 'React Three Fiber + Drei',
    fuente: { texto: 'r3f.docs.pmnd.rs', url: 'https://r3f.docs.pmnd.rs/' },
    resumen: 'Piezas que flotan, crecen al pasar el mouse y cambian de color al hacer clic. Hecho en React.',
    usar: 'Cuando la web del cliente es React/Next.js: el 3D vive como un componente más.',
    peso: 'pesado', movil: true, etiquetas: ['react', 'r3f', 'drei', 'interactivo'], agregado: '2026-11-24' },
  { slug: 'imagen-liquida', nombre: 'Imagen con distorsión líquida', categoria: '3d', libreria: 'Three.js (shader)', estilo: 'Estilo Unicorn Studio',
    fuente: { texto: 'unicorn.studio', url: 'https://www.unicorn.studio/' },
    resumen: 'La foto se ondula como agua donde pasa el mouse, con separación de color en los bordes.',
    usar: 'Hero con foto del cliente que se siente "viva". Funciona con cualquier imagen.',
    peso: 'medio', movil: true, etiquetas: ['distorsion', 'imagen', 'rgb shift', 'agua'], agregado: '2026-11-24' }
];

/* Sitios y librerías de referencia. tipo: "libreria" (se instala) | "galeria" (se copia/adapta) | "editor" (se diseña y se incrusta) */
window.FUENTES = [
  { nombre: 'Three.js', url: 'https://threejs.org/', tipo: 'libreria', licencia: 'MIT', para: 'Base de todo el 3D en la web: escenas, vidrio, partículas, shaders.' },
  { nombre: 'React Three Fiber', url: 'https://r3f.docs.pmnd.rs/', tipo: 'libreria', licencia: 'MIT', para: 'Three.js escrito como componentes de React. Ideal si la web es Next.js.' },
  { nombre: 'GSAP + ScrollTrigger', url: 'https://gsap.com/', tipo: 'libreria', licencia: 'Gratis (incluye SplitText desde 2025)', para: 'El estándar para animar con scroll, timelines y texto.' },
  { nombre: 'Anime.js v4', url: 'https://animejs.com/', tipo: 'libreria', licencia: 'MIT', para: 'Animaciones livianas: stagger, SVG, contadores, timelines.' },
  { nombre: 'Vanta.js', url: 'https://www.vantajs.com/', tipo: 'libreria', licencia: 'MIT', para: 'Fondos 3D listos en una línea de código.' },
  { nombre: 'Lenis', url: 'https://lenis.darkroom.engineering/', tipo: 'libreria', licencia: 'MIT', para: 'Scroll suave que hace que todo lo demás se sienta premium.' },
  { nombre: 'React Bits', url: 'https://reactbits.dev/', tipo: 'galeria', licencia: 'MIT + Commons Clause', para: 'Animaciones de texto, fondos y componentes React para copiar y adaptar.' },
  { nombre: 'Aceternity UI', url: 'https://ui.aceternity.com/', tipo: 'galeria', licencia: 'Gratis + Pro de pago', para: 'Componentes Tailwind/React con efectos: tarjetas 3D, beams, auroras.' },
  { nombre: 'Magic UI', url: 'https://magicui.design/', tipo: 'galeria', licencia: 'MIT (Pro de pago)', para: 'Componentes shadcn animados: bordes de luz, dock, marquee, partículas.' },
  { nombre: 'Shadertoy', url: 'https://www.shadertoy.com/', tipo: 'galeria', licencia: 'Por defecto CC BY-NC-SA (no comercial)', para: 'Inspiración de shaders. Para clientes, escribir uno propio o pedir permiso al autor.' },
  { nombre: 'Spline', url: 'https://spline.design/', tipo: 'editor', licencia: 'Freemium', para: '3D diseñado a mano en un editor visual y pegado en la web con un componente.' },
  { nombre: 'Unicorn Studio', url: 'https://www.unicorn.studio/', tipo: 'editor', licencia: 'Freemium', para: 'Efectos WebGL sobre imágenes y texto sin programar; se exporta como script.' }
];
