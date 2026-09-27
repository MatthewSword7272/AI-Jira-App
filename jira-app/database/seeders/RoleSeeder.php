<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        Role::firstOrCreate(['name' => 'Guest']);

        $adminPermission = Permission::firstOrCreate(['name' => 'can view all tickets']);

        $adminRole->givePermissionTo($adminPermission);

        User::create([
            'name' => "Matthew Catalfamo",
            'email' => "sword1005@hotmail.com.au",
            'password' => 'password',
        ])->assignRole('Admin');
    }
}
