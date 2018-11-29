<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddDrawingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('drawings', function (Blueprint $table) {
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

            $table->string('image', 250)
                ->nullable();

            $table->tinyInteger('feeling')
                ->default(0);

            $table->integer('user_id')
                ->unsigned();

            $table->boolean('spoiler')
                ->default(0);

            $table->integer('comments')
                ->unsigned()
                ->default(0);

            $table->integer('empathies')
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

        $schema->drop('drawings');
    }
}
