---
description: Aplica los arreglos de la última revisión en una carpeta nueva (<carpeta>-pulido)
agent: disenador-web
---

Lee el informe más reciente de `diagnosticos/$1/` y aplica los arreglos P0 y P1 (y P2 si son rápidos).

- Si `$1` ya está publicada y el cambio es grande, trabaja en una copia `$1-pulido/` (sigue la skill `rednet-design-1`, paso 4). Si son ajustes chicos, hazlos en `$1/`.
- Vuelve a tomar capturas en 1440, 1024, 768 y 390 px y muéstrame qué cambió.

Indicaciones extra: $ARGUMENTS
