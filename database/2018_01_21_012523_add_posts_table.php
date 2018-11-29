<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('posts', function (Blueprint $table) {
            $table->increments('id');

            $table->timestampTz('created')
                ->useCurrent();

            $table->timestampTz('edited')
                ->nullable();

            $table->timestampTz('deleted')
                ->nullable();

            $table->integer('community')
                ->unsigned()
                ->default(0);

            $table->text('content')
                ->nullable();

            $table->string('image', 250)
                ->nullable();

            $table->tinyInteger('feeling')
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

        $schema->drop('posts');
    }
}
