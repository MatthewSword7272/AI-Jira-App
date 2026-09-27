<?php

namespace App\Http\Controllers;

use App\Enums\RolesEnum;
use App\Models\Severity;
use App\Models\Status;
use App\Models\Ticket;
use Inertia\Inertia;

class WelcomeController extends Controller
{

    public function welcome()
    {
        $status = Status::all()->pluck('name');
        $tickets = Ticket::all();
        $severities = Severity::all()->pluck('name');

        $user = auth()->user();

        if ($user->hasRole(RolesEnum::Guest)) $tickets = $tickets->where('user_id', $user->id);

        $tickets = $tickets->groupBy('status');

        return Inertia::render('dashboard', [
            'tickets' => $status->mapWithKeys(
                fn($s) => [$s => $tickets->get($s, collect())]
            ),
            'statuses' => $status,
            'severities' => $severities
        ]);
    }
}
