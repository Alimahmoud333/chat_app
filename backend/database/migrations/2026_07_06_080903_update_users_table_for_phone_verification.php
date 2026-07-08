<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            if (! Schema::hasColumn('users', 'phone_verified_at')) {
                $table->timestamp('phone_verified_at')
                    ->nullable()
                    ->after('phone');
            }
        });

        /*
        =========================================
        IMPORTANT
        =========================================
        If your phone column already has duplicate values,
        unique index will fail.

        Make sure phones are unique before adding this.
        =========================================
        */

        Schema::table('users', function (Blueprint $table) {

            /*
            Remove OTP columns if you used Twilio Verify
            */

            if (Schema::hasColumn('users', 'otp_code')) {
                $table->dropColumn('otp_code');
            }

            if (Schema::hasColumn('users', 'otp_expires_at')) {
                $table->dropColumn('otp_expires_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            if (Schema::hasColumn('users', 'phone_verified_at')) {
                $table->dropColumn('phone_verified_at');
            }

            if (! Schema::hasColumn('users', 'otp_code')) {
                $table->string('otp_code', 6)
                    ->nullable()
                    ->index();
            }

            if (! Schema::hasColumn('users', 'otp_expires_at')) {
                $table->timestamp('otp_expires_at')
                    ->nullable();
            }
        });
    }
};