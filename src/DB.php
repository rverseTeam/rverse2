<?php
/**
 * Holds the alias class for the Illuminate database thing.
 */

namespace Miiverse;

use Illuminate\Database\Capsule\Manager;
use Illuminate\Database\ConnectionResolver;
use Illuminate\Database\Migrations\DatabaseMigrationRepository;
use Illuminate\Database\Schema\Builder;

/**
 * The Illuminate (Laravel) database wrapper.
 *
 * @author Repflez
 */
class DB extends Manager
{
    /**
     * Start the database module.
     *
     * @param array $details
     */
    public static function connect(array $details) : void
    {
        $capsule = new static();
        $capsule->addConnection($details);
        $capsule->setAsGlobal();
    }

    /**
     * Gets the migration repository (surprise surprise).
     *
     * @return DatabaseMigrationRepository
     */
    public static function getMigrationRepository() : DatabaseMigrationRepository
    {
        $resolver = new ConnectionResolver(['database' => self::connection()]);
        $repository = new DatabaseMigrationRepository($resolver, 'migrations');
        $repository->setSource('database');

        return $repository;
    }

    /**
     * Get the migration schema builder.
     *
     * @return Builder
     */
    public static function getSchemaBuilder() : Builder
    {
        return self::connection()->getSchemaBuilder();
    }
}
