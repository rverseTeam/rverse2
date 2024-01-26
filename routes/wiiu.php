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
            Router::get('/', 'Community@index', 'community.index');

            // Favorite communities routes
            Router::get('/favorites', 'Community@favorites', 'community.favorites');

            Router::group(['prefix' => 'categories'], function () {
                Router::get('/{console:a}_all', 'Community@consoleEverything', 'console.all');
                Router::get('/{console:a}_game', 'Community@consoleGames', 'console.games');
                Router::get('/{console:a}_virtualconsole', 'Community@consoleVirtualConsole', 'console.vc');
                Router::get('/{console:a}_other', 'Community@consoleOther', 'console.other');
            });
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
