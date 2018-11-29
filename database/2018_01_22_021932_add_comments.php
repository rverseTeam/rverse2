<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddComments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('comments', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('post')
                ->unsigned()
                ->default(0);

            $table->timestampTz('created')
                ->useCurrent();

            $table->timestampTz('edited')
                ->nullable();

            $table->timestampTz('deleted')
                ->nullable();

            $table->integer('user')
                ->unsigned();

            $table->text('content')
                ->nullable();

            $table->integer('type')
                ->unsigned()
                ->default(0);

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

        $schema->drop('comments');
    }
}
