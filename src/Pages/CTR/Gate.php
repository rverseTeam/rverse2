<?php
/**
 * Holds the user gate.
 */

namespace Miiverse\Pages\CTR;

use Miiverse\DB;
use Miiverse\Helpers\ConsoleAuth;
use Miiverse\Helpers\Mii;
use Miiverse\Upload;
use Miiverse\User;

/**
 * User gate.
 *
 * @author Repflez
 */
class Gate extends Page
{
    /**
     * Serves the user welcome.
     *
     * @return string
     */
    public function welcome() : string
    {
        return view('gate/welcome');
    }

    /**
     * Serves the guest page.
     *
     * @return string
     */
    public function guest() : string
    {
        return view('gate/welcome_guest');
    }

    /**
     * Activates an account.
     *
     * @return string
     */
    public function activate()
    {
        // Create the account
        $user = User::create($_POST['welcome_nnid'], $_POST['welcome_username']);

        // Save the console ID to the linked account table
        DB::table('console_auth')
            ->insert([
                'user_id'  => $user->id,
                'short_id' => ConsoleAuth::$consoleId->short,
                'long_id'  => ConsoleAuth::$consoleId->long,
            ]);

        // Get all Mii images and save them to the mapping table
        $id = Mii::get($user->username);

        $miis_temp = Mii::getMiiImages($id);

        $miis = [];

        foreach ($miis_temp as $name => $mii) {
            $miis[$name] = Upload::uploadMii($mii);
        }

        DB::table('mii_mappings')
            ->insert([
                'user_id'    => $user->id,
                'normal'     => $miis['normal_face'],
                'like'       => $miis['like_face'],
                'happy'      => $miis['happy_face'],
                'frustrated' => $miis['frustrated_face'],
                'puzzled'    => $miis['puzzled_face'],
                'surprised'  => $miis['surprised_face'],
            ]);

        if (!empty(config('discord.accounts'))) {
            Net::JSONRequest(config('discord.accounts'), 'post', [
                'embeds' => [
                    (object)[
                        'title'  => 'New account created',
                        'color'  => 6018695,
                        'fields' => [
                            (object)[
                                'name'  => 'Username',
                                'value' => $_POST['welcome_username'],
                            ],
                            (object)[
                                'name'  => 'Nintendo Network ID',
                                'value' => $_POST['welcome_nnid'],
                            ],
                        ],
                    ],
                ],
            ]);
        }

        return '';
    }

    /**
     * Checks user supplied data on the database.
     *
     * @return string
     */
    public function check() : string
    {
        $username = clean_string($_POST['welcome_username']);
        $nnid = str_replace(' ', '_', $_POST['welcome_nnid']);

        $user = DB::table('users')
            ->where([
                'display_name' => $username,
            ])
            ->first();

        if (!$user) {
            $user = DB::table('users')
                ->where([
                    'username' => $nnid,
                ])
                ->first();

            if (!$user) {
                $mii = Mii::check($nnid);

                if (!$mii) {
                    return 'nonnid';
                } else {
                    return 'ok';
                }
            } else {
                return 'nnid';
            }
        } else {
            return 'username';
        }
    }
}
