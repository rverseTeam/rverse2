<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class DefaultRegionForTitles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->table('communities', function (Blueprint $table) {
            // Regions set and ordered by the account services
            // https://github.com/PretendoNetwork/nintendo-wiki/blob/master/docs/wiiu/account.md#headers
            $regionList = [
                'japan',
                'usa',
                'europe',
                'australia',
                'china',
                'korea',
                'taiwan'
            ];

            // The default for titles is region free now
            $table->set('default_region', $regionList)->default(implode(',', $regionList));
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

        $schema->table('communities', function (Blueprint $table) {
            $table->dropColumn('default_region');
        });
    }
}