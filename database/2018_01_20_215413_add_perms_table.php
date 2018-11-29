<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddPermsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('perms', function (Blueprint $table) {
            $table->integer('user_id')
                ->default(0);
            $table->integer('rank_id')
                ->default(0);

            $table->tinyInteger('perm_change_profile')
                ->nullable()
                ->default(null);
            $table->tinyInteger('perm_change_mii')
                ->nullable()
                ->default(null);
            $table->tinyInteger('perm_change_bio')
                ->nullable()
                ->default(null);
            $table->tinyInteger('perm_change_username')
                ->nullable()
                ->default(null);
            $table->tinyInteger('perm_change_user_title')
                ->nullable()
                ->default(null);

            $table->tinyInteger('perm_view_user_details')
                ->nullable()
                ->default(null);

            $table->tinyInteger('perm_posts_close')
                ->nullable()
                ->default(null);
            $table->tinyInteger('perm_posts_create')
                ->nullable()
                ->default(null);
            $table->tinyInteger('perm_posts_draw')
                ->nullable()
                ->default(null);
            $table->tinyInteger('perm_posts_delete')
                ->nullable()
                ->default(null);
            $table->tinyInteger('perm_posts_vote')
                ->nullable()
                ->default(null);

            $table->tinyInteger('perm_is_mod')
                ->nullable()
                ->default(null);
            $table->tinyInteger('perm_is_admin')
                ->nullable()
                ->default(null);
            $table->tinyInteger('perm_can_restrict')
                ->nullable()
                ->default(null);
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

        $schema->drop('perms');
    }
}
