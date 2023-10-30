<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddCommunityCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        // Delete the previous table, to avoid any issues
        $schema->drop('community_categories');

        $schema->create('community_categories', function (Blueprint $table) {
            $table->increments('id');

            $table->string('name', 80);

            $table->string('class', 80)->default('');

            $table->boolean('has_filter')->default(true);

            $table->unsignedInteger('order')->default(0);
        });

        DB::table('community_categories')->insert([
            [
                'name' => '#new',
                'class' => '#console',
                'has_filter' => true,
                'order' => 1,
            ],
            [
                'name' => '#special',
                'class' => 'special',
                'has_filter' => false,
                'order' => 2,
            ],
            [
                'name' => '#supporter',
                'class' => 'supporter',
                'has_filter' => false,
                'order' => 3
            ]
        ]);
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

        // Recreate the old table, just in case
        $schema->create('community_categories', function (Blueprint $table) {
            $table->increments('id');

            $table->string('name', 80);

            $table->string('name_safe', 80);

            $table->boolean('enabled')->default(1);
        });
    }
}