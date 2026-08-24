<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Default Super Admin Account for Platform Administration
        User::firstOrCreate(
            ['email' => 'admin@iguideu.com'],
            [
                'name' => 'Admin IguideU',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '+6281234567890',
            ]
        );
    }
}


