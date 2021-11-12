<?php
/**
 * Holds the router class.
 */

namespace Miiverse;

use Closure;
use Phroute\Phroute\Dispatcher;
use Phroute\Phroute\Exception\HttpMethodNotAllowedException;
use Phroute\Phroute\Exception\HttpRouteNotFoundException;
use Phroute\Phroute\RouteCollector;

/**
 * Miiverse Wrapper for Phroute.
 *
 * @author Repflez
 */
class Router
{
    /**
     * Container for RouteCollector.
     *
     * @var RouteCollector
     */
    protected static $router = null;

    /**
     * Container for the Dispatcher.
     *
     * @var Dispatcher
     */
    protected static $dispatcher = null;

    /**
     * Collection of handled HTTP request types.
     *
     * @var array
     */
    protected static $methods = [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'HEAD',
        'OPTIONS',
        'ANY',
    ];

    /**
     * Method aliases for adding routes.
     *
     * @param string $name
     * @param array  $args
     */
    public static function __callStatic(string $name, array $args) : void
    {
        // Check if the method exists
        if (in_array($name = strtoupper($name), self::$methods)) {
            $path = isset($args[2]) && $args !== null ? [$args[0], $args[2]] : $args[0];
            $handler = is_callable($args[1]) || is_array($args[1])
            ? $args[1]
            : explode(
                '@',
                (
                    'Miiverse\\Pages\\'
                    .str_replace(
                        '.',
                        '\\',
                        $args[1]
                    )
                )
            );
            $filter = isset($args[3]) ? $args[3] : [];

            self::$router->addRoute($name, $path, $handler, $filter);
        }
    }

    /**
     * Initialisation.
     */
    public static function init() : void
    {
        self::$router = new RouteCollector();
    }

    /**
     * Parse a URL.
     *
     * @param string $url
     *
     * @return string
     */
    private static function parseUrl(string $url) : string
    {
        return parse_url($url, PHP_URL_PATH);
    }

    /**
     * Generate the URI of a route using names.
     *
     * @param string       $name
     * @param string|array $args
     *
     * @return string
     */
    public static function route(string $name, $args = null) : string
    {
        // Array-ify the arguments
        if ($args !== null && !is_array($args)) {
            $temp = $args;
            $args = [];
            $args[] = $temp;
        }

        return '/'.self::$router->route($name, $args);
    }

    /**
     * Create group.
     *
     * @param array   $filters
     * @param Closure $callback
     */
    public static function group(array $filters, Closure $callback) : void
    {
        // Execute the inner function
        self::$router->group($filters, $callback);
    }

    /**
     * Create filter.
     *
     * @param string $name
     * @param $method
     */
    public static function filter(string $name, $method) : void
    {
        self::$router->filter($name, $method);
    }

    /**
     * Handle requests.
     *
     * @param string $method
     * @param string $url
     *
     * @return string
     */
    public static function handle(string $method, string $url) : ?string
    {
        // Check if the dispatcher is defined
        if (self::$dispatcher === null) {
            self::$dispatcher = new RouteDispatcher(self::$router->getData());
        }

        // Parse url
        $url = self::parseUrl($url);

        // Handle the request
        try {
            return self::$dispatcher->dispatch($method, $url);
        } catch (HttpMethodNotAllowedException $e) {
            http_response_code(403);

            return view('errors/403');
        } catch (HttpRouteNotFoundException $e) {
            http_response_code(404);

            return view('errors/404');
        }
    }
}
