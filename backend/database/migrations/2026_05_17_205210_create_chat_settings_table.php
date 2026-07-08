<?php

use Illuminate\Database\Migrations\Migration;

use Illuminate\Database\Schema\Blueprint;

use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_settings', function (Blueprint $table) {

            $table->id();

            /*
            owner
            */

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            /*
            target user
            */

            $table->foreignId('target_user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            /*
            pin chat
            */

            $table->boolean('is_pinned')
                ->default(false);

            /*
            archive
            */

            $table->boolean('is_archived')
                ->default(false);

            /*
            mute
            */

            $table->boolean('is_muted')
                ->default(false);

            /*
            block
            */

            $table->boolean('is_blocked')
                ->default(false);

            $table->timestamps();

            /*
            unique pair
            */

            $table->unique([
                'user_id',
                'target_user_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'chat_settings'
        );
    }
};