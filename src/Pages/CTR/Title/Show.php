<?php
/**
 * Holds the home page.
 */

namespace Miiverse\Pages\CTR\Title;

use Miiverse\CurrentSession;

/**
 * Home page.
 *
 * @author RverseTeam
 */
class Show extends Page
{
    /**
     * Serves the site index.
     */
    public function init()
    {
        if (CurrentSession::$user->id === 0) {
            // No user, redirect them to the welcome page
            redirect(route('gate.welcome'));
        } else {
            // There's a user in the system, login to the community index
            redirect(route('community.index'));
        }
    }
}
