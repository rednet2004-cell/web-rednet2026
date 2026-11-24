# Qué modelo usar en OpenCode

> Recomendación provisoria: se ajusta cuando Benito comparta la lista exacta de modelos que aparece en `/models`.

## Qué necesita este trabajo

Diseñar webs premium exige un modelo que: escriba HTML/CSS/JS largo sin romperse, tenga buen gusto visual (tipografía, espaciado, composición), siga reglas de estilo largas (AGENTS.md + skills), use herramientas en muchos pasos (terminal, navegador, git) y lea imágenes (capturas, fotos del cliente).

## Orden recomendado (si están disponibles)

| Uso | Primera opción | Alternativa |
|---|---|---|
| **Diseño y construcción** (agente `disenador-web`) | Claude Opus (la versión más nueva que aparezca) | Claude Sonnet más nuevo · Gemini Pro más nuevo |
| **Revisión** (`revisor-diseno`) | El mismo de diseño | GPT más nuevo de razonamiento |
| **Tareas rápidas** (renombrar, mover archivos, commits) | Claude Haiku o un modelo "mini/flash" | — |

Criterio: los modelos de Anthropic y Google son hoy los más fuertes en frontend visual; si el notebook solo tiene acceso a modelos gratuitos o abiertos, elige el más grande que soporte herramientas y visión, y espera más vueltas de corrección.

## Cómo fijarlo

En OpenCode, `/models` y elegir. Para dejarlo fijo en un agente, agrega en el encabezado de `.opencode/agents/disenador-web.md` una línea `model: proveedor/modelo` (por ejemplo `model: anthropic/claude-opus-5-5`).
