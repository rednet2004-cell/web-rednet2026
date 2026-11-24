# Qué modelo usar en OpenCode

Revisado el 24-11-2026 con la lista de modelos que aparece en el notebook de la oficina. La lista de modelos gratis cambia seguido: si uno desaparece, elige otro con `/models`.

## Qué necesita este trabajo

Una web premium exige un modelo que escriba HTML/CSS/JS largo sin cortarse, siga reglas largas (AGENTS.md + skills), use herramientas en muchos pasos (terminal, navegador, git) y **vea imágenes** (capturas de la web, fotos y borradores del cliente). Sin visión, el modelo no puede revisar cómo quedó el diseño.

## Gratis (para empezar)

| Uso | Modelo | Por qué |
|---|---|---|
| **Principal** (diseñar y construir) | **Nemotron 3.5 Super VL** (sección *OpenCode*, Gratis) | Ve imágenes, contexto de 1M, el mejor de la lista en pruebas de código con herramientas (SWE-bench Verified ≈ 71). Ya viene puesto por defecto en `opencode.jsonc`. |
| **Segunda opción** | **Hy4 flash** (Gratis) | También ve imágenes y tiene 1M de contexto. Probar si Nemotron se pone lento o se corta. |
| **Para revisar texto y lógica** | Tidepool Alpha (Gratis) | Sin visión; sirve para copy, orden de secciones o encontrar errores en el código. |

**Evitar para diseñar:** LFM3-1.7B, Gemma 4 26B A4B y Nemotron 3.5 Lightning (muy chicos para una web completa). Los modelos gratis de **OpenRouter** tienen un límite de unas 50 consultas al día: un agente se lo gasta en una sola web, así que no conviene usarlos como modelo principal.

**Truco:** si el diseñador inicia sesión gratis en **OpenCode Zen** (`/connect` → OpenCode Zen), aparecen más modelos gratis. Vale la pena probar **GLM-5.3-Flash** (pensado para frontend, revisa sus propias capturas) y **DeepSeek V4.1 Flash**.

**Ojo con la privacidad:** varios modelos gratis usan lo que se les envía para entrenar. Para webs de clientes publicadas como demo no es grave, pero no pegues contraseñas, datos personales ni documentos internos.

## Si los gratis no alcanzan (pagado y económico)

1. **DeepSeek (el más barato que rinde bien).** Se paga por uso y cuesta muy poco. Se conecta con `/connect` → DeepSeek (clave de platform.deepseek.com) o cargando saldo en OpenCode Zen. Sirve como modelo principal económico.
2. **Claude Sonnet 5.5 (la mejor calidad de diseño de las opciones económicas).** Es el que más se acerca a lo que se hace hoy con Claude. Cuesta varias veces más que DeepSeek, pero suele necesitar menos vueltas de corrección. Se conecta con `/connect` → Anthropic (clave de console.anthropic.com con saldo prepago) o vía OpenCode Zen.

Consejo: carga un saldo chico (por ejemplo 10 USD) y fija un límite de gasto en la consola del proveedor. Usa el modelo pagado para la construcción principal y un modelo gratis para tareas chicas.

## Cómo probar cuál da mejor resultado

1. Elige un cliente con materiales en Drive.
2. Para cada modelo a probar: `/models` → elegir el modelo → `/nuevo-cliente <cliente> Trabaja en la carpeta prueba-<cliente>-<modelo>/`.
3. Compara en el navegador: calidad visual, si respetó las reglas (tú sin voseo, "paquete", testimonios marcados, reel con botón "Ver video"), cuántas correcciones necesitó y si se cortó a medio camino.
4. Anota el ganador en `kit-opencode/BITACORA.md` y déjalo fijo en `opencode.jsonc` (`"model"`). Borra las carpetas de prueba que no sirvan antes de publicar.

## Cómo fijarlo

- Para la sesión: `/models` y elegir.
- Para siempre: en `opencode.jsonc`, la línea `"model": "opencode/nemotron-3.5-super-vl-free"`. Para Sonnet sería `"anthropic/claude-sonnet-5-5"`; para DeepSeek, el nombre que muestre `/models` (por ejemplo `deepseek/deepseek-chat`).
