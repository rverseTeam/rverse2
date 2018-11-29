<?php
/**
 * Holds the middleware interface.
 */

namespace Miiverse\Middleware;

/**
 * Middleware interface.
 *
 * @author Repflez
 */
interface MiddlewareInterface
{
    /**
     * Runs the middleware task.
     */
    public function run();
}
