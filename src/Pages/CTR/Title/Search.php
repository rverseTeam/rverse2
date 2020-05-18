<?php
/**
 * Holds the search page results.
 */

namespace Miiverse\Pages\CTR\Title;

use Miiverse\CurrentSession;
use Miiverse\DB;
use Miiverse\User;

/**
 * Community page for titles.
 *
 * @author RverseTeam
 */
class Search extends Page
{
    /**
     * The search results
     *
     * @return string
     */
    public function search() : string
    {
        $search = DB::table('communities')
            ->where('name', $_GET['query'])
            ->orWhere('name', 'like', '%' . $_GET['query'] . '%')
            ->limit(10)
            ->get();

        return view('titles/search', compact('search'));
    }
}
