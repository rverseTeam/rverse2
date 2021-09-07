<?php
/**
 * Holds the migration command controller.
 */

namespace Miiverse\Console\Command;

use Illuminate\Database\Migrations\Migrator;
use Illuminate\Filesystem\Filesystem;
use Miiverse\DB;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Brings the database up to speed with the ones in the database folder.
 *
 * @author Repflez
 */
class DatabaseMigrateCommand extends Command
{
    /**
     * The database migrations directory.
     */
    private const MIGRATIONS = 'database/';

    /**
     * Set up the command metadata.
     */
    protected function configure() : void
    {
        $this->setName('db:migrate')
            ->setDescription('Run the database migrations.')
            ->setHelp('This command runs the database migrations for foxverse. To be run after any database change.');
    }

    /**
     * Does the migrating.
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $repository = DB::getMigrationRepository();
        $migrator = new Migrator($repository, $repository->getConnectionResolver(), new Filesystem());
        $migrator->setOutput($output);

        if (!$migrator->repositoryExists()) {
            $output->writeln("Run 'db:install' first!");

            return Command::FAILURE;
        }

        $migrator->run(path(self::MIGRATIONS));

        return Command::SUCCESS;
    }
}
