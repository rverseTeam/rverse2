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
    // Index page
    Router::get('/', 'WUP.Index@index', 'index.index');

    // Wii U required to load these pages
    Router::group(['before' => ['wiiu_check', 'auth']], function () {
        Router::get('/local_list.json', 'WUP.Dummy@dummy', 'local.list');
        Router::get('/check_update.json', 'WUP.Updates@news', 'news.checkupdate');

        // Me?
        Router::group(['prefix' => 'my'], function () {
            Router::get('/latest_following_related_profile_posts', 'WUP.Dummy@dummy', 'my.following');
        });

        // Users
        Router::group(['prefix' => 'users'], function () {
            Router::get('/{id}', 'WUP.User@profile', 'user.profile');
        });


        // Settings
        Router::group(['prefix' => 'settings'], function () {
            Router::post('/played_title_ids', 'WUP.Dummy@dummy', 'settings.playedtitles');
        });
    });
});
