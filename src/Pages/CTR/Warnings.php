<?php
/**
 * Holds the warnings pages.
 */

namespace Miiverse\Pages\CTR;

/**
 * Warning pages.
 *
 * @author RverseTeam
 */
class Warnings extends Page
{
    public function deviceBan() : string
    {
        return view('errors/banned');
    }

    public function pretendoNetwork() : string
    {
        return view('errors/pretendo');
    }
}