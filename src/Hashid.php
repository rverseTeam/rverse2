<?php
/**
 * Holds the Hashids implementation.
 */

namespace Miiverse;

use Hashids\Hashids;

/**
 * Handles the site Hasids.
 *
 * @author Dilene
 */
class Hashid
{
    /**
     * The Hashids engine.
     *
     * @var Hashids
     */
    private static $hashids;

    /**
     * Initialise Hashids.
     *
     * @param string $salt
     *
     * @return void
     */
    public static function init(string $salt) : void
    {
        self::$hashids = new Hashids($salt, 20);
    }

    /**
     * Encode the current int or array to Hashids.
     *
     * @param string|int|array $ids
     *
     * @return string
     */
    public static function encode($ids) : string
    {
        return self::$hashids->encode($ids);
    }

    /**
     * Decode the current Hashid to array.
     *
     * @param string $hashid
     *
     * @return sring|array
     */
    public static function decode(string $hashid)
    {
        return self::$hashids->decode($hashid);
    }
}
