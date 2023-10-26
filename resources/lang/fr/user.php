<?php
/*
 * Translation file for user
 */

return [
    'profile' => [
        'header' => [
            'name' => 'Profil de :name',
        ],

        'meta' => [
            // Reports
            'violation' => [
                'select' => 'Sélectionnez une option.',
                'create' => 'Signaler',
                'blacklist' => 'Bloquer',
            ],

            // Follow Button
            'follow' => 'Suivre',
            'unfollow' => 'Ne plus Suivre',

            // Own buttons
            'mymenu' => 'Menu d\'Utilisateur',
            'settings' => 'Paramètres du Profil',

            // To top
            'back' => 'En haut',
        ],

        // Navigation
        'nav' => [
            'posts' => 'Publications',
            'empathies' => 'Ouais',
            'following' => 'Abonnements',
            'followers' => 'Abonnés',
        ],

        // Content
        'content' => [
            'favorite' => 'Communautés Favorites',
        ],

        // Errors
        'error' => [
            'noposts' => 'Cet utilisateur n\'a pas encore fait de publication.',
            'nofavorites' => 'Cet utilisateur n\'a aucune communauté favorite.',
        ],
    ],

    // My Menu
    'menu' => [
        'header' => [
            'desc' => 'Ici, vous pouvez changer certaines options, chercher des utilisateurs, et plus.',
            'title' => 'Menu d\'Utilisateur',
        ],

        'buttons' => [
            'settings' => ':service Paramètres',
            'blacklist' => 'Utilisateurs Bloqués',
            'announcements' => ':service Annonces',
            'help' => 'Manuel/:service Code de Conduite',
        ],
    ],
];
