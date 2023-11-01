<?php
/**
 * Holds the community for a specific title.
 */

namespace Miiverse\Pages\CTR\Title;

use Carbon\Carbon;

use Miiverse\Community\Community as CommunityMeta;
use Miiverse\CurrentSession;
use Miiverse\DB;
use Miiverse\User;

/**
 * Community page for titles.
 *
 * @author RverseTeam
 */
class Community extends Page
{
    /**
     * Title community index.
     *
     * @return string
     */
    public function show($tid, $id) : string
    {
        $community = dehashid($id);
        $titleId = dehashid($tid);
        $posts = [];
        $verified_ranks = [
            config('rank.verified'),
            config('rank.mod'),
            config('rank.admin'),
        ];

        $page_params = json_decode($_GET['page_param'] ?? '');
        $since = !empty($page_params->since) ? @strval($page_params->since) : date('Y-m-d H:i:s');
        $page = !empty($page_params->page) ? intval($page_params->page) : 0;

        if (!is_array($community) || !is_array($titleId)) {
            return view('errors/404');
        }

        $meta = new CommunityMeta($community[0]);

        $is_favorited = DB::table('favorites')
                            ->where('community_id', $community)
                            ->where('user_id', CurrentSession::$user->id)
                            ->select('added_at')
                            ->first();

        $is_favorited = !is_null($is_favorited);

        if (!$meta) {
            return view('errors/404');
        }

        $posts_pre = DB::table('posts')
                    ->where([
                        ['community', $community],
                        ['is_redesign', 0],
                        ['created', '<', $since]
                    ])
                    ->orderBy('created', 'desc')
                    ->limit(20)
                    ->offset($page * 20)
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
                'id'                => 0,
                'post_id'           => $post->id,
                'has_community'     => false,
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

        $feeling = ['normal', 'happy', 'like', 'surprised', 'frustrated', 'puzzled'];
        $feelingText = ['Yeah!', 'Yeah!', 'Yeah♥', 'Yeah!?', 'Yeah...', 'Yeah...'];

        // Pagination data
        $page_params = json_encode([
            'since' => $since,
            'page' => ++$page
        ]);

        return view('titles/view', compact('meta', 'posts', 'feeling', 'feelingText', 'is_favorited', 'page_params'));
    }

    /**
     * Title hot posts.
     *
     * @return string
     */
    public function hot($tid, $id) : string
    {
        $community = dehashid($id);
        $titleId = dehashid($tid);
        $posts = [];
        $verified_ranks = [
            config('rank.verified'),
            config('rank.mod'),
            config('rank.admin'),
        ];

        $page_params = json_decode($_GET['page_param'] ?? '');
        $page = !empty($page_params->page) ? intval($page_params->page) : 0;

        if (!is_array($community) || !is_array($titleId)) {
            return view('errors/404');
        }

        $meta = DB::table('communities')
                    ->where('id', $community)
                    ->first();

        $is_favorited = DB::table('favorites')
                            ->where('community_id', $community)
                            ->where('user_id', CurrentSession::$user->id)
                            ->select('added_at')
                            ->first();

        $is_favorited = !is_null($is_favorited);

        if (!$meta) {
            return view('errors/404');
        }

        $posts_pre = DB::table('posts')
                        ->where([
                            ['community', $community],
                            ['is_redesign', 0]
                        ])
                        ->whereRaw('created > CURDATE() - INTERVAL 1 WEEK')
                        ->orderBy('empathies', 'desc')
                        ->limit(20)
                        ->offset($page * 20)
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
                'has_community'     => false,
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

        // Pagination data
        $page_params = json_encode([
            'page' => ++$page
        ]);

        return view('titles/hot', compact('meta', 'posts', 'is_favorited', 'page_params'));
    }

    /**
     * Post form for communities.
     *
     * @return string
     */
    public function post($tid, $id) : string
    {
        $community = dehashid($id);
        $titleId = dehashid($tid);

        if (!is_array($community) || !is_array($titleId)) {
            return view('errors/404');
        }

        $meta = DB::table('communities')
                    ->where('id', $community)
                    ->first();

        if (!$meta) {
            return view('errors/404');
        }

        if ($meta->is_redesign) {
            return view('errors/404');
        }

        return view('titles/post', compact('meta'));
    }

    /**
     * Artwork post form for communities.
     *
     * @return string
     */
    public function artworkPost($tid, $id) : string
    {
        $community = dehashid($id);
        $titleId = dehashid($tid);

        if (!is_array($community) || !is_array($titleId)) {
            return view('errors/404');
        }

        $meta = DB::table('communities')
                    ->where('id', $community)
                    ->first();

        if (!$meta) {
            return view('errors/404');
        }

        if (!$meta->is_redesign) {
            return view('errors/404');
        }

        return view('titles/artwork_post', compact('meta'));
    }

    /**
     * Topic post form for communities.
     *
     * @return string
     */
    public function topicPost($tid, $id) : string
    {
        $community = dehashid($id);
        $titleId = dehashid($tid);

        if (!is_array($community) || !is_array($titleId)) {
            return view('errors/404');
        }

        $meta = DB::table('communities')
                    ->where('id', $community)
                    ->first();

        if (!$meta) {
            return view('errors/404');
        }

        if (!$meta->is_redesign) {
            return view('errors/404');
        }

        $topicCategories = DB::table('topic_categories')
                            ->where('bundle_id', $meta->topic_bundle)
                            ->get();

        if (!$topicCategories) {
            return view('errors/404');
        }

        return view('titles/topic_post', compact('meta', 'topicCategories'));
    }

    /**
     * Post memo form for communities.
     *
     * @return string
     */
    public function post_memo($tid, $id) : string
    {
        $community = dehashid($id);
        $titleId = dehashid($tid);

        if (!is_array($community) || !is_array($titleId)) {
            return view('errors/404');
        }

        $meta = DB::table('communities')
                    ->where('id', $community)
                    ->first();

        if (!$meta) {
            return view('errors/404');
        }

        return view('titles/post_memo', compact('meta'));
    }

    /**
     * Check if the current memo is allowed to be posted.
     *
     * @return string
     */
    public function check_memo($tid, $id) : string
    {
        $community = dehashid($id);
        $titleId = dehashid($tid);

        // Check params
        $post_type = $_GET['post_type']; // This one is always sent by the console
        $title_id = $_GET['src_title_id'] ?? 0;
        $has_screenshot = $_GET['has_screenshot'] ?? 0;
        $nex_id = $_GET['dst_nex_community_id'] ?? 0;

        // Post permissions
        $can_post = true;
        $show_community = true;

        if (!is_array($community) || !is_array($titleId)) {
            $show_community = false;
        } else {
            $meta = DB::table('communities')
                        ->where('id', $community)
                        ->first();
        }

        // Base data to send
        $data = [
            'show_community_name' => $show_community,
            'community_path'      => $meta ? route('title.community', compact('tid', 'id')) : '',
            'community_icon_url'  => $meta ? '/img/icons/'.$meta->icon : '',
            'community_name'      => $meta ? $meta->name : '',
            'can_post'            => $has_screenshot ? false : $can_post,
            'olive_community_id'  => $community[0],
            'olive_title_id'      => $title_id[0],
            'message'             => '',
        ];

        return $this->json($data);
    }

    /**
     * Add current community to favorites.
     *
     * @return string
     */
    public function favorite($tid, $id) : string
    {
        $community = dehashid($id);
        $titleId = dehashid($tid);

        DB::table('favorites')
            ->insert([
                'community_id' => $community[0],
                'user_id' => CurrentSession::$user->id,
            ]);

        DB::table('users')
            ->where('user_id', CurrentSession::$user->id)
            ->update(['favorited' => 1]);

        return 'added';
    }

    /**
     * Remmove current community to favorites.
     *
     * @return string
     */
    public function unfavorite($tid, $id) : string
    {
        $community = dehashid($id);
        $titleId = dehashid($tid);

        DB::table('favorites')
            ->where([
                ['community_id', $community[0]],
                ['user_id', CurrentSession::$user->id],
            ])
            ->delete();

        return 'removed';
    }
}
