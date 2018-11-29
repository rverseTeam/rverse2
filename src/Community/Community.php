<?php
/**
 * Holds the community object class.
 */

namespace Miiverse\Community;

use Miiverse\DB;
use stdClass;

/**
 * Used to serve communities.
 *
 * @author Repflez
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
     * The title ID of the community.
     *
     * @var int
     */
    public $titleID = 0;

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
     * The ID of the parent community.
     *
     * @var int
     */
    public $category = 0;

    /**
     * The type of community.
     *
     * @var int
     */
    public $type = 0;

    /**
     * The creation date of the community.
     *
     * @var string
     */
    public $created = '';

    /**
     * The platform of the community.
     *
     * @var int
     */
    public $platform = 0;

    /**
     * Holds the permission handler.
     *
     * @var mixed
     */
    public $perms;

    /**
     * Is this a redesigned community?
     *
     * @var bool
     */
    public $redesigned = false;

    /**
     * The topic bundle of the community.
     */
    public $topicBundle;

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
            ->first();

        // Populate the variables
        if ($communityRow) {
            $this->id = intval($communityRow->id);
            $this->titleID = intval($communityRow->title_id);
            $this->name = $communityRow->name;
            $this->description = $communityRow->description;
            $this->icon = '/img/icons/'.$communityRow->icon;
            $this->banner = '/img/banners/'.$communityRow->banner;
            $this->category = intval($communityRow->category);
            $this->type = intval($communityRow->type);
            $this->created = $communityRow->created;
            $this->platform = intval($communityRow->platform);
            $this->redesigned = intval($communityRow->is_redesign);

            // Set up individual permissions
            // TODO: Abstract this into a table
            $perms = new stdClass();
            $perms->can_post = $communityRow->perms & 1;
            $perms->can_post_drawings = $communityRow->perms & 2;
            $perms->can_post_memos = $communityRow->perms & 4;
            $perms->can_post_threads = $communityRow->perms & 8;
            $perms->can_reply = $communityRow->perms & 16;
            $perms->can_reply_drawings = $communityRow->perms & 32;

            // Get the current topic bundle for communities
            $this->topicBundle = DB::table('topic_categories')
                                    ->where('bundle_id', $communityRow->topic_bundle)
                                    ->get();
        } elseif ($communityId !== 0) {
            $this->id = -1;
        }
    }
}
