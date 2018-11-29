<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddSessionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('sessions', function (Blueprint $table) {
            $table->increments('session_id');

            $table->integer('user_id')
                ->unsigned();

            $table->binary('user_ip');

            $table->string('session_key', 255);

            $table->integer('session_start')
                ->unsigned();

            $table->integer('session_expire')
                ->unsigned();

            $table->char('session_country', 2)
                ->default('XX');
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

        $schema->drop('sessions');
    }
}
