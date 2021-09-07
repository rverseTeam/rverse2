<?php
/**
 * Holds the migration status command controller.
 */

namespace Miiverse\Console\Command;

use Illuminate\Database\Migrations\Migrator;
use Illuminate\Filesystem\Filesystem;
use Miiverse\DB;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Returns the status of the database migrations.
 *
 * @author Repflez
 */
class DatabaseStatusCommand extends Command
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
        $this->setName('db:status')
            ->setDescription('Show the status of each migration.')
            ->setHelp('This command shows the status of each migration.');
    }

    /**
     * Fulfills the purpose of what is described above this class.
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $repository = DB::getMigrationRepository();
        $migrator = new Migrator($repository, $repository->getConnectionResolver(), new Filesystem());

        if (!$migrator->repositoryExists()) {
            $output->writeln('No migrations found!');

            return Command::FAILURE;
        }

        $ran = $repository->getRan();

        $migrations = new Table($output);

        $migrations->setHeaders([
            'Ran?',
            'Migration',
        ]);

        foreach ($migrator->getMigrationFiles(path(self::MIGRATIONS)) as $migration) {
            $migrations->addRow([in_array($migration, $ran) ? 'Y' : 'N', $migration]);
        }

        $migrations->render();

        return Command::SUCCESS;
    }
}
