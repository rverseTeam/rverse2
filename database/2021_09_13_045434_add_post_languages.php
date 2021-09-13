<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddPostLanguages extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('posts', function (Blueprint $table) {
            $table->smallInteger('language')->default(1);
        });

        // Edit user language column
        $schema->table('users', function (Blueprint $table) {
            $table->dropColumn('lang');
            
            $table->smallInteger('language')->default(1);
            $table->smallInteger('post_language')->default(99);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('posts', function (Blueprint $table) {
            $table->dropColumn('language');
        });

        $schema->table('users', function (Blueprint $table) {
            $table->dropColumn('language');
            $table->dropColumn('post_language');

            $table->string('lang', 2)->default('en');
        });
    }
}
