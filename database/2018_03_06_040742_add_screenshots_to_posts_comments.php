<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddScreenshotsToPostsComments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('posts', function (Blueprint $table) {
            $table->string('screenshot', 250)
                ->nullable();
        });

        $schema->table('comments', function (Blueprint $table) {
            $table->string('screenshot', 250)
                ->nullable();
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

        $schema->table('posts', function (Blueprint $table) {
            $table->dropColumn('screenshot');
        });

        $schema->table('comments', function (Blueprint $table) {
            $table->dropColumn('screenshot');
        });
    }
}
