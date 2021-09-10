<?php
/**
 * foxverse Index File.
 */

// Declare namespace

namespace Miiverse;

// Include app
require_once __DIR__.'/../core.php';

// Start output buffering
ob_start(config('performance.compression') ? 'ob_gzhandler' : null);

// Initialise the current session
$cookiePrefix = config('cookie.prefix');
CurrentSession::start(
    intval($_COOKIE["{$cookiePrefix}id"] ?? 0),
    $_COOKIE["{$cookiePrefix}session"] ?? '',
    Net::ip()
);
Translation::init();

Template::set($template);
Template::vars([
    'get'     => $_GET,
    'user'    => CurrentSession::$user,
    'post'    => $_POST,
    'server'  => $_SERVER,
    'request' => $_REQUEST,
]);

// Handle requests
echo Router::handle($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
