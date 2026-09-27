<?php

namespace Database\Seeders;

use App\Enums\SeverityEnum;
use App\Models\Severity;
use Illuminate\Database\Seeder;

class SeveritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $severities = [SeverityEnum::Low, SeverityEnum::Medium, SeverityEnum::High];

        foreach ($severities as $name) {
            Severity::firstOrCreate(['name' => $name]);
        }
    }
}
