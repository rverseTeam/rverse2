<?php
/**
 * Holds the translation system.
 */

namespace Miiverse;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Translation\FileLoader;
use Illuminate\Translation\Translator;

/**
 * Translation system.
 *
 * @author Repflez
 */
class Translation
{
    /**
     * The path relative to the root.
     */
    private const LANG_DIR = 'resources/lang';

    /**
     * The translation engine.
     *
     * @var Translator
     */
    private static $engine;

    /**
     * Initialise the translation engine.
     */
    public static function init() : void
    {
        // Prepare the FileLoader
        $loader = new FileLoader(new Filesystem(), path(self::LANG_DIR));

        // Register the translator
        self::$engine = new Translator($loader, CurrentSession::$user->lang);

        // Register the fallback language
        self::$engine->setFallback('en');
    }

    /**
     * Get a string from the translation.
     *
     * @param string $key
     * @param array  $replace
     *
     * @return string|array|null
     */
    public static function get(string $key, array $replace = [])
    {
        return self::$engine->get($key, $replace);
    }
}
