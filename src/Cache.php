<?php
/**
 * Holds the Redis engine.
 */

namespace Miiverse;

use Predis\Client as Redis;

/**
 * Handles the Redis cache system.
 *
 * @author Repflez
 */
class Cache
{
    /**
     * The object of Predis.
     * 
     * @var Predis\Client
     */
    private static $redis = null;

    /**
     * Initialise Redis engine.
     */
    public static function init() : void {
        self::$redis = new Redis;
    }

    /**
     * Get a value.
     * 
     * @param string $key The key to be fetched
     * @param int $ttl The TTL of the object. If the object has a larger TTL, it's considered stale and returns null.
     */
    public static function get(string $key, int $ttl = 120) {
        $key = 'ffe00475fc9ccd10bb002534512d2749-' . strtr($key, ':/', '-_');

        // Fetch cache data from Redis.
        $data = self::$redis->get($key);
        if ($data) {
            list($created, $contents) = unserialize($data);

            if (($created + $ttl) < time()) {
                return null;
            } else {
                return $contents;
            }
        } else {
            return null;
        }
    }

    /**
     * Store a value.
     * 
     * @param string $key The key name it's being stored
     * @param mixed $value The value to be stored
     */
    public static function store(string $key, $value) : void {
        $key = 'ffe00475fc9ccd10bb002534512d2749-' . strtr($key, ':/', '-_');
        $value = $value ?? null;

        // Storing this in Redis
        $store = serialize([time(), $value]);

        self::$redis->set($key, $store);
    }

    /**
     * Delete value
     * 
     * @param string $key The key to delete
     */
    public static function delete(string $key) : void {
        $key = 'ffe00475fc9ccd10bb002534512d2749-' . strtr($key, ':/', '-_');

        self::$redis->del($key);
    }

    /**
     * Checks if redis is available.
     * 
     * @return bool Redis availability
     */
    public static function available() : bool {
        return self::$redis !== null;
    }
}