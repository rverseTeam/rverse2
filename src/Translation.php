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
    public const LANGUAGE_SYSTEM                = 99; // Fallback variable meaning all languages
    public const LANGUAGE_JAPANESE              = 'ja';
    public const LANGUAGE_ENGLISH               = 'en';
    public const LANGUAGE_FRENCH                = 'fr';
    public const LANGUAGE_GERMAN                = 'de';
    public const LANGUAGE_ITALIAN               = 'it';
    public const LANGUAGE_SPANISH               = 'es';
    public const LANGUAGE_SIMPLIFIED_CHINESE    = 'chi';
    public const LANGUAGE_KOREAN                = 'ko';
    public const LANGUAGE_DUTCH                 = 'nl';
    public const LANGUAGE_PORTUGUESE            = 'pt';
    public const LANGUAGE_RUSSIAN               = 'ru';
    public const LANGUAGE_TRADITIONAL_CHINESE   = 'zho';

    /**
     * Initialise the translation engine.
     */
    public static function init(): void
    {
        // Prepare the FileLoader
        $loader = new FileLoader(new Filesystem(), path(self::LANG_DIR));

        $language = "";

        // Get the language to use
        if (CurrentSession::$user->language === self::LANGUAGE_SYSTEM) {
            // Select the language based on their console's language
            $language = self::getIsoLanguage(intval(ConsoleAuth::$paramPack['language_id']));
        } else {
            // Use the language set on their account
            $language = self::getIsoLanguage(CurrentSession::$user->language);
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

    /**
     * Converts Language ID to ISO 639 code.
     *
     * @param int $languageCode
     * 
     * @return string
     */
    public static function getIsoLanguage(int $languageCode): string
    {
        switch ($languageCode) {
            case 0:  return self::LANGUAGE_JAPANESE;
            case 1:  return self::LANGUAGE_ENGLISH;
            case 2:  return self::LANGUAGE_FRENCH;
            case 3:  return self::LANGUAGE_GERMAN;
            case 4:  return self::LANGUAGE_ITALIAN;
            case 5:  return self::LANGUAGE_SPANISH;
            case 6:  return self::LANGUAGE_SIMPLIFIED_CHINESE;
            case 7:  return self::LANGUAGE_KOREAN;
            case 8:  return self::LANGUAGE_DUTCH;
            case 9:  return self::LANGUAGE_PORTUGUESE;
            case 10: return self::LANGUAGE_RUSSIAN;
            case 11: return self::LANGUAGE_TRADITIONAL_CHINESE;
            default: return self::LANGUAGE_ENGLISH;
        }
    }

    /**
     * Converts ISO 639 code to Language ID
     *
     * @param string $languageCode
     * 
     * @return int
     */
    public static function getLanguageCode(string $languageCode) : int
    {
        switch ($languageCode) {
            case self::LANGUAGE_JAPANESE:               return 0;
            case self::LANGUAGE_ENGLISH:                return 1;
            case self::LANGUAGE_FRENCH:                 return 2;
            case self::LANGUAGE_GERMAN:                 return 3;
            case self::LANGUAGE_ITALIAN:                return 4;
            case self::LANGUAGE_SPANISH:                return 5;
            case self::LANGUAGE_SIMPLIFIED_CHINESE:     return 6;
            case self::LANGUAGE_KOREAN:                 return 7;
            case self::LANGUAGE_DUTCH:                  return 8;
            case self::LANGUAGE_PORTUGUESE:             return 9;
            case self::LANGUAGE_RUSSIAN:                return 10;
            case self::LANGUAGE_TRADITIONAL_CHINESE:    return 11;
            default:                                    return 1; // English Language ID
        }
    }
}
