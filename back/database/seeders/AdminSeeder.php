<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@artisan.com'],
            [
                'nom'          => 'Super',
                'prenom'       => 'Admin',
                'mot_de_passe' => Hash::make('admin123456'),
                'role'         => 'ADMIN',
                'suspendu'     => false,
            ]
        );

        $this->command->info('✅ Admin seedé → admin@artisan.com / admin123456');
    }
}
