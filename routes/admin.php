<?php
/*
 * Router paths
 */

// Define namespace
namespace Miiverse;

// Homepage
Router::get('/', 'Admin.Home@index', 'admin.home');

// OAuth2
Router::get('/login', 'Admin.OAuth2@login', 'oauth2.login');
Router::get('/callback', 'Admin.OAuth2@callback', 'oauth2.callback');
