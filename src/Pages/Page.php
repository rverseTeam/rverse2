<?php
/**
 * Holds the base page.
 */

namespace Miiverse\Pages;

use Spatie\ArrayToXml\ArrayToXml;

/**
 * Base page (which other pages should extend on).
 *
 * @author RverseTeam
 */
class Page
{
    /**
     * Middleware to execute upon creating this class.
     *
     * @var array
     */
    protected $middleware = [
        'UpdateLastOnline',
    ];

    /**
     * Used to except middleware in controllers that extend this one.
     *
     * @var array
     */
    protected $exceptMiddleware = [];

    /**
     * Constructor.
     */
    public function __construct()
    {
        // filter excepted middlewares
        $middlewares = array_diff($this->middleware, $this->exceptMiddleware);

        foreach ($middlewares as $middleware) {
            $className = "Miiverse\\Middleware\\{$middleware}";
            (new $className())->run();
        }
    }

    /**
     * Encodes json.
     *
     * @param array|\stdObject $object
     * @param int              $operators
     *
     * @return string
     */
    public function json($object, int $operators = null) : string
    {
        $json = json_encode($object, $operators ?? 0);

        header('Content-Type: application/json; charset=utf-8');

        return $json;
    }

    /**
     * Encodes XML.
     * 
     * @param array $object
     * 
     * @return string
     */
    public function xml(array $object): string
    {
        $result = ArrayToXml::convert($object, 'result', true, 'UTF-8');

        header('Content-Type: application/xml; charset=UTF-8');
        header("Content-Length: " . strlen($result));

        return $result;
    }
}
