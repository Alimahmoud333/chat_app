<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {

            $table->id();

            /*
            sender
            */

            $table->foreignId('sender_id')
                ->constrained('users')
                ->cascadeOnDelete();

            /*
            receiver
            */

            $table->foreignId('receiver_id')
                ->constrained('users')
                ->cascadeOnDelete();

            /*
            message
            */

            $table->longText('message')
                ->nullable();

            /*
            type
            */

            $table->enum('type', [

                'text',
                'image',
                'video',
                'audio',
                'file',
                'location',
            ])->default('text');

            /*
            uploaded file
            */

            $table->string('file')
                ->nullable();

            /*
            location
            */

            $table->decimal('latitude', 10, 7)
                ->nullable();

            $table->decimal('longitude', 10, 7)
                ->nullable();

            /*
            message states
            */

            $table->boolean('is_seen')
                ->default(false);

            $table->timestamp('seen_at')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};