<?php
/*
 * Router paths
 */

// Define namespace
namespace Miiverse;

// Filters
Router::filter('maintenance', 'checkMaintenance');
Router::filter('3ds_check', 'auth3DS');
Router::filter('auth', 'checkConsoleAuth');

Router::group(['before' => 'maintenance'], function () {
    // Welcome guest AKA "you need a NNID to use this"
    // Needs to be outside the group so it doesn't get caught by auth
    Router::get('/welcome_guest', 'CTR.Gate@guest', 'welcome.guest');

    // 3DS required to load these pages
    Router::group(['before' => ['3ds_check', 'auth']], function () {
        // Index page
        Router::get('/', 'CTR.Index@index', 'index.index');

        Router::get('/local_list.json', 'CTR.Dummy@dummy', 'local.list');
        Router::get('/check_update.json', 'CTR.Updates@news', 'news.checkupdate');

        // My Menu
        // Outside /users based on the t1-full dump
        Router::get('/my_menu', 'CTR.User@myMenu', 'user.mymenu');

        // Rules
        Router::get('/help_and_guide', 'CTR.Misc@helpAndGuide', 'user.help');

        // Blacklist
        Router::get('/my_blacklist', 'CTR.User@blacklistGet', 'user.blacklist');

        // Warnings
        Router::group(['prefix' => 'warnings'], function () {
            Router::get('/device_ban', 'CTR.Warnings@deviceBan', 'warning.deviceban');
        });

        // Communities
        Router::group(['prefix' => 'communities'], function () {
            Router::get('/', 'CTR.Community@index', 'community.index');

            // Favorite communities routes
            Router::get('/favorites', 'CTR.Community@favorites', 'community.favorites');
            Router::get('/played', 'CTR.Community@favorites', 'community.played'); // Currently the same as /favorites because no software used impl.

            Router::group(['prefix' => 'categories'], function () {
                Router::get('/{console:a}', 'CTR.Community@consoleIndex', 'console.index');
                Router::get('/{console:a}_all', 'CTR.Community@consoleEverything', 'console.all');
                Router::get('/{console:a}_game', 'CTR.Community@consoleGames', 'console.games');
                Router::get('/{console:a}_virtualconsole', 'CTR.Community@consoleVirtualConsole', 'console.vc');
                Router::get('/{console:a}_other', 'CTR.Community@consoleOther', 'console.other');
            });
        });

        // Users
        Router::group(['prefix' => 'users'], function () {
            Router::get('/{id}', 'CTR.User@profile', 'user.profile');
            Router::get('/{id}/violators.create', 'CTR.Dummy@dummy', 'user.report');
            Router::get('/{id}/blacklist.confirm', 'CTR.Dummy@dummy', 'user.block');
            Router::post('/{id}/follow.json', 'CTR.User@follow', 'user.follow');
            Router::post('/{id}/unfollow.json', 'CTR.User@unfollow', 'user.unfollow');
            Router::get('/{id}/favorites', 'CTR.Dummy@dummy', 'user.favorites');
            Router::get('/{id}/posts', 'CTR.User@postListing', 'user.posts');
            Router::get('/{id}/empathies', 'CTR.Dummy@dummy', 'user.empathies');
            Router::get('/{id}/following', 'CTR.Dummy@dummy', 'user.following');
            Router::get('/{id}/followers', 'CTR.Dummy@dummy', 'user.followers');
            Router::get('/{id}/diary', 'CTR.Dummy@dummy', 'user.diary');
            Router::get('/{id}/diary/post', 'CTR.Dummy@dummy', 'user.diarypost');
        });

        // Titles
        Router::group(['prefix' => 'titles'], function () {
            Router::get('/show', 'CTR.Title.Show@init', 'title.init'); // This is the first page that the applet loads at all after discovery
            Router::get('/search', 'CTR.Title.Search@search', 'title.search');
            Router::get('/{tid:a}/{id:a}/new', 'CTR.Title.Community@show', 'title.community');
            Router::get('/{tid:a}/{id:a}/hot', 'CTR.Title.Community@hot', 'title.hotposts');
            Router::get('/{tid:a}/{id:a}/post', 'CTR.Title.Community@post', 'title.post');
            Router::get('/{tid:a}/{id:a}/artwork/post', 'CTR.Title.Community@artworkPost', 'title.artworkpost');
            Router::get('/{tid:a}/{id:a}/topic/post', 'CTR.Title.Community@topicPost', 'title.topicpost');
            Router::get('/{tid:a}/{id:a}/post_memo', 'CTR.Title.Community@post_memo', 'title.postmemo');
            Router::get('/{tid:a}/{id:a}/post_memo.check.json', 'CTR.Title.Community@check_memo', 'title.checkmemo');

            // Favorites stuff
            Router::post('/{tid:a}/{id:a}/favorite.json', 'CTR.Title.Community@favorite', 'title.favorite');
            Router::post('/{tid:a}/{id:a}/unfavorite.json', 'CTR.Title.Community@unfavorite', 'title.unfavorite');
        });

        // My
        Router::group(['prefix' => 'my'], function () {
            Router::get('/latest_following_related_profile_posts', 'CTR.Dummy@dummy', 'activity.latestfollowingrelatedprofileposts');
        });

        // News
        Router::group(['prefix' => 'news'], function () {
            Router::get('/my_news', 'CTR.News@my_news', 'news.mynews');
        });

        // Posts
        Router::group(['prefix' => 'posts'], function () {
            Router::get('/{id:a}', 'CTR.Post@show', 'post.show');
            Router::post('/', 'CTR.Post@submit', 'post.submit');
            Router::get('/{id:a}/reply', 'CTR.Post@reply', 'post.reply');
            Router::post('/{id:a}/empathies', 'CTR.Post@yeahs', 'post.empathies');
            Router::post('/{id:a}/empathies.delete', 'CTR.Post@removeYeahs', 'post.empathiesdelete');

            // Reporting stuff
            Router::get('/{id:a}/violations.create', 'CTR.Post@reportForm', 'post.violation');
            Router::post('/{id:a}/violations', 'CTR.Post@sendReport', 'post.reportsubmit');
        });

        // Comments
        Router::group(['prefix' => 'replies'], function () {
            Router::post('/{id:a}/empathies', 'CTR.Post@replyYeahs', 'comment.empathies');
            Router::post('/{id:a}/empathies.delete', 'CTR.Post@replyRemoveYeahs', 'comment.empathiesdelete');
        });

        // Settings
        Router::group(['prefix' => 'settings'], function () {
            Router::post('/struct_post', 'CTR.Dummy@dummy', 'struct.post');
            Router::get('/profile', 'CTR.Dummy@dummy', 'settings.profile');
            Router::post('/tutorial_post', 'CTR.Settings@tutorial_post', 'settings.tutorialpost');
            Router::post('/played_title_ids', 'CTR.Dummy@dummy', 'settings.playedtitles');

            // Account settings
            Router::get('/aacount', 'CTR.Settings@account', 'settings.account');
        });

        // Welcome
        Router::group(['prefix' => 'welcome'], function () {
            Router::get('/3ds', 'CTR.Gate@welcome', 'gate.welcome');
            Router::post('/check', 'CTR.Gate@check', 'gate.check');
            Router::post('/activate', 'CTR.Gate@activate', 'gate.activate');
        });
    });
});
