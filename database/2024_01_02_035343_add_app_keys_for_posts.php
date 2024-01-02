<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddAppKeysForPosts extends Migration
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
            $table->json('app_keys')->nullable();
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
            $table->dropColumn('app_keys');
        });
    }
}