<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class MakeNotificationPostCommentIdsUnsigned extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('notifications', function (Blueprint $table) {
            $table->integer('post_id')
                ->unsigned()
                ->change();

            $table->integer('comment_id')
                ->unsigned()
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Can't reverse this sadly
    }
}
