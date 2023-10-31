<?php
/**
 * Holds the community object class.
 */

namespace Miiverse\Community;

use Miiverse\DB;
use Miiverse\Helpers\ConsoleAuth;

/**
 * Used to serve communities.
 *
 * @author RverseTeam
 */
class Community
{
    /**
     * The ID of the community.
     *
     * @var int
     */
    public $id = 0;

    /**
     * The title IDs of the community.
     *
     * @var array[array[string]]
     */
    public $title_ids = [];

    /**
     * The default title ID for the community.
     * 
     * @var string
     */
    public $default_title_id = '0000000000000000';

    /**
     * The name of the community.
     *
     * @var string
     */
    public $name = 'Community';

    /**
     * The description of the community.
     *
     * @var string
     */
    public $description = '';

    /**
     * The icon of the community.
     *
     * @var string
     */
    public $icon = '';

    /**
     * The banner of the community.
     *
     * @var string
     */
    public $banner = '';

    /**
     * The creation date of the community.
     *
     * @var string
     */
    public $created = '';

    /**
     * Constructor.
     *
     * @param int $communityId
     *
     * @return Community
     */
    public function __construct(int $communityId = 0)
    {
        // Get the row from the database
        $communityRow = DB::table('communities')
            ->where('id', $communityId)
            ->select()
            ->addSelect(DB::raw('`default_region`+0 AS `default_region_bitmask`'))
            ->addSelect(DB::raw('`default_platform`-1 AS `default_platform_ord`'))
            ->first();

        // Populate the variables
        if ($communityRow) {
            $this->id = intval($communityRow->id);
            $this->name = $communityRow->name;
            $this->description = $communityRow->description;
            $this->icon = '/img/icons/'.$communityRow->icon;
            $this->banner = '/img/banners/'.$communityRow->banner;
            $this->created = $communityRow->created;

            // Fetch all title ids to filter later
            $title_ids = DB::table('community_title_ids')
                ->where('community_id', $this->id)
                ->select('title_id', 'console', 'region')
                // Cast the region to int for the bitmask
                // https://dev.mysql.com/doc/refman/8.0/en/set.html
                ->addSelect(DB::raw('`region`+0 AS `region_bitmask`'))
                ->addSelect(DB::raw('`console`-1 AS `console_ord`'))
                ->get()->toArray();

            // Calculate default title_id
            $default_title_id = array_pop(array_filter($title_ids, function($title) use ($communityRow) {
                $default_console = $title->console_ord == $communityRow->default_platform_ord;
                $default_region = ($title->region_bitmask & $communityRow->default_region_bitmask) & $communityRow->default_region_bitmask;
                return $default_console && $default_region;
            }));

            // Set the default title id
            if ($default_title_id) {
                $this->default_title_id = $default_title_id->title_id;
            } else {
                // Invalid default title_id to ensure we do have at least a default title id
                $this->default_title_id = '0000000000000000';
            }

            // And now populate the title ids for each region
            for ($i=0; $i < 2; $i++) {
                $platform_title_ids = [];
                $current_platform_title_ids = array_filter($title_ids, function ($title) use ($i) {
                    return $title->console_ord === $i;
                });

                // Get the appropriate title id for each region
                for ($j=0; $j < 7; $j++) {
                    $region = 1 << $j;
                    $title_id = '';

                    $regional_title_id = array_pop(array_filter($current_platform_title_ids, function ($title) use ($region) {
                        return ($title->region_bitmask & $region) == $region;
                    }));

                    if ($regional_title_id) {
                        $title_id = $regional_title_id->title_id;
                    } else {
                        $title_id = $this->default_title_id;
                    }

                    $platform_title_ids[] = $title_id;
                }

                $this->title_ids[$i] = $platform_title_ids;
            }
        } elseif ($communityId !== 0) {
            $this->id = -1;
        }
    }

    /**
     * Get the title ID for the region and platform the user is logged in currently
     * 
     * @return string The title ID for the local user
     */
    public function getLocalTitleId() : string {
        $current_platform = ConsoleAuth::$paramPack['platform_id'];
        $current_region = getBit(ConsoleAuth::$paramPack['region_id']);
        
        return $this->title_ids[$current_platform][$current_region];
    }
}
