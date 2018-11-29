<?php
/**
 * Holds the permission handler.
 */

namespace Miiverse;

use Illuminate\Database\Query\Builder;

/**
 * Inheritable permission handler.
 *
 * @author Repflez
 */
class PermissionHandler
{
    public const TABLE = '';

    public $user = 0;
    public $ranks = [];
    public $additionalRequirements = [];
    private $permCache = [];
    private $validCache = [];

    public function __construct(User $user)
    {
        $this->user = $user->id;
        $this->ranks = array_keys($user->ranks);
    }

    public function __get(string $name) : bool
    {
        return $this->check($name);
    }

    public function __isset(string $name) : bool
    {
        return $this->valid($name);
    }

    public function valid(string $name) : bool
    {
        if (!array_key_exists($name, $this->validCache)) {
            $column = 'perm_'.camel_to_snake($name);
            $this->validCache[$name] = DB::getSchemaBuilder()->hasColumn(static::TABLE, $column);
        }

        return $this->validCache[$name];
    }

    public function check(string $name) : bool
    {
        if (!array_key_exists($name, $this->permCache)) {
            $column = 'perm_'.camel_to_snake($name);

            $add_reqs = $this->additionalRequirements;

            $result = DB::table(static::TABLE)
                ->where(function (Builder $query) {
                    $query->whereIn('rank_id', $this->ranks)
                        ->orWhere('user_id', $this->user);
                })
                ->where(function (Builder $query) use ($add_reqs) {
                    if (isset($add_reqs['where'])) {
                        foreach ($add_reqs['where'] as $col => $val) {
                            $query->where($col, $val);
                        }
                    }

                    if (isset($add_reqs['where_in'])) {
                        foreach ($add_reqs['where_in'] as $col => $val) {
                            $query->whereIn($col, $val);
                        }
                    }
                })
                ->whereNotNull($column)
                ->groupBy($column)
                ->min($column);

            $this->permCache[$name] = intval($result) === 1;
        }

        return $this->permCache[$name];
    }
}
