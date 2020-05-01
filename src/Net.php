<?php
/**
 * Holds the everything networking.
 */

namespace Miiverse;

use Miiverse\Exceptions\NetAddressTypeException;
use Miiverse\Exceptions\NetInvalidAddressException;

/**
 * Networking methods.
 *
 * @author Repflez
 */
class Net
{
    /**
     * Returns the connecting IP.
     *
     * @return string
     */
    public static function ip() : string
    {
        return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '::1';
    }

    /**
     * Detect the version of an IP.
     *
     * @param string $ipAddr
     *
     * @return int
     */
    public static function detectIPVersion(string $ipAddr) : int
    {
        // Check if var is IP
        if (filter_var($ipAddr, FILTER_VALIDATE_IP)) {
            // v4
            if (filter_var($ipAddr, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
                return 4;
            }

            // v6
            if (filter_var($ipAddr, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
                return 6;
            }
        }

        // Not an IP or unknown type
        return 0;
    }

    /**
     * Converts a printable IP address into an unpacked binary string.
     *
     * @param string $ip
     *
     * @throws NetInvalidAddressException
     *
     * @return string
     */
    public static function pton(string $ip) : string
    {
        // Detect the IP version
        $ipv = self::detectIPVersion($ip);

        // Check for IPv4 first since that's most common
        if ($ipv === 4) {
            return current(unpack('a4', inet_pton($ip)));
        }

        // Then attempt IPv6
        if ($ipv === 6) {
            return current(unpack('A16', inet_pton($ip)));
        }

        // Throw an exception if an invalid IP was supplied
        throw new NetInvalidAddressException();
    }

    /**
     * Converts a binary unpacked IP to a printable packed IP.
     *
     * @param string $bin
     *
     * @throws NetAddressTypeException
     *
     * @return string
     */
    public static function ntop(string $bin) : string
    {
        // Get the length of the binary string
        $len = strlen($bin);

        // Throw an exception if it's not 4 or 16 bytes
        if ($len !== 4 && $len !== 16) {
            throw new NetAddressTypeException();
        }

        // Finally pack the IP
        return inet_ntop(pack("A{$len}", $bin));
    }

    /**
     * Matches an IP to a CIDR range.
     *
     * @param string $ip
     * @param string $range
     *
     * @return bool
     */
    public static function matchCIDR(string $ip, string $range) : bool
    {
        // Break the range up in parts
        [$net, $mask] = explode('/', $range);

        // Check IP version
        $ipv = self::detectIPVersion($ip);
        $rangev = self::detectIPVersion($net);

        // Return false if it's not a valid IP
        if ($ipv !== $rangev && !$ipv) {
            return false;
        }

        // v4
        if ($ipv === 4) {
            return self::matchCIDRv4($ip, $net, $mask);
        }

        // v6
        if ($ipv === 6) {
            return self::matchCIDRv6($ip, $net, $mask);
        }

        // Return false by default
        return false;
    }

    /**
     * Match an IPv4 CIDR.
     *
     * @param string $ip
     * @param string $net
     * @param string $mask
     *
     * @return bool
     */
    private static function matchCIDRv4(string $ip, string $net, string $mask) : bool
    {
        // Convert IP and Net address to long
        $ip = ip2long($ip);
        $net = ip2long($net);

        // Generate mask
        $mask = -1 << (32 - $mask);

        // Do the check
        return ($ip & $mask) === $net;
    }

    /**
     * Converts an IPv6 mask to a byte array.
     *
     * @param int $mask
     *
     * @return string
     */
    private static function maskToByteArray(int $mask) : string
    {
        // Generate an address from the mask
        $addr = str_repeat('f', $mask / 4);

        // Append uneven bit
        switch ($mask % 4) {
            case 1:
                $addr .= '8';
                break;

            case 2:
                $addr .= 'c';
                break;

            case 3:
                $addr .= 'e';
                break;
        }

        // Pad the address with zeroes
        $addr = str_pad($addr, 32, '0');

        // Pack the address
        $addr = pack('H*', $addr);

        // Return the packed address
        return $addr;
    }

    /**
     * Match an IPv6 CIDR.
     *
     * @param string $ip
     * @param string $net
     * @param int    $mask
     *
     * @return bool
     */
    private static function matchCIDRv6(string $ip, string $net, int $mask) : bool
    {
        // Pack the IP and Net addresses
        $ip = inet_pton($ip);
        $net = inet_pton($net);

        // Convert the mask to a byte array
        $mask = self::maskToByteArray($mask);

        // Compare them
        return ($ip & $mask) === $net;
    }

    /**
     * Make a web request.
     *
     * @param string $url
     * @param string $method
     * @param mixed  $params Can be either an array or a string.
     *
     * @return string
     */
    public static function request(string $url, string $method = 'GET', $params = null) : string
    {
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 2,
            CURLOPT_TIMEOUT        => 4,
            CURLOPT_USERAGENT      => 'rverse/1.0 (+https://rverse.ml)',
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false, // for CF flexible SSL
        ]);

        switch (strtolower($method)) {
            case 'head':
                curl_setopt_array($curl, [
                    CURLOPT_HEADER => true,
                    CURLOPT_NOBODY => true,
                ]);
                break;

            case 'post':
                curl_setopt_array($curl, [
                    CURLOPT_POST       => is_array($params) ? count($params) : 1,
                    CURLOPT_POSTFIELDS => is_array($params) ? http_build_query($params) : $params,
                ]);
                break;
        }

        $curl = curl_exec($curl);

        return $curl;
    }

    /**
     * Make a JSON request.
     *
     * @param string $url
     * @param string $method
     * @param array $params
     *
     * @return string
     */
    public static function JSONRequest(string $url, string $method = 'GET', array $params = []) : string
    {
        $curl = curl_init();
        $params = json_encode($params);

        curl_setopt_array($curl, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 2,
            CURLOPT_TIMEOUT        => 4,
            CURLOPT_USERAGENT      => 'rverse/1.0 (+https://rverse.ml)',
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false, // for CF flexible SSL
            CURLOPT_POSTFIELDS     => $params,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($params)
            ],
        ]);

        switch (strtolower($method)) {
            case 'head':
                curl_setopt_array($curl, [
                    CURLOPT_HEADER => true,
                    CURLOPT_NOBODY => true,
                ]);
                break;

            case 'post':
                curl_setopt_array($curl, [
                    CURLOPT_POST => 1,
                ]);
                break;
        }

        $curl = curl_exec($curl);

        return $curl;
    }
}
