<?php
/**
 * Holds the templating engine class.
 */

namespace Miiverse;

use Twig_Environment;
use Twig_Extension_Debug;
use Twig_Extension_StringLoader;
use Twig_Loader_Filesystem;
use Twig_SimpleFilter;
use Twig_SimpleFunction;

/**
 * Miiverse wrapper for Twig.
 *
 * @author Repflez
 */
class Template
{
    /**
     * The file extension used by template files.
     */
    private const FILE_EXT = '.twig';

    /**
     * The path relative to the root.
     */
    private const VIEWS_DIR = 'resources/views/';

    /**
     * The template name.
     *
     * @var string
     */
    public static $name;

    /**
     * The templating engine.
     *
     * @var Twig_Environment
     */
    private static $engine;

    /**
     * The variables passed on to the templating engine.
     *
     * @var array
     */
    private static $vars = [];

    /**
     * List of utility functions to add to templating.
     *
     * @var array
     */
    protected static $utilityFunctions = [
        'route',
        'config',
        'session_id',
        'hashid',
        'dehashid',
        '__',
    ];

    /**
     * List of utility filters to add to templating.
     *
     * @var array
     */
    protected static $utilityFilters = [
        'json_decode',
        'byte_symbol',
    ];

    /**
     * Set the template name.
     *
     * @param string $name
     */
    public static function set($name)
    {
        // Set variables
        self::$name = $name;

        // Reinitialise
        self::init();
    }

    /**
     * Initialise the templating engine.
     */
    public static function init() : void
    {
        $views_dir = path(self::VIEWS_DIR);

        // Initialise Twig Filesystem Loader
        $loader = new Twig_Loader_Filesystem();

        foreach (glob("{$views_dir}*") as $dir) {
            $key = basename($dir);

            if ($key === self::$name) {
                $loader->addPath($dir, '__main__');
            }

            $loader->addPath($dir, $key);
        }

        // Environment variable
        $env = [
            'cache' => config('performance.template_cache')
            ? config('performance.cache_dir').'views'
            : false,
            'auto_reload'      => true,
            'debug'            => config('dev.twig_debug'),
            'strict_variables' => true,
        ];

        // And now actually initialise the templating engine
        self::$engine = new Twig_Environment($loader, $env);

        // Load String template loader
        self::$engine->addExtension(new Twig_Extension_StringLoader());

        // Add utility functions
        foreach (self::$utilityFunctions as $function) {
            self::$engine->addFunction(new Twig_SimpleFunction($function, $function));
        }

        // Add utility filters
        foreach (self::$utilityFilters as $filter) {
            self::$engine->addFilter(new Twig_SimpleFilter($filter, $filter));
        }

        // Add debug functions if debug is enabled
        if (config('dev.twig_debug')) {
            self::$engine->addExtension(new Twig_Extension_Debug());
        }
    }

    /**
     * Checks if twig is available.
     *
     * @return bool
     */
    public static function available() : bool
    {
        return self::$engine !== null && self::$name !== null;
    }

    /**
     * Merge the parse variables.
     *
     * @param array $vars
     */
    public static function vars(array $vars) : void
    {
        self::$vars = array_merge(self::$vars, $vars);
    }

    /**
     * Render a template file.
     *
     * @param string $file
     *
     * @return string
     */
    public static function render(string $file) : string
    {
        return self::$engine->render($file.self::FILE_EXT, self::$vars);
    }

    /**
     * Checks if a template directory exists.
     *
     * @param string $name
     *
     * @return bool
     */
    public static function exists(string $name) : bool
    {
        return ctype_alnum($name) && file_exists(path(self::VIEWS_DIR.$name.'/'));
    }
}
