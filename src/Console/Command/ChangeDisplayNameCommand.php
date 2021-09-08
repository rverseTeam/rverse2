<?php
/**
 * Holds the Display Name change command controller.
 */

namespace Miiverse\Console\Command;

use Miiverse\DB;
use Miiverse\User;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Installs the Display Name change repository.
 *
 * @author Repflez
 */
class ChangeDisplayNameCommand extends Command
{
    /**
     * Set up the command metadata.
     */
    protected function configure() : void
    {
        $this->setName('user:changename')
            ->addOption('uid', null, InputOption::VALUE_REQUIRED, 'User ID or Username')
            ->addOption('new_name', null, InputArgument::IS_ARRAY | InputArgument::REQUIRED, 'New Display Name to use')
            ->setDescription('Changes a user\'s Display Name')
            ->setHelp('This command allows changing a user\'s Display Name.');
    }

    /**
     * Changes the Display Name.
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $formatter = $this->getHelper('formatter');
        $user = User::construct($input->getOption('uid'));
        $newDisplayName = $input->getOption('new_name');
        $update = [];

        if ($user->id === 0) {
            $output->writeln($formatter->formatBlock(['Error', 'User ID "' . $input->getOption('uid') . '" not found!'], 'error'));

            return Command::FAILURE;
        }

        if (!$newDisplayName) {
            $output->writeln($formatter->formatBlock(['Error', 'Please specify a new Display Name!'], 'error'));

            return Command::FAILURE;
        }

        $update['display_name'] = $newDisplayName;
        $update['display_name_clean'] = clean_string($newDisplayName, true);

        $exists = DB::table('users')
            ->where('display_name_clean', $update['display_name_clean'])
            ->get();

        if (count($exists) > 0) {
            $output->writeln($formatter->formatBlock(['Error', 'The Display Name "' . $newDisplayName . '" is already in use!'], 'error'));

            return Command::FAILURE;
        }

        DB::table('users')
            ->where('user_id', $user->id)
            ->update($update);

        return Command::SUCCESS;
    }
}
