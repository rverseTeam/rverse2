<?php
/*
 * Translation file for settings
 */

 return [
     // Account settings
     'account' => [
        'title' => ':name Settings',

        'display_language' => [
            'title' => 'In what language you want :name to be displayed in?',
            'note' => 'Note: This setting does not affect what language posts are displayed in.',
        ],

        'post_language' => [
            'title' => 'In what language do you want to see posts in :name?',
            'note' => 'Note: This setting does not affect what language :name is displayed in.',

            'all_languages' => 'All Languages',
        ],

        'submit' => 'Save Settings',
     ],

     // Profile Settings
     'profile' => [
         'title' => 'Profile Settings',

         // Profile Comment
         'comment' => [
             'section_name' => 'Profile Comment',
             'placeholder' => 'Write about yourself here.',
             'note' => 'Attention',
             'note_content' => 'Please refrain from including any of the following information:<br>
- Your address, telephone number, e-mail address, the name of your school, or any other information that could personally identify you. <br>
- Links to external websites which could be used to contact you directly.<br>
- Any other content prohibited by the :name Code of Conduct.<br>
Posting such information is against the :name Code of Conduct and may result in your profile being hidden from the public.',
         ],

         // Submit button
         'submit' => 'Save Settings',
     ],
 ];