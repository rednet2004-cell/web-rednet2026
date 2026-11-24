---
description: Publica una carpeta como demo en GitHub Pages (rama, PR, merge, link)
agent: disenador-web
---

Publica la carpeta **$1**.

1. Revisa que no haya secretos (`git diff` y busca "key", "token", "password", "AIza", "sk-").
2. Si es una web nueva, agrégala al `index.html` raíz.
3. `git checkout main && git pull`, luego rama `disenador/$1-<cambio-corto>`.
4. Commit con mensaje en español que diga qué cambió.
5. `git push -u origin <rama>` y crea el PR con `gh pr create` (título y descripción en español, con la lista de pendientes del cliente).
6. Haz merge con `gh pr merge --squash --delete-branch`.
7. Espera el deploy de GitHub Pages (`gh run list --limit 3` o la pestaña Actions) y dame el link `https://rednet2004-cell.github.io/web-rednet2026/$1/`. Puede tardar 1 a 3 minutos en verse.

Nunca uses `git push --force` sobre `main`.
