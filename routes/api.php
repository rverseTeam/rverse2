<?php
/*
 * Router paths
 */

// Define namespace
namespace Miiverse;

// Filters
Router::filter('maintenance', 'checkMaintenanceApi');
Router::filter('auth', 'checkConsoleAuth');

Router::group(['before' => ['maintenance']], function () {
    Router::group(['before' => ['auth']], function () {
        Router::post('/v1/posts', 'API.Post@submit', 'post.submit');
    });
});