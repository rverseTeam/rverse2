<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class CreateIndexEntries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('comments', function (Blueprint $table) {
            $table->index('post');
            $table->index('user');
            $table->fullText('content');
        });

        $schema->table('communities', function (Blueprint $table) {
            $table->index('platform');
            $table->index('type');
            $table->fullText(['name', 'description']);
        });

        $schema->table('console_auth', function (Blueprint $table) {
            $table->primary('user_id');
            $table->unique('short_id');
            $table->unique('long_id');
        });

        $schema->table('empathies', function (Blueprint $table) {
            $table->primary('user');
            $table->unique(['type', 'id', 'user']);
        });

        $schema->table('favorites', function (Blueprint $table) {
            $table->primary('user_id');
            $table->unique(['user_id', 'community_id']);
        });

        $schema->table('followers', function (Blueprint $table) {
            $table->primary('user_id');
            $table->unique(['user_id', 'follower_id']);
        });

        $schema->table('mii_mappings', function (Blueprint $table) {
            $table->primary('user_id');
        });

        $schema->table('notifications', function (Blueprint $table) {
            $table->index('from');
            $table->index('to');
        });

        $schema->table('posts', function (Blueprint $table) {
            $table->index('community');
            $table->index('user_id');
            $table->fullText('content');
        });

        $schema->table('users', function (Blueprint $table) {
            $table->index('display_name');
            $table->index('username');
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

        $schema->table('comments', function (Blueprint $table) {
            $table->dropIndex(['post']);
            $table->dropIndex(['user']);
            $table->dropFullText(['content']);
        });

        $schema->table('communities', function (Blueprint $table) {
            $table->dropIndex(['platform']);
            $table->dropIndex(['type']);
            $table->dropFullText(['name', 'description']);
        });

        $schema->table('console_auth', function (Blueprint $table) {
            $table->dropPrimary(['user_id']);
            $table->dropUnique(['short_id']);
            $table->dropUnique(['long_id']);
        });

        $schema->table('empathies', function (Blueprint $table) {
            $table->dropPrimary(['user']);
            $table->dropUnique(['type', 'id', 'user']);
        });

        $schema->table('favorites', function (Blueprint $table) {
            $table->dropPrimary(['user_id']);
            $table->dropUnique(['user_id', 'community_id']);
        });

        $schema->table('followers', function (Blueprint $table) {
            $table->dropPrimary(['user_id']);
            $table->dropUnique(['user_id', 'follower_id']);
        });

        $schema->table('mii_mappings', function (Blueprint $table) {
            $table->dropPrimary(['user_id']);
        });

        $schema->table('notifications', function (Blueprint $table) {
            $table->dropIndex(['from']);
            $table->dropIndex(['to']);
        });

        $schema->table('posts', function (Blueprint $table) {
            $table->dropIndex(['community']);
            $table->dropIndex(['user_id']);
            $table->dropFullText(['content']);
        });

        $schema->table('users', function (Blueprint $table) {
            $table->dropIndex(['display_name']);
            $table->dropIndex(['username']);
        });
    }
}