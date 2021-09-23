<?php
/*
 * Translation file for settings
 */

 return [
     // Account settings
     'account' => [
        'title' => ':name Beállítások',

        'display_language' => [
            'title' => 'Milyen nyelven szeretnéd használni az :name -t?',
            'note' => 'Megjegyzés: Ez a beállítás nem váltosztatja meg a posztok nyelvét.',
        ],

        'post_language' => [
            'title' => 'Milyen nyelven szeretnéd elolvasni a posztokat az :name -ön?',
            'note' => 'Megjegyzés: Ez a beállítás nem váltosztatja meg az :name nyelvét.',

            'all_languages' => 'Összes Nyelv',
        ],

        'submit' => 'Beállítások Mentése',
     ],

     // Profile Settings
     'profile' => [
         'title' => 'Felhasználói Beállítások',

         // Profile Comment
         'comment' => [
             'section_name' => 'Felhasználói Komment',
             'placeholder' => 'Írj ide magadról.',
             'note' => 'Figyelem',
             'note_content' => 'Kérjek ne osszon meg akármilyen ilyesféle információt:<br>
- A címed, telefonszámod, e-mail címed, az iskolád neved, vagy akármilyen privát információt.<br>
- Website linkeket amiket a veled való kapcsolat felvételére lehet használni.<br>
- Bármilyen más alapanyag amelyet tilt az :name Code of Conduct.<br>
Információ posztolása amelyet az :name Code of Conduct tilt végződhet a felhasználód elrejtésében a publikumból.',
         ],

         // Submit button
         'submit' => 'Beállítások Elmentése',
     ],
 ];