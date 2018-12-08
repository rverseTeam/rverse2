<?php
/**
 * Holds the admin index and login sections.
 */

namespace Miiverse\Pages\Admin;

/**
 * Admin Index.
 *
 * @author RverseTeam
 */
class Home extends Page
{
    /**
     * Serves the admin index, or a login form if there's no session.
     *
     * @return string
     */
    public function index() : string
    {
        if (isset($_SESSION['admin_expires']) && $_SESSION['admin_expires'] > time()) {
            return 'logged in :>';
        } else {
            return 'not logged in, <a href="'.route('oauth2.login').'">press here for login</a>';
        }
    }
}
