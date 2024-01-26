<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddCommunityTitleIdTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('community_title_ids', function (Blueprint $table) {
            $table->integer('community_id')->unsigned()->index();
            $table->string('title_id')->unique();

            $table->foreign('community_id')->references('id')->on('communities')->cascadeOnDelete();
        });

        $schema->table('communities', function (Blueprint $table) {
            $table->dropColumn('title_id');
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

        $schema->drop('community_title_ids');

        $schema->table('communities', function (Blueprint $table) {
            $table->bigInteger('title_id')->after('id');
        });
    }
}