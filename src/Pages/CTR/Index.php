<?php
/**
 * Holds the home page.
 */

namespace Miiverse\Pages\CTR;

use Miiverse\DB;
use Miiverse\User;
use Miiverse\Helpers\ConsoleAuth;

use Carbon\Carbon;
use Miiverse\CurrentSession;

/**
 * Home page.
 *
 * @author Repflez
 */
class Index extends Page
{
    /**
     * Serves the site index.
     *
     * @return string
     */
    public function index() : string
    {
        $posts = [];

        if (ConsoleAuth::$paramPack['in_activity_feed']) {
            $verified_ranks = [
                config('rank.verified'),
                config('rank.mod'),
                config('rank.admin'),
            ];
            $posts_pre = DB::table('posts')
                        ->where([
                            ['community', 299],
                            ['is_redesign', 0]
                        ])
                        ->whereRaw('created > CURDATE() - INTERVAL 1 WEEK')
                        ->orderBy('empathies', 'desc')
                        ->limit(20)
                        ->offset(0 * 20)
                        ->get();

            foreach ($posts_pre as $post) {
                $user = User::construct($post->user_id);
                $latest_comment = [];
                
                if (intval($post->comments) > 0) {
                    // Get latest comment if there's at least one of them
                    $commenter = DB::table('comments')
                                ->where('post', $post->id)
                                ->where('spoiler', 0)
                                ->whereNull('deleted')
                                ->orderBy('created', 'desc')
                                ->first();
                
                    if ($commenter) {
                        $commenter_user = User::construct($commenter->user);
                
                        $latest_comment = [
                            'user'          => $commenter_user,
                            'feeling'       => intval($commenter->feeling),
                            'created'       => Carbon::createFromTimeString($commenter->created)->diffForHumans(),
                            'content'       => $commenter->content,
                            'spoiler'       => $commenter->spoiler,
                            'image'         => $commenter->image,
                            'verified'      => $commenter_user->hasRanks($verified_ranks),
                            'screenshot'    => $commenter->screenshot,
                        ];
                    }
                }
                
                $posts[] = [
                    'post_id'           => $post->id,
                    'has_community'     => true,
                    'community_id'         => 299,
                    'title_id'          => 1,
                    'community_icon' => '',
                    'community_name' => 'activity feed test',
                    'op'                => $user,
                    'can_yeah'          => $user->id !== CurrentSession::$user->id,
                    'created'           => Carbon::createFromTimeString($post->created)->diffForHumans(),
                    'content'           => $post->content,
                    'image'             => $post->image,
                    'feeling'           => intval($post->feeling),
                    'spoiler'           => $post->spoiler,
                    'comments'          => intval($post->comments),
                    'empathies'         => intval($post->empathies),
                    'liked'             => DB::table('empathies')
                                                ->where([
                                                    ['type', 0], // Posts are type 0
                                                    ['id', $post->id],
                                                    ['user', CurrentSession::$user->id],
                                                ])
                                                ->exists(),
                    'verified'          => $user->hasRanks($verified_ranks),
                    'screenshot'        => $post->screenshot,
                    'latest_comment'    => $latest_comment,
                ];
            }
                
            // Finish the activity feed deal
            ConsoleAuth::updateSession('in_activity_feed', false);

            return view('index/index', compact('posts'));
        } else {
            // Set our status as in the activity feed
            ConsoleAuth::updateSession('in_activity_feed', true);

            return view('index/index', compact('posts'));
        }
    }

    public function activityFeed() : string {
        return "a";
    }
}
