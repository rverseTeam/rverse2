<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class SeparateTitleIdsByRegionAndConsole extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('community_title_ids', function (Blueprint $table) {
            $table->enum('console', [
                '3ds',
                'wiiu',
            ])->nullable();

            // Regions set and ordered by the account services
            // https://github.com/PretendoNetwork/nintendo-wiki/blob/master/docs/wiiu/account.md#headers
            $table->set('region', [
                'japan',
                'usa',
                'europe',
                'australia',
                'china',
                'korea',
                'taiwan'
            ]);
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

        $schema->table('community_title_ids', function (Blueprint $table) {
            $table->dropColumn('console');
            $table->dropColumn('region');
        });
    }
}