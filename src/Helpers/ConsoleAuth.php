<?php
/**
 * Holds the ConsoleAuth Helper.
 */

namespace Miiverse\Helpers;

use Miiverse\Cache;
use stdClass;

/**
 * Handles the data headers sent by the Miiverse applet.
 *
 * @author RverseTeam
 */
class ConsoleAuth
{
	/**
	 * The ParamPack of the current console.
	 *
	 * @var array
	 */
	public static $paramPack = [];

	/**
	 * The friend PID of the current console.
	 *
	 * @var object
	 */
	public static $consoleId;

	// Console ID
	public const AUTH_CONSOLE_3DS = 0;
	public const AUTH_CONSOLE_WIIU = 1;
	public const AUTH_CONSOLE_BOTH = -1;

	// Auth failure reasons
	public const AUTH_FAILURE_NO_TOKEN = 0;
	public const AUTH_FAILURE_INVALID_TOKEN = 1;
	public const AUTH_FAILURE_WRONG_CONSOLE = 2;
	public const AUTH_FAILURE_PRETENDO_TOKEN = 10;

	// Auth success reasons
	public const AUTH_SUCCESS = 3;

	private const SESSION_CACHE_NAME = 'ConsoleAuth';

	/**
	 * Authenticate a console based on the Service Token HTTP header
	 * 
	 * @return int The success code
	 */
	private static function authServiceToken(int $expectedConsole) : int
	{
		// Bail out early if there is no service token to parse
		if (!isset($_SERVER['HTTP_X_NINTENDO_SERVICETOKEN'])) {
			return self::AUTH_FAILURE_NO_TOKEN;
		}

		// Pretendo service tokens are 48 characters, acoording to Jon.
		// check for the length of those tokens and an extra overhead just in case.
		// Remove once Pretendo support is finalized.
		if (strlen($_SERVER['HTTP_X_NINTENDO_SERVICETOKEN']) < 55)
			return self::AUTH_FAILURE_PRETENDO_TOKEN;

		// Start parsing the service toekn
		$serviceToken = bin2hex(base64_decode($_SERVER['HTTP_X_NINTENDO_SERVICETOKEN']));

		// Get the unique part of the token from the service token as our session ID
		$sessionId = substr($serviceToken, 0, 64);
		$sessionIdShort = substr($serviceToken, 0, 16);

		// Check if the session id is not empty, otherwise, end it here and redisrect the user
		// to the guest section
		if (empty($sessionId))
			return self::AUTH_FAILURE_INVALID_TOKEN;

		// Read and parse ParamPack
		$paramPack = base64_decode($_SERVER['HTTP_X_NINTENDO_PARAMPACK']);

		// Remove the last separator if there's one trailing
		if (substr($paramPack, -1) === '\\')
			$paramPack = substr($paramPack, 0, -1);

		// Unpack the ParamPack from the headers sent by the console
		// This only deals with Nintendo style ParamPack
		// https://github.com/foxverse/3ds/blob/5e1797cdbaa33103754c4b63e87b4eded38606bf/web/titlesShow.php#L37-L40
		$data = explode('\\', $paramPack);

		$paramCount = count($data);

		for ($i = 1; $i < $paramCount; $i += 2) {
			$session[$data[$i]] = $data[$i + 1];
		}

		// Set some misc data we need
		$session['platform_id'] = intval($session['platform_id']);
		$session['region_id'] = intval($session['region_id']);
		$session['language_id'] = intval($session['language_id']);

		// At this point we can check the console from the token
		if ($expectedConsole != self::AUTH_CONSOLE_BOTH && $session['platform_id'] !== $expectedConsole)
			return self::AUTH_FAILURE_WRONG_CONSOLE;

		// Set title id and transferable id to hex, just in case we need it
		$session['title_id'] = base_convert($session['title_id'], 10, 16);
		$session['title_id_string'] = str_pad($session['title_id'], 16, "0", STR_PAD_LEFT);
		$session['transferable_id'] = base_convert($session['transferable_id'], 10, 16);

		// Get the session data from Redis, otherwise, create it from scratch
		$persistentSessionData = Cache::get(self::SESSION_CACHE_NAME . $sessionId, 600);

		if (!$persistentSessionData) {
			$persistentSessionData = [];

			// Set activity feed status
			$persistentSessionData['in_activity_feed'] = false;

			Cache::store(self::SESSION_CACHE_NAME . $sessionId, $persistentSessionData);
		}

		// Set the session session for later use
		self::$paramPack = array_merge($session, $persistentSessionData);
		
		// Set the console ID variable
		self::$consoleId = new stdClass();
		self::$consoleId->short = $sessionIdShort;
		self::$consoleId->long = $sessionId;

		return self::AUTH_SUCCESS;
	}

	public static function updateSession(string $name, $value)
	{
		$session = Cache::get(self::SESSION_CACHE_NAME . self::$consoleId->long, 600);

		$session[$name] = $value;

		Cache::store(self::SESSION_CACHE_NAME . self::$consoleId->long, $session);

		self::$paramPack = $session;
	}

	/**
	 * Checks the Console Auth for 3DS.
	 */
	public static function check3DS()
	{
		$session = self::authServiceToken(self::AUTH_CONSOLE_3DS);

		if ($session === self::AUTH_FAILURE_PRETENDO_TOKEN)
			redirect(route('warning.pretendo'));

		if ($session !== self::AUTH_SUCCESS)
			redirect(route('welcome.guest'));
	}

	/**
	 * Checks the Console Auth for WiiU.
	 */
	public static function checkWiiU()
	{
		$session = self::authServiceToken(self::AUTH_CONSOLE_WIIU);

		if ($session === self::AUTH_FAILURE_PRETENDO_TOKEN)
			redirect(route('warning.pretendo'));

		if ($session !== self::AUTH_SUCCESS)
			redirect(route('welcome.guest'));
	}

	/**
	 * Checks the Console Auth for both 3DS and WiiU.
	 */
	public static function checkBothAuth()
	{
		$session = self::authServiceToken(self::AUTH_CONSOLE_BOTH);
		
		if ($session !== self::AUTH_SUCCESS)
			die('auth failure');
	}
}
