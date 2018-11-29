<?php
/**
 * Holds the community for a specific title.
 */

namespace Miiverse\Pages\Title;

use Miiverse\CurrentSession;
use Miiverse\DB;
use Miiverse\User;

/**
 * Community page for titles.
 *
 * @author Repflez
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
            $topicCategories = DB::table('topic_categories')
                                ->where('bundle_id', $meta->topic_bundle)
                                ->get();

            if (!$topicCategories) {
                return view('errors/404');
            }

            $drawings_pre = DB::table('posts')
                        ->where([
                            ['community', $community],
                            ['content', null],
                            ['is_redesign', 1],
                        ])
                        ->orderBy('created', 'desc')
                        ->limit(6)
                        ->get();

            foreach ($drawings_pre as $drawing) {
                $user = User::construct($drawing->user_id);

                $drawings[] = [
                    'id'       => hashid($drawing->id),
                    'user'     => $user,
                    'created'  => $drawing->created,
                    'image'    => $drawing->image,
                    'feeling'  => intval($drawing->feeling),
                    'spoiler'  => $drawing->spoiler,
                ];
            }

            $discussions_pre = DB::table('posts')
                                ->where([
                                    ['community', $community],
                                    ['image', null],
                                    ['is_redesign', 1],
                                ])
                                ->orderBy('created', 'desc')
                                ->limit(5)
                                ->get();

            foreach ($discussions_pre as $discussion) {
                $user = User::construct($discussion->user_id);

                $discussions[] = [
                    'id'           => hashid($discussion->id),
                    'user'         => $user,
                    'title'        => $discussion->title,
                    'created'      => $discussion->created,
                    'content'      => $discussion->content,
                    'feeling'      => intval($discussion->feeling),
                    'spoiler'      => $discussion->spoiler,
                    'comments'     => intval($discussion->comments),
                    'categoryName' => DB::table('topic_categories')
                                    ->where('id', $discussion->category_id)
                                    ->value('name'),
                    'open'         => intval($discussion->is_open),
                    'likes'        => intval($discussion->empathies),
                    'liked'        => (bool) DB::table('empathies')
                                            ->where([
                                                ['type', 0], // Posts are type 0
                                                ['id', $discussion->id],
                                                ['user', CurrentSession::$user->id],
                                            ])
                                            ->count(),
                ];
            }

            // WTF LARAVEL?
            if ($discussions == null) {
                $discussions = null;
            }
            if ($drawings == null) {
                $drawings = null;
            }

            $feeling = ['normal', 'happy', 'like', 'surprised', 'frustrated', 'puzzled'];

            return view('titles/view_redesign', compact('meta', 'topicCategories', 'drawings', 'discussions', 'feeling'));
        } else {
            $posts_pre = DB::table('posts')
                        ->where([
                            ['community', $community],
                            ['is_redesign', 0],
                        ])
                        ->orderBy('created', 'desc')
                        ->limit(10)
                        ->get();

            foreach ($posts_pre as $post) {
                $user = User::construct($post->user_id);

                $posts[] = [
                    'id'       => hashid($post->id),
                    'user'     => $user,
                    'created'  => $post->created,
                    'content'  => $post->content,
                    'image'    => $post->image,
                    'feeling'  => intval($post->feeling),
                    'spoiler'  => $post->spoiler,
                    'comments' => intval($post->comments),
                    'likes'    => intval($post->empathies),
                    'liked'    => (bool) DB::table('empathies')
                                        ->where([
                                            ['type', 0], // Posts are type 0
                                            ['id', $post->id],
                                            ['user', CurrentSession::$user->id],
                                        ])
                                        ->count(),
                    'verified' => $user->hasRanks($verified_ranks),
                ];
            }

            $feeling = ['normal', 'happy', 'like', 'surprised', 'frustrated', 'puzzled'];
            $feelingText = ['Yeah!', 'Yeah!', 'Yeah♥', 'Yeah!?', 'Yeah...', 'Yeah...'];

            return view('titles/view', compact('meta', 'posts', 'feeling', 'feelingText'));
        }
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
}
