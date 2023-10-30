<?php
/*
 * A set of utility helper functions
 */

use Miiverse\Config;
use Miiverse\CurrentSession;
use Miiverse\FileSystem;
use Miiverse\Hashid;
use Miiverse\Helpers\ConsoleAuth;
use Miiverse\Net;
use Miiverse\Router;
use Miiverse\Template;
use Miiverse\Translation;

// Sort of alias for Config::get
function config($value)
{
    $split = explode('.', $value);
    $key = array_pop($split);
    $section = implode('.', $split);

    return Config::get($section, $key) ?? Config::get($value) ?? null;
}

// Alias for Router::route
function route($name, $args = null, $full = false) : string
{
    return ($full ? full_domain() : '').Router::route($name, $args);
}

// Getting the full domain (+protocol) of the current host, only works for http
function full_domain() : string
{
    return 'http'.($_SERVER['HTTPS'] ?? false ? 's' : '').'://'.$_SERVER['HTTP_HOST'];
}

// Checking if a parameter is equal to session_id()
function session_check($param = 'session') : bool
{
    return isset($_REQUEST[$param]) && $_REQUEST[$param] === session_id();
}

// Alias for Template::vars and Template::render
function view($name, $vars = []) : string
{
    Template::vars($vars);

    return Template::render($name);
}

// Get a path
function path($path)
{
    return FileSystem::getPath($path);
}

// Convert camel case to snake case
function camel_to_snake($text) : string
{
    return ltrim(strtolower(preg_replace('#[A-Z]#', '_$0', $text)), '_');
}

function clean_string($string, $lower = false, $noSpecial = false, $replaceSpecial = '', $underscores = false)
{
    // Run common sanitisation function over string
    $string = trim($string);
    $string = htmlentities($string, ENT_NOQUOTES | ENT_HTML401, 'utf-8');
    $string = stripslashes($string);
    $string = strip_tags($string);

    // If set convert spaces to underscores
    if ($underscores) {
        $string = str_replace(' ', '_', $string);
    }

    // If set also make the string lowercase
    if ($lower) {
        $string = strtolower($string);
    }

    // If set remove all characters that aren't a-z or 0-9
    if ($noSpecial) {
        $string = preg_replace('/[^a-z0-9]/', $replaceSpecial, $string);
    }

    // Return clean string
    return $string;
}

// Redirect with turbolinks header
function redirect($url)
{
    header("Location: {$url}");
    exit;
}

function check_mx_record($email)
{
    // Get the domain from the e-mail address
    $domain = substr(strstr($email, '@'), 1);

    // Check the MX record
    $record = checkdnsrr($domain, 'MX');

    // Return the record data
    return $record;
}

function get_country_code()
{
    // Attempt to get country code using PHP's built in geo thing
    if (function_exists('geoip_country_code_by_name')) {
        try {
            $code = geoip_country_code_by_name(Net::ip());

            // Check if $code is anything
            if ($code) {
                return $code;
            }
        } catch (\Exception $e) {
        }
    }

    // Check if the required header is set and return it
    if (isset($_SERVER['HTTP_CF_IPCOUNTRY']) && strlen($_SERVER['HTTP_CF_IPCOUNTRY']) === 2) {
        return $_SERVER['HTTP_CF_IPCOUNTRY'];
    }

    // Return XX as a fallback
    return 'XX';
}

function get_country_name($code)
{
    switch (strtolower($code)) {
        case 'xx':
            return 'Unknown';

        case 'a1':
            return 'Anonymous Proxy';

        case 'a2':
            return 'Satellite Provider';

        default:
            return locale_get_display_region("-{$code}", 'en');
    }
}

// Count the amount of unique characters in the password string and calculate the entropy
function password_entropy($password)
{
    return count(count_chars(utf8_decode($password), 1)) * log(256, 2);
}

function byte_symbol($bytes)
{
    // Return nothing if the input was 0
    if (!$bytes) {
        return '0 B';
    }

    // Array with byte symbols
    $symbols = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    // Calculate byte entity
    $exp = floor(log($bytes) / log(1024));

    // Format the things
    $bytes = sprintf('%.2f '.$symbols[$exp], ($bytes / pow(1024, floor($exp))));

    // Return the formatted string
    return $bytes;
}

// turn this function into a wrapped class!
function send_mail($to, $subject, $body)
{
    $transport = Swift_SmtpTransport::newInstance()
        ->setHost(config('mail.smtp.server'))
        ->setPort(config('mail.smtp.port'));

    if (config('mail.smtp.secure')) {
        $transport->setEncryption(config('mail.smtp.secure'));
    }

    if (config('mail.smtp.auth')) {
        $transport->setUsername(config('mail.smtp.username'))
            ->setPassword(config('mail.smtp.password'));
    }

    $mailer = Swift_Mailer::newInstance($transport);

    $message = Swift_Message::newInstance($subject)
        ->setFrom([config('mail.smtp.from') => config('mail.smtp.name')])
        ->setBcc($to)
        ->setBody($body);

    return $mailer->send($message);
}

function rel2abs($rel, $base) : string
{
    // return if already absolute URL
    if (parse_url($rel, PHP_URL_SCHEME) != '') {
        return $rel;
    }

    // queries and anchors
    if ($rel[0] == '#' || $rel[0] == '?') {
        return $base.$rel;
    }

    // parse base URL and convert to local variables:
    // $scheme, $host, $path
    extract(parse_url($base));

    // remove non-directory element from path
    $path = preg_replace('#/[^/]*$#', '', $path);

    // destroy path if relative url points to root
    if ($rel[0] == '/') {
        $path = '';
    }

    // dirty absolute URL
    $abs = "$host$path/$rel";

    // replace '//' or '/./' or '/foo/../' with '/'
    $re = ['#(/\.?/)#', '#/(?!\.\.)[^/]+/\.\./#'];
    for ($n = 1; $n > 0; $abs = preg_replace($re, '/', $abs, -1, $n)) {
    }

    // absolute URL is ready!
    return $scheme.'://'.$abs;
}

function checkMaintenance()
{
    if (config('general.maintenance')) {
        http_response_code(503);

        return view('errors/503');
    }
}

function checkMaintenanceApi()
{
    if (config('general.maintenance')) {
        http_response_code(503);

        exit();
    }
}

function auth3DS()
{
    ConsoleAuth::check3DS();
}

function authWiiU()
{
    ConsoleAuth::checkWiiU();
}

function checkConsoleAuth()
{
    CurrentSession::authByConsole(ConsoleAuth::$consoleId);

    Template::vars([
        '_console'  => ConsoleAuth::$paramPack,
        'user'      => CurrentSession::$user,
        'language'  => Translation::getIsoLanguage(CurrentSession::$user->language)
    ]);
}

function hashid($items)
{
    return Hashid::encode($items);
}

function dehashid($hash)
{
    return Hashid::decode($hash);
}

function __(string $key, array $replace = [])
{
    return Translation::get($key, $replace);
}

function snake_to_camel(string $snake) : string
{
    return str_replace('_', '', ucwords($snake, '_'));
}