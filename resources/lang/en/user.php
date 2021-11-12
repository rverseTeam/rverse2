<?php
/*
 * Translation file for user
 */

return [
    'profile' => [
        'header' => [
            'name' => ':name\'s Profile',
        ],

        'meta' => [
            // Reports
            'violation' => [
                'select' => 'Please make a selection.',
                'create' => 'Report',
                'blacklist' => 'Block',
            ],

            // Follow Button
            'follow' => 'Follow',
            'unfollow' => 'Unfollow',

            // Own buttons
            'mymenu' => 'User Menu',
            'settings' => 'Profile Settings',

            // To top
            'back' => 'To Top',
        ],

        // Navigation
        'nav' => [
            'posts' => 'Posts',
            'empathies' => 'Yeahs',
            'following' => 'Following',
            'followers' => 'Followers',
        ],

        // Content
        'content' => [
            'favorite' => 'Favorite Communities',
        ],

        // Errors
        'error' => [
            'noposts' => 'This user has not posted yet.',
            'nofavorites' => 'This user has no favorite communities yet.',
        ],
    ],

    // My Menu
    'menu' => [
        'header' => [
            'desc' => 'Here you can change various settings, search for other users, and more.',
            'title' => 'User Menu',
        ],

        'buttons' => [
            'settings' => ':service Settings',
            'blacklist' => 'Blocked Users',
            'announcements' => ':service Announcements',
            'help' => 'Manual/:service Code of Conduct',
        ],
    ],
];
