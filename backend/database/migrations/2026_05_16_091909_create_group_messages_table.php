<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_messages', function (Blueprint $table) {

            $table->id();

            /*
            =========================================
            GROUP
            =========================================
            */

            $table->foreignId('group_id')
                ->constrained('chat_groups')
                ->cascadeOnDelete();

            /*
            =========================================
            SENDER
            =========================================
            */

            $table->foreignId('sender_id')
                ->constrained('users')
                ->cascadeOnDelete();

            /*
            =========================================
            CONTENT
            =========================================
            */

            $table->longText('message')
                ->nullable();

            $table->enum('type', [
                'text',
                'image',
                'video',
                'audio',
                'file',
                'location',
            ])->default('text');

            $table->string('file')
                ->nullable();

            /*
            =========================================
            LOCATION
            =========================================
            */

            $table->decimal('latitude', 10, 7)
                ->nullable();

            $table->decimal('longitude', 10, 7)
                ->nullable();

            $table->timestamps();

            /*
            =========================================
            INDEXES
            =========================================
            */

            $table->index([
                'group_id',
                'created_at',
            ]);

            $table->index('sender_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_messages');
    }
};