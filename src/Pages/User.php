<?php

/**
 * Holds the profile page.
 */

namespace Miiverse\Pages;

use Carbon\Carbon;

use Miiverse\Community\Community;
use Miiverse\CurrentSession;
use Miiverse\DB;
use Miiverse\User as Profile;

/**
 * Profile page.
 *
 * @author RverseTeam
 */
class User extends Page
{
    /**
     * Serves the profile index.
     *
     * @return string
     */
    public function profile(string $name): string
    {
        $verified_ranks = [
            config('rank.verified'),
            config('rank.mod'),
            config('rank.admin'),
        ];

        $profile = Profile::construct(urldecode($name));

        if (!$profile || $profile->id === 0) {
            return view('errors/404');
        }

        $follower = $profile->isFollower(CurrentSession::$user->id);

        if ($profile->hasRanks($verified_ranks)) {
            if (empty($profile->title)) {
                $profile->title = $profile->mainRank->name();
            }
        }

        $favorites = array_map(function ($title) {
            return new Community($title);
        }, DB::table('favorites')
            ->leftJoin('communities', 'communities.id', '=', 'favorites.community_id')
            ->where('favorites.user_id', $profile->id)
            ->limit(6)
            ->orderBy('favorites.added_at', 'desc')
            ->pluck('communities.id')->toArray());

        return view('user/profile', compact('profile', 'follower', 'favorites'));
    }
}