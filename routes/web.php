<?php
/*
 * Router paths
 */

// Define namespace
namespace Miiverse;

// Checks
Router::filter('maintenance', 'checkMaintenance');
Router::filter('auth', 'checkConsoleAuth');

Router::group(['before' => 'maintenance'], function() {
	// Homepage
	Router::get('/', 'Unknown@index', 'main.index');
});
