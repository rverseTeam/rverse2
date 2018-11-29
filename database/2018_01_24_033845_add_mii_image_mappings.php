<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddMiiImageMappings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $schema = DB::getSchemaBuilder();

        $schema->create('mii_mappings', function (Blueprint $table) {
            $table->integer('user_id')
                ->unsigned();

            $table->string('normal');

            $table->string('like');

            $table->string('happy');

            $table->string('frustrated');

            $table->string('puzzled');

            $table->string('surprised');
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

        $schema->drop('mii_mappings');
    }
}
