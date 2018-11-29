<?php
/**
 * Holds the serve command controller.
 */

namespace Miiverse\Console\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Starts up a development server.
 *
 * @author Repflez
 */
class ServeCommand extends Command
{
    /**
     * Set up the command metadata.
     */
    protected function configure() : void
    {
        $this->setName('dev:serve')
            ->setDescription('Sets up a local development server.')
            ->setHelp('This command opens a development server for debugging foxverse with PHP\'s built in server.');
    }

    /**
     * Sends the php serve command via the exec command.
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);
        $document_root = addslashes(path('public'));
        $router_proxy = addslashes(path('server.php'));
        $php_dir = PHP_BINDIR;
        $host = config('dev.host');

        $output->writeln("Starting foxverse development server on {$host}.");
        $io->caution('Do not use this command to serve a production site!');

        exec("{$php_dir}/php -S {$host} -t {$document_root} {$router_proxy}");
    }
}
