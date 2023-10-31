<?php
/**
 * Holds the community pages.
 */

namespace Miiverse\Pages\CTR;

use Miiverse\Community\Community as CommunityMeta;
use Miiverse\CurrentSession;
use Miiverse\DB;
use Miiverse\Helpers\ConsoleAuth;

/**
 * Community page.
 *
 * @author Repflez
 */
class Community extends Page
{
    /**
     * Community index.
     *
     * @return string
     */
    public function index() : string
    {
        // Check current console, and redirect to the currect index page
        switch (ConsoleAuth::$paramPack['platform_id']) {
            case 0:
                return redirect(route('console.index', ['3ds']));
                break;
            case 1:
                return redirect(route('console.index', ['wiiu']));
                break;
            default:
                return view('errors/404');
                break;
        }
    }

    /**
     * Console index.
     *
     * @var string
     *
     * @return string
     */
    public function consoleIndex(string $page) : string
    {

        // Far simplier than a massice switch/case.
        $console = [
            'id' => $page,
            'name' => match ($page) {
                '3ds' => '3DS',
                'wiiu' => 'Wii U',
                'switch' => 'Switch',
                'wii' => 'Wii',
                'ds' => 'DS',
                default => 'Unknown',
            }
        ];

        $categories_meta = DB::table('community_categories')
            ->orderBy('order')
            ->get();

        $categories = [];

        foreach ($categories_meta as $category) {
            // Name handler
            $name = match ($category->name) {
                '#new' => __('community.index.communities.new'),
                '#special' => __('community.index.communities.special'),
                '#supporter' => __('community.index.communities.supporter'),
                default => $category->name,
            };

            // CSS class handler
            $class = match ($category->class) {
                '#console' => $page,
                default => $category->class,
            };

            $titles_temp = DB::table('communities')
                ->whereRaw("FIND_IN_SET(?, `platforms`) > 0", $class)
                ->latest('created')
                ->limit(15)
                ->get(['id']);

            $titles = [];

            foreach ($titles_temp as $title) {
                $meta = new CommunityMeta(intval($title->id));

                $titles[] = [
                    'id' => $meta->id,
                    'icon' => $meta->icon,
                    'title_id' => $meta->getLocalTitleId(),
                    'name' => $meta->name,
                    'plarform_tag' => 'wiiu-3ds',
                    'platform_text' => 'Hatsune Miku',
                ];

                if (count($titles) > 10) break;
            }

            $categories[] = [
                'name' => $name,
                'class' => "headline-$class",
                'has_filter' => boolval($category->has_filter),
                'has_more' => count($titles_temp) > 10,
                'more_slug' => $class,
                'titles' => $titles,
            ];
        }

        return view('community/index', compact('console', 'categories'));
    }

    /**
     * Full console title index.
     *
     * @var string
     *
     * @return string
     */
    public function consoleEverything(string $page) : string
    {
        $mappings = [];
        $console = [];
        $communities = [];

        switch ($page) {
            case 'switch':
                $console = [
                    'id'   => $page,
                    'name' => 'Switch',
                ];
                $mappings = [4, 5];
                break;
            case '3ds':
                $console = [
                    'id'   => $page,
                    'name' => '3DS',
                ];
                $mappings = [1, 3];
                break;
            case 'wiiu':
                $console = [
                    'id'   => $page,
                    'name' => 'Wii U',
                ];
                $mappings = [2, 3, 5];
                break;
            case 'wii':
                $console = [
                    'id'   => $page,
                    'name' => 'Wii',
                ];
                $mappings = [6, 8];
                break;
            case 'ds':
                $console = [
                    'id'   => $page,
                    'name' => 'DS',
                ];
                $mappings = [7, 8];
                break;
            case 'special':
                $console = [
                    'id' => $page,
                    'name' => 'Special'
                ];
                $mappings = [0];
                break;
            default:
                return view('errors/404');
                break;
        }

        $console['filter'] = 'All Software';

        $communities = DB::table('communities')
                        ->whereIn('type', [0, 1, 2, 3])
                        ->whereIn('platform', $mappings)
                        ->latest('created')
                        ->get(['id', 'title_id', 'name', 'icon', 'platform']);

        $console['count'] = DB::table('communities')
                                ->whereIn('type', [0, 1, 2, 3])
                                ->whereIn('platform', $mappings)
                                ->count();

        return view('community/listing', compact('console', 'communities'));
    }

    /**
     * Exclusive console title index.
     *
     * @var string
     *
     * @return string
     */
    public function consoleGames(string $page) : string
    {
        $mappings = [];
        $console = [];
        $communities = [];

        switch ($page) {
            case 'switch':
                $console = [
                    'id'   => $page,
                    'name' => 'Switch',
                ];
                $mappings = [4, 5];
                break;
            case '3ds':
                $console = [
                    'id'   => $page,
                    'name' => '3DS',
                ];
                $mappings = [1, 3];
                break;
            case 'wiiu':
                $console = [
                    'id'   => $page,
                    'name' => 'Wii U',
                ];
                $mappings = [2, 3, 5];
                break;
            case 'wii':
                $console = [
                    'id'   => $page,
                    'name' => 'Wii',
                ];
                $mappings = [6, 8];
                break;
            case 'ds':
                $console = [
                    'id'   => $page,
                    'name' => 'DS',
                ];
                $mappings = [7, 8];
                break;
            default:
                return view('errors/404');
                break;
        }

        $console['filter'] = $console['name'].' Games';

        $communities = DB::table('communities')
                        ->where('type', 0)
                        ->whereIn('platform', $mappings)
                        ->latest('created')
                        ->get(['id', 'title_id', 'name', 'icon', 'platform']);

        $console['count'] = DB::table('communities')
                                ->where('type', 0)
                                ->whereIn('platform', $mappings)
                                ->count();

        return view('community/listing', compact('console', 'communities'));
    }

    /**
     * Virtual console title index.
     *
     * @var string
     *
     * @return string
     */
    public function consoleVirtualConsole(string $page) : string
    {
        $mappings = [];
        $console = [];
        $communities = [];

        switch ($page) {
            case 'switch':
                $console = [
                    'id'   => $page,
                    'name' => 'Switch',
                ];
                $mappings = [4, 5];
                break;
            case '3ds':
                $console = [
                    'id'   => $page,
                    'name' => '3DS',
                ];
                $mappings = [1, 3];
                break;
            case 'wiiu':
                $console = [
                    'id'   => $page,
                    'name' => 'Wii U',
                ];
                $mappings = [2, 3, 5];
                break;
            case 'wii':
                $console = [
                    'id'   => $page,
                    'name' => 'Wii',
                ];
                $mappings = [6, 8];
                break;
            case 'ds':
                $console = [
                    'id'   => $page,
                    'name' => 'DS',
                ];
                $mappings = [7, 8];
                break;
            default:
                return view('errors/404');
                break;
        }

        $console['filter'] = 'Virtual Console';

        $communities = DB::table('communities')
                        ->where('type', 1)
                        ->whereIn('platform', $mappings)
                        ->latest('created')
                        ->get(['id', 'title_id', 'name', 'icon', 'platform']);

        $console['count'] = DB::table('communities')
                                ->where('type', 1)
                                ->whereIn('platform', $mappings)
                                ->count();

        return view('community/listing', compact('console', 'communities'));
    }

    /**
     * Others title index.
     *
     * @var string
     *
     * @return string
     */
    public function consoleOther(string $page) : string
    {
        $mappings = [];
        $console = [];
        $communities = [];

        switch ($page) {
            case 'switch':
                $console = [
                    'id'   => $page,
                    'name' => 'Switch',
                ];
                $mappings = [4, 5];
                break;
            case '3ds':
                $console = [
                    'id'   => $page,
                    'name' => '3DS',
                ];
                $mappings = [1, 3];
                break;
            case 'wiiu':
                $console = [
                    'id'   => $page,
                    'name' => 'Wii U',
                ];
                $mappings = [2, 3, 5];
                break;
            case 'wii':
                $console = [
                    'id'   => $page,
                    'name' => 'Wii',
                ];
                $mappings = [6, 8];
                break;
            case 'ds':
                $console = [
                    'id'   => $page,
                    'name' => 'DS',
                ];
                $mappings = [7, 8];
                break;
            default:
                return view('errors/404');
                break;
        }

        $console['filter'] = 'Others';

        $communities = DB::table('communities')
                        ->where('type', 2)
                        ->whereIn('platform', $mappings)
                        ->latest('created')
                        ->get(['id', 'title_id', 'name', 'icon', 'platform']);

        $console['count'] = DB::table('communities')
                                ->where('type', 2)
                                ->whereIn('platform', $mappings)
                                ->count();

        return view('community/listing', compact('console', 'communities'));
    }

    /**
     * Favorites page.
     *
     * @var string
     *
     * @return string
     */

    public function favorites() : string
    {
        $favorites = DB::table('favorites')
                        ->leftJoin('communities', 'favorites.community_id', '=', 'communities.id')
                        ->where('favorites.user_id', CurrentSession::$user->id)
                        ->orderBy('favorites.added_at', 'desc')
                        ->select(
                            'communities.id', 'communities.title_id', 'communities.platform',
                            'communities.icon', 'communities.name'
                        )
                        ->get();

        return view('community/favorites', compact('favorites'));
    }
}
