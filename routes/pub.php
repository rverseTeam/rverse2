<?php
/*
 * Router paths
 */

// Define namespace
namespace Miiverse;

// Checks

Router::group([], function() {
	// Homepage
	Router::get('/', 'Unknown@index', 'main.index');
});
