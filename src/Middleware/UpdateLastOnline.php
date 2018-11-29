<?php
/**
 * Holds the last online update middleware.
 */

namespace Miiverse\Middleware;

use Miiverse\CurrentSession;

/**
 * Updates when the last online time of a user.
 *
 * @author Repflez
 */
class UpdateLastOnline implements MiddlewareInterface
{
    /**
     * Update the last online information for the active user.
     */
    public function run() : void
    {
        if (CurrentSession::$user->id !== 0) {
            CurrentSession::$user->updateOnline();
        }
    }
}
