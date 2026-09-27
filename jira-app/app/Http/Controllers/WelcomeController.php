<?php

namespace App\Http\Controllers;

use App\Models\Severity;
use App\Models\Status;
use App\Models\Ticket;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WelcomeController extends Controller
{

    public function welcome()
    {
        $status = Status::all()->pluck('name');
        $severities = Severity::all()->pluck('name');

        $user = Auth::user();

        $tickets = Ticket::query()->where('created_by', $user->name)->get()->groupBy('status');

        return Inertia::render('dashboard', [
            'tickets' => $status->mapWithKeys(
                fn($s) => [$s => $tickets->get($s, collect())]
            ),
            'statuses' => $status,
            'severities' => $severities
        ]);
    }
}
