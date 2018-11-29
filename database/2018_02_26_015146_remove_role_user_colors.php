<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class RemoveRoleUserColors extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('users', function (Blueprint $table) {
            $table->dropColumn('user_color');
        });

        $schema->table('ranks', function (Blueprint $table) {
            $table->dropColumn('rank_colour');
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

        $schema->table('users', function (Blueprint $table) {
            $table->string('user_color', 255);
        });

        $schema->table('ranks', function (Blueprint $table) {
            $table->string('rank_colour', 255);
        });
    }
}
