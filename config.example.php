<?php
/**
 * foxverse Configuration File.
 */
return [
    // Database configuration according to https://laravel.com/docs/5.2/database#introduction
    // Put some here in advance, uncomment the one you need.
    'database'      => [
        // MySQL
        'driver'            => 'mysql',
        'host'              => 'localhost',
        'port'              => 3306,
        'username'          => 'root',
        'password'          => '',
        'prefix'            => '',
        'database'          => 'foxverse_dev',
        'charset'           => 'utf8',
        'collation'         => 'utf8_unicode_ci',
    ],

    // General site settings
    'general'       => [
        // Name of the site
        'name'              => 'foxverse',

        // Default logo of the site (empty for the default)
        'logo'              => '',

        // Description of the site
        'description'       => 'foxverse is a Miiverse clone for 3DS, Wii U and PC!',

        // Close the site for maintenance
        'maintenance'       => false,

        // Date formatting string
        'date_format'       => 'D Y/m/d g:i A T',

        // Hashids salt (prevents stuff from getting scraped easily)
        'link_salt'         => 'changethis',
    ],

    // Cloudinary settings
    'cloudinary'    => [
        // Cloudinary cloud name
        'cloud_name'        => '',

        // Cloudinary API key
        'api_key'           => '',

        // Cloudinary API secret
        'api_secret'        => '',

        // Mii images preset
        'mii_preset'        => '',

        // Drawings preset
        'drawings_preset'   => '',

        // Screnshots preset
        'image_preset'      => '',
    ],

    // Nintendo API settings
    'nintendo'      => [
        // Client ID
        'client_id'         => '',

        // Client secret
        'client_secret'     => '',
    ],

    // Cookie settings
    'cookie'        => [
        'prefix'            => 'miiverse_',
    ],

    // Performance settings
    'performance'   => [
        // Compress output using gzip, recommended to turn this off while debugging
        'compression'       => true,

        // Cache directory
        'cache_dir'         => path('store/cache/'),

        // Enable template caching
        'template_cache'    => true,
    ],

    // Development specific settings
    'dev'           => [
        // Show detailed error logs in browser
        'show_errors'       => false,

        // Enable twig (the templating engine) debug mode
        'twig_debug'        => false,

        // Host for the shyla dev:serve command
        'host'              => 'localhost:8000',

        // Reporting host address
        'report_host'       => '',
    ],

    // Ranks ids, these ranks are used by automated procedures in the backend
    // If you're using the setup command in topia, these are already set correctly for you!
    'rank'          => [
        'regular'           => 1,
        'verified'          => 2,
        'mod'               => 3,
        'admin'             => 4,
        'banned'            => 5,
    ],
];
