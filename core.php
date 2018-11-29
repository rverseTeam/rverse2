<?php
/*
 * foxverse
 * (c) 2018 Repflez
 */

namespace Miiverse;

require_once 'vendor/autoload.php';

error_reporting(E_ALL ^ E_NOTICE | E_STRICT);

ExceptionHandler::register();
Config::load();
DB::connect(config('database'));

Hashid::init(config('general.link_salt'));
Upload::init();

Router::init();
include_once path('routes.php');
