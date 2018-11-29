<?php
/**
 * Holds the migration reset command controller.
 */

namespace Miiverse\Console\Command;

use Illuminate\Database\Migrations\Migrator;
use Illuminate\Filesystem\Filesystem;
use Miiverse\DB;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Resets the entire database.
 *
 * @author Repflez
 */
class DatabaseResetCommand extends Command
{
    /**
     * Set up the command metadata.
     */
    protected function configure() : void
    {
        $this->setName('db:reset')
            ->setDescription('Rollback all database migrations.')
            ->setHelp('This command resets all database migrations for TestVerse. Just in case the migration doesn\'t work as expected.');
    }

    /**
     * Does the resetting.
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $repository = DB::getMigrationRepository();
        $migrator = new Migrator($repository, $repository->getConnectionResolver(), new Filesystem());

        if (!$migrator->repositoryExists()) {
            $output->writeln("The migration repository doesn't exist!");

            return;
        }

        $migrator->reset();

        foreach ($migrator->getNotes() as $note) {
            $output->writeln(strip_tags($note));
        }
    }
}
