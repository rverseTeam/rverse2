<?php
/*
 * foxverse
 * (c) 2018 Repflez
 */

namespace Miiverse;

require_once 'vendor/autoload.php';

error_reporting(E_ALL ^ E_NOTICE | E_STRICT);
setlocale(LC_TIME, 'Spanish');

ExceptionHandler::register();
Config::load();
DB::connect(config('database'));

Hashid::init(config('general.link_salt'));
Upload::init();

Router::init();

switch ($_SERVER['SERVER_NAME']) {
    case config('sites.3ds'):
        require_once path('routes/3ds.php');
        break;
    case config('sites.wiiu'):
        require_once path('routes/wiiu.php');
        break;
    case config('sites.others'):
        require_once path('routes/others.php');
        break;
    default:
        require_once path('routes/default.php');
        break;
}

