<?php

/**
 * Holds the translation system.
 */

namespace Miiverse;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Translation\FileLoader;
use Illuminate\Translation\Translator;
use Miiverse\Helpers\ConsoleAuth;

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

    // Public language constants
    public const LANGUAGE_SYSTEM        = 'xx';
    public const LANGUAGE_JAPANESE      = 'ja';
    public const LANGUAGE_ENGLISH       = 'en';
    public const LANGUAGE_FRENCH        = 'fr';
    public const LANGUAGE_GERMAN        = 'de';
    public const LANGUAGE_ITALIAN       = 'it';
    public const LANGUAGE_SPANISH       = 'es';
    public const LANGUAGE_CHINESE       = 'zh';
    public const LANGUAGE_KOREAN        = 'ko';
    public const LANGUAGE_DUTCH         = 'nl';
    public const LANGUAGE_PORTUGUESE    = 'pt';
    public const LANGUAGE_RUSSIAN       = 'ru';
    public const LANGUAGE_CHINESE_2     = 'zh';

    /**
     * Initialise the translation engine.
     */
    public static function init(): void
    {
        // Prepare the FileLoader
        $loader = new FileLoader(new Filesystem(), path(self::LANG_DIR));

        $language = "";

        // Get the language to use
        if (CurrentSession::$user->lang === self::LANGUAGE_SYSTEM) {
            // Select the language based on their console's language
            switch (intval(ConsoleAuth::$paramPack['language_id'])) {
                case 0:
                    $language = self::LANGUAGE_JAPANESE;
                    break;
                case 1:
                    $language = self::LANGUAGE_ENGLISH;
                    break;
                case 2:
                    $language = self::LANGUAGE_FRENCH;
                    break;
                case 3:
                    $language = self::LANGUAGE_GERMAN;
                    break;
                case 4:
                    $language = self::LANGUAGE_ITALIAN;
                    break;
                case 5:
                    $language = self::LANGUAGE_SPANISH;
                    break;
                case 6:
                    $language = self::LANGUAGE_CHINESE;
                    break;
                case 7:
                    $language = self::LANGUAGE_KOREAN;
                    break;
                case 8:
                    $language = self::LANGUAGE_DUTCH;
                    break;
                case 9:
                    $language = self::LANGUAGE_PORTUGUESE;
                    break;
                case 10:
                    $language = self::LANGUAGE_RUSSIAN;
                    break;
                case 11:
                    $language = self::LANGUAGE_CHINESE_2;
                    break;
                default:
                    $language = self::LANGUAGE_ENGLISH;
                    break;
            }
        } else {
            // Use the language set on their account
            $language = CurrentSession::$user->lang;
        }

        // Register the translator
        self::$engine = new Translator($loader, $language);

        // Register the fallback language
        self::$engine->setFallback(self::LANGUAGE_ENGLISH);
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
