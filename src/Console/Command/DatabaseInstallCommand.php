<?php
/**
 * Holds the migration repository installer command controller.
 */

namespace Miiverse\Console\Command;

use Illuminate\Database\Migrations\Migrator;
use Illuminate\Filesystem\Filesystem;
use Miiverse\DB;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Installs the database migration repository.
 *
 * @author Repflez
 */
class DatabaseInstallCommand extends Command
{
    /**
     * Set up the command metadata.
     */
    protected function configure() : void
    {
        $this->setName('db:install')
            ->setDescription('Create the migration repository.')
            ->setHelp('This command creates the database migration repository for foxverse.');
    }

    /**
     * Does the repository installing.
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $repository = DB::getMigrationRepository();
        $migrator = new Migrator($repository, $repository->getConnectionResolver(), new Filesystem());

        if ($migrator->repositoryExists()) {
            $output->writeln('The migration repository already exists!');

            return 0;
        }

        $repository->createRepository();
        $output->writeln('Created the migration repository!');
    }
}
