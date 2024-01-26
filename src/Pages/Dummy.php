<?php
/**
 * Holds a dummy page.
 */

namespace Miiverse\Pages;

/**
 * Dummy page.
 *
 * @author RverseTeam
 */
class Dummy extends Page
{
    /**
     * Serves an empty page, in case it's needed.
     *
     * @return string
     */
    public function dummy() : string
    {
        return '';
    }
}
