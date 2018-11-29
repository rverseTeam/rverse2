<?php

use Illuminate\Database\Migrations\Migration;
use Miiverse\DB;

class FixCommunityTypes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Move special communities to type 3
        DB::table('communities')
            ->where('type', 1)
            ->update(['type' => 3]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Not possible, unfortunately
    }
}
