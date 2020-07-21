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

    /**
     * Shows a user's post listing
     */
    public function postListing(string $name) : string
    {
        $profile = Profile::construct(urldecode($name));

        $feeling = ['normal', 'happy', 'like', 'surprised', 'frustrated', 'puzzled'];
        $posts = [];

        // Precache if the user can yeah the posts here
        $can_yeah = $profile->id !== CurrentSession::$user->id;

        // This is needed because of style
        $post_fields = [
            // Community
            'communities.id as community_id', 'communities.title_id', 'communities.icon as community_icon',
            'communities.name as community_name',

            // Post
            'posts.id as post_id', 'posts.created', 'posts.content', 'posts.image',
            'posts.feeling', 'posts.spoiler', 'posts.comments', 'posts.empathies',
        ];

        $posts_pre = DB::table('posts')
                    ->leftJoin('communities', 'posts.community', '=', 'communities.id')
                    ->where('posts.user_id', $profile->id)
                    ->limit(15)
                    ->orderBy('posts.created', 'desc')
                    ->get($post_fields);

        foreach ($posts_pre as $post) {
            $post->mii = DB::table('mii_mappings')
                            ->where([
                                ['user_id', $profile->id]
                            ])
                            ->value($feeling[$post->feeling]);

            // Set the variable for having an external community
            $post->has_community = true;

            // Disable Yeahs if its their own posts
            $post->can_yeah = $can_yeah;

            // Set OP data for the post
            $post->op = $profile;

            $posts[] = $post;
        }

        return view('user/posts', compact('profile', 'posts'));
    }

    /**
     * Shows the user menu
     *
     * @return string
     */
    public function myMenu() : string
    {
        return view('user/menu');
    }
}
