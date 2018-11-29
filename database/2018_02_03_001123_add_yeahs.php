<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddYeahs extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('likes', function (Blueprint $table) {
            $table->tinyInteger('type')
                ->unsigned()
                ->default(0);

            $table->integer('id')
                ->unsigned();

            $table->integer('user')
                ->unsigned();
        });

        $schema->table('comments', function (Blueprint $table) {
            $table->integer('likes')
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

        $schema->drop('likes');

        $schema->table('comments', function (Blueprint $table) {
            $table->dropColumn('likes');
        });
    }
}
