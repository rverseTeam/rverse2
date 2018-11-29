<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class MigrateToServiceTokens extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('console_auth', function (Blueprint $table) {
            $table->dropColumn('friend_pid');

            $table->string('short_id', 16);

            $table->string('long_id', 64);
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

        $schema->table('console_auth', function (Blueprint $table) {
            $table->dropColumn('short_id');

            $table->dropColumn('long_id');

            $table->string('friend_pid', 16);
        });
    }
}
