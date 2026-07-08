<?php

namespace Database\Seeders;

use App\Models\User;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;

class AiUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(

            [
                'email' => 'ai@chat.com'
            ],

            [

                'name' => 'AI Assistant',

                'password' => Hash::make('123456'),

                'role' => 'admin',

                'bio' => 'AI Chat Assistant',

                'is_online' => true,
            ]
        );
    }
}