<?php
/**
 * Holds the WiiLink Promo page.
 */

namespace Miiverse\Pages\Pub;

use Miiverse\DB;

/**
 * WiiLink promo page controller
 *
 * @author RverseTeam
 */
class WiiLink extends Page
{
    public function index() : string
    {
        // TODO: Set this on config and get user data
        $posts = DB::table('posts')
            ->where('community', 16)
            ->inRandomOrder()
            ->limit(5)
            ->get(['image']);

        return view('wiilink', compact('posts'));
    }
}
