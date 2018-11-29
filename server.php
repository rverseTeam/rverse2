<?php
/*
 * mod_rewrite emulator for php's built in server
 */

// Decode and parse the request uri
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Check if the file exist in the public directory and if it does serve it.
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

// Otherwise include the router
require_once __DIR__.'/public/index.php';
