<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddAppDataToPostsAndCommunities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('communities', function (Blueprint $table) {
            $table->longText('app_data')->nullable();
        });

        $schema->table('posts', function (Blueprint $table) {
            $table->longText('app_data')->nullable();
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

        $schema->table('communities', function (Blueprint $table) {
            $table->dropColumn('app_data');
        });

        $schema->table('posts', function (Blueprint $table) {
            $table->dropColumn('app_data');
        });
    }
}