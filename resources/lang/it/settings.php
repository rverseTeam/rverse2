<?php
/*
 * Translation file for settings
 */

 return [
     // Account settings
     'account' => [
        'title' => 'Impostazioni di :name',

        'display_language' => [
            'title' => 'In che lingua vorresti :name?',
            'note' => 'Avviso: Questa impostazione non varia la lingua dei post.',
        ],

        'post_language' => [
            'title' => 'In che lingua vorresti i post di :name?',
            'note' => 'Avviso: Questa impostazione non varia la lingua dell\'applicazione.',

            'all_languages' => 'Tutte le lingue',
        ],

        'submit' => 'Salva',
     ],

     // Profile Settings
     'profile' => [
         'title' => 'Impostazioni del profilo',

         // Profile Comment
         'comment' => [
             'section_name' => 'Bio',
             'placeholder' => 'Scrivi qualcosa su di te qui.',
             'note' => 'Attenzione',
             'note_content' => 'Non includere nessuna delle seguenti informazioni qui:<br>
- Il tuo indirizzo, numero di telefono, indirizzo e-mail, il nome della tua scuola o qualsiasi altra informazione che potrebbe identificarti. <br>
- Link a siti esterni che potrebbero essere usati per contattarti direttamente.<br>
- Qualsiasi altro nome che non rispetta il codice di condotta di :name.<br>
Inserire qualsiasi di queste informazioni è contro il codice di condotta di :name e potresti essere bannato.',
         ],

         // Submit button
         'submit' => 'Salva',
     ],
 ];