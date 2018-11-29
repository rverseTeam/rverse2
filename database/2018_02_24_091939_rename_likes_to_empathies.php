<?php

use Illuminate\Database\Migrations\Migration;
use Miiverse\DB;

class RenameLikesToEmpathies extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->rename('likes', 'empathies');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $schema = DB::getSchemaBuilder();

        $schema->rename('empathies', 'likes');
    }
}
