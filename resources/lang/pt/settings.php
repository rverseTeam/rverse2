<?php
/*
 * Translation file for settings
 */

 return [
     // Account settings
     'account' => [
        'title' => 'Ajustes de :name',

        'display_language' => [
            'title' => 'Qual idioma você gostaria de usar no :name?',
            'note' => 'Nota: Esta configuração não afeta o idioma em que as postagens foram escritos.',
        ],

        'post_language' => [
            'title' => 'Em que idioma você gostaria de ver postagens no :name?',
            'note' => 'Nota: Esta configuração não afeta o idioma que o :name está atualmente.',

            'all_languages' => 'Todos os idiomas',
        ],

        'submit' => 'Salvar Ajustes',
     ],

     // Profile Settings
     'profile' => [
         'title' => 'Ajustes de Perfil',

         // Profile Comment
         'comment' => [
             'section_name' => 'Biografia',
             'placeholder' => 'Escreva sobre você aqui.',
             'note' => 'Atenção',
             'note_content' => 'Por favor evite de incluir as seguintes informações:<br>
- Seu endereço, número de telefone, e-mail, nome de sua escola, ou qualquer outra informação que possa identificá-lo pessoalmente. <br>
- Links para websites externos que podem ser usados para contatá-lo diretamente.<br>
- Qualquer outro conteúdo proibido pelo Código de conduta do :name.<br>
Publicar essas informações é contra o Código de Conduta do :name e pode resultar na ocultação de seu perfil ao público.',
         ],

         // Submit button
         'submit' => 'Salvar Ajustes',
     ],
 ];
