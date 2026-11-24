#!/usr/bin/env bash
# Instalador del kit Rednet para OpenCode (macOS / Linux)
# Uso: desde la carpeta del repo web-rednet2026:  bash kit-opencode/instalar-mac-linux.sh
# No guarda ninguna clave.
set -u
ok(){ printf "  \033[32mOK\033[0m  %s\n" "$1"; }
falta(){ printf "  \033[33m...\033[0m %s\n" "$1"; }
tiene(){ command -v "$1" >/dev/null 2>&1; }

echo; echo "1) Programas base"
if [[ "$(uname)" == "Darwin" ]]; then
  tiene brew || { falta "Instala Homebrew primero: https://brew.sh"; exit 1; }
  for p in git node python3:python ffmpeg gh; do c=${p%%:*}; f=${p##*:}; tiene "$c" && ok "$c" || { falta "Instalando $f"; brew install "$f"; }; done
else
  for c in git node python3 ffmpeg gh; do tiene "$c" && ok "$c" || falta "Falta $c: instálalo con el gestor de tu distro (Node 22+ desde nodejs.org o nvm)"; done
fi
v=$(node -v 2>/dev/null | tr -d v | cut -d. -f1); [[ -n "$v" && "$v" -lt 22 ]] && falta "Node $v es viejo: HyperFrames necesita Node 22+"

echo; echo "2) OpenCode"
tiene opencode && ok "OpenCode $(opencode --version)" || { falta "Instalando OpenCode"; npm install -g opencode-ai || curl -fsSL https://opencode.ai/install | bash; }

echo; echo "3) Librerías de Python"
python3 -m pip install --user --upgrade numpy pillow

echo; echo "4) Navegador para capturas (Playwright)"
npx -y playwright install chromium

echo; echo "5) Skills de HyperFrames"
npx -y skills add heygen-com/hyperframes -a opencode -y

echo; echo "6) Carpeta de imágenes (Google Drive para escritorio)"
if [[ -n "${REDNET_IMAGEBANK:-}" ]]; then ok "REDNET_IMAGEBANK=$REDNET_IMAGEBANK"; else
  read -r -p "  Ruta local de imagebank (ej: ~/Library/CloudStorage/GoogleDrive-correo/Mi unidad/imagebank): " ruta
  ruta="${ruta/#\~/$HOME}"
  if [[ -d "$ruta" ]]; then
    rc="$HOME/.zshrc"; [[ "$SHELL" == *bash ]] && rc="$HOME/.bashrc"
    echo "export REDNET_IMAGEBANK=\"$ruta\"" >> "$rc"; ok "Guardada en $rc (abre una terminal nueva)"
  else falta "No encontré esa carpeta. Configúrala después (paso 4 de la guía)."; fi
fi

echo; echo "7) GitHub"
gh auth status >/dev/null 2>&1 && ok "Sesión de GitHub activa" || falta "Inicia sesión: gh auth login"

echo; echo "Listo. Siguiente: en esta carpeta escribe 'opencode' y luego /models (paso 6 de la guía)."
