<?php
/*
 * Router paths
 */

// Define namespace
namespace Miiverse;

// Checks
Router::filter('maintenance', 'checkMaintenance');
Router::filter('wiiu_check', 'authWiiU');
Router::filter('auth', 'checkConsoleAuth');
Router::filter('translation', 'Miiverse\Translation::init');

Router::group(['before' => ['translation', 'maintenance']], function () {
    // Wii U required to load these pages
    Router::group(['before' => ['wiiu_check', 'auth']], function () {
        // Index page
        Router::get('/', 'Index@index', 'index.index');
        
        Router::get('/local_list.json', 'Dummy@dummy', 'local.list');
        Router::get('/check_update.json', 'WUP.Updates@news', 'news.checkupdate');

        // Users
        Router::group(['prefix' => 'users'], function () {
            Router::get('/{id}', 'User@profile', 'user.profile');
        });

        // Titles
        Router::group(['prefix' => 'titles'], function () {
            Router::get('/show', 'WUP.Title.Show@init', 'title.init'); // This is the first page that the applet loads at all after discovery
        });

        // Me?
        Router::group(['prefix' => 'my'], function () {
            Router::get('/latest_following_related_profile_posts', 'Dummy@dummy', 'my.following');
        });

        // Communities
        Router::group(['prefix' => 'communities'], function () {
            Router::get('/', 'WUP.Community@index', 'community.index');

        });

        // Settings
        Router::group(['prefix' => 'settings'], function () {
            Router::post('/played_title_ids', 'Dummy@dummy', 'settings.playedtitles');
        });

        // Welcome
        Router::group(['prefix' => 'welcome'], function () {
            Router::get('/wiiu', 'WUP.Gate@welcome', 'gate.welcome');
            Router::post('/check', 'WUP.Gate@check', 'gate.check');
            Router::post('/activate', 'WUP.Gate@activate', 'gate.activate');
        });
    });
});
