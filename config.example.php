<?php
/**
 * rverse2 Configuration File.
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
        'database'          => 'rverse2_dev',
        'charset'           => 'utf8',
        'collation'         => 'utf8_unicode_ci',
    ],

    // General site settings
    'general'       => [
        // Name of the site
        'name'              => 'rverse2',

        // Default logo of the site (empty for the default)
        'logo'              => '',

        // Description of the site
        'description'       => 'rverse is a Miiverse clone for 3DS, Wii U and PC!',

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
        'prefix'            => 'rverse_',
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

        // Host for the topia dev:serve command
        'host'              => 'localhost:8000',

        // Reporting host address
        'report_host'       => '',
    ],

    // Discord reporting settings
    'discord'   => [
        'accounts'          => '',
        'posts'             => '',
        'reports'           => '',
        'moderation'        => '',
    ],

    // User settings
    'user'     => [
        // Minimum entropy value a password needs to have
        'pass_min_entropy'  => 1,

        // Username constraints
        'name_min'          => 3,
        'name_max'          => 16,

        // Disable registration, just in case
        'disable_signups'   => true,

        // Require the user to click a link in an e-mail sent to them
        'require_activation'=> true,

        // How long a username should be reserved in days
        'name_reserve'      => 90,

        // How long a user should be inactive till another person can use their name
        'name_takeover'     => 365,
    ],

    // Donation settings
    'dontation'     => [
        'max_monts'         => 24,
        'price_per_month'   => 5.00,
        'price_unit'        => 'USD',
    ],

    // PayPal settings
    'paypal'        => [
        'mode'              => 'sandbox',
        'client_id'         => '',
        'secret_id'         => '',
    ],

    // Ranks ids, these ranks are used by automated procedures in the backend
    // If you're using the setup command in topia, these are already set correctly for you!
    'rank'          => [
        'regular'           => 1,
        'verified'          => 2,
        'bot'               => 3,
        'donator'           => 4,
        'alumni'            => 5,
        'mod'               => 6,
        'admin'             => 7,
        'banned'            => 8,
    ],

    // Comment settings
    'comments'      => [
        'max_length'        => 5000,
        'min_length'        => 1,
        'daily_limit'       => 30,
    ],

    // Separate websites with its own routes
    'sites' => [
        '3ds'               => '',
        'wiiu'              => '',
        'web'               => '',
        'admin'             => '',
    ],

    // Admin panel settings
    'admin' => [
        'discord_guild'     => '',
    ],
];
