<?php
/*
 * Translation file for settings
 */

 return [
     // Account settings
     'account' => [
        'title' => ':name Paramètres',

        'display_language' => [
            'title' => 'En quel langage voulez-vous que :name s'affiche ?',
            'note' => 'Note: Ce paramètre ne change pas l'affichage des publications.',
        ],

        'post_language' => [
            'title' => 'En quelle langue voulez-vous voir les publications sur :name ?',
            'note' => 'Note: Ce paramètre ne change pas le langage sur :name',

            'all_languages' => 'Toutes les Langues',
        ],

        'submit' => 'Sauvegarder',
     ],

     // Profile Settings
     'profile' => [
         'title' => 'Paramètres du Profil',

         // Profile Comment
         'comment' => [
             'section_name' => 'Description du Profil',
             'placeholder' => 'Décrivez-vous ici.',
             'note' => 'Attention',
             'note_content' => 'S'il vous plaît ne rendez pas publique ces informations :<br>
- Votre adresse, numéro de téléphone, addresse e-mail, le nom de votre école, ou toute autre information qui pourrait vous identifier. <br>
- Des liens à des sites web extérieurs qui pourraient être utilisés pour vous contacter. <br>
- D'autres informations qui pourraient enfreidre le Code de Conduite de :name.<br>
Publier ces informations est interdit par le Code de Conduite de :name et votre profil pourrait se faire cacher des autres utilisateurs.',
         ],

         // Submit button
         'submit' => 'Sauvegarder',
     ],
 ];