<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('notifications', function (Blueprint $table) {
            $table->integer('from')
                ->unsigned();

            $table->integer('to')
                ->unsigned();

            $table->integer('type');

            $table->integer('post_id')
                ->default(0);

            $table->integer('comment_id')
                ->default(0);

            $table->timestampTz('date')
                ->useCurrent();

            $table->boolean('seen')
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

        $schema->drop('notifications');
    }
}
