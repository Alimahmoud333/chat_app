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
            reply
            */

            $table->foreignId('reply_to')
                ->nullable()
                ->constrained('messages')
                ->nullOnDelete();

            /*
            forwarded
            */

            $table->boolean('is_forwarded')
                ->default(false);

            /*
            deleted for everyone
            */

            $table->boolean('deleted_for_everyone')
                ->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {

            $table->dropConstrainedForeignId(
                'reply_to'
            );

            $table->dropColumn([

                'is_forwarded',

                'deleted_for_everyone',
            ]);
        });
    }
};