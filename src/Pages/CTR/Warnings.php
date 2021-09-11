<?php
/**
 * Holds the warnings pages.
 */

namespace Miiverse\Pages\CTR;

/**
 * Warning pages.
 *
 * @author Repflez
 */
class Warnings extends Page
{
    public function deviceBan() : string
    {
        return view('errors/banned');
    }
}