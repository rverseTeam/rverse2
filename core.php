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
Cache::init();

Hashid::init(config('general.link_salt'));
Upload::init();

Router::init();


if (php_sapi_name() !== "cli") {
    $siteUrl = $_SERVER['SERVER_NAME'];

    // 3DS domain check
    if (in_array($siteUrl, config('sites.3ds'))) {
        $template = '3ds';
        // 3DS pjax stuff
        if (array_key_exists('_pjax', $_GET) && array_key_exists('HTTP_X_PJAX', $_SERVER)) {
            // pjax doesn't like queries on the header, for some reason
            $pjaxurl = preg_replace('/\?.+/', '', $_SERVER['REQUEST_URI']);
            header('X-PJAX-PATH: '.$pjaxurl);
            header('X-PJAX-OK: 1');
        }
        require_once path('routes/3ds.php');
    } else if (in_array($siteUrl, config('sites.wiiu'))) {
        $template = 'wiiu';
        require_once path('routes/wiiu.php');
    } else if (in_array($siteUrl, config('sites.web'))) {
        $template = 'web';
        require_once path('routes/web.php');
    } else if (in_array($siteUrl, config('sites.admin'))) {
        $template = 'admin';
        require_once path('routes/admin.php');
    } else {
        require_once path('routes/default.php');
    }
}