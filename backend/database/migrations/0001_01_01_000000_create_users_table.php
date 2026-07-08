<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        =========================================
        USERS
        =========================================
        */

        Schema::create('users', function (Blueprint $table) {

            $table->id();

            /*
            =========================================
            BASIC INFO
            =========================================
            */

            $table->string('name');

            $table->string('email')->unique();

            $table->timestamp('email_verified_at')->nullable();

            $table->string('password');

            /*
            =========================================
            PROFILE
            =========================================
            */

            $table->string('profile_image')->nullable();

            $table->text('bio')->nullable();

            $table->string('phone')->unique();

            $table->timestamp('phone_verified_at')->nullable();

            /*
            =========================================
            ROLE
            =========================================
            */

            $table->enum('role', ['admin', 'user'])
                ->default('user');

            /*
            =========================================
            STATUS
            =========================================
            */

            $table->boolean('is_online')
                ->default(false);

            $table->timestamp('last_seen')
                ->nullable()
                ->index();

            $table->boolean('is_banned')
                ->default(false);

            /*
            =========================================
            PUSH NOTIFICATIONS FCM
            =========================================
            */

            $table->text('fcm_token')
                ->nullable();

            /*
            =========================================
            LARAVEL DEFAULTS
            =========================================
            */

            $table->rememberToken();

            $table->timestamps();

            /*
            =========================================
            INDEXES
            =========================================
            */

            $table->index('role');

            $table->index('is_online');

            $table->index('is_banned');
        });

        /*
        =========================================
        PASSWORD RESET TOKENS
        =========================================
        */

        Schema::create('password_reset_tokens', function (Blueprint $table) {

            $table->string('email')->primary();

            $table->string('token');

            $table->timestamp('created_at')->nullable();
        });

        /*
        =========================================
        SESSIONS
        =========================================
        */

        Schema::create('sessions', function (Blueprint $table) {

            $table->string('id')->primary();

            $table->foreignId('user_id')
                ->nullable()
                ->index();

            $table->string('ip_address', 45)
                ->nullable();

            $table->text('user_agent')
                ->nullable();

            $table->longText('payload');

            $table->integer('last_activity')
                ->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');

        Schema::dropIfExists('password_reset_tokens');

        Schema::dropIfExists('users');
    }
};