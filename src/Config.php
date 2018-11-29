<?php
/**
 * Holds the configuration manager.
 */

namespace Miiverse;

use Miiverse\Exceptions\ConfigNonExistentException;
use Miiverse\Exceptions\ConfigParseException;

/**
 * Handles the configuration settings of Miiverse.
 *
 * @author Repflez
 */
class Config
{
    /**
     * Storage for the parsed config file.
     *
     * @var array
     */
    private static $config = [];

    /**
     * Path for the configuration file.
     *
     * @var string
     */
    private static $configPath = __DIR__.'/../config.php';

    /**
     * Loads and parses the configuration file.
     *
     * @throws ConfigNonExistentException
     * @throws ConfigParseException
     */
    public static function load() : void
    {
        // Check if the configuration file exists
        try {
            if (!file_exists(self::$configPath)) {
                throw new ConfigNonExistentException();
            }
        } catch (ConfigNonExistentException $ex) {
            echo 'Configuration file not found. The configuration file in ',
                realpath(__DIR__.'/../config.example.php'),
                ' must be renamed to config.php to be able to load.';
            die;
        }

        // Attempt to load the configuration file
        $config = require_once self::$configPath;

        try {
            if (is_array($config)) {
                self::$config = $config;
            } else {
                throw new ConfigParseException();
            }
        } catch (ConfigParseException $ex) {
            die('The configuration file is not correct. Make sure it has been configured correctly.');
        }
    }

    /**
     * Get a value from the configuration.
     *
     * @param string $section
     * @param string $key
     *
     * @return array|string
     */
    public static function get(string $section, string $key = null)
    {
        // Check if the key that we're looking for exists
        if (array_key_exists($section, self::$config)) {
            if ($key) {
                // If we also have a subkey return the proper data
                return self::$config[$section][$key];
            }

            // else we just return the default value
            return self::$config[$section];
        }

        return null;
    }
}
