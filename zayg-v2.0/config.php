<?php
/*
 * Configuración del envío del formulario por SMTP.
 * Solo hay que completar la CLAVE de la cuenta info@zayg.cl.
 * Este archivo no se puede abrir desde el navegador (ver .htaccess).
 */
return [
    // Cuenta que envía y recibe las solicitudes
    'usuario'  => 'info@zayg.cl',
    'clave'    => 'ESCRIBE_AQUI_LA_CLAVE',

    // Servidor de salida (SMTP con validación por contraseña)
    'servidor' => 'correo3.rednetchile.cl',

    // Puertos que se prueban en orden hasta que uno funcione.
    // 'tls' = STARTTLS, 'ssl' = SSL directo, '' = sin cifrado.
    // Si sabes cuál usa el servidor, deja solo ese.
    'intentos' => [
        [587, 'tls'],
        [465, 'ssl'],
        [25,  'tls'],
        [25,  ''],
    ],

    // Pon false solo si el certificado del servidor no coincide con su nombre
    'verificar_certificado' => true,

    // Hacia dónde llegan las solicitudes (puede ser la misma cuenta)
    'destino'        => 'info@zayg.cl',
    'nombre_remite'  => 'Web ZAYG',
    'asunto'         => 'Nueva solicitud desde zayg.cl',

    // Página a la que vuelve si el navegador no tiene JavaScript
    'volver_a'       => 'index.html#contacto',
];
