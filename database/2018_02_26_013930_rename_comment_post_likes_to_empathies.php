<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class RenameCommentPostLikesToEmpathies extends Migration
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
            $table->renameColumn('likes', 'empathies');
        });

        $schema->table('comments', function (Blueprint $table) {
            $table->renameColumn('likes', 'empathies');
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
            $table->renameColumn('empathies', 'likes');
        });

        $schema->table('comments', function (Blueprint $table) {
            $table->renameColumn('empathies', 'likes');
        });
    }
}
