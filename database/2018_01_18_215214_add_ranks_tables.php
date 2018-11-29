<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddRanksTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('user_ranks', function (Blueprint $table) {
            $table->integer('user_id')
                ->unsigned();

            $table->integer('rank_id')
                ->unsigned();
        });

        $schema->create('ranks', function (Blueprint $table) {
            $table->increments('rank_id');

            $table->integer('rank_hierarchy')
                ->unsigned();

            $table->string('rank_name', 255);

            $table->string('rank_multiple', 10)
                ->nullable()
                ->default(null);

            $table->tinyInteger('rank_hidden')
                ->unsigned()
                ->default(0);

            $table->string('rank_colour', 255)
                ->nullable()
                ->default(null);

            $table->text('rank_description');

            $table->string('rank_title', 64);
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

        $schema->drop('user_ranks');
        $schema->drop('ranks');
    }
}
