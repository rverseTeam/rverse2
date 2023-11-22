<?php
/**
 * Holds the news page.
 */

namespace Miiverse\Pages\CTR;

use Miiverse\CurrentSession;
use Miiverse\DB;
use Miiverse\User;

/**
 * News page.
 *
 * @author Cyuubi
 */
class News extends Page
{
    /**
     * News index.
     *
     * @return string
     */
    public function my_news() : string
    {
        $local_user = CurrentSession::$user;
        $notifications = [];

        $notifications_pre = DB::table('notifications')
                    ->where('to', $local_user->id)
                    ->orderBy('date', 'desc')
                    ->get();

        //var_dump($notifications_pre);

        foreach ($notifications_pre as $notification) {
            $user = User::constructFromId($notification->from);

            $notifications[] = [
                'type'      => $notification->type,
                'user'      => $user,
                'date'      => $notification->date,
            ];
        }

        //var_dump($notifications);

        DB::table('notifications')
                    ->where([
                        ['to', $local_user->id],
                        ['seen', 0],
                    ])
                    ->update(['seen' => 1]);

        // laravel being a piece of shit
        if ($notifications == null) {
            $notifications = null;
        }

        return view('news/my_news', compact('local_user', 'notifications'));
    }
}
