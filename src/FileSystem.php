<?php
/**
 * Holds file system interaction stuff.
 */

namespace Miiverse;

/**
 * Used for handling file system interactions.
 *
 * @author Repflez
 */
class FileSystem
{
    /**
     * Cached copy of the root path.
     *
     * @var string
     */
    private static $rootPath = null;

    /**
     * Resolves the root path.
     *
     * @return string
     */
    public static function getRootPath() : string
    {
        if (self::$rootPath === null) {
            // assuming we're running from the 'app' subdirectory
            self::$rootPath = realpath(__DIR__.'/..');
        }

        return self::$rootPath;
    }

    /**
     * Fixes a given path to the correct slashes and root.
     *
     * @param string $path
     *
     * @return string
     */
    public static function getPath(string $path) : string
    {
        return self::getRootPath().DIRECTORY_SEPARATOR.self::fixSlashes($path);
    }

    /**
     * Fixes slashes.
     *
     * @param string $path
     *
     * @return string
     */
    private static function fixSlashes(string $path) : string
    {
        return str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $path);
    }
}
