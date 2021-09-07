<?php
/**
 * Holds the setup command controller.
 */

namespace Miiverse\Console\Command;

use Miiverse\DB;
use Miiverse\User;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * The command that handles setting up the base data.
 *
 * @author Repflez
 */
class SetupCommand extends Command
{
    /**
     * Set up the command metadata.
     */
    protected function configure() : void
    {
        $this->setName('db:setup')
            ->setDescription('Adds data to the tables.')
            ->setHelp('Adds the required data to the tables, only needed once after the initial migration.');
    }

    /**
     * Adds data to the database required to get everything running.
     */
    protected function execute(InputInterface $input, OutputInterface $output) : int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('rverse2 Setup');

        // Check if the users table has user with id 1
        $userCheck = DB::table('users')
            ->where('user_id', 1)
            ->count();

        // If positive, stop
        if ($userCheck > 0) {
            $io->error("It appears that you've already done the setup already! If this isn't the case, make sure your tables are empty.");

            return Command::FAILURE;
        }

        // Rank data (uses column names)
        $ranks = [
            [
                'rank_id'           => config('rank.regular'),
                'rank_hierarchy'    => 1,
                'rank_name'         => 'Normal user',
                'rank_multiple'     => 's',
                'rank_description'  => 'Regular users with regular permissions.',
                'rank_title'        => 'Member',
            ],
            [
                'rank_id'           => config('rank.verified'),
                'rank_hierarchy'    => 3,
                'rank_name'         => 'Verified',
                'rank_multiple'     => 's',
                'rank_description'  => 'Users that have been verified by our staff.',
                'rank_title'        => 'Verified',
            ],
            [
                'rank_id'           => config('rank.bot'),
                'rank_hierarchy'    => 1,
                'rank_name'         => 'Bot',
                'rank_multiple'     => 's',
                'rank_hidden'       => 1,
                'rank_colour'       => '#9e8da7',
                'rank_description'  => 'Reserved accounts for services.',
                'rank_title'        => 'Bot',
            ],
            [
                'rank_id'           => config('rank.donator'),
                'rank_hierarchy'    => 2,
                'rank_name'         => 'Donator',
                'rank_multiple'     => 's',
                'rank_colour'       => '#ee9400',
                'rank_description'  => 'Users that donated to help us keep the site and its service alive.',
                'rank_title'        => 'Donator',
            ],
            [
                'rank_id'           => config('rank.alumni'),
                'rank_hierarchy'    => 1,
                'rank_name'         => 'Alumni',
                'rank_colour'       => '#ff69b4',
                'rank_description'  => 'Users who made big contributions to the site but have since moved on.',
                'rank_title'        => 'Alumni',
            ],
            [
                'rank_id'           => config('rank.mod'),
                'rank_hierarchy'    => 4,
                'rank_name'         => 'Moderator',
                'rank_multiple'     => 's',
                'rank_colour'       => '#fa3703',
                'rank_description'  => 'Users with special permissions to keep the community at peace.',
                'rank_title'        => 'Moderator',
            ],
            [
                'rank_id'           => config('rank.admin'),
                'rank_hierarchy'    => 5,
                'rank_name'         => 'Administrator',
                'rank_multiple'     => 's',
                'rank_colour'       => '#824ca0',
                'rank_description'  => 'Users that manage the and everything around that.',
                'rank_title'        => 'Administrator',
            ],
            [
                'rank_id'           => config('rank.banned'),
                'rank_hierarchy'    => 0,
                'rank_name'         => 'Banned',
                'rank_hidden'       => 1,
                'rank_colour'       => '#666',
                'rank_description'  => 'Banned users.',
                'rank_title'        => 'Banned',
            ],
        ];

        // Insert all the ranks into the database
        foreach ($ranks as $rank) {
            DB::table('ranks')->insert($rank);
        }

        // Permission data
        $perms = [
            [
                'rank_id'             => config('rank.regular'),
                'perm_change_profile' => true,
                'perm_change_mii'     => true,
                'perm_change_bio'     => true,
                'perm_posts_close'    => true,
                'perm_posts_create'   => true,
                'perm_posts_draw'     => true,
                'perm_posts_delete'   => true,
                'perm_posts_vote'     => true,
            ],
            [
                'rank_id'                => config('rank.mod'),
                'perm_view_user_details' => true,
                'perm_is_mod'            => true,
            ],
            [
                'rank_id'                => config('rank.admin'),
                'perm_change_username'   => true,
                'perm_change_user_title' => true,
                'perm_view_user_details' => true,
                'perm_is_mod'            => true,
                'perm_is_admin'          => true,
                'perm_can_restrict'      => true,
            ],
            [
                'rank_id'                => config('rank.banned'),
                'perm_change_profile'    => false,
                'perm_change_mii'        => false,
                'perm_change_bio'        => false,
                'perm_change_username'   => false,
                'perm_change_user_title' => false,
                'perm_view_user_details' => false,
                'perm_posts_close'       => false,
                'perm_posts_create'      => false,
                'perm_posts_draw'        => false,
                'perm_posts_delete'      => false,
                'perm_posts_vote'        => false,
                'perm_is_mod'            => false,
                'perm_is_admin'          => false,
                'perm_can_restrict'      => false,
            ],
        ];

        // Insert all the permissions into the database
        foreach ($perms as $perm) {
            DB::table('perms')->insert($perm);
        }

        $io->text('Success! rverse2 has been installed in this host.');

        return Command::SUCCESS;
    }
}
