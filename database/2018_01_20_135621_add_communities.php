<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddCommunities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('community_categories', function (Blueprint $table) {
            $table->increments('id');

            $table->string('name', 80);

            $table->string('name_safe', 80);

            $table->boolean('enabled')
                ->default(1);
        });

        $schema->create('communities', function (Blueprint $table) {
            $table->increments('id');

            $table->bigInteger('title_id');

            $table->string('icon', 255);

            $table->string('banner', 255);

            $table->string('name', 80);

            $table->text('description');

            $table->integer('type')
                ->unsigned()
                ->default(0);

            $table->timestamp('created')
                ->useCurrent();

            $table->integer('platform')
                ->unsigned()
                ->default(0);

            $table->enum('permissions', ['post', 'draw', 'like']);
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

        $schema->drop('community_categories');
        $schema->drop('communities');
    }
}
