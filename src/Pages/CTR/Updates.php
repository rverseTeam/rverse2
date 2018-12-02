<?php
/**
 * Holds the updates system.
 */

namespace Miiverse\Pages\CTR;

use Miiverse\DB;

/**
 * Home page.
 *
 * @author RverseTeam
 */
class Updates extends Page
{
    /**
     * Gets News updates.
     *
     * @return string
     */
    public function news() : string
    {
        // Since we don't have a proper news system, we'll return a dummy one
        $updates = [
            'success' => 1,
            'admin_message' => (object)[
                'unread_count' => 0,
            ],
            'mission' => (object)[
                'unread_count' => 0,
            ],
            'news' => (object)[
                'unread_count' => 0,
            ],
            'message' => (object)[
                'unread_count' => 0,
            ],
        ];

        return $this->json($updates);
    }
}
