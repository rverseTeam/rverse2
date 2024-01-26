<?php
/**
 * Holds the community pages.
 */

namespace Miiverse\Pages;

use Miiverse\Community\Community as CommunityMeta;
use Miiverse\CurrentSession;
use Miiverse\DB;
use Miiverse\Helpers\ConsoleAuth;

/**
 * Community page.
 *
 * @author RverseTeam
 */
class Community extends Page
{
    // Community types
    private const COMMUNITY_TYPE_ALL = 0;
    private const COMMUNITY_TYPE_CONSOLE = 1;
    private const COMMUNITY_TYPE_VC = 2;
    private const COMMUNITY_TYPE_OTHERS = 3;

    /**
     * Community index.
     * Instead of a redirect, we use instead the type from a url param.
     * Using a redirect breaks Wii U.
     *
     * @return string
     */
    public function index() : string
    {
        // Get community type
        $page = strval($_GET['view_platform']);
        
        // Check if it's actually set, if not, get from ParamPack
        if (empty($page)) {
            $page = match (ConsoleAuth::$paramPack['platform_id']) {
                ConsoleAuth::AUTH_CONSOLE_3DS => '3ds',
                ConsoleAuth::AUTH_CONSOLE_WIIU => 'wiiu',
                default => 'unknown'
            };
        }

        $console = $this->getConsoleArray($page);

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
                    'title_id' => $meta->getLocalTitleId(true),
                    'name' => $meta->name,
                    'plarform_tag' => $meta->getPlatformTag(),
                    'platform_text' => $meta->getPlatformText(),
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
        $console = $this->getConsoleArray($page);

        // Add filter text
        $console['filter'] = 'All Software';

        // Get communities
        $communities = $this->getCommunitiesForType($this::COMMUNITY_TYPE_ALL, $console);

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
        $console = $this->getConsoleArray($page);

        // Add filter text
        $console['filter'] = "$console[name] Games";

        // Get communities
        $communities = $this->getCommunitiesForType($this::COMMUNITY_TYPE_CONSOLE, $console);

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
        $console = $this->getConsoleArray($page);

        // Add filter text
        $console['filter'] = 'Virtual Console';

        // Get communities
        $communities = $this->getCommunitiesForType($this::COMMUNITY_TYPE_VC, $console);

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
        $console = $this->getConsoleArray($page);

        // Add filter text
        $console['filter'] = 'Others';

        // Get communities
        $communities = $this->getCommunitiesForType($this::COMMUNITY_TYPE_OTHERS, $console);

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
        // TODO: Fetch favorite communities
        $favorites = [];

        return view('community/favorites', compact('favorites'));
    }
    
    /**
     * Get the console array.
     * Used byt the rest of the class.
     * 
     * @param string $platform The platform to get the console array from
     * 
     * @return array The console array
     */
    private function getConsoleArray(string $platform) : array {
        // Far simplier than a massive switch/case
        return [
            'id' => $platform,
            'name' => match ($platform) {
                '3ds' => '3DS',
                'wiiu' => 'Wii U',
                'switch' => 'Switch',
                'wii' => 'Wii',
                'ds' => 'DS',
                default => 'Unknown',
            }
        ];
    }

    private function getCommunitiesForType(int $type, array &$console) : array {
        $console['count'] = 0;

        // TODO: do actual community fetching
        return [];
    }
}