<?php
/**
 * Holds the community pages.
 */

namespace Miiverse\Pages\CTR;

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

        $communities['newest'] = [
            'titles' => DB::table('communities')
                            ->whereIn('type', [0, 1, 2])
                            ->whereIn('platform', $mappings)
                            ->latest('created')
                            ->limit(10)
                            ->get(['id', 'title_id', 'name', 'icon', 'platform']),
            'more'   => false,
        ];

        $more = DB::table('communities')
                    ->where('type', [0, 1, 2])
                    ->whereIn('platform', $mappings)
                    ->latest('created')
                    ->count();

        if ($more > 10) {
            $communities['newest']['more'] = true;
        }

        // This creates the case of global communities for special types
        $mappings = array_merge($mappings, [0]);

        $communities['special'] = [
            'titles' => DB::table('communities')
                            ->where('type', 3)
                            ->whereIn('platform', $mappings)
                            ->latest('created')
                            ->limit(10)
                            ->get(['id', 'title_id', 'name', 'icon', 'platform']),
            'more'   => false,
        ];

        $more = DB::table('communities')
                    ->where('type', 3)
                    ->whereIn('platform', $mappings)
                    ->latest('created')
                    ->count();

        if ($more > 10) {
            $communities['special']['more'] = true;
        }

        return view('community/index', compact('console', 'communities'));
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
            default:
                return view('errors/404');
                break;
        }

        $console['filter'] = 'All Software';

        $communities = DB::table('communities')
                        ->whereIn('type', [0, 1, 2])
                        ->whereIn('platform', $mappings)
                        ->latest('created')
                        ->get(['id', 'title_id', 'name', 'icon', 'platform']);

        $console['count'] = DB::table('communities')
                                ->whereIn('type', [0, 1, 2])
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
