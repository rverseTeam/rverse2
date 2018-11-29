<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('users', function (Blueprint $table) {
            $table->increments('user_id');

            $table->string('username', 255);

            $table->string('username_clean', 255)
                ->unique();

            $table->integer('rank_main')
                ->unsigned()
                ->default(0);

            $table->string('user_color', 255)
                ->nullable()
                ->default(null);

            $table->binary('register_ip');

            $table->binary('last_ip');

            $table->string('user_title', 64)
                ->nullable()
                ->default(null);

            $table->integer('user_registered')
                ->unsigned()
                ->default(0);

            $table->integer('user_last_online')
                ->unsigned()
                ->default(0);

            $table->date('user_birthday')
                ->nullable()
                ->default(null);

            $table->char('user_country', 2)
                ->default('XX');

            $table->text('user_bio')
                ->nullable();

            $table->integer('user_expertise')
                ->unsigned()
                ->default(0);

            $table->integer('user_systems')
                ->unsigned()
                ->default(0);

            $table->boolean('user_activated')
                ->default(0);

            $table->boolean('user_restricted')
                ->default(0);

            $table->string('nnid', 255);

            $table->string('nnid_clean', 255)
                ->unique();
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

        $schema->drop('users');
    }
}
