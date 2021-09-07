<?php
/**
 * Holds the session purge command controller.
 */

namespace Miiverse\Console\Command;

use Miiverse\DB;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Purges every expired session in the database.
 *
 * @author RverseTeam
 */
class SessionPurgeCommand extends Command
{
    /**
     * Set up the command metadata.
     */
    protected function configure() : void
    {
        $this->setName('db:purgesessions')
            ->setDescription('Purge expired sessions.')
            ->setHelp('Purges every expired session on the database. Should be run regularly via cronjobs.');
    }

    /**
     * Purges sessions.
     */
    protected function execute(InputInterface $input, OutputInterface $output) : int
    {
        DB::table('sessions')
            ->where('session_expire', '<', time())
            ->delete();

        return Command::SUCCESS;
    }
}
