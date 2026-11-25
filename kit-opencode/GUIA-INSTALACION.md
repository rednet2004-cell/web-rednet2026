# Kit Rednet para OpenCode · Guía de instalación

Esta guía deja un notebook listo para que el diseñador de la oficina cree webs de clientes con **OpenCode**, con las mismas reglas, skills y pasos que se usan en Rednet. Toma unos 30 a 45 minutos la primera vez.

## Qué trae el kit

Todo vive dentro del repositorio de demos `rednet2004-cell/web-rednet2026`. Al abrir OpenCode en esa carpeta, se carga solo:

| Archivo o carpeta | Para qué sirve |
|---|---|
| `AGENTS.md` | Las instrucciones del proyecto: tono, reglas fijas, estructura, qué skill usar. |
| `opencode.jsonc` | Configuración: agente por defecto, navegador para capturas (Playwright), GitHub opcional, permisos. |
| `.opencode/agents/` | 3 agentes: `disenador-web` (principal), `revisor-diseno` (solo revisa), `video-reel` (videos). |
| `.opencode/commands/` | 6 comandos: `/nuevo-cliente`, `/reel`, `/revisar`, `/pulir`, `/efecto`, `/publicar`. |
| `.opencode/skills/` | 19 skills: el flujo Rednet (`rednet-web-cliente`, `rednet-design-1`, `crear-web-como-servicio`), dirección visual (`impeccable`, `frontend-design`, `high-end-visual-design`, `gpt-taste`, `minimalist-ui`, `redesign-existing-projects`), animación (`gsap-*`, `animate`, `review-animations`, `emil-design-eng`) y `web-design-guidelines`. |
| `clientes/` | Fichas de cada cliente (ya están Zayg y Wasaff). |
| `kit-opencode/BITACORA.md` | Reglas que va pidiendo Benito. OpenCode la lee siempre. |
| `kit-opencode/plantillas/` | Plantilla de ficha de cliente. |

Las skills de **HyperFrames** (para los reels) se instalan desde su fuente oficial en el paso 5, así quedan actualizadas.

## Antes de empezar (lo que hace Benito)

1. **GitHub (para publicar las demos):** el diseñador crea su propia cuenta en github.com (gratis). Benito entra a `github.com/rednet2004-cell/web-rednet2026` → **Settings → Collaborators → Add people** y lo invita con permiso de escritura. El diseñador acepta la invitación desde su correo. Así cada demo queda publicada en GitHub Pages, igual que hoy, y se sabe quién subió cada cambio.
2. **Google Drive:** el diseñador usa la misma cuenta **assets@rednet.cl** que ya usan los otros proyectos. Benito le da la contraseña en persona (nunca por el repo ni por chat).
3. **Modelo de IA:** ver `kit-opencode/MODELOS.md`. Para empezar alcanza con los modelos gratis.

## Paso 1 · Programas base

Hace falta: **Git**, **Node.js 22 o más**, **Python 3**, **FFmpeg**, **GitHub CLI (gh)** y **OpenCode**. El paso 3 lo instala casi todo solo.

## Paso 2 · Descargar el repositorio

Abre **PowerShell** (botón Inicio → escribe "PowerShell"). En Windows 10, si `winget` no se reconoce, instala o actualiza **Instalador de aplicación** (App Installer) desde Microsoft Store y abre PowerShell de nuevo.

```
winget install --id Git.Git -e        # solo si git no está instalado; después cierra y abre PowerShell
cd $HOME\Documents                    # o la carpeta que prefieras
git clone https://github.com/rednet2004-cell/web-rednet2026.git
cd web-rednet2026
```

## Paso 3 · Correr el instalador

**Windows:**
```
powershell -ExecutionPolicy Bypass -File kit-opencode\instalar-windows.ps1
```

**Mac o Linux:**
```
bash kit-opencode/instalar-mac-linux.sh
```

El instalador revisa e instala lo que falte, instala OpenCode, las librerías de Python (numpy y pillow), el navegador de Playwright y las skills de HyperFrames, y te pide la ruta de la carpeta de imágenes. Si instaló algo nuevo, **cierra la terminal, ábrela de nuevo y córrelo otra vez** hasta que todo salga en verde.

## Paso 4 · Carpeta de imágenes de Google Drive

1. Instala **Google Drive para escritorio** (google.com/drive/download) e inicia sesión con **assets@rednet.cl**.
2. Abre el Explorador de archivos: aparece una unidad **Google Drive (G:)**. Entra a **Mi unidad** y busca la carpeta **imagebank**. (Si imagebank estuviera en "Compartido conmigo", en drive.google.com haz clic derecho → **Organizar → Agregar acceso directo** → **Mi unidad**.)
3. La ruta local queda más o menos así (la letra puede variar):
   - Windows: `G:\Mi unidad\imagebank`
   - Mac: `~/Library/CloudStorage/GoogleDrive-<correo>/Mi unidad/imagebank`
4. Si el instalador no la guardó, hazlo a mano:
   - Windows (PowerShell): `[Environment]::SetEnvironmentVariable("REDNET_IMAGEBANK","G:\Mi unidad\imagebank","User")`
   - Mac/Linux: agrega `export REDNET_IMAGEBANK="<ruta>"` a `~/.zshrc` o `~/.bashrc`.
5. Abre una terminal nueva y comprueba: `echo $env:REDNET_IMAGEBANK` (Windows) o `echo $REDNET_IMAGEBANK` (Mac/Linux).

Cada cliente tiene su carpeta: `imagebank/clientes/<cliente>/` (logo, fotos, `Indice_imagenes.csv` y el borrador del cliente en `maqueta-www-v.0.1/`).

## Paso 5 · Skills de HyperFrames

El instalador ya corrió `npx -y skills add heygen-com/hyperframes -a opencode -y`. Si lo saltaste, córrelo dentro de la carpeta del repo. Comprueba que exista `.agents/skills/hyperframes/` y `.agents/skills/hyperframes-cli/` (OpenCode lee esa carpeta). Esa carpeta no se sube al repo: cada notebook la instala.

Para probar que el render funciona: `npx -y hyperframes doctor`.

## Paso 6 · Conectar el modelo de IA

1. En la carpeta del repo escribe `opencode`.
2. Escribe `/connect` y elige el proveedor (Anthropic, OpenAI, Google, OpenCode Zen, etc.). Sigue los pasos en el navegador o pega la clave. **La clave queda guardada en OpenCode, nunca en el repo.**
3. Escribe `/models` y elige el modelo recomendado en `kit-opencode/MODELOS.md`.

## Paso 7 · Conectar GitHub

```
gh auth login
```
Elige **GitHub.com → HTTPS → Login with a web browser**. Luego `gh auth setup-git` para que `git push` use esa sesión. Prueba con `gh repo view rednet2004-cell/web-rednet2026`.

Configura tu nombre para los commits:
```
git config --global user.name "Nombre Apellido"
git config --global user.email "tu-correo@ejemplo.cl"
```

## Paso 8 · Prueba final

Dentro de OpenCode (en la carpeta del repo):

1. Escribe `/revisar zayg`. Debe tomar capturas y dejar un informe en `diagnosticos/zayg/`. Si eso funciona, el navegador, las skills y los permisos están bien.
2. Pregunta: "¿qué skills tienes disponibles?". Debe nombrar `rednet-web-cliente`, `impeccable`, `gsap-core`, `hyperframes`, entre otras.
3. Borra el informe de prueba si no lo necesitas.

## Cómo se trabaja un cliente nuevo

1. Confirma que la carpeta del cliente esté en Drive: `imagebank/clientes/<cliente>/`.
2. Copia `kit-opencode/plantillas/brief-cliente.md` a `clientes/<cliente>-brief.md` y llena lo que sepas. Luego en OpenCode: `/web-pyme <cliente>` (o `/nuevo-cliente <cliente>` si no hay brief) (por ejemplo `/nuevo-cliente ferreteria-norte`). Te propone una dirección visual antes de construir: revísala.
3. Pide ajustes en lenguaje normal ("los botones más cuadrados", "el hero con otra foto").
4. `/reel <cliente>` si hay que rehacer el video vertical.
5. `/revisar <cliente>` y después `/pulir <cliente>`.
6. `/publicar <cliente>` → te devuelve el link `https://rednet2004-cell.github.io/web-rednet2026/<cliente>/` para mandárselo a Benito.

## Problemas comunes

| Problema | Solución |
|---|---|
| `opencode` no se reconoce | Cierra y abre la terminal. Si sigue, `npm install -g opencode-ai`. |
| No encuentra las imágenes del cliente | Revisa `REDNET_IMAGEBANK` (paso 4) y que Drive para escritorio esté sincronizado. |
| El render del reel falla | `npx hyperframes doctor`. Requiere Node 22+ y FFmpeg. La composición necesita su carpeta `assets/` con gsap, fuentes e imágenes. |
| `git push` pide contraseña o da 403 | `gh auth login` y `gh auth setup-git`. Verifica que aceptaste la invitación de colaborador. |
| El link de GitHub Pages da 404 | Espera 1 a 3 minutos tras el merge y revisa la pestaña **Actions** del repo. |
| En Windows las animaciones no se ven | Windows trae activado "efectos de animación: desactivado". Revisa `crear-web-como-servicio/reference/07-windows-troubleshooting.md`. |
| El config da error al abrir OpenCode | El kit está probado con OpenCode 1.19 (formato de configuración V1). Si instalaste la versión 2 (`opencode2`), avísale a Benito para migrar `opencode.jsonc`. |

## Seguridad

- El repo es **público**: nunca subas claves, tokens, contraseñas ni datos personales que el cliente no publique en su web.
- El comando `/publicar` revisa secretos antes de subir. Los permisos del proyecto bloquean `git push --force`.
