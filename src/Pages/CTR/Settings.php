<?php

/**
 * Holds the settings page.
 */

namespace Miiverse\Pages\CTR;

use Miiverse\CurrentSession;
use Miiverse\Translation;
use Miiverse\DB;

/**
 * Settings page.
 *
 * @author Cyuubi
 */
class Settings extends Page
{
    /**
     * User has completed a tutorial part, set it in database.
     *
     * @return string
     */
    public function tutorial_post(): string
    {
        $tutorial_name = $_POST['tutorial_name'];
        $database_key = '';

        // database key to put to true
        switch ($tutorial_name) {
            case 'my_news':
                $database_key = 'news_dot';
                break;
            default:
                $database_key = 'nokey';
                break;
        }

        header('Content-Type: application/json; charset=utf-8');
        if ($database_key == 'nokey') {
            return '{"success":0}';
        }

        DB::table('users')
            ->where('user_id', '=', CurrentSession::$user->id)
            ->update([$database_key => 1]);

        return '{"success":1}';
    }


    /**
     * Page for users to set their account details.
     *
     * @return string
     */
    public function account(): string
    {
        $user = CurrentSession::$user;

        $display_languages = [
            0 => [
                'title' => '日本語',
                'code' => Translation::LANGUAGE_JAPANESE,
                'selected' => $user->language === 0,
            ],
            1 => [
                'title' => 'English',
                'code' => Translation::LANGUAGE_ENGLISH,
                'selected' => $user->language === 1,
            ],
            2 => [
                'title' => 'Français',
                'code' => Translation::LANGUAGE_FRENCH,
                'selected' => $user->language === 2,
            ],
            3 => [
                'title' => 'Deutsch',
                'code' => Translation::LANGUAGE_GERMAN,
                'selected' => $user->language === 3,
            ],
            4 => [
                'title' => 'Italiano',
                'code' => Translation::LANGUAGE_ITALIAN,
                'selected' => $user->language === 4,
            ],
            5 => [
                'title' => 'Español',
                'code' => Translation::LANGUAGE_SPANISH,
                'selected' => $user->language === 5,
            ],
            6 => [
                'title' => '汉语',
                'code' => Translation::LANGUAGE_SIMPLIFIED_CHINESE,
                'selected' => $user->language === 6,
            ],
            7 => [
                'title' => '한국어',
                'code' => Translation::LANGUAGE_KOREAN,
                'selected' => $user->language === 7,
            ],
            8 => [
                'title' => 'Nederlands',
                'code' => Translation::LANGUAGE_DUTCH,
                'selected' => $user->language === 8,
            ],
            9 => [
                'title' => 'Português',
                'code' => Translation::LANGUAGE_PORTUGUESE,
                'selected' => $user->language === 9,
            ],
            10 => [
                'title' => 'Русский',
                'code' => Translation::LANGUAGE_RUSSIAN,
                'selected' => $user->language === 10,
            ],
            11 => [
                'title' => '漢語',
                'code' => Translation::LANGUAGE_TRADITIONAL_CHINESE,
                'selected' => $user->language === 11,
            ],
        ];
        $selected_display_language = $display_languages[$user->language]['title'];
        $post_languages = [
            99 => [
                'title' => __('settings.account.post_language.all_languages'),
                'code' => Translation::LANGUAGE_SYSTEM,
                'selected' => $user->post_language === 99,
            ],
        ];
        $post_languages += $display_languages;
        $selected_post_language = $post_languages[$user->post_language]['title'];
        
        return view('settings/account', compact(
            'display_languages',
            'selected_display_language',
            'post_languages',
            'selected_post_language'
        ));
    }

    public function profileView(): string
    {
        return view('settings/profile');
    }
}
