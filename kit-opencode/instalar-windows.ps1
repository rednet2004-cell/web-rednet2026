# Instalador del kit Rednet para OpenCode (Windows 10/11)
# Uso: abre PowerShell en la carpeta del repo web-rednet2026 y ejecuta:
#   powershell -ExecutionPolicy Bypass -File kit-opencode\instalar-windows.ps1
# No guarda ninguna clave. Instala lo que falte con winget.

$ErrorActionPreference = "Continue"
function Ok($m){ Write-Host "  OK  $m" -ForegroundColor Green }
function Falta($m){ Write-Host "  ... $m" -ForegroundColor Yellow }

Write-Host "`n1) Programas base" -ForegroundColor Cyan
$paquetes = @(
  @{cmd="git";    id="Git.Git";                nombre="Git"},
  @{cmd="node";   id="OpenJS.NodeJS.LTS";      nombre="Node.js LTS (22 o más)"},
  @{cmd="python"; id="Python.Python.3.12";     nombre="Python 3"},
  @{cmd="ffmpeg"; id="Gyan.FFmpeg";            nombre="FFmpeg"},
  @{cmd="gh";     id="GitHub.cli";             nombre="GitHub CLI"}
)
foreach($p in $paquetes){
  if(Get-Command $p.cmd -ErrorAction SilentlyContinue){ Ok $p.nombre }
  else { Falta "Instalando $($p.nombre)"; winget install --id $p.id -e --accept-source-agreements --accept-package-agreements }
}
Write-Host "  Si algo se acaba de instalar, cierra y vuelve a abrir PowerShell y corre este script otra vez." -ForegroundColor DarkGray

$v = (node -v) 2>$null
if($v -and [int]($v.TrimStart('v').Split('.')[0]) -lt 22){ Falta "Node $v es viejo: HyperFrames necesita Node 22 o más (winget upgrade OpenJS.NodeJS.LTS)" }

Write-Host "`n2) OpenCode" -ForegroundColor Cyan
if(Get-Command opencode -ErrorAction SilentlyContinue){ Ok "OpenCode $(opencode --version)" }
else { Falta "Instalando OpenCode"; npm install -g opencode-ai }

Write-Host "`n3) Librerías de Python (música de los reels, WebP)" -ForegroundColor Cyan
python -m pip install --user --upgrade numpy pillow

Write-Host "`n4) Navegador para capturas (Playwright)" -ForegroundColor Cyan
npx -y playwright install chromium

Write-Host "`n5) Skills de HyperFrames (reels)" -ForegroundColor Cyan

npx -y skills add heygen-com/hyperframes -a opencode -y

Write-Host "`n6) Carpeta de imágenes (Google Drive para escritorio)" -ForegroundColor Cyan
$actual = [Environment]::GetEnvironmentVariable("REDNET_IMAGEBANK","User")
if($actual){ Ok "REDNET_IMAGEBANK = $actual" }
else {
  $ruta = Read-Host "  Pega la ruta local de la carpeta imagebank (ej: G:\Mi unidad\imagebank)"
  if($ruta -and (Test-Path $ruta)){ [Environment]::SetEnvironmentVariable("REDNET_IMAGEBANK",$ruta,"User"); Ok "Guardada. Abre una terminal nueva para que se aplique." }
  else { Falta "No encontré esa carpeta. Configúrala después (paso 4 de la guía)." }
}

Write-Host "`n7) GitHub" -ForegroundColor Cyan
gh auth status 2>$null
if($LASTEXITCODE -ne 0){ Falta "Inicia sesión: gh auth login  (GitHub.com > HTTPS > navegador)" } else { Ok "Sesión de GitHub activa" }

Write-Host "`nListo. Siguiente: en esta carpeta escribe 'opencode' y luego /models (paso 6 de la guía)." -ForegroundColor Cyan
