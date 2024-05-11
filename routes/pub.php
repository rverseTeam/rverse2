<?php
/*
 * Router paths
 */

// Define namespace
namespace Miiverse;

// Checks

Router::group([], function() {
	// Homepage
	Router::get('/wiilink', 'Pub.WiiLink@index', 'wiilink.promo');
});
