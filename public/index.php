<?php
/**
 * foxverse Index File.
 */

// Declare namespace

namespace Miiverse;

use Miiverse\Helpers\ConsoleAuth;

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
ConsoleAuth::check();

Translation::init();

// Set base variables
$templateBases = [
    'ctr',
    'portal',
    'offdevice',
];

Template::set($templateBases[ConsoleAuth::$paramPack['platform_id']]);
Template::vars([
    'get'     => $_GET,
    'user'    => CurrentSession::$user,
    'post'    => $_POST,
    'server'  => $_SERVER,
    'request' => $_REQUEST,
    'session' => $_SESSION,
]);

// Handle requests
echo Router::handle($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
