<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class RenameNnidToUsername extends Migration
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
            $table->renameColumn('username', 'display_name');

            $table->renameColumn('username_clean', 'display_name_clean');

            $table->renameColumn('nnid', 'username');

            $table->renameColumn('nnid_clean', 'username_clean');
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
            $table->renameColumn('username', 'nnid');

            $table->renameColumn('username_clean', 'nnid_clean');

            $table->renameColumn('display_name', 'username');

            $table->renameColumn('display_name_clean', 'username_clean');
        });
    }
}
