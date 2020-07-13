<?php
/**
 * Holds the profile page.
 */

namespace Miiverse\Pages\CTR;

use Miiverse\CurrentSession;
use Miiverse\DB;
use Miiverse\User as Profile;

/**
 * Profile page.
 *
 * @author Repflez
 */
class User extends Page
{
    /**
     * Serves the profile index.
     *
     * @return string
     */
    public function profile(string $name) : string
    {
        $profile = Profile::construct(urldecode($name));

        if (!$profile || $profile->id === 0) {
            return view('errors/404');
        }

        $follower = $profile->isFollower(CurrentSession::$user->id);

        $favorites = DB::table('favorites')
                            ->leftJoin('communities', 'communities.id', '=', 'favorites.community_id')
                            ->where('favorites.user_id', $profile->id)
                            ->limit(6)
                            ->orderBy('favorites.added_at', 'desc')
                            ->get(['communities.id', 'communities.title_id', 'communities.icon', 'communities.platform']);

        return view('user/profile', compact('profile', 'follower', 'favorites'));
    }

    /**
     * Follows a user.
     *
     * @return string
     */
    public function follow(string $name) : string
    {
        $profile = Profile::construct(urldecode($name));

        header('Content-Type: application/json; charset=utf-8');
        if ($profile->addFollower(CurrentSession::$user->id)) {
            return '{"success":1}';
        } else {
            return '{"success":0}';
        }

        return '{"success":0}';
    }

    /**
     * Unfollows a user.
     *
     * @return string
     */
    public function unfollow(string $name) : string
    {
        $profile = Profile::construct(urldecode($name));

        header('Content-Type: application/json; charset=utf-8');
        if ($profile->removeFollower(CurrentSession::$user->id)) {
            return '{"success":1}';
        } else {
            return '{"success":0}';
        }

        return '{"success":0}';
    }
}
