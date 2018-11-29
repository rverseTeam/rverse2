<?php
/**
 * Holds the migration rollback command controller.
 */

namespace Miiverse\Console\Command;

use Illuminate\Database\Migrations\Migrator;
use Illuminate\Filesystem\Filesystem;
use Miiverse\DB;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Rolls back the last database migration action.
 *
 * @author Repflez
 */
class DatabaseRollbackCommand extends Command
{
    /**
     * Set up the command metadata.
     */
    protected function configure() : void
    {
        $this->setName('db:rollback')
            ->setDescription('Rollback the last database migration.')
            ->setHelp('This command rollbacks the last database migration. Useful if the migration doesn\'t work.');
    }

    /**
     * Does the rolling back.
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $repository = DB::getMigrationRepository();
        $migrator = new Migrator($repository, $repository->getConnectionResolver(), new Filesystem());

        $migrator->rollback();

        foreach ($migrator->getNotes() as $note) {
            $output->writeln(strip_tags($note));
        }
    }
}
