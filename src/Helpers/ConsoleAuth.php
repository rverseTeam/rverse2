<?php
/**
 * Holds the ConsoleAuth Helper.
 */

namespace Miiverse\Helpers;

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

	/**
	 * Checks the Console Auth for 3DS.
	 */
	public static function check3DS()
	{
		// Send the user to the welcome guest page if there's no NNID token sent
		if (!isset($_SERVER['HTTP_X_NINTENDO_SERVICETOKEN'])) {
			if (!$_SESSION['guest']) {
				$_SESSION['guest'] = true;
				redirect(route('welcome.guest'));
			}
		}

		// Check if we don't have a valid session data
		if (!isset($_SESSION['authData'])) {
			$storage = [];

			// Unpack the ParamPack from the headers sent by the console
			// This only deals with Nintendo style ParamPack
			// https://github.com/foxverse/3ds/blob/5e1797cdbaa33103754c4b63e87b4eded38606bf/web/titlesShow.php#L37-L40
			$data = explode('\\', base64_decode($_SERVER['HTTP_X_NINTENDO_PARAMPACK']));

			$paramCount = count($data);

			for ($i = 1; $i < $paramCount; $i += 2) {
				$storage[$data[$i]] = $data[$i + 1];
			}

			// Set title id and transferable id to hex, just in case we need it
			$storage['title_id'] = base_convert($storage['title_id'], 10, 16);
			$storage['transferable_id'] = base_convert($storage['transferable_id'], 10, 16);
			$serviceToken = bin2hex(base64_decode($_SERVER['HTTP_X_NINTENDO_SERVICETOKEN']));

			$_SESSION['authData'] = [
				'paramPack' => $storage,
				'short'     => substr($serviceToken, 0, 16),
				'long'      => substr($serviceToken, 0, 64),
			];
		}

		// Store the values for later use
		self::$paramPack = $_SESSION['authData']['paramPack'];
		self::$consoleId = new stdClass();

		self::$consoleId->short = $_SESSION['authData']['short'];
		self::$consoleId->long = $_SESSION['authData']['long'];

		if (empty(self::$consoleId->short) || empty(self::$consoleId->long)) {
			die('Invalid auth data.');
		}
	}

	/**
	 * Checks the Console Auth for WiiU.
	 */
	public static function checkWiiU()
	{
		// Send the user to the welcome guest page if there's no NNID token sent
		if (!isset($_SERVER['HTTP_X_NINTENDO_SERVICETOKEN'])) {
			if (!$_SESSION['guest']) {
				$_SESSION['guest'] = true;
				redirect(route('welcome.guest'));
			}
		}

		// Check if we don't have a valid session data
		if (!isset($_SESSION['authData'])) {
			$storage = [];

			// Unpack the ParamPack from the headers sent by the console
			// This only deals with Nintendo style ParamPack
			// https://github.com/foxverse/3ds/blob/5e1797cdbaa33103754c4b63e87b4eded38606bf/web/titlesShow.php#L37-L40
			$data = explode('\\', base64_decode($_SERVER['HTTP_X_NINTENDO_PARAMPACK']));

			$paramCount = count($data);

			for ($i = 1; $i < $paramCount; $i += 2) {
				$storage[$data[$i]] = $data[$i + 1];
			}

			// Set title id and transferable id to hex, just in case we need it
			$storage['title_id'] = base_convert($storage['title_id'], 10, 16);
			$storage['transferable_id'] = base_convert($storage['transferable_id'], 10, 16);
			$serviceToken = bin2hex(base64_decode($_SERVER['HTTP_X_NINTENDO_SERVICETOKEN']));

			$_SESSION['authData'] = [
				'paramPack' => $storage,
				'short'     => substr($serviceToken, 0, 16),
				'long'      => substr($serviceToken, 0, 64),
			];
		}

		// Store the values for later use
		self::$paramPack = $_SESSION['authData']['paramPack'];
		self::$consoleId = new stdClass();

		self::$consoleId->short = $_SESSION['authData']['short'];
		self::$consoleId->long = $_SESSION['authData']['long'];

		if (empty(self::$consoleId->short) || empty(self::$consoleId->long)) {
			die('Invalid auth data.');
		}
	}
}
