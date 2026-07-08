<?php

use Illuminate\Database\Migrations\Migration;

use Illuminate\Database\Schema\Blueprint;

use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {

            /*
            delivered
            */

            $table->boolean('is_delivered')
                ->default(false);

            $table->timestamp('delivered_at')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {

            $table->dropColumn([

                'is_delivered',

                'delivered_at',
            ]);
        });
    }
};