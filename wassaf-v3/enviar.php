<?php
/*
 * Recibe el formulario "Evalúa tu proyecto" y lo envía por SMTP autenticado
 * con PHPMailer (lib/PHPMailer). La configuración está en config.php.
 */
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

require __DIR__ . '/lib/PHPMailer/Exception.php';
require __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require __DIR__ . '/lib/PHPMailer/SMTP.php';

$cfg  = require __DIR__ . '/config.php';
$ajax = (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'fetch');

function responder(bool $ok, string $mensaje, int $codigo, array $cfg, bool $ajax): void
{
    if ($ajax) {
        http_response_code($codigo);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'mensaje' => $mensaje], JSON_UNESCAPED_UNICODE);
    } else {
        $sep = strpos($cfg['volver_a'], '?') === false ? '?' : '&';
        [$url, $ancla] = array_pad(explode('#', $cfg['volver_a'], 2), 2, '');
        header('Location: ' . $url . $sep . 'envio=' . ($ok ? 'ok' : 'error') . ($ancla ? '#' . $ancla : ''), true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(false, 'Método no permitido.', 405, $cfg, $ajax);
}

// Trampa para robots: este campo va oculto y debe llegar vacío
if (trim((string)($_POST['web'] ?? '')) !== '') {
    responder(true, 'Gracias, recibimos tu solicitud.', 200, $cfg, $ajax);
}

// Límite simple: 5 envíos cada 10 minutos por IP
$ip    = $_SERVER['REMOTE_ADDR'] ?? 'x';
$marca = sys_get_temp_dir() . '/wasaff_form_' . md5($ip);
$hist  = array_filter(
    array_map('intval', is_file($marca) ? explode(',', (string)file_get_contents($marca)) : []),
    fn($t) => $t > time() - 600
);
if (count($hist) >= 5) {
    responder(false, 'Recibimos varias solicitudes seguidas. Intenta de nuevo en unos minutos.', 429, $cfg, $ajax);
}

function campo(string $k, int $max): string
{
    $v = trim((string)($_POST[$k] ?? ''));
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    return mb_substr($v, 0, $max);
}

$d = [
    'nombre'   => campo('nombre', 80),
    'apellido' => campo('apellido', 80),
    'empresa'  => campo('empresa', 120),
    'correo'   => campo('correo', 160),
    'telefono' => campo('telefono', 40),
    'mensaje'  => campo('mensaje', 4000),
];
foreach (['nombre', 'apellido', 'empresa', 'correo', 'telefono'] as $k) {
    $d[$k] = str_replace("\n", ' ', $d[$k]);
}

if ($d['nombre'] === '' || $d['apellido'] === '' || $d['mensaje'] === ''
    || !filter_var($d['correo'], FILTER_VALIDATE_EMAIL)) {
    responder(false, 'Revisa los campos marcados, por favor.', 422, $cfg, $ajax);
}

$e = fn($s) => htmlspecialchars($s === '' ? '-' : $s, ENT_QUOTES, 'UTF-8');
$filas = [
    'Nombre'   => $d['nombre'] . ' ' . $d['apellido'],
    'Empresa'  => $d['empresa'],
    'Correo'   => $d['correo'],
    'Teléfono' => $d['telefono'],
];
$html = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#0A2A3F">'
      . '<h2 style="margin:0 0 16px;color:#0B8F4A">Nueva solicitud desde wasafflogistica.cl</h2>'
      . '<table cellpadding="8" style="border-collapse:collapse">';
$texto = "Nueva solicitud desde wasafflogistica.cl\n\n";
foreach ($filas as $k => $v) {
    $html  .= '<tr><td style="color:#6b7782;border-bottom:1px solid #eee">' . $k . '</td>'
            . '<td style="border-bottom:1px solid #eee"><b>' . $e($v) . '</b></td></tr>';
    $texto .= $k . ': ' . ($v === '' ? '-' : $v) . "\n";
}
$html  .= '</table><p style="margin:20px 0 6px;color:#6b7782">¿Qué necesita?</p>'
        . '<p style="white-space:pre-wrap;margin:0">' . $e($d['mensaje']) . '</p></div>';
$texto .= "\n¿Qué necesita?\n" . $d['mensaje'] . "\n";

$ultimoError = '';
foreach ($cfg['intentos'] as [$puerto, $cifrado]) {
    $m = new PHPMailer(true);
    try {
        $m->isSMTP();
        $m->Host       = $cfg['servidor'];
        $m->Port       = (int)$puerto;
        $m->SMTPAuth   = true;
        $m->Username   = $cfg['usuario'];
        $m->Password   = $cfg['clave'];
        $m->Timeout    = 12;
        $m->CharSet    = 'UTF-8';
        if ($cifrado === 'ssl') {
            $m->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } elseif ($cifrado === 'tls') {
            $m->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        } else {
            $m->SMTPSecure  = '';
            $m->SMTPAutoTLS = false;
        }
        if (empty($cfg['verificar_certificado'])) {
            $m->SMTPOptions = ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true]];
        }
        $m->setFrom($cfg['usuario'], $cfg['nombre_remite']);
        $m->addAddress($cfg['destino']);
        $m->addReplyTo($d['correo'], $d['nombre'] . ' ' . $d['apellido']);
        $m->Subject = $cfg['asunto'] . ' · ' . $d['nombre'] . ' ' . $d['apellido'];
        $m->isHTML(true);
        $m->Body    = $html;
        $m->AltBody = $texto;
        $m->send();

        $hist[] = time();
        @file_put_contents($marca, implode(',', $hist));
        responder(true, 'Gracias, recibimos tu solicitud. Te contactaremos pronto.', 200, $cfg, $ajax);
    } catch (MailException $ex) {
        $ultimoError = $puerto . '/' . ($cifrado ?: 'sin cifrado') . ': ' . $m->ErrorInfo;
    }
}

error_log('[wasaff-form] No se pudo enviar. Último intento ' . $ultimoError);
responder(false, 'No pudimos enviar tu solicitud. Escríbenos a info@wasafflogistica.cl o al +56 9 8818 2735.', 502, $cfg, $ajax);
