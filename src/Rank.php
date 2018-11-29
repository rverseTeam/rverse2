<?php
/**
 * Holds the rank object class.
 */

namespace Miiverse;

/**
 * Serves Rank data.
 *
 * @author Repflez
 */
class Rank
{
    /**
     * ID of the rank.
     *
     * @var int
     */
    public $id = 0;

    /**
     * Name of the rank.
     *
     * @var string
     */
    public $name = 'Rank';

    /**
     * Global hierarchy of the rank.
     *
     * @var int
     */
    public $hierarchy = 0;

    /**
     * Text that should be append to the name to make it address multiple.
     *
     * @var string
     */
    public $multiple = '';

    /**
     * Description of the rank.
     *
     * @var string
     */
    public $description = '';

    /**
     * User title of the rank.
     *
     * @var string
     */
    public $title = '';

    /**
     * Indicates if this rank should be hidden.
     *
     * @var bool
     */
    public $hidden = true;

    /**
     * Instance cache container.
     *
     * @var array
     */
    protected static $rankCache = [];

    /**
     * Cached constructor.
     *
     * @param int  $rid
     * @param bool $forceRefresh
     *
     * @return Rank
     */
    public static function construct(int $rid, bool $forceRefresh = false) : self
    {
        // Check if a rank object isn't present in cache
        if ($forceRefresh || !array_key_exists($rid, self::$rankCache)) {
            // If not create a new object and cache it
            self::$rankCache[$rid] = new self($rid);
        }

        // Return the cached object
        return self::$rankCache[$rid];
    }

    /**
     * Constructor.
     *
     * @param int $rankId
     */
    private function __construct(int $rankId)
    {
        // Get the rank database row
        $rankRow = DB::table('ranks')
            ->where('rank_id', $rankId)
            ->first();

        // Check if the rank actually exists
        if ($rankRow) {
            $this->id = $rankRow->rank_id;
            $this->name = $rankRow->rank_name;
            $this->hierarchy = $rankRow->rank_hierarchy;
            $this->multiple = $rankRow->rank_multiple;
            $this->hidden = (bool) $rankRow->rank_hidden;
            $this->description = $rankRow->rank_description;
            $this->title = $rankRow->rank_title;
        }
    }

    /**
     * Get the name of the rank.
     *
     * @param bool $multi
     *
     * @return string
     */
    public function name(bool $multi = false) : string
    {
        return $this->name.($multi ? $this->multiple : null);
    }

    /**
     * Returns all users that are part of this rank.
     *
     * @param bool $justIds
     *
     * @return array
     */
    public function users(bool $justIds = false) : array
    {
        // Fetch all users part of this rank
        $get = DB::table('user_ranks')
            ->where('rank_id', $this->id)
            ->orderBy('user_id')
            ->get(['user_id']);

        // Filter the user ids into one array
        $userIds = array_column($get, 'user_id');

        // Just return that if we were asked for just the ids
        if ($justIds) {
            return $userIds;
        }

        // Create the storage array
        $users = [];

        // Create User objects and store
        foreach ($userIds as $id) {
            $users[$id] = User::construct($id);
        }

        // Return the array
        return $users;
    }
}
