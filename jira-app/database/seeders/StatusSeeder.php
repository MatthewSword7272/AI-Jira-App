<?php

namespace Database\Seeders;

use App\Enums\StatusEnum;
use App\Models\Status;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [StatusEnum::Backlog, StatusEnum::Pending, StatusEnum::InProgress, StatusEnum::QA, StatusEnum::Completed];

        foreach ($statuses as $name) {
            Status::firstOrCreate(['name' => $name]);
        }
    }
}
