<?php
/*
 * Translation file for settings
 */

 return [
     // Account settings
     'account' => [
        'title' => 'Paramètres :name',

        'display_language' => [
            'title' => 'Dans quelle langue souhaitez-vous que :name soit affiché?',
            'note' => 'Note : Ce paramètre n\'affecte pas la langue dans laquelle les publications sont affichées.',
        ],

        'post_language' => [
            'title' => 'Dans quelle langue souhaitez-vous voir les publications de :name?',
            'note' => 'Note : Ce paramètre n\'affecte pas la langue dans laquelle :name est affiché.',

            'all_languages' => 'Tout les languages',
        ],

        'submit' => 'Sauvegarder les paramètres',
     ],

     // Profile Settings
     'profile' => [
         'title' => 'Paramètres du profile',

         // Profile Comment
         'comment' => [
             'section_name' => 'Commentaire du profile',
             'placeholder' => 'Écrivez votre biographie ici.',
             'note' => 'Attention',
             'note_content' => 'Veuillez vous abstenir d\'inclure ces informations suivantes :<br>
- Votre adresse, numéro de téléphone, adresse e-mail, le nom de votre école ou toute autre information permettant de vous identifier personnellement. <br>
- Liens vers des sites Web externes qui pourraient être utilisés pour vous contacter directement.<br>
- Tout autre contenu interdit par le Code de conduite :name.<br>
La publication de telles informations est contraire au code de conduite :name et peut entraîner la dissimulation de votre profil au public.',
         ],

         // Submit button
         'submit' => 'Sauvegarder les paramètres',
     ],
 ];
