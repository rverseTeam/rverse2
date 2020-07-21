<?php
/**
 * Holds the IntObfuscator Helper.
 */

namespace Miiverse\Helpers;

use Exception;

/**
 * Handles int obfuscation for generic purposes.
 *
 * @author RverseTeam
 */
class IntObfuscator
{
    /**
     * The amount of Feistel rounds for the obfuscation.
     *
     * @var int
     */
    private const FEISTEL_ROUNDS = 100;

    /**
     * THe amount of rounds for the obfuscation.
     *
     * @var int
     */
    private const RAND_ROUNDS = 100;

    /**
     * The modulo for the curve. It's always 36^5 to ensure we get 5 letters per part.
     *
     * @var int
     */
    private const MOD = 60466176;

    /**
     * The seed used for obfuscation
     *
     * @var null|int
     */
    private static $seed = null;

    /**
     * Initializes the system with the selected seed.
     *
     * @param  int $seed
     *
     * @return void
     */
    public static function init(int $seed) : void {
        self::$seed = $seed;
    }

    /**
     * Pads the string with up to 5 characters with 0
     *
     * @param $string
     *
     * @return string
     */
    private static function pad5(string $string) : string {
        return strtoupper(str_pad($string, 5, "0", STR_PAD_LEFT));
    }

    /**
     * Create the curve for the obfuscation. It's not cryptographically secure,
     * so it's better used to obfuscate with it.
     *
     * See: http://en.wikipedia.org/wiki/Linear_congruential_generator
     *
     * @param  $x
     *
     * @return int
     */
    private static function f(int $x) : int {
        if (self::$seed === null) {
            throw new Exception('$seed is not defined');
        }

        $a = 12 + 1;
        $c = 1361423303;
        $x = ($x + self::$seed) % self::MOD;

        $r = self::RAND_ROUNDS;

        while($r-- !== 0) {
            $x = ($a*$x+$c) % self::MOD;
        }

        return $x;
    }

    /**
     * Obfuscate the number to a reversible string
     *
     * @param int
     *
     * @return string
     */
    public static function obfuscate(int $i) : string {
        if (self::$seed === null) {
            throw new Exception('$seed is not defined');
        }

        if ($i > 0xFFFFFF) {
            throw new Exception('Initial number is invalid');
        }

        $a = $i / self::MOD;
        $b = $i % self::MOD;

        $r = self::FEISTEL_ROUNDS;

        while ($r-- !== 0) {
            $a = ($a + self::f($b)) % self::MOD;
            $b = ($b + self::f($a)) % self::MOD;
        }

        return self::pad5(base_convert($a, 10, 36)) . self::pad5(base_convert($b, 10, 36));
    }


    /**
     * Deobfuscate the ID back to a valid number
     *
     * @param $string
     *
     * @return int
     */
    public static function deobfuscate(string $string) : int
    {
        if (self::$seed === null) {
            throw new Exception('$seed is not defined');
        }

        $a = intval(base_convert(substr($string, 0, 5), 36, 10));
        $b = intval(base_convert(substr($string, 5, 10), 36, 10));

        $r = self::FEISTEL_ROUNDS;

        while ($r-- !== 0) {
            $b = ($b - self::f($a)) % self::MOD;
            $a = ($a - self::f($b)) % self::MOD;
        }

        // make the modulus positive:
        $a = ($a + self::MOD) % self::MOD;
        $b = ($b + self::MOD) % self::MOD;

        $result = $a * MOD + $b;

        if ($result > 0xFFFFFF) {
            throw new Exception('Deobfuscated number is invalid');
        }

        return $result;
    }
}
