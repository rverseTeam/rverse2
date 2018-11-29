<?php

use Illuminate\Database\Migrations\Migration;
use Miiverse\DB;

class MigrateCommunitiesToNewOrganization extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $generalTempID = 123;

        // Move general communities to temp type
        DB::table('communities')
            ->where('type', 0)
            ->update(['type' => $generalTempID]);

        // Move game communities to type 0
        DB::table('communities')
            ->where([
                ['type', '>', 0],
                ['type', '<', 4],
            ])
            ->update(['type' => 0]);

        // Move special communities to type 1
        DB::table('communities')
            ->where('type', 4)
            ->update(['type' => 1]);

        // Move general communities to type 1
        DB::table('communities')
            ->where('type', $generalTempID)
            ->update(['type' => 1]);
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
