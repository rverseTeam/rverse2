<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddMetaCountToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('users', function (Blueprint $table) {
            $table->integer('posts')
                ->unsigned()
                ->default(0);

            $table->integer('follow_count')
                ->unsigned()
                ->default(0);

            $table->integer('follow_back_count')
                ->unsigned()
                ->default(0);
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

        $schema->table('users', function (Blueprint $table) {
            $table->dropColumn('posts');

            $table->dropColumn('follow_count');

            $table->dropColumn('follow_back_count');
        });
    }
}
