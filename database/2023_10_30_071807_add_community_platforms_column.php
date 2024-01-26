<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class AddCommunityPlatformsColumn extends Migration
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
            $table->set('platforms', [
                '3ds',
                'wiiu',
                'switch',
                'wii',
                'ds',
                'special',
                'supporter',
            ]);

            $table->enum('title_type', [
                'console',
                'virtual',
                'other'
            ])->nullable();
        });

        // Migrate old platform code to new platform column
        $communities = DB::table('communities')->get(['id', 'platform', 'type']);

        foreach ($communities as $community) {
            $platform = intval($community->platform);
            $type = intval($community->type);
            $platforms = match ($platform) {
                1 => ['3ds'],
                2 => ['wiiu'],
                3 => ['3ds','wiiu'],
                4 => ['switch'],
                5 => ['wiiu','switch'],
                6 => ['wii'],
                7 => ['ds'],
                8 => ['wii','ds'],
                default => [],
            };

            
            $title_type = match ($type) {
                0 => 'console',
                1 => 'virtual',
                2 => 'other',
                default => null,
            };
            
            // Type 3 is special, add it to platforms instead
            if ($type === 3) {
                $platforms[] = 'special';
            }

            DB::table('communities')
                ->where('id', intval($community->id))
                ->update([
                    'platforms' => implode(',', $platforms),
                    'title_type' => $title_type
                ]);
        }

        $schema->table('communities', function (Blueprint $table) {
            $table->dropColumn('platform');
            $table->dropColumn('type');
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
            $table->integer('type')->unsigned()->default(0);
            $table->integer('platform')->unsigned()->default(0);
        });

        // Rollback platform migration
        $platforms = [
            1 => ['3ds'],
            2 => ['wiiu'],
            3 => ['3ds','wiiu'],
            4 => ['switch'],
            5 => ['wiiu','switch'],
            6 => ['wii'],
            7 => ['ds'],
            8 => ['wii','ds'],
        ];

        // Do console migration first
        foreach ($platforms as $old_platform => $new_platform) {
            $communities = DB::table('communities')
                ->whereRaw("FIND_IN_SET(?, `platforms`) > 0", implode(',', $new_platform))
                ->get(['id']);

            foreach ($communities as $community) {
                DB::table('communities')
                    ->where('id', intval($community->id))
                    ->update([
                        'platform' => $old_platform
                    ]);
            }
        }

        // Do types now
        $new_types = [
            0 => 'console',
            1 => 'virtual',
            2 => 'other',
        ];

        foreach ($new_types as $old_type => $new_type) {
            $communities = DB::table('communities')
                ->where('title_type', $new_type)
                ->update([
                    'type' => $old_type
                ]);
        }

        // Do special communities now
        $communities = DB::table('communities')
                ->whereRaw("FIND_IN_SET(?, `platforms`) > 0", 'special')
                ->get(['id']);
    
        foreach ($communities as $community) {
            DB::table('communities')
                ->where('id', intval($community->id))
                ->update([
                    'type' => 3
                ]);
        }

        // Everything else that wasn't migrated will default to special community in the old platform type
        DB::table('communities')->where('platform', 0)->where('type', 0)->update(['type' => 3]);

        // Finally delete the platforms and title types columns
        $schema->table('communities', function (Blueprint $table) {
            $table->dropColumn('platforms');
            $table->dropColumn('title_type');
        });
    }
}