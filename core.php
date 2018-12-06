<?php
/*
 * rverse
 * (c) 2018 RverseTeam
 */

namespace Miiverse;

use Miiverse\Helpers\ConsoleAuth;

require_once 'vendor/autoload.php';

error_reporting(E_ALL ^ E_NOTICE | E_STRICT);
setlocale(LC_TIME, 'English');

ExceptionHandler::register();
Config::load();
DB::connect(config('database'));

Hashid::init(config('general.link_salt'));
Upload::init();

Router::init();

// Check if a PHP session was already started and if not start one
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

switch ($_SERVER['SERVER_NAME']) {
    case config('sites.3ds'):
        $template = '3ds';
        // 3DS pjax stuff
        if (array_key_exists('_pjax', $_GET) && array_key_exists('HTTP_X_PJAX', $_SERVER)) {
            // pjax doesn't like queries on the header, for some reason
            $pjaxurl = preg_replace('/\?.+/', '', $_SERVER['REQUEST_URI']);
            header('X-PJAX-PATH: '.$pjaxurl);
            header('X-PJAX-OK: 1');
        }
        require_once path('routes/3ds.php');
        ConsoleAuth::check3DS();
        break;
    case config('sites.wiiu'):
        $template = 'wiiu';
        require_once path('routes/wiiu.php');
        ConsoleAuth::checkWiiU();
        break;
    case config('sites.web'):
        $template = 'web';
        require_once path('routes/web.php');
        break;
    case config('sites.admin'):
        $template = 'admin';
        require_once path('routes/admin.php');
        break;
    default:
        require_once path('routes/default.php');
        break;
}

